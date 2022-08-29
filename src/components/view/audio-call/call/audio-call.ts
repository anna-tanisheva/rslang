import './audio-call.scss';
import "../../../../assets/sounds/wrong.mp3";
import "../../../../assets/sounds/correct.mp3";

import {
  createElementWithAttributes,
  createElementWithClassnames,
  createElementWithContent,
  // getRandomInRange,
} from "../../utils";
import { fetchWords } from "../../../controller/api";
import { ENDPOINT } from '../../../controller/state';
import { playWordInGameHandler, getGameWordsArr, getOptions, choseAnswerHandler, } from '../../../controller/ui';
import { IWord } from '../../../../typings';


export class AudioCall {

  section: number;

  page: number;

  state: {
    // correctGuesses: number,
    currentStrick: number,
    maxStrick: number,
    answers: {
      true: string[],
      false: string[]
    }
  };

  gameName: string;

  currentSlide: number;

  wordsInGame: IWord[] | null;

  constructor(sec: number, page: number, gameName: string, currentSlide = 0) {
    this.gameName = gameName;
    this.section = sec;
    this.page = page;
    this.state = {
      // correctGuesses: 0,
      currentStrick: 0,
      maxStrick: 0,
      answers: {
        true: [],
        false: []
      }
    };
    this.currentSlide = currentSlide;
    this.wordsInGame = null;
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
    this.wordsInGame = getGameWordsArr(words.words);
    this.wordsInGame.forEach(word => {
      const card = createElementWithClassnames('div', 'word-card');
      card.setAttribute('data-id', word.id);
      const audioAttr = {
        src: `${ENDPOINT}/${word.audio}`,
        type: 'audio/mpeg',
        tabindex: '-1'
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
      button.setAttribute('tabindex', '-1');
      const img = createElementWithAttributes('img', imgAttr);
      const answer = createElementWithContent('p', `${word.word} ${word.transcription}`);
      answer.classList.add('opacity-hidden');
      answer.classList.add('answer');
      button.addEventListener('click', ()=>{
        playWordInGameHandler((audio as HTMLAudioElement));
      });
      const answersContainer = createElementWithClassnames('div', 'answers-container');
      options.forEach(option=>{
        const tag = createElementWithClassnames('button', 'option');
        tag.setAttribute('data-option', option);
        tag.setAttribute('tabindex', '-1');
        tag.addEventListener('click', (e) => {choseAnswerHandler(e, word.wordTranslate)})
        tag.innerText += option;
        answersContainer.append(tag);
      })
      flipper.append(button, img)
      flipContainer.append(flipper)
      card.append(audio, answersContainer, flipContainer, answer);
      game.append(card);
    })

    return game;
  }

}