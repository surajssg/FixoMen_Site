import nodemailer from 'nodemailer'
import { randomUUID } from 'node:crypto'

const productSize = '50 g'
const productUnitPrice = 350
const requestWindowMs = 15 * 60 * 1000
const requestLimit = 6
const requestCounts = new Map()

const trimmedString = (value, maxLength) => {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
})[character])

const renderEmail = (title, sections) => {
  const sectionHtml = sections.map(({ heading, rows }) => `
    <tr><td style="padding:24px 28px 8px;color:#8a6d30;font-size:12px;font-weight:bold;text-transform:uppercase;">${escapeHtml(heading)}</td></tr>
    <tr><td style="padding:0 28px 12px;"><table role="presentation" style="width:100%;border-collapse:collapse;">
      ${rows.map(([label, value]) => `<tr><td style="padding:10px 12px;border-bottom:1px solid #e8e5de;color:#68645e;font-size:13px;vertical-align:top;width:36%;">${escapeHtml(label)}</td><td style="padding:10px 12px;border-bottom:1px solid #e8e5de;color:#232323;font-size:14px;line-height:1.5;overflow-wrap:anywhere;">${escapeHtml(value).replace(/\r\n|\r|\n/g, '<br>')}</td></tr>`).join('')}
    </table></td></tr>`).join('')

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;padding:24px 12px;background:#f3f3f1;font-family:Arial,sans-serif;"><table role="presentation" style="width:100%;max-width:620px;margin:0 auto;border-collapse:collapse;background:#ffffff;"><tr><td style="padding:26px 28px;background:#171717;color:#ffffff;"><p style="margin:0 0 12px;color:#d4ad58;font-size:13px;font-weight:bold;">FIXO MEN</p><h1 style="margin:0;font-size:24px;line-height:1.25;">${escapeHtml(title)}</h1></td></tr>${sectionHtml}<tr><td style="padding:20px 28px;background:#171717;color:#cfcfcf;font-size:12px;line-height:1.5;">FIXO MEN &middot; Website notification</td></tr></table></body></html>`
}

const allowEmailRequest = (request, response) => {
  const forwardedFor = request.headers['x-forwarded-for']
  const clientIp = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)?.split(',')[0].trim()
    || request.socket?.remoteAddress
    || 'unknown'
  const now = Date.now()
  let bucket = requestCounts.get(clientIp)

  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + requestWindowMs }
  }

  if (bucket.count >= requestLimit) {
    response.setHeader?.('Retry-After', String(Math.ceil((bucket.resetAt - now) / 1000)))
    response.set?.('Retry-After', String(Math.ceil((bucket.resetAt - now) / 1000)))
    response.status(429).json({ error: 'Too many requests. Please try again later.' })
    return false
  }

  bucket.count += 1
  requestCounts.set(clientIp, bucket)
  return true
}

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

const sendOwnerEmail = async ({ subject, text, replyTo, title, sections }) => {
  const transporter = createTransporter()
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.CONTACT_EMAIL,
    replyTo,
    subject,
    text,
    html: renderEmail(title, sections),
  })
}

const handleDeliveryError = (response, error) => {
  if (error.code === 'EMAIL_NOT_CONFIGURED') {
    return response.status(503).json({ error: 'Email is not configured on the server yet.' })
  }

  console.error('Email delivery failed:', {
    code: error.code || 'unknown error',
    command: error.command,
    responseCode: error.responseCode,
    syscall: error.syscall,
    address: error.address,
    port: error.port,
  })
  return response.status(502).json({
    error: 'The email could not be sent. Please try again.',
    code: error.code || 'SMTP_SEND_FAILED',
  })
}

export const emailHealth = (_request, response) => {
  const smtpConfigurationPresent = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_EMAIL']
    .every((key) => Boolean(process.env[key]))
  response.json({ api: 'ok', smtpConfigurationPresent })
}

export const sendEnquiry = async (request, response) => {
  if (!allowEmailRequest(request, response)) return

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
      title: 'New website enquiry',
      sections: [
        { heading: 'Contact details', rows: [['Name', name], ['Email', email]] },
        { heading: 'Message', rows: [['Enquiry', message]] },
      ],
    })
    return response.json({ message: 'Enquiry sent.' })
  } catch (error) {
    return handleDeliveryError(response, error)
  }
}

export const sendBulkEnquiry = async (request, response) => {
  if (!allowEmailRequest(request, response)) return

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
      title: 'New bulk purchase enquiry',
      sections: [
        { heading: 'Business details', rows: [['Buyer type', buyerType], ['Business', company], ['Estimated quantity', `${quantity} units`]] },
        { heading: 'Contact details', rows: [['Contact person', name], ['Email', email], ['Phone', phone]] },
        { heading: 'Message', rows: [['Enquiry', message || 'No additional message provided.']] },
      ],
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
}

export const sendOrder = async (request, response) => {
  if (!allowEmailRequest(request, response)) return

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
      title: 'New hair wax order request',
      sections: [
        { heading: 'Order details', rows: [['Reference', orderReference], ['Product', `FIXO MEN Premium Hair Wax (${productSize})`], ['Quantity', quantity], ['Unit price', `Rs. ${productUnitPrice}/-`], ['Product total (shipping not included)', `Rs. ${productUnitPrice * quantity}/-`]] },
        { heading: 'Customer details', rows: [['Name', name], ['Email', email], ['Phone', phone], ['Delivery address', address]] },
      ],
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
}