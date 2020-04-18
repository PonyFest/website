'use strict';

document.addEventListener('DOMContentLoaded', function() {
    const button = document.querySelector(".button-menu");
    const header = button.parentElement.parentElement.parentElement;
    button.addEventListener("click", () => {
        if (header.classList.contains("closed")) {
            header.className = "topbar open";
            button.innerHTML = "&times;";

        } else if (header.classList.contains("open")) {
            header.className = "topbar closed";
            button.innerHTML = "Menu";
        }
    });
});