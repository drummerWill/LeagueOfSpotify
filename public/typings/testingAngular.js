var app = new Vue({
    el: '#app',
    data () {
      return {
        info: null,
        testboy: null
      }
    },
    mounted () {
      axios
        .get('/userinfo', {params: {user:localStorage.getItem('user')}})
        .then(response => {
            this.info = response.data
            console.log(this.info)
        });
      axios
        .get('/connectToJson')
        .then(response => {
            this.testboy = response.data
            console.log(this.testboy)
        });
    }
  })
