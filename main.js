var day = 1; //arbitrary default
if (document.getElementById('index_identifier') === null)
{
    day = document.getElementById('day_identifier').classList.value;
}
else //index page
{
    day = jumpleDay;
}

//mapList constructor: {name, image_path, intended_class, tier, author, link}
const map = mapList[day - 1];
let guesses = 0;
const max_guesses = 5;
let solved = false;
let input = document.getElementById('input');
let inputDisplay = document.getElementById('input_display');
let inputHistory = document.getElementById('input_history');
var resultsTracker = ''; //populated by localStorage if it exists
var resultsHistory = []; //populated by localStorage if it exists

//set day specific parts of page
function initializeMap() {
    document.getElementById('share_container').style.display = 'none';
    document.getElementById('day_number').innerHTML = 'Jumple Day ' + day;
    document.getElementById('screenshot').src = 'assets/maps/' + day + '/1.jpg';

    input.addEventListener('keypress', function (pressed) {
        if (pressed.key === 'Enter' && !solved) {
            pressed.preventDefault();
            if (input.value.length > 0 && guesses < max_guesses) {
                checkInput();
            }
        }
    });

    for (let i = 1; i <= max_guesses; i++) {
        document.getElementById('hint_' + i).onclick = function () {
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
                document.getElementById('map_hint').innerHTML = 'Intended Class: ' + map.intended_class;
                break;
            case 4:
                document.getElementById('map_hint').innerHTML = 'Tier: ' + map.tier;
                break;
            case 5:
                document.getElementById('map_hint').innerHTML = 'Author(s): ' + map.author;
                break;
            default:
                document.getElementById('map_hint').innerHTML = '';
        }
    }
}

//check input against solutions
function checkInput() {
    if (!guesses) //workaround for border appearing while element is empty
    {
        document.getElementById('input_history').classList.add('border');
    }


    let inputGuess = input.value.toLowerCase();
    input.value = ''; //input box can be cleared after it's stored
    guesses++;
    //if the input is empty, it was skipped
    if (inputGuess.length === 0) {
        resultsHistory.push('skipped');
        localStorage.setItem('day' + day + '_history', JSON.stringify(resultsHistory));
        inputHistory.innerHTML += 'Guess #' + guesses + ' (skipped)<br>';
    }
    else {
        resultsHistory.push(inputGuess);
        localStorage.setItem('day' + day + '_history', JSON.stringify(resultsHistory));
        inputHistory.innerHTML += 'Guess #' + guesses + ' (' + inputGuess + ')<br>';
    }

    for (let i = 0; i < 3; i++) {
        if (inputGuess === map.name[i]) {
            solved = true;
        }
    }
    checkIfSolved(solved);
}

//skip button
function skip() {
    if (guesses < max_guesses && !solved) {
        input.value = ''; //clear input box to skip
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
        document.getElementById('hint_' + guesses).classList.add('correct');
        resultsTracker += '1';
        localStorage.setItem('day' + day + '_result', resultsTracker);
        revealAllHints();
        end();
    }
    else //incorrect guess
    {
        document.getElementById('hint_' + guesses).classList.add('incorrect');
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
    if (document.getElementById('hint_' + number).className.includes('disabled')) //safeguard to not re-disable
    {
        document.getElementById('hint_' + number).classList.toggle('disabled');
    }
}

function revealAllHints() {
    for (let i = 1; i <= max_guesses; i++) {
        if (document.getElementById('hint_' + i).className.includes('disabled'))  //safeguard to not re-disable
        {
            document.getElementById('hint_' + i).classList.toggle('disabled');
        }
    }
}

//show map name & results sharing
function end() {
    setTimeout(() => //wait for hint button animation to finish
    {
        document.getElementById('map_name').innerHTML = map.name[0];
        document.getElementById('map_link').href = map.link;
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
    document.getElementById('share_container').style.display = ''; //unhide
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

        document.getElementById('input_history').classList.add('border');
        guesses = resultsTracker.length;

        for (let i = 0; i < guesses; i++) {
            inputHistory.innerHTML += 'Guess #' + (i + 1) + ' (' + resultsHistory[i] + ')<br>';
            if (resultsTracker[i] === '1') {
                document.getElementById('hint_' + (i + 1)).classList.add('correct');
                solved = true;
            }
            else //0
            {
                document.getElementById('hint_' + (i + 1)).classList.add('incorrect');
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

//end of functions
initializeMap();
checkLocalStorage();