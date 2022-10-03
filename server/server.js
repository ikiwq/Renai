const app = require('express')();
const http = require('http').createServer(app);

const e = require('express');
const {initGame, gameLoop, FRAME_RATE} = require('./game');

const state = {};
const clientRooms = {};

const io = require('socket.io')(http, {
    cors: {
        origins: ['http://localhost:4200']
    }
});

io.on('connection', client => {

    client.on('newGame', handleNewGame);
    client.on('joinGame', handleJoinGame);
    client.on('keydown', handleKeyDown);
    client.on('click', handleClick);
    client.on('keyup', handleKeyUp);

    function handleNewGame() {
        let roomName = makeid(5);
        clientRooms[client.id] = roomName;
        client.emit('gameCode', roomName);
    
        state[roomName] = initGame();

        client.join(roomName);
        client.number = 1;
        client.emit('init', 1);    

        startGameInterval(roomName);
    }

    function handleJoinGame(roomName) {
        const room = io.sockets.adapter.rooms.get(roomName);

        if (room) {
          allUsers = room.sockets;
        }
        
        var playerCounter = 0;
        room.forEach(element => {
            playerCounter++;
        });
    
        if (playerCounter === 0) {
          client.emit('unknownGame');
          return;
        } else if (playerCounter > 1) {
          client.emit('tooManyPlayers');
          return;
        }

        client.join(roomName);
        clientRooms[client.id] = roomName;

        client.number = 2;
        client.emit('init', 2);
    
        
    }

    function handleKeyDown(keyCode){
        const roomName = clientRooms[client.id];
        if(!roomName){
            return ;
        }
        try{
            keyCode = parseInt(keyCode);
            
        }catch(e){
            console.log(e);
            return;
        }

        if(keyCode === 32){
            state[roomName].players[client.number - 1].shouldJump = true;
        }
        if(keyCode === 65){
            state[roomName].players[client.number - 1].pressA = true;
        }
        if(keyCode === 68){
            state[roomName].players[client.number - 1].pressD = true;
        }
    }


    function handleKeyUp(keyCode){
        const roomName = clientRooms[client.id];
        if(!roomName){
            return ;
        }
        try{
            keyCode = parseInt(keyCode);
            
        }catch(e){
            console.log(e);
            return;
        }

        if(keyCode === 65){
            state[roomName].players[client.number - 1].pressA = false;
        }
        if(keyCode === 68){
            state[roomName].players[client.number - 1].pressD = false;    
        }
        
    }

    function handleClick(buttonCode){
        const roomName = clientRooms[client.id];
        if(!roomName){
            return ;
        }
        try{
            buttonCode = parseInt(buttonCode);
            console.log(buttonCode);   
        }catch(e){
            console.log(e);
            return;
        }

        if(buttonCode === 0){
            try{
               state[roomName].players[client.number - 1].shouldAttack = true; 
           }catch(e){
            console.log(e);
           }
            
        }
    }

});

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function startGameInterval(roomName){d
    const intervalId = setInterval(()=> {
        const winner = gameLoop(state[roomName]);
        if(!winner){
            emitGameState(roomName, state[roomName]);
        }else{
            emitGameOver(roomName, winner);
            state[roomName] = null;
            clearInterval(intervalId);
        }
    }, 1000/FRAME_RATE);
}

function emitGameState(roomName, state){
    io.sockets.in(roomName)
        .emit('gameState', JSON.stringify(state));
}

function emitGameOver(roomName, winner){
    io.sockets.in(roomName)
        .emit('gameOver', JSON.stringify({winner}));
}

io.listen(3000);