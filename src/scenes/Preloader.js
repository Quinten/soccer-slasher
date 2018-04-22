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
        /*
        this.load.spritesheet([
            { key: 'editorbuttons', config: { frameWidth: 64, frameHeight: 64 } },
            { key: 'tiles', config: { frameWidth: 64, frameHeight: 64 } },
            { key: 'shards', config: { frameWidth: 16, frameHeight: 16 } }
        ]);
        this.load.image('hand');
        */

        //this.load.audioSprite('sfxone', ['sfxone.ogg', 'sfxone.mp3'], 'sfxone.json');

    }

    create ()
    {
        this.scene.start('startscreen');
    }

}

export default Preloader;
