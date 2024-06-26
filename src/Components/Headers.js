import React from 'react'
import logo from '../Image/logo-removebg-preview.png'

const Headers = () => {
  return (
    <div className='w-full shadow-lg shadow-gray-700/5 bg-neutral-950  ml-auto flex  justify-center ' >
      <div className='flex text-center items-center'>
        <img  src= {logo} alt='LOGO' className='w-11 h-11'/>
        <h2 className=' text-red-600 font-bold text-2xl'><spam className='text-3xl' >i</spam>Music</h2>
      </div>
    </div>
  )
}

export default Headers
