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
      <input type="text" class="registration-name" placeholder="name">
      <input type="email" class="registration-email" placeholder="email">
      <input type="password" class="registration-password" placeholder="password">
      <button class="registration-submit">Submit</button>
    </form>
    <form action="#" class="sign-in hidden">
      <input type="email" class="login-email" placeholder="email">
      <input type="password" class="login-password" placeholder="password">
      <button class="login-submit">Submit</button>
    </form>
  `
  }
}