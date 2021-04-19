'use script'

var TANKCREATEPOSITIONS = 6;
var tanksNumber = 0;
var allTanks = [];
var createTanksMachines = true;

function createEnemyTank() {
    var self = this;
    self.placeOfAppiarance = 0;
    self.tankWidth = 40;
    self.tank;
    self.posX = 0;
    self.posY = 0;
    self.speedX = 0;
    self.speedY = 0;
    self.direction = 4;// Направление движения танка 1 - вверх, 2 - влево, 3-вправо, 4-вниз;
    self.wall = false;
    //Пуля
    self.movement = true;
    self.bulletShoot = true;
    self.bulletFly = false;
    self.bullPosX = 0;
    self.bullPosY = 0;
    self.bullSpeedX = 2;
    self.bullSpeedY = 2;
    self.bulletWidth = 10;
    self.bulletDirection = 4; // Направление движения танка 1 - вверх, 2 - влево, 3-вправо, 4-вниз;
    self.bulletWall = false;
    self.bulletEl = document.createElement('div');
    self.shootOfBullet = document.createElement('div');
    self.shootOfBullet.style.cssText = 'position: absolute;  display: inline-block; opacity: 1;'
    self.bulletEl.style.cssText = 'position: absolute; left: 0; top: 0; display: inline-block; background: url(image/map.webp) -808px -255px no-repeat; opacity: 0; width: 10px; height:10px;'
    map.appendChild(self.bulletEl);

    function createCertainTank(name) {
        self.tank = document.createElement('div');
        self.tank.style.cssText = 'position: absolute; display: inline-block; width: 40px; height: 40px'
        self.tank.style.left = self.posX + 'px';
        animateCreation(self.tank)
        setTimeout(function () {
            switch (name) {
                case 'light':
                    self.speedX = 3;
                    self.speedY = 3;
                    self.bullSpeedX = 4;
                    self.bullSpeedY = 4;
                    self.tank.style.background = 'url(image/gameSprait.webp) no-repeat';
                    self.tank.style.transform = 'rotate(90deg)';
                    self.tank.style.animation = 'moveLight .2s steps(2) infinite';
                    break;
                case 'heavy':
                    self.speedX = 1;
                    self.speedY = 1;
                    self.tank.style.background = 'url(image/gameSprait.webp)  no-repeat';
                    self.tank.style.transform = 'rotate(90deg)';
                    self.tank.style.animation = 'moveHeavy .2s steps(2) infinite';
                    break;
                case 'middle':
                    self.speedX = 2;
                    self.speedY = 2;
                    self.bullSpeedX = 3;
                    self.bullSpeedY = 3;
                    self.tank.style.background = 'url(image/gameSprait.webp)  no-repeat';
                    self.tank.style.transform = 'rotate(90deg)';
                    self.tank.style.animation = 'moveMiddle .2s steps(2) infinite';
                    break;
            }
        }, 1200);
    }

    //Движение танка
    function hitWall() {
        var mapRowY = Math.floor(self.posY / 20);
        var mapCollX = Math.floor(self.posX / 20);
        if (self.direction === 1) {
            if (gameMap[Math.ceil(self.posY / 20) - 1] === undefined) {
                self.wall = false;
                return;
            }
            for (let i = mapCollX; i < (mapCollX + 3); i++) {
                if (gameMap[Math.ceil(self.posY / 20) - 1][i] > 0) {
                    if (((i * 20 + 20) > self.posX) && ((i * 20) < self.posX + self.tankWidth) && (self.posY) <= (mapRowY * 20 + 20)) {
                        self.wall = true;
                        return;
                    }
                }
            }
            self.wall = false;
            return;
        }
        if (self.direction === 2) {
            for (let i = mapRowY; i < (mapRowY + 3); i++) {
                if (gameMap[i] === undefined) {
                    self.wall = false;
                    return;
                }
                if (gameMap[i][mapCollX + 2] > 0) {
                    if ((mapCollX * 20) < self.posX + self.tankWidth && ((self.posY + self.tankWidth) > (i * 20)) && (self.posY < (i * 20 + 20))) {
                        self.wall = true;
                        return;
                    }
                }
            }
            self.wall = false;
            return;
        }
        if (self.direction === 3) {
            for (let i = mapRowY; i < (mapRowY + 3); i++) {
                if (gameMap[i] === undefined) {
                    self.wall = false;
                    return;
                }
                if (gameMap[i][Math.ceil(self.posX / 20) - 1] > 0) {
                    if ((mapCollX * 20 + 20) > self.posX && ((self.posY + self.tankWidth) > (i * 20)) && (self.posY < (i * 20 + 20))) {
                        self.wall = true;
                        return;
                    }
                }
            }
            self.wall = false;
            return;
        }

        if (self.direction === 4) {
            for (let i = mapCollX; i < (mapCollX + 3); i++) {
                if (gameMap[mapRowY + 2] === undefined) {
                    tank.wall = false;
                    return;
                }
                if (gameMap[mapRowY + 2][i] > 0) {
                    if (((i * 20 + 20) > self.posX) && ((i * 20) < self.posX + self.tankWidth) && self.posY < (mapRowY * 20 + 20)) {
                        self.wall = true;
                        return;
                    }
                }
            }
            self.wall = false;
            return;
        }
    }
    self.setTankDirection = function () {
        self.direction = setRandom(1, 4);
        switch (self.direction) {
            case 1:
                self.tank.style.transform = 'rotate(-90deg)';
                break;
            case 2:
                self.tank.style.transform = 'rotate(0deg)';
                break;
            case 3:
                self.tank.style.transform = 'rotate(180deg)';
                break;
            case 4:
                self.tank.style.transform = 'rotate(90deg)';
                break;
        }
        self.movement = true;
    }

    self.tankMove = function () {
        if (self.direction === 1) {
            hitWall()
            if (self.wall) {
                self.posY = self.posY;
                self.movement = false;
                setTimeout(self.setTankDirection, 1000)
            } else {
                self.posY -= self.speedY;
            }
            if (self.posY < 0) {
                self.posY = 0;
                self.movement = false;
                setTimeout(self.setTankDirection, 1000)
            }
            if (self.bulletFly === false) {
                self.bulletFly = true;
                setTimeout(bulletCreation, 1500);
            }
            self.tank.style.top = self.posY + 'px';
        } else if (self.direction === 2) {
            hitWall()
            if (self.wall) {
                self.posX = self.posX;
                self.movement = false;
                setTimeout(self.setTankDirection, 1000)
            } else {
                self.posX += self.speedX;
            }
            if ((self.posX + self.tankWidth) > map.offsetWidth) {
                self.posX = map.offsetWidth - 40;
                self.movement = false;
                setTimeout(self.setTankDirection, 1000)
            }
            if (self.bulletFly === false) {
                self.bulletFly = true;
                setTimeout(bulletCreation, 1500);
            }
            self.tank.style.left = self.posX + 'px';
        } else if (self.direction === 3) {
            hitWall();
            if (self.wall) {
                self.posX = self.posX;
                self.movement = false;
                setTimeout(self.setTankDirection, 1000)
            } else {
                self.posX -= self.speedX;
            }
            if (self.posX < 0) {
                self.posX = 0;
                self.movement = false;
                setTimeout(self.setTankDirection, 1000)
            }
            if (self.bulletFly === false) {
                self.bulletFly = true;
                setTimeout(bulletCreation, 1500);
            }
            self.tank.style.left = self.posX + 'px';
        } else if (self.direction === 4) {
            hitWall();
            if (self.wall) {
                self.posY = self.posY;
                self.movement = false;
                setTimeout(self.setTankDirection, 1000)
            } else {
                self.posY += self.speedY;
            }
            if ((self.posY + self.tankWidth) > map.offsetHeight) {
                self.posY = map.offsetHeight - 40;
                self.movement = false;
                setTimeout(self.setTankDirection, 1000)
            }
            if (self.bulletFly === false) {
                self.bulletFly = true;
                setTimeout(bulletCreation, 1500);
            }
            self.tank.style.top = self.posY + 'px';
        }
    }

    //_______________________

    //Стрельба танка
    function bulletHitWall() {
        var mapRowY = Math.floor(self.bullPosY / 20);
        var mapCollX = Math.floor(self.bullPosX / 20);
        if (self.bulletDirection === 1) {
            if (gameMap[Math.ceil(self.bullPosY / 20) - 1] === undefined) {
                self.bulletWall = false;
                return;
            }
            for (let i = mapCollX; i < (mapCollX + 3); i++) {
                if (gameMap[Math.ceil(self.bullPosY / 20) - 1][i] > 0 && gameMap[Math.ceil(self.bullPosY / 20) - 1][i] < 3) {
                    if (((i * 20 + 20) > self.bullPosX) && ((i * 20) < self.bullPosX + self.bulletWidth) && (self.bullPosY) <= (mapRowY * 20 + 20)) {
                        self.bulletWall = true;
                        self.bulletFly = false;
                        self.bulletShoot = false;
                        self.bulletEl.style.opacity = '0';
                        if (gameMap[Math.ceil(self.bullPosY / 20) - 1][i] === 1) {
                            let blackBlock = gameMap[Math.ceil(self.bullPosY / 20) - 1][i];
                            blackBlock = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                            mapImage.appendChild(blackBlock);
                            blackBlock.setAttribute('x', blockWidth * i);
                            blackBlock.setAttribute('y', blockWidth * (Math.ceil(self.bullPosY / 20) - 1));
                            blackBlock.setAttribute('width', blockWidth);
                            blackBlock.setAttribute('height', blockWidth);
                            blackBlock.setAttribute('fill', 'black');
                            gameMap[Math.ceil(self.bullPosY / 20) - 1][i] = 0;
                        }
                        blowAnimation()
                        setTimeout(playSounds, 300, 'getHit');
                        setTimeout(resetBlowAnimation, 300);
                        return;
                    }
                }
            }
            self.bulletWall = false;
            return;
        }
        if (self.bulletDirection === 2) {
            for (let i = mapRowY; i < (mapRowY + 2); i++) {
                if (gameMap[i] === undefined) {
                    self.bulletWall = false;
                    return;
                }
                if (gameMap[i][Math.round(self.bullPosX / 20)] > 0 && gameMap[i][Math.round(self.bullPosX / 20)] < 3) {
                    if ((mapCollX * 20) < self.bullPosX + self.bulletWidth && ((self.bullPosY + self.bulletWidth) > (i * 20)) && (self.bullPosY < (i * 20 + 20))) {
                        self.bulletWall = true;
                        self.bulletFly = false;
                        self.bulletShoot = false;
                        self.bulletEl.style.opacity = '0';
                        if (gameMap[i][Math.round(self.bullPosX / 20)] === 1) {
                            let blackBlock = gameMap[i][Math.ceil(self.bullPosX / 20) - 1];
                            blackBlock = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                            mapImage.appendChild(blackBlock);
                            blackBlock.setAttribute('x', blockWidth * Math.round(self.bullPosX / 20));
                            blackBlock.setAttribute('y', blockWidth * i);
                            blackBlock.setAttribute('width', blockWidth);
                            blackBlock.setAttribute('height', blockWidth);
                            blackBlock.setAttribute('fill', 'black');
                            gameMap[i][Math.round(self.bullPosX / 20)] = 0;
                        }
                        blowAnimation()
                        setTimeout(playSounds, 300, 'getHit');
                        setTimeout(resetBlowAnimation, 300);
                        return;
                    }
                }
            }
            self.bulletWall = false;
            return;
        }
        if (self.bulletDirection === 3) {
            for (let i = mapRowY; i < (mapRowY + 2); i++) {
                if (gameMap[i] === undefined) {
                    self.bulletWall = false;
                    return;
                }
                if (gameMap[i][Math.ceil(self.bullPosX / 20) - 1] > 0 && gameMap[i][Math.ceil(self.bullPosX / 20) - 1] < 3) {
                    if ((mapCollX * 20 + 20) > self.bullPosX && ((self.bullPosY + self.bulletWidth) > (i * 20)) && (self.bullPosY < (i * 20 + 20))) {
                        self.bulletWall = true;
                        self.bulletFly = false;
                        self.bulletShoot = false;
                        self.bulletEl.style.opacity = '0';
                        if (gameMap[i][Math.ceil(self.bullPosX / 20) - 1] === 1) {
                            let blackBlock = gameMap[i][Math.ceil(self.bullPosX / 20) - 1];
                            blackBlock = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                            mapImage.appendChild(blackBlock);
                            blackBlock.setAttribute('x', blockWidth * (Math.ceil(self.bullPosX / 20) - 1));
                            blackBlock.setAttribute('y', blockWidth * i);
                            blackBlock.setAttribute('width', blockWidth);
                            blackBlock.setAttribute('height', blockWidth);
                            blackBlock.setAttribute('fill', 'black');
                            gameMap[i][Math.ceil(self.bullPosX / 20) - 1] = 0;
                        }
                        blowAnimation()
                        setTimeout(playSounds, 300, 'getHit');
                        setTimeout(resetBlowAnimation, 300);
                        return;
                    }
                }
            }
            self.bulletWall = false;
            return;
        }

        if (self.bulletDirection === 4) {
            for (let i = mapCollX; i < (mapCollX + 2); i++) {
                if (gameMap[Math.round(self.bullPosY / 20)] === undefined) {
                    self.bulletWall = false;
                    return;
                }
                if (gameMap[Math.round(self.bullPosY / 20)][i] > 0 && gameMap[Math.round(self.bullPosY / 20)][i] < 3) {
                    if (((i * 20 + 20) > self.bullPosX) && ((i * 20) < self.bullPosX + bullet.width) && self.bullPosY < (mapRowY * 20 + 20)) {
                        self.bulletWall = true;
                        self.bulletFly = false;
                        self.bulletShoot = false;
                        self.bulletEl.style.opacity = '0';
                        if (gameMap[Math.round(self.bullPosY / 20)][i] === 1) {
                            let blackBlock = gameMap[Math.round(self.bullPosY / 20)][i];
                            blackBlock = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                            mapImage.appendChild(blackBlock);
                            blackBlock.setAttribute('x', blockWidth * i);
                            blackBlock.setAttribute('y', blockWidth * Math.ceil(self.bullPosY / 20));
                            blackBlock.setAttribute('width', blockWidth);
                            blackBlock.setAttribute('height', blockWidth);
                            blackBlock.setAttribute('fill', 'black');
                            gameMap[Math.round(self.bullPosY / 20)][i] = 0;
                        }
                        blowAnimation()
                        setTimeout(playSounds, 300, 'getHit');
                        setTimeout(resetBlowAnimation, 300);
                        return;
                    }
                }
            }
            self.bulletWall = false;
            return;
        }
    }
    function bulletCreation() {
        self.bulletDirection = self.direction;
        self.bulletShoot = true;
        self.bulletFly = true;
        self.bullPosX = self.posX + self.tankWidth
        self.bullPosY = self.posY + self.tankWidth / 2;
        self.bulletEl.style.left = self.bullPosX + 'px';
        self.bulletEl.style.top = self.bullPosY + 'px';

        switch (self.direction) {
            case 1:
                self.bulletEl.style.transform = 'rotate(0)';
                self.bullPosX = self.posX + self.tankWidth / 2 - self.bulletWidth / 2;
                self.bullPosY = self.posY;
                self.bulletEl.style.left = self.bullPosX + 'px';
                self.bulletEl.style.top = self.bullPosY + 'px';
                self.bulletEl.style.opacity = '1';
                break;
            case 2:
                self.bulletEl.style.transform = 'rotate(90deg)';
                self.bullPosX = self.posX + self.tankWidth - self.bulletWidth;
                self.bullPosY = self.posY + self.tankWidth / 2 - self.bulletWidth / 3;
                self.bulletEl.style.left = self.bullPosX + 'px';
                self.bulletEl.style.top = self.bullPosY + 'px';
                self.bulletEl.style.opacity = '1';
                break;
            case 3:
                self.bulletEl.style.transform = 'rotate(-90deg)';
                self.bullPosX = self.posX
                self.bullPosY = self.posY + self.tankWidth / 2 - self.bulletWidth / 2;
                self.bulletEl.style.left = self.bullPosX + 'px';
                self.bulletEl.style.top = self.bullPosY + 'px';
                self.bulletEl.style.opacity = '1';
                break;
            case 4:
                self.bulletEl.style.transform = 'rotate(180deg)';
                self.bullPosX = self.posX + self.tankWidth / 2 - self.bulletWidth / 2;
                self.bullPosY = self.posY + self.tankWidth - self.bulletWidth;
                self.bulletEl.style.left = self.bullPosX + 'px';
                self.bulletEl.style.top = self.bullPosY + 'px';
                self.bulletEl.style.opacity = '1';
                break;
        }

    }

    self.tankFire = function () {
        if (self.bulletDirection === 1) {
            bulletHitWall();
            if (self.bulletWall) {
                self.bullPosY = self.bullPosY;
            } else {
                self.bullPosY -= self.bullSpeedY;
            }
            if ((self.bullPosY - self.bulletWidth) < 0) {
                self.bulletShoot = false;
                self.bulletFly = false;
                self.bulletEl.style.opacity = '0';
                blowAnimation()
                setTimeout(resetBlowAnimation, 300);
            }
            self.bulletEl.style.top = self.bullPosY + 'px';
        } else if (self.bulletDirection === 2) {
            bulletHitWall();
            if (self.bulletWall) {
                self.bullPosX = self.bullPosX;
            } else {
                self.bullPosX += self.bullSpeedX;
            }
            if ((self.bullPosX + self.bulletWidth / 2) > map.offsetWidth) {
                self.bulletShoot = false;
                self.bulletFly = false;
                self.bulletEl.style.opacity = '0';
                blowAnimation()
                setTimeout(resetBlowAnimation, 300);
            }
            self.bulletEl.style.left = self.bullPosX + 'px';
        } else if (self.bulletDirection === 3) {
            bulletHitWall();
            if (self.bulletWall) {
                self.bullPosX = self.bullPosX;
            } else {
                self.bullPosX -= self.bullSpeedX;
            }
            if ((self.bullPosX - self.bulletWidth / 2) < 0) {
                self.bulletShoot = false;
                self.bulletFly = false;
                self.bulletEl.style.opacity = '0';
                blowAnimation()
                setTimeout(resetBlowAnimation, 300);
            }
            self.bulletEl.style.left = self.bullPosX + 'px';
        } else if (self.bulletDirection === 4) {
            bulletHitWall();
            if (self.bulletWall) {
                self.bullPosY = self.bullPosY;
            } else {
                self.bullPosY += self.bullSpeedY;
            }
            if ((self.bullPosY + self.bulletWidth) > map.offsetHeight) {
                self.bulletShoot = false;
                self.bulletFly = false;
                self.bulletEl.style.opacity = '0';
                blowAnimation()
                setTimeout(resetBlowAnimation, 300);
            }
            self.bulletEl.style.top = self.bullPosY + 'px';
        }
    }

    function blowAnimation() {
        map.appendChild(self.shootOfBullet);
        self.shootOfBullet.style.top = self.bullPosY - 22 + 'px';
        self.shootOfBullet.style.left = self.bullPosX - 22 + 'px';
        self.shootOfBullet.style.width = '40px';
        self.shootOfBullet.style.height = '40px';
        self.shootOfBullet.style.background = 'url(image/boom.webp) no-repeat'
        self.shootOfBullet.style.animation = 'boom2 .3s 2 steps(3) alternate';
    }
    function resetBlowAnimation() {
        self.shootOfBullet.remove();
    }
    //__________________________________________________
    //Анимация появления  и исчезновение анимации танка
    function animateCreation(tank) {
        map.appendChild(tank);
        tank.style.background = 'url(image/blink.webp) no-repeat'
        tank.style.animation = 'boom .2s 6 steps(4) alternate';
    }

    //_________________________________________________


    //Просто рандомные числа
    function setRandom(min, max) {
        let res = min + Math.random() * (max + 1 - min);
        return Math.floor(res);
    }
    //__________________________________________________

    self.createAITank = function () {
        var name;
        var tankKind = setRandom(1, 3);
        console.log(tankKind);
        switch (tankKind) {
            case 1:
                name = 'light';
                createCertainTank(name);
                break;
            case 2:
                name = 'middle';
                createCertainTank(name);
                break;
            case 3:
                name = 'heavy';
                createCertainTank(name);
                break;
        }

    }
}


