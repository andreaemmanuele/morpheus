import type { ReactNode } from 'react'
import type Mail from 'nodemailer/lib/mailer'
import { renderToStaticMarkup } from 'react-dom/server'
import nodemailer from 'nodemailer'
import juice from 'juice'
import chalk from 'chalk'

export const sendEmail = async (content: ReactNode, options: Mail.Options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT as string),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  try {
    await transporter.verify()
    const htmlContent = renderToStaticMarkup(content)

    let inlinedHtml: string = ''
    try {
      inlinedHtml = juice(`<!DOCTYPE html>${htmlContent}`, {
        removeStyleTags: false,
        applyStyleTags: true,
        preserveImportant: true,
        preserveMediaQueries: true,
        preserveFontFaces: true,
      })
    } catch (juiceError) {
      console.warn('Juice error, falling back to non-inlined HTML:', juiceError)
      inlinedHtml = htmlContent
    }

    const { accepted, rejected } = await transporter.sendMail({
      ...options,
      from: `"${process.env.APP_NAME}" <${process.env.SMTP_USER}>`,
      html: inlinedHtml,
    })

    if (rejected.length) console.log(chalk.red('🚨 Failed to send email'))
    if (accepted.length) console.log(chalk.green('🚀 Email sent successfully'))
  } catch (e) {
    throw e
  }
}
