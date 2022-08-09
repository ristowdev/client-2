import React from 'react'
import Modal from 'react-responsive-modal'

function Popup({ modalIsOpen, onCloseModal, header, children, activityFactors, classNames }) {
  return (
    <div>
      <Modal
        ariaHideApp={false}
        open={modalIsOpen}
        onClose={onCloseModal}
        center
        classNames={classNames}
      >
        <div className="flex">
          {header && <h4 className="lg:text-3xl text-base">{header}</h4>}
        </div>
        {activityFactors ? children : (
          <div className="mt-3">
            {children}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default React.memo(Popup)