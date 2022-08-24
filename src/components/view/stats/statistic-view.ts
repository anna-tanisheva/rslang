import './style.scss';
import { IStatisticState } from "../../../typings";
import { GameStatistic } from './game-statistic';
import {
  createElementWithClassnames,
  createElementWithContent,
} from "../utils";

export class StatisticView {

  create(statisticState: IStatisticState){
    const statisticContainer = createElementWithClassnames("section", "statistic-container");
    const statisticHeader = createElementWithClassnames('h2', 'statistic-header');
    statisticHeader.textContent = 'Статистика за сегодня';

    const statsToday = createElementWithClassnames('div', 'stats-today-wrapper')
    const wordsLearntContent = createElementWithContent('p', `Изучено слов: ${String(statisticState.total.wordsLearnt)}`);

    const correctAnswersContent = createElementWithContent('p', `Правильные ответы: ${String(statisticState.total.correctAnswers)}`);

    const sprintStatistic = new GameStatistic(statisticState, 'sprint');
    const callStatistic = new GameStatistic(statisticState, 'audioCall');


    statsToday.append(wordsLearntContent, correctAnswersContent);
    statisticContainer.append(statisticHeader, statsToday, sprintStatistic.template, callStatistic.template);

    return statisticContainer;
  }
}