class Vuado extends Phaser.Sprite {
    constructor(game, x, y, img, type) {
        super(game, x, y, img)
        this.scale.setTo(1.5,1.5)
        this.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this)

        this.body.setSize(48, 36, 3,12)
        this.body.isCircle = true
        this.health=1
        
        var left = 0
        var up  = 0
        var right = game.width
        var down  = game.height
        var hDelay = game.width/(config.SAW_VELOCITY/1000)
        var vDelay = game.height / (config.SAW_VELOCITY / 1000)
        var e = game.add.tween(this).to({ y: down }, vDelay-2000).start()
        e.onComplete.add(function () {
            this.kill();
        }, this);

       
    }        
}