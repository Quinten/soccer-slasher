class Level extends Phaser.Scene {

    constructor (config)
    {
        super((config) ? config : { key: 'level' });
        this.nextScene = 'startscreen';
        this.map = undefined;
        this.tiles = undefined;
        this.layer = undefined;
        this.player = undefined;
        this.cursors = undefined;
        this.ball = undefined;
    }

    create()
    {
        this.map = this.make.tilemap({ key: 'map' });
        this.tiles = this.map.addTilesetImage('tiles', 'tiles');
        this.layer = this.map.createStaticLayer(0, this.tiles, 0, 0);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.map.setCollisionBetween(0, 1);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 8, end: 9 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 1, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { start: 11, end: 13 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { start: 4, end: 6 }),
            frameRate: 10,
            repeat: -1
        });

        this.player = this.physics.add.sprite(50, 100, 'player', 1);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setRoundPixels(true);
        this.physics.add.collider(this.player, this.layer);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.ball = this.physics.add.image(256, 256, 'ball');
        this.ball.body.drag.x = 20;
        this.ball.body.drag.y = 20;
        this.ball.body.bounce.x = 1;
        this.ball.body.bounce.y = 1;
        this.physics.add.collider(this.player, this.ball);
        this.physics.add.collider(this.ball, this.layer);

        // override window resize function
        window.onresize = () => {
            this.sys.game.renderer.resize(window.innerWidth, window.innerHeight, 1.0);
            this.resizeField();
        }
        this.resizeField();
    }

    update(time, delta) {
        this.player.body.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-128);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(128);
        }

        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-128);
        } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(128);
        }

        if (this.cursors.left.isDown) {
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.anims.play('right', true);
        } else if (this.cursors.up.isDown) {
            this.player.anims.play('up', true);
        } else if (this.cursors.down.isDown) {
            this.player.anims.play('down', true);
        } else {
            this.player.anims.stop();
        }

        // wrap the player
        if (this.player.body.x > this.map.widthInPixels) {
            this.player.body.x -= this.map.widthInPixels;
        }
        if (this.player.body.x < 0) {
            this.player.body.x += this.map.widthInPixels;
        }
        if (this.player.body.y > this.map.heightInPixels) {
            this.player.body.y -= this.map.heightInPixels;
        }
        if (this.player.body.y < 0) {
            this.player.body.y += this.map.heightInPixels;
        }

        // wrap the ball
        if (this.ball.body.x > this.map.widthInPixels) {
            this.ball.body.x -= this.map.widthInPixels;
        }
        if (this.ball.body.x < 0) {
            this.ball.body.x += this.map.widthInPixels;
        }
        if (this.ball.body.y > this.map.heightInPixels) {
            this.ball.body.y -= this.map.heightInPixels;
        }
        if (this.ball.body.y < 0) {
            this.ball.body.y += this.map.heightInPixels;
        }

        console.log(this.cameras.main.roundPixels);
    }

    resizeField() {
        this.cameras.main.setViewport(0, 0, window.innerWidth, window.innerHeight);
        this.sys.game.config.width = window.innerWidth;
        this.sys.game.config.height = window.innerHeight;
    }
}

export default Level;
