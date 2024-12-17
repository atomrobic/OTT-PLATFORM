import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import LoginForm from './components/LoginForm';
import Landing from './Landing.js';
import Movieshowlist from './components/Movieshowlist.js';
import Moviedetails from './components/Moviedetails.js';
import WatchHistory from './components/WatchHistory';
import WatchLater from './components/WatchLater'; // Create this component if you haven't yet
import Navbars from './components/Navbars.js';
import AdminUserListing from './components/AdminUserListing';
import UserList from './components/UserList';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Movieshowlist" element={<Movieshowlist />} />
        <Route path="/movie/:id" element={<Moviedetails />} />
        <Route path="/watchHistory" element={<WatchHistory />} />
        <Route path="/watchLater" element={<WatchLater />} />
        <Route path="/WatchHistory" element={<Navbars />} />
        <Route path="/admin/users" element={<AdminUserListing />} />
        <Route path="/UserList" element={<UserList />} />
        {/* Updated route for movie details */}
        <Route path="/movie/details/:movieId" element={<Moviedetails />} />
        <Route path="/movie/:movieId" element={<Moviedetails />} />
        <Route path="/watch-later" element={<WatchLater />} />

      </Routes>
    </Router>
  );
};

export default AppRouter;
