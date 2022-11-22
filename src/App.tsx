import { useState } from "react";
import "./App.css";
import { useQuery, useQueryClient } from "react-query";

function App() {
  const [input, setInput] = useState<string>("");
  const [name, setName] = useState<string | undefined>();
  const queryClient = useQueryClient();

  const fetchCharacterByName = (name: string): any => {
    return fetch(
      `https://rickandmortyapi.com/api/character/?name=${name}`
    ).then((res) => res.json());
  };

  const characters = useQuery<any, Error>({
    queryKey: ["characters", name],
    queryFn: () => fetchCharacterByName(name!),
    enabled: name !== undefined && name !== "" && name != null,
  });

  const fetchFavoriteCharacters = useQuery<any[], Error>({
    queryKey: "favoriteCharacters",
    queryFn: () => [],
  });

  const addCharacterToFavorites = (character: any): any[] => {
    return queryClient.setQueryData("favoriteCharacters", (prevData: any) => {
      if (prevData !== undefined) {
        if (prevData?.some((data: any) => data.id === character.id)) {
          throw new Error("You already favorited the char");
        } else {
          return [...prevData, character];
        }
      } else {
        return [character];
      }
    });
  };

  if (characters?.isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "5rem",
        padding: "5rem",
      }}
    >
      <div>
        <h1>Search for rick and morty characters</h1>

        <input onChange={(e) => setInput(e.target.value)} />
        <button onClick={(e) => setName(input)}>Search</button>
        {characters?.data?.results?.map((character: any, index: number) => (
          <div key={index}>
            <p>{character?.name}</p>
            <button onClick={() => addCharacterToFavorites(character)}>
              +
            </button>
          </div>
        ))}
      </div>

      <div>
        <h1>Favorite characters</h1>
        {fetchFavoriteCharacters?.data?.map((character: any, index: number) => (
          <p key={index}>{character.name}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
