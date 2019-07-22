var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var redis = require("redis");
var client;
client = redis.createClient(6379, "localhost");
// client.auth("redis_pw");



app.get('/', function (req, res) {
    res.send('<h1>안녕하세요 "/" 경로 입니다.</h1>');
});

var users_ids = {};
var connectids = {};

io.sockets.on('connection', function (socket) {
    
    socket.on('userids', function(id){
        console.log('connection info -> ' + JSON.stringify(id));

        users_ids[id.myid] = socket.id;
        socket.myid = id.myid;

        sendResponse(socket, 'users','OK');

        console.log("userids = " + JSON.stringify(users_ids));

        client.get(id.myid, function(err, val) {
            console.log('>>>>> result : ' + JSON.stringify(val));
            if(val === null || val === '') {
            client.set(id.myid, id.myid);
            }
            else {
            }
            
            });

                socket.on('disconnect', function () {
                    console.log("접속 해제 됨");
                    client.exists(id.myid, function(err, val1){
                        if(val1 != "0"){

                            console.log(val1);
                            client.del(id.myid, function(err, val){
                            });
                        }
                    });
                    delete connectids[id.myid];
                    delete users_ids[id.myid];
                    console.log("삭제 후 connectids: "+JSON.stringify(connectids));
                    console.log("삭제 후 users_ids: "+JSON.stringify(users_ids));


                });
    });
 
    socket.on('message', function (message) {

        console.log(message);
        console.log("상대 아이디 :" + users_ids[message.recepient]);



        if(users_ids[message.recepient]) {

            if(message.command == 'connect'){

                connectids[message.myid] = message.recepient;

                console.log("connect 탐"+JSON.stringify(connectids))

            }else if(connectids[message.recepient] == undefined || connectids[message.recepient] == message.myid){
                console.log("채팅 안하고 있음");
                console.log(connectids[message.recepient]);
                io.sockets.connected[users_ids[message.recepient]].emit('message', message);
                console.log("if 탄거?" + JSON.stringify(message));
                sendResponse(socket, message);
            }else {

                message.coom
                console.log(JSON.stringify(message));
                console.log("채팅 중" + JSON.stringify(connectids));
                sendResponse(socket, message);
            }
        }
    });
    
    
});

    function sendResponse(socket, message) {
        
        socket.emit('response', message);
    }

server.listen(82, function () {
    console.log('listening on *:82');
});