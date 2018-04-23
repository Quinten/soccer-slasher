class Startscreen extends Phaser.Scene {

    constructor (config)
    {
        super((config) ? config : { key: 'startscreen' });
        this.nextScene = 'level';
        this.credits = undefined;
        this.backgroundnoise = undefined;
    }

    create ()
    {
        this.credits = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'startscreen');

        this.input.on('pointerup', this.tapUp, this);

        this.backgroundnoise = this.sound.add('backgroundnoise');
        this.backgroundnoise.loop = true;
        this.backgroundnoise.play();

        // override window resize function
        window.onresize = () => {
            this.sys.game.renderer.resize(window.innerWidth, window.innerHeight, 1.0);
            this.resizeField();
        }
        this.resizeField();
    }

    resizeField() {
        this.credits.x = window.innerWidth / 2;
        this.credits.y = window.innerHeight / 2;
        this.cameras.main.setViewport(0, 0, window.innerWidth, window.innerHeight);
        this.sys.game.config.width = window.innerWidth;
        this.sys.game.config.height = window.innerHeight;
    }

    tapUp() {
        console.log(this.nextScene);
        this.scene.start(this.nextScene);
    }

}

export default Startscreen;
