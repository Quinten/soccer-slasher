class Level extends Phaser.Scene {

    constructor (config)
    {
        super((config) ? config : { key: 'level' });
        this.nextScene = 'startscreen';
        this.background = undefined;
    }

    create()
    {
        this.background = this.add.graphics();
        //setTimeout(() => {this.input.on('pointerup', this.tapUp, this);}, 1000);
        // override window resize function
        window.onresize = () => {
            this.sys.game.renderer.resize(window.innerWidth, window.innerHeight, 1.0);
            this.resizeField();
        }
        this.resizeField();
    }

    resizeField() {
        let camX = (window.innerWidth / 2) - (this.fieldSize * this.tileSize / 2);
        let camY = (window.innerHeight / 2) - (this.fieldSize * this.tileSize / 2);
        this.cameras.main.setViewport(0, 0, window.innerWidth, window.innerHeight);
        this.cameras.main.scrollX = -camX;
        this.cameras.main.scrollY = -camY;
        this.background.clear();
        this.background.fillStyle(0xbadc58, 1);
        this.background.fillRect(0, 0, window.innerWidth, window.innerHeight);
        this.background.x = -camX;
        this.background.y = -camY;
        this.sys.game.config.width = window.innerWidth;
        this.sys.game.config.height = window.innerHeight;
    }

    tapUp() {
        this.scene.start(this.nextScene);
    }

}

export default Level;
