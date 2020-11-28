module.exports = {
    getYears(correctYear){
        let thisYear = new Date().getFullYear();
        let dist = thisYear - correctYear;
        let take = 4 - dist > 0 ? 4 - dist: 0;
        var pos = Math.floor(Math.random() * (4 - take));     // returns a random integer from 0 to 9
        pos = 3 - pos 
        years = []
        for (let i = 0; i < 4; i++) {
            years.push(correctYear + i -pos)
        }
        return years;
    }
}