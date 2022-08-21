import './login-form.scss';

export class Form {
  template: string;

  constructor() {
    this.template = `
    <div class="show-form-wrapper">
      <button class="show-sign-in show-tab">Sign-in</button>
      <button class="show-sign-up show-tab active-form">Sign-up</button>
    </div>
    <form action="#" class="sign-up form">
      <label class="label-name">
        Name:
        <input type="text" class="registration-name" placeholder="name">
      </label>
      <label class="label-email">
        E-mail:
        <input type="text" class="registration-email" placeholder="email">
      </label>
      <label class="label-password">
        Password:
        <input type="password" class="registration-password" placeholder="password">
      </label>
      <button class="registration-submit">Submit</button>
    </form>
    <form action="#" class="sign-in form hidden">
      <label class="label-email">
        E-mail:
        <input type="text" class="login-email" placeholder="email">
      </label>
      <label class="label-password">
        Password:
        <input type="password" class="login-password" placeholder="password">
      </label>
      <button class="login-submit">Submit</button>
    </form>
  `
  }
}