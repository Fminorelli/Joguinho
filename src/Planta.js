class Planta extends Phaser.Sprite {
    constructor(game, x, y, img) {
        super(game, x, y, img)
        this.game.physics.arcade.enable(this);
        this.body.allowGravity = false
        
        this.animations.add('morde', [0, 770, , 4, 6, 7], 10, true)       
        this.animations.play('spin')
    }

    onHit(damage) {
       //this.kill()
    }
}