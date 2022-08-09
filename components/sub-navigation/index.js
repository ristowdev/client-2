import React from 'react'
import { toast } from 'react-toastify'
import { showErrorMessage } from '@utils/helpers'
import { patientService } from '@services/index'
import { useRouter } from 'next/router'
import { useLang } from '@hooks/useLang'

function SubNavigation({ image, header, children, deletePatient, translation, token, clinicId, patientId, patientDetails }) {
  const router = useRouter()
  const T = translation

  const onDeletePatient = async () => {
    const values = {
      patient_id: patientId,
      token,
      clinic_id: clinicId
    }

    try {
      await patientService.deletePatient(values)
      router.push('/patients')
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }
  }

  const { lang } = useLang()

  return (
    <div className="flex relative items-center">
      {patientDetails &&
        <i
          className={`${lang === 'Heb' ? 'fa fa-arrow-right ml-5' : 'fa fa-arrow-left mr-5'} text-xl cursor-pointer`}
          onClick={() => router.back()}
        />
      }
      <img src={image}/>
      <div className="mx-3 w-full">
        <div className="flex justify-between items-center ">
          {patientDetails ? (
            <h4>{header}</h4>
          ) : (
            <h3 className="-mt-2 mb-2">{header}</h3>
          )}
          {deletePatient &&
          <li className="dropdown">
            <a className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
              <i className="material-icons">more_vert</i>
            </a>
            <ul className={`dropdown-menu dropdown-menu-default ${lang === 'Heb' ? 'left-0' : 'right-10'} p-3`}>
              <li
                className="flex items-center cursor-pointer"
                onClick={() => onDeletePatient()}
              >
                <i className="material-icons text-red-500">delete</i>
                {T['Page.PatientPages.DeletePatientAction.Caption']}
              </li>
            </ul>
          </li>
          }
        </div>
        {children && !patientDetails &&
          <div className="border-bottom flex sub-nav">
            {children}
          </div>
        }
        {patientDetails &&
          <div className="border-bottom flex sub-nav">
            {children}
          </div>
        }
      </div>
    </div>
  )
}

export default SubNavigation