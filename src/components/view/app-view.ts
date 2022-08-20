/* import { isHTMLElement } from "../../typings/utils/utils"; */
import {textbookState} from "../controller/state";
import {TextbookView} from "./textbook/textbook-view";
import {createElementWithAttributes} from "./utils";

export class AppView {
    private textbook = new TextbookView(textbookState);

    private drawTestView(): void {
        const root = createElementWithAttributes("div", {id: "root"});
        root.append(this.textbook.template);
        document.body.append(root);
    }

    public drawView(): void {
        this.drawTestView();
    }
}
