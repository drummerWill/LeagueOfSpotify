Vue.config.devtools = true;

var app = new Vue({
    el: '#app',
    data () {
      return {
        valorant: [],
      }
    },
    mounted () {
     
        axios.get('/compare', {params: {user:localStorage.getItem('user')}})
        .then(response => {
          this.valorant = response.data;
        });
    },
  })
