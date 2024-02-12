"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Button from '../common/Button'
import Input from '../common/Input'
import styles from './Auth.module.scss'
import InfoText from './InfoText'
import { InputError } from '@/app/types'
import axios, { AxiosError } from 'axios'
import { FORGOT_PASSWORD_API_URL } from '@/app/contants'
import SuccessText from '../common/SuccessText'
import ErrorText from '../common/ErrorText'

const ForgotPassword = () => {
    const [email, setEmail] = useState<string>("")
    const [validationError, setValidationError] = useState<InputError>({})
    const [submitError, setSubmitError] = useState<string>("")
    const [apiSuccessMsg, setApiSuccessMsg] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        //validate the input
        if (email.trim() === "") {
            setValidationError({ email: "Email is required" })
        }
        else {
            setValidationError({ email: "" })
            setApiSuccessMsg("")

            try {
                setLoading(true)
                const apiRes = await axios.post(FORGOT_PASSWORD_API_URL, { email })

                if (apiRes?.data?.success) {
                    setApiSuccessMsg(apiRes?.data.msg)
                    setSubmitError("")
                }

            } catch (error) {
                setApiSuccessMsg("")

                if (error instanceof AxiosError) {
                    const errorMsg = error.response?.data?.error
                    setSubmitError(errorMsg)
                }
            }

            setLoading(false)
        }
    }

    return (
        <div className={styles.mainContainer}>
            <Link className={styles.applogo} href={"/"} >
                TechRise
            </Link>

            <form
                className={`${styles.form} ${styles.forgotPasswordForm}`}
                onSubmit={handleForgotPassword}
            >
                <h2 className={styles.title}> Forgot Password </h2>

                <Input
                    label={"Email"}
                    name={"email"}
                    onChange={handleInputChange}
                    error={validationError.email}
                />

                <Button
                    type={"submit"}
                    loading={loading}
                >
                    Submit
                </Button>

                {
                    apiSuccessMsg &&
                    <SuccessText text={apiSuccessMsg} />
                }

                <InfoText
                    text={"Go back to"}
                    linkTitle={"Login"}
                    linkHref={"/"}
                />

                {
                    submitError &&
                    <ErrorText text={submitError} />
                }

            </form>
        </div>
    )
}

export default ForgotPassword