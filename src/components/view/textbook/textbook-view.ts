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

import {appState} from "../../controller/state";
import {IWord} from "../../../typings";

export class TextbookView {
    public wordsData: IWord[] = [];

    public wordsComponent = new WordsItem(this.wordsData).create();

    constructor(wordsData?: IWord[]) {
        this.wordsData = wordsData?.length ? wordsData : [];
    }

    create() {
        const textbookContainer = createElementWithClassnames(
            "section",
            "textbook-container"
        );
        const textbookControls = createElementWithClassnames(
            "div",
            "textbook-controls"
        );
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
        (textbookMode as HTMLInputElement).checked = true;
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
        textbookControlsFirst.append(textbookMode, textbookModeLabel);
        textbookControls.append(textbookControlsFirst);

        // #toDo Заменить условие. Нужно показывать если пользователь авторизован
        // eslint-disable-next-line no-constant-condition
        if (true) {
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
            dictionaryModeLabel.textContent = "Словарь";
            textbookControlsSecond.append(dictionaryMode, dictionaryModeLabel);
            textbookControls.append(textbookControlsSecond);
        }

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
        textbookControls.append(textbookSettingsButton);
        const groupHeading = createElementWithClassnames("h2", "group-heading");
        groupHeading.textContent = "Выберите группу:";
        const groups = new GroupPagination().create();

        textbookContainer.append(textbookControls, groupHeading, groups);

        const wordsWrapper = createElementWithClassnames(
            "div",
            `words-wrapper`
        );
        const wordsHeading = createElementWithContent("h2", "Слова");
        const wordsGroup = createElementWithClassnames(
            "div",
            `words-group-${appState.group}`
        );
        const wordsComponent = new WordsItem(this.wordsData).create();
        this.wordsComponent = wordsComponent;
        wordsGroup.append(wordsComponent);

        if (this.wordsData.length) {
            const wordDetailsComponent = new WordDetails(this.wordsData[0]);
            wordsGroup.append(wordDetailsComponent.template);
        }

        const pagePaginationComponent = new PagePagination().create();
        wordsWrapper.append(wordsHeading, wordsGroup, pagePaginationComponent);
        // #toDo Сделать блок с запуском игр
        return textbookContainer;
    }
}
