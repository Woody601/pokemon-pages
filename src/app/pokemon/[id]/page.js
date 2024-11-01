"use client";
import { useParams } from "next/navigation";
import usePokemonApi from "@/hooks/usePokemonApi";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function PokemonDetails() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const { getPokemonQuickInfo } = usePokemonApi();

  useEffect(() => {
    const fetchPokemon = async () => {
      if (id) {
        try {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${id}`
          );
          if (!response.ok) throw new Error("Failed to fetch Pokémon data");
          const data = await response.json();
          setPokemon(data);
        } catch (error) {
          console.error("Error fetching Pokémon data:", error);
        }
      }
    };

    fetchPokemon();
  }, [id]);

  if (!pokemon) return <div className={styles.loading}>Loading...</div>;

  const quickInfo = getPokemonQuickInfo(pokemon);

  return (
    <main className={styles.mainContent}>
      <h1 className={styles.pokemonName}>{quickInfo.name}</h1>
      <img
        className={styles.pokemonImage}
        src={quickInfo.img}
        alt={`${quickInfo.name} image`}
      />
      <div className={styles.details}>
        <h2>Types</h2>
        <p>{quickInfo.types.map((type) => type.type.name).join(", ")}</p>
        <h2>Abilities</h2>
        <p>
          {pokemon.abilities.map((ability) => ability.ability.name).join(", ")}
        </p>
        <h2>Height</h2>
        <p>{(pokemon.height / 10).toFixed(2)} m</p>
        <h2>Weight</h2>
        <p>{(pokemon.weight / 10).toFixed(2)} kg</p>
        <h2>Base Stats</h2>
        <ul className={styles.baseStats}>
          {pokemon.stats.map((stat) => (
            <li key={stat.stat.name}>
              {stat.stat.name}: {stat.base_stat}
            </li>
          ))}
        </ul>
        <h2>Habitat</h2>
        <p>{pokemon.habitat ? pokemon.habitat.name : "Unknown"}</p>
      </div>
    </main>
  );
}
