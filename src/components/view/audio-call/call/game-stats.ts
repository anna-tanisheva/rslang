import './game-stats.scss'
import { createElementWithClassnames } from "../../utils";
import { currentGame } from "../../../controller/state";
import { AudioCall } from "./audio-call";
import { createAnswersCards } from "../../../controller/ui";

export class GameStats {

  create(): HTMLElement {
    const wrapperInner = createElementWithClassnames('div', 'stats');
    const wrapperStats = createElementWithClassnames('div', 'stats-wrapper');
    const answers = createElementWithClassnames('div', 'answers');
    const strick = createElementWithClassnames('h2', 'stats-best-series');
    strick.textContent = `Самая длинная серия правильных ответов: ${String((currentGame.game as AudioCall).state.maxStrick)}`;
    const answersFalseWrapper = createElementWithClassnames('div', 'answers-wrapper');
    answersFalseWrapper.innerHTML = `<h3 class = "audiocall-wrong-answers">Неверные ответы: ${String((currentGame.game as AudioCall).state.answers.false.length)}</h3>`;
    const answersTrueWrapper = createElementWithClassnames('div', 'answers-wrapper');
    answersTrueWrapper.innerHTML = `<h3 class = "audiocall-right-answers">Правильные ответы: ${String((currentGame.game as AudioCall).state.answers.true.length)} </h3>`;
    Object.keys((currentGame.game as AudioCall).state.answers).forEach(key => {
      if (key === 'false') {
        createAnswersCards(false, answersFalseWrapper);
      } else {
        createAnswersCards(true, answersTrueWrapper);
      }
    })
    answers.append(answersTrueWrapper, answersFalseWrapper);
    wrapperInner.append(wrapperStats);
    wrapperStats.append(strick, answers);
    return wrapperInner;
  }
}
