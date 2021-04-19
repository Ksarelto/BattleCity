'use strict'

var touchShiftX = 0;
var touchShiftY = 0;

function ballTouchStart(EO) {
  EO.preventDefault();

  var touchInfo = EO.targetTouches[0];
  touchShiftX = (touchInfo.pageX - touchField.offsetLeft) / (touchField.offsetWidth / 100);
  touchShiftY = (touchInfo.pageY - touchField.offsetTop) / (touchField.offsetHeight / 100);

  imgElem.setAttribute('cx', touchShiftX);
  imgElem.setAttribute('cy', touchShiftY);
}

function ballTouchEnd(EO) {
  EO.preventDefault();

  imgElem.setAttribute('cx', 50);
  imgElem.setAttribute('cy', 50);
  stopTank(EO);
}

function ballTouchMove(EO) {
  EO.preventDefault();
  var touchInfo = EO.targetTouches[0];

  let moveX = (touchInfo.pageX - touchField.offsetLeft) / (touchField.offsetWidth / 100);
  let moveY = (touchInfo.pageY - touchField.offsetTop) / (touchField.offsetWidth / 100);

  if (moveX <= 22) {
    imgElem.setAttribute('cx', 22);
  } else if (moveX >= 78) {
    imgElem.setAttribute('cx', 78);
  } else {
    imgElem.setAttribute('cx', moveX);
  }


  if (moveY <= 22) {
    imgElem.setAttribute('cy', 22);
  } else if (moveY >= 78) {
    imgElem.setAttribute('cy', 78);
  } else {
    imgElem.setAttribute('cy', moveY);
  }

  if ((moveX > 35 && moveX < 60) && (moveY < 45 && moveY > 22)) {
    turnTank(EO, 'top');
  } else if ((moveX > 55 && moveX < 78) && (moveY < 60 && moveY > 35)) {
    turnTank(EO, 'left');
  } else if ((moveX > 22 && moveX < 45) && (moveY < 60 && moveY > 35)) {
    turnTank(EO, 'right');
  } else if ((moveX > 35 && moveX < 60) && (moveY < 78 && moveY > 55)) {
    turnTank(EO, 'bottom');
  }

}


function veryPowerfulFire(e) {
  e = e || window.event;
  turnTank(e, 'FIRE');
}
