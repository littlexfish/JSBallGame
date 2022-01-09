
// Global Settings

var padWidth = 10;
var padLength = 100;
var padPadding = 5;
var padColor = 'rgb(0, 128, 255)';
var padSpeed = 5;
var padSpeedModified = 1;
var background = '#999';
var textColor = 'rgba(180, 180, 180, 0.8)';
var ballSize = 10;
var ballColor = '#F00';
var ballSpeedModified = 1.01;




//Game
let canvas;
let ctx;

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
    size: ballSize,
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
        if (this.x <= padPadding + padWidth + this.size) { //left
            if ((this.y > lPad.y - (padLength / 2)) && (this.y < lPad.y + (padLength / 2))) {
                if(isCenter) {
                    this.bounce(false);
                }
            }
        }
        if (this.x >= canvas.width - (padPadding + padWidth + this.size)) { //right
            if ((this.y > rPad.y - (padLength / 2)) && (this.y < rPad.y + (padLength / 2))) {
                if(isCenter) {
                    this.bounce(false);
                }
            }
        }
        if (this.y <= this.size) { //up
            this.bounce(true);
        }
        if (this.y >= canvas.height - this.size) { //down
            this.bounce(true);
        }
        if(this.x <= 0) {
            onEnd(false);
        }
        if(this.x >= canvas.width) {
            onEnd(true);
        }
    }
};



function onLoad() {
    window.oncontextmenu = function (e) {e.preventDefault();};
    canvas = document.getElementById('canvas');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx = canvas.getContext('2d');

    window.addEventListener('keydown', onKeyDown);

    renderObj();

}

function onKeyDown(e) {
    if(isEnd === true) {
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
    if(e.code === 'KeyS') {
        lPad.speed = padSpeedModified;
    }
    //rPad
    if(e.code === 'ArrowUp') {
        rPad.speed = -padSpeedModified;
    }
    if(e.code === 'ArrowDown') {
        rPad.speed = padSpeedModified;
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
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2, true);
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

onLoad();
