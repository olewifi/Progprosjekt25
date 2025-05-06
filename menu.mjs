"use strict";
/* Use this file to create the menu for the snake game. */

import libSprite_v2 from "./libSprite_v2.mjs";
import lib2d_v2 from "./lib2d_v2.mjs"; 
import { EGameStatus,GameProps, SheetData } from "./game.mjs";
import { GameBoardSize, EBoardCellInfoType, TGameBoard } from "./gameBoard.mjs";
import { TSnake } from "./snake.mjs";

export class TMenu {
    #spButtonPlay; 
    #spButtonGameOver; 
    #spButtonHome;
    #spButtonRetry; 
    #spButtonResume;
    #spButtonPause; 

    constructor(aSpriteCanvas){
        //get position for button to be in the middle of the canvas
        const pos = new lib2d_v2.TPosition( aSpriteCanvas.canvas.width /2 - SheetData.Play.width /2, aSpriteCanvas.canvas.height /2-SheetData.Play.height /2); 

        this.#spButtonPlay = new libSprite_v2.TSpriteButton(aSpriteCanvas, SheetData.Play, pos ); 
        this.#spButtonPlay.onClick = () => {
            GameProps.gameStatus = EGameStatus.Playing; //Kan jeg gjøre det slik??
        }

        this.#spButtonPause = new libSprite_v2.TSpriteButton(aSpriteCanvas, SheetData.Resume, pos ); 

        pos.x = 95; 
        pos.y = 398; //Det funker men er det poenget at jeg kan gjøre dte slik??
        this.#spButtonHome = new libSprite_v2.TSpriteButton(aSpriteCanvas, SheetData.Home, pos); 
        this.#spButtonHome.onClick = () => {
            GameProps.gameStatus = EGameStatus.Idle; //Kan jeg gjøre det slik?? må isåfall også ha newgame i game.mjs? og vil jeg egt ha onclick her??
        }

        pos.x = 645; 
        pos.y = 398; //Det funker men er det poenget at jeg kan gjøre dte slik??
        this.#spButtonRetry = new libSprite_v2.TSpriteButton(aSpriteCanvas, SheetData.Retry,pos); 
        this.#spButtonRetry.onClick = () => {
            GameProps.gameStatus = EGameStatus.Playing; //Kan jeg gjøre det slik??
        }
        pos.x = 30; 
        pos.y = 50; 
        this.#spButtonGameOver = new libSprite_v2.TSprite(aSpriteCanvas, SheetData.GameOver, pos );
        
        
    
    }

    draw(){
        switch (GameProps.gameStatus){
            case EGameStatus.Idle:
                this.#spButtonPlay.draw();
                break; 
            case EGameStatus.Playing:
                break;
            case EGameStatus.Pause:
                this.#spButtonPause.draw(); 
                break;
            case EGameStatus.GameOver:
                this.#spButtonGameOver.draw(); 
                this.#spButtonHome.draw(); //Legge de inn som buttins i tilleg??
                this.#spButtonRetry.draw(); //Legge de inn som buttins i tilleg??
                break; 
        }
    }
} //end of TMenu

