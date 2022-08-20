import {IWord} from "../../../typings";
import {createElementWithClassnames} from "../utils";

export class WordItem {
    public template: HTMLElement;

    constructor(wordData: IWord) {
        this.template = this.setItem(wordData);
    }

    setItem(data: IWord): HTMLElement {
        const item = createElementWithClassnames("div", "words-item");
        const word = createElementWithClassnames("div", "item-word");
        word.textContent = data.word;
        item.append(word);
        // #toDo Заменить условие. Нужно показывать перевод если выбрана данная настройка
        // eslint-disable-next-line no-constant-condition
        if (true) {
            const translate = createElementWithClassnames(
                "div",
                "item-translate"
            );
            translate.textContent = data.wordTranslate;
            item.append(translate);
        }
        return item;
    }
}
