import {IWord} from "../../../../typings";
import {createElementWithClassnames} from "../../utils";

export class WordItem {
    public data: IWord;

    constructor(data: IWord) {
        this.data = data;
    }

    create() {
        const item = createElementWithClassnames("div", "words-item");
        const word = createElementWithClassnames("div", "item-word");
        word.textContent = this.data.word;
        item.append(word);
        // #toDo Заменить условие. Нужно показывать перевод если выбрана данная настройка
        // eslint-disable-next-line no-constant-condition
        if (true) {
            const translate = createElementWithClassnames(
                "div",
                "item-translate"
            );
            translate.textContent = this.data.wordTranslate;
            item.append(translate);
        }
        return item;
    }
}
