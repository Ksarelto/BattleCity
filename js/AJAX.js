'use strict'

var ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php";
var nameAjax = 'Murasko_Artsion_BattleCity_Highscore';
// var highscoreAjaxArray;
var passwordAjax;


//Читается с сервера значение рекордов и переносится в массив
function readHighscore() {
    $.ajax(
        {
            url: ajaxHandlerScript,
            type: 'POST',
            cache: false,
            dataType: 'json',
            data: { f: 'READ', n: nameAjax },
            success: function (res) {
                if (res.result != "") {
                    highscoreAjaxArray = JSON.parse(res.result);
                    updateHighscoreTable(highscoreAjaxArray);
                } else if (res.error != undefined) {
                    alert('Ошибка получения данных с сервера');
                    highscoreAjaxArray = [];
                }
            },
            error: errorHandler
        }
    );
}

function updateHighscoreTable(arr) { // Создается новая строчна рекорда в таблице рекордов
    var table = document.querySelector('.table');
    if (table === null) {
        return;
    }
    arr.sort((a, b) => a.Score > b.Score ? -1 : 1);

    arr.forEach(function (el, ind) {
        el = document.createElement('div');
        el.classList.add('playersScore');
        el.innerHTML = `<span>${ind + 1}</span>
						<span>${arr[ind].PlayerName}</span>
						<span>${arr[ind].Score}</span>`
        table.appendChild(el);
    })
}

//____________________________________________________________________________
// Добавление новых значений в массив результатов

function addnewHighscore(score) { // Добавляет результат игры в массив результатов
    var obj = {};
    var name = prompt('Введите свой ник', 'Player');
    if (name === null) {
        name = 'Player';
    }
    obj.PlayerName = name;
    obj.Score = score;
    highscoreAjaxArray.push(obj);
}


function highscoreBlockAjax() { // Берет массив результатов из AJAX и блокирует его
    passwordAjax = Math.random();
    $.ajax({
        url: ajaxHandlerScript,
        type: 'POST',
        cache: false,
        dataType: 'json',
        data: { f: 'LOCKGET', n: nameAjax, p: passwordAjax },
        success: updateHighscoreAjax,
        error: errorHandler
    }
    );
}

function updateHighscoreAjax(res) {// Изменяет заблокированный массив результов
    if (res.error != undefined)
        alert('Ошибка получения данных с сервера');
    else {
        $.ajax({
            url: ajaxHandlerScript, type: 'POST', cache: false, dataType: 'json',
            data: { f: 'UPDATE', n: nameAjax, v: JSON.stringify(highscoreAjaxArray), p: passwordAjax },
            success: updateReady, error: errorHandler
        }
        );
    }
}
// ___________________________________________________________________________________
function updateReady(callresult) {
    if (callresult.error != undefined) {
        alert(callresult.error);
    }

};

function errorHandler(jqXHR, statusStr, errorStr) {
    alert(statusStr + ' ' + errorStr);
};