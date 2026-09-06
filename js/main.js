
const themeButton = document.querySelector('.theme-toggle');
const colourPreference = window.matchMedia('(prefers-color-scheme: dark)');
let savedTheme = null;

try {
  savedTheme = localStorage.getItem('nexaflow-theme');
} catch {
  savedTheme = null;
}

function setTheme(theme) {
  const darkMode = theme === 'dark';
  document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
  if (themeButton) themeButton.setAttribute('aria-pressed', String(darkMode));
}

setTheme(savedTheme || (colourPreference.matches ? 'dark' : 'light'));

if (themeButton) {
  themeButton.hidden = false;

  themeButton.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    savedTheme = nextTheme;
    try {
      localStorage.setItem('nexaflow-theme', nextTheme);
    } catch {
      // The theme still works if browser is not available
    }
  });
}

colourPreference.addEventListener('change', (event) => {
  if (!savedTheme) setTheme(event.matches ? 'dark' : 'light');
});

const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.main-nav');
const desktop = window.matchMedia('(min-width: 700px)');

function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = 'Menu';
}

if (menuButton && navigation) {
  menuButton.hidden = false;
  navigation.classList.add('menu-ready');

  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.textContent = isOpen ? 'Close menu' : 'Menu';
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
      closeMenu();
      menuButton.focus();
    }
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  desktop.addEventListener('change', () => {
    const focusInNav = navigation.contains(document.activeElement);
    const focusOnButton = document.activeElement === menuButton;
    closeMenu();
    if (!desktop.matches && focusInNav) menuButton.focus();
    if (desktop.matches && focusOnButton) navigation.querySelector('a').focus();
  });
}


const faqButtons = document.querySelectorAll('.faq-question');

faqButtons.forEach((button) => {
  const answer = document.getElementById(button.getAttribute('aria-controls'));
  const icon = button.querySelector('span');
  answer.hidden = true;
  button.setAttribute('aria-expanded', 'false');
  icon.textContent = '+';

  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isOpen));
    answer.hidden = isOpen;
    icon.textContent = isOpen ? '+' : '−';
  });
});


const form = document.getElementById('contact-form');

if (form) {
  const fields = [...form.querySelectorAll('input, textarea')];
  const status = document.getElementById('form-status');
  const requiredMessages = {
    name: 'Please enter your name.',
    email: 'Please enter your email address.',
    message: 'Please tell us a little about the task.'
  };

  form.noValidate = true;
  form.querySelector('button[type="submit"]').disabled = false;

  function validateField(field) {
    let error = '';
    if (!field.value.trim()) {
      error = requiredMessages[field.id];
    } else if (field.type === 'email' && field.validity.typeMismatch) {
      error = 'Enter an email address such as alex@example.com.';
    }
    document.getElementById(`${field.id}-error`).textContent = error;
    field.setAttribute('aria-invalid', String(Boolean(error)));
    return error === '';
  }

  fields.forEach((field) => {
    field.addEventListener('input', () => {
      status.textContent = '';
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let firstInvalid = null;

    fields.forEach((field) => {
      field.value = field.value.trim();
      if (!validateField(field) && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      status.textContent = 'Please check the marked fields and try again.';
      firstInvalid.focus();
      return;
    }

    status.textContent = 'Your enquiry passes the checks, but nothing has been sent. You can still edit your details above.';
  });
}
