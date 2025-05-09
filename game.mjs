"use strict";

//Bugs
//mute button når man refresher siden

//-----------------------------------------------------------------------------------------
//----------- Import modules, mjs files  ---------------------------------------------------
//-----------------------------------------------------------------------------------------
import libSound from "./libSound.mjs";
import libSprite from "./libSprite_v2.mjs";
import lib2d_v2 from "./lib2d_v2.mjs";
import { TGameBoard, GameBoardSize, TBoardCell } from "./gameBoard.mjs";
import { TSnake, EDirection, } from "./snake.mjs";
import { TBait } from "./bait.mjs";
import { TMenu } from "./menu.mjs"; //ikke tenk på denne enda 
import libSprite_v2 from "./libSprite_v2.mjs";

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
  gameStatus: EGameStatus.idle,
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

export function playSound(aSound) { //Importert fra FlappyBird
  if (!GameProps.soundMuted) {
    aSound.play();
  } else {
    aSound.pause();
  }
}

export function newGame() {
  GameProps.gameBoard = new TGameBoard();
  GameProps.snake = new TSnake(spcvs, new TBoardCell(5, 5)); // Initialize snake with a starting position
  GameProps.bait = new TBait(spcvs); // Initialize bait with a starting position
  gameSpeed = 4; // Reset game speed
  GameProps.totalScore = 0;
}

export function bateIsEaten() {

  console.log("Bait eaten!");
  playSound(GameProps.sounds.food); 
  GameProps.sounds.food.stop(); // må stoppe musikken for å resete, ellers vil den ikke spilles igjen
  playSound(GameProps.sounds.food); 


  /* Logic to increase the snake size and score when bait is eaten */
  //Increase snake size
  GameProps.snake.addSnakePart(); 
  
  //Increase score when bait is eaten//
  GameProps.totalScore += GameProps.baitScore;
  console.log("The bait score is: " + GameProps.baitScore + " Totalscore: " + GameProps.totalScore);
  //resetting baitscore
  GameProps.baitScore = 50;
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
 //GameProps.menu.onClick = EGameStatus.Playing; 
  GameProps.menu = new TMenu(spcvs); 

  //newGame(); 

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
       // GameProps.snake.gameSpeed= 0; //Stop the snake den virker som sagt til å forsvinne atm but still 
        console.log("Game over!");
        playSound(GameProps.sounds.gameOver);
        GameProps.sounds.gameOver.stop(); // må stoppe musikken for å resete, ellers vil den ikke spilles igjen
        playSound(GameProps.sounds.gameOver); // Play the game over sound
      }
      break;
  }
}

function increaseGameSpeed() {
  /* Increase game speed logic here */
  gameSpeed += 0.5; //adding speed
  console.log("Increased game speed! Gamespeed is currently: " + gameSpeed);
}

//-----------------------------------------------------------------------------------------
//----------- Event handlers --------------------------------------------------------------
//-----------------------------------------------------------------------------------------


function setSoundOnOff() { //Tatt fra FlappyBird
  if (chkMuteSound.checked) {
    GameProps.soundMuted = true;

    console.log("Sound muted");
  } else {
    GameProps.soundMuted = false;
    console.log("Sound on");
  }
} // end of setSoundOnOff

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
