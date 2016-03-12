// BASE SETUP
// =============================================================================
// import modules needed
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var cors = require('cors');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path=require('path');
// configure app
app.use(morgan('dev')); // log requests to the console
// configure body parser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/client-side/app/'))
app.use(express.static(__dirname + '/client-side/'))
var port = 8080; // set our port
//database connection
var mongoose = require('mongoose');
var dbconfig = require('./app/config/db');

//////CONECTION FOR OPENSHIFT 
mongoose.connect(dbconfig.options.uri); // connect to our database
// create our router
var router = express.Router();
require('./app/routes')(router, app, io);
// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);
// Add headers
app.get('/', function(req, res) {
      res.sendfile(__dirname +'/client-side/app/index.html')  
    });

app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

http.listen(port, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Listening on port 8080");
    }
});
var clients = {};
io.sockets.on('connection', function(socket) {
    socket.on('add-user', function(data) {
        clients[data.user_id] = {
            "socket": socket.id
        };
    });
    socket.on('send-job-notification', function(data) {
        if (clients[data.userId]) {
            io.sockets.connected[clients[data.userId].socket].emit("send-job-notification-client", data);
        } else {
        }
    });
    socket.on('send-comment-notification', function(data) {
        var j=0;
        for (var i = 0; i < data.userId.length; i++) {
            if (clients[data.userId[i].id]) {
                j++;
                io.sockets.connected[clients[data.userId[i].id].socket].emit("send-comment-notification-client", data);
            } else {
                console.log("User does not exist: " + data.userId[i].id);
            }
        }
    });
    //Removing the socket on disconnect
    socket.on('disconnect', function() {
        for (var name in clients) {
            if (clients[name].socket === socket.id) {
                delete clients[name];
                break;
            }
        }
    });
});