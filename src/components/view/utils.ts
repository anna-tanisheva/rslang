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

export function getRandomInRange(num: number) {
    return Math.floor(Math.random() * num)
}




export function localStorageSpace (){
        let allStrings = '';
        Object.keys(window.localStorage).forEach ( key=>
{            if(window.localStorage.getItem(key)){
            allStrings += window.localStorage[key];
            console.log(3 + (allStrings.length*16)/(8*1024));
        }
        })

    };