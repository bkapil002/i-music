import React, { useEffect, useState } from 'react';
import '../App.css';
import { FiSearch } from 'react-icons/fi';
import { FaPlayCircle } from 'react-icons/fa';
import Image from '../Image/logo-removebg-preview.png'
import { Link } from 'react-router-dom';
import { useSongContext } from '../Context/SongContext';

const getAccessToken = async () => {
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

const fetchBrowseCategories = async (accessToken) => {
  const response = await fetch('https://api.spotify.com/v1/browse/categories?country=US', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  const data = await response.json();
  return data.categories.items;
};

const fetchSearchResults = async (accessToken, query) => {
  const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track,artist,album&limit=10`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  const data = await response.json();
  return data;
};

const Search = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const { setSelectedSong } = useSongContext();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessToken();
        const categoriesData = await fetchBrowseCategories(token);
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchQuery) return;
    setLoading(true);
    try {
      const token = await getAccessToken();
      const results = await fetchSearchResults(token, searchQuery);
      setSearchResults(results);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setLoading(false);
    }
  };
  const hasSearchResults = searchResults && (
    searchResults.tracks.items.length > 0 ||
    searchResults.artists.items.length > 0 ||
    searchResults.albums.items.length > 0
  );

  if (loading) {
    return <div className="bg-neutral-700 ml-3 w-full mt-2 rounded-lg body">
        <div className="ml-4 mt-4">
            <div className='flex justify-center'>
                <div className='h-12 bg-zinc-800 animate-pulse w-80'></div>
            </div>
        </div>

        
            <div  className='gap-2 flex flex-wrap justify-center'>
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
        
    </div>;
  }

  return (
    <div className='bg-neutral-700 ml-3 w-full mt-2 rounded-lg body'>
      <div className='ml-4 mt-4'>
      <div className='flex justify-center'>
          <form onSubmit={handleSearch} className="hidden lg:flex items-center h-12 w-full justify-between max-w-sm border rounded-full focus-within:shadow pl-5">
            <input
              type="text"
              placeholder="Search..."
              className="w-full text-white bg-transparent outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="text-lg min-w-[50px] h-8 flex items-center justify-center rounded-r-full text-white">
              <FiSearch />
            </button>
          </form>
        </div>
      </div>

      {/* Browse All Section */}
      {!searchQuery || !hasSearchResults ? (
        <div className='ml-4 mt-4'>
        <h1 className='font-semibold text-3xl text-white'>Browse all</h1>
        <div className='mt-4 flex gap-x-2 gap-y-4 flex-wrap  justify-center'>
          {categories.map(category => (
            <Link to={`/shado/${category.id}`} key={category.id}>
            <div key={category.id} className='w-64 h-40 hover:bg-neutral-700 cursor-pointer  rounded-lg p-4 flex flex-col justify-between  cursor-pointer '>
              <img src={category.icons[0].url} alt={category.name} className='w-60 h-36 object-cover rounded-lg ' />
              <h2 className='font-semibold text-white absolute  '>{category.name}</h2>
            </div>
            </Link>
          ))}
        </div>
      </div>
      ): null}

      {hasSearchResults && (
        <div className='ml-4 mt-4'>
          <h1 className='font-semibold text-3xl text-white'>Search Results</h1>
          <div className='mt-4 flex gap-x-8 gap-y-4 flex-wrap justify-center'>
          {searchResults.artists.items.map(artist => (
            <Link to={`/artist/${artist.id}`} key={artist.id} >
              <div key={artist.id} className='w-56 min-h-64 hover:bg-neutral-800 flex justify-center rounded-lg cursor-pointer relative '>
                <div className='w-52 min-h-64'>
                  <div className='flex justify-center mt-3'>
                    <img src={artist.images[0]?.url ||  Image} alt={artist.name} className='w-52 h-52 rounded-full' />
                  </div>
                  <div className='mt-2'>
                    <h1 className='font-semibold text-white capitalize'>{artist.name}</h1>
                    <p className=' mb-2 text-neutral-500'>Artist</p>
                  </div>
                  <div className='absolute inset-0  ml-36 flex items-center justify-center transform translate-y-32 opacity-0 hover:translate-y-16 hover:opacity-100 transition-all duration-300'>
                    <FaPlayCircle className='text-red-600 text-5xl ' />
                  </div>
                </div>
              </div>
              </Link>
            ))}
            
            {searchResults.tracks.items.map(track => (
              <div key={track.id}
              onClick={() =>{
            const song = {
              name: track.name,
              artist: track.artists[0].name,
              url: track.preview_url,
              image: track.album.images[0].url
            }
            setSelectedSong(song);
            console.log('Selected song:', song);
          }}
               className='w-56 min-h-64 hover:bg-neutral-800 flex justify-center rounded-lg cursor-pointer relative '>
                <div className='w-52 min-h-64'>
                  <div className='flex justify-center mt-3'>
                    <img src={track.album.images[0]?.url || Image} alt={track.name} className='w-52 h-52 rounded-lg' />
                  </div>
                  <div className='mt-2'>
                    <h1 className='font-semibold text-white capitalize'>{track.name}</h1>
                    <p className='text-white mb-2 capitalize'>{track.artists[0].name}</p>
                    <p className='mb-2 capitalize text-neutral-500'>Track</p>
                  </div>
                  <div className='absolute inset-0  ml-36 flex items-center justify-center transform translate-y-32 opacity-0 hover:translate-y-16 hover:opacity-100 transition-all duration-300'>
                    <FaPlayCircle className='text-red-600 text-5xl ' />
                  </div>
                </div>
              </div>
            ))}
            

            
            {searchResults.albums.items.map(album => (
                <Link to={`/album/${album.id}`} key={album.id} >
              <div key={album.id} className='w-56 min-h-64 hover:bg-neutral-800 flex justify-center rounded-lg cursor-pointer relative '>
                <div className='w-52 min-h-64'>
                  <div className='flex justify-center mt-3'>
                    <img src={album.images[0]?.url ||Image} alt={album.name} className='w-52 h-52 rounded-lg' />
                  </div>
                  <div className='mt-2'>
                    <h1 className='font-semibold text-white'>{album.name}</h1>
                    <p className='text-white mb-2 capitalize'>{album.artists[0].name}</p>
                    <p className=' mb-2 capitalize text-neutral-500'>Album</p>
                  </div>
                  <div className='absolute inset-0  ml-36 flex items-center justify-center transform translate-y-32 opacity-0 hover:translate-y-16 hover:opacity-100 transition-all duration-300'>
                    <FaPlayCircle className='text-red-600 text-5xl ' />
                  </div>
                </div>
              </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Search;
