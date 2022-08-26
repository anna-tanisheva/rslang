import './game-stats.scss'
import { createElementWithClassnames, createElementWithContent } from "../../utils";
import { currentGame } from "../../../controller/state";
import { AudioCall } from "./audio-call";
// import { IWord } from "../../../../typings";
// import { playWordInGameHandler } from "../../../controller/ui";
import { createAnswersCards } from "../../../controller/ui";

export class GameStats {

  create(): HTMLElement {
    const wrapperInner = createElementWithClassnames('div', 'stats');
    const answers = createElementWithClassnames('div', 'answers');
    const correctAnswers = createElementWithContent('p', `Вы ответили правильно на ${String((currentGame.game as AudioCall).state.answers.true.length)} вопросов`);
    const strick = createElementWithContent('p', `Самая длинная последовательность правильных ответов: ${String((currentGame.game as AudioCall).state.maxStrick)}`);
    const name = createElementWithContent('h3', String((currentGame.game as AudioCall).gameName));
    const answersFalseWrapper = createElementWithClassnames('div', 'answers-wrapper');
    answersFalseWrapper.innerHTML = `<h4>Вы ответили неправильно: </h4>`;
    const answersTrueWrapper = createElementWithClassnames('div', 'answers-wrapper');
    answersTrueWrapper.innerHTML = `<h4>Вы ответили правильно: </h4>`;
    Object.keys((currentGame.game as AudioCall).state.answers).forEach(key => {
      if (key === 'false') {
        createAnswersCards(false, answersFalseWrapper);
      } else {
        createAnswersCards(true, answersTrueWrapper);
      }
    })
    answers.append(answersFalseWrapper, answersTrueWrapper);
    wrapperInner.append(name, strick, correctAnswers, answers);
    return wrapperInner;
  }
}
