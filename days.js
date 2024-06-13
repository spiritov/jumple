//create as many day buttons as 'jumple_day.txt'
var jumple_day_number = 1;
var dayDisplays = [];
var backgroundPreset = '1';
const backgroundContainerElement = document.getElementById('background_container');
const backgroundGradientElement = document.getElementById('background_gradient');
const background_toggle_element = document.getElementById('background_toggle');

fetch('jumple_day_number.txt')
    .then(function (response) {
        return response.text();
    })
    .then(function (text) {
        displayDaysList(parseInt(text));
        jumple_day_number = parseInt(text);
    });

var allDaysElement = document.getElementById('all_days');
var activeAppendContainerID = 1;

function displayDaysList(days) {
    allDaysElement = document.getElementById('all_days');
    activeAppendContainerID = 0;
    for (let i = 1; i <= days; i++) {
        if (i % 30 === 1) {
            addContainer(i);
        }
        setDisplay(i);
    }
    toggleContainer(activeAppendContainerID);
}

function addContainer(i) {
    activeAppendContainerID++;
    const days_container_toggle = document.createElement('div');
    days_container_toggle.id = 'container_toggle_' + activeAppendContainerID;
    days_container_toggle.classList.add('days_container_toggle');
    days_container_toggle.innerHTML = 'Days ' + i + '-' + (i + 29);
    days_container_toggle.style.opacity = '1';
    allDaysElement.appendChild(days_container_toggle);

    const container = document.createElement('div');
    container.id = 'container_' + activeAppendContainerID;
    container.classList.add('days_container');
    allDaysElement.appendChild(container);

    days_container_toggle.addEventListener('click', function () {
        days_container_toggle.classList.toggle('active');
        container.classList.toggle('active');
    });
}

function toggleContainer(id) {
    document.getElementById('container_toggle_' + activeAppendContainerID).classList.toggle('active');
    document.getElementById('container_' + activeAppendContainerID).classList.toggle('active');
}

function setDisplay(day) {
    const currentContainer = document.getElementById('container_' + activeAppendContainerID);

    const link = document.createElement('a');
    link.id = day + '_link';
    link.href = day; //.html not needed
    currentContainer.appendChild(link);

    const dayDiv = document.createElement('div');
    dayDiv.id = day;
    dayDiv.className = 'day';
    dayDiv.innerHTML = 'Day ' + day + ' ';
    link.appendChild(dayDiv);

    if (localStorage.getItem('day' + day + '_result') && localStorage.getItem('day' + day + '_history')) //history check needed since both are created at the same time
    {
        results = (localStorage.getItem('day' + day + '_result'));

        let dayCompleted = false;
        if (results.length === 5) {
            dayCompleted = true;
        }

        for (let i = 0; i < 5; i++) //emoji display
        {
            if (i < results.length) {
                if (results[i] === '1') {
                    dayDiv.innerHTML += '🟩';
                    dayCompleted = true;
                }
                else {
                    dayDiv.innerHTML += '🟥';
                }
            }
            else {
                dayDiv.innerHTML += '⬜';
            }
        }

        if (dayCompleted) {
            dayDiv.classList.add('completed');
        }
    }
    else {
        //create empty local storage objects
        localStorage.setItem('day' + day + '_result', '');
        localStorage.setItem('day' + day + '_history', JSON.stringify([]));
        dayDiv.innerHTML += '⬜⬜⬜⬜⬜';
    }

    dayDisplays.push(dayDiv.innerHTML);
}

//overwrite day 65 & 140 errors, remove later
function fixDays() {
    const eightHistory = JSON.parse(localStorage.getItem('day' + 65 + '_history'));
    const eightNames = mapList[rngList[65-1]-1].name;
    const droughtHistory = JSON.parse(localStorage.getItem('day' + 140 + '_history'));
    const droughtNames = mapList[rngList[140-1]-1].name;
    let temp_results_tracker = '';
    let solved = false;

    //day 65 (eight)
    for(let i = 0; i < eightHistory.length; i++) {
        for(let j = 0; j < eightNames.length; j++) {
            if(eightHistory[i] == eightNames[j] && !solved) {
                    solved = true;
                    temp_results_tracker += '1';
                    localStorage.setItem('day' + 65 + '_result', temp_results_tracker);
                }
        }
        if(!solved){
            temp_results_tracker += '0';
        }
    }

    //reset
    temp_results_tracker = '';
    solved = false;

    //day 140 (drought)
    for(let i = 0; i < droughtHistory.length; i++) {
        for(let j = 0; j < droughtNames.length; j++) {
            if(droughtHistory[i] == droughtNames[j] && !solved) {
                    solved = true;
                    temp_results_tracker += '1';
                    localStorage.setItem('day' + 140 + '_result', temp_results_tracker);
                }
        }
        if(!solved){
            temp_results_tracker += '0';
        }
    }

}
const eightResult = localStorage.getItem('day' + 65 + '_result');
const droughtResult = localStorage.getItem('day' + 140 + '_result');
if(eightResult[0] == '0' || droughtResult[0] == '0') {
    fixDays();
}

map_name_toggle_element = document.getElementById('map_name_toggle');
map_name_toggle_element.addEventListener('click', function () {

    if (map_name_toggle_element.className.includes('option_active')) //show day progress
    {
        map_name_toggle_element.classList.remove('option_active');

        //show days again
        for (i = 1; i <= jumple_day_number; i++) {
            let dayDiv_box = document.getElementById(i);
            dayDiv_box.innerHTML = dayDisplays[i - 1];
        }
    }
    else //show map name
    {
        map_name_toggle_element.classList.add('option_active');

        for (i = 1; i <= jumple_day_number; i++) {
            let dayDiv_box = document.getElementById(i);

            if (dayDiv_box.className.includes('completed')) {
                mapName = mapList[rngList[i - 1] - 1].name;
                dayDiv_box.innerHTML = mapName[mapName.length - 1];
                dayDiv_box.style.textAlign = 'center';
                dayDiv_box.style.paddingRight = '0px';
                dayDiv_box.style.width = '196px';
            }
        }
    }
});

//background toggling
function setBackground(id) {
    if (id == '1') {
        document.body.classList.add('dashedBG');
        document.body.style.backgroundColor = '#1E1D1E'; //necessary for now
        background_toggle_element.classList.add('option_active');
        backgroundContainerElement.classList.add('enabled');
        backgroundGradientElement.classList.add('enabled');
    }
    else {
        document.body.classList.remove('dashedBG');
        document.body.style.backgroundColor = 'slategrey';
        backgroundContainerElement.classList.remove('enabled');
        backgroundGradientElement.classList.remove('enabled');
        
    }
}

//localStorage for background
if (localStorage.getItem('background')) {
    backgroundPreset = localStorage.getItem('background');
    setBackground(backgroundPreset);
}
else {
    localStorage.setItem('background', '1');
    setBackground('1');
}

background_toggle_element.addEventListener('click', function () {

    if (background_toggle_element.className.includes('option_active')) { //revert active background and save to localStorage
        background_toggle_element.classList.remove('option_active');
        setBackground('0');
        localStorage.setItem('background', '0');
    }
    else {
        background_toggle_element.classList.add('option_active');
        setBackground('1');
        localStorage.setItem('background', '1');
    } //apply active background and save to localStorage
});