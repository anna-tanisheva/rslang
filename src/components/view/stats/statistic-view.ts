import './style.scss';
import { IAppState, IUserStats } from "../../../typings";
import { GameStatistic } from './game-statistic';
import {
  createElementWithAttributes,
  createElementWithClassnames,
  createElementWithContent,
} from "../utils";
import { setDailyChart, processLongStats } from '../../controller/ui';

import { SPRINT, AUDIO_CALL } from '../../controller/state';
import { LongStats } from './long-term-stats';

export class StatisticView {

  create(appState: IAppState){
    let wordsLearntContent: string | Node;
    let correctAnswersContent: string | Node;
    let sprintStatistic: GameStatistic;
    let callStatistic: GameStatistic;
    let userStats;
    if(appState.isSignedIn) {
      userStats = appState.user.statsToday;
      wordsLearntContent = createElementWithContent('p', `Изучено слов: ${String((userStats as IUserStats).statisticState.total.wordsLearnt)}`);
      correctAnswersContent = createElementWithContent('p', `Правильные ответы: ${String((userStats as IUserStats).statisticState.total.correctAnswers)}`);
      sprintStatistic = new GameStatistic((userStats as IUserStats).statisticState, SPRINT);
      callStatistic = new GameStatistic((userStats as IUserStats).statisticState, AUDIO_CALL);
    } else {
      userStats = appState.userNull;
      wordsLearntContent = createElementWithContent('p', `Изучено слов: ${String(userStats.statisticState.total.wordsLearnt)}`);
      correctAnswersContent = createElementWithContent('p', `Правильные ответы: ${String(userStats.statisticState.total.correctAnswers)}`);
      sprintStatistic = new GameStatistic(userStats.statisticState, SPRINT);
      callStatistic = new GameStatistic(userStats.statisticState, AUDIO_CALL);
    }
    const statisticContainer = createElementWithClassnames("section", "statistic-container");
    const statisticHeader = createElementWithClassnames('h2', 'statistic-header');
    statisticHeader.textContent = 'Статистика за сегодня';

    const statisticHeaderToday = createElementWithClassnames('h2', 'statistic-header-total');
    statisticHeaderToday.textContent = 'Общая статистика за сегодня';


    const statsToday = createElementWithClassnames('div', 'stats-today-wrapper', 'statistic-wrapper');
    const chartHTMLElemOptions = {
      id: `total-chart`,
      class: `chart`
    }
    const chart = createElementWithAttributes('canvas', chartHTMLElemOptions);
    const data = [(userStats as IUserStats).statisticState.total.correctAnswersPercent, 100 - (userStats as IUserStats).statisticState.total.correctAnswersPercent];
    setDailyChart((chart as HTMLCanvasElement), data);

    const longTermHeader = createElementWithContent('h3', `Ежедневный прогресс`)
    let longStats: LongStats | HTMLElement;
    processLongStats().then((res)=>{
      longStats = new LongStats(res).create();
    }).finally(()=>{
      statsToday.append(statisticHeaderToday, wordsLearntContent, correctAnswersContent, chart);
      statisticContainer.append(statisticHeader, statsToday, sprintStatistic.template, callStatistic.template, longTermHeader, (longStats as string | Node));
    })
    return statisticContainer;
  }
}