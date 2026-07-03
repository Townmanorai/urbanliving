import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './FAQ.css';

const FAQItem = ({ question, answer, number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-page-item-unique ${isOpen ? 'faq-page-open-unique' : ''}`}>
      <div className="faq-page-question-unique" onClick={() => setIsOpen(!isOpen)}>
        <h3>{number}. {question}</h3>
        <span className="faq-page-icon-unique">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </div>
      {isOpen && (
        <div className="faq-page-answer-unique">
          {answer}
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="faq-page-container-unique">
      <Helmet>
        <title>FAQ – PG, Co-Living & Flexible Stays in Noida | OvikaLiving Help Center</title>
        <meta name="description" content="Got questions about PG, co-living or furnished rentals in Noida & Greater Noida? Find all answers — booking process, security deposit, check-in, cancellation policy, amenities, pet policy & more. OvikaLiving Help Center." />
        <meta name="keywords" content="faq pg noida, pg questions noida, co living faq noida, ovikaliving faq, pg booking process noida, security deposit pg noida, furnished pg questions, how to book pg noida, ovikaliving help, pg noida frequently asked questions, co living noida questions, flexible stay faq noida, short term stay faq noida, monthly rental faq noida, furnished apartment faq noida, how to book co living noida, how to book furnished flat noida, ovikaliving booking process, ovikaliving check in process, ovikaliving cancellation policy, ovikaliving refund policy, pg amenities noida, co living amenities noida, pg rules noida, co living rules noida, pg security deposit noida, co living security deposit noida, pg lease noida, co living lease noida, pg food policy noida, co living food policy noida, pg guest policy noida, pg pet policy noida, pg maintenance noida, co living maintenance noida, pg wifi noida, pg ac noida, pg parking noida, pg housekeeping noida, pg laundry noida, pg 24x7 security noida, how does ovikaliving work, what is ovikaliving, ovikaliving for remote workers faq, ovikaliving for startup founders faq, ovikaliving for interns faq, ovikaliving for students faq, ovikaliving for working professionals faq, ovikaliving for corporate employees faq, pg under 10000 noida questions, pg under 15000 noida questions, pg under 20000 noida questions, how to list property ovikaliving, ovikaliving verified badge faq, ovikaliving self verified faq, pg sector 62 noida questions, pg sector 63 noida questions, pg sector 18 noida questions, pg greater noida questions, pg knowledge park questions, पीजी के बारे में सवाल नोएडा, को लिविंग सवाल नोएडा, ओविका लिविंग सहायता, पीजी बुकिंग प्रोसेस नोएडा, सिक्योरिटी डिपॉजिट पीजी नोएडा, पीजी कैंसिलेशन पॉलिसी, को लिविंग नियम नोएडा, पीजी एमेनिटीज नोएडा, नोएडा में पीजी कैसे बुक करें, फर्निश्ड फ्लैट सवाल नोएडा, ओविका मदद" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.ovikaliving.com/faq" />
        <meta name="author" content="OvikaLiving" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />
        <meta name="language" content="en" />
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Noida" />
        <meta name="geo.position" content="28.5355;77.3910" />
        <meta name="ICBM" content="28.5355, 77.3910" />
        <meta property="og:title" content="FAQ | OvikaLiving – PG, Co-Living & Flexible Stays Noida" />
        <meta property="og:description" content="All your questions answered — OvikaLiving FAQ for PG, co-living & furnished rentals in Noida & Greater Noida. Booking, cancellation, amenities & more." />
        <meta property="og:url" content="https://www.ovikaliving.com/faq" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="OvikaLiving" />
        <meta property="og:image" content="https://www.ovikaliving.com/ovikalivinglogonew.png" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FAQ | OvikaLiving PG & Co-Living Help Center Noida" />
        <meta name="twitter:description" content="All answers about OvikaLiving PG, co-living & flexible stays in Noida. Booking, cancellation, amenities, policies & more." />
        <meta name="twitter:image" content="https://www.ovikaliving.com/ovikalivinglogonew.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "What is OvikaLiving.com?", "acceptedAnswer": { "@type": "Answer", "text": "OvikaLiving.com is a technology-driven marketplace that connects guests with property owners offering short-term stays, PGs, co-living spaces, and rental accommodations across India." } },
            { "@type": "Question", "name": "Who operates OvikaLiving.com?", "acceptedAnswer": { "@type": "Answer", "text": "OvikaLiving.com is a flagship brand operated under Townmanor Technologies Pvt. Ltd." } },
            { "@type": "Question", "name": "Is OvikaLiving.com available outside India?", "acceptedAnswer": { "@type": "Answer", "text": "Currently, OvikaLiving.com operates only within India, and all transactions are processed in Indian Rupees (INR)." } },
            { "@type": "Question", "name": "How do I book a property on OvikaLiving.com?", "acceptedAnswer": { "@type": "Answer", "text": "Guests can search for properties, review listings, and make bookings directly through the OvikaLiving.com platform." } },
            { "@type": "Question", "name": "How are payments handled?", "acceptedAnswer": { "@type": "Answer", "text": "All payments are processed securely through authorized payment gateways. OvikaLiving.com does not store your card or banking details." } },
            { "@type": "Question", "name": "What is the cancellation and refund policy?", "acceptedAnswer": { "@type": "Answer", "text": "Cancellation and refund eligibility depends on the timing of cancellation and the applicable policy shown during booking. Refer to the Refund & Cancellation Policy for details." } },
            { "@type": "Question", "name": "What happens if a host cancels my booking?", "acceptedAnswer": { "@type": "Answer", "text": "If a host cancels a confirmed booking, you are eligible for a full refund. OvikaLiving.com may also assist in finding alternative accommodation, subject to availability." } },
            { "@type": "Question", "name": "Are properties verified?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Property owners are required to submit identity documents, and listings are reviewed before being published." } },
            { "@type": "Question", "name": "What if I face an issue during my stay?", "acceptedAnswer": { "@type": "Answer", "text": "Guests can contact OvikaLiving.com support for assistance. However, the stay itself is managed directly between the guest and the property owner." } },
            { "@type": "Question", "name": "How do I list my property on OvikaLiving.com?", "acceptedAnswer": { "@type": "Answer", "text": "You can list your property by filling out the property onboarding form on our website. Alternatively, you can choose assisted listing through our team." } },
            { "@type": "Question", "name": "Does OvikaLiving.com charge any commission?", "acceptedAnswer": { "@type": "Answer", "text": "No, OvikaLiving.com does not charge commission on bookings." } },
            { "@type": "Question", "name": "Who decides house rules and guest eligibility?", "acceptedAnswer": { "@type": "Answer", "text": "Property owners set their own house rules, check-in policies, and guest limits." } },
            { "@type": "Question", "name": "How do I receive payments?", "acceptedAnswer": { "@type": "Answer", "text": "Payment flow details are communicated during booking. Owners receive payments as per the agreed process without commission deductions." } },
            { "@type": "Question", "name": "Can OvikaLiving.com remove my listing?", "acceptedAnswer": { "@type": "Answer", "text": "Listings may be suspended or removed if they violate platform policies, contain misleading information, or fail verification checks." } },
            { "@type": "Question", "name": "Does OvikaLiving.com own or manage the listed properties?", "acceptedAnswer": { "@type": "Answer", "text": "No. OvikaLiving.com acts as a technology intermediary and does not own or manage most properties listed on the platform." } },
            { "@type": "Question", "name": "How is my personal data protected?", "acceptedAnswer": { "@type": "Answer", "text": "OvikaLiving.com follows applicable Indian data protection laws and implements security measures to protect user data. Refer to the Privacy Policy for details." } },
            { "@type": "Question", "name": "Is my ID safe with OvikaLiving.com?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Identity documents are used only for verification and compliance purposes and are stored securely by OvikaLiving.com." } },
            { "@type": "Question", "name": "Does OvikaLiving.com share my data with third parties?", "acceptedAnswer": { "@type": "Answer", "text": "Personal data is shared only with trusted service providers where necessary (e.g., payment processing) or when required by law." } },
            { "@type": "Question", "name": "What laws govern OvikaLiving.com?", "acceptedAnswer": { "@type": "Answer", "text": "All services are governed by the laws of India, as outlined in the Terms & Conditions." } },
            { "@type": "Question", "name": "Can OvikaLiving.com change its policies?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. OvikaLiving.com may update its policies from time to time. Updated versions will be published on the platform." } },
            { "@type": "Question", "name": "How can I contact OvikaLiving support?", "acceptedAnswer": { "@type": "Answer", "text": "You can contact OvikaLiving at enquiry@ovikaLiving.com or support@townmanor.ai" } }
          ]
        })}</script>
      </Helmet>
      <div className="faq-page-header-unique">
        <h1>Frequently Asked Questions</h1>
        <p className="faq-page-last-updated-unique">Last Updated: January 2026</p>
      </div>

      <div className="faq-page-section-unique">
        <h2>General FAQs</h2>
        
        <FAQItem 
          number="1"
          question="What is OvikaLiving.com?"
          answer={<p>OvikaLiving.com is a technology-driven marketplace that connects guests with property owners offering short-term stays, PGs, co-living spaces, and rental accommodations across India.</p>}
        />

        <FAQItem 
          number="2"
          question="Who operates OvikaLiving.com?"
          answer={<p>OvikaLiving.com is a flagship brand operated under Townmanor Technologies Pvt. Ltd.</p>}
        />

        <FAQItem 
          number="3"
          question="Is OvikaLiving.com available outside India?"
          answer={<p>Currently, OvikaLiving.com operates only within India, and all transactions are processed in Indian Rupees (INR).</p>}
        />
      </div>

      <div className="faq-page-section-unique">
        <h2>Guest FAQs</h2>
        
        <FAQItem 
          number="4"
          question="How do I book a property on OvikaLiving.com?"
          answer={<p>Guests can search for properties, review listings, and make bookings directly through the OvikaLiving.com platform.</p>}
        />

        <FAQItem 
          number="5"
          question="How are payments handled?"
          answer={<p>All payments are processed securely through authorized payment gateways. OvikaLiving.com does not store your card or banking details.</p>}
        />

        <FAQItem 
          number="6"
          question="What is the cancellation and refund policy?"
          answer={<p>Cancellation and refund eligibility depends on the timing of cancellation and the applicable policy shown during booking. Please refer to our <Link to="/refund-cancellation-policy" className="faq-page-link-unique">Refund & Cancellation Policy</Link> for details.</p>}
        />

        <FAQItem 
          number="7"
          question="What happens if a host cancels my booking?"
          answer={<p>If a host cancels a confirmed booking, you are eligible for a full refund. OvikaLiving.com may also assist in finding alternative accommodation, subject to availability.</p>}
        />

        <FAQItem 
          number="8"
          question="Are properties verified?"
          answer={<p>Yes. Property owners are required to submit identity documents, and listings are reviewed before being published.</p>}
        />

        <FAQItem 
          number="9"
          question="What if I face an issue during my stay?"
          answer={<p>Guests can contact OvikaLiving.com support for assistance. However, the stay itself is managed directly between the guest and the property owner.</p>}
        />
      </div>

      <div className="faq-page-section-unique">
        <h2>Owner FAQs</h2>
        
        <FAQItem 
          number="10"
          question="How do I list my property on OvikaLiving.com?"
          answer={<p>You can list your property by filling out the property onboarding form on our website. Alternatively, you can choose assisted listing through our team.</p>}
        />

        <FAQItem 
          number="11"
          question="Does OvikaLiving.com charge any commission?"
          answer={<p>No, OvikaLiving.com does not charge commission on bookings.</p>}
        />

        <FAQItem 
          number="12"
          question="Who decides house rules and guest eligibility?"
          answer={<p>Property owners set their own house rules, check-in policies, and guest limits.</p>}
        />

        <FAQItem 
          number="13"
          question="How do I receive payments?"
          answer={<p>Payment flow details are communicated during booking. Owners receive payments as per the agreed process without commission deductions.</p>}
        />

        <FAQItem 
          number="14"
          question="Can OvikaLiving.com remove my listing?"
          answer={<p>Listings may be suspended or removed if they violate platform policies, contain misleading information, or fail verification checks.</p>}
        />

        <FAQItem 
          number="15"
          question="Does OvikaLiving.com own or manage the listed properties?"
          answer={<p>No. OvikaLiving.com acts as a technology intermediary and does not own or manage most properties listed on the platform.</p>}
        />
      </div>

      <div className="faq-page-section-unique">
        <h2>Privacy & Data Protection FAQs</h2>
        
        <FAQItem 
          number="16"
          question="How is my personal data protected?"
          answer={<p>OvikaLiving.com follows applicable Indian data protection laws and implements security measures to protect user data. Please refer to our <Link to="/privacy-policy" className="faq-page-link-unique">Privacy Policy</Link> for details.</p>}
        />

        <FAQItem 
          number="17"
          question="Is my ID safe with OvikaLiving.com?"
          answer={<p>Yes. Identity documents are used only for verification and compliance purposes and are stored securely by OvikaLiving.com.</p>}
        />

        <FAQItem 
          number="18"
          question="Does OvikaLiving.com share my data with third parties?"
          answer={<p>Personal data is shared only with trusted service providers where necessary (e.g., payment processing) or when required by law.</p>}
        />
      </div>

      <div className="faq-page-section-unique">
        <h2>Legal & Platform FAQs</h2>
        
        <FAQItem 
          number="19"
          question="What laws govern OvikaLiving.com?"
          answer={<p>All services are governed by the laws of India, as outlined in our <Link to="/terms-and-conditions" className="faq-page-link-unique">Terms & Conditions</Link>.</p>}
        />

        <FAQItem 
          number="20"
          question="Can OvikaLiving.com change its policies?"
          answer={<p>Yes. OvikaLiving.com may update its policies from time to time. Updated versions will be published on the platform.</p>}
        />

        <FAQItem 
          number="21"
          question="How can I contact OvikaLiving support?"
          answer={<p>You can contact us at: <a href="mailto:enquiry@ovikaLiving.com" className="faq-page-link-unique">enquiry@ovikaLiving.com</a> or <a href="mailto:support@townmanor.ai" className="faq-page-link-unique">support@townmanor.ai</a></p>}
        />
      </div>

      <div className="faq-page-contact-unique">
        <p>Still have questions? Contact our support team at <a href="mailto:enquiry@ovikaLiving.com" className="faq-page-link-unique">enquiry@ovikaLiving.com</a> or <a href="mailto:support@townmanor.ai" className="faq-page-link-unique">support@townmanor.ai</a></p>
      </div>
    </div>
  );
};

export default FAQ;