class Boss extends Phaser.Sprite {
    constructor(game, x, y, img, type) {
        super(game, x, y, img)
        this.scale.setTo(1.5, 1.5)
        this.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this)
        this.x = 640
        
        this.body.setSize(220, 126, 0, 0)
        this.body.isCircle = false
        this.health = 3

        var left = 0
        var up = 0
        var right = game.width
        var down = game.height
        var hDelay = game.width / (config.SAW_VELOCITY / 1000)
        var vDelay = game.height / (config.SAW_VELOCITY / 1000)

        var e = game.add.tween(this).to({ y: 150 }, 200).start()
        e.onComplete.add(function () { this.segundoTween() },this)

       

        this.weapon = game.add.weapon(30, 'bossBullet');
     
        //  The bullet will be automatically killed when it leaves the world bounds
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

        //  The speed at which the bullet is fired
        this.weapon.bulletSpeed = -1000;

        //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
        this.weapon.fireRate = 150;
        this.weapon.trackSprite(this, 0, 50,false);
        this.weapon.bulletAngleOffset = 180;
        //this.weapon.bulletAngleVariance=180
        this.weapon.autofire = true;
        this.weapon.bullets.enableBody = true
        this.weapon.bullets.physicsBodyType = Phaser.Physics.ARCADE
        var w=game.time.events.loop(Phaser.Timer.SECOND *1, this.autofire, this)

     
    }

    segundoTween() {
        this.e = game.add.tween(this)
            .to({ x: this.x + 500, y: this.y }, 3000)
            .to({ x: this.x - 440, y: this.y }, 3000)
            .to({ x: this.x, y: this.y }, 3000)
            .loop(-1)
            .start()

    }

    autofire() {
        if (this.alive && this.weapon.autofire == false) {
            this.weapon.autofire = true;
        }
        else if (this.alive && this.weapon.autofire == true) {
            this.weapon.autofire = false;
        }
    }
 
 hitp1(player,bullet){
    player1Hit=1
    bullet.kill()


   }

   hitp2(player,bullet){
    player2Hit=1
    bullet.kill()
   }


    update() {
        if (!this.alive) {
            game.time.events.remove(w);
            this.weapon.autofire = false;
        }
        console.log(this.health)
             game.physics.arcade.collide(player1, this.weapon.bullets,this.hitp1)
             game.physics.arcade.collide(player2, this.weapon.bullets,this.hitp2)
        }
   
  

}