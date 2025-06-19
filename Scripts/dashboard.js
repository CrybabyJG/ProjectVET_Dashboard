//Controlador de colapsar y expandir

const sidebarToggleBtns = document.querySelectorAll(".sidebar__toggle, .nav__toggle");
const sidebar = document.querySelector(".sidebar");

sidebarToggleBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    sidebar.classList.toggle("sidebar--collapsed");

    // Cerrar submenús si se colapsa
    if (sidebar.classList.contains("sidebar--collapsed")) {
      document.querySelectorAll(".menu__item--open").forEach(item => {
        item.classList.remove("menu__item--open");
      });
    }
  });
});

// Controlador de submenús
const submenuToggles = document.querySelectorAll('.menu__item--has-submenu > .menu__link');

submenuToggles.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const parentItem = link.closest('.menu__item');

    if (sidebar.classList.contains('sidebar--collapsed')) {
      sidebar.classList.remove('sidebar--collapsed');
      setTimeout(() => {
        parentItem.classList.add('menu__item--open');
      }, 400);
      return;
    }

    document.querySelectorAll('.menu__item--open').forEach(item => {
      if (item !== parentItem) item.classList.remove('menu__item--open');
    });

    parentItem.classList.toggle('menu__item--open');
  });
});
