import React, { useRef, useState, useEffect } from 'react';
import { FaPlayCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../App.css';
import { Link } from 'react-router-dom';
import { useSongContext } from '../Context/SongContext'; 

const authEndpoint = 'https://accounts.spotify.com/api/token';
const clientId = 'a825b7047bd1413bbeea3f5ff60e8d85';
const clientSecret = '231a1b4ed3b04409a6ac780c05df158e';

const FMusic = () => {
  const [songs, setSongs] = useState([]);
  const scrollElement = useRef();
  const [loading, setLoading] = useState(true);
  const { setSelectedSong } = useSongContext(); 

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

  const fetchPunjabiSongs = async (token) => {
    const response = await fetch('https://api.spotify.com/v1/search?q=genre%3APunjabi&type=track&limit=50', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();
    setSongs(data.tracks.items);
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = await fetchAccessToken();
      await fetchPunjabiSongs(token);
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
  };

  return (
    <div className='w-full'>
      <div className='flex justify-between items-center'>
        <h1 className='font-semibold text-3xl text-white mb-7'>Punjabi Songs</h1>
      </div>
      {loading ? (
        <div className='gap-2 justify-center flex flex-wrap'>
          {[...Array(4)].map((_, index) => (
            <div key={index} className='w-56 min-h-64 bg-neutral-800 flex justify-center rounded-lg cursor-pointer relative animate-pulse'>
              <div className='w-52 min-h-64'>
                <div className='flex justify-center mt-3'>
                  <div className='w-52 h-52 rounded-lg bg-zinc-700 animate-pulse'></div>
                </div>
                <div className='mt-2'>
                  <div className='w-36 h-6 bg-neutral-600 rounded-lg mb-3 animate-pulse'></div>
                  <p className='h-6 w-48 bg-neutral-600 rounded-lg animate-pulse'></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='relative'>
          <button className='bg-white shadow-md rounded-full p-1 absolute left-3 top-1/2 transform -translate-y-1/2 z-10' onClick={prevImage}>
            <FaChevronLeft />
          </button>
          <div className='flex overflow-x-auto snap-x gap-4 overflow-y-hidden transition duration-300 ease-in-out' ref={scrollElement}>
            {songs.map((song) => (
              <div
                key={song.id}
                className='min-w-56 min-h-64 hover:bg-neutral-800 flex justify-center rounded-lg cursor-pointer relative'
                onClick={() => {
                  const songDetails = {
                    name: song.name,
                    artist: song.artists[0].name,
                    url: song.preview_url,
                    image: song.album.images[0]?.url || 'placeholder-image-url'
                  };
                  setSelectedSong(songDetails);
                  console.log('Selected song:', songDetails); // Debugging: Log the song details
                }}
              >   
              <div className='w-52 min-h-64'>
                  <div className='flex justify-center mt-3'>
                    <img src={song.album.images[0]?.url || 'placeholder-image-url'} alt={song.name} className='w-52 h-52 rounded-lg' />
                  </div>
                  <div className='mt-2'>
                    <h1 className='font-semibold text-white text-ellipsis line-clamp-1'>{song.name}</h1>
                    <p className='text-neutral-500 mb-2 capitalize text-ellipsis line-clamp-2'>{song.artists.map(artist => artist.name).join(', ')}</p>
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
        </div>
      )}
    </div>
  );
};

export default FMusic;
