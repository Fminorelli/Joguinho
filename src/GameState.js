'use strict'
var music
var coleta
var pulo
class GameState extends BaseState {

    create() {

        console.log('GameState.create')
        this.game.physics.startSystem(Phaser.Physics.ARCADE)
          this.game.physics.arcade.gravity.y = config.GRAVITY 
        let skyWidth = this.game.cache.getImage('sky').width
        let skyHeight = this.game.cache.getImage('sky').height
        this.sky = this.game.add.tileSprite(
            0, 0, skyWidth, skyHeight, 'sky')
        this.sky.scale.x = this.game.width / this.sky.width
        this.sky.scale.y = this.game.height / this.sky.height
        this.sky.fixedToCamera = true

        this.fog = this.game.add.tileSprite(
            0, 0, this.game.width, this.game.height, 'fog')
        this.fog.tileScale.setTo(7, 7)
        this.fog.alpha = 0.4
        this.fog.fixedToCamera = true

        this.createTileMap()
        this.createExplosions()

        this.player1 = new Player(this.game, 30, 80,
            'plane1', 0xff0000, this.createBullets(), {
                left: Phaser.Keyboard.LEFT,
                right: Phaser.Keyboard.RIGHT,
                up: Phaser.Keyboard.UP,
                down: Phaser.Keyboard.DOWN,
                fire: Phaser.Keyboard.UP//L
            })
        this.game.add.existing(this.player1)
        this.game.camera.follow(this.player1, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1); // smooth        
        
        let vpad = new VirtualGamepad(this.game)
                    this.game.add.existing(vpad)
                    
                    let jumpButton = vpad.addActionButton(
                        this.game.width-100, this.game.height-50, 'vstick_button',() => this.player1.jump())

                      
                        let dpadButton = vpad.addDPadButton(100, this.game.height - 50, 'vstick_dpad', {
                            leftPressed: () => this.player1.keys.left.isDown = true,
                            leftReleased: () => this.player1.keys.left.isDown = false,
                            rightPressed: () => this.player1.keys.right.isDown = true,
                            rightReleased: () => this.player1.keys.right.isDown = false
                        })



                        
        this.hud = {
            text1: this.createText(this.game.width * 1 / 9, 50, 'PLAYER 1: 20'),
            text2: this.createText(this.game.width * 8 / 9, 50, 'Score: 0')
            //fps: createHealthText(game.width*6/9, 50, 'FPS'),
        }
        this.updateHud()

        let fps = new FramesPerSecond(this.game, this.game.width / 2, 50)
        this.game.add.existing(fps)

        let fullScreenButton = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE)
        fullScreenButton.onDown.add(this.toggleFullScreen, this)

        //game.time.advancedTiming = true;
        this.initFullScreenButtons()
        pulo=this.game.add.audio('pulo')
        coleta=this.game.add.audio('coleta')
    }

    loadFile() {
        let text = this.game.cache.getText('map1');
        return text.split('\n');
    }

    createTileMap() {
        // TODO implementar leitura do arquivo de tilemap e objetos
        this.map = this.game.add.tilemap(`level${config.LEVEL}`)
        this.map.addTilesetImage('mario')

        this.mapLayer = this.map.createLayer('Tiles Layer 1')
        this.map.setCollisionBetween(849, 1230, true, 'Tiles Layer 1')
        this.map.setCollisionBetween(24, 35, true, 'Tiles Layer 1')
        this.map.setCollisionBetween(78, 89, true, 'Tiles Layer 1')
        this.map.setCollisionBetween(132, 143, true, 'Tiles Layer 1')
        this.map.setCollisionBetween(186, 197, true, 'Tiles Layer 1')
        this.map.setCollisionBetween(240, 255, true, 'Tiles Layer 1')
        this.map.setCollisionBetween(294, 305, true, 'Tiles Layer 1')
        this.map.setCollisionBetween(393,393, true, 'Tiles Layer 1')
        this.map.setCollisionBetween(361,363, true, 'Tiles Layer 1')
        this.map.setCollisionBetween(361,368, true, 'Tiles Layer 1')
        this.map.setCollisionBetween(20,22, true, 'Tiles Layer 1')
        this.map.setCollisionBetween(74,76, true, 'Tiles Layer 1')
        this.map.setCollisionBetween(128,130, true, 'Tiles Layer 1')
        this.map.setCollisionBetween(580,582, true, 'Tiles Layer 1')
         this.map.setCollisionBetween(463,465, true, 'Tiles Layer 1')
         this.map.setCollisionBetween(252,253, true, 'Tiles Layer 1')
         this.map.setCollisionBetween(306,307, true, 'Tiles Layer 1')
         this.map.setCollisionBetween(518,518, true, 'Tiles Layer 1')
         this.map.setCollisionBetween(442,443, true, 'Tiles Layer 1')
         this.map.setCollisionBetween(636,636, true, 'Tiles Layer 1')
         this.map.setCollisionBetween(690,690, true, 'Tiles Layer 1')
         this.map.setCollisionBetween(744,744, true, 'Tiles Layer 1')


        this.map.setTileIndexCallback(29, this.hitSpikes, this)

        this.obstacles = this.game.add.group()
        this.coins = this.game.add.group()
        this.vidas = this.game.add.group()

        if (config.LEVEL == 1) {

        music=this.game.add.audio('fundo')
        music.play()
            this.map.createFromObjects('Object Layer 1', 335, 'coin', 0, true, true, this.coins,Coin)
            this.map.createFromObjects('Object Layer 1', 1357, 'vida', 0, true, true, this.vidas,Vida)
            
                       
            this.map.createFromObjects('Enemy Layer 1', 1370, 'tartaruga', 0, true, true, this.obstacles,Tartaruga)
            this.map.createFromObjects('Enemy Layer 1', 1365, 'enemynuvem', 0, true, true, this.obstacles,Nuvem)
             
            //this.map.createFromObjects('Enemy Layer 1', 771, 'planta', 0, true, true, this.obstacles)
            
        } else if (config.LEVEL == 2) {
            this.map.createFromObjects('Object Layer 1', 1351, 'coin', 0, true, true, this.coins,Coin)
            this.map.createFromObjects('Object Layer 1', 1357, 'vida', 0, true, true, this.vidas,Vida)
            
            this.map.createFromObjects('Enemy Layer 1', 1370, 'tartaruga', 0, true, true, this.obstacles,Tartaruga)
        }

         else if (config.LEVEL == 3) {
            this.map.createFromObjects('Object Layer 1', 1351, 'coin', 0, true, true, this.coins,Coin)
            this.map.createFromObjects('Object Layer 1', 1357, 'vida', 0, true, true, this.vidas,Vida)
            
            this.map.createFromObjects('Enemy Layer 1', 1370, 'tartaruga', 0, true, true, this.obstacles,Tartaruga)
            this.map.createFromObjects('Enemy Layer 1', 1365, 'enemynuvem', 0, true, true, this.obstacles,Nuvem)
             
        }
        this.map.setTileIndexCallback(829, this.hitSpikes, this)
         this.map.setTileIndexCallback(463, this.loadNextLevel, this)
         this.map.setTileIndexCallback(464, this.loadNextLevel, this)
         this.map.setTileIndexCallback(465, this.loadNextLevel, this)
         this.map.setTileIndexCallback(518, this.loadNextLevel, this)
        this.map.setTileIndexCallback(555, this.hitSpikes, this)
        this.map.setTileIndexCallback(711, this.hitSpikes, this)
        this.map.setTileIndexCallback(10, this.gg, this)
        this.map.setTileIndexCallback(9, this.gg, this)
        this.map.setTileIndexCallback(826, this.hitSpikes, this)

        this.mapLayer.resizeWorld()
    }

    hitSpikes(player, item) {
        player.health += -1;
        if(player.health==0)
            this.gg()
        this.updateHud();
    }

    gg(){

        if(this.player1.health==0){
            music.stop()
            config.LEVEL=1
        }
        this.updateHud();
          this.game.state.restart()


    }

    spawnSaw(x, y, type) {
        let saw = new Saw(this.game, x, y, 'saw', type)
        this.obstacles.add(saw)
    }

    createSaw(x, y, type) {
        this.game.time.events.repeat(Phaser.Timer.SECOND * 0.5, 7, this.spawnSaw, this, x, y, type);
    }

    createBullets() {
        let bullets = this.game.add.group()
        bullets.enableBody = true
        bullets.physicsBodyType = Phaser.Physics.ARCADE
        bullets.createMultiple(10, 'shot')
        bullets.setAll('anchor.x', 0.5)
        bullets.setAll('anchor.y', 0.5)
        return bullets
    }

    createExplosions() {
        // cria pool de explosoes
        this.explosions = this.game.add.group()
        this.explosions.createMultiple(30, 'explosion')
        this.explosions.forEach(function (exp) {
            let anim = exp.animations.add('full', null, 60, false) // null -> array of frames
            exp.scale.setTo(0.5, 0.5)
            exp.anchor.setTo(0.5, 0.5)
            anim.onComplete.add(() => exp.kill())
        })
    }

    createExplosion(x, y) {
        let exp = this.explosions.getFirstExists(false)
        exp.reset(x, y)
        exp.animations.play('full')
    }

    toggleFullScreen() {
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
        if (this.game.scale.isFullScreen) {
            this.game.scale.stopFullScreen()
        } else {
            this.game.scale.startFullScreen(false)
        }
    }

    updateBullets(bullets) {
        bullets.forEach(function (bullet) {
            this.game.world.wrap(bullet, 0, true)
        }, this)
    }

    update() {
        //    hud.fps.text = `FPS ${game.time.fps}`
        this.sky.tilePosition.x += 0.5
        this.fog.tilePosition.x += 0.3

        //moveAndStop(player1)
        this.updateBullets(this.player1.bullets)

        // colisoes com mapa
        this.game.physics.arcade.collide(this.player1, this.mapLayer);
        this.game.physics.arcade.collide(this.player1, this.obstacles,this.hitPlayer);
         this.game.physics.arcade.overlap(this.player1, this.coins, this.coletamoeda, null, this);
         this.game.physics.arcade.overlap(this.player1, this.vidas, this.coletavida, null, this);
         this.updateHud()
         if (!this.player1.alive) {
            this.gg()
         }

        // colisao com serras
       // this.game.physics.arcade.collide(this.player1, this.obstacles, this.hitObstacle, null, this)

       
    }

    coletamoeda(player, item) {
        player.score += 1;
        coleta.play()
        item.kill();
        this.updateHud();
    }

    coletavida(player, item) {
        player.health += 1;
        coleta.play()
        item.kill();
        this.updateHud();
    }


    killBullet(bullet, wall) {
        //wall.kill()
        bullet.kill()
        this.createExplosion(bullet.x, bullet.y)
    }

    hitObstacle(player, obstacle) {
        if (player.alive) {
            player.damage(1)
            if (!player.alive)
                this.game.camera.follow(null)

            //obstacle.onHit(5)
            //this.loadNextLevel()            

            this.updateHud()
            this.game.camera.shake(0.01, 200);

            // empurra jogador na direcao oposta a da colisao
            let forceDirection = this.game.physics.arcade.angleBetween(obstacle, player)
            this.game.physics.arcade.velocityFromRotation(forceDirection, 600, player.body.velocity)
        }
    }
    getCoin(player,coin){
        player.health+=1
           this.updateHud()
            }
    
    loadNextLevel() {
        config.LEVEL++
        if (config.LEVEL > 3) config.LEVEL = 1

        this.game.state.restart()
    }

    hitPlayer(player,obstacle) {
         if (player.alive) {
            player.damage(1)
            //this.updateHud()
        }


    }

    updateHud() {
        this.hud.text1.text = `Vidas: ${this.player1.health}`
        this.hud.text2.text = `Score: ${this.player1.score}`
    }

    render() {
        //obstacles.forEach(function(obj) { game.debug.body(obj) })
        //this.game.debug.body(this.player1)
        //game.debug.body(player2)
    }
}