import {
  createElementWithClassnames,
  createElementWithAttributes,
  getRandomInRange
} from "../utils";
import { isHTMLElement,
  //  isHTMLDivElement
  } from "../../../typings/utils/utils";
import { AudioCall } from "./call/audio-call";
import { currentGame, TEXTBOOK_PAGE_COUNT, appState } from "../../controller/state";
import { startGame, playWordInGameHandler, appendGameStats, setStats } from '../../controller/ui';
import { IUserStats } from "../../../typings";



export class GamePopUp {

  create(section: number, game: string, page: number) {

    const gameContainer = createElementWithClassnames("div", "game-popup");
    const closeButton = createElementWithClassnames('div', 'close-button');
    closeButton.innerText = '+'
    const nextButton = createElementWithClassnames('button', 'next-button');
    nextButton.innerHTML = '&#8594;';
    // в конструктор передаем номер раздела от пользователя или слова страницы учебника, с которой была запущена игра
    if(game === 'Audio Call') {
      currentGame.game = new AudioCall(section, page, game);
      (currentGame.game as AudioCall).create()
      .then((res)=>{
        gameContainer.append(res)
      })
      .catch((err)=>{
        console.log(JSON.stringify(err))
      })
      .finally(()=>{
        const audio = gameContainer?.querySelector('.audio-call>.word-card:first-child>audio');
        playWordInGameHandler(audio as HTMLAudioElement);
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

    const gameStatsWrapper = createElementWithClassnames('div', 'game-stats-wrapper');
    gameStatsWrapper.classList.add('opacity-hidden');
    const stats = createElementWithClassnames('div', 'game-stats');
    gameStatsWrapper.append(appendGameStats(stats));
    const playAgain = createElementWithClassnames('button', 'play-again-btn', 'button');
    playAgain.textContent = 'Играть еще раз';
    playAgain.addEventListener('click', () => {
      if(!appState.isSignedIn) {
        setStats((currentGame.game as AudioCall), appState.userNull);
    } else {
        setStats((currentGame.game as AudioCall), (appState.user.statsToday as IUserStats));
    }
      currentGame.game = null;
      const CALL_GAME = 'Audio Call';
      const PAGE = getRandomInRange(TEXTBOOK_PAGE_COUNT);
      const container = document.querySelector('.games');
      if(!isHTMLElement(container)) return;
      container.removeChild(gameContainer);
      startGame(container, section, CALL_GAME, PAGE);
    })
    const wrapper = createElementWithClassnames('div', 'game-stats');
    gameStatsWrapper.append(playAgain, wrapper);
    gameContainer.append(wrongSound, correctSound, closeButton, nextButton, gameStatsWrapper)
    return gameContainer;
  }
}