import { ResultWord } from "./result-view";
import { isHTMLElement } from "../../../../typings/utils/utils";
import "./sprint.scss";
import { IWordsForSplit, IResWordsPage, IAggreagtedWord } from '../../../../typings';
import { fetchWords } from "../../../controller/api";
import { getRandomNumber, modifyWord } from '../../../controller/ui';
import { SprintView } from "./sprint-view";
import "../../../../assets/sounds/wrong.mp3";
import "../../../../assets/sounds/correct.mp3";
import { TEXTBOOK_PAGE_COUNT } from "../../../controller/state";
import { createElementWithAttributes } from "../../utils";
import "../../../../assets/images/stamp1.png";
import "../../../../assets/images/stamp3.png";
import "../../../../assets/images/stamp4.jpg";




export class Sprint {

    section: number;

    page: number;

    correctAnswer: IWordsForSplit[];

    wrongtAnswer: IWordsForSplit[];

    words: IWordsForSplit[];

    inputWords: IAggreagtedWord[];

    arrOfWords: IResWordsPage | undefined;

    state: {
      correctGuesses: number,
      currentStrick: number,
      maxStrick: number,
      score: number,
      answers: {
        true: string[],
        false: string[]
      }
    };

    gameName: string

    constructor(sec: number, page: number, gameName: string, arrOfWords?: IResWordsPage) {
      this.gameName = gameName;
      this.section = sec;
      this.page = page;
      this.state = {
        correctGuesses: 0,
        currentStrick: 0,
        maxStrick: 0,
        score: 0,
        answers: {
            true: [],
            false: []
        },
      }
      this.correctAnswer = [];
      this.wrongtAnswer = [];
      this.words = [];
      this.inputWords = [];
      this.arrOfWords = arrOfWords;
    }



    getWordsForCards() {
        const conversionArray = [...this.inputWords];
        const wordsForGame: IWordsForSplit [] = [];

        for (let i = 0; i <= (this.inputWords.length - 1); i += 1) {
           const wordIndex = getRandomNumber(conversionArray.length - 1);
            const originalWord = conversionArray[wordIndex];
            conversionArray.splice(wordIndex, 1);
            const outcome = getRandomNumber(2);
            if(conversionArray.length === 0 || outcome === 1) {
                wordsForGame.push({
                    id: originalWord.id,
                    word: originalWord.word,
                    originalTranslate: originalWord.wordTranslate,
                    audio:originalWord.audio,
                    randomTranslate: originalWord.wordTranslate,
                    outcome: true
                })
            } else {
                const secondWordIndex = getRandomNumber(conversionArray.length - 1);
                const secondWord = conversionArray[secondWordIndex];
                wordsForGame.push({
                    id: originalWord.id,
                    word: originalWord.word,
                    originalTranslate: originalWord.wordTranslate,
                    audio:originalWord.audio,
                    randomTranslate: secondWord.wordTranslate,
                    outcome: false
                })
            }
        }
      return wordsForGame;
    }


    addToState(guess: boolean,){
        console.log(guess)
        if (guess === true) {
            this.state.currentStrick += 1;
            if (this.state.currentStrick >  this.state.maxStrick) {
                this.state.maxStrick = this.state.currentStrick;
            }
            this.correctAnswer.push(this.words[0]);
        } else {
            this.state.currentStrick = 0;
            this.wrongtAnswer.push(this.words[0]);
            this.hideStamps();
        }
    }

    addScore() {
        if (this.state.currentStrick === 1) {
            this.state.score += 20;
            this.showScore(20);
            this.drawStamp1();
        }
        if (this.state.currentStrick < 1 && this.state.currentStrick <= 3) {
            this.state.score += 20;
            this.showScore(20);
        }
        if (this.state.currentStrick === 4) {
            this.state.score += 40;
            this.showScore(40);
            this.drawStamp2();
        }
        if (this.state.currentStrick > 4 && this.state.currentStrick <= 6) {
            this.state.score += 40;
            this.showScore(40);
        }
        if (this.state.currentStrick === 6) {
            this.state.score += 60;
            this.showScore(60);
            this.drawStamp3();
        }
        if (this.state.currentStrick  > 7) {
            this.state.score += 60;
            this.showScore(60);
        }
    }


    getInputWords = async () => {
        const words = await fetchWords({
            group: this.section,
            page: getRandomNumber(TEXTBOOK_PAGE_COUNT),
            wordsPerPage: 20
        });
        this.inputWords = words.words;
        const wordsForCards = [...this.getWordsForCards()];
        this.words = wordsForCards;
    }

    async getNextWords() {
        if (this.words.length === 1) {
            this.inputWords.forEach(word => {
                modifyWord(this, (word as IAggreagtedWord), 'sprint')
            })
            await this.getInputWords();
        }
    }

    async onRightButton() {
        const wrongSound = document.querySelector(".wrong-sound");
        if (!isHTMLElement(wrongSound)) return;
        const correctSound = document.querySelector(".correct-sound");
        if (!isHTMLElement(wrongSound)) return;

        if(this.words[0].outcome === true) {
            this.addScore();
            this.addToState(true);
            (correctSound as HTMLAudioElement).play();
            this.state.answers.true.push(this.words[0].id);

        } else {
            this.addToState(false);
            this.showWrongAnswer();
            (wrongSound as HTMLAudioElement).play();
            this.state.answers.false.push(this.words[0].id);
        }

        await this.getNextWords();
        this.words.splice(0, 1);
        this.drawCards();
        this.updateScore();
    }

    async onWrongButton() {
        const wrongSound = document.querySelector(".wrong-sound");
        if (!isHTMLElement(wrongSound)) return;
        const correctSound = document.querySelector(".correct-sound");
        if (!isHTMLElement(wrongSound)) return;

        if(this.words[0].outcome  === false) {
            this.state.answers.true.push(this.words[0].id);
            this.addScore();
            this.addToState(true);
            (correctSound as HTMLAudioElement).play();
        } else {
            this.state.answers.false.push(this.words[0].id);
            this.addToState(false);
            (wrongSound as HTMLAudioElement).play();
            this.showWrongAnswer();
        }

        await this.getNextWords();
        this.words.splice(0, 1);
        this.drawCards();
        this.updateScore();
    }

    endGame() {
        const resultWindow = document.querySelector(".sprint-results");
        const gameField = document.querySelector(".spint-container");
        (resultWindow as HTMLInputElement).style.display = "block";
        (gameField as HTMLInputElement).style.display = "none";
        this.drawFinalResults(500);
        if (this.wrongtAnswer.length > 0) {
            this.drawAllWrongAnswers();
        }
        if (this.correctAnswer.length > 0) {
            this.drawAllRightAnswers();
        }
    }


    async create(): Promise<HTMLElement> {
        if(this.arrOfWords === undefined) {
            await this.getInputWords();

        } else {
            const words = this.arrOfWords;
            this.inputWords = words.words;
            const wordsForCards = [...this.getWordsForCards()];
            this.words = wordsForCards;
        }

        const sprintContainer = new SprintView(this.words[0], this.state.score).create();
        return sprintContainer;
    }

    hideAnswer() {
        const correctAnswer = document.querySelector(".sprint-answer");
        if (!isHTMLElement(correctAnswer)) return;
        correctAnswer.style.display = "none";
    }

    showWrongAnswer() {
        const answer = document.querySelector('.sprint-answer');
        if (!isHTMLElement(answer)) return;
        answer.style.display = "block";
        answer.textContent = "Ошибка!";
        setTimeout(this.hideAnswer, 400);
    }

    showScore(score: number) {
      const answer = document.querySelector('.sprint-answer');
      if (!isHTMLElement(answer)) return;
      answer.style.display = "block";
      answer.textContent = `Верно! + ${score} баллов`;
      setTimeout(this.hideAnswer, 400);
    }


    drawCards(){
        const englishWord = document.querySelector(".sprint-enlish-word");
        if (!isHTMLElement(englishWord)) return;
        englishWord.textContent = `${this.words[0].word}`;
        const translate = document.querySelector(".sprint-translate");
        if (!isHTMLElement(translate)) return;
        translate.textContent = `${this.words[0].randomTranslate}`;
    }

    drawAllRightAnswers() {
        const rightAnswersContainer = document.querySelector('.results-right-answer');

        this.correctAnswer.forEach((word: IWordsForSplit) => {
            const resRightAnswerView = new ResultWord(word);
            if (!isHTMLElement(rightAnswersContainer)) return;
            rightAnswersContainer.append(resRightAnswerView.create());
        });
    }

    drawAllWrongAnswers() {
        const wrongAnswersContainer = document.querySelector('.results-wrong-answer');

        this.wrongtAnswer.forEach((word: IWordsForSplit) => {
            const resWrongAnswerView = new ResultWord(word);
            if (!isHTMLElement(wrongAnswersContainer)) return;
            wrongAnswersContainer.append(resWrongAnswerView.create());
        });
    }

    updateScore(){
        const newScore = document.querySelector(".sprint-scores");
        if (!isHTMLElement(newScore)) return;
        newScore.textContent = `${this.state.score}`
    }

    drawFinalResults(record: number) {
        const finalScore = document.querySelector(".sprint-final-score")
        if (!isHTMLElement(finalScore)) return;
        finalScore.textContent = `Результат: ${this.state.score} баллов`
        const recordScore = document.querySelector(".sprint-record-score")
        if (!isHTMLElement(recordScore)) return;
        recordScore.textContent = `Рекорд: ${record} баллов`                           // ToDo Сохранить и вывести рекорд
        const amountOfCorrectAnswers = document.querySelector(".results-right-answer");
        if (!isHTMLElement(amountOfCorrectAnswers)) return;
        amountOfCorrectAnswers.textContent = `Правильные ответы: ${this.state.answers.true.length}`;
        const amountOfWrongAnswers = document.querySelector(".results-wrong-answer");
        if (!isHTMLElement(amountOfWrongAnswers)) return;
        amountOfWrongAnswers.textContent = `Неверные ответы: ${this.state.answers.false.length}`;
    }

    drawStamp1() {
        const stampContsiner = document.querySelector(".sprint-stamps-container");
        if (!isHTMLElement(stampContsiner)) return;
        const stampAttributes1 = {src: "./images/stamp1.png", width: "48", height: "48", class: "item-1 stamps",};
        const stamp1 = createElementWithAttributes( "img",  stampAttributes1,);
        stampContsiner.append(stamp1);
    }

    drawStamp2() {
        const stampContsiner = document.querySelector(".sprint-stamps-container");
        if (!isHTMLElement(stampContsiner)) return;
        const stampAttributes2 = {src: "./images/stamp3.png", width: "40", height: "60", class: "item-2 stamps",};
        const stamp2 = createElementWithAttributes("img",  stampAttributes2,);
        stampContsiner.append(stamp2);
    }

    drawStamp3() {
        const stampContsiner = document.querySelector(".sprint-stamps-container");
        if (!isHTMLElement(stampContsiner)) return;
        const stampAttributes3 = {src: "./images/stamp4.jpg", width: "42", height: "31", class: "item-3 stamps",};
        const stamp3 = createElementWithAttributes("img",  stampAttributes3,);
        stampContsiner.append(stamp3);
    }


    hideStamps() {
        const stampContsiner = document.querySelector(".sprint-stamps-container");
        if (!isHTMLElement(stampContsiner)) return;
        stampContsiner.replaceChildren();
    }

}