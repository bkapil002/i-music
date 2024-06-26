import React, { useState, useEffect } from 'react';
import '../App.css';
import Recent from '../Components/Recent';
import Square from '../Components/Square';
import Artist from '../Components/Artist';
import Shado from '../Components/Shado';
import { FaPlayCircle } from 'react-icons/fa';
import TopMix from '../Components/TopMix';
import BestArtist from '../Components/BestArtist'
import IndiaBest from '../Components/IndiaBest';
import PopularAlbum from '../Components/PopularAlbum';
import FMusic from '../Components/FMusic';
import Charts from '../Components/Charts';
import { Link } from 'react-router-dom';
import { useSongContext } from '../Context/SongContext';

const clientId = '1dd7f02cc8f44980ba459fb606abf412';
const clientSecret = 'bf81e270adb842e4a0d6c8eccbeef6cf';

const authEndpoint = 'https://accounts.spotify.com/api/token';


export const getAccessToken = async () => {
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

export const fetchFromSpotify = async (url, token) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  return data;
};

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [music, setMusic] = useState([]);
  const [podcasts, setPodcasts] = useState([]);

  const {setSelectedSong} = useSongContext()


  useEffect(() => {
    const fetchData = async () => {
      const token = await getAccessToken();
      const musicData = await fetchFromSpotify('https://api.spotify.com/v1/browse/new-releases', token);
      const podcastsData = await fetchFromSpotify('https://api.spotify.com/v1/browse/featured-playlists', token);
      
      setMusic(musicData.albums.items);
      setPodcasts(podcastsData.playlists.items);
    };

    fetchData();
  }, []);

 
  return (
 
    <div className='bg-neutral-700  w-full mt-2 ml-2 rounded-lg body overflow-hidden relative container mb-10'>
      <div className='ml-4 mt-2'>
        <div className='flex gap-2 mt-5'>
          <button
            onClick={() => setSelectedCategory('All')}
            className={`items-center text-center w-10 h-7 text-white rounded-full font-semibold ${selectedCategory === 'All' ? 'bg-neutral-900' : 'bg-neutral-700'} cursor-pointer hover:bg-neutral-900`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedCategory('Music')}
            className={`items-center text-center w-20 h-7 text-white rounded-full font-semibold ${selectedCategory === 'Music' ? 'bg-neutral-900' : 'bg-neutral-700'} cursor-pointer hover:bg-neutral-900`}
          >
            Music
          </button>
          <button
            onClick={() => setSelectedCategory('Podcasts')}
            className={`items-center text-center w-28 h-7 text-white rounded-full font-semibold ${selectedCategory === 'Podcasts' ? 'bg-neutral-900' : 'bg-neutral-700'} cursor-pointer hover:bg-neutral-900`}
          >
            Podcasts
          </button>
        </div>
      </div>

      {/* Music Section */}
      {selectedCategory === 'Music' && (
        <div  className='mb-20'>
        <div>
          <h1 className=' font-semibold text-3xl text-white mt-7 mb-4 ml-3'>Music</h1>
        </div>
          <div className='gap-2 flex flex-wrap justify-center'>
          {music.map(track => (
            <Link to={`/album/${track.id}`} key={track.id}>
            <div key={track.id} className='w-56 min-h-64 hover:bg-neutral-800 flex justify-center rounded-lg cursor-pointer relative'
        >
                <div className='w-52 min-h-64'>
                  <div className='flex justify-center mt-3'>
                    <img src={track.images[0].url || 'placeholder-image-url'} alt={track.name} className='w-52 h-52 rounded-lg' />
                  </div>
                  <div className='mt-2'>
                    <h1 className='font-semibold text-white'>{track.name}</h1>
                    <p className='text-white mb-2 capitalize'>{track.artists[0].name}</p>
                  </div>
                  <div className='absolute inset-0 ml-36 flex items-center justify-center transform translate-y-32 opacity-0 hover:translate-y-16 hover:opacity-100 transition-all duration-300'>
                    <FaPlayCircle className='text-red-600 text-5xl' />
                  </div>
                </div>
              </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Podcasts Section */}
      {selectedCategory === 'Podcasts' && (
        <div className='mb-20'>
        <div>
          <h1 className=' font-semibold text-3xl text-white mt-7 mb-4 ml-3'>Podcasts</h1>
        </div>
          <div className='gap-2 flex flex-wrap justify-center'>
          {podcasts.map(podcast => (
            <Link to={`/album/${podcast.id}`} key={podcast.id} >
              <div key={podcast.id} className='w-56 min-h-64 hover:bg-neutral-800 flex justify-center rounded-lg cursor-pointer relative'>
                <div className='w-52 min-h-64'>
                  <div className='flex justify-center mt-3'>
                    <img src={podcast.images[0].url || 'placeholder-image-url'} alt={podcast.name} className='w-52 h-52 rounded-lg' />
                  </div>
                  <div className='mt-2'>
                    <h1 className='font-semibold text-white'>{podcast.name}</h1>
                    <p className='text-white mb-2'>Podcast</p>
                  </div>
                  <div className='absolute inset-0 ml-36 flex items-center justify-center transform translate-y-32 opacity-0 hover:translate-y-16 hover:opacity-100 transition-all duration-300'>
                    <FaPlayCircle className='text-red-600 text-5xl' />
                  </div>
                </div>
              </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* All Section */}
      {selectedCategory === 'All' && (
        <div  className='mb-20'>
          <div className='ml-4 mt-8 gap-4 flex flex-wrap'>
            <Recent setSelectedSong={setSelectedSong} />
          </div>
          <div className='ml-4 mt-8 gap-4 flex flex-wrap'>
            <Square/>
          </div>
          <div className='ml-4 mt-8 gap-4 flex flex-wrap'>
            <Artist getAccessToken={getAccessToken} fetchFromSpotify={fetchFromSpotify} setSelectedSong={setSelectedSong} />
          </div>
          <div className='ml-4 mt-8 gap-4 flex flex-wrap'>
            <TopMix />
          </div>
          <div className='ml-4 mt-8 gap-4 flex flex-wrap'>
            <BestArtist />
          </div>
          <div className='ml-4 mt-8 gap-4 flex flex-wrap'>
            <IndiaBest />
          </div>
           <div className='ml-4 mt-8 gap-4 flex flex-wrap'>
            <PopularAlbum/>
          </div>
          <div className='ml-4 mt-8 gap-4 flex flex-wrap'>
            <FMusic/>
          </div>
          <div className='ml-4 mt-8 gap-4 flex flex-wrap'>
            <Charts/>
          </div>
          
        </div>
      )}
    </div>
  
  );
};

export default Home;
