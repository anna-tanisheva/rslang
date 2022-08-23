import {
  createElementWithClassnames, getRandomSection,
} from "../utils";
import { AudioCall } from "./audio-call";
import { currentGame } from "../../controller/state";


export class GamePopUp {

  create() {

    const gameContainer = createElementWithClassnames("div", "game-popup");
    const closeButton = createElementWithClassnames('div', 'close-button');
    closeButton.innerText = '+'
    const randomSection = getRandomSection();
    // в конструктор передаем номер раздела от пользователя или слова страницы учебника, с которой была запущена игра
    currentGame.game = new AudioCall(randomSection);
    (currentGame.game as AudioCall).create()
    .then((res)=>{
      gameContainer.append(res);
    });
    gameContainer.append(closeButton);
    return gameContainer;
  }
}