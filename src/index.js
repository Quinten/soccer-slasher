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
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [
        Boot,
        Preloader,
        Level,
        Startscreen
    ]
};

// improve iframe focus
window.addEventListener('load', function () {
    window.focus();
    document.body.addEventListener('click',function(e) {
        window.focus();
    },false);
});

// start game
window.game = new Phaser.Game(config);
