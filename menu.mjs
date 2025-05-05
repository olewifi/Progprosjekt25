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

        this.#spButtonPlay = new libSprite_v2.TSprite(aSpriteCanvas, SheetData.Play, pos ); //funker pos her?

        this.#spButtonPause = new libSprite_v2.TSprite(aSpriteCanvas, SheetData.Resume, pos ); 

        pos.x = 30; //SPØR LÆRER OM Å HELLER ENDRE TIL DYNAMISK ELLER EI !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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

