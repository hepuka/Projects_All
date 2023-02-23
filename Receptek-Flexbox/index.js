import content from "./content.js";

const parent = document.querySelector(".recipes");

window.addEventListener("load", () => {
  parent.innerHTML = content
    .map((item) => {
      return `
    <div class="recipe-box">
      <img src=${item.img} alt="" />
      <h2>${item.title}</h2>
      <p>${item.body}</p>
    </div>
        `;
    })
    .join("");
});
