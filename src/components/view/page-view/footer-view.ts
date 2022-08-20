import "../../../assets/images/icons8-github-48.png";

export class Footer {
  
    create() {
      const footer = document.createElement('footer');
      footer.innerHTML = `
        <div class="footer-container">
          <div class="footer-gitHub">
            <img src="./images/icons8-github-48.png" alt="Logo GitHub" width="50">
            <p><a class="footer-logo-git" href="https://github.com/Nataliks">nataliks</a></p>
          </div>
          <div class="footer-gitHub">
            <img src="./images/icons8-github-48.png" alt="Logo GitHub" width="50">
            <p><a class="footer-logo-git" href="https://github.com/badikgit">badikgit</a></p>
          </div>
          <div class="footer-gitHub">
            <img src="./images/icons8-github-48.png" alt="Logo GitHub" width="50">
            <p><a class="footer-logo-git" href="https://github.com/anna-tanisheva">anna-tanisheva</a></p>
          </div>
          <div class="footer-year"><p>2022</p></div>
          <div class="footer-logo-rsschool">
            <a href="https://rs.school/js/">
              <img src="https://rs.school/images/rs_school_js.svg" alt="RSSchool Logo">
            </a>
          </div>      
        </div>`;
      return footer;
    }
  }