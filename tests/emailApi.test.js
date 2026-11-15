import assert from 'node:assert/strict'
import { test } from 'node:test'
import nodemailer from 'nodemailer'
import { sendBulkEnquiry, sendEnquiry, sendOrder } from '../services/emailApi.js'

test('order and enquiry emails contain escaped HTML and plain-text details', async () => {
  const originalCreateTransport = nodemailer.createTransport
  const sentMessages = []
  const environmentKeys = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_EMAIL']
  const originalEnvironment = Object.fromEntries(environmentKeys.map((key) => [key, process.env[key]]))

  Object.assign(process.env, {
    SMTP_HOST: 'smtp.example.test',
    SMTP_PORT: '587',
    SMTP_USER: 'sender@example.test',
    SMTP_PASS: 'test-password',
    CONTACT_EMAIL: 'owner@example.test',
  })
  nodemailer.createTransport = () => ({ sendMail: async (message) => { sentMessages.push(message) } })

  const response = () => ({
    statusCode: 200,
    status(code) { this.statusCode = code; return this },
    json(body) { this.body = body; return this },
  })
  const request = (body) => ({ headers: {}, socket: { remoteAddress: '127.0.0.1' }, body })

  try {
    const orderResponse = response()
    await sendOrder(request({ name: '<img src=x>', email: 'buyer@example.test', phone: '1234567890', address: 'First line\nSecond line', quantity: 2 }), orderResponse)
    const enquiryResponse = response()
    await sendEnquiry(request({ name: 'Customer', email: 'buyer@example.test', message: '<script>alert(1)</script>\nNext line' }), enquiryResponse)
    const bulkResponse = response()
    await sendBulkEnquiry(request({ name: 'Contact', company: 'A & B', buyerType: 'Distributor', email: 'buyer@example.test', phone: '1234567890', quantity: 100, message: 'Please contact me' }), bulkResponse)

    assert.equal(orderResponse.statusCode, 200)
    assert.equal(enquiryResponse.statusCode, 200)
    assert.equal(bulkResponse.statusCode, 200)
    assert.equal(sentMessages.length, 3)
    assert.match(sentMessages[0].html, /Rs\. 700\/-/)
    assert.match(sentMessages[0].text, /Product total \(shipping not included\): Rs\. 700\/-/)
    assert.match(sentMessages[0].html, /&lt;img src=x&gt;/)
    assert.match(sentMessages[0].html, /First line<br>Second line/)
    assert.match(sentMessages[1].html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;<br>Next line/)
    assert.match(sentMessages[1].text, /<script>alert\(1\)<\/script>/)
    assert.match(sentMessages[2].html, /A &amp; B/)
    assert.match(sentMessages[2].html, /100 units/)
    assert.equal(sentMessages[0].replyTo, 'buyer@example.test')
  } finally {
    nodemailer.createTransport = originalCreateTransport
    for (const key of environmentKeys) {
      if (originalEnvironment[key] === undefined) delete process.env[key]
      else process.env[key] = originalEnvironment[key]
    }
  }
})