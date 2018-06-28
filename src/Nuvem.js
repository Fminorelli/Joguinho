class Nuvem extends Phaser.Sprite {
    constructor(game, x, y, img) {
        super(game, x, y, img)
        this.game.physics.arcade.enable(this);
        this.body.allowGravity = false
        
          var hDelay = game.width / (config.SAW_VELOCITY / 500)
        this.animations.add('spin', [0, 1, 2, 3, 4, 5], 10, true)        
        this.animations.play('spin')
        game.add.tween(this).to({ y: this.y-100 }, hDelay).to({ y: this.y }, hDelay).start().loop()
    }

    onHit(damage) {
       //this.kill()
    }
}