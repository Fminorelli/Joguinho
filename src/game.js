'use strict'

/**
 * Exemplo de jogo com miscelanea de elementos:
 * - control de personagem por rotacionar e mover usando arcade physics
 * - dois players PVP
 * - pool e tiros
 * - colisao de tiros e players
 * - taxa de tiros e variancia de angulo
 * - HUD simples
 * - mapa em TXT
 */

const config = {}
config.RES_X = 1280 // resolucao HD
config.RES_Y = 720

config.PLAYER_ACCELERATION  = 600
config.PLAYER_TURN_VELOCITY = 350
config.PLAYER_MAX_VELOCITY  = 250
config.PLAYER_HEALTH        = 5
config.PLAYER_DRAG          = 300

config.BULLET_FIRE_RATE     = 650

config.BULLET_ANGLE_ERROR   = 0.1
config.BULLET_LIFE_SPAN     = 1500
config.BULLET_VELOCITY      = 450

config.SAW_VELOCITY         = 150

var i1 = 50
var i2 = 50
var sky
var fog
var player1
var player2
var hud
var map
var scorep1=0
var scorep2=0
var Espawn

// grupos
var obstacles
var eBullets
var explosions
var row = 0

var gameOver;
var msgFim

var hearts
var bolts
var speeds

var player1Hit = 0
var player2Hit = 0
var fim = 0

var eventH
var eventF
var eventS

var bossCount =0
var dmg=1
var fase=1
var faseCount=1

var music
var hitSound
var lvlSound
var endSound
var tiroSound
var lifeSound
var upgradeSound
var hitp
var morriSound
var faliceuSound
var bossSong
var bf=0
var sadEnd
var mederrubaro

var lf=1
var of=1


var game = new Phaser.Game(config.RES_X, config.RES_Y, Phaser.AUTO, 
    'game-container',
    {   
        preload: preload,
        create: create,
        update: update,
        render: render
    })

function preload() {

    game.load.image('sky', 'assets/starfield.png')
    game.load.image('plane1', 'assets/airplane3.png')
    game.load.image('rastro', 'assets/rastro.png')
    game.load.image('shotp1', 'assets/shotp.png')
    game.load.image('shotp2', 'assets/shotp2.png')

    game.load.image('vuado', 'assets/vuado.png')

    game.load.image('atira', 'assets/atira.png')
    game.load.image('shot', 'assets/shot.png')

    game.load.image('laser', 'assets/laser.png')
    game.load.image('beam', 'assets/beam.png')
    game.load.image('enemyB', 'assets/enemyB.png')

    game.load.image('boss', 'assets/boss.png')
    game.load.image('bossBullet', 'assets/bossBullet.png')
   
    game.load.image('star', 'assets/speed.png')
    game.load.image('heart', 'assets/heart.png')
    game.load.image('bolt', 'assets/bolt.png') 
    
    game.load.audio('fundo','assets/fundo.ogg')
    game.load.audio('hit','assets/aiai.ogg')
    game.load.audio('lvl','assets/lvl.ogg')
    game.load.audio('youlose','assets/youlose.ogg')
    game.load.audio('tiro','assets/tiro.ogg')
    game.load.audio('life','assets/life.ogg')
    game.load.audio('upgrade','assets/upgrade.ogg')
    game.load.audio('hitp','assets/pao.ogg')
    game.load.audio('morri','assets/morri.ogg')
    game.load.audio('faliceu','assets/faliceu.ogg')
    game.load.audio('bossSong','assets/ahh.ogg')
    game.load.audio('sadEnd','assets/sadEnd.ogg')
    game.load.audio('mederrubaro','assets/mederrubaro.ogg')



    game.load.text('map1', 'assets/map2.txt');  // arquivo txt do mapa

    game.load.spritesheet('explosion', 'assets/explosion.png', 56, 56)

}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE)
    
    music=game.add.audio('fundo')
    music.volume-=0.5
    //music.loop=true
    music.play()
    hitSound=game.add.audio('hit')
    hitSound.volume-=0.5
    lvlSound=game.add.audio('lvl')
    lvlSound.volume=+1
    tiroSound=game.add.audio('tiro')
    tiroSound.volume -= 0.9;
    endSound=game.add.audio('youlose')
    lifeSound=game.add.audio('life')
    upgradeSound=game.add.audio('upgrade')
    hitp=game.add.audio('hitp')
    
    morriSound=game.add.audio('morri')
    faliceuSound=game.add.audio('faliceu')
    bossSong=game.add.audio('bossSong')
    bossSong.loop=true
    sadEnd=game.add.audio('sadEnd')
    sadEnd.loop=true
    mederrubaro=game.add.audio('mederrubaro')

    var skyWidth = game.cache.getImage('sky').width
    var skyHeight = game.cache.getImage('sky').height
    sky = game.add.tileSprite(
        0, 0, skyWidth, skyHeight, 'sky')
    sky.scale.x = game.width/sky.width
    sky.scale.y = game.height/sky.height

    obstacles = game.add.group()
    hearts= game.add.group()
    bolts = game.add.group()
    speeds = game.add.group()

    createExplosions()

     Espawn = game.time.events.loop(Phaser.Timer.SECOND * 1, readLine, this);

    eventH=game.time.events.loop(Phaser.Timer.SECOND * game.rnd.integerInRange(1, 10), createHeart, this)
    eventF = game.time.events.loop(Phaser.Timer.SECOND * game.rnd.integerInRange(1, 2), createFire, this)
    eventS = game.time.events.loop(Phaser.Timer.SECOND * game.rnd.integerInRange(1, 2), createSpeed, this)

    player1 = new Player(game, game.width * 2 / 9, game.height * 8 / 9, 
                        'plane1', 0xff0000, createBullets(), {   
            left: Phaser.Keyboard.LEFT,
            right: Phaser.Keyboard.RIGHT,
            up: Phaser.Keyboard.UP,
            down: Phaser.Keyboard.DOWN,
            fire: Phaser.Keyboard.L
        })

    player1.angle=-90
    player2 = new Player(game, game.width*7/9, game.height*8/9, 
                        'plane1', 0x00ff00, createBullets2(), {   
            left: Phaser.Keyboard.A,
            right: Phaser.Keyboard.D,
            up: Phaser.Keyboard.W,
            down: Phaser.Keyboard.S,
            fire: Phaser.Keyboard.G
        })


    player2.angle = -90

    game.add.existing(player1)
    game.add.existing(player2)
 

    hud = {
        text1: createHealthText(game.width*1/9, 50, 'PLAYER 1: 20     SCORE: 0'),
        text2: createHealthText(game.width*8/9, 50, 'PLAYER 2: 20     SCORE: 0')
        //fps: createHealthText(game.width*6/9, 50, 'FPS'),
    }
    updateHud()

    var fps = new FramesPerSecond(game, game.width/2, 50)
    game.add.existing(fps)

    var fullScreenButton = game.input.keyboard.addKey(Phaser.Keyboard.ONE)
    fullScreenButton.onDown.add(toggleFullScreen)
    
    game.time.advancedTiming = true;

    gameOver = game.add.text(game.world.centerX, game.world.centerY, 'GAME OVER!', { font: '84px Arial', fill: '#fff' });
        gameOver.anchor.setTo(0.5, 0.5);
        gameOver.visible = false;
    
    msgFim = game.add.text(game.world.centerX, game.world.centerY, '', { font: '84px Arial', fill: '#fff' });
    msgFim.anchor.setTo(0.5, 0.5);
    msgFim.visible=false

 
    player2.events.onKilled.add(function () {
        player2.emitter.kill()
        var s= game.rnd.integerInRange(1, 2)
        console.log(s)
        if(s==1){
            mederrubaro.play()
        }
        else{
            morriSound.play()
        }
        
    });

    player1.events.onKilled.add(function () {
        player1.emitter.kill()
        var s= game.rnd.integerInRange(1, 2)
        console.log(s)
        if(s==1){
            mederrubaro.play()
        }
        else{
            morriSound.play()
        }
    });

}

function createHeart() {
    
    var down = game.height
    var vDelay = game.height / (config.SAW_VELOCITY / 1000)
    var h = game.add.sprite(game.rnd.integerInRange(0, 1280), 0, 'heart');
    h.lifespan = Phaser.Timer.SECOND * 3
    game.add.tween(h).to({ y: down }, vDelay - 2000).start()
    game.physics.arcade.enable(h)
    hearts.add(h)

}

function createFire() {

    var down = game.height
    var vDelay = game.height / (config.SAW_VELOCITY / 1000)
    var b = game.add.sprite(game.rnd.integerInRange(0, 1280), 0, 'bolt');
    b.lifespan = Phaser.Timer.SECOND * 3
    game.add.tween(b).to({ y: down }, vDelay - 2000).start()
    game.physics.arcade.enable(b)
    bolts.add(b)


}

function createSpeed() {

    var down = game.height
    var vDelay = game.height / (config.SAW_VELOCITY / 1000)
    var s = game.add.sprite(game.rnd.integerInRange(0, 1280), 0, 'star');
    s.lifespan = Phaser.Timer.SECOND * 3
    game.add.tween(s).to({ y: down }, vDelay - 2000).start()
    game.physics.arcade.enable(s)
    speeds.add(s)

}


function loadFile() {
    
    var text = game.cache.getText('map1');
    return text.split('\n');
}

function readLine() {
    var mapa = loadFile();
    
    if (mapa[row] == undefined) {
        fim=1
        //console.log(mapa[row])
        return
    }
    else {
        fim = 0
        var linha = mapa[row]
        for (var col = 0; col < linha.length; col++) {
            // tipo
            var tag = linha[col]
            // parametro
            var param = ''
            if (col + 1 < linha.length)
                param = linha[col + 1]

            if (tag == 'V') {
                spawnVuado(col * 32, 0, param)
            }
            if (tag == 'A') {
                spawnAtira(col * 32, 0, param)
            }
            if (tag == 'L') {
                spawnLaser(col * 32, 0, param)
            }
            if (tag == 'B') {
                bossCount++
                spawnBoss(col * 32, 0, param)
                
            }
        }
        

        faseCount--
        if(faseCount==0){
            row = row + 1
            faseCount=fase
        } 

    }
    //console.log(row)
}


function spawnVuado(x, y, type) {
    var vuado = new Vuado(game, x, y, 'vuado')
    vuado.events.onKilled.add(function () { vuado.destroy() });
    obstacles.add(vuado)	
}

function spawnAtira(x, y, type) {
    var atira = new Atira(game, x, y, 'atira')
    atira.events.onKilled.add(function () {
        autofireoff(atira), atira.destroy()
    });
    obstacles.add(atira)
}

function spawnLaser(x, y, type) {
    var laser = new Laser(game, x, y, 'laser')
    laser.events.onKilled.add(function () {
        autofireoff(laser),laser.destroy()
    });
    obstacles.add(laser)
}

function spawnBoss(x, y, type) {
    var boss = new Boss(game, x, y, 'boss')
    music.pause()
    bossSong.mute=false
    if(bf==0){
    bossSong.play()
    
    bf=1
    }
    boss.events.onKilled.add(function () {
        autofireoff(boss)
        faliceuSound.play()
        boss.destroy()
        bossCount--
        if (bossCount <= 0) {

            levelup()
        }
    });
    obstacles.add(boss)
}
function levelup(){
    game.time.events.add(Phaser.Timer.SECOND *1,musicResume,this) 
    game.time.events.add(Phaser.Timer.SECOND *1,pauseBoss,this) 
    fase=fase+1
    faseCount=fase
    }

function autofireoff(enemy) {
    enemy.weapon.autofire = false;
}

function musicResume(){
music.resume()    
}
function pauseBoss(){
bossSong.mute=true;
}


function createBullets() {
    var bullets = game.add.group()
    bullets.enableBody = true
    bullets.physicsBodyType = Phaser.Physics.ARCADE
    bullets.createMultiple(999, 'shotp1')
    bullets.setAll('anchor.x', 0.5)
    bullets.setAll('anchor.y', 0.5)
    return bullets
}

function createBullets2() {
    var bullets = game.add.group()
    bullets.enableBody = true
    bullets.physicsBodyType = Phaser.Physics.ARCADE
    bullets.createMultiple(999, 'shotp2')
    bullets.setAll('anchor.x', 0.5)
    bullets.setAll('anchor.y', 0.5)
    return bullets
}


function createExplosions() {
    // cria pool de explosoes
    explosions = game.add.group()    
    explosions.createMultiple(30, 'explosion')
    explosions.forEach(function(exp) {
        var anim = exp.animations.add('full', null , 60, false) // null -> array of frames
        exp.scale.setTo(0.5, 0.5)
        exp.anchor.setTo(0.5, 0.5)   
        anim.onComplete.add( () => exp.kill() )    
    })
}

function createExplosion(x, y) {
    var exp = explosions.getFirstExists(false)
    exp.reset(x, y)
    exp.animations.play('full')    
}

function createHealthText(x, y, text) {
    var style = {font: 'bold 16px Arial', fill: 'white'}
    var text = game.add.text(x, y, text, style)
    //text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    text.stroke = '#000000';
    text.strokeThickness = 2;
    text.anchor.setTo(0.5, 0.5)
    return text
}

function toggleFullScreen() {
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
    if (game.scale.isFullScreen) {
        game.scale.stopFullScreen()
    } else {
        game.scale.startFullScreen(false)
    }
}

function updateBullets(bullets) {
    bullets.forEach(function(bullet) {
        //game.world.wra(bullet, 0, true)
    })
}

function update() {
    //    hud.fps.text = `FPS ${game.time.fps}`
    //console.log(player1.body.maxVelocity)
    sky.tilePosition.y += 0.5
    //fog.tilePosition.y += 0.3
 
    //moveAndStop(player1)
    updateBullets(player1.bullets)
    updateBullets(player2.bullets)

    // colisoes entre players e tiros
   
    game.physics.arcade.collide(player1.bullets, obstacles, hitEnemy1)
    game.physics.arcade.collide(player2.bullets, obstacles, hitEnemy2)


    // colisoes com mapa
    game.physics.arcade.collide(player1, map)
    game.physics.arcade.collide(player2, map)
    game.physics.arcade.collide(player1.bullets, map, killBullet)
    game.physics.arcade.collide(player2.bullets, map, killBullet)

    // colisao com serras
    game.physics.arcade.collide(player1, obstacles, hitObstacle)
    game.physics.arcade.collide(player2, obstacles, hitObstacle2)
    

    game.physics.arcade.collide(player1, hearts, hitHeart)
    game.physics.arcade.collide(player2, hearts, hitHeart)
    game.physics.arcade.collide(player1, bolts, hitBolt)
    game.physics.arcade.collide(player2, bolts, hitBolt)
    game.physics.arcade.collide(player1, speeds, hitSpeed)
    game.physics.arcade.collide(player2, speeds, hitSpeed2)

    if(player1Hit==1){
        EnemyHit1()
    }
    if(player2Hit==1){
        EnemyHit2()
    }

    if (!player1.alive && !player2.alive) {
        gameOver.visible = true;
        var fadeInGameOver = game.add.tween(gameOver);
        fadeInGameOver.to({ alpha: 1 }, 10000, Phaser.Easing.Quintic.Out);
        fadeInGameOver.start();
        game.time.events.remove(eventH);
        game.time.events.remove(eventF);
        game.time.events.remove(eventS);
        game.time.events.remove(Espawn);
        if(of==1){
            sadEnd.play()
            of--
        }
        music.mute=true
        bossSong.mute=true
        //sadEnd.play()
    }

    if (fim == 1 && obstacles.length == 0) {
        fimDeFase()
               
    }

    //console.log(obstacles.length)
}

function fimDeFase() {
    var fc=fase-1
    if (scorep1 > scorep2) {
        msgFim.setText('Fim da Fase '+fc+ ' \nPlayer 1 Venceu');
    }
    else if (scorep2 > scorep1) {
        msgFim.setText('Fim da Fase '+fc+ '\nPlayer 2 Venceu');
    }
    else {
        msgFim.setText('Fim da Fase '+fc+ '\nEmpate');
    }
    msgFim.setText

    
    msgFim.visible=true

    game.time.events.add(Phaser.Timer.SECOND *1, someText, this);
    
    row=0
    
    
    if(lf==1){
    lvlSound.play()
    lf--
    }
    bf=0
    
}

function someText(){

    msgFim.setText('')
    msgFim.visible=false
    lf=1
}

function hitSpeed(player, speed) {
    upgradeSound.play()
    var sp = config.PLAYER_MAX_VELOCITY + i1
    player.body.maxVelocity.set(sp)
    i1=i1+25
    speed.kill()
}

function hitSpeed2(player, speed) {
    upgradeSound.play()
    var sp = config.PLAYER_MAX_VELOCITY + i2
    player.body.maxVelocity.set(sp)
    i2=i2+25
    speed.kill()
}


function hitBolt(player, bolt) {
    upgradeSound.play()
    player.fire_rate = player.fire_rate - 100
    bolt.kill()

}
function hitHeart(player, heart) {
    lifeSound.play()
    player.health = player.health+1
    heart.kill()
    updateHud()
}

function killBullet(bullet, wall) {
    //wall.kill()
    bullet.kill()
    createExplosion(bullet.x, bullet.y)
}

function hitObstacle(player, obstacle) {
    if (player.alive) {
        hitSound.play()
        player.damage(dmg)
        obstacle.damage(1)
        player.fire_rate = config.BULLET_FIRE_RATE
        player.body.maxVelocity.set(config.PLAYER_MAX_VELOCITY)
        i1=50
        updateHud()
        game.camera.shake(0.01, 200);
      
    }
}
function hitObstacle2(player, obstacle) {
    if (player.alive) {
        hitSound.play()
        player.damage(dmg)
        obstacle.damage(1)
        player.fire_rate = config.BULLET_FIRE_RATE
        player.body.maxVelocity.set(config.PLAYER_MAX_VELOCITY)
        i2=50
        updateHud()
        game.camera.shake(0.01, 200);
      
    }
}

function hitEnemy1(bullet, obstacle) {
    hitp.play()
    bullet.kill()
    obstacle.damage(1)
    scorep1=scorep1+50
    updateHud()
    createExplosion(bullet.x, bullet.y)
}


function hitEnemy2(bullet, obstacle) {
    hitp.play()
    bullet.kill()
    obstacle.damage(1)
    scorep2=scorep2+50
    updateHud()
    createExplosion(bullet.x, bullet.y)
}
function EnemyHit1() {
    
    player1.damage(dmg)
    hitSound.play()
    player1.fire_rate = config.BULLET_FIRE_RATE
    player1.body.maxVelocity.set(config.PLAYER_MAX_VELOCITY)
    i1=50
    player1Hit = 0
    game.camera.shake(0.01, 200);
    updateHud()
    //console.log("Acertou")

}


function EnemyHit2() {
    
    player2.damage(dmg)
    hitSound.play()
    player2.fire_rate = config.BULLET_FIRE_RATE
    player2.body.maxVelocity.set(config.PLAYER_MAX_VELOCITY)
    i2=50
    game.camera.shake(0.01, 200);
    updateHud()
    player2Hit=0

}


function updateHud() {
    hud.text1.text = `PLAYER 1: ${player1.health}    SCORE:${scorep1}`
    hud.text2.text = `PLAYER 2: ${player2.health}    SCORE:${scorep2}`
}

function render() {

     //obstacles.forEach(function(obj) { game.debug.body(obj) })
    //game.debug.body(player1)
    //game.debug.body(player2)
    //game.debug.body(obstacles)
}