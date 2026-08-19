import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utilities";

export default function GamePage() {
  const [puzzle, setPuzzle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [characterType, setCharacterType] = useState("alphabetic");
  const [entries, setEntries] = useState({});

  const loadPuzzle = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        "games/new/?difficulty=" + difficulty + "&character_type=" + characterType
      );
      setPuzzle(response.data);
      setEntries({});
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

  useEffect(() => {
    loadPuzzle();
  }, []);

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
                        />
                      )}
                    </div>
                    <div className="cipher">{token.token}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <p>author: {puzzle.author}</p>
        </>
      )}

      <Link className="btn btn-primary" to="/home">
        Home
      </Link>
    </>
  );
}
