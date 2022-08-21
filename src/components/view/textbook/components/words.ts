import {WordItem} from "./word";
import {IWord} from "../../../../typings";
import {createElementWithClassnames} from "../../utils";
import {appState} from "../../../controller/state";

export class WordsItem {
    public wordsData: IWord[];

    constructor(wordsData: IWord[]) {
        this.wordsData = wordsData;
    }

    create() {
        const wordsContainer = createElementWithClassnames(
            "div",
            `words-page-${appState.page}`
        );
        this.wordsData.forEach((data) => {
            const wordsItem = new WordItem(data).create();
            wordsContainer.append(wordsItem);
        });
        return wordsContainer;
    }
}
