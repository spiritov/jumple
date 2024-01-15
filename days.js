//create as many day buttons as 'jumple_day.txt'

fetch('jumple_day_number.txt')
    .then(function(response) {
        return response.text();
    })
    .then(function(text) {
        displayDaysList(parseInt(text));
    });

function displayDaysList(days) {
    for (let i = days; i > 0; i--) {
        setDisplay(i);
    }
}

function setDisplay(day) {
    //create new block
    const container = document.getElementById('days_container');
    const link = document.createElement('a');
    link.id = day + '_link';
    link.href = day; //.html not needed
    container.appendChild(link);

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
    container.classList.add('active');
}

displayDaysList();
