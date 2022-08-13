import React, { useEffect, useState } from 'react'
import { Field, Form } from 'react-final-form'
import { composeValidators, emailValidation, required } from '@utils/form-validators'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Button from '@components/button'
import { useAuth } from '@hooks/useAuth'
import { useLang } from '@hooks/useLang'
import LangForm from '@components/lang-form'
import { capitalizeFirstLetter, showErrorMessage } from '@utils/helpers'
import ReCAPTCHA from "react-google-recaptcha"
import Head from 'next/head'

function Login() {
  const DEVELOPMENT_MODE = process.env.DEVELOPMENT

  const router = useRouter()
  const { login, login2 } = useAuth()
  const { lang, setLang, translations, languages } = useLang()
  const T = translations

  const [recaptcha, setRecaptcha] = useState()

  const onChange = (value) => {
    setRecaptcha(value)
  }

  useEffect(() => {
    if (router.query.lang) {
      setLang(capitalizeFirstLetter(router.query.lang))
      router.replace('/login', undefined, { shallow: true })
    }
  }, [router])

  const onLogin = async (values, form) => {
    if (!recaptcha && !DEVELOPMENT_MODE) {
      return toast.error('Recaptcha is required.')
    }

    values.recaptcha_token = recaptcha || "test"

    try {
      if(DEVELOPMENT_MODE) {
        await login(values)
      }else {
        await login2(values)
      }
      router.push('/')
    } catch (e) {
      if(!DEVELOPMENT_MODE) {
        window.grecaptcha.reset()
      }
      return toast.error(T[showErrorMessage(e.message)])
    }
  }

  return (
    <>
      <Head>
        <title>{T['Page.Login.LoginAction.Caption']}</title>
      </Head>
      <div
        style={{ backgroundImage: "url('/images/template/background.png')" }}
        className="min-h-screen h-screen bg-cover bg-center w-full flex items-center justify-center z-10 login-container"
      >
        <div className="limiter">
          <div className="container-login100 page-background">
            <div className="wrap-login100">
              <h1 className="login100-form-title p-b-34 p-t-27">
                {T['Page.Login.Title.Caption']}
              </h1>
              <Form
                onSubmit={onLogin}
                render={({ handleSubmit, submitting, pristine }) => (
                  <form onSubmit={handleSubmit}>
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
                            placeholder={T['Page.Login.EmailTextbox.Caption']}
                            className={`input100 text-left`}
                            style={lang === 'Heb' ? { direction: 'ltr' } : {}}
                          />
                          <span className="focus-input100" data-placeholder="&#xf207;"/>
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
                            placeholder={T['Page.Login.PasswordTextbox.Caption']}
                            className={`input100 text-left`}
                            style={lang === 'Heb' ? { direction: 'ltr' } : {}}
                          />
                          <span className="focus-input100" data-placeholder="&#xf191;"/>
                        </div>
                      )} 
                    </Field>
                    {!DEVELOPMENT_MODE && (
                      <ReCAPTCHA
                        sitekey="6LfTGd8ZAAAAAAjob6p9FoV79fTdj3oP8IAq0vwX"
                        onChange={onChange}
                      />
                    )}
                    <div className="container-login100-form-btn mt-3">
                      <Button
                        classList="login100-form-btn"
                        // disabled={submitting || pristine || (!DEVELOPMENT_MODE && !recaptcha)}
                        disabled={submitting || pristine || (!DEVELOPMENT_MODE && recaptcha)}
                        loading={submitting}
                        text={T['Page.Login.LoginAction.Caption']}
                      />
                    </div>
                  </form>
                )}
              />
              <div className="text-center p-t-30 mt-3 text-right">
                <Link href="/password-reset">
                  <a className="txt1">{T['Page.Login.ForgotPasswordLink.Caption']}</a>
                </Link>
              </div>
              <div className="text-center p-t-30 mt-3">
                <p>{T['Page.Login.OrText.Caption']}</p>
                <Link href="/register">
                  <a className="txt1">{T['Page.Login.RegisterLink.Caption']}</a>
                </Link>
              </div>
              <div className="h-1c§ bg-red-50 w-100 mt-5"/>
              <LangForm languages={languages} lang={lang} setLang={setLang}/>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login