//MODUL PROGRAMTERVEZÉSI MINTA ALAPJÁN

let koltsegvetesVezerlo = (function () {
  //privát rész

  //az itt deklarált változók fv-ek privátok
  //kívülről nem lehet hozzáférni

  //függvénykonstruktor az objektumpédányok létrehozására
  class kiadas {
    constructor(id, leiras, ertek) {
      this.id = id;
      this.leiras = leiras;
      this.ertek = ertek;
      this.szazalek = -1;
    }

    szazalekSzamitas(osszBevetel) {
      if (osszBevetel > 0) {
        this.szazalek = Math.round((this.ertek / osszBevetel) * 100);
      } else {
        this.szazalek = -1;
      }
    }

    getSzazalek() {
      return this.szazalek;
    }
  }

  class bevetel {
    constructor(id, leiras, ertek) {
      this.id = id;
      this.leiras = leiras;
      this.ertek = ertek;
    }
  }

  let vegosszegSzamolas = function (tipus) {
    let osszeg = 0;

    adatok.tetelek[tipus].forEach(function (akt) {
      osszeg += akt.ertek;
    });

    adatok.osszegek[tipus] = osszeg;
  };

  /*bev példány létrehozása
  - a new kulcsszóval hozok létre új üres objektumot, ezután hívom meg nevével a
  - konstruktort és adom át neki a paramétereket
    var bev = new bevetel(1, "munkabér", 120000);*/

  //a tételek tárolása objektumban adatok néven
  //tömb a kiadások és a bevételi objektumok tárolására

  let adatok = {
    tetelek: {
      bev: [],
      kia: [],
    },
    osszegek: {
      bev: 0,
      kia: 0,
    },
    koltsegvetes: 0,
    szazalek: -1,
  };

  //a koltesvetesVezerlo fv a return utasítással visszaad egy
  //olyan objektumot, amiben van egy olyan függvény ami
  //hozzáfér a privát elemekhez. a híváskor ezt a publikus
  //fv-t kell meghívni.
  //Closure: egy belső függvény (itt areturn utasításban) mindig képes
  //hozzáférni at őt tartalmazó külső fv-n paramétereihez éés változóihoz
  //még azt követően is, hogy a külső fv(koltesvetesVezerlo) befejezte
  //a futását

  //publikus rész
  return {
    tetelHozzaad: function (tipus, leiras, ertek) {
      //amikor egy új tételt adunk hozzá és tároljuk

      let ujTetel,
        ID = 0;

      //ID létrehozása
      if (adatok.tetelek[tipus].length > 0) {
        ID = adatok.tetelek[tipus][adatok.tetelek[tipus].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //új kiadás vagy bevétel létrehozása
      if (tipus === "bev") {
        ujTetel = new bevetel(ID, leiras, ertek);
      } else if (tipus === "kia") {
        ujTetel = new kiadas(ID, leiras, ertek);
      }

      //új tétel hozzáadása az adatszerekezethez
      adatok.tetelek[tipus].push(ujTetel);

      if (tipus === "bev") {
        localStorage.setItem("bev", JSON.stringify(adatok.tetelek[tipus]));
      } else if (tipus === "kia") {
        localStorage.setItem("kia", JSON.stringify(adatok.tetelek[tipus]));
      }

      //új tétel visszaadása
      return ujTetel;
    },

    tetelTorol: function (tipus, id) {
      //map egy teljesen új tömbbel tér vissza
      let idTomb, index;

      idTomb = adatok.tetelek[tipus].map(function (aktualis) {
        return aktualis.id;
      });

      index = idTomb.indexOf(id);

      if (index !== -1) {
        adatok.tetelek[tipus].splice(index, 1);
      }
    },

    koltsegvetesSzamolas: function () {
      //összbevétel-összkiadás számolása
      vegosszegSzamolas("bev");
      vegosszegSzamolas("kia");

      //költségvetés kiszámolása
      adatok.koltsegvetes = adatok.osszegek.bev - adatok.osszegek.kia;

      //százalék számolása

      if (adatok.osszegek.bev > 0) {
        adatok.szazalek = Math.round(
          (adatok.osszegek.kia / adatok.osszegek.bev) * 100
        );
      } else {
        adatok.szazalek = -1;
      }
    },

    szazalekokSzamolasa: function () {
      adatok.tetelek.kia.forEach(function (aktualisElem) {
        aktualisElem.szazalekSzamitas(adatok.osszegek.bev);
      });
    },

    szazalekokLekerdezese: function () {
      let kiadasSzazalekok = adatok.tetelek.kia.map(function (aktualisElem) {
        return aktualisElem.getSzazalek();
      });

      return kiadasSzazalekok;
    },

    getKoltsegvetes: function () {
      return {
        koltsegvetes: adatok.koltsegvetes,
        osszBevetel: adatok.osszegek.bev,
        osszKiadas: adatok.osszegek.kia,
        szazalek: adatok.szazalek,
      };
    },

    teszt: function () {
      console.log(adatok);
    },
  };
})(); //azonnal meghívódó fv-n

let feluletVezerlo = (function () {
  //privát rész
  let DOMelemek = {
    inputTipus: ".hozzaad__tipus",
    inputLeiras: ".hozzaad__leiras",
    inputErtek: ".hozzaad__ertek",
    inputGomb: ".hozzaad__gomb",
    bevetelTarolo: ".bevetelek__lista",
    kiadasTarolo: ".kiadasok__lista",
    koltsegvetesCimke: ".koltsegvetes__ertek",
    osszbevetelCimke: ".koltsegvetes__bevetelek--ertek",
    osszkiadasCimke: ".koltsegvetes__kiadasok--ertek",
    szazalekCimke: ".koltsegvetes__kiadasok--szazalek",
    kontener: ".kontener",
    szazalekokCimke: ".tetel__szazalek",
    datumCimke: ".koltsegvetes__cim--honap",
  };

  let szamFormazo = function (szam, tipus) {
    let elojel;

    szam = Math.abs(szam);

    szam = szam.toLocaleString();

    tipus === "kia" ? (elojel = "-") : (elojel = "");

    szam = elojel + " " + szam;

    return szam;
  };

  let nodeListForEach = function (lista, callback) {
    for (let i = 0; i < lista.length; i++) {
      callback(lista[i], i);
    }
  };

  //publikus rész
  return {
    getInput: function () {
      //egy objektumot adunk vissza ami tartalmazza a 3 értéket, kiolvassa a megadott 3 értéket

      return {
        tipus: document.querySelector(DOMelemek.inputTipus).value,
        leiras: document.querySelector(DOMelemek.inputLeiras).value,
        ertek: parseInt(document.querySelector(DOMelemek.inputErtek).value),
      };
    },

    //DOM elemeket is visszaadjuk, hogy publikusak legyenek
    getDOMelemek: function () {
      return DOMelemek;
    },

    tetelMegjelenites: function (obj, tipus) {
      let html, ujHTML, elem;
      //HTML váz megírása
      //változók helyére placeholderek (%id%, %leiras%, %ertek%) elhelyezése, ahova az adatok kerülnek

      if (tipus === "bev") {
        elem = DOMelemek.bevetelTarolo;

        html =
          '<div class="tetel clearfix" id="bev-%id%"><div class="tetel__leiras">%leiras%</div><div class="right clearfix"><div class="tetel__ertek">%ertek% Ft</div><div class="tetel__torol"><button class="tetel__torol--gomb"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (tipus === "kia") {
        elem = DOMelemek.kiadasTarolo;
        html =
          '<div class="tetel clearfix" id="kia-%id%"><div class="tetel__leiras">%leiras%</div><div class="right clearfix"><div class="tetel__ertek">%ertek% Ft</div><div class="tetel__szazalek">21%</div><div class="tetel__torol"><button class="tetel__torol--gomb"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //HTML feltöltése adatokkal, placeholderek helyére az értékek behelyettesítése

      ujHTML = html.replace("%id%", obj.id);
      ujHTML = ujHTML.replace("%leiras%", obj.leiras);
      ujHTML = ujHTML.replace("%ertek%", szamFormazo(obj.ertek, tipus));

      //HTML megjelenítése, hozzáadása a DOM-hoz
      //https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
      //insertAdjacentHTML(position, text);

      // position
      //   A string representing the position relative to the element. Must be one of the following strings:

      //   "beforebegin"
      //   Before the element. Only valid if the element is in the DOM tree and has a parent element.

      //   "afterbegin"
      //   Just inside the element, before its first child.

      //   "beforeend"
      //   Just inside the element, after its last child.

      //   "afterend"
      //   After the element. Only valid if the element is in the DOM tree and has a parent element.

      //   text
      //   The string to be parsed as HTML or XML and inserted into the tree.

      document.querySelector(elem).insertAdjacentHTML("beforeend", ujHTML);
    },

    tetelTorles: function (tetelID) {
      let elem = document.getElementById(tetelID);
      elem.parentNode.removeChild(elem);
    },

    urlapTorles: function () {
      let mezok = document.querySelectorAll(
        DOMelemek.inputLeiras + "," + DOMelemek.inputErtek
      );

      //nodelistát ad vissza a queryselectorAll, ezért ezt a listát tömbbé kell alakítani

      let mezokTomb = Array.prototype.slice.call(mezok);

      mezokTomb.forEach(function (currentValue, index, array) {
        currentValue.value = "";
      });

      mezokTomb[0].focus();
    },

    koltsegvetesMegjelenites: function (obj) {
      let tipus;

      obj.koltsegVetes > 0 ? (tipus = "bev") : "kia";

      document.querySelector(
        DOMelemek.koltsegvetesCimke
      ).textContent = `${szamFormazo(obj.koltsegvetes, tipus)} Ft`;
      document.querySelector(
        DOMelemek.osszbevetelCimke
      ).textContent = `${szamFormazo(obj.osszBevetel, "bev")} Ft`;
      document.querySelector(
        DOMelemek.osszkiadasCimke
      ).textContent = `${szamFormazo(obj.osszKiadas, "kia")} Ft`;

      if (obj.szazalek > 0) {
        document.querySelector(DOMelemek.szazalekCimke).textContent =
          obj.szazalek + "%";
      } else {
        document.querySelector(DOMelemek.szazalekCimke).textContent = "-";
      }
    },

    szazalekokMegjelenitese: function (szazalekok) {
      let elemek = document.querySelectorAll(DOMelemek.szazalekokCimke);

      nodeListForEach(elemek, function (aktualisElem, index) {
        if (szazalekok[index] > 0) {
          aktualisElem.textContent = szazalekok[index] + "%";
        } else {
          aktualisElem.textContent = "---";
        }
      });
    },

    datumMegjelenites: function () {
      let most, ev, honap, honapok;

      honapok = [
        "január",
        "Február",
        "Március",
        "Április",
        "Május",
        "Június",
        "Július",
        "Augusztus",
        "Szeptember",
        "Október",
        "November",
        "December",
      ];
      most = new Date();
      ev = most.getFullYear();
      honap = most.getMonth();

      document.querySelector(DOMelemek.datumCimke).textContent =
        ev + ". " + honapok[honap];
    },

    tetelTipusValtozas: function () {
      let elemek = document.querySelectorAll(
        DOMelemek.inputTipus +
          "," +
          DOMelemek.inputLeiras +
          "," +
          DOMelemek.inputErtek
      );

      nodeListForEach(elemek, function (aktualisElem) {
        aktualisElem.classList.toggle("red-focus");
      });

      document.querySelector(DOMelemek.inputGomb).classList.toggle("red");
    },
  };
})(); //azonnal meghívódó fv-n

//két egymástól független modult (koltsegVezerlo,feluletVezerlo)
//vezérlő alkalmazásvezérlő modul
//feladata: összeköttetés megteremtése a másik 2 modul között
let vezerlo = (function (koltsegvetesVez, feluletVez) {
  //privát rész
  let esemenykezeloBeallit = function () {
    let DOM = feluletVezerlo.getDOMelemek();

    document
      .querySelector(DOM.inputGomb)
      .addEventListener("click", VezTetelHozzaadas);

    //enter gomb megnyomására is működjön a vezérlő
    //keycode és a which deprecated
    document.addEventListener("keydown", function (event) {
      if (event.key !== undefined && event.key === "Enter") {
        VezTetelHozzaadas();
      } else if (event.keyCode !== undefined && event.keyCode === 13) {
        VezTetelHozzaadas();
      }
    });

    document
      .querySelector(DOM.kontener)
      .addEventListener("click", vezTetelTorles);

    document
      .querySelector(DOM.inputTipus)
      .addEventListener("change", feluletVezerlo.tetelTipusValtozas);
  };

  let osszegFrissitese = function () {
    //1.költségvetés újraszámolása
    koltsegvetesVezerlo.koltsegvetesSzamolas();

    //2.összeg visszaadása
    let koltsegVetes = koltsegvetesVezerlo.getKoltsegvetes();

    //3.összeg megjelenítése a felületen
    feluletVezerlo.koltsegvetesMegjelenites(koltsegVetes);
  };

  let szazalekokFrissitese = function () {
    //1.százalékok újraszámolása
    koltsegvetesVezerlo.szazalekokSzamolasa();

    //2.százalékok kiolvasása a költségvetésvezérlőből
    let kiadasSzazalekok = koltsegvetesVezerlo.szazalekokLekerdezese();

    //3.UI frissítése az új százalékokkal

    feluletVezerlo.szazalekokMegjelenitese(kiadasSzazalekok);
  };

  //azért kell kiszervezni egy fv-be mert meg kell hívni akkor is ha a gomra kattintunk
  //és akkor is ha az ENTER-t nyomtuk le. NEM DUPLIKÁLJUK A KÓDOT
  let VezTetelHozzaadas = function () {
    let input, ujTetel;

    //1. bevitt adatok megszerzése a felületről
    input = feluletVezerlo.getInput();

    console.log(input);

    if (input.leiras !== "" && !isNaN(input.ertek) && input.ertek > 0) {
      //2. az adatok átadása a költségvetésvezérlő modulnak
      ujTetel = koltsegvetesVezerlo.tetelHozzaad(
        input.tipus,
        input.leiras,
        input.ertek
      );

      //3.a bevitt tételek megjelenítése az UI-n
      feluletVezerlo.tetelMegjelenites(ujTetel, input.tipus);

      //4.beviteli mezők törlése
      feluletVezerlo.urlapTorles();

      //5.költségvetés újraszámolása és frissítése a felületen
      osszegFrissitese();

      //6.százalékok újraszámolása és frissítése a felületen
      szazalekokFrissitese();
    }
  };

  let vezTetelTorles = function (event) {
    let tetelID = event.target.parentNode.parentNode.parentNode.parentNode.id; //17.video
    let splitID, tipus, ID;

    if (tetelID) {
      //bev-0
      splitID = tetelID.split("-");
      tipus = splitID[0];
      ID = parseInt(splitID[1]);
    }

    //1.tétel törlése az adatok objektumból és az UI-ról is
    koltsegvetesVezerlo.tetelTorol(tipus, ID);

    feluletVezerlo.tetelTorles(tetelID);

    //2.összeget újraszámolása és megjelenítése az UI-n
    osszegFrissitese();

    //3.százalékok újraszámolása és frissítése a felületen
    szazalekokFrissitese();
  };

  //publikus rész
  return {
    //az alkalmazással együtt elinduló cuccok
    init: function () {
      console.log("Az alkalmazás elindult");

      feluletVezerlo.datumMegjelenites();

      feluletVezerlo.koltsegvetesMegjelenites({
        koltsegvetes: 0,
        osszBevetel: 0,
        osszKiadas: 0,
        szazalek: -1,
      });
      esemenykezeloBeallit();
    },
  };
})(koltsegvetesVezerlo, feluletVezerlo); //itt adom át a vezérlőnek a 2 paramétert

vezerlo.init();

/*
eseménykezelő
tétel törlése az adatokból és a felületről
költségvetés újraszámolása
újraszámolt érték felülírása a felületen
*/
