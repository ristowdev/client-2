import React from 'react'
import Loader from 'react-loader-spinner'

export default function ContainerLoader() {
  return (
    <div
      className="d-flex align-items-center justify-content-center text-center"
      style={{minHeight: '80vh', opacity: '0.8'}}
    >
      <Loader type="Oval" color="#222C3C" height={50} width={50} />
    </div>
  )
}