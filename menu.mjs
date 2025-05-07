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

  draw() {
    switch (GameProps.gameStatus) {
      case EGameStatus.Idle:
        //this.#spButtonPlay.visible = true; //Viser play knappen når game er idle
        this.#spButtonPlay.draw();
        //this.#spButtonPlay.visible = false; 
        //this.#spButtonPlay.disable = true; 
        break;
      case EGameStatus.Playing:
        playSound(GameProps.sounds.running); //Play musikk når game er i gang
        //GameProps.sounds.running.play(); //Play musikk når game er i gang
        this.#spButtonPlay.visible = false;
        //this.#spButtonPlay.disable = true; 
        this.#spButtonHome.visible = false;
        this.#spButtonRetry.visible = false;
        break;
      case EGameStatus.Pause:
        this.#spButtonPause.draw();
        GameProps.sounds.running.pause(); //Pause musikk når pause
        this.#spButtonPlay.visible = false;
        //this.#spButtonPlay.disable = true; 
        this.#spButtonHome.visible = false;
        this.#spButtonRetry.visible = false;
        break;
      case EGameStatus.GameOver:
        this.#spButtonPlay.visible = false;
        this.#spButtonPlay.disable = true; 
        this.#spButtonGameOver.draw();
        this.#spButtonHome.visible = true; 
        this.#spButtonHome.draw(); //Legge de inn som buttins i tilleg?? //home funker
        this.#spButtonRetry.visible = true;
        this.#spButtonRetry.draw(); //Legge de inn som buttins i tilleg??
        //playSound(GameProps.sounds.gameOver);
        GameProps.sounds.running.stop(); //Stopp musikk når game Oer
        break;
    }
  }

  //Alle knapper har disable og visable lik false og true
  togglePause() {
    if (GameProps.gameStatus === EGameStatus.Pause) {
      GameProps.gameStatus = EGameStatus.Playing;
    } else {
      GameProps.gameStatus = EGameStatus.Pause;
    }
    this.#spButtonPause.visible = GameProps.gameStatus === EGameStatus.Pause;
  }
}
//end of TMenu