#! /usr/bin/python
import matplotlib.pyplot as plt
from matplotlib.widgets import MultiCursor
import datetime as dt
import json
import matplotlib.ticker as mtick

dates = []
discovered_cases = []
total_cases = []
recovered_cases = []
tested = []
total_tested =[]
positive_perct = []
death = []
lethality =[]
lethality_on_pos =[]
last_cases = 0
last_recovered = 0
last_tested = 0
last_death = 0
start_time = dt.datetime(2020, 2, 23)
with open('./pcm-dpc-data/dati-json/dpc-covid19-ita-andamento-nazionale.json') as json_file:
    data = json.load(json_file)
    for obj in data:
      date=dt.datetime.strptime(obj['data'],'%Y-%m-%dT%H:%M:%S')-start_time
      dates.append(date.days)
      discovered_cases.append(int(obj['totale_casi']) - last_cases)
      recovered_cases.append(obj['dimessi_guariti']-last_recovered)
      tested.append(obj['tamponi']-last_tested)
      death.append(obj['deceduti']-last_death)
      positive_perct.append(discovered_cases[-1]/tested[-1])
      lethality.append(obj['deceduti']/obj['tamponi'])
      lethality_on_pos.append(obj['deceduti']/int(obj['totale_casi']))
      last_cases = obj['totale_casi']
      last_tested = obj['tamponi']
      last_recovered = obj['dimessi_guariti']
      last_death = obj['deceduti']

today = dt.datetime.now()

fig, axs = plt.subplots(3, 2)
fig.suptitle('COVID19 Italian situation, last update '+today.strftime("%d-%m-%Y , %H:%M"), fontsize=16)
fig.set_size_inches(18.5, 10.5)
axs[0,0].plot(dates,tested,'-oc')
axs[0,0].set_title("Daily Tested Cases")
axs[0,1].plot(dates,death,'-or')
axs[0,1].set_title("Daily Death Cases")
axs[1,0].plot(dates,discovered_cases,'-ob')
axs[1,0].set_title("Daily Positive Cases")
axs[1,1].plot(dates,recovered_cases,'-og')
axs[1,1].set_title("Daily Recovered Cases")
axs[2,0].plot(dates,positive_perct,'-om')
axs[2,0].set_title("Percentage of Positive Cases")
axs[2,0].yaxis.set_major_formatter(mtick.PercentFormatter(xmax=1))
axs[2,1].plot(dates,lethality,'-ok',lethality_on_pos,'-or')
axs[2,1].set_title("Lethality")
axs[2,1].annotate('For Positive Cases', xy=(15, 0.071), xytext=(2, 0.1),
            arrowprops=dict(facecolor='red', shrink=0.01, width=2))
axs[2,1].annotate('For Tested Cases', xy=(19, 0.024), xytext=(22, 0.06),
            arrowprops=dict(facecolor='black', shrink=0.01, width=2))
axs[2,1].yaxis.set_major_formatter(mtick.PercentFormatter(xmax=1))
for plot in axs.flatten():
  plot.set_xlabel("Days starting from 23/02/2020")
plt.subplots_adjust(wspace=0.2, hspace=0.4)
# multi = MultiCursor(fig.canvas,axs.flatten(),horizOn=f, color='r', lw=1)
plt.savefig('data.svg', format='svg', dpi=1200)
plt.show()