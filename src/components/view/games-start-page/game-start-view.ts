import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createElementWithAttributes,
  createElementWithClassnames,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createElementWithContent,
} from "../utils";

export class GameStartView {

  options: {
    name: string,
    game: string,
    text: string,
    pathToImg: string
  }

  constructor(options: {
    name: string,
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
        keyCard.innerHTML = `${counter +1}`;
        keyNumberWrapper.append(keyCard);
        counter += 1;
      }
      const escKeyCard = createElementWithClassnames('div', `key-esc-wrapper`, `key-wrapper`);
      const escKeyCardIcon = createElementWithClassnames('p', 'key-img', 'key-esc');
      escKeyCardIcon.innerHTML= `Esc`;
      escKeyCard.append(escKeyCardIcon);
      escKeyCard.innerHTML += `<h4>Выйти из игры</h4>`;
      const enterKeyCard = createElementWithClassnames('div', `key-enter-wrapper`, `key-wrapper`);
      const enterKeyCardIcon = createElementWithClassnames('p', 'key-img', 'key-enter');
      enterKeyCardIcon.innerHTML = '&#8629;'
      enterKeyCard.append(enterKeyCardIcon);
      enterKeyCard.innerHTML += `<h4>Послушать слово</h4>`;
      const arrowKeyCard = createElementWithClassnames('div', `key-arrow-wrapper`, `key-wrapper`);
      const arrowKeyCardIcon = createElementWithClassnames('p', 'key-img', 'key-arrow');
      arrowKeyCardIcon.innerHTML = '&#8594;'
      arrowKeyCard.append(arrowKeyCardIcon);
      arrowKeyCard.innerHTML += `<h4>Следующее слово</h4>`;
      gameContorls.append(escKeyCard, enterKeyCard, arrowKeyCard, keyNumberWrapper);
    }
    if(this.options.game === 'sprint') {     
      const escKeyCard = createElementWithClassnames('div', `key-esc-wrapper`, `key-wrapper`);
      const escKeyCardIcon = createElementWithClassnames('P', 'key-img', 'key-esc');
      escKeyCardIcon.innerHTML= `Esc`;
      escKeyCard.append(escKeyCardIcon);      
      escKeyCard.innerHTML += `<h4>Выйти из игры</h4>`;
      const keyNumberWrapper = createElementWithClassnames('div', 'key-wrapper-sprint');
      keyNumberWrapper.innerHTML += `<h4>Выбор варианта ответа:</h4>`;
      const arrowRightCard = createElementWithClassnames('div', `sprint-key-arrow-wrapper`);
      const arrowRightCardIcon = createElementWithClassnames('p', 'key-img', 'key-arrow');
      arrowRightCard.innerHTML += `<h4>Правильный ответ</h4>`;
      arrowRightCardIcon.innerHTML = '&#8594;'
      arrowRightCard.append(arrowRightCardIcon);
      const arrowLeftCard = createElementWithClassnames('div', `sprint-key-arrow-wrapper`);
      const arrowLeftCardIcon = createElementWithClassnames('p', 'key-img', 'key-arrow');
      arrowLeftCard.innerHTML += `<h4>Неверный ответ</h4>`;
      arrowLeftCardIcon.innerHTML = '&#8592;'
      arrowLeftCard.append(arrowLeftCardIcon);
      keyNumberWrapper.append(arrowRightCard, arrowLeftCard);   
      gameContorls.append(escKeyCard, keyNumberWrapper);
    }
    const gameName = createElementWithContent('h3', this.options.name);
    const callImg = createElementWithAttributes("img", imgAttributes);
    const callText = createElementWithContent('h5', this.options.text);
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
    startGameContainer.append(gameName, callImg, callText, gameLevel, gameContorls, startButton);
    return startGameContainer;
  }
}