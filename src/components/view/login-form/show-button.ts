import './login-form.scss';

export class ShowFormPanel {
    create() {
        const showFormContainer = document.createElement("div");
        showFormContainer.classList.add("show-form-container");
        showFormContainer.innerHTML = `
            <button class="show-form"></button>
            <div class="log-out-wrapper">
              <button class="logout-submit" disabled>Log Out</button>
            </div>
            <div class="welcome-wrapper">
              <p class="welcome-text">Welcome</p>
            </div>
        `
      return showFormContainer;
    }
}