'use strict'
var stopGame = false;
var score = 0;
var tanksKilled = 0;

// Функция инициирования движения, стрельбы и полета пули игрока
function turnTank(e, str = '') {
	e = e || window.event;
	tank.keysReposytory[e.keyCode] = true;
	if (e.type === 'touchmove' || e.type === 'touchstart') {
		tank.keysReposytory[e.type] = str;
	}
	if ('87' in tank.keysReposytory || tank.keysReposytory[e.type] === 'top') {
		tank.direction = 'top';
		tankEl.style.transform = 'rotate(180deg)';
		tank.move = true;
	} else if ('68' in tank.keysReposytory || tank.keysReposytory[e.type] === 'left') {
		tank.direction = 'left';
		tankEl.style.transform = 'rotate(-90deg)';
		tank.move = true;
	} else if ('65' in tank.keysReposytory || tank.keysReposytory[e.type] === 'right') {
		tank.direction = 'right';
		tankEl.style.transform = 'rotate(90deg)';
		tank.move = true;
	} else if ('83' in tank.keysReposytory || tank.keysReposytory[e.type] === 'bottom') {
		tank.direction = 'bottom';
		tankEl.style.transform = 'rotate(0)';
		tank.move = true;
	}

	if (('70' in tank.keysReposytory || tank.keysReposytory[e.type] === 'FIRE') && bullet.bulletFly === false) {
		playSounds('tankShoot');
		bullet.shoot = true;
		bullet.bulletFly = true;
		bullet.direction = tank.direction;
		bullet.posX = tank.posX + tank.tankWidth;
		bullet.posY = tank.posY + tank.tankHeight / 2;
		bulletEl.style.left = bullet.posX + 'px';
		bulletEl.style.top = bullet.posY + 'px';

		switch (bullet.direction) {
			case 'top':
				bulletEl.style.transform = 'rotate(0)';
				bullet.posX = tank.posX + tank.tankWidth / 2 - bullet.width / 3;
				bullet.posY = tank.posY;
				bulletEl.style.left = bullet.posX + 'px';
				bulletEl.style.top = bullet.posY + 'px';
				bulletEl.style.opacity = '1';
				break;
			case 'left':
				bulletEl.style.transform = 'rotate(90deg)';
				bullet.posX = tank.posX + tank.tankWidth - bullet.width / 2;
				bullet.posY = tank.posY + tank.tankHeight / 2 - bullet.height / 3;
				bulletEl.style.left = bullet.posX + 'px';
				bulletEl.style.top = bullet.posY + 'px';
				bulletEl.style.opacity = '1';
				break;
			case 'right':
				bulletEl.style.transform = 'rotate(-90deg)';
				bullet.posX = tank.posX;
				bullet.posY = tank.posY + tank.tankHeight / 2 - bullet.width / 2;
				bulletEl.style.left = bullet.posX + 'px';
				bulletEl.style.top = bullet.posY + 'px';
				bulletEl.style.opacity = '1';
				break;
			case 'bottom':
				bulletEl.style.transform = 'rotate(180deg)';
				bullet.posX = tank.posX + tank.tankWidth / 2 - bullet.width / 4;
				bullet.posY = tank.posY + tank.tankHeight - bullet.width / 2;
				bulletEl.style.left = bullet.posX + 'px';
				bulletEl.style.top = bullet.posY + 'px';
				bulletEl.style.opacity = '1';
				break;
		}

	}
	if (tank.move && tank.moveSound) {
		tank.moveSound = false;
		playSounds('tankMove');
	}
}
//_______________________________________________________________________

function tankMove() {// Движение танка стрельба моего танка, создлание вражеских танков

	if (stopGame === true) {
		return;
	}
	if (tank.move) {
		tankEl.style.animation = 'playerMove .6s steps(2) infinite';
		if (tank.direction === 'top') {
			hitWall();
			if (tank.wall) {
				tank.posY = tank.posY;
			} else {
				tank.posY -= tank.speedY;
			}
			if (tank.posY < 0) {
				tank.posY = 0;
			}
			tankEl.style.top = tank.posY + 'px';
		} else if (tank.direction === 'left') {
			hitWall();
			if (tank.wall) {
				tank.posX = tank.posX;
			} else {
				tank.posX += tank.speedX;
			}
			if ((tank.posX + tank.tankWidth) > mapWidth) {
				tank.posX = mapWidth - tank.tankWidth;
			}
			tankEl.style.left = tank.posX + 'px';
		} else if (tank.direction === 'right') {
			hitWall();
			if (tank.wall) {
				tank.posX = tank.posX;
			} else {
				tank.posX -= tank.speedX;
			}
			if (tank.posX < 0) {
				tank.posX = 0;
			}
			tankEl.style.left = tank.posX + 'px';
		} else if (tank.direction === 'bottom') {
			hitWall();
			if (tank.wall) {
				tank.posY = tank.posY;
			} else {
				tank.posY += tank.speedY;
			}
			if ((tank.posY + tank.tankWidth) > mapHeight) {
				tank.posY = mapHeight - tank.tankWidth;
			}
			tankEl.style.top = tank.posY + 'px';
		}
	}

	if (bullet.shoot) {
		if (bullet.direction === 'top') {
			bulletHitWall();
			if (bullet.wall) {
				bullet.posY = bullet.posY;
			} else {
				bullet.posY -= bullet.speedY;
			}
			bulletHitEnemyTank(allTanks);
			if ((bullet.posY - bullet.width) < 0) {
				bullet.bulletFly = false;
				bullet.shoot = false;
				bulletEl.style.opacity = '0';
				blowAnimation(1, 1, 40)
				setTimeout(playSounds, 300, 'getHit');
				setTimeout(resetBlowAnimation, 300);
			}
			bulletEl.style.top = bullet.posY + 'px';
		} else if (bullet.direction === 'left') {
			bulletHitWall();
			if (bullet.wall) {
				bullet.posX = bullet.posX;
			} else {
				bullet.posX += bullet.speedX;
			}
			bulletHitEnemyTank(allTanks);
			if ((bullet.posX + bullet.width) > mapWidth) {
				bullet.bulletFly = false;
				bullet.shoot = false;
				bulletEl.style.opacity = '0';
				blowAnimation(1, 2, 40)
				setTimeout(playSounds, 300, 'getHit');
				setTimeout(resetBlowAnimation, 300);
			}
			bulletEl.style.left = bullet.posX + 'px';
		} else if (bullet.direction === 'right') {
			bulletHitWall();
			if (bullet.wall) {
				bullet.posX = bullet.posX;
			} else {
				bullet.posX -= bullet.speedX;
			}
			bulletHitEnemyTank(allTanks);
			if ((bullet.posX - bullet.height / 2) < 0) {
				bullet.bulletFly = false;
				bullet.shoot = false;
				bulletEl.style.opacity = '0';
				blowAnimation(1, 3, 40)
				setTimeout(playSounds, 300, 'getHit');
				setTimeout(resetBlowAnimation, 300);
			}
			bulletEl.style.left = bullet.posX + 'px';
		} else if (bullet.direction === 'bottom') {
			bulletHitWall();
			if (bullet.wall) {
				bullet.posY = bullet.posY;
			} else {
				bullet.posY += bullet.speedY;
			}
			bulletHitEnemyTank(allTanks);
			if ((bullet.posY + bullet.width) > mapHeight) {
				bullet.bulletFly = false;
				bullet.shoot = false;
				bulletEl.style.opacity = '0';
				blowAnimation(1, 4, 40)
				setTimeout(playSounds, 300, 'getHit');
				setTimeout(resetBlowAnimation, 300);
			}
			bulletEl.style.top = bullet.posY + 'px';
		}
	}

	if (tanksNumber < TANKCREATEPOSITIONS && createTanksMachines === true) {

		createTanksMachines = false;
		setTimeout(createOneTank, 1500);
	}

	for (let i = 0; i < allTanks.length; i++) {
		if (allTanks[i].movement) {
			allTanks[i].tankMove();
		}
		if (allTanks[i].bulletShoot) {
			allTanks[i].tankFire();
			killMyTank(allTanks[i]);
			killMyBase(allTanks[i]);
		}
	}

	requestAnimationFrame(tankMove);

};

function hitWall() {// Танк встречает на пути стену
	var mapRowY = Math.floor(tank.posY / 20);
	var mapCollX = Math.floor(tank.posX / 20);
	if (tank.direction === 'top') {
		if (gameMap[Math.ceil(tank.posY / 20) - 1] === undefined) {
			tank.wall = false;
			return;
		}
		for (let i = mapCollX; i < (mapCollX + 3); i++) {
			if (gameMap[Math.ceil(tank.posY / 20) - 1][i] > 0) {
				if (((i * 20 + 20) > tank.posX) && ((i * 20) < tank.posX + tank.tankWidth) && (tank.posY) <= (mapRowY * 20 + 20)) {
					tank.wall = true;
					return;
				}
			}
		}
		tank.wall = false;
		return;
	}
	if (tank.direction === 'left') {
		for (let i = mapRowY; i < (mapRowY + 3); i++) {
			if (gameMap[i] === undefined) {
				tank.wall = false;
				return;
			}
			if (gameMap[i][mapCollX + 2] > 0) {
				if ((mapCollX * 20) < tank.posX + tank.tankWidth && ((tank.posY + tank.tankWidth) > (i * 20)) && (tank.posY < (i * 20 + 20))) {
					tank.wall = true;
					return;
				}
			}
		}
		tank.wall = false;
		return;
	}
	if (tank.direction === 'right') {
		for (let i = mapRowY; i < (mapRowY + 3); i++) {
			if (gameMap[i] === undefined) {
				tank.wall = false;
				return;
			}
			if (gameMap[i][Math.ceil(tank.posX / 20) - 1] > 0) {
				if ((mapCollX * 20 + 20) > tank.posX && ((tank.posY + tank.tankWidth) > (i * 20)) && (tank.posY < (i * 20 + 20))) {
					tank.wall = true;
					return;
				}
			}
		}
		tank.wall = false;
		return;
	}

	if (tank.direction === 'bottom') {
		for (let i = mapCollX; i < (mapCollX + 3); i++) {
			if (gameMap[mapRowY + 2] === undefined) {
				tank.wall = false;
				return;
			}
			if (gameMap[mapRowY + 2][i] > 0) {
				if (((i * 20 + 20) > tank.posX) && ((i * 20) < tank.posX + tank.tankWidth) && tank.posY < (mapRowY * 20 + 20)) {
					tank.wall = true;
					return;
				}
			}
		}
		tank.wall = false;
		return;
	}
}

function bulletHitWall() {// Пуля на пути встречает стену
	var mapRowY = Math.floor(bullet.posY / 20);
	var mapCollX = Math.floor(bullet.posX / 20);
	if (tank.direction === 'top') {
		if (gameMap[Math.ceil(bullet.posY / 20) - 1] === undefined) {
			bullet.wall = false;
			return;
		}
		for (let i = mapCollX; i < (mapCollX + 3); i++) {
			if (gameMap[Math.ceil(bullet.posY / 20) - 1][i] > 0 && gameMap[Math.ceil(bullet.posY / 20) - 1][i] < 3) {
				if (((i * 20 + 20) > bullet.posX) && ((i * 20) < bullet.posX + bullet.width) && (bullet.posY) <= (mapRowY * 20 + 20)) {
					bullet.wall = true;
					bullet.bulletFly = false;
					bullet.shoot = false;
					bulletEl.style.opacity = '0';
					if (gameMap[Math.ceil(bullet.posY / 20) - 1][i] === 1) {
						let blackBlock = gameMap[Math.ceil(bullet.posY / 20) - 1][i];
						blackBlock = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
						mapImage.appendChild(blackBlock);
						blackBlock.setAttribute('x', blockWidth * i);
						blackBlock.setAttribute('y', blockWidth * (Math.ceil(bullet.posY / 20) - 1));
						blackBlock.setAttribute('width', blockWidth);
						blackBlock.setAttribute('height', blockWidth);
						blackBlock.setAttribute('fill', 'black');
						gameMap[Math.ceil(bullet.posY / 20) - 1][i] = 0;
					}
					blowAnimation(1, 1, 40);
					playSounds('getHit');
					setTimeout(resetBlowAnimation, 300);
					return;
				}
			}
		}
		bullet.wall = false;
		return;
	}
	if (tank.direction === 'left') {
		for (let i = mapRowY; i < (mapRowY + 2); i++) {
			if (gameMap[i] === undefined) {
				bullet.wall = false;
				return;
			}
			if (gameMap[i][Math.round(bullet.posX / 20)] > 0 && gameMap[i][Math.round(bullet.posX / 20)] < 3) {
				if ((mapCollX * 20) < bullet.posX + bullet.width && ((bullet.posY + bullet.width) > (i * 20)) && (bullet.posY < (i * 20 + 20))) {
					bullet.wall = true;
					bullet.bulletFly = false;
					bullet.shoot = false;
					bulletEl.style.opacity = '0';
					if (gameMap[i][Math.round(bullet.posX / 20)] === 1) {
						let blackBlock = gameMap[i][Math.ceil(bullet.posX / 20) - 1];
						blackBlock = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
						mapImage.appendChild(blackBlock);
						blackBlock.setAttribute('x', blockWidth * Math.round(bullet.posX / 20));
						blackBlock.setAttribute('y', blockWidth * i);
						blackBlock.setAttribute('width', blockWidth);
						blackBlock.setAttribute('height', blockWidth);
						blackBlock.setAttribute('fill', 'black');
						gameMap[i][Math.round(bullet.posX / 20)] = 0;
					}
					blowAnimation(1, 2, 40)
					playSounds('getHit');
					setTimeout(resetBlowAnimation, 300);
					return;
				}
			}
		}
		bullet.wall = false;
		return;
	}
	if (tank.direction === 'right') {
		for (let i = mapRowY; i < (mapRowY + 2); i++) {
			if (gameMap[i] === undefined) {
				bullet.wall = false;
				return;
			}
			if (gameMap[i][Math.ceil(bullet.posX / 20) - 1] > 0 && gameMap[i][Math.ceil(bullet.posX / 20) - 1] < 3) {
				if ((mapCollX * 20 + 20) > bullet.posX && ((bullet.posY + bullet.width) > (i * 20)) && (bullet.posY < (i * 20 + 20))) {
					bullet.wall = true;
					bullet.bulletFly = false;
					bullet.shoot = false;
					bulletEl.style.opacity = '0';
					if (gameMap[i][Math.ceil(bullet.posX / 20) - 1] === 1) {
						let blackBlock = gameMap[i][Math.ceil(bullet.posX / 20) - 1];
						blackBlock = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
						mapImage.appendChild(blackBlock);
						blackBlock.setAttribute('x', blockWidth * (Math.ceil(bullet.posX / 20) - 1));
						blackBlock.setAttribute('y', blockWidth * i);
						blackBlock.setAttribute('width', blockWidth);
						blackBlock.setAttribute('height', blockWidth);
						blackBlock.setAttribute('fill', 'black');
						gameMap[i][Math.ceil(bullet.posX / 20) - 1] = 0;
					}
					blowAnimation(1, 3, 40)
					playSounds('getHit');
					setTimeout(resetBlowAnimation, 300);
					return;
				}
			}
		}
		bullet.wall = false;
		return;
	}

	if (tank.direction === 'bottom') {
		for (let i = mapCollX; i < (mapCollX + 2); i++) {
			if (gameMap[Math.round(bullet.posY / 20)] === undefined) {
				bullet.wall = false;
				return;
			}
			if (gameMap[Math.round(bullet.posY / 20)][i] > 0 && gameMap[Math.round(bullet.posY / 20)][i] < 3) {
				if (((i * 20 + 20) > bullet.posX) && ((i * 20) < bullet.posX + bullet.width) && bullet.posY < (mapRowY * 20 + 20)) {
					bullet.wall = true;
					bullet.bulletFly = false;
					bullet.shoot = false;
					bulletEl.style.opacity = '0';
					if (gameMap[Math.round(bullet.posY / 20)][i] === 1) {
						let blackBlock = gameMap[Math.round(bullet.posY / 20)][i];
						blackBlock = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
						mapImage.appendChild(blackBlock);
						blackBlock.setAttribute('x', blockWidth * i);
						blackBlock.setAttribute('y', blockWidth * Math.ceil(bullet.posY / 20));
						blackBlock.setAttribute('width', blockWidth);
						blackBlock.setAttribute('height', blockWidth);
						blackBlock.setAttribute('fill', 'black');
						gameMap[Math.round(bullet.posY / 20)][i] = 0;
					}
					blowAnimation(1, 4, 40)
					playSounds('getHit');
					setTimeout(resetBlowAnimation, 300);
					return;
				}
			}
		}
		bullet.wall = false;
		return;
	}
}

function stopTank(e) {
	e = e || window.event;
	if (e.keyCode === 87 || e.keyCode === 83 || e.keyCode === 65 || e.keyCode === 68 || e.type === 'touchend') {
		tank.move = false;
	}
	delete tank.keysReposytory[e.keyCode];
	delete tank.keysReposytory[e.type];
	tankEl.style.animation = 'none';
	playSounds('tankStop');
	tank.moveSound = true;
}

// Анимация выстрела
function blowAnimation(n, d, animWidth) {// n - номер анимации, d - направление пули, animWidth - ширина анимации;
	map.appendChild(shootOfBullet);
	switch (d) {
		case 0:
			shootOfBullet.style.top = tank.posY - tank.tankWidth / 2 + 'px';
			shootOfBullet.style.left = tank.posX - tank.tankWidth / 2 + 'px';
			break;
		case 1:
			shootOfBullet.style.top = bullet.posY + bullet.width - animWidth + 'px';
			shootOfBullet.style.left = bullet.posX - animWidth / 2 + 'px';
			break;
		case 2:
			shootOfBullet.style.top = bullet.posY + bullet.width / 2 - animWidth / 2 + 'px';
			shootOfBullet.style.left = bullet.posX - bullet.width + 'px';
			break;
		case 3:
			shootOfBullet.style.top = bullet.posY + bullet.width / 2 - animWidth / 2 + 'px';
			shootOfBullet.style.left = bullet.posX + bullet.width - animWidth + 'px';
			break;
		case 4:
			shootOfBullet.style.top = bullet.posY - bullet.width + 'px';
			shootOfBullet.style.left = bullet.posX + bullet.width / 2 - animWidth / 2 + 'px';
			break;
		case 5:
			shootOfBullet.style.top = eagle.offsetTop - eagle.offsetWidth / 2 + 'px';
			shootOfBullet.style.left = eagle.offseLeft - eagle.offsetWidth / 2 + 'px';
			break;
	}
	if (n === 1) {
		shootOfBullet.style.width = '40px';
		shootOfBullet.style.height = '40px';
		shootOfBullet.style.background = 'url(image/boom.webp) no-repeat'
		shootOfBullet.style.animation = 'boom .3s 2 steps(4) alternate';
	} else if (n === 2) {
		shootOfBullet.style.width = '80px';
		shootOfBullet.style.height = '80px';
		shootOfBullet.style.background = 'url(image/tankBlow.webp) no-repeat'
		shootOfBullet.style.animation = 'tankBlow .4s 2 steps(6) alternate';
	}
}
function resetBlowAnimation() {
	shootOfBullet.remove();
}
//___________________________________________________________________


function setRandomAI(min, max) {
	let res = min + Math.random() * (max + 1 - min);
	return Math.floor(res);
}

function createOneTank() {
	allTanks[tanksNumber] = new createEnemyTank();
	var n = setRandomAI(1, 3);
	if ((n) % 3 === 0) {
		allTanks[tanksNumber].posX = map.offsetWidth - 40;
	} else if ((n) % 2 === 0) {
		allTanks[tanksNumber].posX = map.offsetWidth / 2 - 20;
	}
	allTanks[tanksNumber].createAITank();
	allTanks[tanksNumber].movement = true;
	allTanks[tanksNumber].bulletShoot = false;
	createTanksMachines = true
	tanksNumber++;
}

//_______________________________

function bulletHitEnemyTank(arr) {
	for (let i = 0; i < arr.length; i++) {
		if (bullet.direction === 'top' && (bullet.posY <= (arr[i].posY + arr[i].tankWidth)) && ((bullet.posY + bullet.width) >= (arr[i].posY + arr[i].tankWidth)) && (bullet.posX <= (arr[i].posX + arr[i].tankWidth)) && ((bullet.posX + bullet.width) >= arr[i].posX)) {
			arr[i].tank.remove();
			arr[i].bulletEl.remove();
			delete arr[i];
			arr = arr.splice(i, 1);
			tanksNumber--;
			score += 10;
			++tanksKilled;
			tanksKilledSpan.innerHTML = tanksKilled;
			scoreSpan.innerHTML = score;
			bullet.bulletFly = false;
			bullet.shoot = false;
			bulletEl.style.opacity = '0';
			blowAnimation(2, 1, 80);
			vibro(false);
			setTimeout(playSounds, 300, 'tankExplosion');
			setTimeout(resetBlowAnimation, 400);
		} else if (bullet.direction === 'left' && ((bullet.posX + bullet.width) >= arr[i].posX) && ((bullet.posX + bullet.width) <= (arr[i].posX + bullet.width)) && (bullet.posY <= (arr[i].posY + arr[i].tankWidth)) && ((bullet.posY + bullet.width) >= arr[i].posY)) {
			arr[i].tank.remove();
			arr[i].bulletEl.remove();
			delete arr[i];
			arr = arr.splice(i, 1);
			tanksNumber--;
			score += 10;
			++tanksKilled;
			tanksKilledSpan.innerHTML = tanksKilled;
			scoreSpan.innerHTML = score;
			bullet.bulletFly = false;
			bullet.shoot = false;
			bulletEl.style.opacity = '0';
			blowAnimation(2, 2, 80)
			vibro(false);
			setTimeout(playSounds, 300, 'tankExplosion');
			setTimeout(resetBlowAnimation, 400);
		} else if (bullet.direction === 'right' && (bullet.posX <= (arr[i].posX + arr[i].tankWidth)) && ((bullet.posX + bullet.width) >= (arr[i].posX + arr[i].tankWidth)) && (bullet.posY <= (arr[i].posY + arr[i].tankWidth)) && ((bullet.posY + bullet.width) >= arr[i].posY)) {
			arr[i].tank.remove();
			arr[i].bulletEl.remove();
			delete arr[i];
			arr = arr.splice(i, 1);
			tanksNumber--;
			score += 10;
			++tanksKilled;
			tanksKilledSpan.innerHTML = tanksKilled;
			scoreSpan.innerHTML = score;
			bullet.bulletFly = false;
			bullet.shoot = false;
			bulletEl.style.opacity = '0';
			blowAnimation(2, 3, 80);
			vibro(false);
			setTimeout(playSounds, 300, 'tankExplosion');
			setTimeout(resetBlowAnimation, 400);
		} else if (bullet.direction === 'bottom' && ((bullet.posY + bullet.width) >= arr[i].posY) && ((bullet.posY + bullet.width) <= (arr[i].posY + bullet.width)) && (bullet.posX <= (arr[i].posX + arr[i].tankWidth)) && ((bullet.posX + bullet.width) >= arr[i].posX)) {
			arr[i].tank.remove();
			arr[i].bulletEl.remove();
			delete arr[i];
			arr = arr.splice(i, 1);
			tanksNumber--;
			score += 10;
			++tanksKilled;
			tanksKilledSpan.innerHTML = tanksKilled;
			scoreSpan.innerHTML = score;
			bullet.bulletFly = false;
			bullet.shoot = false;
			bulletEl.style.opacity = '0';
			blowAnimation(2, 4, 80);
			vibro(false);
			setTimeout(playSounds, 300, 'tankExplosion');
			setTimeout(resetBlowAnimation, 400);
		}
	}
}

function killMyTank(n) {
	var self = n;
	if (self.bulletDirection === 1 && (self.bullPosY <= (tank.posY + tank.tankWidth)) && ((self.bullPosY + self.bulletWidth) >= (tank.posY + tank.tankWidth)) && (self.bullPosX <= (tank.posX + tank.tankWidth)) && ((self.bullPosX + self.bulletWidth) >= tank.posX)) {
		myTankDestroyed()
	} else if (self.bulletDirection === 2 && ((self.bullPosX + self.bulletWidth) >= tank.posX) && ((self.bullPosX + self.bulletWidth) <= (tank.posX + self.bulletWidth)) && (self.bullPosY <= (tank.posY + tank.tankWidth)) && ((self.bullPosY + self.bulletWidth) >= tank.posY)) {
		myTankDestroyed()
	} else if (self.bulletDirection === 3 && (self.bullPosX <= (tank.posX + tank.tankWidth)) && ((self.bullPosX + self.bulletWidth) >= (tank.posX + tank.tankWidth)) && (self.bullPosY <= (tank.posY + tank.tankWidth)) && ((self.bullPosY + self.bulletWidth) >= tank.posY)) {
		myTankDestroyed()
	} else if (self.bulletDirection === 4 && ((self.bullPosY + self.bulletWidth) >= tank.posY) && ((self.bullPosY + self.bulletWidth) <= tank.posY + self.bulletWidth) && (self.bullPosX <= (tank.posX + tank.tankWidth)) && ((self.bullPosX + self.bulletWidth) >= tank.posX)) {
		myTankDestroyed()
	}
}

function killMyBase(n) {
	var self = n;
	if (self === undefined) {
		return;
	}
	if (self.bulletDirection === 3 && (self.bullPosX <= eagle.offsetLeft + eagle.offsetWidth) && ((self.bullPosX + self.bulletWidth) >= eagle.offsetLeft) && ((self.bullPosY + self.bulletWidth) >= eagle.offsetTop)) {
		myBaseDestroyed()
	} else if (self.bulletDirection === 2 && ((self.bullPosX + self.bulletWidth) >= eagle.offsetLeft) && (self.bullPosX <= (eagle.offsetLeft + eagle.offsetWidth)) && ((self.bullPosY + self.bulletWidth) >= eagle.offsetTop)) {
		myBaseDestroyed()
	} else if (self.bulletDirection === 4 && ((self.bullPosY + self.bulletWidth) >= eagle.offsetTop) && (self.bullPosX <= (eagle.offsetLeft + eagle.offsetWidth)) && ((self.bullPosX + self.bulletWidth) >= eagle.offsetLeft)) {
		myBaseDestroyed()
	}
}

function myTankDestroyed() {
	stopAllEnemyTanks(allTanks);
	tankEl.remove();
	bulletEl.remove();
	playSounds('resetSound');
	vibro(true);
	blowAnimation(2, 0, 40);
	setTimeout(playSounds, 300, 'tankExplosion');
	setTimeout(resetBlowAnimation, 400);
	setTimeout(playSounds, 1000, 'getLoose');
	setTimeout(gameOverNow, 2200);
}

function myBaseDestroyed() {
	stopAllEnemyTanks(allTanks);
	tankEl.remove();
	bulletEl.remove();
	eagle.style.background = 'url(image/gameSprait.webp) -64px -41px no-repeat';
	playSounds('resetSound');
	vibro(true);
	blowAnimation(2, 5, 80);
	setTimeout(playSounds, 300, 'baseRuined');
	setTimeout(resetBlowAnimation, 400);
	setTimeout(playSounds, 1000, 'getLoose');
	setTimeout(gameOverNow, 2200);
}


function stopAllEnemyTanks(arr) {
	let key;
	for (key of arr) {
		key.movement = false;
		key.bulletShoot = false;
		key.bulletFly = false;
	}
	TANKCREATEPOSITIONS = 0;
	allTanks = [];
	stopGame = true;
	window.removeEventListener('keydown', turnTank);
	window.removeEventListener('keyup', stopTank);
	imgElem.removeEventListener('touchmove', ballTouchMove);
	imgElem.removeEventListener('touchstart', ballTouchStart);
	imgElem.removeEventListener('touchend', ballTouchEnd);
	fireButton.removeEventListener('touchstart', veryPowerfulFire);
}

function gameOverNow() {
	addnewHighscore(score);
	highscoreBlockAjax();
	var over = document.querySelector('.gameOver');
	var overWrapper = document.querySelector('.gameOverWrapper');
	var butYes = document.getElementById('yes');

	over.style.transform = `translateY(0)`;
	over.style.opacity = '1';
	over.style.zIndex = '5';

	setTimeout(() => { overWrapper.style.opacity = '1' }, 2000);

	butYes.addEventListener('click', function (e) {
		e = e || window.event;
		e.preventDefault();
		over.style.transform = `translateY(-100%)`;
		over.style.opacity = '0';

	});


}

