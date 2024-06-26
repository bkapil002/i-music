import React, { useEffect, useState } from 'react';
import image from '../Image/diljeet.png';
import { useParams } from 'react-router-dom';
import { FaPlayCircle } from 'react-icons/fa';
import '../App.css'
import { useSongContext } from '../Context/SongContext';

const clientId = 'a825b7047bd1413bbeea3f5ff60e8d85';
const clientSecret = '231a1b4ed3b04409a6ac780c05df158e';
const authEndpoint = 'https://accounts.spotify.com/api/token';

const getAccessToken = async () => {
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

const fetchFromSpotify = async (url, token) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  return data;
};

const Shado = () => {
  const { id } = useParams();
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setSelectedSong } = useSongContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessToken();
        const data = await fetchFromSpotify(`https://api.spotify.com/v1/browse/categories/${id}/playlists?limit=5`, token);
        const playlists = data.playlists.items;

        const playlistTracks = await Promise.all(
          playlists.map(async (playlist) => {
            const playlistData = await fetchFromSpotify(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=10`, token);
            return playlistData.items.map(item => item.track);
          })
        );

        const allTracks = playlistTracks.flat();
        setSongs(allTracks);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data from Spotify');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  
  return (
    <div className='bg-neutral-700   w-full mt-2 ml-2 rounded-lg body overflow-hidden relative container mb-10'>
        {loading ? (
          <div className='gap-2  justify-center flex flex-wrap'>
        {[...Array(20)].map((index)=>(
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
        ):(
          <div className=' flex-wrap gap-2 flex justify-center mb-10'>
        {songs.map(song =>(
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
            className='w-56 min-h-64 hover:bg-neutral-800 flex justify-center rounded-lg cursor-pointer relative'>
                <div className='w-52 min-h-64'>
                  <div className='flex justify-center mt-3'>
                    <img src={song.album.images[0]?.url || image} alt={song.name} className='w-52 h-52 rounded-lg' />
                  </div>
                  <div className='mt-2'>
                    <h1 className='font-semibold text-white'>{song.name}</h1>
                    <p className='text-white mb-2'>{song.artists.map(artist => artist.name).join(', ')}</p>
                  </div>
                  <div className='absolute inset-0 ml-36 flex items-center justify-center transform translate-y-32 opacity-0 hover:translate-y-16 hover:opacity-100 transition-all duration-300'>
                    <FaPlayCircle className='text-red-600 text-5xl' />
                  </div>
                </div>
              </div>
        ))}  
        </div>
        )}   
    </div>
  )
}

export default Shado
