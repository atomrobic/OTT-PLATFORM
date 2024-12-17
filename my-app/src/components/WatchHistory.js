import React, { useState, useEffect } from 'react';
import './WatchHistory.css';
import Navbars from './Navbars';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import style from './Background.module.css';

const WatchHistory = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        alert('You need to log in to access your watch history.');
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/watch-history/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        console.log("Movies from API:", response.data); // Log API response
        setMovies(response.data);
      } catch (err) {
        console.error('Error fetching watch history:', err.response?.data || err.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching watch history. Please try again later.</div>;

  return (
    <div>
      <Navbars />
      <div className={style.background}>
        <Container>
          <h2>Watch History</h2>
          {movies.length === 0 ? (
            <p>No movies found in your watch history.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Title</th>
                  <th>Date Watched</th>
                </tr>
              </thead>
              <tbody>
                {movies.map(movie => (
                  <tr key={movie.id}>
                    <td>
                      <img
                        src={movie.movie.thumbnail} // Add a placeholder image URL if thumbnail is missing
                        alt={`${movie.title} `}
                        style={{ width: '100px', height: 'auto' }}
                      />
                    </td>
                    <td>{movie.movie.title || 'Unknown Title'}</td>
                    <td>{formatDate(movie.date_added)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Container>
      </div>
    </div>
  );
};

export default WatchHistory;
