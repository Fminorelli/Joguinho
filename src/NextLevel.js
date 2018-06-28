class NextLevel extends Phaser.Sprite {
    constructor(game, x, y, img) {
        super(game, x, y, img)
        this.game.physics.arcade.enable(this);
        this.body.allowGravity = false
        
       
    }

    onHit(damage) {
        this.kill()
    }
}