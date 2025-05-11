"use strict";

//Bugs
//mute button når man refresher siden

//-----------------------------------------------------------------------------------------
//----------- Import modules, mjs files  ---------------------------------------------------
//-----------------------------------------------------------------------------------------
import libSound from "./libSound.mjs";
import libSprite from "./libSprite_v2.mjs";
//import lib2d_v2 from "./lib2d_v2.mjs";
import { TGameBoard, GameBoardSize, TBoardCell } from "./gameBoard.mjs";
import { TSnake, EDirection, } from "./snake.mjs";
import { TBait } from "./bait.mjs";
import { TMenu } from "./menu.mjs"; //ikke tenk på denne enda 
//import libSprite_v2 from "./libSprite_v2.mjs";

//-----------------------------------------------------------------------------------------
//----------- variables and object --------------------------------------------------------
//-----------------------------------------------------------------------------------------
const chkMuteSound = document.getElementById("chkMuteSound");
const cvs = document.getElementById("cvs");
const spcvs = new libSprite.TSpriteCanvas(cvs);; 
let gameSpeed = 4; // Game speed multiplier;
let hndUpdateGame = null;
export const EGameStatus = { Idle: 0, Playing: 1, Pause: 2, GameOver: 3 };

// prettier-ignore
export const SheetData = {
  Head:     { x:   0, y:   0, width:  38, height:  38, count:  4 },
  Body:     { x:   0, y:  38, width:  38, height:  38, count:  6 },
  Tail:     { x:   0, y:  76, width:  38, height:  38, count:  4 },
  Bait:     { x:   0, y: 114, width:  38, height:  38, count:  1 },
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
  bait: null,
  menu: null, 
  sounds:{food:null, running:null, gameOver:null}, 
  totalScore: 0,
  baitScore: 50,
};

//------------------------------------------------------------------------------------------
//----------- Exported functions -----------------------------------------------------------
//------------------------------------------------------------------------------------------


export function newGame() {
  GameProps.gameBoard = new TGameBoard();
  GameProps.snake = new TSnake(spcvs, new TBoardCell(5, 5)); // Initialize snake with a starting position
  GameProps.bait = new TBait(spcvs); // Initialize bait with a starting position
  gameSpeed = 4; // Reset game speed
  GameProps.totalScore = 0; 
  GameProps.baitScore = 50;
  GameProps.menu.updateScore(GameProps.baitScore, GameProps.totalScore); //oppdaterer verdier før vi viser dem fram 

  setSoundOnOff(); //når nytt spill, så sjekk om lyd er muted
  GameProps.gameStatus = EGameStatus.Playing; 
  console.log("Game started");
  startMusic();
}

export function startMusic() { //starter musikk ved unpause, unmute, og start spill 
  // Reset music
  if (!GameProps.soundMuted) {
    GameProps.sounds.running.stop();
    GameProps.sounds.running.play();
    console.log("Music playing"); 

    clearInterval();
    setInterval(() => {
      if (!GameProps.soundMuted) {
        GameProps.sounds.running.stop();
        GameProps.sounds.running.play(); 
      }
    }, 153000); // 2.33 minutes in milliseconds

    GameProps.isRunningSoundPlaying = true;
  }
}

export function bateIsEaten() {

  console.log("Bait eaten!");
  GameProps.sounds.food.stop(); // må stoppe musikken for å resete, ellers vil den ikke spilles igjen
  if(!GameProps.soundMuted){
  GameProps.sounds.food.play(); //spiller når ikke muted 
  }
 
  GameProps.snake.addSnakePart(); //Increase snake size

  //Increase score when bait is eaten//
  GameProps.totalScore += GameProps.baitScore;
  console.log("The bait score is: " + GameProps.baitScore + " Totalscore: " + GameProps.totalScore);
 
  GameProps.baitScore = 50;  //resetting baitscore
  GameProps.bait.update(); 
  increaseGameSpeed(); // Increase game speed
}


//------------------------------------------------------------------------------------------
//----------- functions -------------------------------------------------------------------
//------------------------------------------------------------------------------------------

function loadGame() {
  cvs.width = GameBoardSize.Cols * SheetData.Head.width;
  cvs.height = GameBoardSize.Rows * SheetData.Head.height;


  GameProps.gameStatus = EGameStatus.Idle; // change game status to Idle
  GameProps.menu = new TMenu(spcvs); 

  //newGame(); 
  GameProps.menu.hideStuff();
  requestAnimationFrame(drawGame);
  
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

  switch (GameProps.gameStatus) {
    case EGameStatus.Idle:
      GameProps.menu.draw();
      break; 
    case EGameStatus.Playing:
      GameProps.bait.draw();
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

          GameProps.sounds.gameOver.stop(); // må stoppe musikken for å resete, ellers vil den ikke spilles igjen
          GameProps.sounds.gameOver.play(); // Play the game over sound
        } 
        GameProps.sounds.running.stop();
        GameProps.menu.gameOver(); 

      }
      GameProps.menu.updateScore(GameProps.baitScore, GameProps.totalScore); 

      break;
  }
}

function increaseGameSpeed() {
   gameSpeed += 0.5; //adding speed
  console.log("Increased game speed! Gamespeed is currently: " + gameSpeed);
}

//-----------------------------------------------------------------------------------------
//----------- Event handlers --------------------------------------------------------------
//-----------------------------------------------------------------------------------------


function setSoundOnOff() { //Tatt fra FlappyBird, sjekker om lyden er muted eller på 
  if (chkMuteSound.checked) {
    GameProps.soundMuted = true;
    GameProps.sounds.running.stop();
    console.log("Sound muted");
  } else {
    GameProps.soundMuted = false;
    if(GameProps.gameStatus === EGameStatus.Playing){
       startMusic(); //starter kun musikk når man spiller spillet, selv ved når man trykker mute og unmute
    } //
    console.log("Sound on");
  }
} // end of setSoundOnOff

//her var startMusic

function onKeyDown(event) {
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

spcvs.loadSpriteSheet("./Media/spriteSheet.png", loadGame);
document.addEventListener("keydown", onKeyDown);
