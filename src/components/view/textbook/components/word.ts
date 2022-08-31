import {IAggreagtedWord} from "../../../../typings";
import {isHTMLElement} from "../../../../typings/utils/utils";
import {getColor} from "../../../controller/ui";
import {
    createElementWithAttributes,
    createElementWithClassnames,
} from "../../utils";
import {WordDetails} from "./word-detail";

export class WordItem {
    public data: IAggreagtedWord;

    constructor(data: IAggreagtedWord) {
        this.data = data;
    }

    create() {
        const wordId = this.data.id;
        const item = createElementWithClassnames(
            "div",
            "words-item-wrapper",
            `words-item-wrapper-${wordId}`
        );
        const word = createElementWithClassnames("span", "item-word");
        // eslint-disable-next-line no-underscore-dangle
        const inputAttributes = {
            type: "radio",
            name: "words-item-radio",
            id: `word-${wordId}`,
        };
        const inputRadio = createElementWithAttributes(
            "input",
            inputAttributes
        );
        const labelAttributes = {
            type: "label",
            for: inputAttributes.id,
            class: "words-item",
        };
        const inputLabel = createElementWithAttributes(
            "label",
            labelAttributes
        );
        word.textContent = this.data.word;
        inputLabel.append(word);

        const translate = createElementWithClassnames("span", "item-translate");
        translate.textContent = this.data.wordTranslate;
        inputLabel.append(translate);
        if (this.data.userWord) {
            if (this.data.userWord.difficulty !== "norm") {
                const status = createElementWithClassnames(
                    "span",
                    "item-status"
                );
                if (this.data.userWord.difficulty === "hard") {
                    status.textContent = "!";
                } else {
                    status.textContent = "✓";
                }
                inputLabel.append(status);
            }
        }

        (inputRadio as HTMLInputElement).addEventListener("input", () => {
            WordDetails.setCard(this.data);
        });
        item.append(inputRadio, inputLabel);

        return item;
    }

    static setCard(data: IAggreagtedWord): void {
        const wordId = data.id;
        const item = document.querySelector(`.words-item-wrapper-${wordId}`);
        if (!isHTMLElement(item)) return;
        const newItem = new WordItem(data).create();
        (newItem.querySelector(
            `input[type="radio"]`
        ) as HTMLInputElement).checked = true;
        (newItem.querySelector(`label`) as HTMLElement).setAttribute(
            "style",
            `color: ${getColor()}`
        );
        item.replaceChildren();
        item.append(...newItem.children);
    }
}
