import {IAggreagtedWord} from "../../../../typings";
import {isHTMLElement} from "../../../../typings/utils/utils";
import {setUserWord} from "../../../controller/api";
import {appState, audio, ENDPOINT} from "../../../controller/state";
import {getColor} from "../../../controller/ui";
import {
    createElementWithAttributes,
    createElementWithClassnames,
} from "../../utils";

export class WordDetails {
    ctreate(data: IAggreagtedWord): HTMLElement {
        const cardWrapper = createElementWithClassnames("div", "card-wrapper");
        const card = createElementWithClassnames("div", "card");

        // Изображение слова
        const image = createElementWithClassnames("div", "card-image");
        image.setAttribute(
            "style",
            `background-image: url("${`${ENDPOINT}/${data.image}`}")`
        );
        card.append(image);

        // Кнопки изменения категории слова
        if (appState.isSignedIn) {
            const cardControlsWrapper = createElementWithClassnames(
                "div",
                "card-controls-wrapper"
            );

            // Кнопка "СЛОЖНОЕ"
            const cardControlOne = createElementWithClassnames(
                "div",
                "card-control"
            );
            const wordID = data.id;
            const difficultyValueOne =
                (appState.viewsStates.textbook.dictionaryMode === "norm" &&
                    appState.viewsStates.textbook.mode === "dictionary") ||
                (appState.viewsStates.textbook.dictionaryMode === "easy" &&
                    appState.viewsStates.textbook.mode === "dictionary") ||
                (appState.viewsStates.textbook.mode === "textbook" &&
                    data.userWord?.difficulty !== "hard")
                    ? "hard"
                    : "norm";
            const inputRadioAttributes = {
                type: "radio",
                name: "difficulty-radio",
                id: `difficulty-radio-${wordID}`,
                value: `${difficultyValueOne}`,
            };
            const inputRadio = createElementWithAttributes(
                "input",
                inputRadioAttributes
            );
            const labelAttributes = {
                type: "label",
                for: inputRadioAttributes.id,
                class: "difficulty-label",
            };
            const inputLabel = createElementWithAttributes(
                "label",
                labelAttributes
            );
            inputLabel.textContent = "СЛОЖНОЕ";

            // Кнопка "ИЗУЧЕНО"
            const cardControlTwo = createElementWithClassnames(
                "div",
                "card-control"
            );
            const difficultyValue =
                data.userWord?.difficulty !== "easy" ? "easy" : "hard";
            const inputCheckAttributes = {
                type: "checkbox",
                name: "difficulty-radio",
                id: `difficulty-check-${wordID}`,
                value: `${difficultyValue}`,
            };
            const inputCheck = createElementWithAttributes(
                "input",
                inputCheckAttributes
            );
            const labelCheckAttributes = {
                type: "label",
                for: inputCheckAttributes.id,
                class: "difficulty-label",
            };
            const inputCheckLabel = createElementWithAttributes(
                "label",
                labelCheckAttributes
            );
            inputCheckLabel.textContent = "ИЗУЧЕНО";

            if (data.userWord?.difficulty === "easy") {
                (inputCheck as HTMLInputElement).checked = true;
            } else if (data.userWord?.difficulty === "hard") {
                (inputRadio as HTMLInputElement).checked = true;
            }
            if (appState.viewsStates.textbook.mode !== "textbook") {
                (inputRadio as HTMLInputElement).type = "checkbox";
            }

            (inputRadio as HTMLInputElement).addEventListener("input", (e) => {
                const hardInput = e.target as HTMLInputElement;
                const easyInput = inputCheck as HTMLInputElement;
                easyInput.checked = false;
                hardInput.disabled = !easyInput.checked && !hardInput.checked;
                setUserWord({word: data, difficulty: hardInput.value});
            });
            (inputCheck as HTMLInputElement).addEventListener("input", (e) => {
                const easyInput = e.target as HTMLInputElement;
                const hardInput = inputRadio as HTMLInputElement;
                hardInput.checked = !easyInput.checked;
                hardInput.disabled = !easyInput.checked && !hardInput.checked;
                setUserWord({word: data, difficulty: easyInput.value});
            });

            if ((inputCheck as HTMLInputElement).checked)
                inputCheckLabel.setAttribute("style", `color: ${getColor()}`);
            if ((inputRadio as HTMLInputElement).checked)
                inputLabel.setAttribute("style", `color: ${getColor()}`);
            cardControlOne.append(inputRadio, inputLabel);
            cardControlTwo.append(inputCheck, inputCheckLabel);

            cardControlsWrapper.append(cardControlOne, cardControlTwo);
            card.append(cardControlsWrapper);
        }

        // Контент слова
        const cardContent = createElementWithClassnames("div", "card-content");
        const heading = createElementWithClassnames("div", "card-heading");
        const word = createElementWithClassnames("h3", "card-word");
        const translate = createElementWithClassnames("h4", "card-translate");
        const transcription = createElementWithClassnames(
            "span",
            "card-transcription"
        );
        const audioPlayButton = createElementWithAttributes("button", {
            class: "card-buttot-audio",
            style: `color: ${getColor()}`,
        });
        word.textContent = data.word;
        translate.textContent = data.wordTranslate;
        transcription.textContent = data.transcription;
        (audioPlayButton as HTMLButtonElement).addEventListener(
            "click",
            (e) => {
                (e.target as HTMLButtonElement).classList.add("active");
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
                        (e.target as HTMLButtonElement).classList.remove(
                            "active"
                        );
                    }
                }
                audio.removeEventListener("ended", playNextFile, false);
                audio.addEventListener("ended", playNextFile);
                audio.play();
            }
        );

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
        card.append(cardContent);

        // Статистика
        if (appState.isSignedIn) {
            const statisticHeading = createElementWithClassnames(
                "h3",
                "card-word"
            );
            statisticHeading.textContent = "Ответы в играх:";

            const statistic = createElementWithClassnames(
                "div",
                "games-statictic-wrapper"
            );
            const statisticAudiocall = createElementWithClassnames(
                "div",
                "audiocall-wrapper"
            );
            const statisticSprint = createElementWithClassnames(
                "div",
                "sprint-wrapper"
            );
            const audiocallHeading = createElementWithClassnames(
                "p",
                "card-transcription"
            );
            const sprintHeading = createElementWithClassnames(
                "p",
                "card-transcription"
            );
            audiocallHeading.textContent = "Спринт";
            sprintHeading.textContent = "Аудиовызов";
            const audiocallValue = createElementWithClassnames(
                "h5",
                "card-translate"
            );
            const sprintValue = createElementWithClassnames(
                "h5",
                "card-translate"
            );
            audiocallValue.textContent = `${
                !data.userWord
                    ? 0
                    : data.userWord.optional.audiocall.rightAnswer
            } из ${
                !data.userWord ? 0 : data.userWord.optional.audiocall.countGames
            } (${
                !data.userWord || !data.userWord.optional.audiocall.countGames
                    ? 0
                    : Math.round(
                          (data.userWord.optional.audiocall.rightAnswer /
                              data.userWord.optional.audiocall.countGames) *
                              100
                      )
            }%)`;
            sprintValue.textContent = `${
                !data.userWord ? 0 : data.userWord.optional.sprint.rightAnswer
            } из ${
                !data.userWord ? 0 : data.userWord.optional.sprint.countGames
            } (${
                !data.userWord || !data.userWord.optional.sprint.countGames
                    ? 0
                    : Math.round(
                          (data.userWord.optional.sprint.rightAnswer /
                              data.userWord.optional.sprint.countGames) *
                              100
                      )
            }%)`;
            statisticAudiocall.append(audiocallHeading, audiocallValue);
            statisticSprint.append(sprintHeading, sprintValue);
            statistic.append(
                statisticHeading,
                statisticAudiocall,
                statisticSprint
            );
            card.append(statistic);
        }

        cardWrapper.append(card);
        return cardWrapper;
    }

    static setCard(data: IAggreagtedWord): void {
        audio.pause();
        const cardDatail = document.querySelector(".card-wrapper");
        if (!isHTMLElement(cardDatail)) return;
        const newCardDatail = new WordDetails().ctreate(data);
        cardDatail.replaceChildren();
        cardDatail.append(...newCardDatail.children);
    }
}
