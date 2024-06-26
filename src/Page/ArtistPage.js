import React,{useRef,useState,useEffect} from 'react';
import '../App.css';
import bg from '../Image/diljeet.png'; 
import { FaPlayCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSongContext } from '../Context/SongContext';
const clientId = 'a825b7047bd1413bbeea3f5ff60e8d85';
const clientSecret = '231a1b4ed3b04409a6ac780c05df158e';
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

const ArtistPage = () => {
  const { id } = useParams(); // Fetching artist ID from route params
  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [popularAlbums, setPopularAlbums] = useState([]);
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [error, setError] = useState(null);
 const [loading , setloading] = useState(true)

  const {setSelectedSong} = useSongContext()

 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessToken();

        
        const artistData = await fetchArtistDetails(id, token);
        setArtist(artistData);

        
        const topTracksData = await fetchArtistTopTracks(id, token);
        setTopTracks(topTracksData);

        
        const popularAlbumsData = await fetchArtistAlbums(id, token);
        setPopularAlbums(popularAlbumsData);

        
        const relatedArtistsData = await fetchRelatedArtists(id, token);
        setRelatedArtists(relatedArtistsData);
        setloading(false);
      } catch (error) {
        setError('Failed to fetch artist data');
        setloading(false);
      }
    };

    fetchData();
  }, [id]);

  const fetchArtistDetails = async (artistId, accessToken) => {
    try {
      const url = `https://api.spotify.com/v1/artists/${artistId}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch artist details');
      }

      const data = await response.json();
      return {
        id: data.id,
        name: data.name,
        monthlyListeners: data.followers.total,
        image: data.images.length > 0 ? data.images[0].url : bg // Use bg or a placeholder image URL
        
      };
    } catch (error) {
      console.error('Error fetching artist details:', error);

      throw error;
    }
  };

  const fetchArtistTopTracks = async (artistId, accessToken) => {
    try {
      const url = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch artist top tracks');
      }

      const data = await response.json();
      return data.tracks.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map(artist => artist.name).join(', '), 
        url: track.preview_url,
        imageUrl: track.album.images.length > 0 ? track.album.images[0].url : bg 
        
      }));
    } catch (error) {
      console.error('Error fetching artist top tracks:', error);
   

      throw error;
    }
  };

  const fetchArtistAlbums = async (artistId, accessToken) => {
    try {
      const url = `https://api.spotify.com/v1/artists/${artistId}/albums?market=US&limit=10`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch artist albums');
       
      }

      const data = await response.json();
      return data.items.map(album => ({
        id: album.id,
        name: album.name,
        images: album.images,
      }));
    } catch (error) {
      console.error('Error fetching artist albums:', error);
      

      throw error;
    }
  };

  const fetchRelatedArtists = async (artistId, accessToken) => {
    try {
      const url = `https://api.spotify.com/v1/artists/${artistId}/related-artists`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch related artists');
      }

      const data = await response.json();
      console.log('Related artists data:', data);

      const relatedArtistsList = data.artists.map(relatedArtist => ({
        id: relatedArtist.id,
        name: relatedArtist.name,
        imageUrl: relatedArtist.images.length > 0 ? relatedArtist.images[0].url : bg 
      }));

      console.log('Related artists list:', relatedArtistsList); 

      return relatedArtistsList;
    } catch (error) {
      console.error('Error fetching related artists:', error);
     

      throw error;
    }
  };


  const scrollElement = useRef();
  const scrollElements = useRef();
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

  const next = () => {
    if (scrollElements.current) {
      scrollElements.current.scrollLeft += 300;
    }
  };

  const prev = () => {
    if (scrollElements.current) {
      scrollElements.current.scrollLeft -= 300;
    }
  };
  return (
  
    <div className='bg-neutral-700 w-full mt-2 ml-2 rounded-lg body overflow-hidden relative container mb-10'>
      <div className='w-full h-60 flex justify-center items-center  text-center bg'>
         {loading? (
          <div>
            <div className='w-96 h-24 bg-zinc-700 animate-pulse rounded-lg'></div>
          </div>
         ):(
          <div>
           <h1 className=' text-white font-bold text-8xl ml-32'>{artist.name}</h1>
           <p className=' text-white  mt-3 ml-32'>{artist.monthlyListeners} Monthly Listeners</p>
        </div>
         )}
      </div>
      {loading?(
        <div className=''>
          <div className='h-40 w-40 rounded-full -mt-20 ml-6  bg-zinc-700 animate-pulse'></div>
        </div>
      ):(
        <div className='boder  relative'>
        <img src={artist.image} alt={artist.name}  className=' rounded-full h-40 w-40 absolute -mt-20 ml-6'/>
      </div>
      )}
 
      <div className='h-full mt-36 '>
      {loading ?(
        <div className='gap-4 flex flex-wrap justify-center'>
      {[...Array(10)].map((indix)=>(
        <div key={indix} className='relative w-56 h-12 bg-neutral-700  rounded-lg flex items-center gap-4 animate-pulse'>
           <div className='w-12 h-12 object-cover rounded-l-lg bg-zinc-800 animate-pulse'></div>
        </div>
      ))} 
      </div>
      ):(
        <div>
        <div className='gap-4 flex flex-wrap justify-center'>
      {topTracks.map((track) =>(
        <div key={track.id}
              onClick={() =>setSelectedSong({
                name: track.name,
             artist: track.artist,
             url: track.url,
             image: track.imageUrl,
                })
                   }
          className='relative w-56 h-12 bg-neutral-900 rounded-lg flex items-center gap-4 cursor-pointer'>
          <img src={track.imageUrl} alt='' className='w-12 h-12 object-cover rounded-l-lg' />
          <h1 className='text-white font-medium text-ellipsis line-clamp-1'>{track.name}</h1>
          <div className='absolute ml-20 bottom-0 flex items-center justify-center w-full h-full opacity-0 hover:opacity-100 transform translate-y-7 hover:translate-y-0 transition-all duration-200'>
            <FaPlayCircle className='text-red-600 text-2xl' />
          </div>
        </div>
      ))}
    </div>
         </div>
      )}
      


    {/* Artist Album */}

<div>
<div className=' mt-24'>
      <div className='flex justify-between items-center'>
        <h1 className='font-semibold text-3xl text-white ml-6 mb-7'>Albums</h1>
      </div>
      {loading?(
        <div className='gap-2 flex flex-wrap justify-center'>
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
        <div className='flex overflow-x-auto snap-x gap-4 overflow-y-hidden  transition duration-300 ease-in-out' ref={scrollElement}>
          
            {popularAlbums.map((album,index) => (
              <Link to={`/album/${album.id}`}>
              <div key={index} className='min-w-56 min-h-64 hover:bg-neutral-800 flex justify-center rounded-lg cursor-pointer relative'>
                <div className='w-52 min-h-64'>
                  <div className='flex justify-center mt-3'>
                    <img src={album.images[0].url} alt={album.name}className='w-52 h-52 rounded-lg' />
                  </div>
                  <div className='mt-2'>
                    <h1 className='font-semibold text-white text-ellipsis line-clamp-1'>{album.name}</h1>
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
</div>

{/* Related Artists */}

<div>
<div className='w-full mt-24 mb-20'>
      <div className='flex justify-between items-center'>
        <h1 className='font-semibold text-3xl text-white ml-6 mb-7'> Artists</h1>
      </div>
      {loading ?(
        <div className='gap-2 flex flex-wrap justify-center'>
        {[...Array(4)].map((index)=>(
      <div className='w-56 min-h-64 bg-neutral-800  flex justify-center rounded-lg cursor-pointer relative animate-pulse '>
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
        <button className='bg-white shadow-md rounded-full p-1 absolute left-3 top-1/2 transform -translate-y-1/2 z-10' onClick={prev}>
          <FaChevronLeft />
        </button>
        <div className='flex overflow-x-auto  snap-x gap-4 overflow-y-hidden  transition duration-300 ease-in-out' ref={scrollElements}>
          
            {relatedArtists.map((relatedArtist,index) => (
              <Link to={`/artist/${relatedArtist.id}`}>
              <div key={index}
               className='min-w-56 min-h-64 hover:bg-neutral-800 flex justify-center rounded-lg cursor-pointer relative'>
                <div className='w-52 min-h-64'>
                  <div className='flex justify-center mt-3'>
                    <img src={relatedArtist.imageUrl} alt={relatedArtist.name} className='w-52 h-52 rounded-full' />
                  </div>
                  <div className='mt-2'>
                    <h1 className='font-semibold text-white text-ellipsis line-clamp-1'>{relatedArtist.name}</h1>
                  </div>
                  <div className='absolute inset-0 ml-36 flex items-center justify-center transform translate-y-32 opacity-0 hover:translate-y-16 hover:opacity-100 transition-all duration-300'>
                    <FaPlayCircle className='text-red-600 text-5xl' />
                  </div>
                </div>
              </div>
              </Link>
          ))}
        </div>
        <button className='bg-white shadow-md rounded-full p-1 absolute right-3 top-1/2 transform -translate-y-1/2 z-10' onClick={next}>
          <FaChevronRight />
        </button>
      </div>
      )}
      
    </div>
</div>


      </div>



      
    </div>
    
  );
}

export default ArtistPage;
