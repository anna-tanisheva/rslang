export class HeaderView {
    create() {
        const header = document.createElement("header");
        header.classList.add("header");
        header.innerHTML = `
    <div class="wrapper header-wrapper">
      <a href="index" class="logo-link">
        <h1 class="header-title">RS Lang</h1>
      </a>
      <nav class="nav">
        <ul class="nav-list">
          <li class="nav-item"><a href="index" class="nav-link">Главная</a></li>
          <li class="nav-item"><a href="textbook" class="nav-link nav-link_active">Учебник</a></li>
          <li class="nav-item"><a href="games" class="nav-link">Игры</a></li>
          <li class="nav-item"><a href="stats" class="nav-link">Статистика</a></li>
        </ul>
      </nav>
      <div class="hamburger" id="hamburger-1">
        <span class="top-line"></span>
        <span class="line"></span>
        <span class="bottom-line"></span>
      </div>
    </div>`;
        return header;
    }
}
