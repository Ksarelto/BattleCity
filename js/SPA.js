'use strict'
var startNewGame = false;
var reloadPage = false;
var popstateVariable = false;
var SPAState = {};
var highscoreAjaxArray;
var scale = 1;
// window.onhashchange = switchToStateFromURLHash;

window.addEventListener('hashchange', switchToStateFromURLHash);

function switchToStateFromURLHash(e) {
	e = e || window.event;

	var URLHash = window.location.hash;

	var stateStr = URLHash.substr(1);

	if (stateStr != "") {
		SPAState = { pagename: stateStr };
	}
	else
		SPAState = { pagename: 'Main' };

	var pageHTML = "";
	switch (SPAState.pagename) {
		case 'Main':
			pageHTML += `<div class="wrap">
		<div class="container" id="mainPage">
			<img src="image/battle-city.webp">
			<form action="POST">
				<input type="button" value="New Game" onclick="startGame()">
				<input id="openOpt" type="button" value="Options" onclick="showOptions()">
				<input id="highScore" type="button" value="Highscores" onclick="goToHighscore()">
				<input id='credits' type="button" value="Controls & Rules" onclick="goToControls()">
				<a href="https://worldoftanks.ru/">Exit</a>
			</form>

		</div>
	</div>

	<div class="options" id="opt">
		<form name='sound-and-vibraion'>
			<input id="exitOpt" type="button" name="exit" value="X" onclick="closeOptions()">
			<div class="sound">
				<label> Sound:</label>
				<input type="checkbox" name="sound" onclick='checkSoundsAndVibration()'><span>Off</span>
			</div>
			<div class="vibration">
				<label> Vibration:</label>
				<input type="checkbox" name="vibro" onclick='checkSoundsAndVibration()'><span>Off</span>
			</div>
			<div class="fullscreen">
				<label> Fullscreen:</label>
				<input type="radio" name="fullScr" onclick='fullScreenOn()'><span>On</span>
				<input type="radio" name="fullScr" onclick='fullScreenOff()'><span>Off</span>
			</div>
		</form>
	</div>

				`;
			reloadPage = false;
			break;
		case 'HighScore':
			pageHTML = `<div class="highscore" id="score">
						<div class="highContainer">
							<span id="exitHighScore" onclick="goToMain()">X</span>
							<h2>Highscores</h2>
							<div class="table">
								<div class="table_discript">
									<span>Number</span>
									<span>Player Name</span>
									<span>Score</span>
								</div>
								<div class="playersScore">
								</div>
							</div>
						</div>
					</div>`;
			readHighscore();
			break;
		case 'Controls':
			pageHTML = `<div class="highscore" id="score">
						<div class="controlsContainer">
							<span id="exitHighScore" onclick="goToMain()">X</span>
							<div class="controlsList">
								<h2>Controls</h2>
								<ol>
									<li>Forward - <span>W</span></li>
									<li>Back - <span>S</span></li>
									<li>Left - <span>D</span></li>
									<li>Right - <span>A</span></li>
									<li>Fire - <span>F</span></li>
									<li>If your device supports touchscreen, a joystick and a firebutton will appear</li>	
								</ol>
							</div>
							<div class="rulesList">
								<h2>Rules</h2>
								<p>The game is that you have to destroy enemy tanks and earn points. Also, you must defend your base. If they kill you or destroy the base, the game will end. Points earned before the loss will be added to your account. Good luck!</p>
							</div>
						</div>
					</div>`;
			break;
		case 'NewGame':
			pageHTML += `<div class="field">
							<div class="map">
								<div class="gameOver">
									<p>GAME OVER</p>
									<div class="gameOverWrapper">
										<span>Чтобы начать новую игру нужно вернуться на <b>Главную страницу</b> с помощью кнопки назад</span>
										<form>
											<button id="yes">Закрыть</button>
										</form>
									</div>
								</div>
							</div>
							<div class='joystick'>
								<svg width="100%" height="100%" viewBox="0 0 100 100" position = 'relative' z-index='2'>
								    <defs>
								      <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
								        <stop offset="0%" style="stop-color:rgb(16,16,16);stop-opacity:1" />
								        <stop offset="100%" style="stop-color:rgb(240,240,240);stop-opacity:1" />
								      </linearGradient>
								      <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
								        <stop offset="0%" style="stop-color:rgb(240,240,240);stop-opacity:1" />
								        <stop offset="100%" style="stop-color:rgb(16,16,16);stop-opacity:1" />
								      </linearGradient>
								      <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
								        <stop offset="0%" style="stop-color:rgb(168,168,168);stop-opacity:1" />
								        <stop offset="100%" style="stop-color:rgb(239,239,239);stop-opacity:1" />
								      </linearGradient>
								    </defs>
								    <circle cx="50" cy="50" r="50" fill="url(#grad1)" />
								    <circle cx="50" cy="50" r="47" fill="url(#grad2)" stroke="black" stroke-width="1.5px" />
								    <circle cx="50" cy="50" r="44" fill="url(#grad3)" />
								    <path d="M50,14 54,22 46,22Z" fill="rgba(0,0,0,0.8)" />
								    <path d="M50,86 54,78 46,78Z" fill="rgba(0,0,0,0.8)"  />
								    <path d="M14,50 22,54 22,46Z" fill="rgba(0,0,0,0.8)" />
								    <path d="M86,50 78,54 78,46Z" fill="rgba(0,0,0,0.8)" />
								    <circle id = 'move' cx="50" cy="50" r="20" fill="#cccccc" stroke="black" stroke-width="1px"  />
								</svg>
							</div>
							<button class='fireButton' >FIRE!</button>	
							<div class = 'scoreTable'>
								<p class='killedTanks'>Killed Tanks: <span></span></p>
								<p class='totalScore'>Score: <span></span></p>
							</div>		
	                    </div>`;
			reloadPage = true;
			changeWindowSize();
			break;
	}
	document.body.innerHTML = pageHTML;

	if (reloadPage) {
		window.addEventListener('popstate', restartGame);
	} else {
		window.removeEventListener('popstate', restartGame);
	};


}

window.onbeforeunload = befUnload;

function befUnload(e) {
	e = e || window.event;
	if (reloadPage === true && popstateVariable === true) {
		return 'Для корректной работы приложения, вернитесь на главную страницу!';
	}
};

function restartGame(e) {
	e = e || window.event;
	popstateVariable = false;
	var answer = alert('Для корректной работы приложения страница будет перезагружена. Вы будете возвращены на главную страницу.');
	window.removeEventListener('popstate', restartGame);
	goToMain();
	window.location.reload();
}

function switchToState(newState) {
	var stateStr = newState.pagename;
	location.hash = stateStr;
}


function goToMain() {
	switchToState({ pagename: 'Main' });
}

function goToHighscore() {
	switchToState({ pagename: 'HighScore' });
}

function goToNewGame() {
	switchToState({ pagename: 'NewGame' });
}
function goToControls() {
	switchToState({ pagename: 'Controls' });
}
function goToMainFromNewGame() {
	goToMain();
	window.location.reload();
}
switchToStateFromURLHash()

function startGame(e) {
	e = e || window.event;
	goToNewGame();
	startNewGame = true;
	stopGame = false;
	popstateVariable = true;
	setTimeout(mapInit, 0);
	audioInit();
	playSounds('introPlay');
	setTimeout(function () {
		requestAnimationFrame(tankMove);
		window.addEventListener('keydown', turnTank);
		window.addEventListener('keyup', stopTank);
		if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
			touchField.style.display = 'block';
			fireButton.style.display = 'inline-block';
			imgElem.addEventListener('touchstart', ballTouchStart);
			imgElem.addEventListener('touchmove', ballTouchMove);
			imgElem.addEventListener('touchend', ballTouchEnd);
			fireButton.addEventListener('touchstart', veryPowerfulFire);
		}
	}, 4000);

};

//Определение размера экрана для изменения маштаба


function changeWindowSize() {

	if (reloadPage) {

		var metaTags = document.querySelectorAll('meta');
		var tag;

		for (let i = 0; i < metaTags.length; i++) {
			if (metaTags[i].name === 'viewport') {
				tag = metaTags[i];
			}
		}


		if (document.documentElement.clientHeight < 600 / scale && document.documentElement.clientHeight > 350 / scale) {
			tag.content = 'width=device-width, initial-scale=0.5, user-scalable=no';
			scale = 0.5;
		}
		else if (document.documentElement.clientHeight < 350 / scale) {
			tag.content = 'width=device-width, initial-scale=0.5, user-scalable=no';
			scale = 0.35;
		}
		else if (document.documentElement.clientWidth < 800 / scale && document.documentElement.clientWidth > 600 / scale) {
			tag.content = 'width=device-width, initial-scale=0.75, user-scalable=no';
			scale = 0.75;
		} else if (document.documentElement.clientWidth < 600 / scale && document.documentElement.clientWidth > 400 / scale) {
			tag.content = 'width=device-width, initial-scale=0.5, user-scalable=no';
			scale = 0.5;
		} else if (document.documentElement.clientWidth < 400 / scale || document.documentElement.clientHeight < 600 / scale) {
			tag.content = 'width=device-width, initial-scale=0.35, user-scalable=no';
			scale = 0.35;
		} else {
			tag.content = 'width=device-width, initial-scale=1, user-scalable=no';
			scale = 1;
		}
	}
}