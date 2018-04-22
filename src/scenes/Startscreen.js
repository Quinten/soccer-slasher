class Startscreen extends Phaser.Scene {

    constructor (config)
    {
        super((config) ? config : { key: 'startscreen' });
        this.nextScene = 'level';
        this.credits = undefined;
    }

    create ()
    {
        this.credits = this.make.text({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2 + 8,
            text: "soccer slasher\nclick anywhere",
            origin: { x: .5, y: .5 },
            style: {
                font: 'normal 18px monospace',
                fill: '#dff9fb',
                align: 'center',
                wordWrap: { width: 320, useAdvancedWrap: true }
            }
        });

        this.input.on('pointerup', this.tapUp, this);

        // override window resize function
        window.onresize = () => {
            this.sys.game.renderer.resize(window.innerWidth, window.innerHeight, 1.0);
            this.resizeField();
        }
        this.resizeField();
    }

    resizeField() {
        this.credits.x = window.innerWidth / 2;
        this.credits.y = window.innerHeight / 2 + 8;
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
