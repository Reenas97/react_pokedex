import { useEffect, useState } from "react";

async function fetchPokemons() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const data = await response.json();
  return data.results;
}

async function fetchPokemonDetails(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export default function App() {
  const [pokemon, setPokemon] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [pokemonLocations, setPokemonLocations] = useState([]);

  useEffect(() => {
    fetchPokemons().then(async (results) => {
      const details = await Promise.all(
        results.map((pokemon) => fetchPokemonDetails(pokemon.url))
      );
      setPokemon(details);
    });
  }, []);

  async function pokemonShowDetails(pokemon) {
    setPokemonDetails(pokemon);
    const locations = await fetchPokemonDetails(pokemon.location_area_encounters);
    setPokemonLocations(locations);
  }

  function closeModal() {
    setPokemonDetails(null);
    setPokemonLocations([]);
  }

  return (
    <div className="app">
      <h1>First Generation Pokédex</h1>
      <ul className="PokemonList">
        {pokemon.map((pokemon) => (
          <li key={pokemon.name} onClick={() => pokemonShowDetails(pokemon)}>
            <img src={pokemon.sprites.front_default} alt="" />
            <h2>{pokemon.name}</h2>
            <p className="PokemonList__type">
              {pokemon.types.map(({ type }) => (
                <span key={type.name} className={`type-${type.name}`}>
                  {type.name}
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
      {pokemonDetails && (
        <div className="modal">
          <div className="modal-content">
            <span className="modal-close" onClick={closeModal}>
              &times;
            </span>
            <h2>{pokemonDetails.name}</h2>
            <img src={pokemonDetails.sprites.front_default} alt={pokemonDetails.name} />
            <p>{pokemonDetails.descriptions}</p>
            <p className="PokemonList__type">
              {pokemonDetails.types.map(({ type }) => (
                <span key={type.name} className={`type-${type.name}`}>
                  {type.name}
                </span>
              ))}
            </p>
            <table>
              <thead>
                <tr>
                  <th>Attributes</th>
                  <th>Height</th>
                  <th>Weight</th>
                  <th>Abilities</th>
                  <th>Location Area</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <ul>
                      {pokemonDetails.stats.map(({ base_stat, stat }) => (
                        <li key={stat.name}>
                          <b>{stat.name}</b>: {base_stat}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{pokemonDetails.height / 10} m</td>
                  <td>{pokemonDetails.weight / 10} kg</td>
                  <td> 
                    <ul>
                      {pokemonDetails.abilities.map(({ ability, is_hidden }) => (
                        <li key={ability.name}>
                          {ability.name}
                          {is_hidden && " (secreta)"}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    {pokemonLocations.length > 0 ? (
                      <ul>
                        {pokemonLocations.map(({ location_area }) => (
                          <li key={location_area.name}>{location_area.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>Nenhuma localização disponível.</p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
