function parentHeight(elem) {
    return elem.parentElement.clientHeight;
}

function parentWidth(elem) {
    return elem.parentElement.clientWidth;
}


//Creating the ships and their functions

var ship1 = document.getElementById('ship1');
var ship2 = document.getElementById('ship2');
var hp1 = document.getElementById('hp1');
var hp2 = document.getElementById('hp2');



function Ship(hp, speed, move) {
    this.hp = hp;
    this.speed = speed;
    this.move = move;
    this.up = false;
    this.down = false;
}

var leftShip = new Ship(10, 3, Math.floor(parentHeight(ship1) / 2));
var rightShip = new Ship(10, 3, Math.floor(parentHeight(ship2) / 2));

var restartStats1 = [leftShip.hp, leftShip.move];
var restartStats2 = [rightShip.hp, rightShip.move];


Ship.prototype.movement = function (ship) {
    if (this.up && this.move >= this.speed) {
        this.move -= this.speed;
    }
    if (this.down && this.move <= parentHeight(ship) - 75) {
        this.move += this.speed;

    }
    ship.style.top = this.move + 'px';

}


Ship.prototype.shoot = function (nameForClass, way) {
    var bullet = document.createElement('div');
    bullet.className = nameForClass;
    bullet.style.top = (this.move + 30) + 'px'; //So it shoots from the middle
    bullet.style[way] = '0px';

    document.getElementById('area').appendChild(bullet);

}
Ship.prototype.bulletMove = function (nameForClass, way, enemy, ship) {

    var bullets = document.getElementsByClassName(nameForClass);
    for (var bmove = 0; bmove < bullets.length; bmove++) {

        bullets[bmove].style[way] = (parseInt(bullets[bmove].style[way]) + 10) + 'px';

        //If the bullet is at the range of the enemy ship, it will hit
        if ((parseInt(bullets[bmove].style.top) - enemy.move <= 60 && parseInt(bullets[bmove].style.top) - enemy.move >= 0) && (bullets[bmove] && parseInt(bullets[bmove].style[way]) >= parentWidth(ship) - 60)) {
            enemy.hp--;
            bullets[bmove].parentNode.removeChild(bullets[bmove]);
        }

        if (bullets[bmove]) {
            if (parseInt(bullets[bmove].style[way]) >= parentWidth(ship) - 10) {
                bullets[bmove].parentNode.removeChild(bullets[bmove]);
            }
        }
    }

}

//Meteor

var meteor = {
    speed: function () {
        return Math.floor(Math.random() * 10) + 1;
    },
    appearChance: function () {
        if ((Math.floor(Math.random() * 300) + 1) == 1) {
            this.appear();
        }
    },
    appear: function () {

        var meteor = document.createElement('div');
        meteor.className = 'meteor';
        if (this.speed() <= 5) {
            meteor.style.top = '1px';
        } else {
            meteor.style.bottom = '1px';
        }

        meteor.style.left = Math.floor(Math.random() * ((parentWidth(ship1) - 150) - 80 + 1)) + 80 + 'px';
        document.getElementById('area').appendChild(meteor);

    },

    move: function () {
        var meteors = document.getElementsByClassName('meteor');
        var bullets1 = [].slice.call(document.getElementsByClassName('bullet1'));
        var bullets2 = [].slice.call(document.getElementsByClassName('bullet2'));

        var bullets = bullets1.concat(bullets2);

        for (var mMove = 0; mMove < meteors.length; mMove++) {
            if (!meteors[mMove].style.top) {
                var way = 'bottom';
                var theMeteorTop = parentHeight(ship1) - parseInt(meteors[mMove].style.bottom) - 50;
            } else {
                var way = 'top';
                var theMeteorTop = parseInt(meteors[mMove].style.top);
            }

            var theMeteorLeft = parseInt(meteors[mMove].style.left);

            for (var bmove = 0; bmove < bullets.length; bmove++) {
                var theBulletTop = parseInt(bullets[bmove].style.top);

                if (!parseInt(bullets[bmove].style.left)) {
                    var theBulletLeft = parentWidth(ship2) - parseInt(bullets[bmove].style.right) - 50;
                } else {
                    var theBulletLeft = parseInt(bullets[bmove].style.left);
                }

                if ((theBulletTop - theMeteorTop <= 40 && theBulletTop - theMeteorTop >= -5) && (theBulletLeft - theMeteorLeft <= 40 && theBulletLeft - theMeteorLeft >= -5)) {
                    bullets[bmove].parentNode.removeChild(bullets[bmove]);
                }

            }
            if (way == 'bottom') {
                if (theMeteorTop <= 10) {
                    meteors[mMove].parentNode.removeChild(meteors[mMove]);
                } else {
                    meteors[mMove].style[way] = (parseInt(meteors[mMove].style[way]) + this.speed()) + 'px';
                }
            } else {
                if (theMeteorTop >= parentHeight(ship1) - 20) {
                    meteors[mMove].parentNode.removeChild(meteors[mMove]);
                } else {
                    meteors[mMove].style[way] = (parseInt(meteors[mMove].style[way]) + this.speed()) + 'px';
                }
            }


        }

    }
}




//Game refreshers

function updateHp() {
    hp1.innerHTML = 'HP: ' + leftShip.hp;
    hp2.innerHTML = 'HP: ' + rightShip.hp;

}

function gameLoop() {

    meteor.appearChance();
    meteor.move();
    leftShip.movement(ship1);
    rightShip.movement(ship2);
    leftShip.bulletMove('bullet1', 'left', rightShip, ship2);
    rightShip.bulletMove('bullet2', 'right', leftShip, ship1);
    updateHp()


    if (leftShip.hp > 0 && rightShip.hp > 0) {
        window.requestAnimationFrame(gameLoop);
    } else {
        if (leftShip.hp <= 0) {
           play(confirm('The right ship wins! Play again ?'));
            
        } else {
            play(confirm('The left ship wins! Play again ?'));
        }
    }
}



function play(answer) {
    if (answer) {
        document.getElementById('startScreen').style.visibility = 'hidden';
        document.getElementById('area').style.visibility = 'visible';

        leftShip.hp = restartStats1[0];
        leftShip.move = restartStats1[1];

        rightShip.hp = restartStats2[0];
        rightShip.move = restartStats2[1];



        var bullets1 = [].slice.call(document.getElementsByClassName('bullet1'));
        var bullets2 = [].slice.call(document.getElementsByClassName('bullet2'));

        var bullets = bullets1.concat(bullets2);

        for (var index = 0; index < bullets.length; index++) {
            bullets[index].parentNode.removeChild(bullets[index]);
        }


        var meteors = document.getElementsByClassName('meteor');

        for (var index = 0; index < meteors.length; index++) {
            meteors[index].parentNode.removeChild(meteors[index]);
        }

        gameLoop();

    } else {
        document.getElementById('area').style.visibility = 'hidden';
        window.location = window.location.href.replace('#game', "");
        // window.location.href.replace('#game', "");
        document.getElementById('startScreen').style.visibility = 'visible';
    }
}



//Keys pressed

var shoot1Lock = false;
var shoot2Lock = false;
var keys = {};

document.addEventListener('keydown', function (e) {
    keys[e.which] = true;
    pressedKeys(keys);
});

document.addEventListener('keyup', function (e) {
    delete keys[e.which];
    pressedKeys();
});

function pressedKeys() {

    for (var i in keys) {
        if (!keys.hasOwnProperty(i)) continue;
        switch (parseInt(i)) {
            case 68: if (!shoot1Lock) {
                leftShip.shoot('bullet1', 'left'); shoot1Lock = true; setTimeout(function () { shoot1Lock = false; }, 500);
            } break;
            case 37: if (!shoot2Lock) {
                rightShip.shoot('bullet2', 'right'); shoot2Lock = true; setTimeout(function () { shoot2Lock = false; }, 500);
            } break;
            case 87: leftShip.up = true; break;
            case 83: leftShip.down = true; break;
            case 38: rightShip.up = true; break;
            case 40: rightShip.down = true; break;
        }
    }
}


document.addEventListener('keyup', function (e) {
    switch (e.keyCode) {
        case 87: leftShip.up = false; break;
        case 83: leftShip.down = false; break;
        case 38: rightShip.up = false; break;
        case 40: rightShip.down = false; break;
    }
});

