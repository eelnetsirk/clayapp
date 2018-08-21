let express = require("express")
let app = express()
app.get("/", function(req, res){
  res.sendFile(__dirname + "/public/index.html")
})

app.listen(8080,function(){
  console.log("Listening on port 8080!")
})
