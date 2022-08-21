import './login-form.scss';

export class Form {
    create() {
        const formContainer = document.createElement("div");

        formContainer.classList.add("form-container");
        formContainer.classList.add("hidden");
        formContainer.innerHTML = `
    <div class="show-form-wrapper">
      <button class="show-sign-in show-tab">Sign-in</button>
      <button class="show-sign-up show-tab active-form">Sign-up</button>
    </div>
    <form action="" class="sign-up form">
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
    <form action="" class="sign-in form hidden">
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
    <div class="validation-message">
      <p class="invalid-email hidden">You should use valid email (@ and . are necessary)</p>
      <p class="invalid-password hidden">Password length must be at least 8 symbols</p>
      <p class="invalid-name hidden">Field name shouldn't be empty</p>
      <p class="incorrect-data"></p>
    </div>
  `;
        return formContainer;
    }
}