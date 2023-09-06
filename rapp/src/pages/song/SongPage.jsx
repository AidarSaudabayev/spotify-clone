import React, { useEffect, useState } from 'react';
import './SongPage.scss';
import {toast} from "react-toastify";
import Modal from 'react-modal';
import { formatMilliseconds } from '../../helpers';



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

const SongPage = () => {
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [songs, setSongs] = useState([]);
  const [title, setTitle] = useState("")
  const [duration, setDuration] = useState(0)

  const notify = (text) =>toast(text)

  useEffect(() => {
    getSongs();
  }, []);
  console.log(songs);

  function openModal(id) {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function getSongs() {
    const result = await fetch('http://localhost:3001/api/song')
    const { songs } = await result.json();
    setSongs(songs);
  }

  async function handleAddSong() {
   const res = await fetch(`http://localhost:3001/api/song`,{
    method:"POST",
    headers:{
    "Content-Type":"application/json",
    },
    body: JSON.stringify({
      title,
      duration,
    }),
   });

   if(res.status === 201) {
     notify ("song Added successfully");
     setIsOpen(false);
     await getSongs();
   } else {
    notify("Something went wrong");
   }
  }

 async function deleteSong(id) {
 const res= await fetch (`http://localhost:3001/api/song/${id}`,{
   method:"DELETE",
   headers: {
    "Content-Type" : "application/json",
   }
 })
 console.log(res);

 if (res.status === 201) {
  notify("Song deleted successfully")
  await getSongs();
 }else {
  notify("Something went wrong");
 }
 }

  return (
    <div className='song-page'>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel='Example Modal'
      >

        <div className='song-page__modal-container'>
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}> Hello </h2>

          <input type='text ' onChange={(e) => setTitle(e.target.value)} value={title}
            placeholder='Song name ' />

          <input type='number ' onChange={(e) => setDuration(e.target.value)} value={duration}
            placeholder='60000' />
          <button onClick={closeModal}>close</button>
          <button onClick={handleAddSong}>add song</button>
        </div>

      
      </Modal>
      <button onClick={openModal}>Open modal</button>
      <ul className="song-page__songs-list">
        {songs?.map((song) => {
          return (
            <li className='song-page__song-item' key={song._id}>
              {song.title} ({formatMilliseconds(song.duration)}{""})
              <button onClick={()=> deleteSong(song._id)}>delete</button>
             
            </li>
          );
        })}
      </ul>
    </div>);
};

export default SongPage