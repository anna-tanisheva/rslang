import { isHTMLButtonElement, isHTMLElement } from "../../../../typings/utils/utils";
import { currentGame, TEXTBOOK_PAGE_COUNT } from "../../../controller/state";
import { getRandomInRange } from "../../utils";
import { startGame } from "../../../controller/ui";
import { Sprint } from "./sprint-model"; 
 
export function restartGameHandler(e: Event ) {
   
   const {target} = e;
   if (!isHTMLButtonElement(target)) return;
   const popup = document.querySelector(".game-popup");
   if (!isHTMLElement(popup)) return;
   const container = document.querySelector(".games");
   if (!isHTMLElement(container)) return;
   

   if(target.classList.contains("sprint-restart-button")) {
       const currentSection = (currentGame.game as Sprint).section;  
       currentGame.game = null;
       const CALL_GAME = "Sprint";
       const PAGE = getRandomInRange(TEXTBOOK_PAGE_COUNT);      
       container.removeChild(popup); 
       startGame(container, currentSection, CALL_GAME, PAGE);
   }
} 