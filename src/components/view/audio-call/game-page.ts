import {
  createElementWithClassnames,
} from "../utils";
import { AudioCall } from "./audio-call";
import { currentGame } from "../../controller/state";


export class GamePopUp {

  create(section: number, game: string) {

    const gameContainer = createElementWithClassnames("div", "game-popup");
    const closeButton = createElementWithClassnames('div', 'close-button');
    closeButton.innerText = '+'
    // в конструктор передаем номер раздела от пользователя или слова страницы учебника, с которой была запущена игра
    if(game === 'call') {
      currentGame.game = new AudioCall(section);
      (currentGame.game as AudioCall).create()
      .then((res)=>{
        gameContainer.append(res);
      });
    } else {
    // здесь создаем спринт

      // currentGame.game = new AudioCall(section);
      // (currentGame.game as AudioCall).create()
      // .then((res)=>{
      //   gameContainer.append(res);
      // });
    }
    gameContainer.append(closeButton);
    return gameContainer;
  }
}