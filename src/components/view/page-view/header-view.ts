export class Header {
  
  create() {
    const header = document.createElement('header');
    header.classList.add('header');
    header.innerHTML = `
    <div class="wrapper header-wrapper">      
      <h1 class="header-title">RS Lang</h1> 
      <nav class="nav">
        <ul class="nav-list">
          <li class="nav-item"><a href="#tutorial" class="nav-link nav-link_active">Учебник</a></li>
          <li class="nav-item"><a href="#games" class="nav-link">Игры</a></li>
          <li class="nav-item"><a href="#stats" class="nav-link">Статистика</a></li>
          <li class="nav-item"><a href="#team" class="nav-link">Команда</a></li>
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