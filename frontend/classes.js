class key{
	constructor(){
		this.pressed = false;
	}
}

class Sprite{
	constructor({position, imgSrc, scale = 1, animationFrames, framesHold = 25, offset = {x:0, y:0}}){
		this.position = position;
		this.image = new Image();
		this.image.src = imgSrc;

		this.scale = scale;
		this.offset = offset;

		this.animationFrames = animationFrames;

		this.currentFrame = 0;
		this.framesElapsed = 0;
		this.framesHold = framesHold;

		this.state;
	}

	draw(){
		Context.drawImage(
			this.image,
			this.currentFrame * (this.image.width / this.animationFrames),
			0,
			this.image.width / this.animationFrames,
			this.image.height,
			this.position.x - this.offset.x,
			this.position.y - this.offset.y,
			(this.image.width / this.animationFrames) * this.scale,
			this.image.height * this.scale);
	}

	update(){
		this.draw();
		this.animate();
	}

	animate(){
		if(this.framesElapsed > this.framesHold){
			if(this.currentFrame < this.animationFrames - 1){
				this.currentFrame++
			}else{
				this.currentFrame = 0;
			}
			this.framesElapsed = 0;
		}else{
			this.framesElapsed++;
		}
	}
}

class Background{
	constructor({imgSrc}){
		this.imgArr = imgSrc;
	}

	draw(){
		this.imgArr.map( arrImg =>{
			var image = new Image();
			image.src = arrImg.src;
			image.style.objectFit = 'cover';
			Context.drawImage(image, arrImg.dx , arrImg.dy, canvas.width + arrImg.maxDx*2, canvas.height + arrImg.maxDx*2);
		});
	}

	update(){
		this.draw();
	}
}

class Fighter extends Sprite{
	constructor({position = {x:0, y:0}, velocity = { x: 0, y: 0}, offset = {x:0, y:0}, hitBoxOffset = {x:0, y:0}, scale =1, imgSrc, animationFrames, framesHold = 25, sprites}){

		super({position, imgSrc, scale, offset, animationFrames, framesHold});
		this.sprites = sprites;

		this.position = position;
		this.velocity = velocity;

		this.width = 50;
		this.height = 150;

		this.lastKeyX;

		this.attackBox = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			offset : hitBoxOffset,
			width: 200,
			height: this.height,
			isShown: false
		}

		this.isAttacking = false;
		this.isAttackingAnim = false;

		this.health = 100;

		this.hitBoxShown = false;

		for(const sprite in sprites){
			sprites[sprite].image = new Image();
			sprites[sprite].image.src = sprites[sprite].imgSrc; 
		}
	}

	update(){
		if(this.hitBoxShown){
			Context.fillStyle = "blue";
			Context.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);

			Context.fillStyle = "red";
			Context.fillRect(this.position.x, this.position.y, this.width, this.height);
		}
		
		this.switchSprite();
		this.draw();
		this.animate();
	}

	attack(){
		if(!this.isAttacking){
			this.isAttacking = true;
			setTimeout(()=>{
				this.isAttacking = false;
			}, 500);

			this.isAttackingAnim = true;
			setTimeout(()=>{
				this.isAttackingAnim = false;
			}, 600);
		}
	}

	switchSprite(){

		if(this.isAttackingAnim == true){
			this.image = this.sprites.attack1.image;
			this.animationFrames = this.sprites.attack1.animationFrames;
			if(this.state != 'attacking1'){
				this.currentFrame = 0;
				this.state = 'attacking1';
			}
			return ;
		}

		if(this.velocity.y < 0){
			this.image = this.sprites.jump.image;
			this.animationFrames = this.sprites.jump.animationFrames;
			if(this.state != 'jumping'){
				this.currentFrame = 0;
				this.state = 'jumping';
			}
			return ; 
		}

		if(this.velocity.y >0){
			this.image = this.sprites.fall.image;
			this.animationFrames = this.sprites.fall.animationFrames;
			if(this.state != 'falling'){
				this.currentFrame = 0;
				this.state = 'falling';
			}
			return ;
		}

		if(this.velocity.x == 0 && this.velocity.y == 0){
			this.image = this.sprites.idle.image;
			this.animationFrames = this.sprites.idle.animationFrames;
			if(this.state != 'idling'){
				this.currentFrame = 0;
				this.state = 'idling'
			}
			return ; 
		}
		
		if(this.velocity.x > 0 || this.velocity.x < 0){
			this.image = this.sprites.run.image;
			this.animationFrames = this.sprites.run.animationFrames;
			if(this.state != 'running'){
				this.currentFrame = 0;
				this.state = 'running'
			}
			return ; 
		}
		
	}
}