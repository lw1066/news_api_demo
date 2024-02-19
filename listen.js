function listen(){
    app.listen(9090, (err) => {
        if(err){
            console.log(err)
        } else {
            console.log("listening on 9090")
        }
    })
}

module.exports = listen;