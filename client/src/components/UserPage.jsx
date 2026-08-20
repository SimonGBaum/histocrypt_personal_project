import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utilities";

export default function UserPage() {
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openNoteId, setOpenNoteId] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [noteMessage, setNoteMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);

  const loadFavorites = async (term) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("favorites/?search=" + term);
      setFavorites(response.data);
    } catch (err) {
      setError("Could not load your favorites.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSearching(true);
    loadFavorites(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSearching(false);
    loadFavorites("");
  };

  const openComment = (favorite) => {
    if (openNoteId === favorite.id) {
      setOpenNoteId(null);
      return;
    }

    setOpenNoteId(favorite.id);
    setNoteText(favorite.note);
    setNoteMessage("");
  };

  const handleSaveNote = async (id) => {
    setNoteMessage("");

    try {
      await api.put("favorites/" + id + "/", { note: noteText });
      setOpenNoteId(null);
      loadFavorites(searchTerm);
    } catch (err) {
      setNoteMessage("Could not save that note.");
    }
  };

  const handleDelete = async (id) => {
    const remove = window.confirm("Delete this favorite?");

    if (!remove) {
      return;
    }

    try {
      await api.delete("favorites/" + id + "/");
      loadFavorites(searchTerm);
    } catch (err) {
      setError("Could not delete that favorite.");
    }
  };

  useEffect(() => {
    loadFavorites(searchTerm);
  }, []);

  return (
    <>
      <button
        className="btn btn-secondary"
        onClick={() => setShowFavorites(!showFavorites)}
      >
        Favorites
      </button>

      {showFavorites && (
        <div className="favorites-panel">
          <form onSubmit={handleSearch}>
            <input
              className="form-control"
              type="text"
              placeholder="Find"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              Search
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={handleClear}
            >
              Clear
            </button>
          </form>

          {loading && <p>Loading...</p>}

          {error && <p className="text-danger">{error}</p>}

          {!loading && !error && favorites.length === 0 && !searching && (
            <p>You have no favorites.</p>
          )}

          {!loading && !error && favorites.length === 0 && searching && (
            <p>No favorites match that search.</p>
          )}

          {!loading && !error && favorites.length > 0 && (
            <div className="favorites-list">
              {favorites.map((favorite) => (
                <div className="favorite-row" key={favorite.id}>
                  <p className="favorite-quote">
                    &ldquo;{favorite.quote_text}&rdquo;
                  </p>
                  <p className="favorite-author">&mdash; {favorite.author}</p>
                  {favorite.note && (
                    <p className="favorite-note">{favorite.note}</p>
                  )}
                  <button
                    className="btn btn-primary"
                    onClick={() => openComment(favorite)}
                  >
                    Comment
                  </button>
                  {openNoteId === favorite.id && (
                    <div className="favorite-comment">
                      <textarea
                        className="form-control"
                        value={noteText}
                        onChange={(event) => setNoteText(event.target.value)}
                      />
                      <button
                        className="btn btn-primary"
                        onClick={() => handleSaveNote(favorite.id)}
                      >
                        Save
                      </button>
                      {noteMessage && (
                        <p className="text-danger">{noteMessage}</p>
                      )}
                    </div>
                  )}
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(favorite.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        className="btn btn-secondary"
        onClick={() => setShowAchievements(!showAchievements)}
      >
        Achievements
      </button>

      {showAchievements && (
        <div className="achievements-panel">
          <p>Achievements panel</p>
        </div>
      )}

      <Link className="btn btn-primary" to="/home">
        Home
      </Link>
    </>
  );
}
