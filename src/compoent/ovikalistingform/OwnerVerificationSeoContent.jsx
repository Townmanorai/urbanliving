import React from 'react';

const css = `
.ovfsc-section { background: #fdf9f3; padding: 40px 24px 48px; font-family: 'Poppins', sans-serif; }
.ovfsc-inner { max-width: 1100px; margin: 0 auto; }
.ovfsc-inner h2 { font-size: 1.3rem; font-weight: 800; color: #1a1209; margin: 0 0 10px; }
.ovfsc-inner h3 { font-size: 1.02rem; font-weight: 700; color: #1a1209; margin: 24px 0 8px; }
.ovfsc-inner p { font-size: 0.86rem; line-height: 1.75; color: #4a3828; margin: 0 0 10px; }
@media (max-width: 640px) { .ovfsc-section { padding: 28px 16px 36px; } .ovfsc-inner h2 { font-size: 1.1rem; } }
`;

const OwnerVerificationSeoContent = () => (
  <section className="ovfsc-section">
    <style>{css}</style>
    <div className="ovfsc-inner">
      <h2>Why Owner Verification Matters on OvikaLiving</h2>
      <p>
        Verification isn't just a badge for guests to see — it's what lets OvikaLiving confirm that the
        person listing a property actually has the right to rent it out. Submitting your identity, ownership
        or authorization documents through this form is the first step toward getting your listing reviewed
        and marked as verified.
      </p>

      <h3>Documents You'll Typically Need</h3>
      <p>
        A government-issued identity document, proof of ownership or an authorization letter if you're
        managing the property on someone else's behalf, and your registered email and property ID are the
        core details the verification process looks for. Having these ready before you start the form speeds
        up the review.
      </p>

      <h3>What You Get Once Verified</h3>
      <p>
        A verified listing typically sees more enquiries, since guests consistently filter toward badged
        properties when comparing options in the same locality and price range. Verification is a one-time
        process per owner account, not something you need to repeat for every new property you list.
      </p>
    </div>
  </section>
);

export default OwnerVerificationSeoContent;
