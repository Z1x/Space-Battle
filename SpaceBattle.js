function parentHeight(elem) {
    return elem.parentElement.clientHeight;
}

function parentWidth(elem) {
    return elem.parentElement.clientWidth;
}

var ship1 = document.getElementById('ship1');
var ship2 = document.getElementById('ship2');
var hp1 = document.getElementById('hp1');
var hp2 = document.getElementById('hp2');



function Ship(hp, speed, move, bulletsWay) {
    this.hp = hp;
    this.speed = speed;
    this.move = move;
    this.up = false;
    this.down = false;
}

var leftShip = new Ship(10, 3, Math.floor(parentHeight(ship1) / 2));
var rightShip = new Ship(10, 3, Math.floor(parentHeight(ship2) / 2));




Ship.prototype.movement = function (ship) {
    if (this.up) {
        if (this.move >= this.speed) {
            this.move -= this.speed;
        }
    }
    if (this.down) {
        if (this.move <= parentHeight(ship) - 30) {
            this.move += this.speed;
        }
    }
    ship.style.top = this.move + 'px';

}


Ship.prototype.shoot = function (nameForClass, way) {
    var bullet = document.createElement('div');
    bullet.className = nameForClass;
    bullet.style.top = (this.move + 30) + 'px';
    bullet.style[way] = '0px';

    document.getElementById('area').appendChild(bullet);

}
Ship.prototype.bulletMove = function (nameForClass, way, enemy, ship) {
    
    var bullets = document.getElementsByClassName(nameForClass);
    for (var bmove = 0; bmove < bullets.length; bmove++) {
        
        bullets[bmove].style[way] = (parseInt(bullets[bmove].style[way]) + 10) + 'px';
        
        if (parseInt(bullets[bmove].style[way]) >= parentWidth(ship) - 60) {
            if (parseInt(bullets[bmove].style.top) - enemy.move <= 60 && parseInt(bullets[bmove].style.top) - enemy.move >= 0) {
                enemy.hp--;
                bullets[bmove].parentNode.removeChild(bullets[bmove]);
            }
        }
        if (bullets[bmove]) {
            if (parseInt(bullets[bmove].style[way]) >= parentWidth(ship) - 10) {
                bullets[bmove].parentNode.removeChild(bullets[bmove]);
            }
        }
    }

}



function updateHp() {
    hp1.innerHTML = 'HP: ' + leftShip.hp;
    hp2.innerHTML = 'HP: ' + rightShip.hp;

}

function gameLoop() {

    leftShip.movement(ship1);
    rightShip.movement(ship2);
    leftShip.bulletMove('bullet1', 'left', rightShip, ship2);
    rightShip.bulletMove('bullet2', 'right', leftShip, ship1);
    updateHp()


    if (leftShip.hp > 0 && rightShip.hp > 0) {
        requestAnimationFrame(gameLoop);
    } else {
        if (leftShip.hp <= 0) {
            alert('The right ship wins!');
        } else {
            alert('The left ship wins!');
        }
    }
}


var shoot1Lock = false;
var shoot2Lock = false;
var keys = {};

document.addEventListener('keydown', function (e) {
    keys[e.which] = true;

    pressedKeys();
});

document.addEventListener('keyup', function (e) {
    delete keys[e.which];

    pressedKeys();
});

function pressedKeys() {
    for (var i in keys) {
        if (!keys.hasOwnProperty(i)) continue;



        if (i == 68 && !shoot1Lock) {
            leftShip.shoot('bullet1', 'left');
            shoot1Lock = true;
            setTimeout(function () { shoot1Lock = false; }, 500);
        }

        if (i == 37 && !shoot2Lock) {
            rightShip.shoot('bullet2', 'right');
            shoot2Lock = true;
            setTimeout(function () { shoot2Lock = false; }, 500);
        }

        if (i == 87) {
            leftShip.up = true;
        }

        if (i == 83) {
            leftShip.down = true;
        }

        if (i == 38) {
            rightShip.up = true;
        }

        if (i == 40) {
            rightShip.down = true;
        }
    }
}


document.addEventListener('keyup', function (e) {
    if (e.keyCode == 87) {
        leftShip.up = false;
    }

    if (e.keyCode == 83) {
        leftShip.down = false;
    }


    if (e.keyCode == 38) {
        rightShip.up = false;
    }

    if (e.keyCode == 40) {
        rightShip.down = false;
    }
});

gameLoop();
