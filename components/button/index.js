import React from 'react'
import Loader from 'react-loader-spinner'

function Button({ classList, disabled, loading, buttonSpinnerColor, text, onClick }) {
  return (
    <button
      className={classList}
      onClick={onClick}
      disabled={disabled}
    >
      {loading ?
        <Loader type="ThreeDots" color={buttonSpinnerColor || "#222C3C"} height={20} width={20}/>
        :
        text
      }
    </button>
  )
}

export default Button