
class Player extends Phaser.Sprite {
    constructor(game, x, y, img, tint, bullets, keys) {
        super(game, x, y, img)

        game.physics.arcade.enable(this)
        this.health = config.PLAYER_HEALTH
        //this.body.isCircle = true
        this.body.setSize(20, 30, 20, 10)
        this.anchor.setTo(0.5, 0.5)
        this.velocity = 200
        this.score=0

        this.body.gravity.y = 450;
        this.scale.setTo(1.1, 1.1)



        this.body.collideWorldBounds = true
        this.body.allowRotation = false
        this.body.drag.set(config.PLAYER_DRAG)
        this.body.mass = config.MASS
        this.facing = 'right'
        this.animations.add('walk', [1, 0, ], 7, true);

        this.animations.add('stay', [0], 10, true);

        this.flag = true

        this.keys = {
            left: game.input.keyboard.addKey(keys.left),
            right: game.input.keyboard.addKey(keys.right),
            //andarL: game.input.keyboard.addKey(keys.andarL),
            //andarR: game.input.keyboard.addKey(keys.andarR),          
            jump: game.input.keyboard.addKey(keys.jump)
        }



        this.bullets = bullets


    }

    movePerson() {
        if (this.keys.left.isDown) {
            this.facing = 'left'
            this.body.velocity.x = -this.velocity

            if (this.scale.x > 0) {
                this.scale.x *= -1
            }
            this.animations.play('walk', 40)
        }
        else if (this.keys.right.isDown) {
            this.facing = 'right'
            this.body.velocity.x = +this.velocity

            if (this.scale.x < 0) {
                this.scale.x *= -1
            }
            this.animations.play('walk', 40)
        }
        else {

            this.body.velocity.x = 0
            this.animations.play('stay', 0.85)
        }


        if (this.keys.jump.isDown) {
            if (this.body.onFloor) {
                this.body.velocity.y += -500
                 this.animations.play('jump', 20)
            }

        }

    }

    fireBullet() {
        if (!this.alive)
            return;



        var bullet = this.bullets.getFirstExists(false)
        
        if (bullet) {
            bullet.reset(this.x, this.y)
            bullet.lifespan = config.BULLET_LIFE_SPAN
            // bullet.rotation = this.rotation
            bullet.body.enableBody = true
            bullet.body.bounce.setTo(1, 1)
            bullet.body.friction.setTo(0, 0)
            bullet.body.allowGravity = false
            if (this.facing == 'left') {
                this.flag = false
                bullet.scale.x *= -1
                bullet.body.velocity.x -= 200
            } else if (this.facing == 'right' && this.flag == true) {
                //bullet.scale.x *= -1    
                bullet.body.velocity.x += 200
            } else if (this.facing == 'right' && this.flag == false) {
                this.flag = true
                bullet.scale.x *= -1
                bullet.body.velocity.x += 200
            }

        }


    }

    jump() {
        pulo.play()
        if (this.body.onFloor()) {
            console.log('chao:' + this.body.onFloor())
            this.body.velocity.y += -500
        }
        else
            this.body.velocity.y += 0
    }

    update() {
        this.movePerson()
        //console.log('x:' + this.body.x )
        //console.log('y:' + this.body.y )
    }
}