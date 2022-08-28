import "./sprint.scss";
import {IWordsForSplit} from "../../../../typings";
import { createElementWithClassnames,
    createElementWithContent, createElementWithAttributes } from "../../utils";
import { ENDPOINT} from "../../../controller/state";
import { playWordInGameHandler } from "../../../controller/ui";

export class ResultWord {
    word: IWordsForSplit;

    constructor (word: IWordsForSplit) {
        this.word = word;
    }

    create () {

        const wordsContainer = createElementWithClassnames(
            "div",
            "result-answers-item"
        );

        const audioAttr = {
            src: `${ENDPOINT}/${this.word.audio}`,
            type: 'audio/mpeg'
        };

        const audio = createElementWithAttributes('audio', audioAttr); 
        
        const button = createElementWithClassnames(
            'button', 
            'result-answers-audio'
       ); 

       button.addEventListener('click', ()=>{
        playWordInGameHandler((audio as HTMLAudioElement));
       });

        const wordDescription = createElementWithContent(
            "p", 
           `${this.word.word} - ${this.word.originalTranslate}`
        );


        wordsContainer.append(button, audio, wordDescription);
        return wordsContainer; 
    }

}