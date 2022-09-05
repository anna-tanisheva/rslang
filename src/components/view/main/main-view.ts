import "./style.scss";
import {MainPageView} from "../mainPage/mainPage-view";
import {TextbookView} from "../textbook/textbook-view";
import {createElementWithClassnames} from "../utils";
import {ErrorView} from "./error-view";
import {GamesPage} from "../games-start-page/games-page";
import {StatisticView} from "../stats/statistic-view";
import {appState} from "../../controller/state";

export class MainView {
    public activeViewName: string = appState.view;

    private index = new MainPageView().create();

    private textbook = new TextbookView().create();

    private games = new GamesPage().create();

    private stats = new StatisticView().create(appState);

    create() {
        this.activeViewName = appState.view;
        const main = createElementWithClassnames("main", "main");
        const overlay = createElementWithClassnames("div", "overlay", "hidden");
            overlay.innerHTML = `
                <ul class="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>`;

        if (
            this.activeViewName !== "index" &&
            this.activeViewName !== "textbook" &&
            this.activeViewName !== "games" &&
            this.activeViewName !== "stats"
        ) {
            const errorView = new ErrorView({}).create();
            main.append(errorView);
            return main;
        }
        main.append(this[this.activeViewName], overlay);
        return main;
    }
}
