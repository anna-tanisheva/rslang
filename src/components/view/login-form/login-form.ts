import './login-form.scss';

export class Form {
  template: string;

  constructor() {
    this.template = `
    <div class="show-form-wrapper">
      <button class="show-sign-in">Sign-in</button>
      <button class="show-sign-up active-form">Sign-up</button>
    </div>
    <form action="#" class="sign-up">
      <input type="text" class="registration-name">
      <input type="email" class="registration-email">
      <input type="password" class="registration-password">
      <button class="registration-submit">Submit</button>
    </form>
    <form action="#" class="sign-in hidden">
      <input type="email" class="login-email">
      <input type="password" class="login-password">
      <button class="login-submit">Submit</button>
    </form>
    <div class="log-out-wrapper">
      <button class="logout-submit">Log Out</button>
    </div>
  `
  }
}