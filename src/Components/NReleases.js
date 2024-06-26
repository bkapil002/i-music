import React, { useRef, useState, useEffect } from 'react';
import { FaPlayCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../App.css';
import { Link } from 'react-router-dom';
const authEndpoint = 'https://accounts.spotify.com/api/token';
const clientId = 'b3cdfaee99014b71a76786d72b562afa';
const clientSecret = 'b9d332a8863a4c519ddc1dd1b67c7f32';

const NReleases = () => {
    const [playlists, setPlaylists] = useState([]);
    const scrollElement = useRef();
  
    // Function to fetch access token from Spotify API
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
  
    // Function to fetch fresh new music playlists from Spotify API
    const fetchPlaylists = async (token) => {
      const response = await fetch('https://api.spotify.com/v1/browse/categories/new-releases/playlists', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setPlaylists(data.playlists.items);
    };
  
    useEffect(() => {
      const fetchData = async () => {
        const token = await fetchAccessToken();
        await fetchPlaylists(token);
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
        <h1 className='font-semibold text-3xl text-white mb-7'>Spotify Mix</h1>
      </div>
      <div className='relative'>
        <button className='bg-white shadow-md rounded-full p-1 absolute left-3 top-1/2 transform -translate-y-1/2 z-10' onClick={prevImage}>
          <FaChevronLeft />
        </button>
        <div className='flex overflow-x-auto snap-x gap-4 overflow-y-hidden transition duration-300 ease-in-out' ref={scrollElement}>
          {playlists.map((playlist , index) => (
            <Link to={`/album/${playlist.id}`} key={index}>
            <div key={index} className='min-w-56 min-h-64 hover:bg-neutral-800 flex justify-center rounded-lg cursor-pointer relative'>
              <div className='w-52 min-h-64'>
                <div className='flex justify-center mt-3'>
                  <img src={playlist.images[0]?.url || 'placeholder-image-url'} alt={playlist.name} className='w-52 h-52 rounded-lg' />
                </div>
                <div className='mt-2'>
                  <h1 className='font-semibold text-white text-ellipsis line-clamp-1'>{playlist.name}</h1>
                  <p className='text-neutral-500 mb-2 capitalize text-ellipsis line-clamp-2'>{playlist.description}</p>
                </div>
                <div className='absolute inset-0 ml-36 flex items-center justify-center transform translate-y-32 opacity-0 hover:translate-y-16 hover:opacity-100 transition-all duration-300'>
                  <FaPlayCircle className='text-red-600 text-5xl' />
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>
        <button className='bg-white shadow-md rounded-full p-1 absolute right-3 top-1/2 transform -translate-y-1/2 z-10' onClick={nextImage}>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default NReleases;
