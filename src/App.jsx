
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import AnalyticsTracker from "./AnalyticsTracker";

// Common components
import Navbar from "./compoent/Homepage/Navbar";
import HoomieFooter from "./compoent/Homepage/HoomieFooter";

// Homepage & other main pages
// import Home from "./compoent/Homepage/Home";
import Home from "./compoent/Homepage/Home";
import LuxeMain from "./compoent/Secondpage/LuxeMain";
import ThirdMain from "./compoent/ThirdPage/ThirdMain";
import Payment from "./compoent/payment/Payment";
import AuthPage from "./compoent/Login/AuthPage";
import About from "./compoent/about/About";
import Dashboard from "./compoent/Dashboard/Dashboard";
import Sucess from "./compoent/payment/Sucess";
import Failure from "./compoent/payment/Failure";
import ListPropertyPage from "./compoent/ListProperty/ListPropertyPage";
import SelfManage from "./compoent/FourthPage/SelfManage";
import FifthMain from "./compoent/Fifth/FifthMain";
import Ownermain from "./Owner/Ownermain";

// Context
import { AuthProvider, AuthContext } from "./compoent/Login/AuthContext";

// Admin Dashboard Components
import AdminDashboardLayout from "./compoent/AdminDashBoard/AdminDashboardLayout";
import AdminDashBoard from "./compoent/AdminDashBoard/AdminDashBoardPages/DashBoardAdmin";
import InquiriesBookings from "./compoent/AdminDashBoard/AdminDashBoardPages/InquiriesBookings";
import Financials from "./compoent/AdminDashBoard/AdminDashBoardPages/Financials";
import Properties from "./compoent/AdminDashBoard/AdminDashBoardPages/Properties";
import Message from "./compoent/AdminDashBoard/AdminDashBoardPages/Messages";
import DashBoardDocuments from "./compoent/AdminDashBoard/AdminDashBoardPages/DashBoardDocuments";
import Support from "./compoent/AdminDashBoard/AdminDashBoardPages/Support";
import { HomeMain } from "./compoent/HomePageNew/HomeMain";
import PropertyListingForm from "./compoent/PropertyListingForm/PropertyListingForm";
import Tmx9PropertyForm from "./compoent/ovikalistingform/Tmx9PropertyForm";
import PGListingForm from "./compoent/ovikalistingform/PGListingForm";
import PropertyListPage from "./compoent/ovikalistingform/PropertyListPage";
import PropertyDetailPage from "./compoent/ovikalistingform/PropertyDetailPage";
import PrivacyPolicy from "./compoent/PrivacyPolicy/PrivacyPolicy";
import TermsAndConditions from "./compoent/TermsAndConditions/TermsAndConditions";
import RefundAndCancellation from "./compoent/RefundAndCancellation/RefundAndCancellation";
import FAQ from "./compoent/FAQ/FAQ";
import OvikaVerified from "./compoent/ovikalistingform/OvikaVerified";
import { useContext, useEffect } from "react";
import { Subsriptionmain } from "./compoent/SubsriptionNew/Subsriptionmain";
import SuperAdminDashboard from './compoent/AdminDashBoard/SuperAdmin/SuperAdminDashboard';
import { Notification } from "./compoent/Dashboard/Notification";
import PGUpdateForm from "./compoent/ovikalistingform/PGUpdateForm";
import  ContactMain  from "./compoent/ContactUs/ContactMain";
import CareerSupport from "./compoent/CareerSupport/CareerSupport";
import CookieConsent from "./compoent/CookieConsent/CookieConsent";
import ColivingSpace from './compoent/CoLivingSpace/ColivingSpace';
import Home9 from "./compoent/HomePageNew/Home9";
import Home10 from "./compoent/HomePageNew/Home10";
import  OvikaSelfVerified  from "./compoent/ovikalistingform/OvikaSelfVerified";

// 🔒 Protected Route Component
function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    // not logged in → send to login, with info from where user came
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// 🔒 Protected Admin Dashboard Layout Component
function ProtectedAdminLayout() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    // Agar user login nahi hai, to login page par redirect karo
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Agar user login hai, to AdminDashboardLayout render karo
  return <AdminDashboardLayout />;
}

// 🔄 Scroll to Top Component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AnalyticsTracker />
        {/* Top Navbar */}
        <Navbar />
    
        {/* All Routes */}
        <Routes>
          {/* Main Website Pages */}
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<HomeMain />} />
          <Route path="/tmluxe" element={<LuxeMain />} />
          <Route path="/tmluxespecific/:id" element={<ThirdMain />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/list-property" element={<ListPropertyPage />} />
          <Route path="/success" element={<Sucess />} />
          <Route path="/failure" element={<Failure />} />
          <Route path="/selfmanage" element={<SelfManage />} />
          <Route path="/ownermain" element={<Ownermain />} />
          <Route path="/renovation" element={<FifthMain />} />
          <Route path="/listed" element={<PropertyListingForm />} />
          <Route path="/subsription" element={<Subsriptionmain/>}/>
          <Route path="/notification" element={<Notification/>}/>
          <Route path="/contactus" element={<ContactMain/>}/>
          <Route path="/nightly-stays" element={<Home9/>}/>
          <Route path="/monthly-rentals" element={<Home10/>}/>
<Route path="/ovika-self-verified" element={<OvikaSelfVerified/>}/>
          {/* ✅ PROTECTED ROUTE – only after login */}
          <Route
            path="/listed1"
            element={
              <RequireAuth>
                <Tmx9PropertyForm />
              </RequireAuth>
            }
          />
          <Route
            path="/list-pg"
            element={
              <RequireAuth>
                <PGListingForm />
              </RequireAuth>
            }
          />
          <Route
            path="/update-pg/:id"
            element={
              <RequireAuth>
                <PGUpdateForm />
              </RequireAuth>
            }
          />

          {/* Property Listing and Detail Pages */}
          <Route path="/properties" element={<PropertyListPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/refund-cancellation-policy" element={<RefundAndCancellation />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/ovika-verified" element={<OvikaVerified />} />
          <Route path="/career-support" element={<RequireAuth><CareerSupport /></RequireAuth>} />
          <Route path="/coliving-space" element={<ColivingSpace />} />
          <Route path="/admindashboard" element={<ProtectedAdminLayout />}>
            <Route index element={<AdminDashBoard />} />
            <Route path="inquiriesbookings" element={<InquiriesBookings />} />
            <Route path="financials" element={<Financials />} />
            <Route path="properties" element={<Properties />} />
            <Route path="messages" element={<Message />} />
            <Route path="documents" element={<DashBoardDocuments />} />
            <Route path="support" element={<Support />} />
            <Route path="listed" element={<PropertyListingForm />} />
           
          </Route>

          {/* Super Admin Dashboard - Already Protected */}
          <Route path="/admin-control-panel" element={<RequireAuth><SuperAdminDashboard /></RequireAuth>} />
        </Routes>

        {/* Bottom Footer */}
        <HoomieFooter />
        
        {/* Cookie Consent Banner */}
        <CookieConsent />
      </Router>
    </AuthProvider>
  );
}

export default App;