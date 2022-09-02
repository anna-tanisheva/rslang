import './login-form.scss';

export class Form {
    create() {
        const formContainer = document.createElement("div");

        formContainer.classList.add("form-container");
        formContainer.classList.add("hidden");
        formContainer.innerHTML = `
    <div class="show-form-wrapper">
      <button class="close-form-button">+</button>
      <button class="show-sign-in show-tab">Войти</button>
      <button class="show-sign-up show-tab active-form">Зарегистрироваться</button>
    </div>
    <form action="" class="sign-up form">
      <label class="label-name">
        Имя:
        <input type="text" class="registration-name" placeholder="Имя">
      </label>
      <label class="label-email">
        Электронная почта:
        <input type="text" class="registration-email" placeholder="Почта">
      </label>
      <label class="label-password">
        Пароль:
        <input type="password" class="registration-password" placeholder="Минимум 8 символов" autocomplete="off">
      </label>
      <label class="label-password-repeat">
      Еще раз:
      <input type="password" class="registration-password-repeat" placeholder="Подтвердить пароль" autocomplete="off">
    </label>
      <button class="registration-submit">Отправить</button>
    </form>
    <form action="" class="sign-in form hidden">
      <label class="label-email">
        Электронная почта:
        <input type="text" class="login-email" placeholder="Почта">
      </label>
      <label class="label-password">
      Пароль:
        <input type="password" class="login-password" placeholder="Пароль" autocomplete="off">
      </label>
      <button class="login-submit">Отправить</button>
    </form>
    <div class="validation-message">
      <p class="invalid-email hidden">Не валидный email, нужно использовать . и @, 2 знака после точки</p>
      <p class="invalid-password hidden">Длина пароля минимум 8 символов</p>
      <p class="invalid-name hidden">Как к вам можно обращатсья (заполните поле с именем)?</p>

      <p class="invalid-password-repeat hidden">Пароли не совпадают</p>
      <p class="incorrect-data"></p>
    </div>
  `;
        return formContainer;
    }
}