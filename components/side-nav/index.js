import React, { useEffect } from 'react'
import Link from '@components/link'
import { useLang } from '@hooks/useLang'
import ClinicSelect from '@components/clinic-select'
import LanguageSelect from '@components/language-select'
import { useClinic } from '@hooks/useClinic'

function SideNav() {
  const { userDetails } = useClinic()
  const { translations, lang } = useLang()
  const T = translations

  useEffect(() => {
    const body = document.getElementsByTagName('body')[0]
    if (lang === 'Heb') {
      body.classList.add('sidemenu-container-reversed')
    } else {
      body.classList.remove('sidemenu-container-reversed')
    }
  }, [lang])

  return (
    <div className="sidebar-container">
      <div className="sidemenu-container navbar-collapse collapse fixed-menu">
        <div id="remove-scroll" className="left-sidemenu">
          <ul className="sidemenu page-header-fixed slimscroll-style" data-keep-expanded="false"
              data-auto-scroll="true" data-slide-speed="200">
            <li className="sidebar-toggler-wrapper hide">
              <div className="sidebar-toggler">
                <span></span>
              </div>
            </li>
            <li className="sidebar-user-panel">
              <div className="user-panel flex items-center cursor-pointer">
                <ClinicSelect/>
              </div>
            </li>
            <Link href="/" activeClassName="active">
              <li className="nav-item flex w-full">
                <a className="nav-link nav-toggle w-full flex">
                  <i className={`material-icons ${lang === 'Heb' && 'mr-0 ml-3'}`}>dashboard</i>
                  <span className="title">{T['Page.Master.OverviewLink.Caption']}</span>
                </a>
              </li>
            </Link>
            <Link href="/patients" activeClassName="active">
              <li className="nav-item flex w-full">
                <a className="nav-link nav-toggle w-full flex">
                  <i className={`fas fa-address-book ${lang === 'Heb' && 'mr-0 ml-3'}`}/>
                  <span className="title">{T['Page.Master.PatientsLink.Caption']}</span>
                </a>
              </li>
            </Link>
            <Link href="/appointments" activeClassName="active">
              <li className="nav-item flex w-full">
                <a className="nav-link nav-toggle w-full flex">
                  <i className={`fas fa-calendar-alt ${lang === 'Heb' && 'mr-0 ml-3'}`}/>
                  <span className="title">{T['Page.Master.AppointmentsLink.Caption']}</span>
                </a>
              </li>
            </Link>
            <Link href="/clinic-details" activeClassName="active">
              <li className="nav-item flex w-full">
                <a className="nav-link nav-toggle w-full flex">
                  <i className={`material-icons ${lang === 'Heb' && 'mr-0 ml-3'}`}>settings</i>
                  <span className="title">{T['Page.Master.ClinicSettingsLink.Caption']}</span>
                </a>
              </li>
            </Link>
            {userDetails.is_system_admin && (
              <Link href="/members-details" activeClassName="active">
                <li className="nav-item flex w-full">
                  <a className="nav-link nav-toggle w-full flex">
                    <i className={`fas fa-user-shield ${lang === 'Heb' && 'mr-0 ml-3'}`}/>
                    <span className="title">{T['Page.Master.MembersManagement.Caption']}</span>
                  </a>
                </li>
              </Link>
            )}
          </ul>
        </div>
        <div className="relative lg:bottom-5 px-3 my-5">
          <LanguageSelect/>
        </div>
      </div>
    </div>
  )
}

export default SideNav