import {TEXTBOOK_PAGE_COUNT} from "../../../controller/state";
import {
    createElementWithAttributes,
    createElementWithClassnames,
} from "../../utils";

export class PagePagination {
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
            pagesScroll.append(button);
        }
        pagesContainer.append(
            prevButton,
            firstButton,
            pagesScroll,
            lastButton,
            nextButton
        );
        return pagesContainer;
    }
}
