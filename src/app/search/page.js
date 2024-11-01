"use client";
import usePokemonApi from "@/hooks/usePokemonApi";
import { useEffect, useState } from "react";
import searchStyles from "./page.module.css";
import PokemonCard from "@/components/Pokemon/PokemonCard";

export default function Search() {
  const pokeData = usePokemonApi();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (pokeData.totalPokemonCount === 0) {
      pokeData.getNumberOfPokemon();
    }
    if (!pokeData.allPokemons.length) {
      pokeData.getAllPokemons(); // Fetch all Pokémon data once
    }
    if (!pokeData.randomPokemon.length) {
      pokeData.getRandomPokemon(3);
    }
  }, [pokeData]);

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm) {
      pokeData.searchPokemon(searchTerm);
    }
  };

  const searchedPokemonJsx = pokeData.searchedPokemon.map((pokemon) => {
    const quickInfo = pokeData.getPokemonQuickInfo(pokemon);
    return (
      <PokemonCard
        key={`poke-card-${quickInfo.id}`}
        name={quickInfo.name}
        img={quickInfo.img}
        types={quickInfo.types}
        pokemon={pokemon} // Pass the full pokemon object
      />
    );
  });

  return (
    <main className={searchStyles.mainContent}>
      <h1>POKEMON SEARCH</h1>
      <section>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            required
          />
          <input type="submit" value="Search" />
        </form>
      </section>
      <section className={searchStyles.pokemonResults}>
        {searchedPokemonJsx}
      </section>
    </main>
  );
}
