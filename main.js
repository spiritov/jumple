var day = 1; //arbitrary default
var currentDay = 1; //default
var map = mapList[rngList[day-1]-1]; //default
//mapList constructor: {name, intended_class, tier, author, link}
let guesses = 0;
const max_guesses = 5;
let solved = false;
const mapHintElement = document.getElementById('map_hint');
const inputElement = document.getElementById('input');
const inputDisplayElement = document.getElementById('input_display');
const inputHistoryElement = document.getElementById('input_history');
var resultsTracker = ''; //populated by localStorage if it exists
var resultsHistory = []; //populated by localStorage if it exists
const hintElements = [
    document.getElementById("hint_1"),
    document.getElementById("hint_2"),
    document.getElementById("hint_3"),
    document.getElementById("hint_4"),
    document.getElementById("hint_5"),
];

if (document.getElementById('index_identifier') === null) //must be day page
{
    fetch('jumple_day_number.txt?')
        .then(function (response) {
            return response.text();
        })
        .then(function (text) {
            currentDay = parseInt(text);
            const url = window.location.href;
            day = parseInt((url.charAt(url.lastIndexOf('/') + 1))); //get day # from url
            if (day <= currentDay) {
                initializeMap();
                checkLocalStorage();
            }
            else //invalid response
            {
                mapHintElement.innerHTML = 'this day is not available yet!';
                document.getElementById('screenshot').src = 'assets/site/no_day.jpg';
            }
        });
}
else //index page
{
    fetch('jumple_day_number.txt?')
    .then(function(response) {
        return response.text();
    })
    .then(function(text) {
        currentDay = parseInt(text);
        map = mapList[rngList[currentDay-1]-1];
        initializeMap();
        checkLocalStorage();
    });
}

//set day specific parts of page
function initializeMap() {
    document.getElementById('share_container').style.display = 'none';
    document.getElementById('day_number').innerHTML = 'Jumple Day ' + day;
    document.getElementById('screenshot').src = 'assets/maps/' + day + '/1.jpg';

    inputElement.addEventListener('keypress', function (pressed) {
        if (pressed.key === 'Enter' && !solved) {
            pressed.preventDefault();
            if (inputElement.value.length > 0 && guesses < max_guesses) {
                checkInput();
            }
        }
    });

    for (let i = 1; i <= max_guesses; i++) {
        hintElements[i-1].onclick = function () {
            show(i);
        }
    }

    document.getElementById('skip').onclick = function () {
        skip();
    }

}

//set image and text hint
function show(hint_number) {
    if (hint_number <= max_guesses) { //don't try to show a hint that doesn't exist
        document.getElementById('screenshot').src = 'assets/maps/' + day + '/' + hint_number + '.jpg';
        switch (hint_number) {
            case 3:
                mapHintElement.innerHTML = 'Intended Class: ' + map.intended_class;
                break;
            case 4:
                mapHintElement.innerHTML = 'Tier: ' + map.tier;
                break;
            case 5:
                mapHintElement.innerHTML = 'Author(s): ' + map.author;
                break;
            default:
                mapHintElement.innerHTML = '';
        }
    }
}

//check input against solutions
function checkInput() {
    if (!guesses) //workaround for border appearing while element is empty
    {
        inputHistoryElement.classList.add('border');
    }


    let inputGuess = inputElement.value.toLowerCase();
    inputElement.value = ''; //input box can be cleared after it's stored
    guesses++;
    //if the input is empty, it was skipped
    if (inputGuess.length === 0) {
        resultsHistory.push('skipped');
        localStorage.setItem('day' + day + '_history', JSON.stringify(resultsHistory));
        inputHistoryElement.innerHTML += 'Guess #' + guesses + ' (skipped)<br>';
    }
    else {
        resultsHistory.push(inputGuess);
        localStorage.setItem('day' + day + '_history', JSON.stringify(resultsHistory));
        inputHistoryElement.innerHTML += 'Guess #' + guesses + ' (' + inputGuess + ')<br>';
    }

    for (let i = 0; i < map.name.length; i++) {
        if (inputGuess === map.name[i]) {
            solved = true;
        }
    }
    checkIfSolved(solved);
}

//skip button
function skip() {
    if (guesses < max_guesses && !solved) {
        inputElement.value = ''; //clear input box to skip
        checkInput();
        if (guesses === max_guesses) {
            end();
        }
    }
}

//end game if solved, revealHint() otherwise
function checkIfSolved(solved) {
    if (solved) //correct guess, end game
    {
        hintElements[guesses - 1].classList.add('correct');
        resultsTracker += '1';
        localStorage.setItem('day' + day + '_result', resultsTracker);
        revealAllHints();
        end();
    }
    else //incorrect guess
    {
        hintElements[guesses - 1].classList.add('incorrect');
        resultsTracker += '0';
        localStorage.setItem('day' + day + '_result', resultsTracker);
        if (guesses < max_guesses) {
            revealHint(guesses + 1);
            setTimeout(() => //wait for hint button animation to finish
            {
                show(guesses + 1);
            }, 500);
        }
        else if (guesses === max_guesses) //last guess
        {
            end();
        }
    }
}

function revealHint(number) {
    if (hintElements[number-1].className.includes('disabled')) //safeguard to not re-disable
    {
        hintElements[number-1].classList.toggle('disabled');
    }
}

function revealAllHints() {
    for (let i = 0; i < max_guesses; i++) {
        if (hintElements[i].className.includes('disabled'))  //safeguard to not re-disable
        {
            hintElements[i].classList.toggle('disabled');
        }
    }
}

//show map name & results sharing
function end() {
    setTimeout(() => //wait for hint button animation to finish
    {
        document.getElementById('map_name').innerHTML = map.name[0];
        document.getElementById('map_name').classList.add('active');
        document.getElementById('map_link').href = map.link;
        document.getElementById('skip').classList.add('disabled');
        shareResults();
    }, 500);
}

//should function for both twitter and clipboard
function getResultsString(results) {
    results = results.replace('1', '🟩');
    results = results.replaceAll('0', '🟥');
    return results;
}

function shareResults() {
    const resultsString = getResultsString(resultsTracker);
    document.getElementById('share_container').style.display = 'block'; //unhide
    const twitter = document.getElementById('twitter');
    const clipboard = document.getElementById('clipboard');
    twitter.innerHTML = 'tweet results';
    twitter.onclick = function () {
        document.getElementById('twitter_link').href =
            'https://twitter.com/intent/tweet?text=' +
            '🚀%20Jumple%20Day%20' + day + '%0A' +
            resultsString + '%0A%0A' +

            'play%20at&url=jumple.xyz';
    };

    clipboard.innerHTML = 'copy results';
    clipboard.onclick = function () {
        navigator.clipboard.writeText(
            '🚀 Jumple Day ' + day + '\n' +
            resultsString
        );
        clipboard.innerHTML = 'copied!';
    };
}

function getResultsString(results) {
    results = results.replaceAll('0', '🟥');
    results = results.replace('1', '🟩');
    return results;
}

//set game from storage if it exists
function checkLocalStorage() {
    if (localStorage.getItem('day' + day + '_result') && localStorage.getItem('day' + day + '_history')) {
        //populate game state
        resultsTracker = localStorage.getItem('day' + day + '_result');
        resultsHistory = JSON.parse(localStorage.getItem('day' + day + '_history'))

        inputHistoryElement.classList.add('border');
        guesses = resultsTracker.length;

        for (let i = 0; i < guesses; i++) {
            inputHistoryElement.innerHTML += 'Guess #' + (i + 1) + ' (' + resultsHistory[i] + ')<br>';
            if (resultsTracker[i] === '1') {
                hintElements[i].classList.add('correct');
                solved = true;
            }
            else //0
            {
                hintElements[i].classList.add('incorrect');
                if (guesses < max_guesses) {
                    revealHint(i + 2);
                }
            }
        }

        if (solved || guesses === max_guesses) {
            revealAllHints();
            end();
        }
    }
    else {
        localStorage.setItem('day' + day + '_result', '');
        localStorage.setItem('day' + day + '_history', JSON.stringify(resultsHistory));
    }
}
