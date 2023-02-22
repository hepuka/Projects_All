import { movieList, seatsDetails } from "./db.js";

const movieSelected = document.getElementById("movie");
const seatsContainer = document.querySelector(".cinema-container .seats");
const resetButton = document.querySelector(".price-reset-container .reset");
const submitButton = document.querySelector(
  ".price-reset-container .occupied_submit"
);
const counter = document.getElementById("counter");
const price = document.getElementById("price");

let ticketPrice = null;
let allSeats = null;

function updateCounterAndPrice() {
  const selectedSeats = document.querySelectorAll(
    ".seats .available-seat.selected"
  );

  counter.innerText = selectedSeats.length;
  price.innerText = selectedSeats.length * ticketPrice;
}

const updateSelectedSeatsList = () => {
  const selectedSeats = document.querySelectorAll(
    ".seats .available-seat.selected"
  );

  /*NodeList-et alakítom át tömbbé a spead operátorral*/
  const selectedSeatsIndexes = [...selectedSeats].map((seat) =>
    /*berakom az allseats tömbbe a kiválasztott ülések számát*/
    [...allSeats].indexOf(seat)
  );

  /*berakom a tömböt a kiválasztott ülések számával*/
  localStorage.setItem(
    "selectedSeatsIndexes",
    JSON.stringify(selectedSeatsIndexes)
  );
};

/*legördülőmenü feltöltése adatbázisból*/
const populateMovieList = () => {
  movieList.movies.map((item) => {
    const option = document.createElement("option");

    /*az option elem value atrribútumának beállítjuk az árat*/
    option.setAttribute("value", item.price);

    option.innerText = `${item.title} (${item.price} ${movieList.currency})`;

    /*hozzáaadjuk az option-t a szülőhöz*/
    movieSelected.appendChild(option);
  });

  ticketPrice = movieSelected.value;
};

const populateSeats = () => {
  /*megszámolja az ülések számát és eddig megy a for ciklus*/
  const seatsNumber = seatsDetails.rows * seatsDetails.columns;

  for (let i = 0; i < seatsNumber; i++) {
    const seat = document.createElement("div");

    seat.classList.add("available-seat");

    /*ellenőrzi, hogy az akruális i index benne van-e a db-ben magadott occupied arrayben*/
    if (seatsDetails.occupied.includes(i)) {
      seat.classList.add("occupied");
    }

    seatsContainer.appendChild(seat);
  }

  /*az összes ülést berakjuk ebbe a változóba*/
  allSeats = document.querySelectorAll(".seats .available-seat");
};

const populateFromLocalStorage = () => {
  /*kiolvassuk az értékeket a localStorage-ból*/
  const selectedSeatsIndexes = JSON.parse(
    localStorage.getItem("selectedSeatsIndexes")
  );

  if (selectedSeatsIndexes !== null && selectedSeatsIndexes.length > 0) {
    allSeats.forEach((seat, index) => {
      if (selectedSeatsIndexes.indexOf(index) > -1) {
        seat.classList.add("selected");
      }
    });
  }

  const selectedMovieIndex = localStorage.getItem("selectedMovieIndex");

  if (selectedMovieIndex !== null) {
    movieSelected.selectedIndex = selectedMovieIndex;
    ticketPrice = movieSelected.value;
  }

  updateCounterAndPrice();
};

const populateUI = () => {
  populateMovieList();
  populateSeats();

  populateFromLocalStorage();
};

populateUI();

movieSelected.addEventListener("change", (e) => {
  ticketPrice = e.target.value;
  localStorage.setItem("selectedMovieIndex", movieSelected.selectedIndex);
  updateCounterAndPrice();
});

seatsContainer.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("available-seat") &&
    !e.target.classList.contains("occupied")
  ) {
    e.target.classList.toggle("selected");
    updateCounterAndPrice();
    updateSelectedSeatsList();
  }
});

resetButton.addEventListener("click", () => {
  document
    .querySelectorAll(".seats .available-seat.selected")
    .forEach((seat) => seat.classList.remove("selected"));

  counter.innerText = 0;
  price.innerText = 0;

  movieSelected.selectedIndex = 0;
  ticketPrice = movieSelected.value;

  localStorage.clear();
});

submitButton.addEventListener("click", () => {
  const selectedSeats = document.querySelectorAll(
    ".seats .available-seat.selected"
  );

  console.log(selectedSeats);

  [...selectedSeats].map((item) => {
    item.classList.toggle("occupied");
  });

  counter.innerText = 0;
  price.innerText = 0;

  movieSelected.selectedIndex = 0;
  ticketPrice = movieSelected.value;

  localStorage.clear();
});
