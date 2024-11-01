"use client";
import pokemonStyles from "./pokemon.module.css";
import usePokemonApi from "@/hooks/usePokemonApi";

export default function PokemonCard({
  img = "",
  name = "",
  types = [],
  pokemon,
}) {
  const { favorites, toggleFavorite } = usePokemonApi();
  const isFavorited = favorites.some((fav) => fav.id === pokemon.id);

  const handleToggleFavorite = () => {
    toggleFavorite(pokemon);
  };

  const typesJsx = types
    .map(function (typeObj) {
      return typeObj.type.name;
    })
    .join(", ");

  return (
    <div className={pokemonStyles.pokeCard}>
      <img src={img} />
      <div className={pokemonStyles.mainInfo}>
        <h4>{name}</h4>
        <p>
          <i>Types: {typesJsx}</i>
        </p>
        <div className={pokemonStyles.cardButtons}>
          <a
            href={`/pokemon/${pokemon.id}`}
            className={pokemonStyles.viewButton}
          >
            View Pokemon
          </a>
          <div
            onClick={handleToggleFavorite}
            className={pokemonStyles.favoriteButton}
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorited ? (
              <i className="material-icons">favorite</i>
            ) : (
              <i className="material-icons">favorite_border</i>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
