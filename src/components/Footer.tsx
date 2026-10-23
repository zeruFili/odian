import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from './Header'
import {
  ApplePayIcon,
  FacebookIcon,
  GooglePayIcon,
  InstagramIcon,
  MastercardIcon,
  VisaIcon,
  YoutubeIcon,
  ShieldCheckIcon,
  TruckIcon,
  LeafIcon,
} from './Icons'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="footer">
      {/* Newsletter Banner */}
      <div className="footer-newsletter-wrap">
        <div className="container footer-newsletter-inner">
          <div className="footer-newsletter-text">
            <span className="newsletter-eyebrow">The ODILIA Circle</span>
            <h3>Receive 15% Off Your First Ritual</h3>
            <p>
              Subscribe to enjoy exclusive early formulation access, clinical skincare insights, and
              private seasonal invitations.
            </p>
          </div>

          <div className="footer-newsletter-form-col">
            {subscribed ? (
              <div className="newsletter-success-box">
                <span>✓ Welcome to ODILIA. Your 15% welcome code is <strong>WELCOME15</strong></span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address…"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                />
                <button type="submit" className="btn btn--primary newsletter-btn">
                  Join Circle
                </button>
              </form>
            )}
            <span className="newsletter-privacy-note">
              We respect your privacy. You may unsubscribe at any moment.
            </span>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Main Footer Columns */}
        <div className="footer__top">
          <div className="footer__brand">
            <Logo />
            <p className="footer__tagline">
              Pioneering botanical skincare science. We formulate clinical-strength, clean
              skincare to awaken natural cellular radiance and preserve skin health for life.
            </p>

            <div className="footer__badges">
              <div className="footer-badge-pill">
                <LeafIcon size={16} />
                <span>100% Clean & Vegan</span>
              </div>
              <div className="footer-badge-pill">
                <ShieldCheckIcon size={16} />
                <span>Dermatologist Approved</span>
              </div>
              <div className="footer-badge-pill">
                <TruckIcon size={16} />
                <span>Carbon Neutral Delivery</span>
              </div>
            </div>

            <div className="footer__social">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                <YoutubeIcon />
              </a>
            </div>
          </div>

          <div className="footer__col">
            <h4>Formulations</h4>
            <ul>
              <li><Link to="/">Shop All Products</Link></li>
              <li><Link to="/?category=Serums">Targeted Serums</Link></li>
              <li><Link to="/?category=Cleansers">Gentle Cleansers</Link></li>
              <li><Link to="/?category=Moisturizers">Barrier Creams</Link></li>
              <li><Link to="/?category=Treatments">Sun & SPF Defense</Link></li>
              <li><Link to="/discount">Special Offers</Link></li>
              <li><Link to="/new-arrivals">New Additions</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Customer Care</h4>
            <ul>
              <li><a href="#catalog">Consultation Quiz</a></li>
              <li><a href="#catalog">Track Your Shipment</a></li>
              <li><a href="#catalog">Shipping & Deliveries</a></li>
              <li><a href="#catalog">Complimentary Returns</a></li>
              <li><a href="#catalog">Authenticity Promise</a></li>
              <li><a href="#catalog">Contact Lab Concierge</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Our Philosophy</h4>
            <ul>
              <li><a href="#catalog">The Clinical Method</a></li>
              <li><a href="#catalog">Sustainable Glass Packaging</a></li>
              <li><a href="#catalog">Bio-Fermented Actives</a></li>
              <li><a href="#catalog">Cruelty-Free Commitment</a></li>
              <li><a href="#catalog">Privacy Policy</a></li>
              <li><a href="#catalog">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer__bottom">
          <p className="footer__copy">
            © {new Date().getFullYear()} ODILIA Skincare Laboratories. All rights reserved. Crafted for enduring radiant skin.
          </p>

          <div className="footer__payments" aria-label="Accepted Payment Methods">
            <VisaIcon />
            <MastercardIcon />
            <GooglePayIcon />
            <ApplePayIcon />
          </div>
        </div>
      </div>
    </footer>
  )
}
