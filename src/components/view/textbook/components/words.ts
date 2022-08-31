import {WordItem} from "./word";
import {IAggreagtedWord} from "../../../../typings";
import {createElementWithClassnames} from "../../utils";
import {appState} from "../../../controller/state";
import {isHTMLElement} from "../../../../typings/utils/utils";
import {getColor} from "../../../controller/ui";

export class WordsItem {
    public wordsData: IAggreagtedWord[];

    constructor(wordsData: IAggreagtedWord[]) {
        this.wordsData = wordsData;
    }

    create() {
        const wordsContainer = createElementWithClassnames(
            "div",
            "words-page",
            `words-page-${appState.viewsStates.textbook.page}`
        );

        if (this.wordsData.length) {
            this.wordsData.forEach((data, i) => {
                const wordsItem = new WordItem(data).create();
                if (i === 0) {
                    const input = wordsItem.querySelector(
                        "input"
                    ) as HTMLInputElement;
                    input.checked = true;
                    const label = wordsItem.querySelector(
                        "label"
                    ) as HTMLElement;
                    label.setAttribute("style", `color: ${getColor()}`);
                }
                wordsContainer.append(wordsItem);
            });
        } else {
            const message = createElementWithClassnames("h3", "message");
            message.textContent = "В этом разделе ещё нет слов";
            wordsContainer.append(message);
        }
        wordsContainer.addEventListener("change", (e) => {
            const labels = wordsContainer.querySelectorAll(".words-item");
            labels.forEach((label) => {
                label.removeAttribute("style");
            });
            const input = e.target as HTMLInputElement;
            if (input.labels?.length)
                (input.labels[0] as HTMLElement).setAttribute(
                    "style",
                    `color: ${getColor()}`
                );
        });
        return wordsContainer;
    }

    static drawNewWordsItem(wordsData: IAggreagtedWord[]) {
        const wordsContainer = document.querySelector(".words-page");
        if (!isHTMLElement(wordsContainer)) return;
        const newWordsContainer = new WordsItem(wordsData).create();
        wordsContainer.replaceChildren();
        wordsContainer.append(...newWordsContainer.children);
    }
}
