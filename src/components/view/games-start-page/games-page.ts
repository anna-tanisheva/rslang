import './games-page.scss';
import "../../../assets/images/icons8-динамик-100.png";
import "../../../assets/images/icons8-cards-64.png";
import {
  createElementWithClassnames,
} from "../utils";
import { GameStartView } from './game-start-view';
import { startGameHandler } from '../../controller/ui';

export class GamesPage {

  create() {
    const gamesContainer = createElementWithClassnames("section", "games");
    const callStartView = new GameStartView({
      name: 'Аудиовызов',
      game: 'audio-call',
      text: 'Тренировка понимания речи на слух. Найди правильный перевод из четырех предложенных',
      pathToImg: './images/icons8-динамик-100.png'
    }).create();

    const sprintStartView = new GameStartView({
      name: 'Спринт',
      game: 'sprint',
      text: 'Будь fast and furious, успей за минуту дать максимальное количество верных ответов',
      pathToImg: './images/icons8-cards-64.png'
    }).create();

    gamesContainer.append(callStartView, sprintStartView);

    gamesContainer.addEventListener('click', startGameHandler);

    return gamesContainer;
  }
}