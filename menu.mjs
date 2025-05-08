"use strict";
/* Use this file to create the menu for the snake game. */
import libSprite_v2 from "./libSprite_v2.mjs";
import lib2d_v2 from "./lib2d_v2.mjs";
import {
  EGameStatus,
  GameProps,
  SheetData,
  newGame,
  playSound,
} from "./game.mjs";
import { GameBoardSize, EBoardCellInfoType, TGameBoard } from "./gameBoard.mjs";
import { TSnake } from "./snake.mjs";

export class TMenu {
  #spButtonPlay;
  #spButtonGameOver;
  #spButtonHome;
  #spButtonRetry;
  #spButtonResume;
  #spButtonPause;

  constructor(aSpriteCanvas) {
    //get position for button to be in the middle of the canvas
    const pos = new lib2d_v2.TPosition(
      aSpriteCanvas.canvas.width / 2 - SheetData.Play.width / 2,
      aSpriteCanvas.canvas.height / 2 - SheetData.Play.height / 2
    );

    this.#spButtonPlay = new libSprite_v2.TSpriteButton(
      aSpriteCanvas,
      SheetData.Play,
      pos
    );
    this.#spButtonPlay.animateSpeed = 45;
    this.#spButtonPlay.onClick = () => {
      newGame();
      GameProps.gameStatus = EGameStatus.Playing;
      console.log("Game started");
      GameProps.sounds.running.play();
    };

    this.#spButtonPause = new libSprite_v2.TSpriteButton(
      aSpriteCanvas,
      SheetData.Resume,
      pos
    );
    this.#spButtonPause.animateSpeed = 45;
    this.#spButtonPause.onClick = () => {
      GameProps.gameStatus = EGameStatus.Playing;
    };

    pos.x = 95; 
    pos.y = 398;
    this.#spButtonHome = new libSprite_v2.TSpriteButton(
      aSpriteCanvas,
      SheetData.Home,
      pos
    );
    this.#spButtonHome.onClick = () => {
      GameProps.gameStatus = EGameStatus.Idle;
    };

    pos.x = 645;
    pos.y = 398;
    this.#spButtonRetry = new libSprite_v2.TSpriteButton(
      aSpriteCanvas,
      SheetData.Retry,
      pos
    );
    this.#spButtonRetry.onClick = () => {
      newGame();
      GameProps.gameStatus = EGameStatus.Playing;
    };
    pos.x = 30;
    pos.y = 50;
    this.#spButtonGameOver = new libSprite_v2.TSprite(
      aSpriteCanvas,
      SheetData.GameOver,
      pos
    );
  }


  draw() { //Alle knapper har visable lik false og true, bruker dermed disse for å skjule knapper når de ikke er på skjermen
    switch (GameProps.gameStatus){
      case EGameStatus.Idle:
        this.#spButtonPlay.draw();

        this.#spButtonPause.visible = false; 
        this.#spButtonHome.visible = false; 
        break;
        
      case EGameStatus.Playing:
        //i want the music running to be here during the game and i want it to loop. the song enda after 2.33 minutes. 
        //playSound(GameProps.sounds.running); // Play sound when game starts
        //const MusicRunning = GameProps.sounds.running; // Play sound when game starts
        
        
  
  
        this.#spButtonPlay.visible = false; 
        this.#spButtonHome.visible = false;
        this.#spButtonRetry.visible = false;
        this.#spButtonPause.visible = false; 
        
        break;

      case EGameStatus.Pause:
        GameProps.sounds.running.pause();

        this.#spButtonPause.draw();

        this.#spButtonPlay.visible = false;
        this.#spButtonHome.visible = false;
        this.#spButtonRetry.visible = false;
        break;

      case EGameStatus.GameOver:
        GameProps.sounds.running.stop(); 

        this.#spButtonGameOver.draw();
        this.#spButtonHome.draw(); 
        this.#spButtonRetry.draw(); 

        this.#spButtonPause.visible = false; 
        this.#spButtonPlay.visible = true;
        this.#spButtonHome.visible = true; 
        this.#spButtonRetry.visible = true;
        break;
    }
  }

    /*

draw(){
  this.#spButtonPlay.draw();
  this.#spButtonPause.draw();
  this.#spButtonGameOver.draw();
  this.#spButtonHome.draw();
  this.#spButtonRetry.draw();
  this.#spButtonResume.draw(); 


  switch(GameProps.gameStatus) {
    case EGameStatus.Idle:
      this.#spButtonPlay.visible = true; 
      this.#spButtonPause.visible = false; 
      this.#spButtonGameOver.visible = false; 
      this.#spButtonHome.visible = false; 
      this.#spButtonRetry.visible = false; 
      break;
    case EGameStatus.Playing:
      this.#spButtonPlay.visible = false; 
      this.#spButtonPause.visible = true; 
      this.#spButtonGameOver.visible = false; 
      this.#spButtonHome.visible = false; 
      this.#spButtonRetry.visible = false; 
      break;
    case EGameStatus.Pause:
      this.#spButtonPlay.visible = false; 
      this.#spButtonPause.visible = true; 
      this.#spButtonGameOver.visible = false; 
      this.#spButtonHome.visible = false; 
      this.#spButtonRetry.visible = false; 
      break;
    case EGameStatus.GameOver:
      this.#spButtonPlay.visible = true; 
      this.#spButtonPause.visible = false; 
      this.#spButtonGameOver.visible = true; 
      this.#spButtonHome.visible = true; 
      this.#spButtonRetry.visible = true; 
      break;
  }

  togglePause() {
    if (GameProps.gameStatus === EGameStatus.Pause) {
      GameProps.gameStatus === EGameStatus.Playing;
    } else if (GameProps.gameStatus === EGameStatus.Pause)
      GameProps.gameStatus === EGameStatus.Playing;
    }
    this.#spButtonPause.visible = GameProps.gameStatus === EGameStatus.Pause;

}
}
*/
//end of TMenu


togglePause(){
  if(GameProps.gameStatus === EGameStatus.Playing) {
    GameProps.gameStatus = EGameStatus.Pause;
  } else if(GameProps.gameStatus === EGameStatus.Pause) {
    GameProps.gameStatus = EGameStatus.Playing;
  }
  this.#spButtonPause.visible = GameProps.gameStatus === EGameStatus.Pause;
  
}
}