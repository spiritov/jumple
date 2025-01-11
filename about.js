const modal_container = document.getElementById('modal_container');
const about = document.getElementById('about');
const close = document.getElementById('close');
const about_extraElement = document.getElementById('about_extra');

about_extraElement.innerHTML =
    'An additional screenshot is given for each map guess or skip, along with a text hint for some. Previous ' +
    'days can be viewed by clicking the calendar icon in the top left. I hope you find jumple fun! Please reach ' +
    'out if you encounter any issues, or would like to help with the completion of jumple.<br><br>' +

    'New maps (were) updated every day at ' +
    '<a href="https://www.timeanddate.com/worldclock/timezone/utc-5" target="_blank">12:00AM (UTC -5)</a> until day 365.';

about.addEventListener('click', function () {
    modal_container.style.display = 'block';
});

close.addEventListener('click', function () {
    modal_container.style.display = 'none';
});
modal_container.addEventListener('click', function (onClick) {
    if (onClick.target === modal_container) {
        modal_container.style.display = 'none';
    }
});