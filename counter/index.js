let num = 0;

const value = document.querySelector(".value");
const btns = document.querySelectorAll(".btn");

btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const styles = e.currentTarget.classList;
    if (styles.contains("decrease")) {
      value.innerText = num--;
    } else if (styles.contains("increase")) {
      value.innerText = num++;
    } else {
      value.innerText = num = 0;
    }

    if (num > 0) {
      value.style.color = "green";
    } else if (num < 0) {
      value.style.color = "red";
    } else {
      value.style.color = "black";
    }
  });
});
