import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbars from './Navbars';
import style from './Background.module.css';
import './Movieshowlist.css';
import ControlledCarousel from './ControlledCarousel'; // Import the carousel component
import StarRating from './StarRating'; // Import the star rating component

const Movieshowlist = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movie data from the API
  useEffect(() => {
    const token = localStorage.getItem('accessToken'); // Ensure the key matches what was used during login
    console.log('Retrieved token from localStorage:', token); // Debugging token

    if (token) {
      axios
        .get('http://127.0.0.1:8000/movies/all/', {
          headers: {
            Authorization: `Token ${token}`, // Pass the token in the Authorization header
          },
        })
        .then((response) => {
          console.log('API response:', response.data); // Debugging API response
          setMovies(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching movie data:', error); // Debugging error
          setLoading(false);
          setError('Error fetching movie data. Please try again later.');
        });
    } else {
      console.log('No token found in localStorage.'); // Debugging missing token
      setLoading(false);
      setError('No token found. Please log in to view movies.');
    }
  }, []);

  const handleMouseEnter = (video) => {
    video.play();
    video.muted = true; // Mute the video on hover
  };

  const handleMouseLeave = (video) => {
    video.pause();
    video.currentTime = 0; // Reset to the start of the video
  };

  if (loading) {
    return (
      <div>
        <Navbars />
        <div className={style.background}>
          <Container>
            <p>Loading movies...</p>
          </Container>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbars />
        <div className={style.background}>
          <Container>
            <p>{error}</p>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbars />
      <ControlledCarousel /> {/* Add the carousel at the top */}
      <div className={style.background}>
        <div className="scrollable-container">
          <div className="movie-cards-container">
            {movies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <div
                  className="card"
                  onMouseEnter={(e) => handleMouseEnter(e.target.querySelector('video'))}
                  onMouseLeave={(e) => handleMouseLeave(e.target.querySelector('video'))}
                >
                  <video className="card-img-top" preload="auto">
                    <source src={movie.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="card-body">
                    <h5 className="card-title">{movie.title}</h5>
                    {/* Add Star Rating */}
                    <StarRating rating={movie.rating} /> {/* Pass rating data */}
                    <Link to={`/movie/details/${movie.id}`} style={{ textDecoration: 'none' }}>
                      <button className="watch-now-btn">
                        Watch Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movieshowlist;
