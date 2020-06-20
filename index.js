class square{
    constructor(size, label, isEmpty=false){
        this.width = size;
        this.height = size;
        this.label = label;
        this.empty = isEmpty;
        this.borderThickness = 1
    }

    draw(ctx, x, y){
        ctx.fillStyle = "#000";
        ctx.fillRect(
            x - this.borderThickness,
            y - this.borderThickness,
            this.width + this.borderThickness*2,
            this.height + this.borderThickness*2
            );
        ctx.fillStyle = "#FFF";
        ctx.fillRect(x, y, this.width, this.height);
        if(!this.empty){
            ctx.fillStyle = "#000";
            ctx.fillText(this.label.toString(), x + this.width/2, y + this.width/2);
        }
    }
}

function gameLoop(timeStamp){
    let dt = timeStamp - lastTime;
    lastTime = timeStamp;
    c.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT); // this clears out a square from these coords



    for(var x = 0; x < N*N; x++){
        squares[x].draw(c, (x%N)*(SCREEN_WIDTH/N), (Math.floor(x/N)*(SCREEN_WIDTH/N)));
    }
    requestAnimationFrame(gameLoop);
}

function printMousePos(e){

      cursorX = e.pageX-8;
      cursorY= e.pageY-8;
      xCoord = Math.floor(cursorX/(SCREEN_WIDTH/N));
      yCoord = Math.floor(cursorY/(SCREEN_WIDTH/N));
      if(xCoord >= N || yCoord >= N || xCoord < 0 || yCoord < 0){
          return false;
      }
      console.log("pageX: " + xCoord +",pageY: " + yCoord);
      //swapByIndex(0, getIndex(Math.floor(cursorX/(SCREEN_WIDTH/N)), Math.floor(cursorY/(SCREEN_WIDTH/N))));
      console.log(getIndex(xCoord, yCoord));
      console.log(checkIdxNeighbors(xCoord, yCoord));
      swapIdx = checkIdxNeighbors(xCoord, yCoord);
      if (swapIdx != -1){
          swapByIndex(swapIdx, getIndex(xCoord, yCoord));
      }
      //console.log(squares);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getIndex(x, y){
    return y*(N-1)+x+y;
}

function swapByIndex(I1, I2){
    var b = squares[I1];
    squares[I1] = squares[I2];
    squares[I2] = b;
}

function checkIdxEmpty(idx){
    return squares[idx].empty;
}

function checkIdxNeighbors(x, y){
    idx = getIndex(x, y);
    //9 cases
    //4 corners
    //4 sides
    //everything else(middle)
    if(CheckIdxIsCorner(idx)){
        return CheckIdxNeighborCorners(idx);
    } else if(CheckIdxIsSide(x, y)){
        return CheckIdxNeighborSides(idx, x, y);
    } else{
        if(checkIdxEmpty(getIndex(x-1, y))) return getIndex(x-1, y);
        if(checkIdxEmpty(getIndex(x+1, y))) return getIndex(x+1, y);
        if(checkIdxEmpty(getIndex(x, y-1))) return getIndex(x, y-1);
        if(checkIdxEmpty(getIndex(x, y+1))) return getIndex(x, y+1);
    
        return -1
    }
}

function CheckIdxNeighborCorners(idx){
    if(idx == 0){
        if(checkIdxEmpty(getIndex(1, 0))) return getIndex(1, 0);
        if(checkIdxEmpty(getIndex(0, 1))) return getIndex(0, 1);
    }
    if(idx == N-1){
        if(checkIdxEmpty(getIndex(N-2, 0))) return getIndex(N-2, 0);
        if(checkIdxEmpty(getIndex(N-1, 1))) return getIndex(N-1, 1);
    }
    if(idx == squares.length-1){
        if(checkIdxEmpty(getIndex(N-1, N-2))) return getIndex(N-1, N-2);
        if(checkIdxEmpty(getIndex(N-2, N-1))) return getIndex(N-2, N-1);
    }
    if(idx == squares.length-(N-1)-1){
        if(checkIdxEmpty(getIndex(0, N-2))) return getIndex(0, N-2);
        if(checkIdxEmpty(getIndex(1, N-1))) return getIndex(1, N-1);
    }
    return -1;
}

function CheckIdxNeighborSides(idx, x, y){
    //top side
    if(y==0){
        if(checkIdxEmpty(getIndex(x-1, y))) return getIndex(x-1, y);
        if(checkIdxEmpty(getIndex(x+1, y))) return getIndex(x+1, y);
        if(checkIdxEmpty(getIndex(x, y+1))) return getIndex(x, y+1);
    }

    //bottom side
    if(y == N-1){
        if(checkIdxEmpty(getIndex(x-1, y))) return getIndex(x-1, y);
        if(checkIdxEmpty(getIndex(x+1, y))) return getIndex(x+1, y);
        if(checkIdxEmpty(getIndex(x, y-1))) return getIndex(x, y-1);
    }

    //left side
    if(x == 0){
        if(checkIdxEmpty(getIndex(x+1, y))) return getIndex(x+1, y);
        if(checkIdxEmpty(getIndex(x, y-1))) return getIndex(x, y-1);
        if(checkIdxEmpty(getIndex(x, y+1))) return getIndex(x, y+1);
    }

    //right side
    if(x == N-1){
        if(checkIdxEmpty(getIndex(x, y-1))) return getIndex(x, y-1);
        if(checkIdxEmpty(getIndex(x, y+1))) return getIndex(x, y+1);
        if(checkIdxEmpty(getIndex(x-1, y))) return getIndex(x-1, y);
    }
    
    return -1
}

function CheckIdxIsCorner(idx){
    if(idx == 0 || idx == N-1 || idx == squares.length-1 || idx == squares.length-(N-1)-1){
        return true;
    }
    return false;
}

function CheckIdxIsSide(x, y){
    if(y==0 || y == N-1 || x == 0 || x == N-1){
        return true;
    }
    return false;
}


const SCREEN_WIDTH = 600;
const SCREEN_HEIGHT = 600;
const N = 7;
document.addEventListener('click', printMousePos, true);
let canvas = document.getElementById("gameScreen");
let c = canvas.getContext("2d");
c.font = "20px Verdana";
lastTime = 0;

var squares = new Array(N*N);

count = 1;
for(var x = 0; x < N*N; x++){
    if(x == (N*N)-1){
        squares[x] = new square(SCREEN_WIDTH/N, count, true);
        count++;
        continue;
    }
    squares[x] = new square(SCREEN_WIDTH/N, count);
    count++;
}

shuffleArray(squares);

gameLoop();
