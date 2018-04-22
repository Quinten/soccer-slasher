import 'phaser';
import Boot from './scenes/Boot.js';
import Preloader from './scenes/Preloader.js';
import Level from './scenes/Level.js';
import Startscreen from './scenes/Startscreen.js';

var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-game',
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#badc58',
    pixelArt: true,
    scene: [
        Boot,
        Preloader,
        Level,
        Startscreen
    ]
};

window.game = new Phaser.Game(config);
