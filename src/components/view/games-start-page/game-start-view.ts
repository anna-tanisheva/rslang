import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createElementWithAttributes,
  createElementWithClassnames,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createElementWithContent,
} from "../utils";

export class GameStartView {

  options: {
    game: string,
    text: string,
    pathToImg: string
  }

  constructor(options: {
    game: string,
    text: string,
    pathToImg: string
  }) {
    this.options = options;
  }

  create(){
    const startGameContainer = createElementWithClassnames("div", `${this.options.game}-container`);
    startGameContainer.classList.add('game-container');
    const imgAttributes = {
      src: this.options.pathToImg,
      alt: this.options.game
    }
    const callImg = createElementWithAttributes("img", imgAttributes);
    const callText = createElementWithContent('p', this.options.text);
    const gameLevelAttributes = {
      name: 'lvl',
      class: 'game-level'
    }
    const gameLevel = createElementWithAttributes('select', gameLevelAttributes)
    gameLevel.innerHTML = `
    <option value="0">Уровень 1</option>
    <option value="1">Уровень 2</option>
    <option value="2">Уровень 3</option>
    <option value="3">Уровень 4</option>
    <option value="4">Уровень 5</option>
    <option value="5">Уровень 6</option>
    `
    const startButton = createElementWithClassnames('button', `start-button`, `${this.options.game}-button`);
    startButton.textContent = 'Поехали!'
    startGameContainer.append(callImg, callText, gameLevel, startButton);
    return startGameContainer;
  }
}