import './style.scss';
import { IAppState, IUserStats } from "../../../typings";
import { GameStatistic } from './game-statistic';
import {
  createElementWithClassnames,
  createElementWithContent,
} from "../utils";

export class StatisticView {

  create(appState: IAppState){
    let wordsLearntContent;
    let correctAnswersContent;
    let sprintStatistic;
    let callStatistic;
    let userStats;
    if(appState.isSignedIn) {
      userStats = appState.user.statsToday;
      wordsLearntContent = createElementWithContent('p', `Изучено слов: ${String((userStats as IUserStats).statisticState.total.wordsLearnt)}`);
      correctAnswersContent = createElementWithContent('p', `Правильные ответы: ${String((userStats as IUserStats).statisticState.total.correctAnswers)}`);
      sprintStatistic = new GameStatistic((userStats as IUserStats).statisticState, 'sprint');
      callStatistic = new GameStatistic((userStats as IUserStats).statisticState, 'audioCall');
    } else {
      userStats = appState.userNull;
      wordsLearntContent = createElementWithContent('p', `Изучено слов: ${String(userStats.statisticState.total.wordsLearnt)}`);
      correctAnswersContent = createElementWithContent('p', `Правильные ответы: ${String(userStats.statisticState.total.correctAnswers)}`);
      sprintStatistic = new GameStatistic(userStats.statisticState, 'sprint');
      callStatistic = new GameStatistic(userStats.statisticState, 'audioCall');
    }
    const statisticContainer = createElementWithClassnames("section", "statistic-container");
    const statisticHeader = createElementWithClassnames('h2', 'statistic-header');
    statisticHeader.textContent = 'Статистика за сегодня';

    const statsToday = createElementWithClassnames('div', 'stats-today-wrapper');

    statsToday.append(wordsLearntContent, correctAnswersContent);
    statisticContainer.append(statisticHeader, statsToday, sprintStatistic.template, callStatistic.template);

    return statisticContainer;
  }
}