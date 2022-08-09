import React from 'react'
import { useAuth } from '@hooks/useAuth'
import { useLang } from '@hooks/useLang'
import Link from 'next/link'
import { useClinic } from '@hooks/useClinic'

function Navigation() {
  const { userDetails, selectedClinic } = useClinic()
  const { logout } = useAuth()
  const { translations, lang } = useLang()
  const T = translations

  return (
    <div className="page-header navbar navbar-fixed-top">
      <div className="page-header-inner flex justify-between">
        <div className="page-logo flex items-center text-left">
          <Link href="/">
            <a className="logo-default text-white text-xl md:mt-3 mt-0 mb-0">
              {selectedClinic.display_name}
            </a>
          </Link>
        </div>
        <div className="top-menu flex flex-row-reverse items-center">
          <ul className="nav navbar-nav pull-right">
            <li className="dropdown dropdown-user">
              <a className="dropdown-toggle flex items-center" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                <p className="mx-3">{userDetails.display_name}</p>
                {userDetails.mini_image_url ?
                  <img
                    src={userDetails.mini_image_url}
                    className="img-circle"
                    alt="User Image"
                  /> :
                  <div className="img-circle user-init-sm flex items-center justify-center">
                    <i className="fa fa-user-o text-black"></i>
                  </div>
                }
              </a>
              <ul className={`dropdown-menu ${lang === 'Heb' && 'heb'} dropdown-menu-default`}>
                <Link href="/self-member-details">
                  <li>
                    <a>
                      <i className="fa fa-user"></i>
                      {T['Page.Master.MyProfileLink.Caption']}
                    </a>
                  </li>
                </Link>
                <Link href="/clinic-settings">
                  <li>
                    <a>
                      <i className="fa fa-cogs"></i>
                      {T['Page.Master.ClinicSettingsLink.Caption']}
                    </a>
                  </li>
                </Link>
                <li onClick={logout}>
                  <a>
                    <i className="fas fa-sign-out-alt"></i>
                    {T['Page.Master.LogOutLink.Caption']}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
          <a className="menu-toggler responsive-toggler collapsed" data-toggle="collapse"
             data-target=".navbar-collapse" aria-expanded="false">
            <span></span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Navigation
