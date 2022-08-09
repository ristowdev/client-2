import React, { useEffect } from 'react'
import { Field, Form } from 'react-final-form'
import { composeValidators, emailValidation, required } from '@utils/form-validators'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Button from '@components/button'
import { registerService } from '@services/index'
import { useAuth } from '@hooks/useAuth'
import { useLang } from '@hooks/useLang'
import LangForm from '@components/lang-form'
import { capitalizeFirstLetter, showErrorMessage } from '@utils/helpers'
import Head from 'next/head'

function Register() {
  const router = useRouter()
  const { register } = useAuth()
  const { lang, setLang, translations, languages } = useLang()
  const T = translations

  useEffect(() => {
    if(router.query.lang) {
      setLang(capitalizeFirstLetter(router.query.lang))
      router.replace('/register', undefined, { shallow: true })
    }
  }, [router])

  const onRegister = async (values, form) => {
    try {
      const currentDate = Intl.DateTimeFormat().resolvedOptions().timeZone
      const { win_time_zone } = await registerService.getTimeZone({ iana: currentDate })
      values.time_zone = win_time_zone
      await register(values)
      router.push('/')
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }
  }

  return (
    <>
      <Head>
        <title>{T['Page.Register.RegisterAction.Caption']}</title>
      </Head>
      <div
        style={{ backgroundImage: "url('/images/template/background.png')" }}
        className="lg:min-h-screen h-full bg-cover bg-center w-full flex items-center justify-center z-10 login-container"
      >
        <div className="limiter">
          <div className="container-login100 page-background">
            <div className="wrap-login100">
              <h1 className="login100-form-title p-b-34 p-t-27">
                {T['Page.Register.Title.Caption']}
              </h1>
              <Form
                onSubmit={onRegister}
                render={({ handleSubmit, submitting, pristine }) => (
                  <form onSubmit={handleSubmit}>
                    <Field
                      type="text"
                      name="first_name"
                      validate={composeValidators(
                        required
                      )}
                    >
                      {({ input, meta }) => (
                        <div className="wrap-input100">
                          <input
                            {...input}
                            placeholder={T['Page.Register.FirstNameTextbox.Caption']}
                            className={`input100 ${lang === 'Heb' ? 'text-right' : 'text-left'}`}
                            style={lang === 'Heb' ? { direction: 'rtl' } : {}}
                          />
                          <span className="focus-input100" data-placeholder="&#xf207;"/>
                        </div>
                      )}
                    </Field>
                    <Field
                      type="text"
                      name="last_name"
                      validate={composeValidators(
                        required
                      )}
                    >
                      {({ input, meta }) => (
                        <div className="wrap-input100">
                          <input
                            {...input}
                            placeholder={T['Page.Register.LastNameTextbox.Caption']}
                            className={`input100 ${lang === 'Heb' ? 'text-right' : 'text-left'}`}
                            style={lang === 'Heb' ? { direction: 'rtl' } : {}}
                          />
                          <span className="focus-input100" data-placeholder="&#xf207;"/>
                        </div>
                      )}
                    </Field>
                    <Field
                      type="text"
                      name="email"
                      validate={composeValidators(
                        required,
                        emailValidation,
                      )}
                    >
                      {({ input, meta }) => (
                        <div className="wrap-input100">
                          <input
                            {...input}
                            placeholder={T['Page.Register.EmailTextbox.Caption']}
                            className={`input100 text-left`}
                            style={lang === 'Heb' ? { direction: 'ltr' } : {}}
                          />
                          <span className="focus-input100" data-placeholder="&#xf207;"></span>
                        </div>
                      )}
                    </Field>
                    <Field
                      type="text"
                      name="clinic_name"
                      validate={composeValidators(
                        required,
                      )}
                    >
                      {({ input, meta }) => (
                        <div className="wrap-input100">
                          <input
                            {...input}
                            placeholder={T['Page.Register.ClinicNameTextbox.Caption']}
                            className={`input100 ${lang === 'Heb' ? 'text-right' : 'text-left'}`}
                            style={lang === 'Heb' ? { direction: 'rtl' } : {}}
                          />
                          <span className="focus-input100" data-placeholder="&#xf207;"></span>
                        </div>
                      )}
                    </Field>
                    <Field
                      type="password"
                      name="password"
                      validate={composeValidators(required)}
                    >
                      {({ input, meta }) => (
                        <div className="wrap-input100">
                          <input
                            {...input}
                            placeholder={T['Page.Register.PasswordTextbox.Caption']}
                            className={`input100 text-left`}
                            style={lang === 'Heb' ? { direction: 'ltr' } : {}}
                          />
                          <span className="focus-input100" data-placeholder="&#xf191;"></span>
                        </div>
                      )}
                    </Field>
                    <div className="container-login100-form-btn">
                      <Button
                        classList="login100-form-btn"
                        disabled={submitting || pristine}
                        loading={submitting}
                        text={T['Page.Register.RegisterAction.Caption']}
                      />
                    </div>
                  </form>
                )}
              />
              <div className="text-center p-t-30 mt-5">
                <p>{T['Page.Register.OrText.Caption']}</p>
                <Link href="/login">
                  <a className="txt1">{T['Page.Register.LoginLink.Caption']}</a>
                </Link>
              </div>
              <div className="h-1 bg-red-50 w-100 mt-5"></div>
              <LangForm languages={languages} lang={lang} setLang={setLang}/>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register