// Brayden and Jaydeep
//30/01/26
//Gamejam - Undead (wt)

const TILESINROW = 15;
let includeNextDigits = false;
let dFlag = 0;
let roomsLoaded = false;
let rooms = [];
let currentRoomID = 1;
let roomCollision = [];

class Player {
  constructor (x, y, xvelocity, yvelocity) {
    this.x = windowWidth/2;
    this.y = windowHeight/2;
  }
}

fetch('https://raw.githubusercontent.com/Consumerofbread56/Practice-for-Gamejam/refs/heads/main/practice%20for%20da%20game%20jam/roomData.txt')
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
  displayGrid()
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
  return false
}
}

function addToCollision(yPos, xPos) {
  if (rooms[currentRoomID][yPos][xPos+1] === 1 || rooms[currentRoomID][yPos][xPos+1] === 
    undefined) {
    roomCollision.push([centerDisplayOffsetX + x*cellSize+cellSize, centerDisplayOffsetY + 
      y*cellSize, centerDisplayOffsetX + x*cellSize+cellSize, centerDisplayOffsetY + y*cellSize+
    cellSize])
    }
  if (rooms[currentRoomID][yPos][xPos-1] === 1 || rooms[currentRoomID][yPos][xPos-1] === 
    undefined) {
    roomCollision.push([centerDisplayOffsetX + x*cellSize, centerDisplayOffsetY + 
      y*cellSize, centerDisplayOffsetX + x*cellSize, centerDisplayOffsetY + y*cellSize+
    cellSize])
    }
  if (rooms[currentRoomID][yPos+1][xPos] === 1 || rooms[currentRoomID][yPos+1][xPos] === 
    undefined) {
    roomCollision.push([centerDisplayOffsetX + x*cellSize, centerDisplayOffsetY + 
      y*cellSize+cellSize, centerDisplayOffsetX + x*cellSize+cellSize, centerDisplayOffsetY + y*cellSize+
    cellSize])
    }
  if (rooms[currentRoomID][yPos-1][xPos] === 1 || rooms[currentRoomID][yPos-1][xPos] === 
    undefined) {
    roomCollision.push([centerDisplayOffsetX + x*cellSize, centerDisplayOffsetY + 
      y*cellSize, centerDisplayOffsetX + x*cellSize, centerDisplayOffsetY + y*cellSize+
    cellSize])
    }
}

function displayGrid() {
  if (roomsLoaded === true) {
    let cellSize = windowHeight/15;
    let centerDisplayOffsetX = displayWidth/2-windowHeight/2;
    let centerDisplayOffsetY = windowHeight/30
    for (x = 0; x < rooms[currentRoomID-1].length-1; x++) {
      for (y = 0; y < rooms[currentRoomID-1][x].length-1; y++) {
        if (rooms[currentRoomID-1][y][x] === 0) {
          fill(0, 0, 0);
          addToCollision(y, x);
        }
        else {
          fill(255, 255, 255);
        }
        square(centerDisplayOffsetX + x*cellSize, centerDisplayOffsetY + y*cellSize, cellSize);

      }
      
    }
  }
  
}