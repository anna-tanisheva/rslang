import {
  createElementWithClassnames,
  createElementWithAttributes
} from "../utils";
import { AudioCall } from "./audio-call";
import { currentGame } from "../../controller/state";


export class GamePopUp {

  create(section: number, game: string, page: number) {

    const gameContainer = createElementWithClassnames("div", "game-popup");
    const closeButton = createElementWithClassnames('div', 'close-button');
    closeButton.innerText = '+'
    const nextButton = createElementWithClassnames('button', 'next-button');
    nextButton.innerText = 'Дальше';
    // в конструктор передаем номер раздела от пользователя или слова страницы учебника, с которой была запущена игра
    if(game === 'call') {
      currentGame.game = new AudioCall(section, page);
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
    const wrongSoundAttr = {
      src: `./sounds/wrong.mp3`,
      type: 'audio/mpeg'
    }
    const correctSoundAttr = {
      src: `./sounds/correct.mp3`,
      type: 'audio/mpeg'
    }
    const wrongSound = createElementWithAttributes('audio', wrongSoundAttr);
    wrongSound.classList.add('wrong-sound');
    const correctSound = createElementWithAttributes('audio', correctSoundAttr);
    correctSound.classList.add('correct-sound');
    gameContainer.append(wrongSound, correctSound, closeButton, nextButton)
    return gameContainer;
  }
}