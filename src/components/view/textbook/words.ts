import {WordItem} from "./word";
import {IWord} from "../../../typings";
import {createElementWithClassnames} from "../utils";

interface WordsItemProps {
    currentPage: number;
    wordsData: IWord[];
}

export class WordsItem {
    public template: HTMLElement;

    constructor({wordsData, currentPage}: WordsItemProps) {
        this.template = this.setItem({wordsData, currentPage});
    }

    setItem({wordsData, currentPage}: WordsItemProps): HTMLElement {
        const wordsContainer = createElementWithClassnames(
            "div",
            `words-page-${currentPage}`
        );
        if (DataTransfer.length)
            wordsData.forEach((data) => {
                const wordsItem = new WordItem(data);
                wordsContainer.append(wordsItem.template);
            });
        return wordsContainer;
    }
}
