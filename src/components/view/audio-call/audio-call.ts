import './audio-call.scss';
import "../../../assets/sounds/wrong.mp3";
import "../../../assets/sounds/correct.mp3";

import {
  createElementWithAttributes,
  createElementWithClassnames,
  createElementWithContent,
  getRandomPage,
} from "../utils";
import { fetchWords } from "../../controller/api";
import { ENDPOINT, currentGame } from '../../controller/state';
import { playWordInGameHandler, getGameWordsArr, getOptions, choseAnswerHandler, startGame } from '../../controller/ui';
import { isHTMLDivElement, isHTMLElement } from '../../../typings/utils/utils';


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
    wordsInGame.forEach((word, ind) => {
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
      options.sort(() => (Math.random() > .5) ? 1 : -1);
      const audio = createElementWithAttributes('audio', audioAttr);
      const flipContainer = createElementWithClassnames('div', 'flip-container');
      const flipper = createElementWithClassnames('div', 'flipper');

      const button = createElementWithClassnames('button', 'play-button');
      const img = createElementWithAttributes('img', imgAttr);
      const answer = createElementWithContent('p', `${word.word} ${word.transcription}`);
      answer.classList.add('opacity-hidden');
      answer.classList.add('answer');
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
      card.append(audio, answersContainer, flipContainer, answer);
      game.append(card);
      if (ind === wordsInGame.length - 1) {
        const buttonWrapper = createElementWithClassnames('div', 'buttons-wrapper');
        const playAgain = createElementWithClassnames('button', 'play-again', 'button');
        playAgain.textContent = 'Играть еще раз';
        playAgain.addEventListener('click', () => {
          currentGame.game = null;
          const CALL_GAME = 'call';
          const PAGE = getRandomPage();
          const container = document.querySelector('.games');
          if(!isHTMLElement(container)) return;
          const gameContainer = container.querySelector('.game-popup');
          if(!isHTMLDivElement(gameContainer)) return;
          container.removeChild(gameContainer);
          startGame(container, this.section, CALL_GAME, PAGE);
        })

        const gameStats = createElementWithClassnames('button', 'game-stats', 'button');
        gameStats.textContent = 'Статистика игры';
        buttonWrapper.append(gameStats, playAgain)
        card.append(buttonWrapper);
      }
    })

    return game;
  }

}