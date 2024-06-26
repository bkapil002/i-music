import React, { useRef, useEffect, useState } from 'react';
import { FaPlayCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../App.css'
import { Link } from 'react-router-dom';

const Artist = ({ fetchFromSpotify, getAccessToken }) => {
  const scrollElement = useRef();
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState(null);
  const [loading , setLoading] = useState(true)

  const nextImage = () => {
    scrollElement.current.scrollLeft += 300;
  }

  const prevImage = () => {
    scrollElement.current.scrollLeft -= 300;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessToken();
        const query = 'Hindi';
        const artistData = await fetchFromSpotify(`https://api.spotify.com/v1/search?q=${query}&type=artist&limit=20`, token);

        if (artistData && artistData.artists && artistData.artists.items) {
          setArtists(artistData.artists.items);
          setLoading(false)
        } else {
          setError('No artists data found');
        }
      } catch (err) {
        setError('Failed to fetch data from Spotify');
      }
    };

    fetchData();
  }, [fetchFromSpotify, getAccessToken]);

  return (
    <div className='w-full'>
      <div className='flex justify-between items-center'>
        <h1 className='font-semibold text-3xl text-white mb-7'>Best Hindi Artists</h1>
      </div>
      {loading? (
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
      ):(
        <div className='relative'>
        <button className='bg-white shadow-md rounded-full p-1 absolute left-3 top-1/2 transform -translate-y-1/2 z-10' onClick={prevImage}>
          <FaChevronLeft />
        </button>
        <div className='flex overflow-x-scroll snap-x gap-4 overflow-y-hidden transition duration-300 ease-in-out' ref={scrollElement}>
          { artists.map(artist => (
              <Link to={`/artist/${artist.id}`} key={artist.id}>
                <div className='min-w-56 min-h-64 hover:bg-neutral-800 flex justify-center rounded-lg cursor-pointer relative'>
                  <div className='w-52 min-h-64'>
                    <div className='flex justify-center mt-3'>
                      <img src={artist.images[0]?.url || 'placeholder-image-url'} alt={artist.name} className='w-52 h-52 rounded-full' />
                    </div>
                    <div className='mt-2'>
                      <h1 className='font-semibold text-white text-ellipsis line-clamp-1'>{artist.name}</h1>
                      <p className='mb-2 text-neutral-500 text-ellipsis line-clamp-2'>artist</p>
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
};

export default Artist;
