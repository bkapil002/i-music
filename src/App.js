import Headers from './Components/Headers'
import { Outlet } from 'react-router-dom';
import MusicPlayer from '../src/Page/MusicPlayer'
import { SongProvider } from './Context/SongContext';


function App() {
  
  return (
    <SongProvider>
    <div>
   
      <div>
      <Headers/>
      <main className='min-h-[calc(100vh-120px)] -mb-14'>
       <Outlet />
       </main>
       <div className='mt-5'>
       <div className='fixed bottom-0 left-0 right-0'><MusicPlayer/></div>
       </div>
       </div>
       
    </div>
    </SongProvider>
  );
}

export default App;
