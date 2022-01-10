
// Global Settings

let padWidth = 10;
let padLength = 100;
let padPadding = 5;
let padColor = 'rgb(0, 128, 255)';
let padSpeed = 5;
let padSpeedModified = 1;
let background = '#999';
let textColor = 'rgb(180, 180, 180)';
let ballSize = 10;
let ballColor = '#F00';
let ballSpeedModified = 1.01;
let gearColor = 'rgb(200, 200, 200)';

function setPadWidth(value) {
    if(typeof value === 'number') {
        padWidth = value;
    }
    else {
        let tmp = parseInt(value);
        if(!isNaN(tmp) && tmp !== undefined && tmp !== null) {
            padWidth = tmp;
        }
    }
}

function setPadLength(value) {
    if(typeof value === 'number') {
        padLength = value;
    }
    else {
        let tmp = parseInt(value);
        if(!isNaN(tmp) && tmp !== undefined && tmp !== null) {
            padLength = tmp;
        }
    }
}

function setPadPadding(value) {
    if(typeof value === 'number') {
        padPadding = value;
    }
    else {
        let tmp = parseInt(value);
        if(!isNaN(tmp) && tmp !== undefined && tmp !== null) {
            padPadding = tmp;
        }
    }
}

function setPadColor(value) {
    if(CSS.supports('color', value.toString())) {
        padColor = value.toString();
    }
}

function setPadSpeed(value) {
    if(typeof value === 'number') {
        padSpeed = value;
    }
    else {
        let tmp = parseInt(value);
        if(!isNaN(tmp) && tmp !== undefined && tmp !== null) {
            padSpeed = tmp;
        }
    }
}

function setBackground(value) {
    if(CSS.supports('color', value.toString())) {
        background = value.toString();
    }
}

function setTextColor(value) {
    if(CSS.supports('color', value.toString())) {
        textColor = value.toString();
    }
}

function setBallSize(value) {
    if(typeof value === 'number') {
        ballSize = value;
    }
    else {
        let tmp = parseInt(value);
        if(!isNaN(tmp) && tmp !== undefined && tmp !== null) {
            ballSize = tmp;
        }
    }
}

function setBallColor(value) {
    if(CSS.supports('color', value.toString())) {
        ballColor = value.toString();
    }
}

function setGearColor(value) {
    if(CSS.supports('color', value.toString())) {
        gearColor = value.toString();
    }
}


//Game
let canvas;
let ctx;

let canvasWidth;
let canvasHeight;

let isCenter = true;
let isEnd = true;
let lGrade = 0;
let rGrade = 0;

let raf;

const lPad = {
    y: window.innerHeight / 2,
    speed: 0,
    move: function () {
        this.y += padSpeed * this.speed;
        if(this.y < (padLength / 2)) {
            this.y = (padLength / 2);
        }
        if(this.y > canvas.height - (padLength / 2)) {
            this.y = canvas.height - (padLength / 2);
        }
    }
};
const rPad = {
    y: window.innerHeight / 2,
    speed: 0,
    move: function () {
        this.y += padSpeed * this.speed;
        if(this.y < (padLength / 2)) {
            this.y = (padLength / 2);
        }
        if(this.y > canvas.height - (padLength / 2)) {
            this.y = canvas.height - (padLength / 2);
        }
    }
};

const ball = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    vX: 0,
    vY: 0,
    bounce: function(vertical) {
        if(vertical) {
            this.vY = -this.vY;
        }
        else {
            this.vX = -this.vX;
            isCenter = false;
            this.speed(ballSpeedModified, ballSpeedModified);
        }
    },
    speed: function(speedX, speedY) {
        this.vX *= speedX;
        this.vY *= speedY;
    },
    move: function () {
        let tmp = this.x;
        this.x += this.vX;
        this.y += this.vY;
        if(tmp > canvas.width / 2) {
            if(this.x <= canvas.width / 2) {
                isCenter = true;
            }
        }
        else {
            if(this.x >= canvas.width / 2) {
                isCenter = true;
            }
        }
        if (this.x <= padPadding + padWidth + ballSize && this.x >= padPadding + ballSize) { //left
            if ((this.y > lPad.y - (padLength / 2)) && (this.y < lPad.y + (padLength / 2))) {
                if(isCenter) {
                    this.bounce(false);
                }
            }
        }
        if (this.x >= canvas.width - (padPadding + padWidth + ballSize) &&
                this.x <= canvas.width - (padPadding - ballSize)) { //right
            if ((this.y > rPad.y - (padLength / 2)) && (this.y < rPad.y + (padLength / 2))) {
                if(isCenter) {
                    this.bounce(false);
                }
            }
        }
        if (this.y <= ballSize) { //up
            this.bounce(true);
        }
        if (this.y >= canvas.height - ballSize) { //down
            this.bounce(true);
        }
        if(this.x <= ballSize) {
            onEnd(false);
        }
        if(this.x >= canvas.width - ballSize) {
            onEnd(true);
        }
    }
};



function onLoad() {
    window.oncontextmenu = function (e) {e.preventDefault();};
    canvas = document.getElementById('canvas');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    ctx = canvas.getContext('2d');

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    renderObj();

}

function onKeyDown(e) {
    if(settings) return;
    if(isEnd === true) {
        settingsButtonChange();
        ball.vX = randomFloat() * 5;
        ball.vY = randomFloat() * 5;
        if(ball.vX < 2 && ball.vX > 0) ball.vX = 3.5;
        if(ball.vX > -2 && ball.vX <= 0) ball.vX = -3.5;
        let multi = Math.abs(lGrade - rGrade);
        if(multi === 0) multi = 1;
        ball.speed(1 + (1 / multi), 1 + (1 / multi));
        isCenter = true;
        raf = window.requestAnimationFrame(onDraw);
    }
    isEnd = false;
    //lPad
    if(e.code === 'KeyW') {
        lPad.speed = -padSpeedModified;
    }
    else if(e.code === 'KeyS') {
        lPad.speed = padSpeedModified;
    }
    //rPad
    if(e.code === 'ArrowUp') {
        rPad.speed = -padSpeedModified;
    }
    else if(e.code === 'ArrowDown') {
        rPad.speed = padSpeedModified;
    }
}

function onKeyUp(e) {
    if(e.code === 'KeyW') {
        lPad.speed = 0;
    }
    else if(e.code === 'KeyS') {
        lPad.speed = 0;
    }
    //rPad
    if(e.code === 'ArrowUp') {
        rPad.speed = 0;
    }
    else if(e.code === 'ArrowDown') {
        rPad.speed = 0;
    }
}

function onDraw() {
    lPad.move();
    rPad.move();
    ball.move();

    renderObj();

    if(!isEnd) {
        raf = window.requestAnimationFrame(onDraw);
    }
    else {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        lPad.y = canvas.height / 2;
        rPad.y = canvas.height / 2;
    }
}

function renderObj() {
    if(window.innerHeight !== canvasHeight || window.innerWidth !== canvasWidth) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
    }

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '100px Arial';
    ctx.fillStyle = textColor;
    ctx.fillText(':', canvas.width / 2 - 15, canvas.height / 2 + 30);
    const lS = lGrade.toString(10);
    ctx.fillText(lS, canvas.width / 2 - 30 - getStringPos(lS), canvas.height / 2 + 40);
    const rS = rGrade.toString(10);
    ctx.fillText(rS, canvas.width / 2 - 30 + 50, canvas.height / 2 + 40);

    ctx.fillStyle = ballColor;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballSize, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = padColor;
    const lPadL = padPadding;
    const lPadT = lPad.y - (padLength / 2);
    ctx.fillRect(lPadL, lPadT, padWidth, padLength);

    const rPadL = canvas.width - padPadding - padWidth;
    const rPadT = rPad.y - (padLength / 2);
    ctx.fillRect(rPadL, rPadT, padWidth, padLength);
}

function onEnd(leftWin) {
    if(leftWin) {
        lGrade += 1;
    }
    else {
        rGrade += 1;
    }
    settingsButtonChange();
    isEnd = true;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    lPad.y = canvas.height / 2;
    rPad.y = canvas.height / 2;
    lPad.speed = 0;
    rPad.speed = 0;
}

function randomInt(max, negative = true) {
    let i = Math.floor(Math.random() * max);
    if(negative) {
        if(Math.random() * 2 > 1) {
            i = -i;
        }
    }
    return i;
}

function randomFloat(negative = true) {
    let f = Math.random();
    if(negative) {
        if (Math.random() * 2 > 1) {
            f = -f;
        }
    }
    return f;
}

function getStringPos(str) {
    return str.length * 55;
}

const gearIconL = '<svg class="gear" xmlns="http://www.w3.org/2000/svg" fill="';
const gearIconR = '" width="24" height="24" viewBox="0 0 24 24">' +
    '<path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019' +
    'v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847' +
    'h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232' +
    'c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847' +
    'l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02' +
    'v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707' +
    'l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001' +
    'c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222' +
    'h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286' +
    'c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021z' +
    'm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg>';

const gearIconDisableL = '<svg class="gear" xmlns="http://www.w3.org/2000/svg" fill="';
const gearIconDisableR = '" width="24" height="24" viewBox="0 0 24 24">' +
    '<path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019' +
    'v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847' +
    'h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232' +
    'c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847' +
    'l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02' +
    'v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707' +
    'l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001' +
    'c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222' +
    'h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286' +
    'c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021z' +
    'm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/>' +
    '<path d="M23 0 H24 V1 L1 24 H0 V23z" /></svg>';

function settingsButtonChange() {
    if(isEnd) {
        if(settings) {
            onSettingsButtonClick();
        }
        document.getElementsByClassName('settingsButton')[0].innerHTML = gearIconDisableL + gearColor + gearIconDisableR;
    }
    else {
        document.getElementsByClassName('settingsButton')[0].innerHTML = gearIconL + gearColor + gearIconR;
    }
    document.getElementsByClassName('gear')[0].fill = gearColor;
}

onLoad();
