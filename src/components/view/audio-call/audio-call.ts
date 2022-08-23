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

  state: {
    correctGuesses: number,
    currentStrick: number,
    maxStrick: number
  }

  constructor(sec: number, page: number) {
    this.section = sec;
    this.page = page;
    this.state = {
      correctGuesses: 0,
      currentStrick: 0,
      maxStrick: 0

    }
  }

  async create(): Promise<HTMLElement> {

    const words = await fetchWords({
      group: this.section,
      page: this.page
    })
    const game = createElementWithClassnames("div", "audio-call");
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
        alt: `${word.word}`,
      }
      const options = getOptions(arrOfTranslations, word.wordTranslate);
      const audio = createElementWithAttributes('audio', audioAttr);
      const flipContainer = createElementWithClassnames('div', 'flip-container');
      const flipper = createElementWithClassnames('div', 'flipper');

      const button = createElementWithClassnames('button', 'play-button');
      const img = createElementWithAttributes('img', imgAttr);
      button.addEventListener('click', playWordInGameHandler);
      const answersContainer = createElementWithClassnames('div', 'answers-container');
      options.forEach(option=>{
        const tag = createElementWithClassnames('button', 'option');
        tag.setAttribute('data-option', option);
        tag.addEventListener('click', (e) => {choseAnswerHandler(e, word.wordTranslate)})
        tag.innerText += option;
        answersContainer.append(tag);
      })
      flipper.append(button, img)
      flipContainer.append(flipper)
      card.append(audio, answersContainer, flipContainer);
      game.append(card);
    })

    return game;
  }

}