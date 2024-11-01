// pages/favorites.js
"use client";
import usePokemonApi from "@/hooks/usePokemonApi";
import PokemonCard from "@/components/Pokemon/PokemonCard";
import styles from "./page.module.css";
export default function Favorites() {
  const { favorites } = usePokemonApi();

  const favoritePokemonJsx = favorites.map((pokemon) => {
    const quickInfo = {
      name: pokemon.name,
      id: pokemon.id,
      img: pokemon.sprites.front_default,
      types: pokemon.types,
    };
    return (
      <PokemonCard
        key={`favorite-card-${quickInfo.id}`}
        name={quickInfo.name}
        img={quickInfo.img}
        types={quickInfo.types}
        pokemon={pokemon} // Pass the full pokemon object
      />
    );
  });

  return (
    <main className={styles.mainContent}>
      <h1>Your Favorites</h1>
      <section>
        {favorites.length > 0 ? favoritePokemonJsx : <p>No favorites yet!</p>}
      </section>
    </main>
  );
}
