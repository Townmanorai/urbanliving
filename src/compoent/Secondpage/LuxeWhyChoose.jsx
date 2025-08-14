import React from 'react'
import './tmxluxe-why.css'
import { FaHouseChimney } from 'react-icons/fa6'
import { CiLocationOn } from 'react-icons/ci'
import { RiCustomerService2Fill } from 'react-icons/ri'
import { MdOutlineWorkspacePremium } from 'react-icons/md'
import { BsHouseDoor } from 'react-icons/bs'
function LuxeWhyChoose() {
  return (
  <>
  <section className="tmxluxe-why">
      <div className="tmxluxe-why-container">
        <h2 className="tmxluxe-why-title">Why Choose TM Luxe?</h2>
        <p className="tmxluxe-why-sub">
          Experience unparalleled luxury and comfort with our premium hospitality
          services
        </p>

        <div className="tmxluxe-why-grid">
          <article className="tmxluxe-why-card">
            <div className="tmxluxe-why-iconwrap">
              <span className="tmxluxe-why-icon"><BsHouseDoor size={30} color='red' /></span>
            </div>
            <h3 className="tmxluxe-why-card-title">Sophisticated Interiors</h3>
            <p className="tmxluxe-why-card-text">
              Meticulously designed spaces featuring premium materials, elegant
              furnishings, and thoughtful details that create an atmosphere of
              refined luxury.
            </p>
          </article>

          <article className="tmxluxe-why-card">
            <div className="tmxluxe-why-iconwrap">
              <span className="tmxluxe-why-icon"><CiLocationOn size={30} color='red' /></span>
            </div>
            <h3 className="tmxluxe-why-card-title">Prime Locations</h3>
            <p className="tmxluxe-why-card-text">
              Strategically positioned in the heart of major cities and
              exclusive destinations, offering unparalleled access to business
              districts and cultural attractions.
            </p>
          </article>

          <article className="tmxluxe-why-card">
            <div className="tmxluxe-why-iconwrap is-primary">
              <span className="tmxluxe-why-icon is-contrast"><RiCustomerService2Fill size={30} color='red' /></span>
            </div>
            <h3 className="tmxluxe-why-card-title">Exceptional Service</h3>
            <p className="tmxluxe-why-card-text">
              24/7 personalized concierge service with multilingual staff
              dedicated to exceeding expectations and creating memorable
              experiences for every guest.
            </p>
          </article>

          <article className="tmxluxe-why-card">
            <div className="tmxluxe-why-iconwrap">
              <span className="tmxluxe-why-icon"><MdOutlineWorkspacePremium size={30} color='red'/></span>
            </div>
            <h3 className="tmxluxe-why-card-title">Premium Amenities</h3>
            <p className="tmxluxe-why-card-text">
              World-class facilities including spa services, fine dining
              restaurants, fitness centers, and exclusive lounges designed for
              the discerning traveler.
            </p>
          </article>
        </div>
      </div>
    </section>
  </>
  )
}

export default LuxeWhyChoose