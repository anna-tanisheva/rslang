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
                ).length < 10)
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
        const info = createElementWithClassnames("h3", "games-info");
        info.textContent = `${
            isStartGameDisabled
                ? "К сожалению на данной странице не достаточно слов для запуска игры (минимальное допустимое количество 10). К игре допускается все слова кроме категории ИЗУЧЕННЫЕ."
                : ""
        }`;
        audiocallLauncherWrapper.append(audiocallButton);
        sprintLauncherWrapper.append(sprintButton);
        infoWrapper.append(info);
        gamesLauncherWrapper.append(
            audiocallLauncherWrapper,
            infoWrapper,
            sprintLauncherWrapper
        );
        gamesLauncherWrapper.addEventListener("click", (e) => {
            if (!isHTMLButtonElement(e.target)) return;
            let wordsForGame = textbookState.words;
            if (appState.isSignedIn) {
                wordsForGame = wordsForGame.filter(
                    (word) =>
                        !word.userWord || word.userWord.difficulty !== "easy"
                );
                console.log("массив слов до дополнения", wordsForGame);
                if (wordsForGame.length < 10) {
                    let newPage = appState.viewsStates.textbook.page;
                    let newGroup = appState.viewsStates.textbook.group;
                    while (wordsForGame.length < 10) {
                        if (newPage > 0) {
                            newPage -= 1;
                        } else if (newPage === 0 && newGroup !== 0) {
                            newPage = 29;
                            newGroup -= 1;
                        } else if (newPage === 0 && newGroup === 0) {
                            /* console.log(
                                "массив слов < 10 отправлен",
                                wordsForGame
                            );
                            startGameHandler(e, {words: wordsForGame}); */
                            break;
                        }
                        fetchWords({
                            group: newGroup,
                            page: newPage,
                            wordsPerPage: 20,
                            // eslint-disable-next-line @typescript-eslint/no-loop-func
                        }).then((resp) => {
                            const addedWords = resp.words.filter(
                                (word) =>
                                    !word.userWord ||
                                    word.userWord.difficulty !== "easy"
                            );
                            wordsForGame.push(...addedWords);
                            if (wordsForGame.length > 10) {
                                console.log(
                                    "массив слов после дополнения. Запуск",
                                    wordsForGame
                                );
                                startGameHandler(e, {words: wordsForGame});
                            }
                        });
                    }
                }
            }
            if (wordsForGame.length >= 10) {
                console.log("массив слов >= 10", wordsForGame);
                startGameHandler(e, {words: wordsForGame});
            } else console.log("запуск в конце проигнорирован");
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
