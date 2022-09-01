import "./style.scss";
import {
    GroupPagination,
    PagePagination,
    WordDetails,
    WordsItem,
} from "./components";
import {
    createElementWithAttributes,
    createElementWithClassnames,
    createElementWithContent,
} from "../utils";
import {appState, textbookState} from "../../controller/state";
import {IAggreagtedWord} from "../../../typings";
import {getActiveViewData, startGameHandler} from "../../controller/ui";
import {isHTMLButtonElement} from "../../../typings/utils/utils";

export class TextbookView {
    public wordsData: IAggreagtedWord[] = [];

    public wordsComponent = new WordsItem(textbookState.words).create();

    create() {
        this.wordsData = textbookState.words;
        const textbookContainer = createElementWithClassnames(
            "section",
            "textbook-container"
        );

        /* Начало textbook-controls */
        const textbookControls = createElementWithClassnames(
            "div",
            "textbook-controls"
        );

        // Переключатель в режим "УЧЕБНИК"
        const textbookControlsFirst = createElementWithClassnames(
            "div",
            "textbook-control"
        );
        const textbookModeAttributes = {
            type: "radio",
            name: "textbook-mode",
            id: "textbook",
        };
        const textbookMode = createElementWithAttributes(
            "input",
            textbookModeAttributes
        );
        const textbookModeLabelAttributes = {
            type: "label",
            for: textbookModeAttributes.id,
            class: "textbook-mode",
        };
        const textbookModeLabel = createElementWithAttributes(
            "label",
            textbookModeLabelAttributes
        );
        textbookModeLabel.textContent = "Учебник";

        // Переключатель в режим "СЛОЖНЫЕ СЛОВА"
        if (appState.isSignedIn) {
            const textbookControlsSecond = createElementWithClassnames(
                "div",
                "textbook-control"
            );
            const dictionaryModeAttributes = {
                type: "radio",
                name: "textbook-mode",
                id: "dictionary",
            };
            const dictionaryMode = createElementWithAttributes(
                "input",
                dictionaryModeAttributes
            );
            const dictionaryModeLabelAttributes = {
                type: "label",
                for: dictionaryModeAttributes.id,
                class: "textbook-mode",
            };
            const dictionaryModeLabel = createElementWithAttributes(
                "label",
                dictionaryModeLabelAttributes
            );
            dictionaryModeLabel.textContent = "Мои слова";

            if (appState.viewsStates.textbook.mode === "textbook") {
                (textbookMode as HTMLInputElement).checked = true;
                textbookControlsFirst.append(textbookMode, textbookModeLabel);
                textbookControlsSecond.append(
                    dictionaryMode,
                    dictionaryModeLabel
                );
                textbookControls.append(
                    textbookControlsFirst,
                    textbookControlsSecond
                );
            } else if (appState.viewsStates.textbook.mode === "dictionary") {
                // Диалог настроек
                const modal = createElementWithAttributes("dialog", {
                    id: "modal",
                    class: "modal",
                });
                modal.innerHTML = `Выберите карегорию<br>отображаемых слов:`;
                const modalButtons = createElementWithClassnames(
                    "div",
                    "modal-buttons"
                );
                const buttonNames = ["СЛОЖНЫЕ", "ИЗУЧЕННЫЕ", "НА ИЗУЧЕНИИ"];
                buttonNames.forEach((name, index) => {
                    let dictionaryModeValue = "";
                    if (index === 0) dictionaryModeValue = "hard";
                    if (index === 1) dictionaryModeValue = "easy";
                    if (index === 2) dictionaryModeValue = "norm";
                    const button = createElementWithAttributes("button", {
                        id: `button-${dictionaryModeValue}`,
                        value: dictionaryModeValue,
                    });
                    button.textContent = buttonNames[index];
                    if (
                        (button as HTMLButtonElement).value ===
                        appState.viewsStates.textbook.dictionaryMode
                    ) {
                        button.setAttribute(
                            "style",
                            "color: gray; box-shadow: 1px 1px 0 currentColor; border: 1px solid currentColor;"
                        );
                    }
                    button.addEventListener("click", (e) => {
                        appState.viewsStates.textbook.dictionaryMode = (e.target as HTMLButtonElement).value;
                        (modal as HTMLDialogElement).close();
                        getActiveViewData();
                    });
                    modalButtons.append(button);
                });
                modal.append(modalButtons);
                textbookControls.append(modal);
                // Кнопка "НАСТРОЙКИ"
                const textbookSettingsButtonAttributes = {
                    type: "button",
                    class: "textbook-settings",
                };
                const textbookSettingsButton = createElementWithAttributes(
                    "button",
                    textbookSettingsButtonAttributes
                );
                textbookSettingsButton.innerHTML = `
                    <svg class= "settings-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                    </svg>`;
                textbookSettingsButton.addEventListener("click", () => {
                    (modal as HTMLDialogElement).showModal();
                });
                (dictionaryMode as HTMLInputElement).checked = true;
                textbookControlsFirst.append(textbookMode, textbookModeLabel);
                textbookControlsSecond.append(
                    dictionaryMode,
                    dictionaryModeLabel
                );
                textbookControls.append(
                    textbookControlsFirst,
                    textbookControlsSecond,
                    textbookSettingsButton
                );
            }
        } else {
            (textbookMode as HTMLInputElement).checked = true;
            textbookControlsFirst.append(textbookMode, textbookModeLabel);
            textbookControls.append(textbookControlsFirst);
        }

        textbookControls.addEventListener("input", (e) => {
            const input = e.target as HTMLInputElement;
            appState.viewsStates.textbook.mode = input.id;
            getActiveViewData();
        });

        textbookContainer.append(textbookControls);
        /* Конец textbook-controls */

        if (
            appState.viewsStates.textbook.mode === "textbook" ||
            (appState.viewsStates.textbook.mode === "dictionary" &&
                !appState.isSignedIn)
        ) {
            const groupHeading = createElementWithClassnames(
                "h2",
                "group-heading"
            );
            groupHeading.textContent = "Выберите группу:";
            const groups = new GroupPagination().create();
            textbookContainer.append(groupHeading, groups);
        }

        const wordsWrapper = createElementWithClassnames(
            "div",
            `words-wrapper`
        );
        if (
            appState.isSignedIn &&
            appState.viewsStates.textbook.mode === "dictionary"
        ) {
            wordsWrapper.setAttribute("style", "border-radius: 1rem;");
        }
        let wordsDictiorariMode;
        switch (appState.viewsStates.textbook.dictionaryMode) {
            case "hard": {
                wordsDictiorariMode = "СЛОЖНЫЕ";
                break;
            }
            case "easy": {
                wordsDictiorariMode = "ИЗУЧЕННЫЕ";
                break;
            }
            case "norm": {
                wordsDictiorariMode = "НА ИЗУЧЕНИИ";
                break;
            }
            default:
                wordsDictiorariMode = "";
        }
        const wordsHeading = createElementWithContent(
            "h2",
            `Слова: ${
                appState.isSignedIn &&
                appState.viewsStates.textbook.mode === "dictionary"
                    ? wordsDictiorariMode
                    : ""
            }`
        );
        wordsHeading.classList.add("words-heading");
        const wordsGroup = createElementWithClassnames(
            "div",
            "words-group",
            `words-group-${appState.viewsStates.textbook.group}`
        );

        // Список слов
        this.wordsComponent = new WordsItem(this.wordsData).create();
        wordsGroup.append(this.wordsComponent);

        // Карточка первого слова
        if (this.wordsData.length) {
            const wordDetailsComponent = new WordDetails().ctreate(
                this.wordsData[0]
            );
            wordsGroup.append(wordDetailsComponent);
        }
        wordsWrapper.append(wordsHeading, wordsGroup);

        if (
            appState.viewsStates.textbook.mode === "textbook" ||
            (appState.viewsStates.textbook.mode === "dictionary" &&
                !appState.isSignedIn)
        ) {
            const pagePaginationComponent = new PagePagination().create();
            wordsWrapper.append(pagePaginationComponent);
        }
        // Блок с запуском игр
        const gamesLauncherWrapper = createElementWithClassnames(
            "div",
            "games-launcher-wrapper"
        );
        const audiocallLauncherWrapper = createElementWithClassnames(
            "div",
            "audiocall-launcher-wrapper"
        );
        const sprintLauncherWrapper = createElementWithClassnames(
            "div",
            "sprint-launcher-wrapper"
        );

        let isStartGameDisabled = false;
        if (
            (appState.viewsStates.textbook.mode === "dictionary" &&
                appState.viewsStates.textbook.dictionaryMode === "easy") ||
            (appState.viewsStates.textbook.mode === "dictionary" &&
                appState.viewsStates.textbook.dictionaryMode !== "easy" &&
                textbookState.words.length < 10)
        ) {
            isStartGameDisabled = true;
        }

        const audiocallButton = createElementWithClassnames(
            "button",
            "start-button",
            "audio-call-button"
        );
        const sprintButton = createElementWithClassnames(
            "button",
            "start-button",
            "sprint-button"
        );
        (audiocallButton as HTMLButtonElement).disabled = isStartGameDisabled;
        (sprintButton as HTMLButtonElement).disabled = isStartGameDisabled;
        audiocallButton.textContent = "Запустить игру\nАудиовызов";
        sprintButton.textContent = "Запустить игру\nСпринт";
        audiocallLauncherWrapper.append(audiocallButton);
        sprintLauncherWrapper.append(sprintButton);
        gamesLauncherWrapper.append(
            audiocallLauncherWrapper,
            sprintLauncherWrapper
        );
        gamesLauncherWrapper.addEventListener("click", (e) => {
            if (!isHTMLButtonElement(e.target)) return;
            let wordsForGame = this.wordsData;
            if (appState.isSignedIn) {
                wordsForGame = wordsForGame.filter(
                    (word) =>
                        !word.userWord || word.userWord.difficulty !== "easy"
                );
            }
            startGameHandler(e, {words: wordsForGame});
        });
        const games = createElementWithClassnames("div", "games");

        textbookContainer.append(wordsWrapper, gamesLauncherWrapper, games);
        return textbookContainer;
    }
}
