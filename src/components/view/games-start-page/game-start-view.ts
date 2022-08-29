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

    const gameContorls = createElementWithClassnames('div', 'key-controls');
    if(this.options.game === 'audio-call') {
      let counter = 0;
      const keyNumberWrapper = createElementWithClassnames('div', 'key-number-wrapper');
      keyNumberWrapper.innerHTML += `<h4>Выбор варианта ответа:</h4>`

      while(counter < 4) {
        const keyCard = createElementWithClassnames('div', `key-img`, `key-${counter + 1}`);
        keyNumberWrapper.append(keyCard);
        counter += 1;
      }
      const escKeyCard = createElementWithClassnames('p', `key-esc-wrapper`, `key-wrapper`);
      escKeyCard.innerHTML += `<div class="key-img key-esc"></div>`;
      escKeyCard.innerHTML += `<h4>Выйти из игры</h4>`;
      const enterKeyCard = createElementWithClassnames('p', `key-enter-wrapper`, `key-wrapper`);
      enterKeyCard.innerHTML += `<div class="key-img key-enter"></div>`;
      enterKeyCard.innerHTML += `<h4>Послушать слово</h4>`;
      const arrowKeyCard = createElementWithClassnames('p', `key-arrow-wrapper`, `key-wrapper`);
      arrowKeyCard.innerHTML += `<div class="key-img key-arrow"></div>`;
      arrowKeyCard.innerHTML += `<h4>Следующее слово</h4>`;
      gameContorls.append(escKeyCard, enterKeyCard, arrowKeyCard, keyNumberWrapper);
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
    startGameContainer.append(callImg, callText, gameLevel, gameContorls, startButton);
    return startGameContainer;
  }
}