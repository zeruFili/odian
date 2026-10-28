import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Header";
import Icon, {
  TruckIcon,
  ShieldCheckIcon,
  LeafIcon,
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
  VisaIcon,
  MastercardIcon,
  GooglePayIcon,
  ApplePayIcon,
} from "./Icons";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-[#123d32] text-white border-t border-emerald-900/60 mt-16 sm:mt-24">
      {/* Upper Assurance Banner (Doqa Rental Style) */}
      <div className="border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
              <TruckIcon size={24} />
            </div>
            <div>
              <strong className="text-sm font-bold block font-display">
                Temperature-Protected Express Delivery
              </strong>
              <span className="text-xs text-emerald-200/70">
                Complimentary same-day dispatch on orders over $60
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheckIcon size={24} />
            </div>
            <div>
              <strong className="text-sm font-bold block font-display">
                100% Dermatologist Verified
              </strong>
              <span className="text-xs text-emerald-200/70">
                Clinically tested bio-ferments, hypoallergenic & non-comedogenic
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
              <LeafIcon size={24} />
            </div>
            <div>
              <strong className="text-sm font-bold block font-display">
                30-Day Radiant Guarantee
              </strong>
              <span className="text-xs text-emerald-200/70">
                Pure, cold-pressed botanical actives or hassle-free full returns
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links (Doqa Rental Style) */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* Brand Column */}
        <div className="space-y-4 sm:col-span-2 md:col-span-1">
          <Logo light={true} />
          <p className="text-xs text-emerald-200/70 leading-relaxed max-w-sm">
            Pioneering botanical skincare science. We unite cold-pressed natural essences with clinical bio-ferments to restore cellular barriers and unlock lifelong natural luminosity.
          </p>
          <div className="text-xs text-emerald-300/80 font-medium space-y-1">
            <p>📍 Botanical Atelier: 850 Heritage Gardens Way</p>
            <p>📞 Client Care & Consultations: +1 (800) 555-ODILIA</p>
          </div>
          <div className="flex items-center gap-3 pt-2 text-emerald-300/80">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors" aria-label="Instagram">
              <InstagramIcon size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors" aria-label="Facebook">
              <FacebookIcon size={18} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors" aria-label="YouTube">
              <YoutubeIcon size={18} />
            </a>
          </div>
        </div>

        {/* Customer Care & Skincare Consultations */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Client Atelier & Care
          </h4>
          <ul className="space-y-2 text-xs text-emerald-100/70">
            <li>
              <Link to="/?category=Serums" className="hover:text-white transition-colors">
                Clinical Serum Formulations
              </Link>
            </li>
            <li>
              <Link to="/?category=Face+Care" className="hover:text-white transition-colors">
                Ceramide Barrier Creams
              </Link>
            </li>
            <li>
              <Link to="/discount" className="hover:text-white transition-colors">
                Special Deals & Volume Sets
              </Link>
            </li>
            <li>
              <Link to="/new-arrivals" className="hover:text-white transition-colors">
                Fresh Atelier Extractions
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                Shipping, Sustainability & Returns
              </Link>
            </li>
          </ul>
        </div>

        {/* Operating Hours & Newsletter */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Atelier Hours & Updates
          </h4>
          <div className="text-xs text-emerald-200/70 space-y-1.5">
            <p className="flex justify-between">
              <span>Monday – Friday:</span> <strong className="text-white">08:00 – 20:00</strong>
            </p>
            <p className="flex justify-between">
              <span>Saturday:</span> <strong className="text-white">09:00 – 17:00</strong>
            </p>
            <p className="flex justify-between">
              <span>Online Orders:</span>{" "}
              <span className="text-amber-400 font-semibold">24/7 Automated Dispatch</span>
            </p>
          </div>

          <div className="pt-2">
            <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider block mb-1">
              Join the ODILIA Botanical Circle (15% Off)
            </span>
            {subscribed ? (
              <div className="p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-500/30 text-xs text-amber-300 font-semibold">
                ✓ Welcome! Use code <strong>WELCOME15</strong> at checkout.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col min-[380px]:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white/10 rounded-xl border border-white/20 text-white placeholder-emerald-300/50 outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 text-emerald-950 rounded-xl text-xs font-bold hover:bg-amber-300 transition-colors whitespace-nowrap active:scale-98"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar (Doqa Style) */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/60 text-center sm:text-left">
          <p>© {new Date().getFullYear()} ODILIA Cosmetics Laboratories. All rights reserved.</p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <VisaIcon size={34} />
            <MastercardIcon size={34} />
            <GooglePayIcon size={34} />
            <ApplePayIcon size={34} />
          </div>
        </div>
      </div>
    </footer>
  );
}
