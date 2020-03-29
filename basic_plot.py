#! /usr/bin/python
import matplotlib.pyplot as plt
from matplotlib.widgets import MultiCursor
import datetime as dt
import json
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
      discovered_cases.append(obj['totale_casi'] - last_cases)
      recovered_cases.append(obj['dimessi_guariti']-last_recovered)
      tested.append(obj['tamponi']-last_tested)
      death.append(obj['deceduti']-last_death)
      positive_perct.append(discovered_cases[-1]/tested[-1])
      lethality.append(obj['deceduti']/obj['tamponi'])
      lethality_on_pos.append(obj['deceduti']/obj['totale_casi'])
      last_cases = obj['totale_casi']
      last_tested = obj['tamponi']
      last_recovered = obj['dimessi_guariti']
      last_death = obj['deceduti']

today = dt.datetime.now()

fig, axs = plt.subplots(3, 2)
fig.suptitle('COVID19 Italian situation, last update '+today.strftime("%d-%m-%Y , %H:%M"), fontsize=16)
fig.set_size_inches(18.5, 10.5)
axs[0,0].plot(dates,tested,'-oc')
axs[0,0].set_title("Daily tested people")
axs[0, 1].plot(dates,discovered_cases,'-ob')
axs[0,1].set_title("Daily new cases")
axs[1,0].plot(dates,death,'-or')
axs[1,0].set_title("Daily Death Cases")
axs[1,1].plot(dates,recovered_cases,'-og')
axs[1,1].set_title("Daily recovered people")
axs[2,0].plot(dates,positive_perct,'-om')
axs[2,0].set_title("Percentage of positive people")
axs[2,1].plot(dates,lethality,'-ok',lethality_on_pos,'-or')
axs[2,1].set_title("Lethality")
# multi = MultiCursor(fig.canvas,axs.flatten(),horizOn=f, color='r', lw=1)
plt.savefig('data.svg', format='svg', dpi=1200)
plt.show()