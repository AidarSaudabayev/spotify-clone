import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "./AlbumPage.scss";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
const AlbumPage = () => {
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [addSongModal, setAddSongModal] = useState(false);
  const [song, setSong] = useState("");
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [albumSongsModal, setAlbumSongsModal] = useState(false);
  const [songsFromAlbum, setSongsFromAlbum] = useState([]);
  const notify = (text) => toast(text);
  useEffect(() => {
    getAlbums();
  }, []);
  useEffect(() => {
    getSongs();
  }, []);
  function openModal() {
    setIsOpen(true);
  }
  function afterOpenModal() {
    subtitle.style.color = "#f00";
  }
  function closeModal() {
    setIsOpen(false);
    setAddSongModal(false);
    setAlbumSongsModal(false);
  }
  async function getAlbums() {
    const result = await fetch(`http://localhost:3001/api/album`);
    const { albums } = await result.json();
    setAlbums(albums);
  }
  async function getSongs() {
    const result = await fetch(`http://localhost:3001/api/song`);
    const { songs } = await result.json();
    setSongs(songs);
  }
  async function handleAddAlbum() {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("photo", photo);
    const res = await fetch(`http://localhost:3001/api/album`, {
      method: "POST",
      body: formData,
    });
    if (res.status === 201) {
      notify("Song added successfully");
      setIsOpen(false);
      await getAlbums();
    } else {
      notify("Something went wrong");
    }
  }
  async function deleteAlbum(id) {
    const res = await fetch(`http://localhost:3001/api/album/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
      notify("Album deleted successfully");
      await getAlbums();
    } else {
      notify("Something went wrong");
    }
  }
  function handlePhotoChange(e) {
    setPhoto(e.target.files[0]);
  }
  async function handleAddSongToAlbum() {
    const res = await fetch(
     ` http://localhost:3001/api/album/${albumId}/addSong`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          songId: song,
        }),
      }
    );
    if (res.status === 200) {
      notify("Song added to album successfully");
      setAddSongModal(false);
      await getAlbums();
    } else {
      notify("Something went wrong");
    }
  }
  function openAddSongModal(id) {
    setAddSongModal(true);
    setAlbumId(id);
  }
  async function handlerSeeSongs(id) {
    setAlbumSongsModal(true);
    const res = await fetch(`http://localhost:3001/api/album/${id}`);
    const { songs, _id } = await res.json();
    setAlbumId(_id);
    setSongsFromAlbum(songs);
  }

async function deleteSongHandler(id) {
  const res = await fetch (`http://localhost:3001/api/album/${albumId}/deleteSong`, {   
method:"PUT",
headers: {
  "Content-Type": "application/json",
},
body: JSON.stringify({
  songId: id,
})
}
);
if (res.status === 200) {
  notify("Song deleted successfully");
  setAlbumSongsModal(false);
  await getAlbums();
} else {
  notify("Something went wrong");
}
}



  return (
    <div className="album-page">
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Album"
      >
        <div className="album-page__modal-container">
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Song name"
          />
          <label htmlFor="photo">Select photo:</label>
          <input
            type="file"
            onChange={handlePhotoChange}
            id="photo"
            name="photo"
            accept="image/*"
          />
          <button onClick={closeModal}>close</button>
          <button onClick={handleAddAlbum}>add album</button>
        </div>
      </Modal>
      <Modal
        isOpen={addSongModal}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Album"
      >
        <div className="album-page__modal-container">
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Add Songs</h2>
          <select onChange={(e) => setSong(e.target.value)}>
            {songs.map((song) => {
              return (
                <option key={song._id} value={song._id}>
                  {song.title}
                </option>
              );
            })}
          </select>
          <button onClick={closeModal}>close</button>
          <button onClick={handleAddSongToAlbum}>Add Song to Album</button>
        </div>
      </Modal>
      <Modal
        isOpen={albumSongsModal}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Album"
      >
        <div className="album-page__modal-container">
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>List of Songs</h2>
          <ul className="album-page__songs-from-album" >
            {songsFromAlbum.map((song) => {
              return <li>{song.title} <button onClick={()=>deleteSongHandler(song._id)} > delete</button>  </li>;
            })}
          </ul>
          <button onClick={closeModal}>close</button>
        </div>
      </Modal>
      <button onClick={openModal}>Open Modal</button>
      <ul className="album-page__albums-list">
        {albums?.map((album) => {
          return (
            <li className="album-page__album-item" key={album._id}>
              <p>{album.name}</p>
              <img alt="img" src={album.photo.url} />
              <button onClick={() => openAddSongModal(album._id)}>
                add song
              </button>
              <button
                onClick={() => handlerSeeSongs(album._id)}
                className="album-page__num-of-songs"
              >
                {album.songs.length}
              </button>
              <button onClick={() => deleteAlbum(album._id)}>delete</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default AlbumPage;