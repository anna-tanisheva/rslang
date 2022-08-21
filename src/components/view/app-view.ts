import {createElementWithAttributes} from "./utils";
import {isHTMLElement} from "../../typings/utils/utils";
import {Form} from "./login-form/login-form";
import {ShowFormPanel} from "./login-form/show-button";
import {HeaderView} from "./header/header-view";
import {MainView} from "./main/main-view";
import {FooterView} from "./footer/footer-view";

export class AppView {
    private headerView = new HeaderView().create();

    private mainView = new MainView().create();

    private footerView = new FooterView().create();

    private form = new Form().create();

    private showForm = new ShowFormPanel().create();

    private drawForm(): void {
        const headerWrapper = document.querySelector(".header-wrapper");
        if (!isHTMLElement(headerWrapper)) return;
        headerWrapper.append(this.showForm);
    }

    public drawView(): void {
        const root = createElementWithAttributes("div", {id: "root"});
        root.append(this.headerView, this.mainView, this.footerView, this.form);
        document.body.append(root);
        this.drawForm();
    }
}
