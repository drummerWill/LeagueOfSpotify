Vue.config.devtools = true;

var app = new Vue({
    el: '#app',
    data () {
      return {
        info: null,
        questions: [],
        currentQuestion: 0,
        question: {name:"", options: []},
        valorant: [],
      }
    },
    mounted () {
      axios.get('/usertop', {params: {user:localStorage.getItem('user')}})
        .then(response => {
            this.info = response.data.dates
            this.questions = this.info
            // console.log(this.questions)
            this.question = this.questions[this.currentQuestion]

        });
        axios.get('/compare', {params: {user:localStorage.getItem('user')}})
        .then(response => {
          this.valorant = response.data;
        });
    },
    methods:{
      answer(ans){
        let correct = ans == this.question.correctYear;
        if (correct) alert("Poggers!");
        else alert("wrong get good kid");
        this.currentQuestion++;
        this.question = this.questions[this.currentQuestion]
      }
    }
  })
