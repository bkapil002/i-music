import React, { useState, useEffect } from 'react';
import { FaPlayCircle } from 'react-icons/fa';
import { useSongContext } from '../Context/SongContext';

const authEndpoint = 'https://accounts.spotify.com/api/token';
const clientId = 'a825b7047bd1413bbeea3f5ff60e8d85';
const clientSecret = '231a1b4ed3b04409a6ac780c05df158e';

const Recent = () => {
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);
  const { setSelectedSong } = useSongContext();
 const[loading  , setloading ]= useState(true)
  const fetchAccessToken = async () => {
    try {
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
    } catch (error) {
      setError('Failed to fetch access token');
      throw error;
    }
  };

  const fetchDiljitDosanjhSongs = async (token) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/search?q=Diljit%20Dosanjh&type=track', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (Array.isArray(data.tracks.items)) {
        setSongs(data.tracks.items);
        setloading(false)
      } else {
        setloading(false)
      }
    } catch (error) {
      setError('Failed to fetch songs');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await fetchAccessToken();
        await fetchDiljitDosanjhSongs(token);
      } catch (error) {
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className='text-white'>Error: {error}</div>;
  }

  return (
    <div>
    {loading ? (
      <div className='gap-4 flex flex-wrap justify-center'>
      {[...Array(8)].map((indix)=>(
        <div key={indix} className='relative w-56 h-12 bg-neutral-700  rounded-lg flex items-center gap-4 animate-pulse'>
           <div className='w-12 h-12 object-cover rounded-l-lg bg-zinc-800 animate-pulse'></div>
        </div>
      ))} 
      </div>
    ):(
      <div className='gap-4 flex flex-wrap justify-center'>
      {songs.slice(0, 8).map((song) => (
        <div
          key={song.id}
          onClick={() =>
            setSelectedSong({
              name: song.name,
              artist: song.artists[0].name,
              url: song.preview_url,
              image: song.album.images[0].url
            })
          }
          className='relative w-56 h-12 bg-neutral-900 rounded-lg flex items-center gap-4 cursor-pointer'
        >
          <img
            src={song.album.images[0]?.url || 'placeholder-image-url'}
            alt={song.name}
            className='w-12 h-12 object-cover rounded-l-lg'
          />
          <h1 className='text-white font-medium text-ellipsis line-clamp-1'>{song.name}</h1>
          <div className='absolute ml-20 bottom-0 flex items-center justify-center w-full h-full opacity-0 hover:opacity-100 transform translate-y-7 hover:translate-y-0 transition-all duration-200'>
            <FaPlayCircle className='text-red-600 text-2xl' />
          </div>
        </div>
      ))}
    </div>
    )}
   
    </div>
  );
};

export default Recent;
