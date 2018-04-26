class Laser extends Phaser.Sprite {
    constructor(game, x, y, img, type) {
        super(game, x, y, img)
        this.scale.setTo(1.5, 1.5)
        this.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this)

        this.body.setSize(50, 75, 0, 10)
        this.body.isCircle = false
        this.health = 3

        var left = 0
        var up = 0
        var right = game.width
        var down = game.height
        var hDelay = game.width / (config.SAW_VELOCITY / 1000)
        var vDelay = game.height / (config.SAW_VELOCITY / 1000)
        var e = game.add.tween(this).to({ y: down }, vDelay).start()
        e.onComplete.add(function () {
            this.kill();
        }, this);

        this.weapon = game.add.weapon(30, 'beam');
     
        //  The bullet will be automatically killed when it leaves the world bounds
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

        //  The speed at which the bullet is fired
        this.weapon.bulletSpeed = -1000;

        //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
        this.weapon.fireRate = 45;
        this.weapon.trackSprite(this, 0, 50,false);
        this.weapon.bulletAngleOffset = 180;
        //this.weapon.bulletAngleVariance=180
        this.weapon.autofire = true;
        this.weapon.bullets.enableBody = true
        this.weapon.bullets.physicsBodyType = Phaser.Physics.ARCADE


     
    }
 
 hitp1(player,bullet){
    player1Hit=1
    bullet.kill()


   }

   hitp2(player,bullet){
    player2Hit=1
    bullet.kill()
   }


        update(){
             game.physics.arcade.collide(player1, this.weapon.bullets,this.hitp1)
             game.physics.arcade.collide(player2, this.weapon.bullets,this.hitp2)
        }
   
  

}