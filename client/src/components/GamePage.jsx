import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { sha256 } from "js-sha256";
import api from "../utilities";

export default function GamePage() {
  const [puzzle, setPuzzle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [characterType, setCharacterType] = useState("alphabetic");
  const [entries, setEntries] = useState({});
  const [recorded, setRecorded] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState("");

  const loadPuzzle = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        "games/new/?difficulty=" + difficulty + "&character_type=" + characterType
      );
      setPuzzle(response.data);
      setEntries({});
      setRecorded(false);
      setFavorited(false);
      setFavoriteMessage("");
    } catch (err) {
      setError("No puzzle is available right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const groupIntoWords = (tokens) => {
    const words = [];
    let current = [];

    tokens.forEach((token) => {
      if (token.token === " ") {
        words.push(current);
        current = [];
      } else {
        current.push(token);
      }
    });

    words.push(current);

    return words;
  };

  const fillMatching = (typedToken, rawValue) => {
    const typed = rawValue.slice(-1).toUpperCase();

    if (typed !== "" && !"ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(typed)) {
      return;
    }

    const updates = {};

    puzzle.tokens.forEach((token) => {
      if (token.input && token.token === typedToken.token) {
        if (!puzzle.prefill[String(token.index)]) {
          updates[String(token.index)] = typed;
        }
      }
    });

    setEntries({ ...entries, ...updates });
  };

    const assemblePlaintext = () => {
    const characters = puzzle.tokens.map((token) => {
      if (!token.input) {
        return token.token;
      }

      const prefilled = puzzle.prefill[String(token.index)];

      if (prefilled) {
        return prefilled;
      }

      return entries[String(token.index)] || "_";
    });

    return characters.join("");
  };

  const isSolved = () => {
    return sha256(assemblePlaintext()) === puzzle.solution_hash;
  };

    const handleFavorite = async () => {
    setFavoriteMessage("");

    try {
      await api.post("favorites/", {
        quote_text: assemblePlaintext(),
        author: puzzle.author,
      });
      setFavorited(true);
      setFavoriteMessage("Added to favorites.");
    } catch (err) {
      setFavoriteMessage(err.response?.data?.detail || "Could not add to favorites.");
    }
  };

  useEffect(() => {
    loadPuzzle();
  }, []);

    useEffect(() => {
    const recordSolve = async () => {
      try {
        await api.post("achievements/", {
          difficulty: puzzle.difficulty,
          character_type: puzzle.character_type,
        });
        setRecorded(true);
      } catch (err) {
        console.log(err);
      }
    };

    if (puzzle && !recorded && isSolved()) {
      recordSolve();
    }
  });

  return (
    <>
      <h2>Game Page</h2>

      <select
        className="form-select"
        value={difficulty}
        onChange={(event) => setDifficulty(event.target.value)}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <select
        className="form-select"
        value={characterType}
        onChange={(event) => setCharacterType(event.target.value)}
      >
        <option value="alphabetic">Alphabetic</option>
        <option value="numeric">Numeric</option>
      </select>

      <button className="btn btn-primary" onClick={loadPuzzle}>
        New Game
      </button>

      {loading && <p>Loading...</p>}

      {error && (
        <>
          <p className="text-danger">{error}</p>
          <button className="btn btn-primary" onClick={loadPuzzle}>
            Try Again
          </button>
        </>
      )}

      {puzzle && !loading && !error && (
        <>
          {isSolved() && <h3 className="text-success">Correct!</h3>}

          <div className="board">
            {groupIntoWords(puzzle.tokens).map((word, wordIndex) => (
              <div className="word" key={wordIndex}>
                {word.map((token) => (
                  <div className="cell" key={token.index}>
                    <div className="slot">
                      {token.input && puzzle.prefill[String(token.index)] && (
                        <div className="prefilled">
                          {puzzle.prefill[String(token.index)]}
                        </div>
                      )}
                      {token.input && !puzzle.prefill[String(token.index)] && (
                        <input
                          className="letter-box"
                          type="text"
                          value={entries[String(token.index)] || ""}
                          onChange={(event) => fillMatching(token, event.target.value)}
                          readOnly={isSolved()}
                        />
                      )}
                    </div>
                    <div className="cipher">{token.token}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          {isSolved() && (
            <div className="solved-quote">
              <p>&ldquo;{assemblePlaintext()}&rdquo;</p>
              <p>&mdash; By {puzzle.author}</p>
              <button
                className="btn btn-primary"
                onClick={handleFavorite}
                disabled={favorited}
              >
                Add to Favorites
              </button>

              {favoriteMessage && <p>{favoriteMessage}</p>}
            </div>
          )}
          <p>author: {puzzle.author}</p>
        </>
      )}

      <Link className="btn btn-primary" to="/home">
        Home
      </Link>
    </>
  );
}
