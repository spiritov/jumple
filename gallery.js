var backgroundPreset = 1;
var jumple_day_number = 1;
const showMapsToggleElement = document.getElementById('show_maps_toggle');
const screenshotContainerElement = document.getElementById('main_map_image_container');
const screenshotElement = document.getElementById('main_screenshot');
const screenshotLeftElement = document.getElementById('left_screenshot');
const screenshotRightElement = document.getElementById('right_screenshot');
const dummyScreenshotElement = document.getElementById('dummy_screenshot');
const mapThumbnailContainerElement = document.getElementById('map_thumbnail_container');
const mapNameElement = document.getElementById('map_name');
const mapLinkElement = document.getElementById('map_link');
const leftButtonElement = document.getElementById('left_button');
const rightButtonElement = document.getElementById('right_button');
const hintIndexElement = document.getElementById('hint_index');
var galleryImages = [];
var galleryIndex = 4;
var currentMapName = 'select a preview image below, and navigate with the < / > buttons or keys';
var allowTransition = true;


fetch('jumple_day_number.txt')
    .then(function (response) {
        return response.text();
    })
    .then(function (text) {
        jumple_day_number = parseInt(text);
        addMaps(parseInt(text));
        screenshotElement.src = 'assets/site/gallery_preview.jpg';
    });

//debug
mapLinkElement.addEventListener('click', function () {
    screenshotLeftElement.classList.toggle('slideright');
    screenshotElement.classList.toggle('slideright');
});

dummyScreenshotElement.addEventListener('click', function () {
    screenshotElement.classList.toggle('bright');
    screenshotLeftElement.classList.toggle('bright');
    screenshotRightElement.classList.toggle('bright');
    dummyScreenshotElement.classList.toggle('bright');
});

dummyScreenshotElement.addEventListener('mouseover', function () {
    hintIndexElement.classList.add('fade');
});

dummyScreenshotElement.addEventListener('mouseleave', function () {
    hintIndexElement.classList.remove('fade');
});


//carousel
function scrollLeft() {
    if (galleryImages.length == 5 && allowTransition) { //there are 5 images
        allowTransition = false;
        dummyScreenshotElement.classList.add('invisible'); //hide

        if (galleryIndex == 0) { //this means fifth image
            screenshotElement.classList.add('slideright');
            screenshotLeftElement.classList.add('slideright');
            dummyScreenshotElement.src = galleryImages[4];
            galleryIndex = 4;
            hintIndexElement.innerHTML = galleryIndex + 1;

            setTimeout(() => //wait for image transition to finish
            {
                dummyScreenshotElement.classList.remove('invisible'); //show
                screenshotElement.classList.remove('slideright');
                screenshotLeftElement.classList.remove('slideright');
                screenshotElement.src = galleryImages[4];
                screenshotLeftElement.src = galleryImages[3];
                screenshotRightElement.src = galleryImages[0];
                allowTransition = true;
            }, 600);
        }
        else {
            dummyScreenshotElement.classList.add('invisible'); //hide

            //do transitions
            screenshotElement.classList.add('slideright');
            screenshotLeftElement.classList.add('slideright');

            //update dummy screenshot
            dummyScreenshotElement.src = galleryImages[galleryIndex - 1];
            hintIndexElement.innerHTML = galleryIndex;

            setTimeout(() => //wait for image transition to finish
            {
                dummyScreenshotElement.classList.remove('invisible'); //show dummy

                //run animations in background
                screenshotElement.classList.remove('slideright');
                screenshotLeftElement.classList.remove('slideright');
                screenshotElement.src = galleryImages[galleryIndex - 1];
                screenshotRightElement.src = galleryImages[galleryIndex];

                if (galleryIndex == 1) {
                    screenshotLeftElement.src = galleryImages[4];
                }
                else {
                    screenshotLeftElement.src = galleryImages[galleryIndex - 2];
                }
                galleryIndex--;
                allowTransition = true;
            }, 600);
        }
    }
}

//carousel
function scrollRight() {
    if (galleryImages.length == 5 && allowTransition) { //there are 5 images
        allowTransition = false;
        dummyScreenshotElement.classList.add('invisible'); //hide

        if (galleryIndex == 4) { //this means fifth image
            screenshotElement.classList.add('slideleft');
            screenshotRightElement.classList.add('slideleft');
            dummyScreenshotElement.src = galleryImages[0];
            galleryIndex = 0;
            hintIndexElement.innerHTML = galleryIndex + 1;

            setTimeout(() => //wait for image transition to finish
            {
                dummyScreenshotElement.classList.remove('invisible'); //show
                screenshotElement.classList.remove('slideleft');
                screenshotRightElement.classList.remove('slideleft');
                screenshotElement.src = galleryImages[0];
                screenshotLeftElement.src = galleryImages[4];
                screenshotRightElement.src = galleryImages[1];
                allowTransition = true;
            }, 600);
        }
        else {
            dummyScreenshotElement.classList.add('invisible'); //hide

            //do transitions
            screenshotElement.classList.add('slideleft');
            screenshotRightElement.classList.add('slideleft');

            //update dummy screenshot
            dummyScreenshotElement.src = galleryImages[galleryIndex + 1];
            hintIndexElement.innerHTML = galleryIndex + 2;

            setTimeout(() => //wait for image transition to finish
            {
                dummyScreenshotElement.classList.remove('invisible'); //show dummy

                //run animations in background
                screenshotElement.classList.remove('slideleft');
                screenshotRightElement.classList.remove('slideleft');
                screenshotElement.src = galleryImages[galleryIndex + 1];
                screenshotLeftElement.src = galleryImages[galleryIndex];

                if (galleryIndex == 3) {
                    screenshotRightElement.src = galleryImages[0];
                }
                else {
                    screenshotRightElement.src = galleryImages[galleryIndex + 2];
                }
                galleryIndex++;
                allowTransition = true;
            }, 600);
        }
    }
}

function checkScroll(key) {
    if (`${key.key}` == 'ArrowLeft') {
        scrollLeft();
    }
    else if (`${key.key}` == 'ArrowRight') {
        scrollRight();
    }
}

leftButtonElement.addEventListener('click', scrollLeft);
rightButtonElement.addEventListener('click', scrollRight);

document.addEventListener('keyup', checkScroll);
document.addEventListener('keyup', checkScroll);

function setBackground(id) {
    if (id == '1') {
        document.body.classList.add('dashedBG');
        document.getElementById('game_body').classList.add('dashedBG');
        document.getElementById('background_container').classList.add('enabled');
        document.getElementById('background_gradient').classList.add('enabled');
    }
    else {
        document.body.style.backgroundColor = 'slategrey';
    }
}

//load background
if (localStorage.getItem('background')) {
    backgroundPreset = localStorage.getItem('background');
    setBackground(backgroundPreset);
}
else {
    localStorage.setItem('background', '1');
    setBackground('1');
}

function setGalleryMap(day) {
    galleryImages = [`assets/maps/${day}/1.jpg`, `assets/maps/${day}/2.jpg`, `assets/maps/${day}/3.jpg`, `assets/maps/${day}/4.jpg`, `assets/maps/${day}/5.jpg`];
    screenshotElement.src = galleryImages[4];
    dummyScreenshotElement.src = galleryImages[4];
    screenshotLeftElement.src = galleryImages[3];
    screenshotRightElement.src = galleryImages[0];
    galleryIndex = 4;
    hintIndexElement.innerHTML = galleryIndex + 1;
    mapNameElement.innerHTML = currentMapName;
    mapLinkElement.href = mapList[rngList[day - 1] - 1].link;
}

function addMaps(days) {
    for (let i = 1; i <= days; i++) {
        addMapThumbnail(i);
    }
}

function checkCompleted(day, imgElement) {
    if (localStorage.getItem('day' + day + '_result') && localStorage.getItem('day' + day + '_history')) //history check needed since both are created at the same time
    {
        let results = (localStorage.getItem('day' + day + '_result'));
        let dayCompleted = false;
        if (results.length === 5) {
            dayCompleted = true;
        }

        for (let i = 0; i < 5; i++) //emoji display
        {
            if (i < results.length) {
                if (results[i] === '1') {
                    dayCompleted = true;
                }
            }
        }

        if (!dayCompleted) {
            imgElement.classList.add('incomplete');

        }
    }
    else {
        //create empty local storage objects
        localStorage.setItem('day' + day + '_result', '');
        localStorage.setItem('day' + day + '_history', JSON.stringify([]));
        imgElement.classList.add('incomplete');
    }
}

function addMapThumbnail(day) {
    const mapThumbnailImgContainer = document.createElement('div');
    mapThumbnailImgContainer.className = 'map_thumbnail_img_container';
    mapThumbnailContainerElement.appendChild(mapThumbnailImgContainer);

    const mapThumbnailImg = document.createElement('img');
    mapThumbnailImg.className = 'map_thumbnail_img';
    mapThumbnailImg.id = day;
    mapThumbnailImg.src = `assets/maps/${day}/5.jpg`;
    checkCompleted(day, mapThumbnailImg);


    mapThumbnailImg.addEventListener('click', function () {
        if (!mapThumbnailImg.classList.contains('incomplete')) {
            currentMapName = mapList[rngList[day - 1] - 1].name[0];
            setGalleryMap(parseInt(mapThumbnailImg.id));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    mapThumbnailImg.addEventListener('mouseover', function () {
        if (mapThumbnailImg.classList.contains('incomplete')) {
            mapNameElement.innerHTML = '???';
        }
        else {
            mapNameElement.innerHTML = mapList[rngList[day - 1] - 1].name[0];
        }


    });

    mapThumbnailImg.addEventListener('mouseleave', function () {
        mapNameElement.innerHTML = currentMapName;
    });

    mapThumbnailImgContainer.appendChild(mapThumbnailImg);
}

showMapsToggleElement.addEventListener('click', function () {
    if (showMapsToggleElement.className.includes('option_active')) {
        showMapsToggleElement.classList.remove('option_active');
        for (i = 1; i <= jumple_day_number; i++) {
            checkCompleted(i, document.getElementById(i));
        }
    }
    else {
        showMapsToggleElement.classList.add('option_active');

        for (i = 1; i <= jumple_day_number; i++) {
            let thumbnailDiv = document.getElementById(i);
            if (thumbnailDiv.className.includes('incomplete')) {
                thumbnailDiv.classList.remove('incomplete');
            }
        }
    }
});