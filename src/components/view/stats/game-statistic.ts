import { IStatisticState } from "../../../typings";
import {
  // createElementWithAttributes,
  createElementWithClassnames, createElementWithContent,
  // createElementWithContent,
} from "../utils";


export class GameStatistic {
  public template: HTMLElement;

  private gameNameRu: string;

  private gameName: string;


  constructor(statisticState: IStatisticState, gameName: string) {
    if(gameName === 'sprint') {
      this.gameNameRu = 'Спринт';
      this.gameName = gameName;
    } else {
      this.gameNameRu = 'Аудио-вызов';
      this.gameName = gameName;
    }
    this.template = this.setItem(statisticState);
  }

  setItem(statisticState: IStatisticState): HTMLElement {
    const statisticContainer = createElementWithClassnames("div", `statistic-${this.gameName}-container`, 'statistic-wrapper');
    const statisticHeader = createElementWithClassnames('h2', `${this.gameName}-header`);
    statisticHeader.textContent = this.gameNameRu;
    const wordsLearntWrapper = createElementWithClassnames('div', 'words-learnt-wrapper');
    const wordsLearntContent = createElementWithContent('p', `Изучено слов: ${statisticState[this.gameName as keyof typeof statisticState].wordsLearnt}`);
    const correctAnswersWrapper = createElementWithClassnames('div', 'correct-answers-wrapper');
    const correctAnswersContent = createElementWithContent('p', `Правильные ответы: ${String(statisticState[this.gameName as keyof typeof statisticState].correctAnswers)}`);
    const correctAnswersStrickWrapper = createElementWithClassnames('div', 'correct-answers-wrapper');
    const correctAnswersStrickContent = createElementWithContent('p', `Самая длинная серия: ${String(statisticState[this.gameName as keyof typeof statisticState].correctAnswersStrick)}`);
    wordsLearntWrapper.append(wordsLearntContent);
    correctAnswersWrapper.append(correctAnswersContent);
    correctAnswersStrickWrapper.append(correctAnswersStrickContent)
    statisticContainer.append(statisticHeader, wordsLearntWrapper, correctAnswersWrapper, correctAnswersStrickWrapper);

    return statisticContainer;
  }
}