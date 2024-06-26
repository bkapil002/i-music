import React, {useRef, useState, useEffect } from 'react';
import { FaPlayCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import "../App.css"
import { Link } from 'react-router-dom';

const authEndpoint = 'https://accounts.spotify.com/api/token';
const clientId = 'b3cdfaee99014b71a76786d72b562afa';
const clientSecret = 'b9d332a8863a4c519ddc1dd1b67c7f32';

const BestArtist = () => {
    const [topArtists, setTopArtists] = useState([]);
  const scrollElement = useRef();
  const [loading, setLoading] = useState(true);

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

  const fetchTopPunjabiArtists = async (token) => {
    const response = await fetch('https://api.spotify.com/v1/search?q=genre%3APunjabi&type=artist&limit=10', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();
    const artists = data.artists.items;
    const artistsWithTopTracks = await Promise.all(
      artists.map(async (artist) => {
        const topTracksResponse = await fetch(`https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=IN`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const topTracksData = await topTracksResponse.json();
        artist.topTracks = topTracksData.tracks;
        return artist;
      })
    );
    setTopArtists(artistsWithTopTracks);
    setLoading(false)
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = await fetchAccessToken();
      await fetchTopPunjabiArtists(token);
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
        <h1 className='font-semibold text-3xl text-white mb-7'>Best Artist</h1>
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
      ):(
        <div className='relative'>
        <button className='bg-white shadow-md rounded-full p-1 absolute left-3 top-1/2 transform -translate-y-1/2 z-10' onClick={prevImage}>
          <FaChevronLeft />
        </button>
        <div className='flex overflow-scroll snap-x gap-4 overflow-y-hidden transition duration-300 ease-in-out' ref={scrollElement}>
      
            {topArtists.map((playlist,index) => (
              <Link to={`/artist/${playlist.id}`} key={index}>
              <div key={index} className='min-w-56 min-h-64 hover:bg-neutral-800 flex justify-center rounded-lg cursor-pointer relative'>
                <div className='w-52 min-h-64'>
                  <div className='flex justify-center mt-3'>
                    <img src={playlist.images[0]?.url || 'placeholder-image-url'} alt={playlist.name} className='w-52 h-52 rounded-full' />
                  </div>
                  <div className='mt-2'>
                    <h1 className='font-semibold text-white text-ellipsis line-clamp-1'>{playlist.name}</h1>
                    <p className='text-neutral-500 mb-2 capitalize text-ellipsis line-clamp-2'>{playlist.topTracks && playlist.topTracks.map((track, index) => (
                      <li key={index}>{track.name}</li>
                    ))}</p>
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
      )}
      
    </div>
  );
}

export default BestArtist;
