import "./style.scss";
import {MainPageView} from "../mainPage/mainPage-view";
import {TextbookView} from "../textbook/textbook-view";
import {createElementWithClassnames} from "../utils";
import {ErrorView} from "./error-view";

export class MainView {
    public activeViewName = "mainPageView";

    private mainPageView = new MainPageView().create();

    private textBookView = new TextbookView().create();

    create() {
        const main = createElementWithClassnames("main", "main");
        if (
            this.activeViewName !== "mainPageView" &&
            this.activeViewName !== "textBookView"
        ) {
            const errorView = new ErrorView({}).create();
            main.append(errorView);
            return main;
        }
        main.append(this[this.activeViewName]);
        return main;
    }
}
