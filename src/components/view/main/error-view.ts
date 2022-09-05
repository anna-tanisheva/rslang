import "./style.scss";

import {createElementWithClassnames} from "../utils";
import {ErrorProps} from "./errorProps";

export class ErrorView {
    public errorStatus: string;

    public errorMessage: string;

    constructor({status, message}: ErrorProps) {
        this.errorStatus = status ? `${status}` : "404";
        this.errorMessage = message ? `${message}` : "Ошибочная страница";
    }

    create() {
        const errorView = createElementWithClassnames(
            "sectinon",
            "error-container"
        );
        const errorStatus = createElementWithClassnames("h2", "error-code");
        const errorMessage = createElementWithClassnames("p", "error-message");
        errorStatus.textContent = this.errorStatus;
        errorMessage.textContent = this.errorMessage;
        errorView.append(errorStatus, errorMessage);
        return errorView;
    }
}
