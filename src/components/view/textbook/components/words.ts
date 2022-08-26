import {WordItem} from "./word";
import {IWord} from "../../../../typings";
import {createElementWithClassnames} from "../../utils";
import {appState} from "../../../controller/state";
import {isHTMLElement} from "../../../../typings/utils/utils";

export class WordsItem {
    public wordsData: IWord[];

    constructor(wordsData: IWord[]) {
        this.wordsData = wordsData;
    }

    create() {
        const wordsContainer = createElementWithClassnames(
            "div",
            "words-page",
            `words-page-${appState.viewsStates.textbook.page}`
        );
        this.wordsData.forEach((data) => {
            const wordsItem = new WordItem(data).create();
            wordsContainer.append(wordsItem);
        });
        return wordsContainer;
    }

    static drawNewWordsItem(wordsData: IWord[]) {
        const wordsContainer = document.querySelector(".words-page");
        if (!isHTMLElement(wordsContainer)) return;
        const newWordsContainer = new WordsItem(wordsData).create();
        wordsContainer.replaceChildren();
        wordsContainer.append(...newWordsContainer.children);
    }
}
