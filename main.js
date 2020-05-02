var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

class Scene {
    constructor(game) {
        this.game = game;
        this.platforms = null
    }

    loadSprites() {
        this.game.load.image('bg', 'assets/bg.jpg');
        this.game.load.image('ground', 'assets/platform.png');
    }

    create() {
        this.game.add.image(400, 300, 'bg');

        this.platforms = this.game.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    }

    playerCollide(player) {
        this.game.physics.add.collider(player.character, this.platforms);
    }
}

class Player {
    
    constructor(game) {
        this.game = game
        this.character = null
        this.attack_timer = 0
        this.key = null
    }

    loadSprites() {}

    create() {
        this.character = this.game.physics.add.sprite(50, 450, this.key);

        this.character.setBounce(0.2);
        this.character.setCollideWorldBounds(true);
    
        this.attachAnims()
    }

    update() {
        if (this.attack_timer > 0) this.attack_timer--;

        if (cursors.space.isDown && this.attack_timer == 0) {
            this.character.setVelocityX(0);

            this.character.anims.play("power", false);
            this.attack_timer = 30;
            var that = this;
            setTimeout(function() {
                var power = that.game.physics.add.sprite(that.character.x+25, that.character.y-25, this.key);
                power.body.allowGravity = false
                power.anims.play('ball', false)
                power.setVelocityX(100);
            }, 300);
        }

        if (keyP.isDown || keyK.isDown) {
            if (this.character.body.touching.down) {
                this.character.setVelocityX(0);
            }

            this.character.anims.play(keyP.isDown ? "punch" : "kick", false);
            this.attack_timer = 15;
        }

        if (this.character.body.touching.down && this.attack_timer == 0)
        {
            if (cursors.down.isDown) {
                this.character.setVelocityX(0);
                this.character.anims.play('down', true);    
            } else if (cursors.left.isDown) {
                this.character.setVelocityX(-160);
                this.character.anims.play('left', true);
            } else if (cursors.right.isDown) {
                this.character.setVelocityX(160);
                this.character.anims.play('right', true);
            } else if (this.attack_timer == 0) {
                this.character.setVelocityX(0);
                this.character.anims.play('turn', true);
            }
        }

        if (cursors.up.isDown && this.character.body.touching.down) {
            this.character.setVelocityY(-330);
            this.character.anims.play('up', false);
        }

    }

    attachAnims() {
        var anims = [
            ['left', 21, 25, 10, -1],
            ['turn', 7, 10, 10, -1],
            ['right', 21, 25, 10, -1],
            ['up', 57, 62, 2, 1], 
            ['down', 63, 63, 10, -1],
            ['punch', 15, 16, 10, 0],
            ['kick', 42, 46, 10, 0],
            ['power', 0, 3, 10, 0],
            ['ball', 28, 29, 10, -1]];

        for (var i in anims) {
            this.game.anims.create({
                key: anims[i][0],
                frames: this.game.anims.generateFrameNames(this.key, { start: anims[i][1], end: anims[i][2] }),
                frameRate:  anims[i][3],
                repeat: anims[i][4]
            });
        }
    }
}

class Ken extends Player {

    constructor(game) {
        super(game)
        this.key = 'ken_1'
    }

    loadSprites() {
        this.game.load.spritesheet(this.key, 'assets/ken.png', { frameWidth: 70, frameHeight: 80 });
    }

}

var scene = null
var players = []
var platforms;
var cursors;
var keyP;
var keyK;

var game = new Phaser.Game(config);


function preload () {
    scene = new Scene(this);

    players.push(new Ken(this));    

    scene.loadSprites()

    for (i in players) {
        players[i].loadSprites()
    }
}

function create ()
{
    cursors = this.input.keyboard.createCursorKeys();
    keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    keyK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);

    scene.create()
    for (i in players) {
        players[i].create()
        scene.playerCollide(players[i])
    }

    //this.physics.add.overlap(player, item, collect, null, this);
}

function update ()
{
    for (i in players) {
        players[i].update()
    }
}
/*function collect (player, iem) {
    item.disableBody(true, true);
}*/
