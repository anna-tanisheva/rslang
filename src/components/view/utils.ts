import {TEXTBOOK_GROUP_COUNT, TEXTBOOK_PAGE_COUNT} from "../controller/state";

export function createElementWithClassnames(
    elementName: string,
    ...elementClassnames: string[]
): HTMLElement {
    const element = document.createElement(elementName);
    element.classList.add(...elementClassnames);
    return element;
}

export function createElementWithAttributes(
    elementName: string,
    elementAttributes: {[key: string]: string}
): HTMLElement {
    const element = document.createElement(elementName);
    Object.keys(elementAttributes).forEach((key) =>
        element.setAttribute(key, elementAttributes[key])
    );
    return element;
}

export function createElementWithContent(
    elementName: string,
    elementContent: string
): HTMLElement {
    const element = document.createElement(elementName);
    element.textContent = elementContent;
    return element;
}

export function getRandomPageInRandomGroup() {
    return {
        page: Math.floor(Math.random() * TEXTBOOK_PAGE_COUNT),
        group: Math.floor(Math.random() * TEXTBOOK_GROUP_COUNT),
    };
}
