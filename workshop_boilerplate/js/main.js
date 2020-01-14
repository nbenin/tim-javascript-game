/* Hovergame Workshop

Set score and lives

Make target move to an assigned location when we hover and add a point to your score. (onmouseover)

Make speed changeable. (getSpeed, setSpeed)

Check the screen to place your target randomly on the screen. Don't forget the bar at the top

Make an enemy that reduces your lives when you touch them.

When your lives reach 0 make a game over feature

Make the enemy move

Make a boss that instantly kills you

Add enemies every 10 points you get

Add the boss when you get 60 points

Make a health bonus that gives you 1 life

Remove the bonus when you take it

add a life every 30 points

Make it visually a bit better

Fix collision

Fix immunity */

// global variables
let target = document.getElementById('target');
let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;
let score = 0;
let lives = 3;
let spawnInterval = 5;
let spawnBoss = 20;
let spawnLife = 10;
let mouseX = 0;
let mouseY = 0;
let pointImmunity = false;
let damageImmunity = false;
let immuneTime = 500;

setSpeed(target, 0.5);
setScore();
setLives();
checkScreen();
detectTarget();

// move square and update score on mouseover
document.onmousemove = findMouse;

// collision detection
function findMouse(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
    let cursor = document.getElementById('cursor');
    let cursorWidth = getWidth(cursor);
    let cursorHeight = getHeight(cursor);
    document.getElementById('cursor').style.marginLeft = (mouseX - (cursorWidth / 2)) + 'px';
    document.getElementById('cursor').style.marginTop = (mouseY - (cursorHeight / 2)) + 'px';
}

function findCollision(element) {
    if (mouseX + 10 >= element.getBoundingClientRect().left &&
        mouseX + 10 <= element.getBoundingClientRect().right &&
        mouseY >= element.getBoundingClientRect().top &&
        mouseY <= element.getBoundingClientRect().bottom) {
        return true;
    }
    if (mouseX - 10 >= element.getBoundingClientRect().left &&
        mouseX - 10 <= element.getBoundingClientRect().right &&
        mouseY >= element.getBoundingClientRect().top &&
        mouseY <= element.getBoundingClientRect().bottom) {
        return true;
    }
    if (mouseX >= element.getBoundingClientRect().left &&
        mouseX <= element.getBoundingClientRect().right &&
        mouseY + 10 >= element.getBoundingClientRect().top &&
        mouseY + 10 <= element.getBoundingClientRect().bottom) {
        return true;
    }
    if (mouseX >= element.getBoundingClientRect().left &&
        mouseX <= element.getBoundingClientRect().right &&
        mouseY - 10 >= element.getBoundingClientRect().top &&
        mouseY - 10 <= element.getBoundingClientRect().bottom) {
        return true;
    }
}

function detectTarget() {
    setInterval(function () {
        if (findCollision(target) === true) {
            getPoint();
        }
    }, 50);
}

// check screen size and set playfield
function checkScreen() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
}

// keep square from going off screen
function getWidth(element) {
    return element.offsetWidth;
}
function getHeight(element) {
    return element.offsetHeight;
}


// spawn enemies
function spawn(className, speed) {
    let spawn = document.createElement('div');
    spawn.classList.add(className);
    document.getElementById('game').appendChild(spawn);
    setSpeed(spawn, speed);
    move(spawn);
    moveEnemy(spawn);
    setEffect(spawn);
}

// move element
function move(element) {

    // randomize numbers and set margins
    let y = Math.floor(Math.random() * (screenHeight - getHeight(element) * 2));
    let x = Math.floor(Math.random() * (screenWidth - getWidth(element)));
    element.style.marginLeft = x + 'px';
    element.style.marginTop = y + 'px';

}

function moveEnemy(element) {
    move(element);
    setTimeout(function () {
        moveEnemy(element);
    }, 1000 * getSpeed(element));
}

// set transition speed, takes 2 parameters
function setSpeed(element, speed) {
    element.style.transitionDuration = speed + 's';
}

function getSpeed(element) {
    let speed = element.style.transitionDuration;
    speed = speed.substring(0, speed.length - 1);
    speed = parseFloat(speed);
    return speed;
}

// update score board and lives
function setScore() {
    document.getElementById('score').innerHTML = score;
}
function setLives() {
    document.getElementById('lives').innerHTML = lives;
}

function getPoint() {

    if (pointImmunity === false) {
        pointImmunity = true;
        move(target);
        score++;
        setScore();

        // at certain scores spawn enemies and powerups
        if (score % spawnInterval === 0) {
            spawn('enemy', 1.5);
        }
        if (score === spawnBoss) {
            spawn('boss', 2.5);
        }
        if (score % spawnLife === 0) {
            spawn('life', 1);
        }
        setTimeout(function () {
            pointImmunity = false;
        }, immuneTime);
    }
}

// if damaged
function damage() {
    if (damageImmunity === false) {
        damageImmunity = true;
        lives--;
        setLives();

        if (lives === 0) {
            gameOver();
        }
        setTimeout(function () {
            damageImmunity = false;
        }, immuneTime);
    }
}

function oneUp(element) {
    lives++;
    setLives();
    destroy(element);
}

function gameOver() {
    alert('You Died, your score was ' + score);
    location.reload();
}

function destroy (element) {
    document.getElementById('game').removeChild(element);
}

// effects
function setEffect(element) {
    setInterval(function () {
        if (element.className === 'enemy') {
            if (findCollision(element) === true && damageImmunity === false) {
                damage();
            }
        }
        if (element.className === 'boss') {
            if (findCollision(element) === true && damageImmunity === false) {
                gameOver();
            }
        }
        if (element.className === 'life') {
            if (findCollision(element) === true) {
                oneUp(element);
            }
        }
    }, 50);
}