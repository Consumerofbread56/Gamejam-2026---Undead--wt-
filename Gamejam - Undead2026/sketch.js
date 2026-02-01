//Brayden and Jaydeep
//30/01/26
//Gamejam - Undead (wt)

const TILESINROW = 15;
let includeNextDigits = false;
let dFlag = 0;
let roomsLoaded = false;
let rooms = [];
let currentRoomID = 1;
let roomCollision = [];
let roomChangeCollision = [];
let slowdownTimeY = 0;
let checkCollision = 0;

let addRoomIDNum = true;
let justSpawned = true;
let playerCharacter = 0;

let needsRespawn = false;

class Player {
  constructor () {
    this.x = windowWidth/2;
    this.y = windowHeight/2;
    if(addRoomIDNum === false) {
      for (let y = 0; y<rooms[currentRoomID-1].length; y++) {
        for (let x = 0; x<rooms[currentRoomID-1][y].length; x++) {
          if (rooms[currentRoomID-1][x][y] === 2) {
            if (rooms[currentRoomID-1][x][y+1] === 1) {
              this.x = (windowWidth/2*windowHeight/2)+ x * windowHeight/15 + windowHeight / 30;
              this.y = windowHeight/15 + (y+1) * windowHeight/15 + windowHeight/15 + windowHeight / 30;
            }
            else {
              this.x = (windowWidth/2*windowHeight/2)+ (x-1) * windowHeight/15 + windowHeight / 30;
              this.y = windowHeight/15 + y * windowHeight/15 + windowHeight/15 + windowHeight / 30;
            }
          }
        }
      }
    }
    if(addRoomIDNum === true && justSpawned === false) {
      for (let y = 0; y<rooms[currentRoomID-1].length; y++) {
        for (let x = 0; x<rooms[currentRoomID-1][x].length; x++) {
          if (rooms[currentRoomID-1][x][y] === 3) {
            if (rooms[currentRoomID-1][x][y-1] === 1) {
              this.x = (windowWidth/2*windowHeight/2)+ x * windowHeight/15 + windowHeight / 30;
              this.y = windowHeight/15 + (y-1) * windowHeight/15 + windowHeight/15 + windowHeight / 30;
            }
            else {
              this.x = (windowWidth/2*windowHeight/2)+ (1+x) * windowHeight/15 + windowHeight / 30;
              this.y = windowHeight/15 + y * windowHeight/15 + windowHeight/15 + windowHeight / 30;
            }

            }
        }
      }
    }
    this.xvelocity = 0;
    this.yvelocity = 0;
    this.radius = windowHeight/30;
    this.leftvelocitylock = false;
    this.upvelocitylock = false;
    this.rightvelocitylock = false;
    this.downvelocitylock = false;
  }
  playerMovement() {
  
    if (keyIsDown(UP_ARROW) && this.yvelocity > -4 && this.upvelocitylock === false) {
      this.yvelocity-=4;
      if (this.leftvelocitylock === true) {
        this.xvelocity+=4;
      }
      if (this.rightvelocitylock === true) {
        this.xvelocity-=4;
      }
      this.leftvelocitylock = false;
      this.rightvelocitylock = false;
      this.downvelocitylock = false;
    
    }
    if (keyIsDown(RIGHT_ARROW) && this.xvelocity < 4 && this.rightvelocitylock === false) {
      if (this.upvelocitylock === true) {
        this.yvelocity+=4;
      }
      if (this.downvelocitylock === true) {
        this.yvelocity-=4;
      }
      this.leftvelocitylock = false;
      this.upvelocitylock = false;
      this.downvelocitylock = false;
      this.xvelocity+=4;
    }
    if (keyIsDown(DOWN_ARROW) && this.yvelocity < 4 && this.downvelocitylock === false) {
      this.yvelocity+=4;
      if (this.leftvelocitylock === true) {
        this.xvelocity+=4;
      }
      if (this.rightvelocitylock === true) {
        this.xvelocity-=4;
      }
      this.leftvelocitylock = false;
      this.rightvelocitylock = false;
      this.upvelocitylock = false;
     
    }
    if (keyIsDown(LEFT_ARROW) && this.xvelocity > -4 && this.leftvelocitylock === false) {
      this.xvelocity-=4;
      if (this.upvelocitylock === true) {
        this.yvelocity+=4;
      }
      if (this.downvelocitylock === true) {
        this.yvelocity-=4;
      }
      this.rightvelocitylock = false;
      this.upvelocitylock = false;
      this.downvelocitylock = false;
      
      
    }
    if (!this.leftvelocitylock && !this.rightvelocitylock){
      this.x += this.xvelocity;
    }
    
    if (!this.upvelocitylock && !this.downvelocitylock) {
      this.y += this.yvelocity;
    }
    
    this.xvelocity = 0;
    this.yvelocity = 0;
   

    
   
    
  }
  drawPlayer() {
    fill(255, 0, 0);
    circle(this.x, this.y, 0.9*(windowHeight/15));
  }
  playerCollision() {
    
    for (let i = 0; i < roomCollision.length; i++) {
      
      
      if (roomCollision[i][4] === "Right"){
        if (roomCollision[i][1] < this.y && this.y < roomCollision[i][3] && this.leftvelocitylock === false &&
          (floor((this.x-this.radius)/(windowHeight/15)) === (floor((roomCollision[i][0])/(windowHeight/15))))) {
        
          this.xvelocity = 0;
          this.leftvelocitylock = true;
        
        }
      }
      if (roomCollision[i][4] === "Left") {
        if (roomCollision[i][1] < this.y && this.y < roomCollision[i][3] && this.rightvelocitylock === false &&
          (floor(((this.x+this.radius)/(windowHeight/15))-1) === (floor((roomCollision[i][0])/(windowHeight/15))))) {
        
            this.xvelocity = 0;
            this.rightvelocitylock = true;
      }
    }
    if (roomCollision[i][4] === "Lower") {
        if (roomCollision[i][0] < this.x && this.x < roomCollision[i][2] && this.upvelocitylock === false &&
          (floor(((this.y)/(windowHeight/15))) === (floor((roomCollision[i][1])/(windowHeight/15))))) {
        
            this.yvelocity = 0;
            this.upvelocitylock = true;
      }
    }
    if (roomCollision[i][4] === "Upper") {
        if (roomCollision[i][0] < this.x && this.x < roomCollision[i][2] && this.downvelocitylock === false &&
          (floor(((this.y -1)/(windowHeight/15))) === (floor((roomCollision[i][1]-1)/(windowHeight/15))))) {
        
            this.yvelocity = 0;
            this.downvelocitylock = true;
          }
      }
    }
  }
  changeRooms() {
    for (let i = 0; i < roomChangeCollision.length; i++) {
     
      
      if (roomChangeCollision[i][4] === "Right"){
        if (roomChangeCollision[i][1] < this.y && this.y < roomChangeCollision[i][3] && this.leftvelocitylock === false &&
          (floor((this.x-this.radius)/(windowHeight/15)) === (floor((roomChangeCollision[i][0])/(windowHeight/15))))) {
          
          needsRespawn = true;
          addRoomIDNum = false;
          currentRoomID--;
        
        }
      }
      if (roomChangeCollision[i][4] === "Left") {
        if (roomChangeCollision[i][1] < this.y && this.y < roomChangeCollision[i][3] && this.rightvelocitylock === false &&
          (floor(((this.x+this.radius)/(windowHeight/15))-1) === (floor((roomChangeCollision[i][0])/(windowHeight/15))))) {
        
            needsRespawn = true;
            addRoomIDNum = true;
            currentRoomID++;
      }
    }
    if (roomChangeCollision[i][4] === "Lower") {
        if (roomChangeCollision[i][0] < this.x && this.x < roomChangeCollision[i][2] && this.upvelocitylock === false &&
          (floor(((this.y)/(windowHeight/15))) === (floor((roomChangeCollision[i][1])/(windowHeight/15))))) {
        
            needsRespawn = true;
            addRoomIDNum = true;
            currentRoomID++;
      }
    }
    if (roomChangeCollision[i][4] === "Upper") {
        if (roomChangeCollision[i][0] < this.x && this.x < roomChangeCollision[i][2] && this.downvelocitylock === false &&
          (floor(((this.y -1)/(windowHeight/15))) === (floor((roomChangeCollision[i][1]-1)/(windowHeight/15))))) {
        
            needsRespawn = true;
            addRoomIDNum = false;
            currentRoomID--;
          }
      }
      
    }
  }
}



fetch ("https://raw.githubusercontent.com/Consumerofbread56/Practice-for-Gamejam/refs/heads/main/practice%20for%20da%20game%20jam/roomData.txt")
    .then(response => {
    if (!response.ok) {
      console.log("There was an error with fetching room data.");
    }
    
    return response.text();

    })
    .then(data => {
      roomData = data;
      roomData = roomData.split("|");
      
      decompileRoomData();
    })

   .catch (error => {
    console.log("There was a separate error or sm idk", error);
  })

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  
  
}

function draw() {
  background(220);
  displayGrid();
  playerMechanics();
}

//Iterates the data in a text file into a readable array. Also gives each room a roomID,
//which can be viewed in the console as rooms[x][TILESINROW], or the last item in rooms[x]
function decompileRoomData() {
  console.log(roomData);
  let newRowCreator = 0;
  let roomID = 0;

  for (let x = 0; x < roomData.length; x++) {
    let roomX = [];
    let row = [];
    for (let y = 0; y < roomData[x].length; y++) {
      if (isDigit(roomData[x][y]) === true) {

        if (includeNextDigits === false) {
          row.push(Number(roomData[x][y]));
        }
        else {
          row.push(Number(roomData[x][y+1]+roomData[x][y+2]));

        }
        if (newRowCreator !== TILESINROW-1) {
          newRowCreator++;
      }
        else {
          roomX.push((row));
          row = [];
          newRowCreator = 0;
      }
        
      }
      
    }
    roomID++;
    roomX.push(roomID)
    rooms.push(roomX);
  }
  roomsLoaded = true;
}

function isDigit(str) {
  if ((str === "0" || str === "1" || str === "2" || str === "3" || str === "4" || str === "5" || 
    str === "6" || str === "7" || str === "8" || str === "9") && dFlag == 0) {
  return true;
}
  else if (str === "d") {
    includeNextDigits = true;
    dFlag = 2;
    return true;
  }
  else {
    if (dFlag > 0) {
      dFlag--;
    }
  includeNextDigits = false;
  return false;
}
}

function addToCollision(yPos, xPos, centerDisplayOffsetX, centerDisplayOffsetY, cellSize) {
  let wallType = 0;
  if (rooms[currentRoomID-1]?.[yPos]?.[xPos+1] === undefined) {
    wallType = "Right";
    roomCollision.push([centerDisplayOffsetX + x*cellSize+cellSize, centerDisplayOffsetY + 
      y*cellSize, centerDisplayOffsetX + x*cellSize+cellSize, centerDisplayOffsetY + y*cellSize+
    cellSize, wallType]);
  }
  else if (rooms[currentRoomID-1][yPos][xPos+1] === 1) {
    wallType = "Right";
    roomCollision.push([centerDisplayOffsetX + x*cellSize+cellSize, centerDisplayOffsetY + 
      y*cellSize, centerDisplayOffsetX + x*cellSize+cellSize, centerDisplayOffsetY + y*cellSize+
    cellSize, wallType]);
  }
    
  if (rooms[currentRoomID-1]?.[yPos]?.[xPos-1] === undefined) {
    wallType = "Left";
    roomCollision.push([centerDisplayOffsetX + x*cellSize, centerDisplayOffsetY + 
      y*cellSize, centerDisplayOffsetX + x*cellSize, centerDisplayOffsetY + y*cellSize+
    cellSize, wallType]);
    }
  else if (rooms[currentRoomID-1][yPos][xPos-1] === 1) {
    wallType = "Left";
    roomCollision.push([centerDisplayOffsetX + x*cellSize, centerDisplayOffsetY + 
      y*cellSize, centerDisplayOffsetX + x*cellSize, centerDisplayOffsetY + y*cellSize+
    cellSize, wallType]);
  }
  if (rooms[currentRoomID-1]?.[yPos+1]?.[xPos] === undefined) {
    wallType = "Lower";
    roomCollision.push([centerDisplayOffsetX + x*cellSize, centerDisplayOffsetY + 
      y*cellSize+cellSize, centerDisplayOffsetX + x*cellSize+cellSize, centerDisplayOffsetY + y*cellSize+
    cellSize, wallType]);
    }
  else if (rooms[currentRoomID-1][yPos+1][xPos] === 1) {
    wallType = "Lower";
    roomCollision.push([centerDisplayOffsetX + x*cellSize, centerDisplayOffsetY + 
      y*cellSize+cellSize, centerDisplayOffsetX + x*cellSize+cellSize, centerDisplayOffsetY + y*cellSize+
    cellSize, wallType]);
  }
  if (rooms[currentRoomID-1]?.[yPos-1]?.[xPos] === undefined) {
    wallType = "Upper";
    roomCollision.push([centerDisplayOffsetX + x*cellSize, centerDisplayOffsetY + 
      y*cellSize, centerDisplayOffsetX + x*cellSize+cellSize, centerDisplayOffsetY + y*cellSize+
    cellSize, wallType]);
    }
  else if (rooms[currentRoomID-1]?.[yPos-1]?.[xPos] === 1) {
    wallType = "Upper";
    roomCollision.push([centerDisplayOffsetX + x*cellSize, centerDisplayOffsetY + 
      y*cellSize, centerDisplayOffsetX + x*cellSize+cellSize, centerDisplayOffsetY + y*cellSize+
    cellSize, wallType]);
  }
}

function displayGrid() {
  if (roomsLoaded === true) {
    roomCollision = [];
    roomChangeCollision = [];
    let cellSize = windowHeight/15;
    let centerDisplayOffsetX = displayWidth/2-windowHeight/2;
    let centerDisplayOffsetY = windowHeight/30
    for (y = 0; y < rooms[currentRoomID].length-1; y++) {
      for (x = 0; x < rooms[currentRoomID-1][y].length; x++) {
        if (rooms[currentRoomID-1][y][x] === 0) {
          fill(0, 0, 0);
          addToCollision(y, x, centerDisplayOffsetX, centerDisplayOffsetY, cellSize);
        }
        else if (rooms[currentRoomID-1][y][x] === 2 || rooms[currentRoomID-1][y][x] === 3) {
          fill(225, 225, 0);
          addToChangeRoom(y, x, centerDisplayOffsetX, centerDisplayOffsetY, cellSize);

        }
        else {
          fill(255, 255, 255);
        }
        square(centerDisplayOffsetX + x*cellSize, centerDisplayOffsetY + y*cellSize, cellSize);

      }
      
    }
  }
  
}

function playerMechanics() {
  if (playerCharacter === 0) {
    playerCharacter = new Player();
  }
  
  if (needsRespawn) {
    playerCharacter = new Player();
    roomCollision = [];
    roomChangeCollision = [];
    displayGrid();
    needsRespawn = false;
    justSpawned = false;
    return;
  }
    playerCharacter.playerMovement();
    playerCharacter.playerCollision();
    playerCharacter.changeRooms();
    if (playerCharacter === 0) {
    playerCharacter = new Player(0, 0, 0, 0);
  }
    playerCharacter.drawPlayer();
    //playerCharacter.attack();
    
}

function addToChangeRoom(yPos, xPos, centerDisplayOffsetX, centerDisplayOffsetY, cellSize) {
  let wallType = 0;
  if (rooms[currentRoomID-1]?.[yPos]?.[xPos+1] === undefined) {
    wallType = "Left";
    roomChangeCollision.push([centerDisplayOffsetX + x*cellSize+cellSize, centerDisplayOffsetY + 
      y*cellSize, centerDisplayOffsetX + x*cellSize+cellSize, centerDisplayOffsetY + y*cellSize+
    cellSize, wallType]);
  }
  else if (rooms[currentRoomID-1][yPos][xPos+1] === 2 || rooms[currentRoomID-1][yPos][xPos+1] === 3) {
    wallType = "Left";
    roomChangeCollision.push([centerDisplayOffsetX + x*cellSize+cellSize, centerDisplayOffsetY + 
      y*cellSize, centerDisplayOffsetX + x*cellSize+cellSize, centerDisplayOffsetY + y*cellSize+
    cellSize, wallType, rooms[currentRoomID-1][yPos][xPos+1]]);
  }
    
  if (rooms[currentRoomID-1]?.[yPos]?.[xPos-1] === undefined) {
    wallType = "Right";
    roomChangeCollision.push([centerDisplayOffsetX + x*cellSize, centerDisplayOffsetY + 
      y*cellSize, centerDisplayOffsetX + x*cellSize, centerDisplayOffsetY + y*cellSize+
    cellSize, wallType]);
    }
  else if (rooms[currentRoomID-1][yPos][xPos-1] === 2 || rooms[currentRoomID-1][yPos][xPos-1] === 3) {
    wallType = "Right";
    roomChangeCollision.push([centerDisplayOffsetX + x*cellSize, centerDisplayOffsetY + 
      y*cellSize, centerDisplayOffsetX + x*cellSize, centerDisplayOffsetY + y*cellSize+
    cellSize, wallType, rooms[currentRoomID-1][yPos][xPos-1]]);
  }
  if (rooms[currentRoomID-1]?.[yPos+1]?.[xPos] === undefined) {
    wallType = "Lower";
    roomChangeCollision.push([centerDisplayOffsetX + x*cellSize, centerDisplayOffsetY + 
      y*cellSize+cellSize, centerDisplayOffsetX + x*cellSize+cellSize, centerDisplayOffsetY + y*cellSize+
    cellSize, wallType]);
    }
  else if (rooms[currentRoomID-1][yPos+1][xPos] === 2 || rooms[currentRoomID-1][yPos+1][xPos] === 3) {
    wallType = "Lower";
    roomChangeCollision.push([centerDisplayOffsetX + x*cellSize, centerDisplayOffsetY + 
      y*cellSize+cellSize, centerDisplayOffsetX + x*cellSize+cellSize, centerDisplayOffsetY + y*cellSize+
    cellSize, wallType, rooms[currentRoomID-1][yPos+1][xPos]]);
  }
  if (rooms[currentRoomID-1]?.[yPos-1]?.[xPos] === undefined) {
    wallType = "Upper";
    roomChangeCollision.push([centerDisplayOffsetX + x*cellSize, centerDisplayOffsetY + 
      y*cellSize, centerDisplayOffsetX + x*cellSize+cellSize, centerDisplayOffsetY + y*cellSize+
    cellSize, wallType]);
    }
  else if (rooms[currentRoomID-1]?.[yPos-1]?.[xPos] === 2 || rooms[currentRoomID-1][yPos-1][xPos] === 3) {
    wallType = "Upper";
    roomChangeCollision.push([centerDisplayOffsetX + x*cellSize, centerDisplayOffsetY + 
      y*cellSize, centerDisplayOffsetX + x*cellSize+cellSize, centerDisplayOffsetY + y*cellSize+
    cellSize, wallType, rooms[currentRoomID-1][yPos-1][xPos]]);
  }
}