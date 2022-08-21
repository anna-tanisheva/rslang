import {IWord} from "../../../../typings";
import {createElementWithClassnames} from "../../utils";

export class WordDetails {
    public template: HTMLElement;

    constructor(wordData: IWord) {
        this.template = this.setCard(wordData);
    }

    setCard(data: IWord): HTMLElement {
        const card = createElementWithClassnames("div", "card");
        const image = createElementWithClassnames("div", "card-image");
        image.setAttribute("style", `background-image: url(${data.image})`);
        const cardContent = createElementWithClassnames("div", "card-content");
        const heading = createElementWithClassnames("div", "card-heading");
        const word = createElementWithClassnames("h3", "card-word");
        const translate = createElementWithClassnames("h4", "card-translate");
        const transcription = createElementWithClassnames(
            "span",
            "card-transcription"
        );
        const audioPlayButton = createElementWithClassnames(
            "button",
            "card-buttot-audio"
        );
        heading.append(word, translate, transcription, audioPlayButton);
        cardContent.append(heading);
        card.append(image);
        return card;
    }
}
