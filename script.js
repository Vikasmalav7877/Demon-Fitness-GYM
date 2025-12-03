// script.js - minimal toggle + dropdown behavior, responsive breakpoint 840

// ------------------- NAV INITIALIZE FUNCTION -------------------
function initHeaderNav() {
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');
  const DROPDOWN_BREAKPOINT = 840; // matches CSS

  if (!hamburger || !mainNav) {
    // header abhi load nahi hua ya IDs match nahi kar rahe
    return;
  }

  const isDesktop = () => window.innerWidth > DROPDOWN_BREAKPOINT;

  function toggleMobileMenu() {
    const opened = mainNav.classList.toggle('open');
    hamburger.classList.toggle('is-open', opened);
    hamburger.setAttribute('aria-expanded', opened ? 'true' : 'false');
  }

  // HAMBURGER CLICK (sirf ek hi listener)
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.addEventListener('click', (e) => {
    console.log('Hamburger clicked'); // test ke liye, chaho to baad me hata dena
    if (window.innerWidth > DROPDOWN_BREAKPOINT) return; // do nothing on desktop
    e.stopPropagation();
    toggleMobileMenu();
  });

  // DROPDOWN TOGGLES (agar future me .drop-toggle add karoge)
  document.querySelectorAll('.has-sub .drop-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const dropdown = btn.parentElement.querySelector('.dropdown');
      if (!dropdown) return;

      if (isDesktop()) {
        // close others
        document.querySelectorAll('.dropdown.open').forEach(d => {
          if (d !== dropdown) d.classList.remove('open');
        });
        dropdown.classList.toggle('open');
        btn.setAttribute('aria-expanded', dropdown.classList.contains('open'));
      } else {
        // mobile accordion
        dropdown.classList.toggle('open');
        btn.setAttribute('aria-expanded', dropdown.classList.contains('open'));
      }
    });
  });

  // CLICK OUTSIDE BEHAVIOR
  document.addEventListener('click', (e) => {
    const clickedInsideNav = !!e.target.closest('#mainNav');
    const clickedHamburger = !!e.target.closest('#hamburger');

    if (!clickedInsideNav && !clickedHamburger) {
      // close mobile nav
      if (mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
      // close dropdowns
      document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
      document.querySelectorAll('.has-sub .drop-toggle')
        .forEach(b => b.setAttribute('aria-expanded', 'false'));
    }
  });

  // CLOSE WITH ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      mainNav.classList.remove('open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    }
  });

  // RESET ON RESIZE
  window.addEventListener('resize', () => {
    if (isDesktop()) {
      mainNav.classList.remove('open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
    }
  });
}

// ------------------- PAGE INIT -------------------
document.addEventListener('DOMContentLoaded', () => {
  // 1) Dynamic HEADER load
  const headerContainer = document.getElementById("header");
  if (headerContainer) {
    fetch("header.html")
      .then(res => res.text())
      .then(data => {
        headerContainer.innerHTML = data;
        // header inject hone ke BAAD nav init karo
        initHeaderNav();
      });
  } else {
    // Agar header dynamic nahi hai (direct HTML me diya hai), to yahan se init karo
    initHeaderNav();
  }

  // 2) Dynamic FOOTER load
  const footerContainer = document.getElementById("footer");
  if (footerContainer) {
    fetch("footer.html")
      .then(res => res.text())
      .then(data => {
        footerContainer.innerHTML = data;
      });
  }

  // 3) SLIDER code (safe guard ke sath)
  const slider = document.getElementById('teamSlider');
  const slides = slider ? slider.querySelectorAll('.trainer-card') : [];

  if (slider && slides.length > 0) {
    let index = 0;

    function slidesToShow() {
      if (window.innerWidth < 600) return 1;
      if (window.innerWidth < 992) return 2;
      return 3;
    }

    function autoSlide() {
      const slideWidth = slides[0].offsetWidth + 20; // 20px gap
      const visible = slidesToShow();

      index++;

      if (index > slides.length - visible) {
        index = 0;
      }

      slider.style.transform = `translateX(-${index * slideWidth}px)`;
    }

    setInterval(autoSlide, 4000);

    window.addEventListener('resize', () => {
      index = 0;
      slider.style.transform = 'translateX(0px)';
    });
  }
});
