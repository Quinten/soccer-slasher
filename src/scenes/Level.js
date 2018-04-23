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
        this.enemies = undefined;
        this.spawnpoints = [
            {"x": 2000, "y":2000},
            {"x": 48, "y":2000},
            {"x": 2000, "y":48},
            {"x": 1024, "y":1024},
            {"x": 1536, "y":512},
            {"x": 512, "y":1536}
        ];
        this.updateTime = 0;
        this.flashColor = {r: 186, g: 220, b: 88};
        this.losetext = undefined;
        this.wintext = undefined;
        this.blueEmitter = undefined;
        this.redEmitter = undefined;
        this.blueShards = undefined;
        this.redShards = undefined;
    }

    create()
    {
        this.map = this.make.tilemap({ key: 'map' });
        this.tiles = this.map.addTilesetImage('tiles', 'tiles');
        this.layer = this.map.createStaticLayer(0, this.tiles, 0, 0);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.map.setCollisionBetween(0, 1);

        if (!this.anims.get('left')) {
            this.anims.create({
                key: 'left',
                frames: this.anims.generateFrameNumbers('player', { start: 8, end: 9 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!this.anims.get('right')) {
            this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('player', { start: 1, end: 2 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!this.anims.get('up')) {
            this.anims.create({
                key: 'up',
                frames: this.anims.generateFrameNumbers('player', { start: 11, end: 13 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!this.anims.get('down')) {
            this.anims.create({
                key: 'down',
                frames: this.anims.generateFrameNumbers('player', { start: 4, end: 6 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!this.anims.get('eup')) {
            this.anims.create({
                key: 'eup',
                frames: this.anims.generateFrameNumbers('enemy', { start: 11, end: 13 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!this.anims.get('edown')) {
            this.anims.create({
                key: 'edown',
                frames: this.anims.generateFrameNumbers('enemy', { start: 4, end: 6 }),
                frameRate: 10,
                repeat: -1
            });
        }

        this.player = this.physics.add.sprite(50, 100, 'player', 1);
        //this.player.setCollideWorldBounds(true);
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

        this.enemies = [];

        for (var e = 0; e < this.spawnpoints.length; e++) {
            var spawnpoint = this.spawnpoints[e];
            var enemy = this.physics.add.sprite(spawnpoint.x, spawnpoint.y, 'enemy', 1);
            //enemy.setCollideWorldBounds(true);
            this.physics.add.collider(enemy, this.layer);
            this.physics.add.collider(enemy, this.ball, this.enemyBallCollide, undefined, this);
            this.physics.add.collider(enemy, this.player, this.enemyPlayerCollide, undefined, this);
            enemy.pathfinding = {
                left: 0,
                right: 0,
                up: 0,
                down: 0,
                walkspeed: 64,
                spawnpoint: {x: spawnpoint.x, y: spawnpoint.y}
            };

            for (var b = 0; b < this.enemies.length; b++) {
                var enemyB = this.enemies[b];
                this.physics.add.collider(enemy, enemyB, this.enemyEnemyCollide, undefined, this);
            }

            this.enemies.push(enemy);
        }

        this.losetext = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'losetext');
        this.losetext.visible = false;
        this.losetext.setScrollFactor(0);

        this.wintext = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'wintext');
        this.wintext.visible = false;
        this.wintext.setScrollFactor(0);

        this.blueShards = this.add.particles('blueshards');
        this.blueEmitter = this.blueShards.createEmitter({
            frame: [0, 1, 2, 3],
            x: 200,
            y: 300,
            speed: { min: -800, max: 800 },
            angle: { min: 0, max: 360 },
            scale: { start: 1.5, end: 0 },
            lifespan: 600,
            gravityY: 800,
            frequency: -1,
            rotate: { min: -540, max: 540 }
        });

        this.redShards = this.add.particles('redshards');
        this.redEmitter = this.redShards.createEmitter({
            frame: [0, 1, 2, 3],
            x: 200,
            y: 300,
            speed: { min: -800, max: 800 },
            angle: { min: 0, max: 360 },
            scale: { start: 1.5, end: 0 },
            lifespan: 600,
            gravityY: 800,
            frequency: -1,
            rotate: { min: -540, max: 540 }
        });

        // override window resize function
        window.onresize = () => {
            this.sys.game.renderer.resize(window.innerWidth, window.innerHeight, 1.0);
            this.resizeField();
        }
        this.resizeField();

        this.cameras.main.flash(350, this.flashColor.r, this.flashColor.g, this.flashColor.b);
    }

    enemyEnemyCollide(enemyA, enemyB) {
        enemyA.pathfinding.left = this.updateTime;
        enemyB.pathfinding.right = this.updateTime;
        enemyA.pathfinding.up = this.updateTime;
        enemyB.pathfinding.down = this.updateTime;
    }

    enemyBallCollide(enemy, ball) {
        enemy.visible = false;
        enemy.body.enable = false;
        this.cameras.main.shake(500);
        this.redEmitter.explode(20, enemy.body.x, enemy.body.y);

        let restart = true;
        for (var e = 0; e < this.enemies.length; e++) {
            if (this.enemies[e].visible) {
                restart = false;
            }
        }
        if (restart) {
            this.wintext.visible = true;
            this.time.delayedCall(4000, () => {
                this.flashColor = {r: 34, g: 166, b: 179};
                this.scene.restart();
            }, [], this);
        }
    }

    enemyPlayerCollide(enemy, player) {
        player.visible = false;
        player.body.enable = false;
        this.cameras.main.shake(500);
        this.blueEmitter.explode(20, player.body.x, player.body.y);
        this.losetext.visible = true;
        this.time.delayedCall(4000, () => {
            this.flashColor = {r: 235, g: 77, b: 75};
            this.scene.restart();
        }, [], this);
    }

    update(time, delta) {

        this.updateTime = time;

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

        // wrap the player
        if (this.player.body.x > this.map.widthInPixels) {
            this.player.body.x -= this.map.widthInPixels;
            for (var e = 0; e < this.enemies.length; e++) {
                var enemy = this.enemies[e];
                enemy.pathfinding.left = time + 2000;
                enemy.pathfinding.up = time + 2000;
                enemy.pathfinding.down = time + 2000;
            }
        }
        if (this.player.body.x < 0) {
            this.player.body.x += this.map.widthInPixels;
            for (var e = 0; e < this.enemies.length; e++) {
                var enemy = this.enemies[e];
                enemy.pathfinding.right = time + 2000;
                enemy.pathfinding.up = time + 2000;
                enemy.pathfinding.down = time + 2000;
            }
        }
        if (this.player.body.y > this.map.heightInPixels) {
            this.player.body.y -= this.map.heightInPixels;
            for (var e = 0; e < this.enemies.length; e++) {
                var enemy = this.enemies[e];
                enemy.pathfinding.right = time + 2000;
                enemy.pathfinding.left = time + 2000;
                enemy.pathfinding.up = time + 2000;
            }
        }
        if (this.player.body.y < 0) {
            this.player.body.y += this.map.heightInPixels;
            for (var e = 0; e < this.enemies.length; e++) {
                var enemy = this.enemies[e];
                enemy.pathfinding.right = time + 2000;
                enemy.pathfinding.left = time + 2000;
                enemy.pathfinding.down = time + 2000;
            }
        }

        // enemy logic
        for (var e = 0; e < this.enemies.length; e++) {
            var enemy = this.enemies[e];
            enemy.body.velocity.set(0);
            let targetAnim = 'edown';

            if (enemy.body.blocked.left) {
                enemy.pathfinding.left = time;
            }
            if (enemy.body.blocked.right) {
                enemy.pathfinding.right = time;
            }
            if (enemy.body.blocked.up || Math.abs(this.player.body.y - enemy.body.y) < 2) {
                enemy.pathfinding.up = time;
            }
            if (enemy.body.blocked.down) {
                enemy.pathfinding.down = time;
            }

            if ((Math.floor(enemy.body.x) > Math.floor(this.player.body.x)) && ((time - enemy.pathfinding.left) > 1000)) {
                enemy.body.velocity.x = -enemy.pathfinding.walkspeed;
            } else if ((Math.floor(enemy.body.x) < Math.floor(this.player.body.x)) && ((time - enemy.pathfinding.right) > 1000)) {
                enemy.body.velocity.x = enemy.pathfinding.walkspeed;
            } else {
                if ((time - enemy.pathfinding.left) > 1000) {
                    enemy.body.velocity.x = -enemy.pathfinding.walkspeed;
                } else if ((time - enemy.pathfinding.right) > 1000) {
                    enemy.body.velocity.x = enemy.pathfinding.walkspeed;
                }
            }

            if ((Math.floor(enemy.body.y) > Math.floor(this.player.body.y)) && ((time - enemy.pathfinding.up) > 1000)) {
                enemy.body.velocity.y = -enemy.pathfinding.walkspeed;
                targetAnim = 'eup';
            } else if ((Math.floor(enemy.body.y) < Math.floor(this.player.body.y)) && ((time - enemy.pathfinding.down) > 1000)) {
                enemy.body.velocity.y = enemy.pathfinding.walkspeed;
                targetAnim = 'edown';
            } else {
                if ((time - enemy.pathfinding.up) > 1000) {
                    enemy.body.velocity.y = -enemy.pathfinding.walkspeed;
                    targetAnim = 'eup';
                } else if ((time - enemy.pathfinding.down) > 1000) {
                    enemy.body.velocity.y = enemy.pathfinding.walkspeed;
                    targetAnim = 'edown';
                }
            }

            enemy.anims.play(targetAnim, true);

            // wrap the enemy
            if (enemy.body.x > this.map.widthInPixels) {
                enemy.body.x -= this.map.widthInPixels;
            }
            if (enemy.body.x < 0) {
                enemy.x += this.map.widthInPixels;
            }
            if (enemy.body.y > this.map.heightInPixels) {
                enemy.body.y -= this.map.heightInPixels;
            }
            if (enemy.body.y < 0) {
                enemy.body.y += this.map.heightInPixels;
            }
        }

    }

    resizeField() {
        this.cameras.main.setViewport(0, 0, window.innerWidth, window.innerHeight);
        this.losetext.x = window.innerWidth / 2;
        this.losetext.y = window.innerHeight / 2;
        this.wintext.x = window.innerWidth / 2;
        this.wintext.y = window.innerHeight / 2;
        this.sys.game.config.width = window.innerWidth;
        this.sys.game.config.height = window.innerHeight;
    }
}

export default Level;
