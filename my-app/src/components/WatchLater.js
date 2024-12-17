import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WatchLater.css";
import Navbars from "./Navbars";
import style from './Background.module.css';

const WatchLater = () => {
  const [movies, setMovies] = useState([]); // Full list of movies
  const [filteredMovies, setFilteredMovies] = useState([]); // Filtered list of movies
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State to hold search query

  // Fetch Watch Later movies
  useEffect(() => {
    const fetchWatchLaterMovies = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("No access token found.");
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/watch-later/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setMovies(response.data);
        setFilteredMovies(response.data); // Initially, filtered list is the same as the full list
      } catch (error) {
        console.error("Error fetching Watch Later movies:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchLaterMovies();
  }, []);

  // Handle movie deletion
  const handleDelete = async (movieId) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("No access token found.");
      return;
    }

    try {
      await axios.delete("http://localhost:8000/watch-later/", {
        headers: {
          Authorization: `Token ${token}`,
        },
        data: { movie_id: movieId },
      });

      const updatedMovies = movies.filter((movie) => movie.id !== movieId);
      setMovies(updatedMovies);
      setFilteredMovies(updatedMovies); // Update the filtered list
    } catch (error) {
      console.error("Error deleting movie:", error);
      setError(true);
    }
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter movies based on the search query (case-insensitive match)
    const filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMovies(filtered);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching Watch Later movies. Please try again later.</div>;
  }

  return (
    <div>
      <Navbars />
      <div className={style.background}>
        <div className="container mt-4">
          <h2 text-white> Watch Later </h2>
          
          {/* Search Bar */}
          <div className="mb-3 d-flex justify-content-center">
  <input
    type="text"
    className="form-control search-bar"
    placeholder="Search for a movie..."
    value={searchQuery}
    onChange={handleSearchChange}
  />
</div>


          {/* Movies Table */}
          {filteredMovies.length === 0 ? (
            <p>No movies found.</p>
          ) : (
<table className="table table-striped">
  <thead>
    <tr>
      <th style={{ width: "100px", textAlign: "center" }}>Poster</th>
      <th style={{ width: "300px" }}>Title</th>
      <th style={{ width: "150px", textAlign: "center" }}>Action</th>
    </tr>
  </thead>
  <tbody>
    {filteredMovies.length === 0 ? (
      <tr>
        <td colSpan="3" className="text-center">
          No movies found.
        </td>
      </tr>
    ) : (
      filteredMovies.map((movie) => (
        <tr key={movie.id}>
          <td style={{ textAlign: "center" }}>
            <img
              src={movie.thumbnail}
              alt={`${movie.title} Poster`}
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
          </td>
          <td>{movie.title}</td>
          <td style={{ textAlign: "center" }}>
            <button
              onClick={() => handleDelete(movie.id)}
              className="btn btn-danger"
            >
              Remove
            </button>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>

          )}
        </div>
      </div>
    </div>
  );
};

export default WatchLater;
