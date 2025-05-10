"use strict";
/* Use this file to create the menu for the snake game. */
import libSprite_v2 from "./libSprite_v2.mjs";
import lib2d_v2 from "./lib2d_v2.mjs";
import {
  EGameStatus,
  GameProps,
  SheetData,
  newGame,
  startMusic,
} from "./game.mjs";

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
      this.#spButtonPlay.visible = false;
    };

    this.#spButtonPause = new libSprite_v2.TSpriteButton(
      aSpriteCanvas,
      SheetData.Resume,
      pos
    );
    this.#spButtonPause.animateSpeed = 45;
    this.#spButtonPause.onClick = () => {
      this.togglePause();
    };

    pos.x = 95; 
    pos.y = 398;
    this.#spButtonHome = new libSprite_v2.TSpriteButton(
      aSpriteCanvas,
      SheetData.Home,
      pos
    );
    this.#spButtonHome.onClick = () => {
      this.homeButton();
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
      this.hideStuff();
      this.#spButtonRetry.visible = false;
      this.#spButtonPlay.visible = false;
    };

    pos.x = 30;
    pos.y = 50;
    this.#spButtonGameOver = new libSprite_v2.TSprite(
      aSpriteCanvas,
      SheetData.GameOver,
      pos
    );
  }

homeButton(){ //her blir play visible når du trykker på home og alt annet er usynlig
  GameProps.gameStatus = EGameStatus.Idle;
  this.#spButtonPlay.visible = true;
  this.#spButtonHome.visible = false;
  this.#spButtonRetry.visible = false;
  this.#spButtonGameOver.visible = false;
  this.#spButtonPause.visible = false; 
}

draw() { //her tegnes ting som er visible 
  
  this.#spButtonGameOver.draw();
  this.#spButtonHome.draw(); 
  this.#spButtonPlay.draw(); 
  this.#spButtonPause.draw(); 
  this.#spButtonRetry.draw(); 
  }

gameOver(){  
  this.#spButtonGameOver.visible = true;
  this.#spButtonRetry.visible = true;
  this.#spButtonHome.visible = true;
}


hideStuff() { //hjemmer alt utennom play når spillet lastes 
  this.#spButtonPlay.visible = true; 
  this.#spButtonPause.visible = false; 
  this.#spButtonRetry.visible = false; 
  this.#spButtonHome.visible = false; 
  this.#spButtonGameOver.visible = false;
}

togglePause(){ //toggler pause + musikk 
  if(GameProps.gameStatus === EGameStatus.Playing) {
    GameProps.gameStatus = EGameStatus.Pause;
    GameProps.isRunningSoundPlaying = false;
    GameProps.sounds.running.stop();
    
  } else if(GameProps.gameStatus === EGameStatus.Pause) {
    GameProps.gameStatus = EGameStatus.Playing;
    GameProps.isRunningSoundPlaying = true;
    startMusic();
  }
  
  this.#spButtonPause.visible = GameProps.gameStatus === EGameStatus.Pause;
}
}