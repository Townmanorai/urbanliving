import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

const FAQS = [
  {
    q: 'Is there really zero brokerage?',
    a: 'Yes. OvikaLiving does not charge tenants any brokerage fee to browse, shortlist, or connect with a property owner through our platform.',
  },
  {
    q: 'How fast can I move in?',
    a: 'Once you share your requirement, our team calls you within 30 minutes and shortlists available properties matching your budget and timeline — many tenants move in within a few days.',
  },
  {
    q: 'Are all properties verified?',
    a: 'Listings on OvikaLiving go through a verification process before they go live, so you can browse PGs, apartments, hotels and homestays with confidence.',
  },
  {
    q: 'Do I have to visit before booking?',
    a: 'For most nightly stays (Signature Stays, Hotels, Homestays) you can book directly online. For PG and long-term rentals, our team helps you schedule a visit before you commit.',
  },
  {
    q: 'What if I need help after moving in?',
    a: 'Our support team stays reachable via call and WhatsApp for any issues with your stay, payments, or the property owner.',
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState(0);
  return (
    <div className="lp-faq-list">
      {FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className={`lp-faq-item ${isOpen ? 'lp-faq-item--open' : ''}`}>
            <button className="lp-faq-question" onClick={() => setOpen(isOpen ? -1 : i)}>
              <span>{item.q}</span>
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <FiChevronDown size={18} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  className="lp-faq-answer-wrap"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="lp-faq-answer">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
