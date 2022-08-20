import {
    createElementWithAttributes,
    createElementWithClassnames,
} from "../utils";

export class PagePagination {
    public template: HTMLElement;

    constructor(maxPage: number) {
        this.template = this.setItem(maxPage);
    }

    // #ToDo Задействовать currentPage для эффекта пагинации
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setItem(maxPage: number): HTMLElement {
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

        if (maxPage > 0) {
            const lastButtonAttributes = {
                type: "button",
                "area-label": `Перейти к странице ${maxPage + 1}`,
                class: `page-button page-${maxPage + 1}`,
            };
            const lastButton = createElementWithAttributes(
                "button",
                lastButtonAttributes
            );
            lastButton.textContent = `${maxPage + 1}`;

            if (maxPage > 1) {
                const pagesScroll = createElementWithClassnames(
                    "div",
                    "slider-buttons"
                );
                for (let i = 1; i < maxPage; i += 1) {
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
            } else {
                pagesContainer.append(
                    prevButton,
                    firstButton,
                    lastButton,
                    nextButton
                );
            }
        } else {
            pagesContainer.append(prevButton, firstButton, nextButton);
        }
        return pagesContainer;
    }
}
