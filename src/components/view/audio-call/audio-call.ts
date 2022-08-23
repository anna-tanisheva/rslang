import './audio-call.scss';
import {
  createElementWithAttributes,
  createElementWithClassnames,
  // createElementWithContent,
  getRandomPage
} from "../utils";
import { fetchWords } from "../../controller/api";
// import { IWord } from '../../../typings';
// import { getWordsForGame } from '../../controller/ui';
import { ENDPOINT } from '../../controller/state';
import { playWordInGameHandler, getGameWordsArr } from '../../controller/ui';

export class AudioCall {

  section: number;

  constructor(sec: number) {
    this.section = sec
  }

  async create(): Promise<HTMLElement> {
    const randomPage = getRandomPage();
    const words = await fetchWords({
      group: this.section,
      page: randomPage
    })
    const game = createElementWithClassnames("div", "audio-call");
    console.log(words)
    const wordsInGame = getGameWordsArr(words.words);
    wordsInGame.forEach(word => {
      const card = createElementWithClassnames('div', 'word-card');
      card.setAttribute('data-id', word.id);
      const audioAttr = {
        src: `${ENDPOINT}/${word.audio}`,
        type: 'audio/mpeg'
      }
      const audio = createElementWithAttributes('audio', audioAttr);
      const button = createElementWithClassnames('button', 'play-button');
      button.innerText = 'Послушать';
      button.addEventListener('click', playWordInGameHandler);
      card.append(audio, button);
      game.append(card);
    })

    return game;
  }

}