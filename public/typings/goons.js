Vue.config.devtools = true;

var app = new Vue({
    el: '#app',
    data () {
      return {
          goons: []
      }
    },
    mounted () {
        axios.get('/goonlist', {params: {user:localStorage.getItem('user')}})
        .then(response => {
            this.goons = response.data;
            this.loadPlot()
        });
    },
    methods:{
        loadPlot(){
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
                            labelString: 'yAxisProp',
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
                            labelString: 'xAxisProp',
                            fontSize:24
                          },
                        type: 'linear',
                        position: 'bottom'
                    }]
                }
            }
        });
        }
    }
  })
