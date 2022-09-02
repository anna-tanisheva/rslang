import {
  createElementWithClassnames,
  createElementWithAttributes,
} from "../utils";
import { AudioCall } from "./call/audio-call";
import { currentGame, AUDIO_CALL, SPRINT, appState } from "../../controller/state";
import { playWordInGameHandler, appendGameStats, playAgainHandler, goToStatisticPageHandler, setStats } from '../../controller/ui';
// import { IUserStats } from "../../../typings";
import { Sprint } from "./sprint/sprint-model";
import { IResWordsPage, IUserStats } from "../../../typings";



export class GamePopUp {

  create(section: number, page: number, game: string, arrOfWords?: IResWordsPage) {

    const gameContainer = createElementWithClassnames("div", "game-popup");
    const closeButton = createElementWithClassnames('div', 'close-button');
    const gameStatsWrapper = createElementWithClassnames('div', 'game-stats-wrapper');
    closeButton.innerText = '+'
    const nextButton = createElementWithClassnames('button', 'next-button');
    nextButton.innerHTML = '&#8594;';
    // в конструктор передаем номер раздела от пользователя или слова страницы учебника, с которой была запущена игра
    let wrapper;
    if (game === AUDIO_CALL) {
        const currentSlide = 0;
        if (!arrOfWords) {
            currentGame.game = new AudioCall(section, page, game, currentSlide);
        } else {
            currentGame.game = new AudioCall(
                section,
                page,
                game,
                currentSlide,
                arrOfWords
            );
        }
        (currentGame.game as AudioCall)
            .create()
            .then((res) => {
                gameContainer.append(res);
            })
            .catch((err) => {
                console.log(JSON.stringify(err));
            })
            .finally(() => {
                const audio = gameContainer?.querySelector(
                    ".audio-call>.word-card:first-child>audio"
                );
                playWordInGameHandler(audio as HTMLAudioElement);
            });

            gameStatsWrapper.classList.add('opacity-hidden');
            const stats = createElementWithClassnames('div', 'game-stats');
            gameStatsWrapper.append(appendGameStats(stats));
            const playAgain = createElementWithClassnames('button', 'play-again-btn', 'button');
            playAgain.textContent = 'Играть еще раз';
            playAgain.addEventListener('click', () => {
              playAgainHandler(gameContainer, section);
            });
            playAgain.addEventListener('keydown', (e) => {
              console.log(e);
              e.preventDefault();
              if (e.keyCode === 13) {
                playAgainHandler(gameContainer, section);
              }
            })
            const goToStatisticPage = createElementWithClassnames('button', 'go-to-stats', 'button');
            goToStatisticPage.textContent = 'Статистика';
            goToStatisticPage.addEventListener('click', () => {
              if(!appState.isSignedIn) {
                setStats((currentGame.game as AudioCall), appState.userNull);
            } else {
                setStats((currentGame.game as AudioCall), (appState.user.statsToday as IUserStats));
            }
              goToStatisticPageHandler();
            });
            wrapper = createElementWithClassnames('div', 'game-stats');
            gameStatsWrapper.append(playAgain, goToStatisticPage, wrapper);
    } else if (game === SPRINT) {
        if (!arrOfWords) {
            currentGame.game = new Sprint(section, page, game);
        } else {
            currentGame.game = new Sprint(section, page, game, arrOfWords);
        }
        (currentGame.game as Sprint)
            .create()
            .then((res) => {
                gameContainer.append(res);
            })
            .catch((err) => {
                console.log("bfbbfbf");
                (currentGame.game as Sprint).endGame();
                console.log(JSON.stringify(err));
            });
    }

    const wrongSoundAttr = {
      src: `./sounds/wrong.mp3`,
      type: 'audio/mpeg',
      tabindex: '-1'
    }
    const correctSoundAttr = {
      src: `./sounds/correct.mp3`,
      type: 'audio/mpeg',
      tabindex: '-1'
    }
    const wrongSound = createElementWithAttributes('audio', wrongSoundAttr);
    wrongSound.classList.add('wrong-sound');
    const correctSound = createElementWithAttributes('audio', correctSoundAttr);
    correctSound.classList.add('correct-sound');
    gameContainer.append(wrongSound, correctSound, closeButton, nextButton)
    if(currentGame.game as AudioCall) {
      gameContainer.append(gameStatsWrapper)
    }
    return gameContainer;
  }
}