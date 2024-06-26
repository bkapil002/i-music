import React, { useEffect, useState } from 'react';
import logo from '../Image/logo-removebg-preview.png';
import { FaHouse } from "react-icons/fa6";
import { ImSearch } from "react-icons/im";
import { LuLibrary } from "react-icons/lu";
import { Link, Outlet } from 'react-router-dom';


const getAccessToken   = async  () => {
  const clientId = '1dd7f02cc8f44980ba459fb606abf412';
  const clientSecret = 'bf81e270adb842e4a0d6c8eccbeef6cf';
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
    body: 'grant_type=client_credentials'
  });
  const data = await response.json();
  return data.access_token;
};


const fetchArtistData = async (accessToken, query) => {
  const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=artist`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  const data = await response.json();
  return data.artists.items;
};

const SideHome= () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const productImageLoading = new Array(20).fill(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessToken();
        const artistData = await fetchArtistData(token, 'Punjabi');
        setArtists(artistData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  return (
    <div className="flex">
    <div>
      <div className="mt-2 ml-3">
        <div className="bg-neutral-900 min-h-full w-60 rounded-lg">
          <div>
            <div className='mb-2 flex flex-col items-center'>
              <img src={logo} alt='logo' className='w-11 h-11 mt-2 justify-center' />
            </div>

            <div className='flex flex-col items-start space-y-2 pb-2'>
              <Link to={''} className='flex cursor-pointer p-2 gap-4 hover:bg-neutral-800 rounded-r-lg'>
                <FaHouse className='text-white ml-3 text-2xl' />
                <h2 className='text-white font-semibold text-1xl hover:text-red-600'>Home</h2>
              </Link>
              <Link to={'search'} className='flex cursor-pointer p-2 gap-4 hover:bg-neutral-800 rounded-r-lg'>
                <ImSearch className='text-white ml-3 text-2xl' />
                <h2 className='text-white font-semibold text-1xl hover:text-red-600'>Search</h2>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen mt-2 ml-3 ">
  <div className="bg-neutral-900 w-60 rounded-lg ">
    <div className='pt-3 flex items-center gap-3 '>
      <LuLibrary className='text-white ml-3 text-3xl'/>
      <h2 className='text-white font-medium text-1xl'>Your Library</h2>
    </div>
    {loading ? (
            <div className='mt-2 ml-1 gap-3  items-center'>
              {productImageLoading.map((_, index) => (
                <div key={index} className='flex gap-3 items-center'>
                  <div className='w-12 h-12 bg-stone-700 rounded-full animate-pulse'></div>
                  <div className='w-36 h-5 bg-stone-700 rounded-lg animate-pulse'></div>
                </div>
              ))}
            </div>
          ) : (
            <div className='h-full overflow-y-auto custom-scrollbar mb-10'>
              {artists.map((artist) => (
                <Link to={`/artist/${artist.id}`} key={artist.id} >
                <div key={artist.id} className='mt-2 ml-1 flex gap-3 cursor-pointer items-center hover:bg-neutral-800 p-2 rounded-l-lg'>
                  {artist.images[0] && (
                    <img src={artist.images[0].url} alt={artist.name} className="w-12 h-12 rounded-full" />
                  )}
                  <h2 className='text-white hover:text-red-600'>{artist.name}</h2>
                </div>
                </Link>
              ))}
            </div>
          )}
       </div>
    </div>
    </div>
    <Outlet/>
    </div>
  );
};

export default SideHome;
