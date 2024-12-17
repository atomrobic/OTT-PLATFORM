import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import './landing.css';

const Landing = () => {
  const navigate = useNavigate();  // Using useNavigate for v6

  const navigateToRegister = () => {
    navigate('/register');  // Navigate to the register page
  };
  // Refs for the parallax elements
  const mountainLeftRef = useRef(null);
  const mountainRightRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Safely update styles for parallax effect
      if (mountainLeftRef.current) {
        mountainLeftRef.current.style.left = `-${scrollY / 0.5}px`;
      }

      if (mountainRightRef.current) {
        mountainRightRef.current.style.left = `${scrollY / 0.4}px`;
      }

      if (textRef.current) {
        textRef.current.style.bottom = `-${scrollY / 1.5}px`;
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <div>
      {/* Parallax Section */}
      <section id="top">
        <h2 id="text" ref={textRef}>
          Movie Zone
        </h2>
        <h3 id="tagline" ref={textRef}>
          WATCH NOW. Your favorite movies await!
        </h3>
        <button id="watch-now-button" onClick={() => scrollToSection('sec')}>
        Watch Now
      </button>
        <img
          src="https://i.pinimg.com/736x/40/27/86/4027863a0930a6d8cfa41601eef8be8f.jpg"
          id="mountain_left"
          alt="Left Movie Element"
          ref={mountainLeftRef}
        />
        <img
          src="https://i.pinimg.com/736x/69/36/0b/69360b5981f5d359183b9c2a41d7b59e.jpg"
          id="mountain_right"
          alt="Right Movie Element"
          ref={mountainRightRef}
        />
      </section>

      {/* Movie Description Section */}
      <section id="sec">
        <h2>About the Movie</h2>
        <p>
          Experience a cinematic journey that will take you across uncharted realms of space and time. 
          "The Grand Adventure" follows a group of explorers as they embark on a daring mission to discover 
          the secrets of the universe. With breathtaking visuals, unforgettable characters, and an epic storyline, 
          this is a film you don't want to miss!
        </p>
        <button id="watch-now" onClick={navigateToRegister}>
          Watch Now
        </button>
      </section>
      

      {/* Footer with Movie Icons */}
      <footer>
        <a href="#top" aria-label="Go to top">
          <i className="fa-solid fa-house"></i>
        </a>
        <a href="#watch" aria-label="Watch trailer">
          <i className="fa-solid fa-play"></i>
        </a>
        <a href="#ratings" aria-label="View movie ratings">
          <i className="fa-solid fa-star"></i>
        </a>
        <a href="#cast" aria-label="Meet the cast">
          <i className="fa-solid fa-users"></i>
        </a>
        <a href="#settings" aria-label="Settings">
          <i className="fa-solid fa-cogs"></i>
        </a>
      </footer>
    </div>
  );
};

export default Landing;
