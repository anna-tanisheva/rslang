import './games-page.scss';
import "../../../assets/images/icons8-динамик-100.png";
import "../../../assets/images/icons8-cards-64.png";
import {
  createElementWithClassnames,
} from "../utils";
import { GameStartView } from './game-start-view';

export class GamesPage {

  create() {
    const gamesContainer = createElementWithClassnames("section", "games");
    const callStartView = new GameStartView({
      game: 'audio-call',
      text: 'Тренировка понимания речи на слух. Выберете уровень сложности слов и попробуйте набрать максимальное количество очков',
      pathToImg: './images/icons8-динамик-100.png'
    }).create();

    const sprintStartView = new GameStartView({
      game: 'sprint',
      text: 'Будьте fast and furious, угадывайте перевод слов на время',
      pathToImg: './images/icons8-cards-64.png'
    }).create();

    gamesContainer.append(callStartView, sprintStartView);
    return gamesContainer;
  }
}