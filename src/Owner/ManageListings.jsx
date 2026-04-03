
import React from 'react';
import { FaFile, FaMoneyBill } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { AiFillSound } from 'react-icons/ai';
import './manage-ovika.css';

const items = [
  {
    Icon: FaFile,
    title: 'Handover Your Property',
    text:
      'Provide us your ready-to-rent home, and we’ll take care of everything — from listing to tenant onboarding.',
  },
  {
    Icon: MdVerified,
    title: 'We List and Maintain',
    text:
      'We create and attractive listing, manage inquiries, and ensure your property is stay well-maintained and guest-ready at all times.',
  },
  {
    Icon: AiFillSound,
    title: 'We Handle Bookings and Tenants',
    text:
      'Our team manages listings across platforms, verifies tenants, and ensures smooth check-ins, communication, and support.',
  },
  {
    Icon: FaMoneyBill,
    title: 'You Earn, We Manage',
    text:
      'Enjoy hassle-free monthly income while we manage the rental operations transparently on a commission basis.',
  },
];

export default function ManageListings() {
  return (
    <section className="manage-ovika wrap">
      <div className="manage-ovika container">
        <h2 className="manage-ovika heading">How We <span className="text-red-600">Manage</span> Listings</h2>
        <p className="manage-ovika sub">
          Our simple, streamlined process ensures your property is managed efficiently.
        </p>

        <div className="manage-ovika grid noCards">
          {items.map(({ Icon, title, text }, i) => (
            <div className="manage-ovika block" key={i}>
              <div className="manage-ovika iconWrap" aria-hidden="true">
                <div className="manage-ovika iconCircle">
                  <Icon className="manage-ovika iconGlyph" />
                </div>
                <span className="manage-ovika iconShadow" />
              </div>

              <h3 className="manage-ovika title">{title}</h3>
              <p className="manage-ovika text">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
