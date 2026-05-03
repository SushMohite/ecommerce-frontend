const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});
document.querySelector(".cta-btn").addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector("#products").scrollIntoView({
        behavior: "smooth"
    });
});