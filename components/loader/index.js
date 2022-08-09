import React from 'react'
import Loader from 'react-loader-spinner'

export default function PageLoader() {
  return (
    <div
      className="d-flex align-items-center justify-content-center text-center"
      style={{minHeight: '100vh', backgroundColor: '#222C3C', opacity: '0.8'}}
    >
      <Loader type="Oval" color="#fff" height={100} width={100} />
    </div>
  )
}