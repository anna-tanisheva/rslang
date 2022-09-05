import {createElementWithClassnames} from "../../utils";
import {appState, textbookState} from "../../../controller/state";
import {
    isHTMLButtonElement,
    isHTMLElement,
} from "../../../../typings/utils/utils";
import {startGameHandler} from "../../../controller/ui";
import {fetchWords} from "../../../controller/api";

export class GamesLauncher {
    create() {
        const gamesLauncherWrapper = createElementWithClassnames(
            "div",
            "games-launcher-wrapper"
        );
        const audiocallLauncherWrapper = createElementWithClassnames(
            "div",
            "audiocall-launcher-wrapper"
        );
        const sprintLauncherWrapper = createElementWithClassnames(
            "div",
            "sprint-launcher-wrapper"
        );
        const infoWrapper = createElementWithClassnames(
            "div",
            "games-info-wrapper"
        );

        let isStartGameDisabled = false;
        if (
            (appState.viewsStates.textbook.mode === "dictionary" &&
                appState.viewsStates.textbook.dictionaryMode === "easy") ||
            (appState.viewsStates.textbook.mode === "dictionary" &&
                appState.viewsStates.textbook.dictionaryMode !== "easy" &&
                textbookState.words.length < 10) ||
            (appState.viewsStates.textbook.mode === "textbook" &&
                appState.viewsStates.textbook.group === 0 &&
                appState.viewsStates.textbook.page === 0 &&
                textbookState.words.filter(
                    (word) =>
                        !word.userWord || word.userWord.difficulty !== "easy"
                ).length < 10) ||
            (appState.viewsStates.textbook.mode === "textbook" &&
                textbookState.words.filter(
                    (word) =>
                        !word.userWord || word.userWord.difficulty !== "easy"
                ).length === 0)
        ) {
            isStartGameDisabled = true;
        }

        const audiocallButton = createElementWithClassnames(
            "button",
            "start-button",
            "audio-call-button"
        );
        const sprintButton = createElementWithClassnames(
            "button",
            "start-button",
            "sprint-button"
        );
        (audiocallButton as HTMLButtonElement).disabled = isStartGameDisabled;
        (sprintButton as HTMLButtonElement).disabled = isStartGameDisabled;
        audiocallButton.textContent = "Запустить игру\nАудиовызов";
        sprintButton.textContent = "Запустить игру\nСпринт";
        const info = createElementWithClassnames("h4", "games-info");
        info.innerHTML = `${
            isStartGameDisabled
                ? "На данной странице не достаточно слов для запуска игры (минимальное допустимое количество 10).<br>К игре допускаются все слова кроме ИЗУЧЕНЫХ."
                : ""
        }`;
        audiocallLauncherWrapper.append(audiocallButton);
        sprintLauncherWrapper.append(sprintButton);
        infoWrapper.append(info);
        const buttons = createElementWithClassnames(
            "div",
            "games-launcher-buttons"
        );
        buttons.append(audiocallLauncherWrapper, sprintLauncherWrapper);
        gamesLauncherWrapper.append(buttons, infoWrapper);
        gamesLauncherWrapper.addEventListener("click", async (e) => {
            if (!isHTMLButtonElement(e.target)) return;
            let wordsForGame = textbookState.words;
            if (appState.isSignedIn) {
                wordsForGame = wordsForGame.filter(
                    (word) =>
                        !word.userWord || word.userWord.difficulty !== "easy"
                );
            }
            if (wordsForGame.length >= 10) {
                startGameHandler(e, {words: wordsForGame});
            } else {
                const newWords = (
                    await fetchWords({
                        group: appState.viewsStates.textbook.group,
                        wordsPerPage:
                            (appState.viewsStates.textbook.page + 1) * 20,
                    })
                ).words
                    .reverse()
                    .filter(
                        (word) =>
                            !word.userWord ||
                            word.userWord.difficulty !== "easy"
                    )
                    .slice(0, 10);
                startGameHandler(e, {words: newWords});
            }
        });
        return gamesLauncherWrapper;
    }

    static redraw() {
        const gamesLauncherWrapper = document.querySelector(
            ".games-launcher-wrapper"
        );
        if (!isHTMLElement(gamesLauncherWrapper)) return;
        const newGamesLauncherWrapper = new GamesLauncher().create();
        gamesLauncherWrapper.replaceChildren();
        gamesLauncherWrapper.append(...newGamesLauncherWrapper.children);
    }
}
