"use strict";
//-----------------------------------------------------------------------------------------
//----------- Import modules, mjs files  ---------------------------------------------------
//-----------------------------------------------------------------------------------------
import libSound from "./libSound.mjs";
import libSprite from "./libSprite_v2.mjs";
import { TGameBoard, GameBoardSize, TBoardCell } from "./gameBoard.mjs";
import { TSnake, EDirection, } from "./snake.mjs";
import { TBait, TGoldenBait } from "./bait.mjs";
import { TMenu } from "./menu.mjs";

//-----------------------------------------------------------------------------------------
//----------- variables and object --------------------------------------------------------
//-----------------------------------------------------------------------------------------

const chkMuteSound = document.getElementById("chkMuteSound");
const snakeColour = document.getElementsByName("snakeColour");
const cvs = document.getElementById("cvs");
const spcvs = new libSprite.TSpriteCanvas(cvs);
let gameSpeed = 4;
let hndUpdateGame = null;
let musicCounter = 153; 
export const EGameStatus = { Idle: 0, Playing: 1, Pause: 2, GameOver: 3 }; 

// prettier-ignore
export const SheetData = {
  Head:     { x:   0, y:   0, width:  38, height:  38, count:  4 },
  Body:     { x:   0, y:  38, width:  38, height:  38, count:  6 },
  Tail:     { x:   0, y:  76, width:  38, height:  38, count:  4 },
  Head_2:   { x: 222, y:   0, width:  38, height:  38, count:  4 }, //Extra sprites from extended sprite sheet
  Body_2:   { x: 222, y:  38, width:  38, height:  38, count:  6 }, // -||-
  Tail_2:   { x: 222, y:  76, width:  38, height:  38, count:  4 }, // -||-
  Bait:     { x:   0, y: 114, width:  38, height:  38, count:  1 },
  Bait_2:   { x:  32, y: 114, width:  38, height:  38, count:  1 }, // -||-
  Play:     { x:   0, y: 155, width: 202, height: 202, count: 10 },
  GameOver: { x:   0, y: 647, width: 856, height: 580, count:  1 },
  Home:     { x:  65, y: 995, width: 169, height: 167, count:  1 },
  Retry:    { x: 614, y: 995, width: 169, height: 167, count:  1 },
  Resume:   { x:   0, y: 357, width: 202, height: 202, count: 10 },
  Number:   { x:   0, y: 560, width:  81, height:  86, count: 10 },
};

export const GameProps = {
  soundMuted: false,
  gameBoard: null,
  gameStatus: EGameStatus.Idle,
  snake: null,
  SnakeColourSpriteHead: null,
  SnakeColourSpriteBody: null,
  SnakeColourSpriteTail: null,
  bait: null,
  GoldenBait: null,
  menu: null, 
  sounds:{food:null, running:null, gameOver:null}, 
  totalScore: 0,
  baitScore: 50,
  GoldenBaitScore: 50,
  GoldenBaitCountdown: 30,
  BaitsEatenCounter: 0,
};

//------------------------------------------------------------------------------------------
//----------- Exported functions -----------------------------------------------------------
//------------------------------------------------------------------------------------------

export function newGame() {
  GameProps.gameBoard = new TGameBoard();
  GameProps.snake = new TSnake(spcvs, new TBoardCell(5, 5)); 
  GameProps.bait = new TBait(spcvs); 
  GameProps.GoldenBait = new TGoldenBait(spcvs); 
  GameProps.GoldenBait.visible = false; 
  //Reset
  gameSpeed = 4; 
  GameProps.totalScore = 0;
  GameProps.baitScore = 50;
  GameProps.GoldenBaitCountdown = 30;
  GameProps.BaitsEatenCounter = 0;
  GameProps.menu.updateScore(GameProps.baitScore, GameProps.totalScore); //Updates the score value

  setSoundOnOff(); //When new game, check if sound is muted
  GameProps.gameStatus = EGameStatus.Playing; 
  console.log("Game started");
  startMusic(); 

  clearInterval(hndUpdateGame); 
  hndUpdateGame = setInterval(updateGame, 1000 / gameSpeed); 
}

export function startMusic() { 
  // Resets music
  if (!GameProps.soundMuted) {
    GameProps.sounds.running.stop();
    GameProps.sounds.running.play();
    console.log("Music playing"); 

    clearInterval();
    setInterval(() => {//timer so that the music replays correctly
       if(GameProps.gameStatus != EGameStatus.GameOver && GameProps.gameStatus != EGameStatus.Idle) {
        musicCounter--;
      }
      if (!GameProps.soundMuted && musicCounter <= 0) {
        GameProps.sounds.running.stop();
        GameProps.sounds.running.play(); 
        musicCounter = 153;
      }
    }, 1000);
  }
}

export function bateIsEaten() {

  console.log("Bait eaten!");
  GameProps.sounds.food.stop(); //Must stop the music to reset, or else it will not play
  if(!GameProps.soundMuted){
  GameProps.sounds.food.play();
  }

  increaseGameSpeed();
  GameProps.snake.addSnakePart();
  GameProps.totalScore += GameProps.baitScore;
  GameProps.baitScore = 50;
  GameProps.bait.update();
  //console.log("There is: " + GameProps.BaitsEatenCounter + " baits eaten");
  //console.log("The bait score is: " + GameProps.baitScore + " Totalscore: " + GameProps.totalScore);
}

export function GoldBaitIsEaten() {
  GameProps.sounds.food.stop();
  if(!GameProps.soundMuted){
  GameProps.sounds.food.play(); 
  }
  increaseGameSpeed(); 
  GameProps.snake.addSnakePart(); 

  GameProps.totalScore += GameProps.GoldenBaitScore;
  GameProps.GoldenBaitCountdown = 30; //Resets countdown every time the golden apple is eaten
  GameProps.GoldenBait.visible = false; //makes it invisible after it's eaten so that you can't see the next location
}


//------------------------------------------------------------------------------------------
//----------- functions -------------------------------------------------------------------
//------------------------------------------------------------------------------------------

function loadGame() {
  cvs.width = GameBoardSize.Cols * SheetData.Head.width;
  cvs.height = GameBoardSize.Rows * SheetData.Head.height;

  GameProps.gameStatus = EGameStatus.Idle; 
  GameProps.menu = new TMenu(spcvs);

  GameProps.menu.hideStuff(); //Hides the sprites we don't want to see yet
  requestAnimationFrame(drawGame); 
  setSnakeColour(); //Loads in which snakecolour has been chosen
  
  console.log("Game canvas is rendering!");
  hndUpdateGame = setInterval(updateGame, 1000 / gameSpeed); 
  console.log("Game canvas is updating!");

  //Loading sounds
  GameProps.sounds.food = new libSound.TSoundFile("./Music/food.mp3");
  GameProps.sounds.running = new libSound.TSoundFile("./Music/running.mp3");
  GameProps.sounds.gameOver = new libSound.TSoundFile("./Music/heroIsDead.mp3");
}

function drawGame() {

  spcvs.clearCanvas(); // Clears the canvas

  switch (GameProps.gameStatus) { //Draws the gameprops in the different EgameStatuses
    case EGameStatus.Idle:
      GameProps.menu.draw();
      break; 
    case EGameStatus.Playing:
      GameProps.bait.draw();
      GameProps.GoldenBait.draw();
      GameProps.snake.draw();
      GameProps.menu.draw(); 
      break; 
    case EGameStatus.Pause:
      GameProps.bait.draw();
      GameProps.snake.draw();
      GameProps.menu.draw(); 
      break;
    case EGameStatus.GameOver:
      GameProps.menu.draw(); 
      break; 
  }
  // Request the next frame
  requestAnimationFrame(drawGame);
}

function updateGame() {
  // Update game logic here
  switch (GameProps.gameStatus) {
    case EGameStatus.Idle:
      document.getElementsByName("snakeColour").forEach((el) => el.disabled = false); // Re-enables snakcolours
      break; 

    case EGameStatus.Playing:
      if (!GameProps.snake.update()) {
        GameProps.gameStatus = EGameStatus.GameOver;
        console.log("Game over!");
         if (!GameProps.soundMuted) {
          GameProps.sounds.gameOver.stop();
          GameProps.sounds.gameOver.play(); 
        } 
        GameProps.sounds.running.stop();
        GameProps.menu.gameOver();
        }
        document.getElementsByName("snakeColour").forEach((el) => el.disabled = true); // It loops through and disables all snakecolour radio buttons during game 

      if(GameProps.BaitsEatenCounter === 7){ //Spawns the Golden apple when 7th apple is eaten
        GameProps.BaitsEatenCounter = 0; //Resets the counter in game, if not the Golden apple will dance around the gameboard
        GameProps.GoldenBait.update(); //Moves the Apple to a new spot
        GameProps.GoldenBait.visible = true; //Shows the Golden Apple
        console.log("Golden apple has spawned");
      }else if(GameProps.GoldenBaitCountdown === 0){ //If snake does not eat golden apple in time it will disappear
        GameProps.GoldenBait.visible = false;
        GameProps.GoldenBaitCountdown = 30; //Resets the countdown
      }
      GameProps.menu.updateScore(GameProps.baitScore, GameProps.totalScore); 
      document.getElementsByName("snakeColour").disabled = true;  
      break;

    case EGameStatus.GameOver:
      GameProps.sounds.running.stop();
      document.getElementsByName("snakeColour").forEach((el) => el.disabled = false); // Re-enables snakcolours
      break;
  }
}

function increaseGameSpeed() {
   gameSpeed += 0.5;
  //console.log("Increased game speed! Gamespeed is currently: " + gameSpeed);
  clearInterval(hndUpdateGame); 
  hndUpdateGame = setInterval(updateGame, 1000 / gameSpeed); 
}

//-----------------------------------------------------------------------------------------
//----------- Event handlers --------------------------------------------------------------
//-----------------------------------------------------------------------------------------

function setSoundOnOff() { //Reused from Flappybird, checks if the sound is muted or not 
  if (chkMuteSound.checked) {
    GameProps.soundMuted = true;
    GameProps.sounds.running.pause();
    console.log("Sound muted");
  } else {
    GameProps.soundMuted = false;
     if((GameProps.gameStatus === EGameStatus.Playing || GameProps.gameStatus === EGameStatus.Pause) && 
      (GameProps.gameStatus !== EGameStatus.Idle || GameProps.gameStatus !== EGameStatus.GameOver)){
       GameProps.sounds.running.play();
    }
    console.log("Sound on");
  }
} // end of setSoundOnOff

function setSnakeColour(){ //Uses a variable that will change the snake colour to either green or purple
  if(snakeColour[0].checked){
    GameProps.SnakeColourSpriteHead = SheetData.Head;
    GameProps.SnakeColourSpriteBody = SheetData.Body;
    GameProps.SnakeColourSpriteTail = SheetData.Tail;
    console.log("Snake is green");
  }else if(snakeColour[1].checked){
    GameProps.SnakeColourSpriteHead = SheetData.Head_2;
    GameProps.SnakeColourSpriteBody = SheetData.Body_2;
    GameProps.SnakeColourSpriteTail = SheetData.Tail_2;
    console.log("Snake is purple");
  }
}

function onKeyDown(event) { //the controls of the snake
  switch (event.key) {
    case "ArrowUp":
      GameProps.snake.setDirection(EDirection.Up);
      break;
    case "ArrowDown":
      GameProps.snake.setDirection(EDirection.Down);
      break;
    case "ArrowLeft":
      GameProps.snake.setDirection(EDirection.Left);
      break;
    case "ArrowRight":
      GameProps.snake.setDirection(EDirection.Right);
      break;
    case " ":
      console.log("Space key pressed!");
      /* Pause the game logic here */
      GameProps.menu.togglePause(); 
      
      break;
    default:
      console.log(`Key pressed: "${event.key}"`); 
  }
}
//-----------------------------------------------------------------------------------------
//----------- main -----------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
chkMuteSound.addEventListener("change", setSoundOnOff); //sjekker for aktivitet på checboxen, om lyd skal være på eller av
snakeColour[0].addEventListener("change", setSnakeColour);
snakeColour[1].addEventListener("change", setSnakeColour);


spcvs.loadSpriteSheet("./Media/spriteSheet_2.png", loadGame);
document.addEventListener("keydown", onKeyDown);
