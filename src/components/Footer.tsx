import { Logo } from './Header'
import { ApplePayIcon, FacebookIcon, GooglePayIcon, InstagramIcon, MastercardIcon, VisaIcon, YoutubeIcon } from './Icons'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo />
            <p className="footer__tagline">
              We strive to help every woman reveal her skin's natural radiance by selecting only the best from around the world.
            </p>
            <div className="footer__social">
              <a href="#" aria-label="Instagram"><InstagramIcon /></a>
              <a href="#" aria-label="Facebook"><FacebookIcon /></a>
              <a href="#" aria-label="YouTube"><YoutubeIcon /></a>
            </div>
          </div>
          <div className="footer__col">
            <h4>Products</h4>
            <ul>
              <li><a href="/">Shop all</a></li>
              <li><a href="/">Skin care</a></li>
              <li><a href="/">Body products</a></li>
              <li><a href="/">Anti-aging care</a></li>
              <li><a href="/">Organic products</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>Information</h4>
            <ul>
              <li><a href="#">About us</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>More</h4>
            <ul>
              <li><a href="#">Privacy policy</a></li>
              <li><a href="#">Terms of service</a></li>
              <li><a href="#">Shipping & returns</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <p className="footer__copy">© All rights reserved. Made with care for radiant skin.</p>
          <div className="footer__payments">
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
