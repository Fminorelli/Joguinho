
class Player extends Phaser.Sprite {
    constructor(game, x, y, img, tint, bullets, keys) {
        super(game, x, y, img)
        this.tint = tint
        this.health = config.PLAYER_HEALTH
        this.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this)
        this.body.drag.set(config.PLAYER_DRAG)
        this.body.maxVelocity.set(config.PLAYER_MAX_VELOCITY)
        this.body.mass = 0.1
        this.body.friction.setTo(0, 0)
        this.body.bounce.setTo(1, 1)
        this.body.setSize(52, 52, 8, 8)
        this.body.isCircle = true
        this.nextFire = 0
        this.score = 0
        this.fire_rate = config.BULLET_FIRE_RATE



        this.cursors = {
            left: game.input.keyboard.addKey(keys.left),
            right: game.input.keyboard.addKey(keys.right),
            up: game.input.keyboard.addKey(keys.up),
            down: game.input.keyboard.addKey(keys.down),
            fire: game.input.keyboard.addKey(keys.fire)
        }

        this.bullets = bullets
         //  Add an emitter for the ship's trail
        this.emitter = game.add.emitter(this.x, this.y +20, 400);
        this.emitter.width = 10;
        this.emitter.makeParticles('rastro');
        this.emitter.setXSpeed(30, -30);
        this.emitter.setYSpeed(200, 180);
        this.emitter.setRotation(50,-50);
        this.emitter.setAlpha(1, 0.01, 800);
        this.emitter.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
        this.emitter.start(false, 5000, 10);
       
    }

    // move e rotaciona, como em Asteroids
    moveAndTurn() {

        if (this.cursors.up.isDown) {
            this.body.velocity.y = -config.PLAYER_ACCELERATION
        }

        else if (this.cursors.left.isDown) {
            this.body.velocity.x = -config.PLAYER_ACCELERATION
        }

        else if (this.cursors.right.isDown) {
            this.body.velocity.x = config.PLAYER_ACCELERATION
        }

        else if (this.cursors.down.isDown) {
            this.body.velocity.y = config.PLAYER_ACCELERATION

        }

        // atravessa bordas da tela (usando phaser built-in)
        this.body.collideWorldBounds = true;
        this.body.bounce.set(0);
        //game.world.wrap(this, 0, true)
    }   
    
    fireBullet() {
        if (!this.alive)
            return;
    
        if (this.cursors.fire.isDown) {
            
            if (this.game.time.time > this.nextFire) {
                tiroSound.play()
                var bullet = this.bullets.getFirstExists(false)
                if (bullet) {
                    bullet.reset(this.x, this.y)
                    bullet.lifespan = config.BULLET_LIFE_SPAN
                    bullet.rotation = this.rotation
                    bullet.body.bounce.setTo(1,1)
                    bullet.body.friction.setTo(0,0)
                    game.physics.arcade.velocityFromRotation(
                        bullet.rotation + game.rnd.realInRange(-config.BULLET_ANGLE_ERROR, config.BULLET_ANGLE_ERROR), 
                        config.BULLET_VELOCITY, bullet.body.velocity
                    )
                    // fire rate
                    this.nextFire = this.game.time.time + this.fire_rate
                }
            }
        }
            
    } 
    
    update() {
        this.moveAndTurn()
        this.fireBullet()
        //this.emitter.emitParticle()

        this.emitter.emitX = this.x;
        this.emitter.emitY = this.y;    
    }
}