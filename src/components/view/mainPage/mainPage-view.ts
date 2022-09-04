import "../../../assets/images/kisspng-st-pauls-cathedral-skyline-illustration-london-png-transparent-image-5a7a373ad48409.7409065615179589708705.png";
import "../../../assets/images/icons8-книга-100.png";
import "../../../assets/images/icons8-комбинированный-график-100.png";
import "../../../assets/images/icons8-cards-64.png";
import "../../../assets/images/icons8-динамик-100.png";
import "../../../assets/images/team-lead.jpg";
import "../../../assets/images/kisspng-programmer.png";
import "../../../assets/images/pngwing.com.png";
import {createElementWithAttributes} from "../utils";

export class MainPageView {
    create() {
        const mainPage = createElementWithAttributes("section", {
            class: "main-page",
        });
        mainPage.innerHTML = `
      <section class="section-start-screen">
              <div class="start-screen-content">
                <p class="content-heading">"Границы моего языка - это границы моего мира"</p>
                <p class="content-subheading">- Людвиг Витгенштейн</p>
                <p class="content-heading">Стирай границы вместе c <span>RS Lang!</span></p>          
              </div>
              <div class="start-screen-buttons">
                <button class="sign-in-button button-primary" type="button">Войти</button>
                <button class="registration-button button-primary" type="button">Регистрация</button>
              </div>
              <img class="start-screen-img" src="./images/kisspng-st-pauls-cathedral-skyline-illustration-london-png-transparent-image-5a7a373ad48409.7409065615179589708705.png" alt="London">
            </section> 
          </div>
          
          <section class="section-benefits">
            <div class="benefits-wrapper">
              <h3 class="benefits-heading">Мы предлагаем</h3>
              <p class="benefits-subheading">Курс с игровым подходом, которое превратит изучение аглийского языка в 
                веселое и увлекательное мероприятие. Рассчитан для пользователей с любым уровнем знаний - от А0 до С1. Здесь вы пополните
                свой словарный запас, найдете тренировки для закрепления пройденного материала и разовьете восприятие языка на слух</p>
              <div class="benefits-container">
                
                <div class="benefits-description benefits-tutorial">
                  <div class="benefits-img">
                    <img src="./images/icons8-книга-100.png" alt="tutorial">
                  </div>            
                  <h3 class="benefits-description-title">Учебник</h3>
                  <p class="benefit-description-item">Более 3500 самых употребляемых слов и примеров их использования</p>                
                </div>
                <div class="benefits-description benefits-stats">
                  <div class="benefits-img">
                    <img src="./images/icons8-комбинированный-график-100.png" alt="graphic">
                  </div> 
                  <h3 class="benefits-description-title">Статистика</h3>
                  <p class="benefit-description-item">Отслеживание своего прогресса в обучении</p>                
                </div>
                <div class="benefits-description benefits-sprint">
                  <div class="benefits-img">
                    <img src="./images/icons8-cards-64.png" alt="cards">
                  </div>
                  <h3 class="benefits-description-title">Спринт</h3>
                  <p class="benefit-description-item">Тренировка скорости перевода с английского языка на русский </p>                
                </div>
                <div class="benefits-description benefits-audio-challenge">
                  <div class="benefits-img">
                    <img src="./images/icons8-динамик-100.png" alt="dynamic">
                  </div>
                  <h3 class="benefits-description-title">Аудиовызов</h3>
                  <p class="benefit-description-item">Тренировка понимания речи на слух</p>                
                </div>
              </div>
            </div>
          </section>
         
          <section class="section-our-team" id ="team">
            <div class="our-team-wrapper">          
              <h3 class="our-team-heading">Наша команда</h3>
              <div class="our-team-container">
      
                  <div class="our-team-card">
                    <div class="our-team-img" >
                      <img src="./images/team-lead.jpg" alt="programmer">
                    </div>
                    <div class="our-team-info">
                      <h3>Анна Танишева</h3>
                      <p>Тимлид</p>
                      <ul>Вклад:
                        <li>Разработка архитектуры проекта</li>
                        <li>Авторизация</li>
                        <li>Краткосрочная и долгосрочная статистика</li>
                        <li>Игра "Аудиовызов"</li>
                      </ul>  
                    </div>
                  </div>
                  <div class="our-team-card">
                    <div class="our-team-img" >
                      <img src="./images/kisspng-programmer.png" width="200" alt="programmer">
                    </div>
                    <div class="our-team-info">
                      <h3>Станислав Яроцкий</h3>
                      <ul>Вклад:
                        <li>Электронный учебник</li>
                        <li>Поиск и исправление багов приложения</li>
                        <li>Трансформация данных, получаемых с сервера, для дальнейшей работы</li>
                      </ul>  
                    </div>
                  </div> 
                  <div class="our-team-card">
                    <div class="our-team-img" >
                      <img src="./images/pngwing.com.png" alt="programmer">
                    </div>
                    <div class="our-team-info">
                      <h3>Наталия Ланкевич</h3>
                      <ul>Вклад:
                        <li>Главная страница</li>
                        <li>Игра "Спринт"</li>
                      </ul>  
                    </div>
                  </div>

              </div>
            </div>
          </section>`;
        return mainPage;
    }
}
