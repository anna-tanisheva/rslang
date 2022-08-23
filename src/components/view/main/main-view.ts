import "./style.scss";
import {MainPageView} from "../mainPage/mainPage-view";
import {TextbookView} from "../textbook/textbook-view";
import {createElementWithClassnames} from "../utils";
import {ErrorView} from "./error-view";

export class MainView {
    public activeViewName: string | undefined;

    constructor(activeViewName: string | undefined) {
        this.activeViewName = activeViewName;
    }

    private index = new MainPageView().create();

    private textbook = new TextbookView().create();

    create() {
        const main = createElementWithClassnames("main", "main");
        if (
            this.activeViewName !== "index" &&
            this.activeViewName !== "textbook"
        ) {
            const errorView = new ErrorView({}).create();
            main.append(errorView);
            return main;
        }
        main.append(this[this.activeViewName]);
        return main;
    }
}
