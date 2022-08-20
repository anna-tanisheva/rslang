import {
    createElementWithAttributes,
    createElementWithClassnames,
    createElementWithContent,
} from "../utils";

const GROUP_QUANTITY = 6;
const GROUP_SIZE = 600;

export class GroupPagination {
    public template: HTMLElement;

    constructor() {
        this.template = this.setItem();
    }

    setItem(): HTMLElement {
        const groupsContainer = createElementWithClassnames(
            "div",
            "group-container"
        );
        for (let i = 0; i < GROUP_QUANTITY; i += 1) {
            const groupItem = createElementWithClassnames("div", "group-item");
            const inputAttributes = {
                type: "radio",
                name: "group-radio",
                id: `group-${i + 1}`,
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
                `${GROUP_SIZE * i + 1}-${GROUP_SIZE * (i + 1)}`
            );
            const groupStatus = createElementWithClassnames(
                "div",
                `group-status`
            );
            if (i === 0) {
                (inputRadio as HTMLInputElement).checked = true;
            }
            inputLabel.append(groupName, groupRange, groupStatus);
            groupItem.append(inputRadio, inputLabel);
            groupsContainer.append(groupItem);
        }
        return groupsContainer;
    }
}
