import './style.scss';
import { IAppState, IUserStats } from "../../../typings";
import { GameStatistic } from './game-statistic';
import {
  createElementWithClassnames,
  createElementWithContent,
} from "../utils";
import { SPRINT, AUDIO_CALL } from '../../controller/state';

export class StatisticView {

  create(appState: IAppState){
    let wordsLearntContent;
    let correctAnswersContent;
    let sprintStatistic;
    let callStatistic;
    let userStats;
    let correctAnswersPercentContent;
    if(appState.isSignedIn) {
      userStats = appState.user.statsToday;
      wordsLearntContent = createElementWithContent('p', `Изучено слов: ${String((userStats as IUserStats).statisticState.total.wordsLearnt)}`);
      correctAnswersPercentContent = createElementWithContent('p', `Вы ответили правильно на ${String((userStats as IUserStats).statisticState.total.correctAnswersPercent)} % вопросов`);
      correctAnswersContent = createElementWithContent('p', `Правильные ответы: ${String((userStats as IUserStats).statisticState.total.correctAnswers)}`);
      sprintStatistic = new GameStatistic((userStats as IUserStats).statisticState, SPRINT);
      callStatistic = new GameStatistic((userStats as IUserStats).statisticState, AUDIO_CALL);
    } else {
      userStats = appState.userNull;
      wordsLearntContent = createElementWithContent('p', `Изучено слов: ${String(userStats.statisticState.total.wordsLearnt)}`);
      correctAnswersContent = createElementWithContent('p', `Правильные ответы: ${String(userStats.statisticState.total.correctAnswers)}`);
      sprintStatistic = new GameStatistic(userStats.statisticState, SPRINT);
      callStatistic = new GameStatistic(userStats.statisticState, AUDIO_CALL);
      correctAnswersPercentContent = createElementWithContent('p', `Вы ответили правильно на ${String((userStats as IUserStats).statisticState.total.correctAnswersPercent)} % вопросов`);
    }
    const statisticContainer = createElementWithClassnames("section", "statistic-container");
    const statisticHeader = createElementWithClassnames('h2', 'statistic-header');
    statisticHeader.textContent = 'Статистика за сегодня';

    const statsToday = createElementWithClassnames('div', 'stats-today-wrapper');
    statsToday.append(wordsLearntContent, correctAnswersContent, correctAnswersPercentContent);
    statisticContainer.append(statisticHeader, statsToday, sprintStatistic.template, callStatistic.template);

    return statisticContainer;
  }
}