import 'dotenv/config'
import express from 'express'
import rateLimit from 'express-rate-limit'
import nodemailer from 'nodemailer'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const app = express()
const port = Number(process.env.PORT) || 3001
const productSize = '50 g'
const productUnitPrice = 350
const projectDirectory = path.dirname(fileURLToPath(import.meta.url))
const distDirectory = path.join(projectDirectory, 'dist')
const emailLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
})

app.use(express.json({ limit: '12kb' }))

const trimmedString = (value, maxLength) => {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_EMAIL } = process.env
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !CONTACT_EMAIL) {
    const error = new Error('Email service is not configured.')
    error.code = 'EMAIL_NOT_CONFIGURED'
    throw error
  }

  const smtpPort = Number(SMTP_PORT)
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: smtpPort,
    secure: smtpPort === 465,
    requireTLS: smtpPort === 587,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
}

const sendOwnerEmail = async ({ subject, text, replyTo }) => {
  const transporter = createTransporter()
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.CONTACT_EMAIL,
    replyTo,
    subject,
    text,
  })
}

const handleDeliveryError = (response, error) => {
  if (error.code === 'EMAIL_NOT_CONFIGURED') {
    return response.status(503).json({ error: 'Email is not configured on the server yet.' })
  }

  console.error('Email delivery failed:', error.code || 'unknown error')
  return response.status(502).json({ error: 'The email could not be sent. Please try again.' })
}

app.post('/api/enquiries', emailLimit, async (request, response) => {
  const name = trimmedString(request.body?.name, 100)
  const email = trimmedString(request.body?.email, 254)
  const message = trimmedString(request.body?.message, 5000)
  const honeypot = trimmedString(request.body?.website, 200)

  if (honeypot) return response.json({ message: 'Enquiry received.' })
  if (!name || !validEmail(email) || !message) {
    return response.status(400).json({ error: 'Enter your name, a valid email address, and a message.' })
  }

  try {
    await sendOwnerEmail({
      subject: 'New FIXO MEN website enquiry',
      replyTo: email,
      text: `Website enquiry\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    })
    return response.json({ message: 'Enquiry sent.' })
  } catch (error) {
    return handleDeliveryError(response, error)
  }
})

app.post('/api/bulk-enquiries', emailLimit, async (request, response) => {
  const name = trimmedString(request.body?.name, 100)
  const company = trimmedString(request.body?.company, 150)
  const buyerType = trimmedString(request.body?.buyerType, 40)
  const email = trimmedString(request.body?.email, 254)
  const phone = trimmedString(request.body?.phone, 30)
  const quantity = Number(request.body?.quantity)
  const message = trimmedString(request.body?.message, 3000)
  const honeypot = trimmedString(request.body?.website, 200)
  const validBuyerTypes = ['Retailer', 'Distributor', 'Salon / Barbershop', 'Other']

  if (honeypot) return response.json({ message: 'Bulk enquiry received.' })
  if (
    !name || !company || !validBuyerTypes.includes(buyerType) || !validEmail(email) || !phone ||
    !Number.isInteger(quantity) || quantity < 1 || quantity > 100000
  ) {
    return response.status(400).json({ error: 'Enter valid business, contact, and estimated quantity details.' })
  }

  try {
    await sendOwnerEmail({
      subject: `FIXO MEN bulk enquiry from ${company}`,
      replyTo: email,
      text: [
        'New FIXO MEN bulk purchase enquiry',
        '',
        `Buyer type: ${buyerType}`,
        `Business: ${company}`,
        `Contact person: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Estimated quantity: ${quantity} units`,
        '',
        'Message:',
        message || 'No additional message provided.',
      ].join('\n'),
    })
    return response.json({ message: 'Bulk enquiry sent.' })
  } catch (error) {
    return handleDeliveryError(response, error)
  }
})

app.post('/api/orders', emailLimit, async (request, response) => {
  const name = trimmedString(request.body?.name, 100)
  const email = trimmedString(request.body?.email, 254)
  const phone = trimmedString(request.body?.phone, 30)
  const address = trimmedString(request.body?.address, 500)
  const quantity = Number(request.body?.quantity)
  const honeypot = trimmedString(request.body?.website, 200)

  if (honeypot) return response.json({ message: 'Order request received.' })
  if (!name || !validEmail(email) || !phone || !address || !Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
    return response.status(400).json({ error: 'Enter valid contact and delivery details before placing your order.' })
  }

  const orderReference = randomUUID().slice(0, 8).toUpperCase()

  try {
    await sendOwnerEmail({
      subject: `New FIXO MEN order request ${orderReference}`,
      replyTo: email,
      text: [
        'New hair wax order request',
        `Reference: ${orderReference}`,
        '',
        `Product: FIXO MEN Premium Hair Wax (${productSize})`,
        `Quantity: ${quantity}`,
        `Unit price: Rs. ${productUnitPrice}/-`,
        `Product total (shipping not included): Rs. ${productUnitPrice * quantity}/-`,
        '',
        'Customer details',
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Delivery address: ${address}`,
      ].join('\n'),
    })
    return response.json({ message: 'Order request sent.', reference: orderReference })
  } catch (error) {
    return handleDeliveryError(response, error)
  }
})

app.use('/api', (_request, response) => response.status(404).json({ error: 'API route not found.' }))
app.use(express.static(distDirectory))
app.use((request, response, next) => {
  if (request.method !== 'GET') return next()
  return response.sendFile(path.join(distDirectory, 'index.html'), (error) => {
    if (error) next(error)
  })
})

app.listen(port, () => {
  console.log(`FIXO MEN server listening on port ${port}`)
})