import {isHTMLInputElement} from "../../../../typings/utils/utils";
import {fetchWordsInPage} from "../../../controller/api";
import {
    appState,
    TEXTBOOK_GROUP_COUNT,
    TEXTBOOK_GROUP_SIZE,
} from "../../../controller/state";
import {
    createElementWithAttributes,
    createElementWithClassnames,
    createElementWithContent,
} from "../../utils";

export class GroupPagination {
    create() {
        const groupsContainer = createElementWithClassnames(
            "div",
            "group-container"
        );
        for (let i = 0; i < TEXTBOOK_GROUP_COUNT; i += 1) {
            const groupItem = createElementWithClassnames("div", "group-item");
            const inputAttributes = {
                type: "radio",
                name: "group-radio",
                id: `group-${i + 1}`,
                value: `${i}`,
            };
            const inputRadio = createElementWithAttributes(
                "input",
                inputAttributes
            );
            const labelAttributes = {
                type: "label",
                for: inputAttributes.id,
                class: "group-label",
            };
            const inputLabel = createElementWithAttributes(
                "label",
                labelAttributes
            );
            const groupName = createElementWithContent("h2", `Группа ${i + 1}`);
            const groupRange = createElementWithContent(
                "p",
                `${TEXTBOOK_GROUP_SIZE * i + 1}-${
                    TEXTBOOK_GROUP_SIZE * (i + 1)
                }`
            );
            const groupStatus = createElementWithClassnames(
                "div",
                `group-status`
            );
            if (i === appState.viewsStates.textbook.group) {
                (inputRadio as HTMLInputElement).checked = true;
            }
            inputLabel.append(groupName, groupRange, groupStatus);
            (inputRadio as HTMLInputElement).addEventListener("input", (e) => {
                if (!isHTMLInputElement(e.target)) return;
                const group = Number((e.target as HTMLInputElement).value);
                const page = 0;
                appState.viewsStates.textbook.group = group;
                appState.viewsStates.textbook.page = page;
                fetchWordsInPage({group, page});
            });
            groupItem.append(inputRadio, inputLabel);
            groupsContainer.append(groupItem);
        }
        return groupsContainer;
    }
}
