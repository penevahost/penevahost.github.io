document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const menuLinks = document.querySelectorAll(".menu-link");

    menuToggle.addEventListener("click", function () {
        mobileMenu.classList.toggle("active");
        menuToggle.classList.toggle("open");
    });

    menuLinks.forEach(link => {
        link.addEventListener("click", function () {
            mobileMenu.classList.remove("active");
            menuToggle.classList.remove("open");
        })
    })
});