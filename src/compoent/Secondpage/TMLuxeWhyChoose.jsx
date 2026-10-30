import React from 'react';
import './tmluxe-why-choose.css';
import { RiKey2Line } from 'react-icons/ri';

export default function TMLuxeWhyChoose() {
  return (
    <section className="tmluxe-section" aria-labelledby="tmluxe-title">
      <div className="tmluxe-container">
        <h2 id="tmluxe-title" className="tmluxe-heading">
          Why Choose TM <span className="tmluxe-heading-accent">Luxe</span>
        </h2>

        <div className="tmluxe-grid">
          <article className="tmluxe-card">
            <div className="tmluxe-icon-wrap">
              <img src="/homeluxe1.png" alt="Sophisticated Interiors" className="tmluxe-icon" />
            </div>
            <h3 className="tmluxe-card-title">Sophisticated Interiors</h3>
            <p className="tmluxe-card-text">
              Each apartment is meticulously designed with high-end finishes, modern furnishings, and
              state-of-the-art amenities.
            </p>
          </article>

          <article className="tmluxe-card">
            <div className="tmluxe-icon-wrap">
              <img src="/locationluxe3.png" alt="Prime Location" className="tmluxe-icon" />
            </div>
            <h3 className="tmluxe-card-title">Prime Location</h3>
            <p className="tmluxe-card-text">
              Our apartments are situated in the most desirable neighborhoods, offering easy access
              to key attractions and business centers.
            </p>
          </article>

          <article className="tmluxe-card">
            <div className="tmluxe-icon-wrap">
              <img src="/key.png" alt="Self check-in icon — OvikaLiving Signature Stays" className="tmluxe-icon" style={{ width: '45px', height: '45px' }} />
            </div>
            <h3 className="tmluxe-card-title">Self Check-in & Check-out</h3>
            <p className="tmluxe-card-text">
              Seamless, contactless arrival and departure for complete convenience.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}