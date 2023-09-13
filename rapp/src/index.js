import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import SongPage from './pages/song/SongPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AlbumPage from "./pages/album/AlbumPage"
import SingerPage from "./pages/singer/SingerPage"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <div className='content-wrapper' >
      <ToastContainer />
        <div className='content-wrapper__left' >
          <NavBar />
        </div>
        <div className='content-wrapper__right' >
          <Routes>
            <Route path='/' element={<App />} />
            <Route path='/song' element={<SongPage />} />
            <Route path='/album' element={<AlbumPage />} />
            <Route path='/singer' element={<SingerPage />} />
          </Routes>
        </div>
      </div>
    </Router>

  </React.StrictMode>
);

