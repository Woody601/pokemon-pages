"use client";
import { createContext, useContext, useState } from "react";

const PokemonContext = createContext();

export function PokemonProvider({ children }) {
  const [pokemonState, setPokemonState] = useState({
    totalPokemonCount: 0,
    randomPokemon: [],
    searchedPokemon: [],
    allPokemons: [], // State to hold all Pokémon data
  });

  async function getNumberOfPokemon() {
    const pokeResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/?limit=1`
    );
    const { count: pokemonCount } = await pokeResponse.json();
    setPokemonState((prev) => ({ ...prev, totalPokemonCount: pokemonCount }));
  }

  async function getAllPokemons() {
    const pokeResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=1000` // Fetch a larger list
    );
    const { results } = await pokeResponse.json();
    setPokemonState((prev) => ({ ...prev, allPokemons: results }));
  }

  async function getRandomPokemon(limit = 5) {
    if (!pokemonState.totalPokemonCount) return [];
    const pokemonIds = {};
    let pokeIndex = 0;

    while (pokeIndex < limit) {
      const randId =
        parseInt(Math.random() * pokemonState.totalPokemonCount) + 1;

      if (!pokemonIds[randId]) {
        let idToUse = randId;
        if (idToUse > 1000) {
          idToUse = "10" + String(idToUse).slice(1);
        }
        try {
          const pokeRequest = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${idToUse}`
          );
          const pokeData = await pokeRequest.json();
          pokemonIds[randId] = pokeData;
          pokeIndex++;
        } catch (e) {
          console.warn(e);
        }
      }
    }

    setPokemonState((prev) => ({
      ...prev,
      randomPokemon: Object.values(pokemonIds),
    }));
  }

  async function searchPokemon(term) {
    const filteredPokemons = pokemonState.allPokemons.filter((pokemon) =>
      pokemon.name.includes(term.toLowerCase())
    );

    // Fetch detailed data for filtered Pokémon
    const detailedPokemons = await Promise.all(
      filteredPokemons.map(async (pokemon) => {
        const pokeRequest = await fetch(pokemon.url);
        return await pokeRequest.json();
      })
    );

    setPokemonState((prev) => ({
      ...prev,
      searchedPokemon: detailedPokemons,
    }));
  }

  function getPokemonQuickInfo(pokeData) {
    return {
      name: pokeData.name,
      id: pokeData.id,
      img: pokeData.sprites.front_default,
      types: pokeData.types,
    };
  }

  const pokemonValues = {
    ...pokemonState,
    getNumberOfPokemon,
    getAllPokemons, // Add this function to call
    getRandomPokemon,
    searchPokemon,
    getPokemonQuickInfo,
  };

  return (
    <PokemonContext.Provider value={pokemonValues}>
      {children}
    </PokemonContext.Provider>
  );
}

export default function usePokemonApi() {
  return useContext(PokemonContext);
}
