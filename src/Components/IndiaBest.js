import React, { useRef, useState, useEffect } from 'react';
import { FaPlayCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../App.css';
import { Link } from 'react-router-dom';
import { useSongContext } from '../Context/SongContext'; // Import the context for song selection


const authEndpoint = 'https://accounts.spotify.com/api/token';
const clientId = 'b3cdfaee99014b71a76786d72b562afa';
const clientSecret = 'b9d332a8863a4c519ddc1dd1b67c7f32';

const IndiaBest = () => {
  const [topSongs, setTopSongs] = useState([]);
  const scrollElement = useRef();
  const [loading, setLoading] = useState(true);
  const { setSelectedSong } = useSongContext(); // Use the context to set the selected song

  const fetchAccessToken = async () => {
    const response = await fetch(authEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(clientId + ':' + clientSecret)
      },
      body: 'grant_type=client_credentials'
    });
    const data = await response.json();
    return data.access_token;
  };

  const fetchTopSongs = async (token) => {
    const response = await fetch('https://api.spotify.com/v1/playlists/37i9dQZF1DX0XUfTFmNBRM/tracks', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();
    setTopSongs(data.items.map(item => item.track));
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = await fetchAccessToken();
      await fetchTopSongs(token);
    };

    fetchData();
  }, []);

  const nextImage = () => {
    if (scrollElement.current) {
      scrollElement.current.scrollLeft += 300;
    }
  };

  const prevImage = () => {
    if (scrollElement.current) {
      scrollElement.current.scrollLeft -= 300;
    }
  }

  return (
    <div className='w-full'>
      <div className='flex justify-between items-center'>
        <h1 className='font-semibold text-3xl text-white mb-7'>Latest Bollywood</h1>
      </div>
      {loading?(
        <div className='gap-2  justify-center flex flex-wrap'>
        {[...Array(4)].map((index)=>(
      <div key={index} className='w-56 min-h-64 bg-neutral-800  flex justify-center rounded-lg cursor-pointer relative animate-pulse '>
        <div className='w-52 min-h-64'>
          <div className='flex justify-center mt-3'>
            <div  className='w-52 h-52 rounded-lg bg-zinc-700 animate-pulse'></div>
          </div>
          <div className='mt-2'>
            <div className='w-36 h-6 bg-neutral-600 rounded-lg mb-3 animate-pulse '></div>
            <p className='h-6 w-48  bg-neutral-600  rounded-lg animate-pulse '></p>
          </div>
        </div>
      </div>
    ))}
    </div>
      ):(<div className='relative'>
        <button className='bg-white shadow-md rounded-full p-1 absolute left-3 top-1/2 transform -translate-y-1/2 z-10' onClick={prevImage}>
          <FaChevronLeft />
        </button>
        <div className='flex overflow-x-auto snap-x gap-4 overflow-y-hidden transition duration-300 ease-in-out' ref={scrollElement}>
         {  topSongs.map((track) => (
          
          <div
                key={track.id}
                className='min-w-56 min-h-64 hover:bg-neutral-800 flex justify-center rounded-lg cursor-pointer relative'
                onClick={() => {
                  const songDetails = {
                    name: track.name,
                    artist: track.artists[0].name,
                    url: track.preview_url,
                    image: track.album.images[0]?.url || 'placeholder-image-url'
                  };
                  setSelectedSong(songDetails);
                  console.log('Selected song:', songDetails); // Debugging: Log the song details
                }}
              >                <div className='w-52 min-h-64'>
                  <div className='flex justify-center mt-3'>
                    <img src={track.album.images[0]?.url || 'placeholder-image-url'} alt={track.name} className='w-52 h-52 rounded-lg' />
                  </div>
                  <div className='mt-2'>
                    <h1 className='font-semibold text-white text-ellipsis line-clamp-1'>{track.name}</h1>
                    <p className='text-neutral-500 mb-2 capitalize text-ellipsis line-clamp-2'>{track.artists.map(artist => artist.name).join(', ')}</p>
                  </div>
                  <div className='absolute inset-0 ml-36 flex items-center justify-center transform translate-y-32 opacity-0 hover:translate-y-16 hover:opacity-100 transition-all duration-300'>
                    <FaPlayCircle className='text-red-600 text-5xl' />
                  </div>
                </div>
              </div>
              
          ))}
        </div>
        <button className='bg-white shadow-md rounded-full p-1 absolute right-3 top-1/2 transform -translate-y-1/2 z-10' onClick={nextImage}>
          <FaChevronRight />
        </button>
      </div>)}
      
    </div>
  );
};

export default IndiaBest;
