var introMusic = new Audio;
var tankMoveS = new Audio;
var tankStop = new Audio;
var tankShoot = new Audio;
var hit = new Audio;
var loose = new Audio;
var explosion = new Audio;
var baseRuined = new Audio;
var anchor = true;
var vibroControll = false;


introMusic.src = 'audio/battle-city.mp3';
tankMoveS.src = 'audio/tank_move.mp3';
tankStop.src = 'audio/tank_stop.mp3';
tankShoot.src = 'audio/shoot.mp3';
hit.src = 'audio/hit.mp3';
loose.src = 'audio/loose.mp3';
explosion.src = 'audio/tank_destroy.mp3';
baseRuined.src = 'audio/flag_destrot.mp3';
function audioInit() {
    introMusic.play();
    introMusic.pause();

    tankMoveS.play();
    tankMoveS.pause();

    tankStop.play();
    tankStop.pause();

    tankShoot.play();
    tankShoot.pause();

    hit.play();
    hit.pause();

    loose.play();
    loose.pause();

    explosion.play();
    explosion.pause();

    baseRuined.play();
    baseRuined.pause();
}

function playSounds(str) {
    if (anchor === false) {
        return;
    }
    switch (str) {
        case 'tankMove':
            tankStop.pause();
            tankMoveS.currentTime = 0;
            tankMoveS.play();
            tankMoveS.loop = true;
            break;
        case 'tankStop':
            tankMoveS.pause();
            tankStop.currentTime = 0;
            tankStop.play();
            tankStop.loop = true;
            break;
        case 'introPlay':
            introMusic.currentTime = 0;
            introMusic.play();
            break;
        case 'resetSound':
            tankMoveS.pause();
            tankStop.pause();
            break;
        case 'tankShoot':
            tankShoot.currentTime = 0;
            tankShoot.play();
            break;
        case 'getHit':
            hit.currentTime = 0;
            hit.play();
            break;
        case 'getLoose':
            loose.currentTime = 0;
            loose.play();
            break;
        case 'tankExplosion':
            explosion.currentTime = 0;
            explosion.play();
            break;
        case 'baseRuined':
            baseRuined.currentTime = 0;
            baseRuined.play();
    }
}
// Вибрация!
function vibro(longFlag) {
    if (navigator.vibrate) { // есть поддержка Vibration API?

        if (vibroControll) {
            return;
        }
        if (!longFlag)
            window.navigator.vibrate(100); // вибрация 100мс
        else
            window.navigator.vibrate([300, 20, 300, 20, 300]); // вибрация 3 раза по 100мс с паузами 50мс
    }
}


function checkSoundsAndVibration() {
    var form = document.forms['sound-and-vibraion'];
    var soundElem = form.elements['sound'];
    var vibroElem = form.elements['vibro'];

    if (soundElem.checked) {
        anchor = false;
    } else {
        anchor = true;
    }

    if (vibroElem.checked) {
        vibroControll = true;
    } else {
        vibroControll = false;
    }
}



function fullScreenOn(e) {
    e = e || window.event;
    let element = document.documentElement;

    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitrequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.mozRequestFullscreen) {
        element.mozRequestFullScreen();
    }
}

function fullScreenOff(e) {
    document.webkitCancelFullScreen();
}