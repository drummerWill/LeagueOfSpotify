module.exports = function(app, con){
    
app.get('/new', function (req, res) {
    con.query("SELECT * FROM testdb.users", function(err, result){
        if (err) throw err;
        console.log(result)
        res.json(JSON.stringify(result))
    }); 
});
}
