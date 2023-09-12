import React from 'react'

import './ConfirmDial.css'

const ConfimDial = ({ isOpen, subject, validationFunc, cancelFunc }) => {

  const content = (
    <div className={isOpen ? "dial" : "nodial"}>
      <div className={isOpen ? "confirm-dial confirm-dial-show" : "confirm-dial"}>
        <div className="subtitle">
          <h4>Confirmation</h4>
          <span>{subject}</span>
        </div>
        <p>Es tu sûr(e) de vouloir de vouloir continuer ?</p>

        <div className="validation-field">
          <button className="btn btn-confirm" onClick={validationFunc} >Valider</button>
          <button className="btn btn-cancel" onClick={cancelFunc} >Annuler</button>
        </div>
      </div>
    </div>
  )

  return content
}

export default ConfimDial