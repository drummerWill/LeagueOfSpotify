Vue.config.devtools = true;
Vue.component('v-select', VueSelect.VueSelect);

var app = new Vue({
    el: '#app',
    data () {
      return {
          goons: [],
          options: [ 'energy', 'valence', 'mode', 'tempo', 'acousticness', 'danceability'],
          xprop: 'energy',
          yprop: 'valence',
          chart: null
      }
    },
    mounted () {
        axios.get('/goonlist', {params: {user:localStorage.getItem('user')}})
        .then(response => {
            this.goons = response.data;
            console.log(this.goons)
            this.loadPlot(this.xprop, this.yprop)
        });
    },
    methods:{
        updateChart(xAxisProp, yAxisProp, chart, fastUpdate = false){
            var daGoons = this.goons
            var myData = this.goons.map(function(goon){
                return {x: goon[xAxisProp], y: goon[yAxisProp]}
            });

            chart.data.datasets = [];
            chart.data.datasets.push({ label: 'Scatter Dataset',
                        data: myData,
                        pointBackgroundColor: '#FFF',
                        pointRadius: 4,});
            chart.options.tooltips = {
                callbacks: {
                  title: function(tooltipItem, data) {
                    return daGoons[tooltipItem[0].index].name;
                },
                  label: function(tooltipItem, data) {
                    return "";
                  },
                },
                backgroundColor: '#000',
                titleFontSize: 16,
                titleFontColor: '#FFF',
                displayColors: false
            },
            chart.options.scales = {
                yAxes:[{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 1
                    },
                    scaleLabel: {
                        display: true,
                        labelString: yAxisProp,
                        fontSize: 24
                      } 
                }],
                xAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 1
                    },
                    scaleLabel: {
                        display: true,
                        labelString: xAxisProp,
                        fontSize:24
                      },
                    type: 'linear',
                    position: 'bottom'
                }]
            }
            if (fastUpdate)
                chart.update(0);
            else
                chart.update();
        },
        setSelectedx(value){
            this.xprop = value
            this.updateChart(this.xprop, this.yprop, this.chart)
        },
        setSelectedy(value){
            this.yprop = value
            this.updateChart(this.xprop, this.yprop, this.chart)

        },

        loadPlot(xprop, yprop){
            var ctx = document.getElementById('myChart');
            ctx.style.backgroundColor = 'black';
            var myData = this.goons.map(function(goon){
                return {x: goon['energy'], y: goon['valence']}
            });
            var daGoons = this.goons
            var scatterChart = new Chart(ctx, {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: 'Scatter Dataset',
                        data: myData,
                        pointBackgroundColor: '#FFF',
                        pointRadius: 4,  
                    }]
                },

            options: {
                legend: {
                    display: false,
                },
                maintainAspectRatio:false,
                tooltips: {
                    callbacks: {
                      title: function(tooltipItem, data) {
                        return daGoons[tooltipItem[0].index].name;

                      },
                      label: function(tooltipItem, data) {
                        return "";
                      },
                    },
                    backgroundColor: '#000',
                    titleFontSize: 16,
                    titleFontColor: 'white',
                    displayColors: false
                },
                scales: {
                    yAxes:[{
                        ticks: {
                            suggestedMin: 0,
                            suggestedMax: 1
                        },
                        scaleLabel: {
                            display: true,
                            labelString: yprop,
                            fontSize: 24
                          } 
                    }],
                    xAxes: [{
                        ticks: {
                            suggestedMin: 0,
                            suggestedMax: 1
                        },
                        scaleLabel: {
                            display: true,
                            labelString: xprop,
                            fontSize:24
                          },
                        type: 'linear',
                        position: 'bottom'
                    }]
                }
            }
        });
        this.chart = scatterChart
        }
    }
  })
