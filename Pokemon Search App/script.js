//declare variables
let idVal;
let nameVal;
let url;
const pokemonApi = "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon";
const searchButton = document.getElementById("search-button");
const pokemonIntro = document.querySelector(".pokemon-intro");
const statsData = document.querySelector(".stats-data");

//Event listener to trigger if searchButton is pressed
searchButton.addEventListener("click", () => {
  //search input value only to be stored only after pressing button
  const searchInputVal = document.getElementById("search-input").value;

  //fetch the overall pokemonApi
  fetchData(pokemonApi).then((data) => {
    //once data is fetched
    findPokemon(data, searchInputVal);
    //now fetch more information based on first fetch
    return fetchData(url).then((data) => {
      moreInfoPokemon(data);
    });
  });
});

//fetches data from API and runs findPokemon function
async function fetchData(apiData) {
  try {
    const response = await fetch(apiData);
    //shows detailed informatio about what is wrong with fetch operation
    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }
    const data = await response.json();
    //console.log(data);
    return data;
  } catch (err) {
    console.log("Error fetching data", err);
  }
}

//function that is used to find pokemon
const findPokemon = (data, searchInputVal) => {
  //destructure
  const { results } = data;

  //console.log("search input value is " + searchInputVal);

  //convert searchInputVal to number if Number(searchInputVal) does not return NaN
  if (Number(searchInputVal)) {
    //if search input value is a number
    searchInputVal = Number(searchInputVal);

    idVal = results.find((item) => {
      return item.id === searchInputVal; //search for id
    });

    //if value found
    if (idVal) {
      idVal = idVal.id;
    } else {
      alert("Pokémon not found");
    }
    console.log(idVal);
    url = `https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${idVal}`;
    console.log(url);
  } else {
    //if Number(searchInputVal) returns NaN then it is a string
    //first find value
    nameVal = results.find((item) => {
      return item.name === searchInputVal.toLowerCase();
    });

    //if value found
    if (nameVal) {
      nameVal = nameVal.name;
    } else {
      alert("Pokémon not found");
    }

    url = `https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${nameVal}`;
    //console.log(url);
  }
};

//function used to find more info about pokemon once pokemon is found
const moreInfoPokemon = (data) => {
  //destructure
  const { id, name, height, weight, sprites, stats, types } = data;

  //image
  //console.log(sprites);
  const image = sprites.front_default;

  //types
  const type = types.map((element) => {
    return element.type.name; //[{type : {name: "foo1", url: "foo2"}}, {type : {name: "foo3", url: "foo4"}}]
  });
  let typeHTML = []; //converts type into html

  if (type.length > 1) {
    //if more than 2 type
    type.map((element, index) => {
      index += 1; //index starts at 0 so need to add 1
      typeHTML += `<span id="types-${index}">${element.toUpperCase()} </span> `;
    });
  } else {
    //if only 1 type
    typeHTML += `<span id="types-1">${type[0].toUpperCase()}</span>`;
  }
  //console.log(typeHTML);

  //stats
  const hp = Number(findStats("hp", stats));
  //console.log(hp);
  const attack = Number(findStats("attack", stats));
  //console.log(attack);
  const defense = Number(findStats("defense", stats));
  //console.log(defense);
  const specialAttack = Number(findStats("special-attack", stats));
  //console.log(specialAttack);
  const specialDefense = Number(findStats("special-defense", stats));
  //console.log(specialDefense);
  const speed = Number(findStats("speed", stats));
  //console.log(speed);

  //load html with extracted data
  pokemonIntro.innerHTML = `
  <h2><span id="pokemon-name">${name.toUpperCase()}</span> <span id="pokemon-id">#${id}</span></h2>
  <p><span id="weight">Weight: ${weight}</span> <span id="height">Height: ${height}</span></p>
  <img id="sprite" src="${image}" alt="">
  <p><span id="types">${typeHTML}</span></p>`;

  //finally display the html element
  pokemonIntro.style.visibility = "visible";

  statsData.innerHTML = `
  <div id="base" class="col left-col"><strong>Base</strong></div>
  <div id="base-stats" class="col right-col"><strong>Stats</strong></div>
  <div class="col left-col">HP:</div>
  <div id="hp" class="col right-col">${hp}</div>
  <div class="col left-col">Attack:</div>
  <div id="attack" class="col right-col">${attack}</div>
  <div class="col left-col">Defense:</div>
  <div id="defense" class="col right-col">${defense}</div>
  <div class="col left-col">Sp. Attack:</div>
  <div id="special-attack" class="col right-col">${specialAttack}</div>
  <div class="col left-col">Sp. Defense:</div>
  <div id="special-defense" class="col right-col">${specialDefense}</div>
  <div class="col left-col">Speed:</div>
  <div id="speed" class="col right-col">${speed}</div>`;
};

//function used to find stats and is called above
const findStats = (statName, statsArr) => {
  return statsArr.find((element) => element.stat.name === statName).base_stat;
};
