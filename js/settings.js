
let settings = false;

function onSettingsButtonClick() {
    if(isEnd) {
        if(settings) {
            document.querySelector('div.settings-v').className = 'settings';
            document.getElementsByClassName('settingsButton-r')[0].className = 'settingsButton';
        }
        else {
            document.querySelector('div.settings').className = 'settings-v';
            document.getElementsByClassName('settingsButton')[0].className = 'settingsButton-r';
        }
        settings = !settings;
        // renderObj();
    }
}

function onChange() {
    setPadWidth(document.querySelector('input.padWidth').value);
    setPadLength(document.querySelector('input.padLength').value);
    setPadPadding(document.querySelector('input.padPadding').value);
    setPadColor(document.querySelector('input.padColor').value);
    setPadSpeed(document.querySelector('input.padSpeed').value);
    setBackground(document.querySelector('input.backgroundColor').value);
    setTextColor(document.querySelector('input.textColor').value);
    setBallSize(document.querySelector('input.ballSize').value);
    setBallColor(document.querySelector('input.ballColor').value);
    renderObj();
}

let input = document.querySelectorAll('.settings input');
input.forEach(function (ele) {ele.addEventListener('change', onChange);});
