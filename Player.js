var myGamePiece;
var myObstacles = [];

function startGame() {
    myGamePiece = new component(68, 48, "FLAPPY.png", 200, 312.5, "bird");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1366;
        this.canvas.height = 625;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 1);
        this.check = function () {
          if ((this.keypress == 1) || (this.click == 1)) {
            flap();
            this.click = 0;
            this.keypress = 0;
          }
        }
        window.addEventListener('keydown', function (e) {
            e.preventDefault();
            if (e.keyCode == 32) {
              myGameArea.keypress = 1;
            }
        })
        window.addEventListener('mousedown', function (a) {
            a.preventDefault();
            myGameArea.click = 1;
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "bird") {
      this.image = new Image();
      this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.gravity = 0.04;
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.angval = -100;
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "bird") {
            ctx.save();
            /*ctx.translate(200, this.y);
            ctx.rotate(this.angle);*/
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.restore();
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.speedY += this.gravity;
        this.y += this.speedY;
        myGamePiece.hitBottom();
        myGamePiece.hitTop();
    }
    this.hitBottom = function () {
      var ground = myGameArea.canvas.height - this.height;
      if (this.y > ground) {
        this.y = ground;
        myGameArea.stop();
      }
    }
    this.hitTop = function () {
      var ceiling = -this.height;
      if (this.y < ceiling) {
        this.y = ceiling;
      }
    }
    this.dive = function () {
      if (this.angval >= 0) {
        if (this.angle <= 90*(Math.PI/180)) {
          this.angle += 2.5 * (Math.PI/180);
        } else {
          this.angle = 91 * (Math.PI/180);
        }
      } else {
        this.angle = -25 * (Math.PI/180);
        this.angval += 0.2;
      }
      if (this.speedY < -0.25) {
        this.image.src = "FLAPPY3.png"
      } else if (this.speedY > 1) {
        this.image.src = "FLAPPY.png"
      } else {
        this.image.src = "FLAPPY2.png"
      }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
          myGameArea.stop();
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(750)) {
        x = myGameArea.canvas.width;
        minHeight = 200;
        maxHeight = 425;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        gap = 180;
        myObstacles.push(new component(80, height, "green", x, 0, "pipe"));
        myObstacles.push(new component(80, x - height - gap, "green", x, height + gap, "pipe"));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -0.4;
        myObstacles[i].update();
    }
    myGameArea.check();
    myGamePiece.dive();
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function flap() {
    myGamePiece.speedY = -2.5;
    myGamePiece.angle = -25 * (Math.PI/180);
    myGamePiece.angval = -25;
}
