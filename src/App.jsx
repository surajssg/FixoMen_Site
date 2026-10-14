import { useEffect, useState } from 'react'
import './App.css'

const product = {
  id: 'fixo-premium-hair-wax',
  name: 'FIXO MEN Premium Hair Wax',
  size: '50 g',
  priceLabel: 'Price to be confirmed',
  description:
    'A premium cream hair wax that provides long-lasting hold, texture and definition without stickiness. Helps create structured hairstyles while keeping hair soft, manageable and natural-looking.',
}

const highlights = [
  { icon: 'hold', title: 'Strong & Flexible Hold', copy: 'Shape that stays touchable.' },
  { icon: 'texture', title: 'Texture & Definition', copy: 'Bring natural movement into focus.' },
  { icon: 'control', title: 'Frizz Control', copy: 'Keep flyaways in check.' },
  { icon: 'feather', title: 'Lightweight Feel', copy: 'A non-sticky finish, without the weight.' },
]

const reasons = [
  { icon: 'spark', title: 'Defined Styling', copy: 'Shape your hairstyle with texture and definition.' },
  { icon: 'hold', title: 'Flexible Hold', copy: 'Keep your style in place while maintaining manageable hair.' },
  { icon: 'sun', title: 'Matte Finish', copy: 'Create a clean, natural-looking finish without excessive shine.' },
  { icon: 'refresh', title: 'Easy Restyling', copy: 'Refresh your look and adjust your hairstyle throughout the day.' },
]

const howTo = [
  { image: 'product-1.png', title: 'Take a little', copy: 'Start with a small amount of wax.' },
  { image: 'RUB-2.png', title: 'Warm it up', copy: 'Rub it evenly between your palms.' },
  { image: 'apply-3.png', title: 'Work it through', copy: 'Apply to dry or slightly damp hair.' },
  { image: 'style-4.png', title: 'Make it yours', copy: 'Style with your fingers or a comb.' },
]

const looks = [
  { image: 'textured-quiff.png', title: 'Textured Quiff', number: '01' },
  { image: 'classic-side-part.png', title: 'Classic Side Part', number: '02' },
  { image: 'casual-style.png', title: 'Casual Style', number: '03' },
  { image: 'messy-texture.png', title: 'Messy Texture', number: '04' },
]

const navigation = [
  ['Home', '#home'],
  ['Shop', '#shop'],
  ['Why FIXO', '#why-fixo'],
  ['How to Use', '#how-to'],
  ['About Us', '#about'],
  ['Contact Us', '#contact'],
]

const iconPaths = {
  hold: <><path d="M12 3 5 6v5c0 4.4 2.8 8.1 7 10 4.2-1.9 7-5.6 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>,
  texture: <><path d="M4 7c2.4 0 2.4-2 4.8-2s2.4 2 4.8 2 2.4-2 4.8-2" /><path d="M4 12c2.4 0 2.4-2 4.8-2s2.4 2 4.8 2 2.4-2 4.8-2" /><path d="M4 17c2.4 0 2.4-2 4.8-2s2.4 2 4.8 2 2.4-2 4.8-2" /></>,
  control: <><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8m0-12.8L5.6 18.4" /><circle cx="12" cy="12" r="7" /></>,
  feather: <><path d="M20.5 3.5C12 3.5 5 7.1 5 13.5a5 5 0 0 0 5 5c6.4 0 10-7 10.5-15Z" /><path d="M3.5 21c3.5-5 7-7.5 12-10" /></>,
  spark: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.5 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.5-3" /></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
  bag: <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
  phone: <><path d="M8 3H5a2 2 0 0 0-2 2c0 8.8 7.2 16 16 16a2 2 0 0 0 2-2v-3l-5-2-2 3a14 14 0 0 1-7-7l3-2-2-5Z" /></>,
  pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  arrow: <><path d="M4 12h15m-6-6 6 6-6 6" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m4 7 8 6 8-6" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  minus: <path d="M5 12h14" />,
}

function Icon({ name, size = 20, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  )
}

function ImagePanel({ files, alt, className = '', fallbackTitle = 'FIXO MEN', fallbackCopy = 'Product photography coming soon' }) {
  const [fileIndex, setFileIndex] = useState(0)
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={`image-fallback ${className}`} role="img" aria-label={`${alt}. ${fallbackCopy}`}>
        <span className="fallback-monogram">F</span>
        <span className="fallback-title">{fallbackTitle}</span>
        <span className="fallback-copy">{fallbackCopy}</span>
      </div>
    )
  }

  return (
    <img
      className={className}
      src={`/Project_Images/${files[fileIndex]}`}
      alt={alt}
      onError={() => {
        if (fileIndex < files.length - 1) setFileIndex((index) => index + 1)
        else setFailed(true)
      }}
    />
  )
}

function Brand({ footer = false }) {
  const [logoFailed, setLogoFailed] = useState(false)
  return (
    <a className={`brand${footer ? ' brand-footer' : ''}`} href="#home" aria-label="FIXO MEN home">
      {!logoFailed && <img src="/Project_Images/logo.png" alt="" onError={() => setLogoFailed(true)} />}
      <span className="brand-wordmark">FIXO<span>MEN</span></span>
    </a>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [quantity, setQuantity] = useState(0)
  const [contactNotice, setContactNotice] = useState('')
  const [viewedImage, setViewedImage] = useState(null)
  const productMatches = product.name.toLowerCase().includes(searchTerm.trim().toLowerCase())

  useEffect(() => {
    if (!cartOpen && !viewedImage) return undefined
    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return
      if (viewedImage) setViewedImage(null)
      else setCartOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [cartOpen, viewedImage])

  const openImageViewer = (file, alt) => {
    setViewedImage({ src: `/Project_Images/${file}`, alt })
  }

  const addToCart = () => {
    setQuantity((current) => current + 1)
    setCartOpen(true)
  }

  const closeMenu = () => setMenuOpen(false)

  const submitContact = (event) => {
    event.preventDefault()
    setContactNotice('Your details are valid, but this form is not connected to a server. Nothing was sent.')
    event.currentTarget.reset()
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <Brand />
          <nav className={`main-nav${menuOpen ? ' nav-open' : ''}`} aria-label="Main navigation">
            {navigation.map(([label, href]) => (
              <a key={href} href={href} onClick={closeMenu}>{label}</a>
            ))}
          </nav>
          <div className="header-actions">
            <button className="icon-button search-toggle" type="button" aria-label={searchOpen ? 'Close product search' : 'Search products'} aria-expanded={searchOpen} onClick={() => setSearchOpen((open) => !open)}>
              <Icon name={searchOpen ? 'close' : 'search'} />
            </button>
            <button className="icon-button cart-toggle" type="button" aria-label={`Open bag, ${quantity} items`} onClick={() => setCartOpen(true)}>
              <Icon name="bag" />
              <span className="cart-count">{quantity}</span>
            </button>
            <button className="icon-button menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
              <Icon name={menuOpen ? 'close' : 'menu'} />
            </button>
          </div>
        </div>
        {searchOpen && (
          <form className="search-bar" role="search" onSubmit={(event) => { event.preventDefault(); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }) }}>
            <label htmlFor="product-search">Search the collection</label>
            <input id="product-search" autoFocus value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Try Premium Hair Wax" />
            <button className="text-button" type="submit">View result <Icon name="arrow" size={16} /></button>
          </form>
        )}
      </header>

      <main>
        <section className="hero section-dark" id="home">
          <div className="hero-grain" aria-hidden="true" />
          <div className="hero-copy">
            <p className="eyebrow"><span /> Grooming, with intention</p>
            <h1>Own Your Style.<br /><em>Define Your Look.</em></h1>
            <p className="hero-description">Discover FIXO MEN Premium Hair Wax, designed to help create structured hairstyles with texture, definition and a natural-looking matte finish.</p>
            <div className="hero-actions">
              <a className="button button-gold" href="#shop">Shop Hair Wax <Icon name="arrow" size={17} /></a>
              <a className="button button-outline" href="#about">Discover FIXO MEN</a>
            </div>
            <ul className="hero-points" aria-label="Product features">
              {['Strong hold', 'Matte finish', 'Non-sticky feel', 'Easy restyling'].map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="hero-art-wrap">
            <div className="hero-art-frame">
              <ImagePanel files={['fixo-premium-hair-wax-in-mist.png', 'hero-banner.jpg', 'hero-model.jpg']} alt="FIXO MEN Premium Hair Wax jar surrounded by mist" className="hero-art" fallbackTitle="FIXO MEN" fallbackCopy="Premium Hair Wax · 50 g" />
              <div className="hero-stamp"><span>01</span><span>FORM<br />MEETS<br />FREEDOM</span></div>
            </div>
            <span className="hero-caption">The FIXO MEN styling essential</span>
          </div>
          <span className="hero-index" aria-hidden="true">01 / 04</span>
        </section>

        <section className="highlight-strip" aria-label="Product highlights">
          <div className="highlight-inner">
            {highlights.map((item, index) => (
              <article className="highlight-item" key={item.title}>
                <span className="feature-icon"><Icon name={item.icon} size={23} /></span>
                <div><h2>{item.title}</h2><p>{item.copy}</p></div>
                {index < highlights.length - 1 && <span className="highlight-divider" aria-hidden="true" />}
              </article>
            ))}
          </div>
        </section>

        <section className="product-section section-pad" id="shop">
          <div className="product-editorial">
            <ImagePanel
              files={['one-essential-endless-expression.png']}
              alt="One essential. Endless expression. FIXO MEN Premium Hair Wax with four hairstyle looks and strong hold, matte finish, natural look, and all-day control."
              className="product-editorial-image"
              fallbackTitle="One essential. Endless expression."
              fallbackCopy="FIXO MEN Premium Hair Wax"
            />
          </div>
          {!productMatches ? (
            <p className="search-empty" role="status">No products match “{searchTerm}”. Try “hair wax”.</p>
          ) : (
            <div className="product-layout">
              <div className="product-visuals">
                <div className="product-main-image">
                  <button className="product-image-button" type="button" aria-label="View FIXO MEN Premium Hair Wax jar full size" onClick={() => openImageViewer('fixo-men-premium-wax-jar.png', 'FIXO MEN Premium Hair Wax jar, 50 g')}>
                    <ImagePanel files={['fixo-men-premium-wax-jar.png']} alt="FIXO MEN Premium Hair Wax jar, 50 g" className="product-photo" fallbackTitle="FIXO MEN" fallbackCopy="Premium Hair Wax · 50 g" />
                    <span className="image-view-hint">View image</span>
                  </button>
                  <span className="image-corner-label">THE DAILY STYLING ESSENTIAL</span>
                </div>
                <div className="product-thumbnails">
                  <button className="product-thumb-button" type="button" aria-label="View FIXO MEN product details and benefits" onClick={() => openImageViewer('fixo-men-premium-wax-editorial.png', 'FIXO MEN Premium Hair Wax product details and benefits')}>
                    <ImagePanel files={['fixo-men-premium-wax-editorial.png']} alt="FIXO MEN Premium Hair Wax product details and benefits" className="product-thumb" fallbackTitle="DETAILS" fallbackCopy="Product view" />
                    <span className="thumbnail-view-hint">View</span>
                  </button>
                  <button className="product-thumb-button" type="button" aria-label="View FIXO MEN hair wax campaign image" onClick={() => openImageViewer('fixo-premium-hair-wax-in-mist.png', 'FIXO MEN Premium Hair Wax in mist')}>
                    <ImagePanel files={['fixo-premium-hair-wax-in-mist.png']} alt="FIXO MEN Premium Hair Wax in mist" className="product-thumb" fallbackTitle="CAMPAIGN" fallbackCopy="Product view" />
                    <span className="thumbnail-view-hint">View</span>
                  </button>
                  <p>Thoughtful styling.<br />No extra steps.</p>
                </div>
              </div>
              <div className="product-copy">
                <p className="eyebrow eyebrow-dark">FIXO MEN · STYLING</p>
                <h2>{product.name}</h2>
                <p className="product-size">NET QUANTITY <span>{product.size}</span></p>
                <p className="product-description">{product.description}</p>
                <ul className="product-benefits">
                  <li><Icon name="hold" size={18} /> Long-lasting, flexible hold</li>
                  <li><Icon name="texture" size={18} /> Texture with a natural matte finish</li>
                  <li><Icon name="feather" size={18} /> Lightweight, non-sticky feel</li>
                  <li><Icon name="refresh" size={18} /> Easy to reshape through the day</li>
                </ul>
                <div className="product-buy-row">
                  <span className="price-label">{product.priceLabel}</span>
                  <button className="button button-dark" type="button" onClick={addToCart}>Add to bag <Icon name="arrow" size={17} /></button>
                </div>
                <p className="product-note">Product availability and final pricing have not been provided.</p>
              </div>
            </div>
          )}
        </section>

        <section className="why-section section-dark section-pad" id="why-fixo">
          <div className="section-intro centered">
            <p className="eyebrow"><span /> Made to move with you</p>
            <h2>Good hair days,<br /><em>on your terms.</em></h2>
            <p>Reliable styling, with room for your own interpretation.</p>
          </div>
          <div className="why-grid">
            {reasons.map((item, index) => (
              <article className="why-card" key={item.title}>
                <span className="why-number">0{index + 1}</span>
                <Icon name={item.icon} size={27} className="why-icon" />
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="how-section section-pad" id="how-to">
          <div className="section-header-row">
            <div><p className="eyebrow eyebrow-dark">Your routine, refined</p><h2>Four steps.<br /><em>All you.</em></h2></div>
            <p className="section-side-copy">A little goes a long way. Build your look gradually and make it your own.</p>
          </div>
          <div className="how-grid">
            {howTo.map((item, index) => (
              <article className="how-card" key={item.title}>
                <div className="how-image-wrap">
                  <ImagePanel files={[item.image]} alt={`Step ${index + 1}: ${item.copy}`} className="how-image" fallbackTitle={`STEP 0${index + 1}`} fallbackCopy="Styling guide" />
                  <span className="step-number">0{index + 1}</span>
                </div>
                <h3>{item.title}</h3><p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="looks-section section-dark section-pad" id="looks">
          <div className="section-header-row">
            <div><p className="eyebrow"><span /> Find your look</p><h2>One product.<br /><em>Multiple possibilities.</em></h2></div>
            <p className="section-side-copy">A starting point, not a rulebook. Explore the styles that feel like you.</p>
          </div>
          <div className="looks-grid">
            {looks.map((look) => (
              <article className="look-card" key={look.title}>
                <div className="look-image-wrap"><ImagePanel files={[look.image]} alt={`${look.title} hairstyle inspiration`} className="look-image" fallbackTitle={look.number} fallbackCopy="Style inspiration" /></div>
                <div className="look-caption"><span>{look.number}</span><h3>{look.title}</h3><Icon name="arrow" size={17} /></div>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section section-pad" id="about">
          <div className="about-image-wrap"><ImagePanel files={['about-banner.jpg']} alt="FIXO MEN men's grooming campaign" className="about-image" fallbackTitle="FIXO MEN" fallbackCopy="Built around your style" /></div>
          <div className="about-copy">
            <p className="eyebrow eyebrow-dark">A modern grooming mindset</p>
            <h2>Built around<br /><em>your style.</em></h2>
            <p>FIXO MEN brings a modern approach to men's grooming, with a focus on styling, texture and personal expression. Our goal is to make everyday grooming simple, practical and style-conscious.</p>
            <a className="text-link" href="#shop">Meet your styling essential <Icon name="arrow" size={17} /></a>
            <span className="about-mark" aria-hidden="true">F</span>
          </div>
        </section>

        <section className="contact-section section-pad" id="contact">
          <div className="contact-copy">
            <p className="eyebrow eyebrow-dark">Get in touch</p>
            <h2>We’re here<br /><em>to help.</em></h2>
            <p>Questions about FIXO MEN? Contact our team directly by phone or email, or visit us at our Pune address.</p>
            <div className="contact-details">
              <a href="tel:+919730520227"><Icon name="phone" size={17} /> +91-9730520227</a>
              <a href="mailto:supportatfixomen@gmail.com"><Icon name="mail" size={17} /> supportatfixomen@gmail.com</a>
              <address><Icon name="pin" size={17} /><span>Shop No. 3, Sadashiv Complex, Dhabadi,<br />Vadgaon Pune, Maharashtra - 411041</span></address>
            </div>
            <p className="contact-status">This form is a front-end preview only. It does not send or store your message.</p>
          </div>
          <form className="contact-form" onSubmit={submitContact}>
            <label htmlFor="contact-name">Your name</label>
            <input id="contact-name" name="name" autoComplete="name" required />
            <label htmlFor="contact-email">Email address</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" required />
            <label htmlFor="contact-message">Your message</label>
            <textarea id="contact-message" name="message" rows="3" required />
            <button className="button button-dark" type="submit">Validate message <Icon name="arrow" size={17} /></button>
            <p className="form-notice" role="status" aria-live="polite">{contactNotice}</p>
          </form>
        </section>

        <section className="final-cta section-dark">
          <ImagePanel files={['footer-bg.jpg']} alt="" className="cta-background" fallbackTitle="" fallbackCopy="" />
          <div className="cta-overlay" />
          <div className="cta-content">
            <p className="eyebrow"><span /> Your style, your signature</p>
            <h2>Ready to define<br /><em>your look?</em></h2>
            <p>Make every day a good hair day with FIXO MEN Premium Hair Wax.</p>
            <a href="#shop" className="button button-gold">Shop Hair Wax <Icon name="arrow" size={17} /></a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand-column">
            <Brand footer />
            <p>Modern grooming for your own kind of style. Own your style. Define your look.</p>
          </div>
          <div className="footer-links">
            <h2>Explore</h2>
            {navigation.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
          </div>
          <div className="footer-links footer-policy-links">
            <h2>Policies</h2>
            {['Privacy Policy', 'Shipping Policy', 'Return Policy', 'Terms & Conditions'].map((label) => <a key={label} href="#policy-notice" title={`${label}: not yet published`}>{label} <span>Not published</span></a>)}
            <p id="policy-notice">Policy documents have not been provided yet.</p>
          </div>
          <div className="footer-contact">
            <h2>Contact</h2>
            <a href="tel:+919730520227"><Icon name="phone" size={17} /> +91-9730520227</a>
            <a href="mailto:supportatfixomen@gmail.com"><Icon name="mail" size={17} /> supportatfixomen@gmail.com</a>
            <address><Icon name="pin" size={17} /><span>Shop No. 3, Sadashiv Complex, Dhabadi,<br />Vadgaon Pune, Maharashtra - 411041</span></address>
          </div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} FIXO MEN</span><span>Own Your Style. Define Your Look.</span></div>
      </footer>

      {cartOpen && (
        <div className="cart-layer">
          <button className="cart-scrim" type="button" aria-label="Close shopping bag" onClick={() => setCartOpen(false)} />
          <aside className="cart-drawer" aria-label="Shopping bag">
            <div className="cart-heading"><div><p className="eyebrow eyebrow-dark">Your selection</p><h2>Shopping bag <span>({quantity})</span></h2></div><button className="icon-button" type="button" aria-label="Close shopping bag" onClick={() => setCartOpen(false)} autoFocus><Icon name="close" /></button></div>
            {quantity === 0 ? (
              <div className="cart-empty"><Icon name="bag" size={30} /><h3>Your bag is waiting.</h3><p>Discover the FIXO MEN styling essential.</p><a className="button button-dark" href="#shop" onClick={() => setCartOpen(false)}>Explore hair wax <Icon name="arrow" size={17} /></a></div>
            ) : (
              <div className="cart-item">
                <button className="cart-item-image-button" type="button" aria-label="View FIXO MEN Premium Hair Wax jar full size" onClick={() => openImageViewer('fixo-men-premium-wax-jar.png', 'FIXO MEN Premium Hair Wax jar, 50 g')}>
                  <ImagePanel files={['fixo-men-premium-wax-jar.png']} alt="FIXO MEN Premium Hair Wax" className="cart-item-image" fallbackTitle="FIXO" fallbackCopy="50 g" />
                </button>
                <div className="cart-item-info"><h3>{product.name}</h3><p>{product.size} · {product.priceLabel}</p><div className="quantity-control"><button type="button" aria-label="Remove one hair wax from bag" onClick={() => setQuantity((value) => Math.max(0, value - 1))}><Icon name="minus" size={15} /></button><span>{quantity}</span><button type="button" aria-label="Add one hair wax to bag" onClick={() => setQuantity((value) => value + 1)}><Icon name="plus" size={15} /></button></div></div>
              </div>
            )}
            <p className="cart-disclaimer">No checkout or payment is available on this static site.</p>
          </aside>
        </div>
      )}
      {viewedImage && (
        <div className="image-viewer-layer">
          <button className="image-viewer-scrim" type="button" aria-label="Close image preview" onClick={() => setViewedImage(null)} />
          <section className="image-viewer-dialog" role="dialog" aria-modal="true" aria-label={`Image preview: ${viewedImage.alt}`}>
            <button className="image-viewer-close" type="button" aria-label="Close image preview" onClick={() => setViewedImage(null)} autoFocus><Icon name="close" /></button>
            <img src={viewedImage.src} alt={viewedImage.alt} />
            <p>{viewedImage.alt}</p>
          </section>
        </div>
      )}
    </div>
  )
}

export default App
