// script.js - minimal toggle + dropdown behavior, responsive breakpoint 800
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');
  const DROPDOWN_BREAKPOINT = 840; // matches CSS

  const isDesktop = () => window.innerWidth > DROPDOWN_BREAKPOINT;

  function toggleMobileMenu() {
    if (!hamburger || !mainNav) return;
    const opened = mainNav.classList.toggle('open');
    hamburger.classList.toggle('is-open', opened);
    hamburger.setAttribute('aria-expanded', opened ? 'true' : 'false');
  }

  if (hamburger) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.addEventListener('click', (e) => {
      if (window.innerWidth > DROPDOWN_BREAKPOINT) return; // do nothing on desktop
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // dropdown toggles
  document.querySelectorAll('.has-sub .drop-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const dropdown = btn.parentElement.querySelector('.dropdown');
      if (!dropdown) return;
      if (isDesktop()) {
        // close others
        document.querySelectorAll('.dropdown.open').forEach(d => { if (d !== dropdown) d.classList.remove('open'); });
        dropdown.classList.toggle('open');
        btn.setAttribute('aria-expanded', dropdown.classList.contains('open'));
      } else {
        // mobile accordion
        dropdown.classList.toggle('open');
        btn.setAttribute('aria-expanded', dropdown.classList.contains('open'));
      }
    });
  });

  // click outside behavior
  document.addEventListener('click', (e) => {
    const clickedInsideNav = !!e.target.closest('#mainNav');
    const clickedHamburger = !!e.target.closest('#hamburger');
    if (!clickedInsideNav && !clickedHamburger) {
      // close mobile nav
      if (mainNav && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
      // close dropdowns
      document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
      document.querySelectorAll('.has-sub .drop-toggle').forEach(b => b.setAttribute('aria-expanded', 'false'));
    }
  });

  // close with Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      if (mainNav) mainNav.classList.remove('open');
      if (hamburger) { hamburger.classList.remove('is-open'); hamburger.setAttribute('aria-expanded', 'false'); }
      document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    }
  });

  // reset on resize
  window.addEventListener('resize', () => {
    if (isDesktop()) {
      if (mainNav) mainNav.classList.remove('open');
      if (hamburger) { hamburger.classList.remove('is-open'); hamburger.setAttribute('aria-expanded', 'false'); }
      document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
    }
  });
});

//dynamic header and footer
// Load Header
fetch("header.html")
.then(res => res.text())
.then(data => {
  document.getElementById("header").innerHTML = data;
});

// Load Footer
fetch("footer.html")
.then(res => res.text())
.then(data => {
  document.getElementById("footer").innerHTML = data;
});



//slider

const slider = document.getElementById('teamSlider');
const slides = document.querySelectorAll('.trainer-card');

let index = 0;

function slidesToShow(){
  if(window.innerWidth < 600) return 1;
  if(window.innerWidth < 992) return 2;
  return 3;
}

function autoSlide(){
  const slideWidth = slides[0].offsetWidth + 20;
  const visible = slidesToShow();

  index++;

  if(index > slides.length - visible){
    index = 0;
  }

  slider.style.transform =
    `translateX(-${index * slideWidth}px)`;
}

setInterval(autoSlide,4000);

window.addEventListener('resize',()=> {
  index = 0;
  slider.style.transform = 'translateX(0px)';
});
