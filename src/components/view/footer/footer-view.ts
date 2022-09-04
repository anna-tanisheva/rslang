import "../../../assets/images/icons8-github-48.png";

export class FooterView {
    create() {
        const footer = document.createElement("footer");
        footer.classList.add("footer");
        footer.innerHTML = `
        <div class="footer-container">
          <div class="footer-gitHub">
            <a class="footer-logo-git" href="https://github.com/Nataliks"><img src="./images/icons8-github-48.png" alt="Logo GitHub" width="50">nataliks</a>
          </div>
          <div class="footer-gitHub">            
            <a class="footer-logo-git" href="https://github.com/badikgit"><img src="./images/icons8-github-48.png" alt="Logo GitHub" width="50">badikgit</a>
          </div>
          <div class="footer-gitHub">
            <a class="footer-logo-git" href="https://github.com/anna-tanisheva"><img src="./images/icons8-github-48.png" alt="Logo GitHub" width="50">anna-tanisheva</a>
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
