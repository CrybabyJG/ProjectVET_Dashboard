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
