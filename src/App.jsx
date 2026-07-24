import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import AnalyticsTracker from "./AnalyticsTracker";
import Navbar from "./compoent/Homepage/Navbar";
import HoomieFooter from "./compoent/Homepage/HoomieFooter";
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
import CategorySelectPage from "./compoent/ListProperty/CategorySelectPage";
import ListingGuidePage from "./compoent/ListProperty/ListingGuidePage";
import SignatureContactPage from "./compoent/ListProperty/SignatureContactPage";
import SelfManage from "./compoent/FourthPage/SelfManage";
import FifthMain from "./compoent/Fifth/FifthMain";
import Ownermain from "./Owner/Ownermain";
import { AuthProvider, AuthContext } from "./compoent/Login/AuthContext";
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
import HotelListingForm from "./compoent/ovikalistingform/HotelListingForm";
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
import HomePageNew1 from "./compoent/HomePageNew2/HomePageNew1";
import  OvikaSelfVerified  from "./compoent/ovikalistingform/OvikaSelfVerified";
import OwnerVerificationForm from "./compoent/ovikalistingform/OwnerVerificationForm";
import { HomePageNewMain } from "./compoent/HomePageNew2/HomePageNewMain";
import LegalInformation from "./compoent/LegalInformation/LegalInformation";
import ROICalculator from "./compoent/ROICalculator/ROICalculator";
import CalendarBlocking from "./compoent/CalendarBlocking/CalendarBlocking";
import SeoManager from "./compoent/SEO/SeoManager";
import BankDetails from "./compoent/AccountDetails/BankDetails";
import OwnerLeads from "./compoent/AdminDashBoard/Leads/OwnerLeads";
import LeadInvoices from "./compoent/AdminDashBoard/Leads/LeadInvoices";
import LeadsSuccess from "./compoent/SubsriptionNew/LeadsSuccess";
import MobileBottomNav from "./compoent/MobileBottomNav/MobileBottomNav";
function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();
if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
function ProtectedAdminLayout() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <AdminDashboardLayout />;
}
function ScrollRestoration() {
  const { key } = useLocation();
useEffect(() => {
    const storageKey = `scroll_${key}`;
    const saved = sessionStorage.getItem(storageKey);
    const restoreTimer = setTimeout(() => {
      window.scrollTo({ top: saved !== null ? parseInt(saved, 10) : 0, behavior: 'instant' });
    }, 50);
    let scrollTimer;
    const onScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        sessionStorage.setItem(storageKey, String(Math.round(window.scrollY)));
      }, 150);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(restoreTimer);
      clearTimeout(scrollTimer);
      window.removeEventListener('scroll', onScroll);
      sessionStorage.setItem(storageKey, String(Math.round(window.scrollY)));
    };
  }, [key]);
  return null;
}
const NO_FOOTER_PATHS = ['/properties', '/nightly-stays', '/monthly-rentals'];
function ConditionalFooter() {
  const location = useLocation();
  const hide = NO_FOOTER_PATHS.includes(location.pathname) || location.pathname.startsWith('/property/');
  if (hide) return null;
  return <HoomieFooter />;
}
function WhatsAppButton() {
  const location = useLocation();
  if (location.pathname !== '/') return null;
  return (
    <a
      href="https://wa.me/919319392227"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
        width: '54px', height: '54px', borderRadius: '50%',
        background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(37,211,102,0.45)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        textDecoration: 'none',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(37,211,102,0.6)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,211,102,0.45)'; }}
      aria-label="Chat on WhatsApp"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 32 32" fill="white">
        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.648 4.83 1.783 6.863L2 30l7.338-1.762A13.94 13.94 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 01-5.84-1.607l-.418-.248-4.354 1.046 1.074-4.234-.273-.435A11.46 11.46 0 014.5 16C4.5 9.649 9.649 4.5 16 4.5S27.5 9.649 27.5 16 22.351 27.5 16 27.5zm6.29-8.61c-.344-.172-2.037-1.004-2.352-1.119-.316-.115-.546-.172-.776.172s-.891 1.119-1.092 1.35c-.2.23-.402.258-.746.086-.344-.172-1.452-.535-2.766-1.707-1.022-.912-1.713-2.037-1.913-2.381-.2-.344-.021-.53.15-.701.155-.154.344-.402.516-.603.172-.201.229-.344.344-.574.115-.23.057-.43-.028-.602-.086-.172-.776-1.87-1.063-2.562-.28-.672-.564-.58-.776-.591l-.661-.012c-.23 0-.603.086-.918.43s-1.205 1.177-1.205 2.869 1.234 3.328 1.406 3.558c.172.23 2.43 3.71 5.887 5.202.823.355 1.465.567 1.966.726.826.263 1.578.226 2.172.137.662-.1 2.037-.832 2.324-1.635.287-.803.287-1.492.2-1.635-.086-.143-.316-.23-.66-.402z"/>
      </svg>
    </a>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollRestoration />
        <AnalyticsTracker />
        <SeoManager />
        <Navbar />
        <div className="app-routes-wrapper">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/home-main" element={<HomeMain />} />
          <Route path="/" element={<HomePageNewMain />} />
          <Route path="/tmluxe" element={<LuxeMain />} />
          <Route path="/tmluxespecific/:id" element={<ThirdMain />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/list-property" element={<ListPropertyPage />} />
          <Route path="/list-category" element={<CategorySelectPage />} />
          <Route path="/listing-guide" element={<ListingGuidePage />} />
          <Route path="/signature-listing" element={<SignatureContactPage />} />
          <Route path="/success" element={<Sucess />} />
          <Route path="/failure" element={<Failure />} />
          <Route path="/selfmanage" element={<SelfManage />} />
          <Route path="/ownermain" element={<Ownermain />} />
          <Route path="/renovation" element={<FifthMain />} />
          <Route path="/listed" element={<PropertyListingForm />} />
          <Route path="/buy-leads" element={<Subsriptionmain/>}/>
          <Route path="/notification" element={<Notification/>}/>
          <Route path="/contactus" element={<ContactMain/>}/>
          <Route path="/nightly-stays" element={<PropertyListPage />}/>
          <Route path="/monthly-rentals" element={<PropertyListPage />}/>
<Route path="/ovika-self-verified" element={<OvikaSelfVerified/>}/>
          <Route path="/owner-verification" element={<OwnerVerificationForm/>}/>
          <Route
            path="/listed1"
            element={
              <RequireAuth>
                <Tmx9PropertyForm />
              </RequireAuth>
            }
          />
          <Route
            path="/list-hotel"
            element={
              <RequireAuth>
                <HotelListingForm />
              </RequireAuth>
            }
          />
          <Route
            path="/update-hotel/:id"
            element={
              <RequireAuth>
                <HotelListingForm />
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
          <Route
            path="/update-property/:id"
            element={
              <RequireAuth>
                <Tmx9PropertyForm />
              </RequireAuth>
            }
          />
          <Route path="/properties" element={<PropertyListPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/refund-cancellation-policy" element={<RefundAndCancellation />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/ovika-verified" element={<OvikaVerified />} />
          <Route path="/career-support" element={<RequireAuth><CareerSupport /></RequireAuth>} />
          <Route path="/coliving-space" element={<ColivingSpace />} />
          <Route path="/legal-information" element={<LegalInformation />} />
          <Route path="/roi-calculator" element={<ROICalculator />} />
          <Route path="/support" element={<ContactMain />} />
          <Route path="/admindashboard" element={<ProtectedAdminLayout />}>
            <Route index element={<AdminDashBoard />} />
            <Route path="inquiriesbookings" element={<InquiriesBookings />} />
            <Route path="financials" element={<Financials />} />
            <Route path="properties" element={<Properties />} />
            <Route path="messages" element={<Message />} />
            <Route path="documents" element={<DashBoardDocuments />} />
            <Route path="roi-calculator" element={<ROICalculator />} />
            <Route path="bank-details" element={<BankDetails standalone />} />
            <Route path="support" element={<Support />} />
            <Route path="calendar" element={<CalendarBlocking />} />
            <Route path="leads" element={<OwnerLeads />} />
            <Route path="invoices" element={<LeadInvoices />} />
            <Route path="listed" element={<PropertyListingForm />} />    
          </Route>
          <Route path="/leads-success" element={<LeadsSuccess />} />
          <Route path="/admin-control-panel" element={<RequireAuth><SuperAdminDashboard /></RequireAuth>} />
        </Routes>
        </div>
        <ConditionalFooter />
        <MobileBottomNav />
        <CookieConsent />
        <WhatsAppButton />
      </Router>
    </AuthProvider>
  );
}
export default App;