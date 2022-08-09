import React from 'react'
import Loader from 'react-loader-spinner'

export default function FormLoader() {
  return (
    <div className="absolute flex items-center w-full h-full z-10 bg-black card card-box opacity-60 -mt-1">
      <div className="mt-72 fixed">
        <Loader type="Oval" color="#fff" height={80} width={80}/>
      </div>
    </div>
  )
}