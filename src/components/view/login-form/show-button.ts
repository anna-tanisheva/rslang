import './login-form.scss';

export class ShowFormPanel {
  template: string;

  constructor() {
    this.template = `
      <button class="show-form"></button>
      <div class="log-out-wrapper">
        <button class="logout-submit" disabled>Log Out</button>
      </div>
      <div class="welcome-wrapper">
        <p class="welcome-text">Welcome</p>
      </div>
  `
  }
}