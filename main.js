var day = 1; //arbitrary default
var currentDay = 1; //default
var map = mapList[rngList[day-1]-1]; //default
//mapList constructor: {name, intended_class, tier, author, link}
let guesses = 0;
const max_guesses = 5;
let solved = false;
const mapHintElement = document.getElementById('map_hint');
const inputElement = document.getElementById('input');
const inputHistoryElement = document.getElementById('input_history');
const autocompleteElement = document.getElementById('autocomplete');
var activeAutocompleteTermID = 0;
var activeAutocompleteTermElement = document.getElementById('autocomplete'); //placeholder
var autocompleteTerms = [];
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
            day = parseInt((url.substring(url.lastIndexOf('/') + 1,url.length))); //get day # from url
            map = mapList[rngList[day-1]-1];
            if (day <= currentDay && day > 0) {
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
        day = parseInt(text);
        map = mapList[rngList[day-1]-1];
        initializeMap();
        checkLocalStorage();
    });
}

//set day specific parts of page
function initializeMap() {
    document.getElementById('share_container').style.display = 'none';
    document.getElementById('day_number').innerHTML = 'Jumple Day ' + day;
    document.getElementById('screenshot').src = 'assets/maps/' + day + '/1.jpg';

inputElement.addEventListener('keydown', function (pressed) { //active element tracking
    if(autocompleteTerms.length > 0)
    {
        if(pressed.key === 'Tab')
        {
            pressed.preventDefault();
            fillAutocompleteWithActiveTerm();
        }
        else if(pressed.key === 'ArrowUp')
        {
            pressed.preventDefault();
            if(activeAutocompleteTermID > 0)
            {
                setActiveAutocompleteElement(activeAutocompleteTermID - 1);
                activeAutocompleteTermElement.scrollIntoView();
            }
        }
        else if(pressed.key === 'ArrowDown')
        {
            pressed.preventDefault();
            if(activeAutocompleteTermID < autocompleteTerms.length - 1)
            {
                setActiveAutocompleteElement(activeAutocompleteTermID + 1);
                activeAutocompleteTermElement.scrollIntoView();
            }
        }
        
    }
});

inputElement.addEventListener('keyup', function (pressed) {
    if(autocompleteTerms.length > 0)
    {
        pressed.preventDefault();
    }
    if (!solved && pressed.key != 'Tab' && pressed.key != 'ArrowUp' && pressed.key != 'ArrowDown') 
    {
        displayAutocomplete();
    }
});


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

    window.onclick = function (event) { //for autocomplete unfocus
        if (event.target != autocompleteElement)
        {
        autocompleteElement.style.visibility = 'hidden';
        }
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


    let inputGuess = formatInput(inputElement.value);

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

function displayAutocomplete()
{
    
        autocompleteElement.style.visibility = 'visible';
        autocompleteElement.innerHTML = '';
        let autocompleteList = '';
        if (inputElement.value.length > 1) { //too many operations with just 1 letter
        autocompleteTerms = matchToAutocomplete(inputElement.value);

        for (let i = 0; i < autocompleteTerms.length; i++) {
            autocompleteList += '<li id="li' + i + '">' + autocompleteTerms[i] + '</li>'; //<id="li1"
        }

        autocompleteElement.innerHTML = '<ul>' + autocompleteList + '</ul>';
        if (autocompleteTerms.length > 0) {
            setActiveAutocompleteElement(0);
            for (let i = 0; i < autocompleteTerms.length; i++) {
                document.getElementById('li' + i).addEventListener('mouseover', function () {
                    setActiveAutocompleteElement(i);
                });
                document.getElementById('li' + i).addEventListener('click', function () {
                    fillAutocompleteWithActiveTerm();

                });
            }
        }
    }
}
function matchToAutocomplete()
{
    if(inputElement.value.length === 0)
    {
        autocompleteElement.style.border = 'none';
        return [];
    }

    let reg = new RegExp(inputElement.value);

    autocompleteElement.style.border = '2px solid darkgray'; //TODO: workaround, maybe
    autocompleteElement.style.borderRight = 'none';

    return autoCompleteList.filter(function(term) {
        if(term.match(reg))
        {
            return term;
        }
    });
}

function setActiveAutocompleteElement(id)
{
    if(activeAutocompleteTermElement.classList.contains('active')) //remove current if it exists
    {
        activeAutocompleteTermElement.classList.remove('active');
    }
    activeAutocompleteTermElement = document.getElementById('li' + id);
    activeAutocompleteTermElement.classList.add('active'); //add new
    activeAutocompleteTermID = id;
}

function fillAutocompleteWithActiveTerm()
{
    inputElement.value = activeAutocompleteTermElement.innerHTML;
    activeAutocompleteTermElement.classList.remove('active');
    autocompleteTerms = [];
    autocompleteElement.innerHTML = '';
    autocompleteElement.style.border = 'none';
    inputElement.focus();
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

function formatInput(guess)
{
    guess = guess.toLowerCase();
    guess = guess.replace(/\s/g, '');
    return guess;
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


