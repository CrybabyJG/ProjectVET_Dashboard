
// Abrir/cerrar submenús
const submenuToggles = document.querySelectorAll('.menu__item--has-submenu > .menu__link');
submenuToggles.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const parentItem = link.closest('.menu__item');
    

    // Si el sidebar está colapsado, primero expandirlo
    if (sidebar.classList.contains('sidebar--collapsed')) {
      sidebar.classList.remove('sidebar--collapsed');

      // Esperar la animación antes de abrir submenú
      setTimeout(() => {
        parentItem.classList.add('menu__item--open');
      }, 400); // este tiempo debe coincidir con tu `transition: width 0.4s` en CSS

      return; // evitar que se ejecute el resto por ahora
    }

    // Cierra otros submenús
    document.querySelectorAll('.menu__item--open').forEach(item => {
      if (item !== parentItem) item.classList.remove('menu__item--open');
    });

    parentItem.classList.toggle('menu__item--open');
  });
});


// Variables principales
const sidebarToggleBtns = document.querySelectorAll(".sidebar__toggle, .nav__toggle");
const sidebar = document.querySelector(".sidebar");
const searchForm = document.querySelector(".sidebar__search-form");
const themeToggleBtn = document.querySelector(".theme-toggle");
const themeIcon = themeToggleBtn.querySelector(".theme-toggle__icon");

// Actualiza el ícono de tema según estado
const updateThemeIcon = () => {
  const isDark = document.body.classList.contains("dark-theme");
  themeIcon.textContent = sidebar.classList.contains("sidebar--collapsed")
    ? (isDark ? "light_mode" : "dark_mode")
    : "dark_mode";
};

// Inicializar tema oscuro si es necesario
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const useDark = savedTheme === "dark" || (!savedTheme && prefersDark);
document.body.classList.toggle("dark-theme", useDark);
updateThemeIcon();

// Cambiar tema manualmente
themeToggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeIcon();
});

// Colapsar/expandir sidebar
sidebarToggleBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const isCollapsing = !sidebar.classList.contains("sidebar--collapsed");
    sidebar.classList.toggle("sidebar--collapsed");
    updateThemeIcon();

    // Cerrar submenús si se colapsa
    if (isCollapsing) {
      document.querySelectorAll(".menu__item--open").forEach(item => {
        item.classList.remove("menu__item--open");
      });
    }
  });
});

// Expandir sidebar al hacer clic en el buscador
searchForm.addEventListener("click", () => {
  if (sidebar.classList.contains("sidebar--collapsed")) {
    sidebar.classList.remove("sidebar--collapsed");
    searchForm.querySelector("input").focus();
  }
});

// Asegurar sidebar expandido en pantallas grandes
if (window.innerWidth > 768) {
  sidebar.classList.remove("sidebar--collapsed");
}
