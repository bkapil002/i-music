import React, { useRef, useState, useEffect } from 'react';
import '../App.css';
import bg from '../Image/diljeet.png'; 
import { FaPlayCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSongContext } from '../Context/SongContext';

const authEndpoint = 'https://accounts.spotify.com/api/token';
const clientId = 'a825b7047bd1413bbeea3f5ff60e8d85';
const clientSecret = '231a1b4ed3b04409a6ac780c05df158e';

const Album = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [relatedAlbums, setRelatedAlbums] = useState([]);
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setSelectedSong } = useSongContext();
  const [PlayingTrack,setPlayingTrack] = useState()
 

  useEffect(() => {
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

    const fetchAlbumDetails = async (albumId, token) => {
      const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data;
    };

    const fetchRelatedAlbums = async (artistId, accessToken) => {
      try {
        const url = `https://api.spotify.com/v1/artists/${artistId}/albums?market=US&limit=20`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch related albums');
        }

        const data = await response.json();
        return data.items.map(album => ({
          id: album.id,
          name: album.name,
          images: album.images
        }));
      } catch (error) {
        console.error('Error fetching related albums:', error);
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
        return data.artists.map(relatedArtist => ({
          id: relatedArtist.id,
          name: relatedArtist.name,
          images: relatedArtist.images.length > 0 ? relatedArtist.images : [bg]
        }));
      } catch (error) {
        console.error('Error fetching related artists:', error);
        throw error;
      }
    };

    const fetchData = async () => {
      try {
        const token = await fetchAccessToken();
        const albumData = await fetchAlbumDetails(id, token);
        setAlbum(albumData);
        setTracks(albumData.tracks.items.slice(0, 10));

        const relatedAlbumsData = await fetchRelatedAlbums(albumData.artists[0].id, token);
        setRelatedAlbums(relatedAlbumsData);

        const relatedArtistsData = await fetchRelatedArtists(albumData.artists[0].id, token);
        setRelatedArtists(relatedArtistsData);

        setLoading(false);
      } catch (error) {
        setError('Failed to fetch album data');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);




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

  const playSong = (track) => {
    if (track.preview_url) {
      setPlayingTrack(track);
      setSelectedSong({
        name: track.name,
        artist: track.artists[0].name,
        url: track.preview_url,
        image: album.images[0].url
      });
    } else {
      alert('Preview not available for this track.');
    }
  };
  return (
    <div className='bg-neutral-700 w-full mt-2 ml-2 rounded-lg body overflow-hidden relative container mb-10'>
      <div className='w-full h-60 flex justify-center items-center text-center bg'>
      {loading ? (
        <div>
            <div className='w-96 h-24 bg-zinc-700 animate-pulse rounded-lg'></div>
          </div>
      ):(
        <div className=''>
          <h1 className='text-white font-bold text-8xl ml-30 text-ellipsis line-clamp-1 '>{album.name }</h1>
        </div>
      )}
      </div>

      {loading ?(
        <div className='rounded-lg w-40 absolute -mt-20 ml-6'></div>
      ):(
        <div className='boder relative'>
        <img src={album ? album.images[0].url : bg} alt='' className='rounded-lg w-40 absolute -mt-20 ml-6'/>
      </div> 
      )}
       
      
      <div className='h-full mt-36'>
        <h1 className='font-semibold text-3xl text-white ml-6 mb-7'>Songs</h1>
      {loading ? (
        <div className='gap-4 flex flex-wrap justify-center'>
      {[...Array(10)].map((indix)=>(
        <div key={indix} className='relative w-56 h-12 bg-neutral-700  rounded-lg flex items-center gap-4 animate-pulse'>
           <div className='w-12 h-12 object-cover rounded-l-lg bg-zinc-800 animate-pulse'></div>
        </div>
      ))} 
      </div>
      ):(
        <div className='gap-4 flex flex-wrap justify-center'>
          {tracks.map((track) => (
            <div key={track.id}
             onClick={()=>playSong(track)}
             className='relative w-56 h-12 bg-neutral-900 rounded-lg flex items-center gap-4 cursor-pointer'>
              <img src={album.images[0].url} alt='' className='w-12 h-12 object-cover rounded-l-lg' />
              <h1 className='text-white font-medium text-ellipsis line-clamp-1'>{track.name}</h1>
              <div className='absolute ml-20 bottom-0 flex items-center justify-center w-full h-full opacity-0 hover:opacity-100 transform translate-y-7 hover:translate-y-0 transition-all duration-200'>
                <FaPlayCircle className='text-red-600 text-2xl' />
              </div>
            </div>
          ))}
        </div>
      )}
       

        <div className='mt-24'>
          <div className='flex justify-between items-center'>
            <h1 className='font-semibold text-3xl text-white ml-6 mb-7'>Popular Albums</h1>
          </div>
          {loading ? (
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
            <div className='flex overflow-x-auto snap-x gap-4 overflow-y-hidden transition duration-300 ease-in-out' ref={scrollElement}>
              {relatedAlbums.map((album, index) => (
                <Link to={`/album/${album.id}`}>
                <div key={index} className='min-w-56 min-h-64 hover:bg-neutral-800 flex justify-center rounded-lg cursor-pointer relative'>
                  <div className='w-52 min-h-64'>
                    <div className='flex justify-center mt-3'>
                      <img src={album.images[0].url} alt={album.name} className='w-52 h-52 rounded-lg' />
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
        

         {/* Related Artists */}
         <div className='w-full mt-24 mb-20'>
          <div className='flex justify-between items-center'>
            <h1 className='font-semibold text-3xl text-white ml-6 mb-7'>Artists</h1>
          </div>
          {loading ? (
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
            <div className='flex overflow-x-auto snap-x gap-4 overflow-y-hidden transition duration-300 ease-in-out' ref={scrollElements}>
              {relatedArtists.map((artist, index) => (
                <Link to={`/artist/${artist.id}`}>
                <div key={index} className='min-w-56 min-h-64 hover:bg-neutral-800 flex justify-center rounded-lg cursor-pointer relative'>
                  <div className='w-52 min-h-64'>
                    <div className='flex justify-center mt-3'>
                      <img src={artist.images[0].url} alt={artist.name} className='w-52 h-52 rounded-full' />
                    </div>
                    <div className='mt-2'>
                      <h1 className='font-semibold text-white text-ellipsis line-clamp-1'>{artist.name}</h1>
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
  );
}

export default Album;
