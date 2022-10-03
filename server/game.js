const FRAME_RATE = 60;
const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 576;

const gravity = 2;
const attackCoooldown = 2;

module.exports = {
    initGame,
    gameLoop,
    FRAME_RATE
}

function initGame(){
    const state = createGameState();
    return state;
}

function createGameState(){
	return{
        players:[
		{
			position:{
                x: 200,
			    y: 50,
            },
            velocity:{
                x:0,
                y:0,
            },
            attackBox:{
                position:{
                    x:0,
                    y:0,
                },
                offset:{
                    x:0,
                    y:0,
                },
                width: 200,
                height: 150,
            },
            width: 50,
            height: 150,
            pressA: false,
            pressD: false,
            shouldJump: false,
            shouldAttack: false,
            attackElapsed: 500,
            health: 100,
		},
		{
			position:{
                x: 500,
			    y: 50,
            },
            velocity:{
                x:0,
                y:0,
            },
            attackBox:{
                position:{
                    x:0,
                    y:0
                },
                offset:{
                    x:+150,
                    y:0,
                },
                width: 200,
                height: 150,
            },
            width: 50,
            height: 150,
            pressA: false,
            pressD: false,
            shouldJump: false,
            shouldAttack: false,
            attackElapsed: 500,
            health: 100,
		}
    ],
    bg:[{
        dx: -200,
		dy: -200,
		maxDx: 400,
		maxDy: 400,
    },
    {
        dx: -50,
        dy: -50,
        maxDx: 100,
        maxDy: 100,
    },
    {
        dx: -25,
		dy: -25,
		maxDx: 50,
		maxDy: 50,
    }]
    }
}

function RectCollision(rectangle1, rectangle2){
        return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width&&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height ? true : false)
}

function gameLoop(state){

    const playerOne = state.players[0];
    const playerTwo = state.players[1];

    if(playerOne.health <= 0){
        return 2;
    }
    if(playerTwo.health <= 0){
        return 1;
    }

    if(!state){
        return;
    }

    for(player in state.players){
        state.players[player].velocity.x = 0;

        if(state.players[player].pressA == true && state.players[player].pressD == true){
            state.players[player].velocity.x = 0;
        }
        else if(state.players[player].pressA == true){
            state.players[player].velocity.x = -10;
        }
        else if(state.players[player].pressD == true){
            state.players[player].velocity.x = +10;
        }  

        state.players[player].position.x += state.players[player].velocity.x;
        state.players[player].position.y += state.players[player].velocity.y;

        state.players[player].attackBox.position.x = state.players[player].position.x - state.players[player].attackBox.offset.x;
		state.players[player].attackBox.position.y = state.players[player].position.y - state.players[player].attackBox.offset.y;

        if(state.players[player].position.y + state.players[player].height + state.players[player].velocity.y >= CANVAS_HEIGHT - 60 ){
			state.players[player].velocity.y = 0;
		} else {
			state.players[player].velocity.y += gravity;
            state.players[player].shouldJump = false;
		}
        
        if(state.players[player].shouldJump === true){
            state.players[player].shouldJump = false;
            state.players[player].velocity.y = -30;
        }

        if(state.players[player].attackElapsed < attackCoooldown){
            state.players[player].shouldAttack = false;
        }

        if(state.players[player].shouldAttack === true){
            if(player == 0){
                if(RectCollision(state.players[0], state.players[1])){
                    state.players[1].health -= 20;
                    console.log(state.players[1].health)
                }
            }
            state.players[player].attackElapsed = 0;
        }
        state.players[player].attackElapsed++;

    }

    var c = 0;
    var velx = (playerOne.velocity.x + playerTwo.velocity.x)/4;
	var vely = (playerOne.velocity.y + playerTwo.velocity.y)/10;

    state.bg.map( arrImg =>{
        if(c < 3){
            velx /=2;
        }else if(c==3){
            velx = 0;
            vely = 0;
        }
        c++;

        if(velx >= 0 && arrImg.dx < 0){
            arrImg.dx += velx;
        }else if(velx < 0 && arrImg.dx > -arrImg.maxDx){
            arrImg.dx += velx;
        }

        if(vely >= 0 && arrImg.dy < 0){
            arrImg.dy -= vely;
        }else if(vely < 0 && arrImg.dy < -arrImg.maxDy - vely){
            arrImg.dy -= vely;
        }
    });

    return false;
}