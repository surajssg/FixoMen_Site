import { useState } from 'react'

function BulkInquiry() {
  const [sending, setSending] = useState(false)
  const [notice, setNotice] = useState('')

  const submitEnquiry = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    setSending(true)
    setNotice('Sending your bulk enquiry...')

    try {
      const response = await fetch('/api/bulk-enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData)),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'The enquiry could not be sent.')
      form.reset()
      setNotice('Your bulk enquiry has been sent. Our team will be in touch.')
    } catch (error) {
      setNotice(error.message || 'We could not send your enquiry. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="bulk-section section-pad" id="bulk">
      <div className="bulk-copy">
        <p className="eyebrow eyebrow-dark">Wholesale &amp; distribution</p>
        <h2>Buying for a business?<br /><em>Let’s talk volume.</em></h2>
        <p>For retailers, salons, barbershops, and distribution partners interested in FIXO MEN Premium Hair Wax.</p>
        <p className="bulk-note">Share your estimated quantity and business details. Our team will follow up about availability and pricing.</p>
      </div>
      <form className="bulk-form" onSubmit={submitEnquiry}>
        <div className="bulk-field">
          <label htmlFor="bulk-buyer-type">Enquiry type</label>
          <select id="bulk-buyer-type" name="buyerType" defaultValue="" required>
            <option value="" disabled>Select buyer type</option>
            <option value="Retailer">Retailer</option>
            <option value="Distributor">Distributor</option>
            <option value="Salon / Barbershop">Salon / Barbershop</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="bulk-field">
          <label htmlFor="bulk-company">Business name</label>
          <input id="bulk-company" name="company" autoComplete="organization" maxLength="150" required />
        </div>
        <div className="bulk-field">
          <label htmlFor="bulk-name">Contact person</label>
          <input id="bulk-name" name="name" autoComplete="name" maxLength="100" required />
        </div>
        <div className="bulk-field">
          <label htmlFor="bulk-quantity">Estimated units</label>
          <input id="bulk-quantity" name="quantity" type="number" min="1" max="100000" step="1" inputMode="numeric" required />
        </div>
        <div className="bulk-field">
          <label htmlFor="bulk-email">Work email</label>
          <input id="bulk-email" name="email" type="email" autoComplete="email" maxLength="254" required />
        </div>
        <div className="bulk-field">
          <label htmlFor="bulk-phone">Phone number</label>
          <input id="bulk-phone" name="phone" type="tel" autoComplete="tel" maxLength="30" required />
        </div>
        <div className="bulk-field bulk-field-wide">
          <label htmlFor="bulk-message">Anything else we should know? <span>(optional)</span></label>
          <textarea id="bulk-message" name="message" rows="3" maxLength="3000" />
        </div>
        <div className="form-trap" aria-hidden="true">
          <label htmlFor="bulk-website">Leave this field empty</label>
          <input id="bulk-website" name="website" tabIndex="-1" autoComplete="off" />
        </div>
        <button className="button button-dark" type="submit" disabled={sending}>
          {sending ? 'Sending enquiry...' : 'Request Bulk Pricing'}
        </button>
        <p className="form-notice" role="status" aria-live="polite">{notice}</p>
      </form>
    </section>
  )
}

export default BulkInquiry