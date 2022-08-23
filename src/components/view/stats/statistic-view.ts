import './style.scss';
import { IGameState } from "../../../typings";
import { GameStatistic } from './game-statistic';
import {
  createElementWithClassnames,
  createElementWithContent,
} from "../utils";

export class StatisticView {

  create(gameState: IGameState){
    const statisticContainer = createElementWithClassnames("section", "statistic-container");
    const statisticHeader = createElementWithClassnames('h2', 'statistic-header');
    statisticHeader.textContent = 'Статистика за сегодня';

    const statsToday = createElementWithClassnames('div', 'stats-today-wrapper')
    const wordsLearntContent = createElementWithContent('p', `Изучено слов: ${String(gameState.wordsLearnt)}`);

    const correctAnswersContent = createElementWithContent('p', `Правильные ответы: ${String(gameState.correctAnswers)}`);

    const sprintStatistic = new GameStatistic(gameState, 'sprint');
    const callStatistic = new GameStatistic(gameState, 'audio-call');


    statsToday.append(wordsLearntContent, correctAnswersContent);
    statisticContainer.append(statisticHeader, statsToday, sprintStatistic.template, callStatistic.template);

    return statisticContainer;
  }
}