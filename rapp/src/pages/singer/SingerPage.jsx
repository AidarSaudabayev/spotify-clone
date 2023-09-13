import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "./SingerPage.scss";

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

const SingerPage = () => {
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [addAlbumModal, setAddAlbumModal] = useState(false);
  const [album, setAlbum] = useState("");
  const [singers, setSingers] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [photo, setPhoto] = useState("");
  const [singerId, setSingerId] = useState("");
  const [singerAlbumsModal, setSingerAlbumsModal] = useState(false);
  const [albumsFromSinger, setAlbumsFromSinger] = useState([]);
  const notify = (text) => toast(text);

  useEffect(() => {
    getSingers();
  }, []);
  useEffect(() => {
    getAlbums();
  }, []);
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
    setAddAlbumModal(false);
    setSingerAlbumsModal(false);
  }

  async function getSingers() {
    const result = await fetch(`http://localhost:3001/api/singer`);
    const { singers } = await result.json();
    setSingers(singers);
  }

  async function getAlbums() {
    const result = await fetch(`http://localhost:3001/api/album`);
    const { albums } = await result.json();
    setAlbums(albums);
  }

  async function handleAddSinger() {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("country", country);
    formData.append("photo", photo);
    const res = await fetch(`http://localhost:3001/api/singer`, {
      method: "POST",
      body: formData,
    });

    if (res.status === 201) {
      notify("Album added successfully");
      setIsOpen(false);
      await getSingers();
    } else {
      notify("Something went wrong");
    }
  }

  async function deleteSinger(id) {
    const res = await fetch(`http://localhost:3001/api/singer/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      notify("Singer deleted successfully");
      await getSingers();
    } else {
      notify("Something went wrong");
    }
  }

  function handlePhotoChange(e) {
    setPhoto(e.target.files[0]);
  }

  async function handleAddAlbumToSinger() {
    const res = await fetch(
     ` http://localhost:3001/api/album/${singerId}/addAlbum`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          albumId: album,
        }),
      }
    );

    if (res.status === 200) {
      notify("Album added to singer successfully");
      setAddAlbumModal(false);
      await getSingers();
    } else {
      notify("Something went wrong");
    }
  }

  function openAddAlbumModal(id) {
    setAddAlbumModal(true);
    setSingerId(id);

  }

  async function handlerSeeAlbums(id) {
    setSingerAlbumsModal(true);
    const res = await fetch(`http://localhost:3001/api/singer/${id}`);
    const { albums, _id } = await res.json();
    setSingerId(_id);
    setAlbumsFromSinger(albums);
  }

async function deleteAlbumHandler(id) {
  const res = await fetch (`http://localhost:3001/api/album/${singerId}/deleteAlbum`, {   
method:"PUT",
headers: {
  "Content-Type": "application/json",
},

body: JSON.stringify({
  albumId: id,
})
}
);

if (res.status === 200) {
  notify("Album deleted successfully");
  setSingerAlbumsModal(false);
  await getSingers();
} else {
  notify("Something went wrong");
}
}



  return (
    <div className="singer-page">
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Singer"
      >
        <div className="singer-page__modal-container">
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Singer name"
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
          <button onClick={handleAddSinger}>add singer</button>
        </div>
      </Modal>
      <Modal
        isOpen={addAlbumModal}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Singer"
      >
        <div className="singer-page__modal-container">
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Add Albums</h2>
          <select onChange={(e) => setAlbum(e.target.value)}>
            {albums.map((album) => {
              return (
                <option key={album._id} value={album._id}>
                  {album.title}
                </option>
              );
            })}
          </select>
          <button onClick={closeModal}>close</button>
          <button onClick={handleAddAlbumToSinger}>Add Album to Singer</button>
        </div>
      </Modal>

      <Modal
        isOpen={singerAlbumsModal}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Singer"
      >

        <div className="singer-page__modal-container">
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>List of Albums</h2>
          <ul className="singer-page__albums-from-singer" >
            {albumsFromSinger.map((song) => {
              return <li>{album.title} <button onClick={()=>deleteAlbumHandler(song._id)} > delete</button>  </li>;
            })}
          </ul>
          <button onClick={closeModal}>close</button>
        </div>
      </Modal>
      <button onClick={openModal}>Open Modal</button>
      <ul className="singer-page__singers-list">
        {singers?.map((singer) => {
          return (
            <li className="singer-page__singer-item" key={singer._id}>
              <p>{singer.name}</p>
              <img alt="img" src={singer.photo.url} />
              <button onClick={() => openAddAlbumModal(singer._id)}>
                add album
              </button>
              <button
                onClick={() => handlerSeeAlbums(singer._id)}
                className="singer-page__num-of-albums"
              >
                {singer?.albums?.length}
              </button>
              <button onClick={() => deleteSinger(singer._id)}>delete</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default SingerPage;