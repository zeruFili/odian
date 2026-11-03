import React from "react";
import { Logo } from "./Header";
import {
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
  return (
    <footer className="bg-[#123d32] text-white border-t border-emerald-900/60 mt-16 sm:mt-24">
      {/* Main Footer Section: Brand on Left, Assurances in a Column on Right */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Brand Column */}
        <div className="space-y-4 max-w-xl">
          <Logo light={true} />
          <p className="text-xs text-emerald-200/70 leading-relaxed max-w-md">
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

        {/* Assurances Column: Positioned on the side of the brand section */}
        <div className="space-y-6 max-w-lg md:border-l md:border-white/10 md:pl-8 lg:pl-12">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
              <TruckIcon size={22} />
            </div>
            <div>
              <strong className="text-sm font-bold block font-display">
                Temperature-Protected Express Delivery
              </strong>
              <span className="text-xs text-emerald-200/70 leading-relaxed block mt-0.5">
                Complimentary same-day dispatch on orders over $60
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheckIcon size={22} />
            </div>
            <div>
              <strong className="text-sm font-bold block font-display">
                100% Dermatologist Verified
              </strong>
              <span className="text-xs text-emerald-200/70 leading-relaxed block mt-0.5">
                Clinically tested bio-ferments, hypoallergenic & non-comedogenic
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
              <LeafIcon size={22} />
            </div>
            <div>
              <strong className="text-sm font-bold block font-display">
                30-Day Radiant Guarantee
              </strong>
              <span className="text-xs text-emerald-200/70 leading-relaxed block mt-0.5">
                Pure, cold-pressed botanical actives or hassle-free full returns
              </span>
            </div>
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
