let fs = require('fs')
let https = require('https')
let path = require('path')
let express = require("express")
let bodyParser = require("body-parser");
let app = express()

const port = 3443

// set ssl certs in place
const httpsOptions = {
	cert : fs.readFileSync(path.join(__dirname, 'server', 'ssl', 'serv.crt')),
	key : fs.readFileSync(path.join(__dirname, 'server','ssl', 'serv.pem')),
	ca : [fs.readFileSync(path.join(__dirname, 'server','ssl',  'intermediate.pem'))]
}

console.log(fs.readFileSync(__dirname + '/server/list.txt').toString().split("\n"))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function(req, res){
  res.sendFile(__dirname + "/client/index.html")
})

app.get("/list", function(req, res) {
  res.sendFile(__dirname + '/list.txt')
})

app.get("/favicon.png", function(req, res){
  res.sendFile(__dirname + '/client/favicon.png')
})

app.get("/clayclublogo.svg", function(req, res){
  res.sendFile(__dirname + '/client/clayclublogo.svg')
})

app.post("/sub", function(req, res) {
  console.log('got sub request')
  console.log(req.body.data)
  let list_of_subscribers = []
  list_of_subscribers = fs.readFileSync(__dirname + '/list.txt').toString().split("\n")

  if (list_of_subscribers.includes(req.body.data)) {
    console.log('this dude is already subscribed')
  } else if (!list_of_subscribers.includes(req.body.data)) {
    list_of_subscribers.push(req.body.data)

    for (var i=list_of_subscribers.length-1; i>=0; i--) {
      if (list_of_subscribers[i] === "") {
        list_of_subscribers.splice(i, 1)
      }
    }
    console.log(list_of_subscribers)
    fs.writeFile(__dirname + '/list.txt', '', function(){console.log('done')})

    for (var i = 0; i < list_of_subscribers.length; i++) {
      fs.appendFile(__dirname + '/list.txt', list_of_subscribers[i] + "\n", function() {})

    }
  }

})
app.post("/unsub", function(req, res) {
  console.log('got an unsub request')
  console.log(req.body.data)
  let list_of_subscribers = []
  list_of_subscribers = fs.readFileSync(__dirname + '/list.txt').toString().split("\n")

  if (list_of_subscribers.includes(req.body.data)) {
    //we have found that the subscriber is in our list so unsubscribe and remove from list
    for (var i=list_of_subscribers.length-1; i>=0; i--) {
      if (list_of_subscribers[i] === req.body.data) {
        list_of_subscribers.splice(i, 1)
      }
    }
    console.log(list_of_subscribers)
    //this line deletes the entire list on the disk!
    fs.writeFile(__dirname + '/list.txt', '', function(){console.log('done')})
    //takes the list and writes to file
    for (var i = 0; i < list_of_subscribers.length; i++) {
      fs.appendFile(__dirname + '/list.txt', list_of_subscribers[i] + "\n", function() {})

    }
  }
})
https.createServer(httpsOptions, app).listen(port,function() {
	console.log('listening on port 3443')
})
