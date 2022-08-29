import {IAggreagtedWord} from "../../../../typings";
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
        const item = createElementWithClassnames("div", "words-item-wrapper");
        const word = createElementWithClassnames("span", "item-word");
        const inputAttributes = {
            type: "radio",
            name: "words-item-radio",
            id: `word-${this.data.id}`,
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
        // #toDo Заменить условие. Нужно показывать перевод если выбрана данная настройка
        // eslint-disable-next-line no-constant-condition
        if (true) {
            const translate = createElementWithClassnames(
                "span",
                "item-translate"
            );
            translate.textContent = this.data.wordTranslate;
            inputLabel.append(translate);
        }
        (inputRadio as HTMLInputElement).addEventListener("input", () => {
            WordDetails.setCard(this.data);
        });
        item.append(inputRadio, inputLabel);
        return item;
    }
}
