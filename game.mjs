"use strict";

//-----------------------------------------------------------------------------------------
//----------- Import modules, mjs files  ---------------------------------------------------
//-----------------------------------------------------------------------------------------
import libSound from "./libSound.mjs";
import libSprite from "./libSprite_v2.mjs";
import { TGameBoard, GameBoardSize, TBoardCell, EBoardCellInfoType } from "./gameBoard.mjs";
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
let gameSpeed = 4; // Game speed multiplier;
let hndUpdateGame = null;
export const EGameStatus = { Idle: 0, Playing: 1, Pause: 2, GameOver: 3 }; //The statuses of the game

let musicCounter = 153; //Counts something 

// prettier-ignore
export const SheetData = {
  Head:     { x:   0, y:   0, width:  38, height:  38, count:  4 },
  Body:     { x:   0, y:  38, width:  38, height:  38, count:  6 },
  Tail:     { x:   0, y:  76, width:  38, height:  38, count:  4 },
  Head_2:   { x: 222, y:   0, width:  38, height:  38, count:  4 },
  Body_2:   { x: 222, y:  38, width:  38, height:  38, count:  6 },
  Tail_2:   { x: 222, y:  76, width:  38, height:  38, count:  4 },
  Bait:     { x:   0, y: 114, width:  38, height:  38, count:  1 },
  Bait_2:   { x:  32, y: 114, width:  38, height:  38, count:  1 },
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
  BaitEatenCounter: 0,
};

//------------------------------------------------------------------------------------------
//----------- Exported functions -----------------------------------------------------------
//------------------------------------------------------------------------------------------


export function newGame() {
  GameProps.gameBoard = new TGameBoard();
  GameProps.snake = new TSnake(spcvs, new TBoardCell(5, 5)); // Initialize snake with a starting position
  GameProps.bait = new TBait(spcvs); // Initialize bait with a starting position
  GameProps.GoldenBait = new TGoldenBait(spcvs); //initialize goldenbait wit a starting position
  GameProps.GoldenBait.visible = false; //makes the golden apple invisible at start
  gameSpeed = 4; // Reset gamespeed
  GameProps.totalScore = 0; //Reset totalscore
  GameProps.baitScore = 50;
  GameProps.GoldenBaitCountdown = 30;
  GameProps.menu.updateScore(GameProps.baitScore, GameProps.totalScore); //Updates the scores value befor we show them

  setSoundOnOff(); //When new game, check if sound is muted
  GameProps.gameStatus = EGameStatus.Playing; 
  console.log("Game started");
  startMusic(); 

  clearInterval(hndUpdateGame); 
  hndUpdateGame = setInterval(updateGame, 1000 / gameSpeed); 
}

export function startMusic() { //Starts music when going out of the states of unpaused, unmuted and start game. The song restarts when paused.
  // Resets music
  if (!GameProps.soundMuted) {
    GameProps.sounds.running.stop();
    GameProps.sounds.running.play();
    console.log("Music playing"); 

    clearInterval();
    setInterval(() => {
       if(GameProps.gameStatus != EGameStatus.GameOver && GameProps.gameStatus != EGameStatus.Idle) {
        musicCounter--;
      }
      if (!GameProps.soundMuted && musicCounter <= 0) {
        GameProps.sounds.running.stop();
        GameProps.sounds.running.play(); 
        musicCounter = 153;
      }
    }, 1000); // 2.33 minutes in milliseconds
  }
}

export function bateIsEaten() {

  console.log("Bait eaten!");
  GameProps.sounds.food.stop(); //Must stop the music to rest, or else it will not play
  if(!GameProps.soundMuted){
  GameProps.sounds.food.play(); //Plays when not muted 
  }

  increaseGameSpeed(); // Increase game speed
  GameProps.snake.addSnakePart(); //Increase snake size

  //Increase score when bait is eaten//
  GameProps.totalScore += GameProps.baitScore;
  console.log("The bait score is: " + GameProps.baitScore + " Totalscore: " + GameProps.totalScore);
 
  GameProps.baitScore = 50;  //Resetting baitscore
  GameProps.bait.update();  //Moves bait
  console.log("There is: " + GameProps.BaitEatenCounter + " baits eaten");
}

export function GoldBaitIsEaten() {
  GameProps.sounds.food.stop(); //Must stop the music to rest, or else it will not play
  if(!GameProps.soundMuted){
  GameProps.sounds.food.play(); //Plays when not muted 
  }
  increaseGameSpeed(); // Increase game speed
  GameProps.snake.addSnakePart(); //Increase snake size

  //Increase score when Goldenbait is eaten//
  GameProps.totalScore += GameProps.GoldenBaitScore;
  GameProps.GoldenBaitCountdown = 30;
  GameProps.GoldenBait.visible = false;
}


//------------------------------------------------------------------------------------------
//----------- functions -------------------------------------------------------------------
//------------------------------------------------------------------------------------------

function loadGame() {
  cvs.width = GameBoardSize.Cols * SheetData.Head.width;
  cvs.height = GameBoardSize.Rows * SheetData.Head.height;


  GameProps.gameStatus = EGameStatus.Idle; // change game status to Idle
  GameProps.menu = new TMenu(spcvs); 

  GameProps.menu.hideStuff(); //Hides everything except play when the game loads in
  requestAnimationFrame(drawGame); //animates the game
  setSnakeColour();
  
  console.log("Game canvas is rendering!");
  hndUpdateGame = setInterval(updateGame, 1000 / gameSpeed); 
  console.log("Game canvas is updating!");

  //Loading sounds
  GameProps.sounds.food = new libSound.TSoundFile("./Music/food.mp3");
  GameProps.sounds.running = new libSound.TSoundFile("./Music/running.mp3");
  GameProps.sounds.gameOver = new libSound.TSoundFile("./Music/heroIsDead.mp3");
}


function drawGame() {
  // Clear the canvas
  spcvs.clearCanvas();

  switch (GameProps.gameStatus) { //Draws the games in the different EgameStatuses
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
    case EGameStatus.Playing:
      if (!GameProps.snake.update()) {
        GameProps.gameStatus = EGameStatus.GameOver;
        console.log("Game over!");
         if (!GameProps.soundMuted) {

          GameProps.sounds.gameOver.stop(); //Stopping the music to reset it, or else it will not play
          GameProps.sounds.gameOver.play(); // Plays the game over sound
        } 
        GameProps.sounds.running.stop();
        GameProps.menu.gameOver(); 
      }
      if(GameProps.BaitEatenCounter === 3){
        console.log("Goldbait is spawned");
        GameProps.BaitEatenCounter = 0;
        GameProps.GoldenBait.update();
        GameProps.GoldenBait.visible = true;
      }else if(GameProps.GoldenBaitCountdown === 0){
        GameProps.GoldenBait.visible = false;
        GameProps.GoldenBaitCountdown = 30;
      }
      GameProps.menu.updateScore(GameProps.baitScore, GameProps.totalScore); 

      break;
    case EGameStatus.GameOver:
      GameProps.sounds.running.stop();
      break;
  }
}

function increaseGameSpeed() {
   gameSpeed += 0.5; //adding speed
  console.log("Increased game speed! Gamespeed is currently: " + gameSpeed);
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
       GameProps.sounds.running.play(); //Starts the music only when one is playing the game, it restarts when you mute/unmute it
    }
    console.log("Sound on");
  }
} // end of setSoundOnOff

function setSnakeColour(){
  if(snakeColour[0].checked){
    GameProps.SnakeColourSpriteHead = SheetData.Head;
    GameProps.SnakeColourSpriteBody = SheetData.Body;
    GameProps.SnakeColourSpriteTail = SheetData.Tail;
    console.log("Snake is green");
  }else if(snakeColour[1].checked){
    GameProps.SnakeColourSpriteHead = SheetData.Head_2;
    GameProps.SnakeColourSpriteBody = SheetData.Body_2;
    GameProps.SnakeColourSpriteTail = SheetData.Tail_2;
    console.log("Snake is purble");
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
