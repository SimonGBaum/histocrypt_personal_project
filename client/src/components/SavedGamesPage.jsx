import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utilities";

export default function SavedGamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadGames = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("games/saved/");
      setGames(response.data);
    } catch (err) {
      setError("Could not load your saved games.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const readableDate = (stamp) => {
    return new Date(stamp).toLocaleString();
  };

    const handleDelete = async (id) => {
    const remove = window.confirm("Delete this saved game?");

    if (!remove) {
      return;
    }

    try {
      await api.delete("games/saved/" + id + "/");
      loadGames();
    } catch (err) {
      setError("Could not delete that saved game.");
    }
  };

    const handleResume = (game) => {
    const saved = {
      puzzle: {
        tokens: game.tokens,
        prefill: game.prefill,
        solution_hash: game.solution_hash,
        author: game.author,
        difficulty: game.difficulty,
        character_type: game.character_type,
        length: game.length,
      },
      entries: game.entries,
      recorded: false,
      favorited: false,
      blurb: null,
      blurbChecked: false,
      savedGameId: game.id,
    };

    sessionStorage.setItem("histocrypt_game", JSON.stringify(saved));
    navigate("/game");
  };

  return (
    <>
      <h2>Saved games</h2>

      {loading && <p>Loading...</p>}

      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && games.length === 0 && (
        <p>You have no saved games.</p>
      )}

      {!loading && !error && games.length > 0 && (
        <>
          <div className="saved-list">
            {games.map((game) => (
              <div className="saved-row" key={game.id}>
                <p className="saved-author">{game.author}</p>
                <p className="saved-detail">
                  {game.difficulty} · {game.character_type} · {game.length}{" "}
                  characters · saved {readableDate(game.updated_at)}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleResume(game)}
                >
                  Resume
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(game.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <p className="saved-count">{games.length} of 3 slots used</p>
        </>
      )}

      <Link className="btn btn-primary" to="/home">
        Home
      </Link>
    </>
  );
}