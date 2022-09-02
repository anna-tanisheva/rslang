import { createElementWithAttributes,
    createElementWithClassnames} from "../../utils";
import "./sprint.scss";
import { IWordsForSplit } from "../../../../typings";
import { choseSplitAnswerHandler, pressKey } from "../../../controller/ui";
import { restartGameHandler } from "./restart-game";

export class SprintView {

    word: IWordsForSplit;

    score: number;

    seconds: number;

    constructor(word: IWordsForSplit, score: number) {
        this.word = word;
        this.score = score;
        this.seconds = 60;
    }

    create() {
        const game = createElementWithClassnames("div", "sprint-game");
        const sprintContainer = createElementWithClassnames("section", "sprint-section");
        const gameContainer = createElementWithClassnames("div","spint-container");
        const score = createElementWithClassnames("div", "sprint-scores" );
        score.textContent = `${this.score}`;
        const timer = createElementWithClassnames("div", "sprint-timer" );
        const countersContainer = createElementWithClassnames("div",  "sprint-counters");
        countersContainer.append(score, timer);
        const playingField = createElementWithClassnames( "div", "sprint-playing-field", );
        const stampsContainer = createElementWithClassnames( "div", "sprint-stamps-container",);
        const englishWord = createElementWithClassnames("p",  "sprint-enlish-word" );
        englishWord.textContent = `${this.word.word}`;
        const translate = createElementWithClassnames("p","sprint-translate");
        translate.textContent = `${this.word.randomTranslate}`;
        const playBtnsContainer = createElementWithClassnames("div","sprint-buttons");
        playBtnsContainer.addEventListener(("click"), (e) => {choseSplitAnswerHandler(e)});
        const yesButtonAttributes = {type: "button",class: "sprint-button yes-button",};
        const yesButton = createElementWithAttributes("button",yesButtonAttributes);
        yesButton.textContent = "Правильно";
        const noButtonAttributes = {type: "button",class: "sprint-button no-button",};
        const noButton = createElementWithAttributes("button",noButtonAttributes);
        noButton.textContent = "Неверно"
        playBtnsContainer.append(yesButton, noButton);
        const playKeysContainer = createElementWithClassnames("div","sprint-buttons");
        const yesKeyAttributes = {type: "button",class: "sprint-button right-key",};
        const yesKey = createElementWithAttributes("button",yesKeyAttributes);
        yesKey.setAttribute("data-set", "arrayRight");
        yesKey.textContent = "<";
        const noKeyAttributes = {type: "button",class: "sprint-button wrong-key",};
        const noKey = createElementWithAttributes("button",noKeyAttributes);
        noKey.textContent = ">";
        playKeysContainer.append(yesKey, noKey);
        playingField.append(stampsContainer, englishWord, translate, playBtnsContainer, );
        const answer = createElementWithClassnames("div", "sprint-answer");
        gameContainer.append(countersContainer, playingField, playKeysContainer, answer);
        const resultContainer = createElementWithClassnames("div", "sprint-results");
        const resultWrapper = createElementWithClassnames("div", "sprint-results-wrapper");
        const resultDescription = createElementWithClassnames("div", "sprint-results-discription");
        const resultTitle = createElementWithClassnames("h2", "sprint-final-score");
        const recordTitle = createElementWithClassnames("h3", "sprint-record-score");
        const rightAnswers = createElementWithClassnames("h3", "results-right-answer");
        const wrongAnswers = createElementWithClassnames("h3", "results-wrong-answer");
        wrongAnswers.textContent ="Неверные ответы: ";
        const restartButtonAttributes = {type: "button", class: "sprint-button sprint-restart-button",};
        const restartButton = createElementWithAttributes("button", restartButtonAttributes);
        restartButton.textContent = "Играть"
        const statsButtonAttributes = {type: "button", class: "sprint-button sprint-stats-button" };
        const statsButton = createElementWithAttributes( "button", statsButtonAttributes );
        statsButton.textContent = "Статистика";
        const resultBtnsContainer = createElementWithClassnames( "div", "sprint-buttons");
        resultBtnsContainer.append(restartButton, statsButton);
        resultDescription.append(resultTitle, recordTitle, rightAnswers, wrongAnswers, resultBtnsContainer);
        resultWrapper.append(resultDescription);
        resultContainer.append(resultWrapper);
        sprintContainer.append(gameContainer, resultContainer);
        game.append(sprintContainer);

        resultBtnsContainer.addEventListener(("click"), (e) => {restartGameHandler(e)});

        document.addEventListener("keydown", pressKey, false);
            const timerId = setInterval(() => {
            timer.textContent = `${this.seconds}`
          if (this.seconds === 0) {
            clearInterval(timerId);
          }
          this.seconds -= 1;
        }, 1000);
        return game;

    }
}



