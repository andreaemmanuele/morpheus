import type { FastifyInstance } from 'fastify'
import type Mail from 'nodemailer/lib/mailer'
import nodemailer from 'nodemailer'
import juice from 'juice'
import { renderToStaticMarkup } from 'react-dom/server'
import { ReactNode } from 'react'

export const sendEmail = async (
  fastify: FastifyInstance,
  content: ReactNode,
  options: Mail.Options
) => {
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
    const { messageId, accepted, rejected } = await transporter.sendMail({
      ...options,
      from: `"${process.env.APP_NAME}" <${process.env.SMTP_USER}>`,
      html: juice(`<!DOCTYPE html>${htmlContent}`),
    })

    if (rejected.length) {
      fastify.log.error('Email sent failed.')
      return
    }

    if (accepted.length) {
      fastify.log.info(`Email ${messageId} sent successfully`)
    }
  } catch (e) {
    const error = e as Error
    fastify.log.error('Error: ', error.message)
  }
}
