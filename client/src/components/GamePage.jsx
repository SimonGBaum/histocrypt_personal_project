import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
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
  const [blurb, setBlurb] = useState(null);
  const [blurbChecked, setBlurbChecked] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [savedGameId, setSavedGameId] = useState(null);
  const [savedGameCleared, setSavedGameCleared] = useState(false);
  const navigate = useNavigate();

  const loadPuzzle = async () => {
    sessionStorage.removeItem("histocrypt_game");
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
      setBlurb(null);
      setBlurbChecked(false);
      setSaveMessage("");
      setSavedGameId(null);
      setSavedGameCleared(false);
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
    return assemblePlaintext() === puzzle.plaintext;
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

    const handleSave = async () => {
    setSaveMessage("");

    try {
      if (savedGameId) {
        await api.put("games/saved/" + savedGameId + "/", {
          entries: entries,
        });
      } else {
        await api.post("games/saved/", {
          ciphertext: puzzle.ciphertext,
          plaintext: puzzle.plaintext,
          prefill: puzzle.prefill,
          entries: entries,
          author: puzzle.author,
          difficulty: puzzle.difficulty,
          character_type: puzzle.character_type,
        });
      }
      setSaveMessage("Game saved.");
    } catch (err) {
      setSaveMessage(err.response?.data?.detail || "Could not save the game.");
    }
  };

    const handleHome = () => {
    const hasProgress = Object.keys(entries).length > 0;

    if (hasProgress && !isSolved()) {
      const leave = window.confirm(
        "You have unsaved progress. Leave without saving?"
      );

      if (!leave) {
        return;
      }
    }

    navigate("/home");
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("histocrypt_game");

    if (!saved) {
      loadPuzzle();
      return;
    }

    try {
      const data = JSON.parse(saved);
      setPuzzle(data.puzzle);
      setEntries(data.entries);
      setRecorded(data.recorded);
      setFavorited(data.favorited);
      setBlurb(data.blurb);
      setBlurbChecked(data.blurbChecked);
      setSavedGameId(data.savedGameId || null);
      setSavedGameCleared(data.savedGameCleared || false);
      setLoading(false);
    } catch (err) {
      sessionStorage.removeItem("histocrypt_game");
      loadPuzzle();
    }
  }, []);

    useEffect(() => {
    const recordSolve = async () => {
      setRecorded(true);

      try {
        await api.post("achievements/", {
          difficulty: puzzle.difficulty,
          character_type: puzzle.character_type,
        });
      } catch (err) {
        console.log(err);
      }
    };

    if (puzzle && !recorded && isSolved()) {
      recordSolve();
    }
  });

    useEffect(() => {
    const loadBlurb = async () => {
      setBlurbChecked(true);

      const name = encodeURIComponent(puzzle.author.split(" ").join("_"));

      try {
        const response = await axios.get(
          "https://en.wikipedia.org/api/rest_v1/page/summary/" + name
        );
        setBlurb(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (puzzle && !blurbChecked && isSolved()) {
      loadBlurb();
    }
  });

    useEffect(() => {
    const clearSavedGame = async () => {
      setSavedGameCleared(true);

      try {
        await api.delete("games/saved/" + savedGameId + "/");
        setSavedGameId(null);
      } catch (err) {
        console.log(err);
      }
    };

    if (puzzle && savedGameId && !savedGameCleared && isSolved()) {
      clearSavedGame();
    }
  });

    useEffect(() => {
    if (!puzzle) {
      return;
    }

    const saved = {
      puzzle: puzzle,
      entries: entries,
      recorded: recorded,
      favorited: favorited,
      blurb: blurb,
      blurbChecked: blurbChecked,
      savedGameId: savedGameId,
      savedGameCleared: savedGameCleared,
    };

    sessionStorage.setItem("histocrypt_game", JSON.stringify(saved));
  });

  return (
    <>
      <button
        className="btn btn-secondary game-options-toggle"
        onClick={() => setShowOptions(!showOptions)}
      >
        Game Options
      </button>

      {showOptions && (
        <div className="game-options">
          {puzzle && !isSolved() && (
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
          )}
          {saveMessage && <p>{saveMessage}</p>}
          <Link className="btn btn-primary" to="/game/saved">
            Saved Games
          </Link>
        </div>
      )}

      <div className="game-controls">
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
      </div>

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
              {blurb && (
                <div className="blurb">
                  <p>{blurb.extract}</p>
                  <a href={blurb.content_urls.desktop.page}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read more on Wikipedia
                  </a>
                </div>
              )}
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
        </>
      )}
      <button className="btn btn-primary" onClick={handleHome}>
        Home
      </button>
    </>
  );
}
