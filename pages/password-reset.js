import React, { useState } from 'react'
import { Field, Form } from 'react-final-form'
import { composeValidators, emailValidation, required } from '@utils/form-validators'
import Link from 'next/link'
import Button from '@components/button'
import { registerService } from '@services/index'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useLang } from '@hooks/useLang'
import LangForm from '@components/lang-form'
import { showErrorMessage } from '@utils/helpers'
import Head from 'next/head'
import ReCAPTCHA from 'react-google-recaptcha'

function PasswordReset(props) {
  const DEVELOPMENT_MODE = process.env.DEVELOPMENT

  const router = useRouter()

  const [verificationKey, setVerificationKey] = useState(false)
  const [email, setEmail] = useState(false)
  const { lang, setLang, translations, languages } = useLang()
  const T = translations

  const [recaptcha, setRecaptcha] = useState()
  const [recaptcha2, setRecaptcha2] = useState()

  const onChange = (value) => {
    setRecaptcha(value)
  }

  const onChange2 = (value) => {
    setRecaptcha2(value)
  }

  const onRequestVerificationCode = async (values, form) => {
    values.languageKey = lang
    if (!recaptcha && !DEVELOPMENT_MODE) {
      return toast.error('Recaptcha is required.')
    }

    values.recaptcha_token = recaptcha || "test"

    try {
      const { verification_key } = await registerService.onRequestVerificationCode(values)
      setVerificationKey(verification_key)
      setEmail(values.email)
    } catch (e) {
      if(!DEVELOPMENT_MODE) {
        window.grecaptcha.reset()
      }
      return toast.error(T[showErrorMessage(e.message)])
    }
  }

  const onChangePassword = async (values, form) => {
    values.verification_key = verificationKey
    values.email = email

    if (!recaptcha2 && !DEVELOPMENT_MODE) {
      return toast.error('Recaptcha is required.')
    }

    values.recaptcha_token = recaptcha2 || "test"

    try {
      await registerService.onChangePassword(values)
      router.push('/login')
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
        <title>{T['Page.Login.ForgotPasswordLink.Caption']}</title>
      </Head>
      <div
        style={{ backgroundImage: "url('/images/template/background.png')" }}
        className="min-h-screen h-screen bg-cover bg-center w-full flex items-center justify-center z-10 login-container"
      >
        <div className="limiter">
          <div className="container-login100 page-background">
            <div className="wrap-login100">
              <h1 className="login100-form-title p-b-34 p-t-27">
                {T['Page.ResetPassword.Title.Caption']}
              </h1>
              <Form
                onSubmit={onRequestVerificationCode}
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
                        <>
                          {verificationKey &&
                          <p className="txt-small-heading flex">{T['Page.ResetPassword.EmailLabel.Caption']}</p>}
                          <div className="wrap-input100">
                            <input
                              {...input}
                              placeholder={T['Page.ResetPassword.EmailTextbox.Caption']}
                              disabled={verificationKey}
                              className={`input100 text-left`}
                              style={lang === 'Heb' ? { direction: 'ltr' } : {}}
                            />
                            <span className="focus-input100" data-placeholder="&#xf207;"></span>
                          </div>
                        </>
                      )}
                    </Field>
                    {!verificationKey && (
                      <ReCAPTCHA
                        sitekey="6LfTGd8ZAAAAAAjob6p9FoV79fTdj3oP8IAq0vwX"
                        onChange={onChange}
                      />
                    )}
                    <div className={`container-login100-form-btn mt-5 ${verificationKey && 'd-none'}`}>
                      <Button
                        classList="login100-form-btn"
                        disabled={submitting || pristine}
                        loading={submitting}
                        text={T['Page.ResetPassword.SendAction.Caption']}
                      />
                    </div>
                  </form>
                )}
              />
              {verificationKey &&
              <Form
                onSubmit={onChangePassword}
                render={({ handleSubmit, submitting, pristine }) => (
                  <form onSubmit={handleSubmit}>
                    <Field
                      type="text"
                      name="verification_code"
                      validate={composeValidators(
                        required
                      )}
                    >
                      {({ input, meta }) => (
                        <>
                          <p className="txt-small-heading flex">{T['Page.ResetPassword.SecretCodeLabel.Caption']}</p>
                          <div className="wrap-input100">
                            <input
                              {...input}
                              placeholder={T['Page.ResetPassword.SecretCodeTextbox.Caption']}
                              className={`input100 text-left`}
                              autoComplete="off"
                            />
                            <span className="focus-input100" data-placeholder="&#xf207;"></span>
                          </div>
                        </>
                      )}
                    </Field>
                    <Field
                      type="password"
                      name="password"
                      validate={composeValidators(required)}
                    >
                      {({ input, meta }) => (
                        <>
                          <div className="wrap-input100">
                            <input
                              {...input}
                              autoComplete="off"
                              placeholder={T['Page.ResetPassword.PasswordTextbox.Caption']}
                              className={`input100 text-left`}
                              style={lang === 'Heb' ? { direction: 'ltr' } : {}}
                            />
                            <span className="focus-input100" data-placeholder="&#xf191;"></span>
                          </div>
                        </>
                      )}
                    </Field>
                    <ReCAPTCHA
                      sitekey="6LfTGd8ZAAAAAAjob6p9FoV79fTdj3oP8IAq0vwX"
                      onChange={onChange2}
                    />
                    <div className="container-login100-form-btn mt-5">
                      <Button
                        classList="login100-form-btn"
                        disabled={submitting || pristine}
                        loading={submitting}
                        text={T['Page.ResetPassword.SaveAction.Caption']}
                      />
                    </div>
                  </form>
                )}
              />
              }
              <div className="text-center p-t-30 mt-3">
                <p>{T['Page.ResetPassword.OrText.Caption']}</p>
                <Link href="/login">
                  <a className="txt1">{T['Page.ResetPassword.LoginLink.Caption']}</a>
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

export default PasswordReset