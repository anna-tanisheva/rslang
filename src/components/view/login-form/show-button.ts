import './login-form.scss';

export class ShowFormPanel {
    create() {
        const showFormContainer = document.createElement("div");
        showFormContainer.classList.add("show-form-container");
        showFormContainer.innerHTML = `
            <div class="form-buttons">
              <button class="show-form"></button>
              <div class="log-out-wrapper">
                <button class="logout-submit" disabled>
                  <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M4.604 17.417q-.792 0-1.333-.552-.542-.553-.542-1.323V4.875q0-.771.542-1.323Q3.812 3 4.604 3H10v1.625H4.604q-.083 0-.166.083-.084.084-.084.167v10.667q0 .083.084.166.083.084.166.084H10v1.625Zm8.938-3.479-1.209-1.188 1.75-1.75H7.917V9.375h6.166l-1.75-1.75 1.209-1.146 3.729 3.729Z"/></svg>
                </button>
              </div>
            </div>
            <div class="welcome-wrapper">
              <p class="welcome-text">Welcome</p>
            </div>
        `;
      return showFormContainer;
    }
}