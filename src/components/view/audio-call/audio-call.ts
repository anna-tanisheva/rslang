import './audio-call.scss';
import "../../../assets/sounds/wrong.mp3";
import "../../../assets/sounds/correct.mp3";

import {
  createElementWithAttributes,
  createElementWithClassnames,
  // createElementWithContent,
} from "../utils";
import { fetchWords } from "../../controller/api";
import { ENDPOINT } from '../../controller/state';
import { playWordInGameHandler, getGameWordsArr, getOptions, choseAnswerHandler } from '../../controller/ui';


export class AudioCall {

  section: number;

  page: number;

  constructor(sec: number, page: number) {
    this.section = sec;
    this.page = page
  }

  async create(): Promise<HTMLElement> {

    const words = await fetchWords({
      group: this.section,
      page: this.page
    })
    const game = createElementWithClassnames("div", "audio-call");
    console.log(words);
    const arrOfTranslations: string[] = [];
    words.words.forEach(word => {
      arrOfTranslations.push(word.wordTranslate)
    })
    const wordsInGame = getGameWordsArr(words.words);
    wordsInGame.forEach(word => {
      const card = createElementWithClassnames('div', 'word-card');
      card.setAttribute('data-id', word.id);
      const audioAttr = {
        src: `${ENDPOINT}/${word.audio}`,
        type: 'audio/mpeg'
      };

      const imgAttr = {
        src: `${ENDPOINT}/${word.image}`,
        type: 'audio/mpeg'
      }

      const options = getOptions(arrOfTranslations, word.wordTranslate);
      console.log(options)
      const audio = createElementWithAttributes('audio', audioAttr);
      const button = createElementWithClassnames('button', 'play-button');
      const img = createElementWithAttributes('img', imgAttr);
      button.innerText = 'Послушать';
      button.addEventListener('click', playWordInGameHandler);
      const answersContainer = createElementWithClassnames('div', 'answers-container');
      options.forEach(option=>{
        const tag = createElementWithClassnames('button', 'option');
        tag.setAttribute('data-option', option);
        tag.addEventListener('click', (e) => {choseAnswerHandler(e, word.wordTranslate)})
        tag.innerText += option;
        answersContainer.append(tag);
      })
      card.append(img, audio, button, answersContainer);
      game.append(card);
    })

    return game;
  }

}