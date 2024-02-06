//create as many day buttons as 'jumple_day.txt'

fetch('jumple_day_number.txt')
    .then(function(response) {
        return response.text();
    })
    .then(function(text) {
        displayDaysList(parseInt(text));
    });

var allDaysElement = document.getElementById('all_days');
var activeAppendContainerID = 1;

function displayDaysList(days) {
    allDaysElement = document.getElementById('all_days');
    activeAppendContainerID = 0;
    for (let i = 1; i <= days; i++) {
        if(i % 30 === 1)
        {
            addContainer(i);
        }
        setDisplay(i);
    }
    toggleContainer(activeAppendContainerID);
}

function addContainer(i)
{
    activeAppendContainerID++;
    const days_container_toggle = document.createElement('div');  
    days_container_toggle.id = 'container_toggle_' + activeAppendContainerID;
    days_container_toggle.classList.add('days_container_toggle');
    days_container_toggle.innerHTML = 'Days ' + i + '-' + (i+29);
    days_container_toggle.style.opacity = '1';
    allDaysElement.appendChild(days_container_toggle);

    const container = document.createElement('div');
    container.id = 'container_' + activeAppendContainerID;
    container.classList.add('days_container');
    allDaysElement.appendChild(container);

    days_container_toggle.addEventListener('click', function() {
        days_container_toggle.classList.toggle('active');
        container.classList.toggle('active');
    });
}

function toggleContainer(id)
{
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
}

