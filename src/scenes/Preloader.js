class Preloader extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'preloader' });
    }

    preload ()
    {
        window.onresize = () => {
            window.game.renderer.resize(window.innerWidth, window.innerHeight, 1.0);
        }

        this.load.setPath('assets');

        let progress = this.add.graphics();

        this.load.on('progress', function (value) {
            progress.clear();
            progress.fillStyle(0xdff9fb, 1);
            progress.fillRect(0, (window.innerHeight / 2) - 30, window.innerWidth * value, 60);
        });

        this.load.on('complete', function () {
            progress.destroy();
        });

        // Load assets here
        // ...
        this.load.image('tiles', 'tiles.png');
        this.load.tilemapTiledJSON('map', 'map.json');
        this.load.spritesheet('player', 'player.png', { frameWidth: 16, frameHeight: 16 });
        this.load.image('ball', 'ball.png');

        //this.load.audioSprite('sfxone', ['sfxone.ogg', 'sfxone.mp3'], 'sfxone.json');

    }

    create ()
    {
        this.scene.start('startscreen');
    }

}

export default Preloader;
