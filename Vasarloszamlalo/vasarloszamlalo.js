let terulet = prompt("Add meg a bolt alapterületét (m2-ben)!");

let max_vásárló = parseInt(terulet / 10);

document.getElementById(
  "max"
).innerText = `A boltban összesen ${max_vásárló} vásárló tartózkodhat`;

let szam = document.getElementById("szam");
let maximum = document.getElementById("ossz");

let szamlalo = 0;
let maxszam = 0;

function novel() {
  50;

  szamlalo++;
  szam.textContent = szamlalo;

  szam.textContent == max_vásárló
    ? (document.getElementById("belep").disabled = true)
    : (document.getElementById("kilep").disabled = false);

  maxszam++;
  maximum.textContent = maxszam;
}

function csokkent() {
  szamlalo--;
  szam.textContent = szamlalo;

  szamlalo == 0
    ? (document.getElementById("kilep").disabled = true)
    : (document.getElementById("belep").disabled = false);
}

function reset() {
  szamlalo = 0;
  maxszam = 0;
  document.getElementById("szam").innerHTML = 0;
  document.getElementById("ossz").innerHTML = 0;
  document.getElementById("belep").disabled = false;
  document.getElementById("kilep").disabled = false;
}
