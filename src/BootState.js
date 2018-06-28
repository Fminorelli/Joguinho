'use strict'

class BootState extends Phaser.State {

    preload() {
        this.game.load.image('sky', 'assets/background1.png')
        //this.game.load.image('plane1', 'assets/airplane1.png')
        this.game.load.audio('fundo','assets/back.mp3')
        this.game.load.audio('coleta','assets/coleta.mp3')
        this.game.load.audio('pulo','assets/pulo.mp3')
        this.game.load.image('shot', 'assets/shot.png')
        this.game.load.image('wall', 'assets/wall.png')
        this.game.load.image('fog', 'assets/fog.png')
        this.game.load.image('saw', 'assets/saw.png')
        this.game.load.image('smoke', 'assets/smoke.png')
        this.game.load.image('title', 'assets/title.png')
        this.game.load.image('vida', 'assets/vida.png')
        this.game.load.image('nextlevel', 'assets/nextlevel.png')
        this.game.load.image('lava', 'assets/lava.png')
        this.game.load.spritesheet('vstick_button', 'assets/button_action.png', 50, 50)
        this.game.load.spritesheet('vstick_dpad', 'assets/button_dpad.png', 105, 50)
        this.game.load.spritesheet('plane1', `assets/mariodude.png`, 21, 35);
        
        this.game.load.spritesheet('enemynuvem', `assets/enemynuvem.png`, 28, 38);
        this.game.load.spritesheet('explosion', 'assets/explosion.png', 56, 56)
        this.game.load.spritesheet('droid', 'assets/droid.png', 32, 32)
        this.game.load.spritesheet('coin', 'assets/coins2.png',16 , 17)
        this.game.load.spritesheet('planta', 'assets/planta.png',18 , 18)
        this.game.load.spritesheet('tartaruga', 'assets/tartaruga.png',18 , 16) 

        // map
        this.game.load.tilemap('level1', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level2', 'assets/level2.json', null, Phaser.Tilemap.TILED_JSON)
        this.game.load.tilemap('level3', 'assets/level3.json', null, Phaser.Tilemap.TILED_JSON)
        this.game.load.image('mario','assets/tiles1.png');
    }

    create() {
       
        // this.state.start('Title')
        this.state.start('Game')
    }
}