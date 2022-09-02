import { isHTMLButtonElement, isHTMLElement } from "../../../../typings/utils/utils";
import { currentGame, TEXTBOOK_PAGE_COUNT, appState, SPRINT } from "../../../controller/state";
import { getRandomInRange } from "../../utils";
import { startGame, setStats } from "../../../controller/ui";
import { Sprint } from "./sprint-model";
import { IUserStats } from "../../../../typings";

export function restartGameHandler(e: Event) {
    console.log(`restartGameHandler`)
   const {target} = e;
   if (!isHTMLButtonElement(target)) return;
   const popup = document.querySelector(".game-popup");
   if (!isHTMLElement(popup)) return;
   const container = document.querySelector(".games");
   if (!isHTMLElement(container)) return;


   if(target.classList.contains("sprint-restart-button")) {
       const currentSection = (currentGame.game as Sprint).section;

       if(!appState.isSignedIn) {
        setStats((currentGame.game as Sprint), appState.userNull);
      } else {
          setStats((currentGame.game as Sprint), (appState.user.statsToday as IUserStats));
      }

       currentGame.game = null;
       const PAGE = getRandomInRange(TEXTBOOK_PAGE_COUNT);
       container.removeChild(popup);
       startGame(container, currentSection, SPRINT, PAGE);
   }
}