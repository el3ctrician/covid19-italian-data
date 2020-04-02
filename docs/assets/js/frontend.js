const PCM_DPC_URL = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json"
const display_config = {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: '',
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgb(255, 99, 132)",
      data: [],
      fill: false,
    },]
  },
  options: {
    responsive: true,
    maintainAspectRatio : false,
    onResize : function(chart,new_size){
      chart.canvas.parentNode.style.height = '40vh';
      chart.canvas.parentNode.style.width = '80vw';
    },
    title: {
      display: true,
      text: 'Covid-19 Italian data'
    },
    tooltips: {
      mode: 'index',
      intersect: true,
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Day'
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: ''
        }
      }]
    }
  }
};
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
function toggleDisplay() {
  var x = document.getElementsByClassName("lds-ring");
  var y = document.getElementsByClassName("chart-container")
  for (let index = 0; index < x.length; index++) {
      x[index].style.display = "none";
  }
  for (let index = 0; index < y.length; index++) {
      y[index].style.display = "block";
  }
}


function plotter(covid_data){
//prepare all data
  var days = []
  var new_cases = []
  var new_tested = []
  var percentage = []
  var cases_percentage = [0,]
  var new_death =[]
  var new_recovered =[]
  var leth =[]
  var leth_on_pos = []

  var last_cases = 0;
  var last_tested = 0;
  var last_death = 0;
  var last_recovered = 0;

  for(var k in covid_data) {
    var myDate = new Date(covid_data[k].data);
    var parsed_date = myDate.getDate()+" "+(monthNames[myDate.getMonth()]);
    days.push(parsed_date);
    var todays_case = covid_data[k].totale_casi-last_cases
    if (k>0) {
        cases_percentage.push(((todays_case-new_cases.slice(-1)[0])/new_cases.slice(-1)[0])*100)
    }

    new_cases.push(covid_data[k].totale_casi-last_cases);
    new_tested.push(covid_data[k].tamponi - last_tested);
    new_death.push(covid_data[k].deceduti - last_death);
    new_recovered.push(covid_data[k].dimessi_guariti - last_recovered);
    leth.push((new_death.slice(-1)[0]/new_tested.slice(-1)[0])*100);
    leth_on_pos.push((new_death.slice(-1)[0]/new_cases.slice(-1)[0])*100);
    percentage.push((new_cases.slice(-1)[0]/new_tested.slice(-1)[0])*100);
    last_cases = covid_data[k].totale_casi;
    last_tested = covid_data[k].tamponi;
    last_recovered = covid_data[k].dimessi_guariti
    last_death = covid_data[k].deceduti;
}
  var tested_ctx = document.getElementById('chart-tested').getContext('2d');
  var cases_ctx  = document.getElementById('chart-cases').getContext('2d');
  var percentage_ctx = document.getElementById('chart-percentage').getContext('2d');
  var death_ctx = document.getElementById('chart-death').getContext('2d');
  var recovered_ctx = document.getElementById('chart-recovered').getContext('2d');
  var leth_ctx = document.getElementById('chart-lethality').getContext('2d');    
  var cases_percentage_ctx = document.getElementById('chart-cases-percentage').getContext('2d');    
  

  var tested_cfg = $.extend( true, {}, display_config );
  var cases_cfg = $.extend( true, {}, display_config );
  var percentage_cfg = $.extend( true, {}, display_config );
  var death_cfg = $.extend( true, {}, display_config );
  var recovered_cfg = $.extend( true, {}, display_config );
  var lethality_cfg = $.extend( true, {}, display_config );
  var cases_percentage_cfg = $.extend( true, {}, display_config );

  tested_cfg.data.labels = days;
  tested_cfg.data.datasets[0].data=new_tested;
  tested_cfg.data.datasets[0].backgroundColor = "#00bfbf";
  tested_cfg.data.datasets[0].borderColor = "#00bfbf";
  tested_cfg.data.datasets[0].label="Tested Cases";
  tested_cfg.options.scales.yAxes[0].scaleLabel.labelString = "Cases"
  tested_cfg.options.title.text = "Daily Tested cases"

  cases_cfg.data.labels = days;
  cases_cfg.data.datasets[0].data=new_cases;
  cases_cfg.data.datasets[0].backgroundColor = "#0000ff";
  cases_cfg.data.datasets[0].borderColor = "#0000ff";
  cases_cfg.data.datasets[0].label="Positive Cases";
  cases_cfg.options.scales.yAxes[0].scaleLabel.labelString = "Positives"
  cases_cfg.options.title.text = "Daily Positive cases"
  
  percentage_cfg.data.labels = days;
  percentage_cfg.data.datasets[0].data=percentage;
  percentage_cfg.data.datasets[0].backgroundColor = "#dc73dc";
  percentage_cfg.data.datasets[0].borderColor = "#dc73dc";
  percentage_cfg.data.datasets[0].label="Percentage";
  percentage_cfg.options.scales.yAxes[0].scaleLabel.labelString = "Percentage"
  percentage_cfg.options.scales.yAxes[0].ticks =  {
    callback: function(tick) {
      return tick.toString() + '%';
    }
  }
  percentage_cfg.options.title.text = "Percentage of positive cases"

  death_cfg.data.labels = days;
  death_cfg.data.datasets[0].data=new_death;
  death_cfg.data.datasets[0].backgroundColor = "#ff0000";
  death_cfg.data.datasets[0].borderColor = "#ff0000";
  death_cfg.data.datasets[0].label="Death Cases";
  death_cfg.options.scales.yAxes[0].scaleLabel.labelString = "Deaths"
  death_cfg.options.title.text = "Daily Death cases"

  recovered_cfg.data.labels = days;
  recovered_cfg.data.datasets[0].data=new_recovered;
  recovered_cfg.data.datasets[0].backgroundColor = "#008000";
  recovered_cfg.data.datasets[0].borderColor = "#008000";
  recovered_cfg.data.datasets[0].label="Recovered Cases";
  recovered_cfg.options.scales.yAxes[0].scaleLabel.labelString = "Recoveries"
  recovered_cfg.options.title.text = "Daily Recovered cases"

  lethality_cfg.data.labels = days;
  lethality_cfg.data.datasets[0].data=leth;
  lethality_cfg.data.datasets[0].backgroundColor = "#000000";
  lethality_cfg.data.datasets[0].borderColor = "#000000";
  lethality_cfg.data.datasets[0].label="Lethality on tested cases";
  lethality_cfg.options.scales.yAxes[0].scaleLabel.labelString = "Percentage"
  lethality_cfg.options.scales.yAxes[0].ticks =  {
    callback: function(tick) {
      return tick.toString() + '%';
    }
  }
  var new_dataset = {
    data: leth_on_pos,
    backgroundColor: "#800000",
    borderColor : "#800000",
    fill : false,
    label : "Lethality on Positives only"
  }
  lethality_cfg.data.datasets.push(new_dataset);
  lethality_cfg.options.title.text = "Lethality"

  cases_percentage_cfg.data.labels = days;
  cases_percentage_cfg.data.datasets[0].data=cases_percentage;
  cases_percentage_cfg.data.datasets[0].backgroundColor = "#000080";
  cases_percentage_cfg.data.datasets[0].borderColor = "#000080";
  cases_percentage_cfg.data.datasets[0].label="Percentage";
  cases_percentage_cfg.options.scales.yAxes[0].scaleLabel.labelString = "Variation percentage of positive cases "
  cases_percentage_cfg.options.title.text = "Variation percentage"
  cases_percentage_cfg.options.scales.yAxes[0].ticks =  {
    callback: function(tick) {
      return tick.toString() + '%';
    }
  }
  var tested_chart = new Chart(tested_ctx, tested_cfg);
  var cases_chart = new Chart(cases_ctx, cases_cfg);
  var percentage_chart = new Chart(percentage_ctx, percentage_cfg);
  var death_chart = new Chart(death_ctx, death_cfg);
  var recovered_chart = new Chart(recovered_ctx, recovered_cfg);
  var lethality_chart = new Chart(leth_ctx, lethality_cfg);
  var cases_percentage_chart = new Chart(cases_percentage_ctx, cases_percentage_cfg);
}


var xhr = new XMLHttpRequest(); // a new request
xhr.open("GET",PCM_DPC_URL,true);
xhr.onload = function (e) {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      toggleDisplay();
      plotter(JSON.parse(xhr.responseText));
    } else {
      console.error(xhr.statusText);
      console.info("Github seems down, moving to cached data")
      toggleDisplay();
      plotter(latest_data);
    }
  }
};
xhr.onerror = function (e) {
  console.error(xhr.statusText);
};
xhr.send(null);
console.info("waiting for request ...");
