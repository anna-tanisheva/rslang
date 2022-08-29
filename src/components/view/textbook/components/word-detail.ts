import {IAggreagtedWord} from "../../../../typings";
import {isHTMLElement} from "../../../../typings/utils/utils";
import {audio, ENDPOINT} from "../../../controller/state";
import {createElementWithClassnames} from "../../utils";

export class WordDetails {
    ctreate(data: IAggreagtedWord): HTMLElement {
        const card = createElementWithClassnames("div", "card");
        const image = createElementWithClassnames("div", "card-image");
        image.setAttribute(
            "style",
            `background-image: url("${`${ENDPOINT}/${data.image}`}")`
        );
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
        word.textContent = data.word;
        translate.textContent = data.wordTranslate;
        transcription.textContent = data.transcription;
        (audioPlayButton as HTMLButtonElement).addEventListener("click", () => {
            audio.pause();
            audio.src = `${ENDPOINT}/${data.audio}`;
            audio.load();
            let index = 1;
            function playNextFile() {
                if (index < 3) {
                    try {
                        audio.src =
                            index === 1
                                ? `${ENDPOINT}/${data.audioMeaning}`
                                : `${ENDPOINT}/${data.audioExample}`;
                        audio.load();
                        audio.play();
                        index += 1;
                    } catch (err) {
                        console.log((err as Error).message);
                    }
                } else {
                    audio.removeEventListener("ended", playNextFile, false);
                }
            }
            audio.removeEventListener("ended", playNextFile, false);
            audio.addEventListener("ended", playNextFile);
            audio.play();
        });

        const textMeaningHeading = createElementWithClassnames(
            "h3",
            "card-word"
        );
        const textMeaning = createElementWithClassnames("h4", "card-translate");
        const textMeaningTranslate = createElementWithClassnames(
            "h4",
            "card-translate"
        );
        const textExampleHeading = createElementWithClassnames(
            "h3",
            "card-word"
        );
        const textExample = createElementWithClassnames("h4", "card-translate");
        const textExampleTranslate = createElementWithClassnames(
            "h4",
            "card-translate"
        );
        textMeaningHeading.textContent = "Значение:";
        textMeaning.innerHTML = data.textMeaning;
        textMeaningTranslate.textContent = data.textMeaningTranslate;
        textExampleHeading.textContent = "Пример:";
        textExample.innerHTML = data.textExample;
        textExampleTranslate.textContent = data.textExampleTranslate;
        heading.append(
            word,
            translate,
            transcription,
            audioPlayButton,
            textMeaningHeading,
            textMeaning,
            textMeaningTranslate,
            textExampleHeading,
            textExample,
            textExampleTranslate
        );
        cardContent.append(heading);
        card.append(image, cardContent);
        return card;
    }

    static setCard(data: IAggreagtedWord): void {
        audio.pause();
        const cardDatail = document.querySelector(".card");
        if (!isHTMLElement(cardDatail)) return;
        const newCardDatail = new WordDetails().ctreate(data);
        cardDatail.replaceChildren();
        cardDatail.append(...newCardDatail.children);
    }
}
