import {isHTMLButtonElement} from "../../../../typings/utils/utils";
import {fetchWordsInPage} from "../../../controller/api";
import {appState, TEXTBOOK_PAGE_COUNT} from "../../../controller/state";
import {
    createElementWithAttributes,
    createElementWithClassnames,
} from "../../utils";

export class PagePagination {
    static setDisabled() {
        const pageButtons = document.querySelectorAll(".page-button");
        pageButtons.forEach((btn) => {
            if (!isHTMLButtonElement(btn)) return;
            btn.removeAttribute("disabled");
            if (
                Number(btn.textContent) - 1 ===
                appState.viewsStates.textbook.page
            ) {
                btn.setAttribute("disabled", "");
            }
            if (
                btn.textContent === "❮" &&
                appState.viewsStates.textbook.page === 0
            ) {
                btn.setAttribute("disabled", "");
            }
            if (
                btn.textContent === "❯" &&
                appState.viewsStates.textbook.page === TEXTBOOK_PAGE_COUNT - 1
            ) {
                btn.setAttribute("disabled", "");
            }
        });
    }

    static moveSlider() {
        let moveMultiplier = 0;
        let px = 0;
        const {page} = appState.viewsStates.textbook;
        if (page >= 0 && page <= 3) moveMultiplier = 0;
        else if (page >= 26 && page <= 30) {
            moveMultiplier = 21.2;
            px = -50;
        } else {
            moveMultiplier = page - 3;
            px = -46;
        }
        document
            .querySelector(".slider-buttons")
            ?.setAttribute(
                "style",
                `transform: translateX(${px * moveMultiplier}px);`
            );
    }

    create() {
        const pagesContainer = createElementWithClassnames(
            "nav",
            "pages-container"
        );
        const prevButtonAttributes = {
            type: "button",
            "area-label": "Перейти к предыдущей странице",
            class: "page-button prev",
        };
        const nextButtonAttributes = {
            type: "button",
            "area-label": "Перейти к следующей странице",
            class: "page-button next",
        };
        const firstButtonAttributes = {
            type: "button",
            "area-label": "Перейти к странице 1",
            class: "page-button page-1",
        };
        const prevButton = createElementWithAttributes(
            "button",
            prevButtonAttributes
        );
        const nextButton = createElementWithAttributes(
            "button",
            nextButtonAttributes
        );
        const firstButton = createElementWithAttributes(
            "button",
            firstButtonAttributes
        );

        prevButton.textContent = "❮";
        nextButton.textContent = "❯";
        firstButton.textContent = "1";

        const lastButtonAttributes = {
            type: "button",
            "area-label": `Перейти к странице ${TEXTBOOK_PAGE_COUNT}`,
            class: `page-button page-${TEXTBOOK_PAGE_COUNT}`,
        };
        const lastButton = createElementWithAttributes(
            "button",
            lastButtonAttributes
        );
        lastButton.textContent = `${TEXTBOOK_PAGE_COUNT}`;

        const pagesScrollWrapper = createElementWithClassnames(
            "div",
            "slider-buttons-wrapper"
        );
        const pagesScroll = createElementWithClassnames(
            "div",
            "slider-buttons"
        );
        for (let i = 1; i < TEXTBOOK_PAGE_COUNT - 1; i += 1) {
            const ButtonAttributes = {
                type: "button",
                "area-label": `Перейти к странице ${i + 1}`,
                class: `page-button page-${i + 1}`,
            };
            const button = createElementWithAttributes(
                "button",
                ButtonAttributes
            );
            button.textContent = `${i + 1}`;
            (button as HTMLButtonElement).disabled =
                appState.viewsStates.textbook.page === i;
            pagesScroll.append(button);
        }
        (firstButton as HTMLButtonElement).disabled =
            appState.viewsStates.textbook.page === 0;
        (lastButton as HTMLButtonElement).disabled =
            appState.viewsStates.textbook.page === TEXTBOOK_PAGE_COUNT - 1;
        pagesScrollWrapper.append(pagesScroll);
        (prevButton as HTMLButtonElement).disabled =
            appState.viewsStates.textbook.page === 0;
        (nextButton as HTMLButtonElement).disabled =
            appState.viewsStates.textbook.page === TEXTBOOK_PAGE_COUNT - 1;
        pagesScrollWrapper.append(pagesScroll);

        pagesContainer.append(
            prevButton,
            firstButton,
            pagesScrollWrapper,
            lastButton,
            nextButton
        );
        pagesContainer.addEventListener("click", (e) => {
            if (!isHTMLButtonElement(e.target)) return;
            const button = e.target as HTMLButtonElement;
            let page: number;
            if (!Number.isNaN(Number(button.textContent))) {
                page = Number(button.textContent) - 1;
            } else {
                switch (button.textContent) {
                    case "❮": {
                        page = appState.viewsStates.textbook.page - 1;
                        break;
                    }
                    case "❯": {
                        page = appState.viewsStates.textbook.page + 1;
                        break;
                    }
                    default:
                        page = appState.viewsStates.textbook.page;
                }
            }
            appState.viewsStates.textbook.page = page;
            const {group} = appState.viewsStates.textbook;
            fetchWordsInPage({group, page});
        });
        return pagesContainer;
    }
}
