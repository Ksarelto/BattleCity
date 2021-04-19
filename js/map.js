'use strict'
var gameMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 3, 3, 3, 3, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
    [3, 3, 3, 3, 3, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 3, 3],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 3, 3],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
const blockWidth = 20;
var coords = [];
var map;
var eagle;
var mapImage;
var mapWidth;
var mapHeight;
var tankEl;
var bulletEl;
var shootOfBullet;
var newMap;
var tank;
var bullet;
var scoreSpan;
var tanksKilledSpan;
var touchField;
var imgElem;
var fireButton;

function mapInit() {

    touchField = document.querySelector('.joystick');
    imgElem = document.querySelector('#move');
    fireButton = document.querySelector('.fireButton');

    scoreSpan = document.querySelector('.totalScore span');
    tanksKilledSpan = document.querySelector('.killedTanks span');
    map = document.querySelector('.map');
    eagle = document.createElement('div');
    eagle.style.cssText = 'position:absolute; display: inline-block; width: 40px; height: 40px; background: url(image/gameSprait.webp) -24px -41px no-repeat;'
    eagle.style.left = map.offsetWidth / 2 - 20 + 'px';
    eagle.style.top = map.offsetHeight - 40 + 'px';
    mapImage = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    map.appendChild(mapImage);
    map.appendChild(eagle);
    mapImage.setAttribute('width', map.offsetWidth);
    mapImage.setAttribute('height', map.offsetHeight);

    mapWidth = map.offsetWidth;
    mapHeight = map.offsetHeight;
    tankEl = document.createElement('div');
    map.appendChild(tankEl);
    bulletEl = document.createElement('div');
    shootOfBullet = document.createElement('div');
    shootOfBullet.style.cssText = 'position: absolute;  display: inline-block; opacity: 1;'
    bulletEl.style.cssText = 'position: absolute; left: 0; top: 0; display: inline-block; background: url(image/map.webp) -808px -255px no-repeat; opacity: 0;'
    bulletEl.style.width = '10px';
    bulletEl.style.height = '10px';
    map.appendChild(bulletEl);

    tankEl.style.cssText = 'position: absolute; display: inline-block; background: url(image/gameSprait.webp) -24px 1px no-repeat; transform: rotate(180deg); '
    tankEl.style.width = '40px';
    tankEl.style.height = '40px';
    tankEl.style.left = map.offsetWidth / 2 - eagle.offsetWidth / 2 - tankEl.offsetWidth * 2 + 'px';
    tankEl.style.top = map.offsetHeight - tankEl.offsetHeight + 'px';

    tank = {
        posX: map.offsetWidth / 2 - eagle.offsetWidth / 2 - tankEl.offsetWidth * 2,
        posY: map.offsetHeight - tankEl.offsetHeight,
        speedX: 2,
        speedY: 2,
        tankWidth: 40,
        tankHeight: 40,
        move: false,
        direction: 'top',
        keysReposytory: {},
        wall: false,
        moveSound: true,
    }

    bullet = {
        posY: 0,
        posX: 0,
        shoot: false,
        speedX: 5,
        speedY: 5,
        width: 10,
        height: 15,
        direction: 'top',
        bulletFly: false,
        wall: false,
    }

    newMap = gameMap.map(function (el, ind) {
        for (let i = 0; i < el.length; i++) {
            switch (el[i]) {
                case 1:
                    el[i] = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                    mapImage.appendChild(el[i]);
                    el[i].setAttribute('x', blockWidth * i);
                    el[i].setAttribute('y', blockWidth * ind);
                    el[i].setAttribute('width', blockWidth);
                    el[i].setAttribute('height', blockWidth);
                    el[i].setAttribute('href', 'image/brick.webp');
                    el[i] = 1;
                    break;
                case 2:
                    el[i] = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                    mapImage.appendChild(el[i]);
                    el[i].setAttribute('x', blockWidth * i);
                    el[i].setAttribute('y', blockWidth * ind);
                    el[i].setAttribute('width', blockWidth);
                    el[i].setAttribute('height', blockWidth);
                    el[i].setAttribute('href', 'image/rock.webp');
                    el[i] = 2;
                    break;
                case 3:
                    el[i] = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                    mapImage.appendChild(el[i]);
                    el[i].setAttribute('x', blockWidth * i);
                    el[i].setAttribute('y', blockWidth * ind);
                    el[i].setAttribute('width', blockWidth);
                    el[i].setAttribute('height', blockWidth);
                    el[i].setAttribute('href', 'image/water.webp');
                    el[i] = 3;
                    break;
            }
        }
    })
}
if (startNewGame) {
    mapInit();
}
