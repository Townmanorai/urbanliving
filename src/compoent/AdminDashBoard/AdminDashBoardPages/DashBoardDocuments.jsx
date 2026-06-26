import React from 'react';
import { Helmet } from 'react-helmet';
import './DashboadDocument.css';

const DashBoardDocuments = () => {
  return (
    <div className="documents-container">
      <Helmet>
        <title>Documents | OvikaLiving Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="documents-content">
        <div className="icon">📄</div>
        <h2>Documents</h2>
        <p>This provision is coming soon</p>
      </div>
    </div>
  );
};

export default DashBoardDocuments;