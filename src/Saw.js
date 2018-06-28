
class Saw extends Phaser.Sprite {
    constructor(game, x, y, img, type) {
        super(game, x, y, img)
        this.scale.setTo(1.5,1.5)
        this.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this)

        this.body.setSize(32, 32, 16, 16)
        this.body.isCircle = true
        
        var left = 0
        var up  = 0
        var right = game.width
        var down  = game.height
        var hDelay = game.width/(config.SAW_VELOCITY/1000)
        var vDelay = game.height/(config.SAW_VELOCITY/1000)
        
        this.weapon = this.game.add.weapon(30, 'shot')
        this.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS
        this.weapon.bulletSpeed = 600;
        //this.weapon.enableBody = true
        this.weapon.fireRate = 100;
        this.weapon.trackSprite(this, 0, 0, true);

        this.body.angularVelocity = 300
    }      
    
    onHit(damage) {
        this.kill()
    }

    update() {
        this.weapon.fire()
    }
}