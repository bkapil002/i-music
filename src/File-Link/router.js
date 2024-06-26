 import { createBrowserRouter } from "react-router-dom";
 import App from '../App'
 import SideHome from '../Page/SideHome.js'
 import Home from '../Page/Home.js'
 import Search from '../Page/Search.js'
import ArtistPage from "../Page/ArtistPage.js";
import Album from "../Page/Album.js";
import Shado from "../Components/Shado.js";
 const router = createBrowserRouter([
         
    {
        path:'/',
        element:<App/>,
        children:[{
            path:'',
            element:<SideHome/>,
            children:[{
                path:'',
                element:<Home/>,
            },
            {
                path:'search',
                element:<Search/>
            },
            {
                path:'artist/:id', 
                element:<ArtistPage/>
            },
            {
                path:'album/:id',
                element:<Album/>
            },{
                path:'shado/:id',
                element:<Shado/>
            }
        ]
        }]
    }

 ])

 export default router;