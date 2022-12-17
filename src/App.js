import { useEffect, useState } from 'react';
import './App.css';
import UserInput from './UserInput';

function App() {
  // Set variables for Pokemon attributes
  //
  // TODO: Incorporate Pokemon evolution chain into guessing mechanics
  const [foo, setFoo] = useState('asdf');
  const [pokemonName, setPokemonName] = useState();
  const [pokemonType, setPokemonType] = useState();
  const [pokemonEvc, setPokemonEvc] = useState();
  const [pokemonAtk, setPokemonAtk] = useState();
  const [pokemonDef, setPokemonDef] = useState();
  const [pokemonHt, setPokemonHt] = useState();
  const [pokemonWt, setPokemonWt] = useState();
  const [pokemonImg, setPokemonImg] = useState();

  // useEffect() runs this function at the very start of the application
  // [] as a parameter prevents the function from running every time a variable is changed
  useEffect(() => {
    async function fetchPokemon() {
      // Randomly generate Pokedex entry number for first generation Pokemon
      // All first gen Pokemon have entry numbers between 1 - 151
      const pokedexEntry = Math.ceil(Math.random() * 151) + 1;
      
      // Fetch pokemon data from PokeAPI using the randomly generated Pokedex entry
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokedexEntry}`)
      const data = await response.json();

      // Name of the correct Pokemon, for testing purposes
      console.log(data.species.name);

      // Assign values to variables using data from PokeAPI response data
      setPokemonName(data.species.name);
      // Iterate through the types of the Pokemon and set types as an array of all the types
      let types = [];
      for (let i = 0; i < data.types.length; i++) {
        types[i] = data.types[i].type.name;
      }
      setPokemonType(types);
      setPokemonAtk(data.stats[1].base_stat);
      setPokemonDef(data.stats[2].base_stat);
      setPokemonHt(data.height);
      setPokemonWt(data.weight);
      setPokemonImg(data.sprites.other['official-artwork'].front_default);
    }
    fetchPokemon();
  }, [])

  // App components
  return (
    <div className="App">
      <h2>Pokédle!</h2>
      <UserInput correctAnswer={pokemonName} correctAtk={pokemonAtk} correctType={pokemonType}
        correctDef={pokemonDef} correctHt={pokemonHt} correctWt={pokemonWt} image={pokemonImg}/>
    </div>
  );
}

export default App;