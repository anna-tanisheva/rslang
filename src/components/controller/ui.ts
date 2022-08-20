import {WordDetails} from "../view/textbook";
import {IResWordsPage, IWord} from "../../typings";
import {fetchWords} from "./api";
import {textbookState} from "./state";

export function drawWordDetails(element: IWord) {
    const card = new WordDetails(element);
    return card.template;
}

async function getWords(): Promise<IResWordsPage> {
    const pageData = await fetchWords({
        group: textbookState.group,
        page: textbookState.page,
    });
    return pageData;
}

export async function drawTextbook(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const pageData = await getWords();
}
