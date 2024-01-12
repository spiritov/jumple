let modal_container = document.getElementById('modal_container');
let about = document.getElementById('about');
let close = document.getElementById('close');

about.onclick = function () {
    modal_container.style.display = 'block';
}
close.onclick = function () {
    modal_container.style.display = 'none';
}
window.onclick = function (event) {
    if (event.target == modal_container)
        modal_container.style.display = 'none';
}