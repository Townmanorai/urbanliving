import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../Login/AuthContext';
import { HiHome, HiOutlineHome } from 'react-icons/hi';
import { BiSearch, BiCalendar, BiSolidCalendar } from 'react-icons/bi';
import { FiUser, FiPlus, FiX, FiLogOut, FiLogIn, FiBell, FiShield } from 'react-icons/fi';
import { RiUser3Fill } from 'react-icons/ri';
import { MdOutlineBedroomParent, MdSupportAgent, MdOutlineCalculate, MdOutlinePrivacyTip } from 'react-icons/md';
import { HiOutlineHome as HiOutlineHomeIcon } from 'react-icons/hi';
import { IoDocumentTextOutline, IoInformationCircleOutline } from 'react-icons/io5';
import { TbRefresh, TbBuildingEstate } from 'react-icons/tb';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { HiOutlineUserGroup } from 'react-icons/hi';
import './MobileBottomNav.css';

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const path = location.pathname;
  const tab  = new URLSearchParams(location.search).get('tab');

  const allowed = ['/', '/dashboard'];
  if (!allowed.includes(path)) return null;

  const isHome     = path === '/';
  const isBookings = path === '/dashboard' && tab === 'booking';

  const handleBookings = () => {
    if (user) navigate('/dashboard?tab=booking');
    else navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    if (setUser) setUser(null);
    setDrawerOpen(false);
    navigate('/');
  };

  const go = (p) => { setDrawerOpen(false); navigate(p); };

  const avatar = user?.username?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <>
      {/* ── Bottom Nav Bar ── */}
      <nav className="mbn-bar">
        <button className={`mbn-item ${isHome ? 'mbn-item--active' : ''}`} onClick={() => navigate('/')}>
          {isHome ? <HiHome className="mbn-icon" /> : <HiOutlineHome className="mbn-icon" />}
          <span className="mbn-label">Home</span>
        </button>

        <button className="mbn-item" onClick={() => navigate('/properties')}>
          <BiSearch className="mbn-icon" />
          <span className="mbn-label">Explore</span>
        </button>

        <button className="mbn-item mbn-item--list" onClick={() => navigate('/list-category')}>
          <div className="mbn-plus-btn">
            <FiPlus size={26} strokeWidth={2.5} />
          </div>
          <span className="mbn-label mbn-label--list">List</span>
        </button>

        <button className={`mbn-item ${isBookings ? 'mbn-item--active' : ''}`} onClick={handleBookings}>
          {isBookings ? <BiSolidCalendar className="mbn-icon" /> : <BiCalendar className="mbn-icon" />}
          <span className="mbn-label">Bookings</span>
        </button>

        <button className="mbn-item" onClick={() => setDrawerOpen(true)}>
          {user ? <RiUser3Fill className="mbn-icon" /> : <FiUser className="mbn-icon" />}
          <span className="mbn-label">Profile</span>
        </button>
      </nav>

      {/* ── Full-screen Drawer ── */}
      {drawerOpen && (
        <div className="mbn-drawer-overlay">
          <div className="mbn-drawer">

            {/* Close button */}
            <button className="mbn-drawer-close" onClick={() => setDrawerOpen(false)}>
              <FiX size={22} />
            </button>

            {/* User info */}
            <div className="mbn-drawer-header">
              <div className="mbn-drawer-avatar">
                {user ? avatar : <FiUser size={28} />}
              </div>
              <div>
                <div className="mbn-drawer-name">
                  {user ? (user.username || user.name || 'User') : 'Guest'}
                </div>
                <div className="mbn-drawer-email">
                  {user ? (user.email || '') : 'Not logged in'}
                </div>
              </div>
            </div>

            {/* Scrollable menu */}
            <div className="mbn-drawer-menu">

              {/* Main */}
              <div className="mbn-drawer-section-label">Main</div>
              <button className="mbn-drawer-item" onClick={() => go('/')}>
                <HiOutlineHomeIcon size={20} /> Home
              </button>
              <button className="mbn-drawer-item" onClick={() => go('/properties')}>
                <BiSearch size={20} /> Explore Stays
              </button>
              <button className="mbn-drawer-item" onClick={() => go('/nightly-stays')}>
                <TbBuildingEstate size={20} /> Nightly Stays
              </button>
              <button className="mbn-drawer-item" onClick={() => go('/monthly-rentals')}>
                <TbBuildingEstate size={20} /> Monthly Rentals
              </button>
              <button className="mbn-drawer-item" onClick={() => go('/coliving-space')}>
                <HiOutlineUserGroup size={20} /> Co-Living Spaces
              </button>

              <div className="mbn-drawer-divider" />

              {/* Account */}
              <div className="mbn-drawer-section-label">Account</div>
              {user && (
                <button className="mbn-drawer-item" onClick={() => go('/dashboard?tab=booking')}>
                  <BiCalendar size={20} /> My Bookings
                </button>
              )}
              {user && (
                <button className="mbn-drawer-item" onClick={() => go('/notification')}>
                  <FiBell size={20} /> Notifications
                </button>
              )}
              <button className="mbn-drawer-item" onClick={() => go('/list-category')}>
                <MdOutlineBedroomParent size={20} /> List Your Property
              </button>
              <button className="mbn-drawer-item" onClick={() => go('/roi-calculator')}>
                <MdOutlineCalculate size={20} /> ROI Calculator
              </button>

              <div className="mbn-drawer-divider" />

              {/* Info */}
              <div className="mbn-drawer-section-label">Info & Help</div>
              <button className="mbn-drawer-item" onClick={() => go('/about')}>
                <IoInformationCircleOutline size={20} /> About Us
              </button>
              <button className="mbn-drawer-item" onClick={() => go('/contactus')}>
                <MdSupportAgent size={20} /> Contact / Support
              </button>
              <button className="mbn-drawer-item" onClick={() => go('/faq')}>
                <AiOutlineQuestionCircle size={20} /> FAQ
              </button>
              <button className="mbn-drawer-item" onClick={() => go('/privacy-policy')}>
                <MdOutlinePrivacyTip size={20} /> Privacy Policy
              </button>
              <button className="mbn-drawer-item" onClick={() => go('/terms-and-conditions')}>
                <IoDocumentTextOutline size={20} /> Terms & Conditions
              </button>
              <button className="mbn-drawer-item" onClick={() => go('/refund-cancellation-policy')}>
                <TbRefresh size={20} /> Refund & Cancellation
              </button>
              <button className="mbn-drawer-item" onClick={() => go('/legal-information')}>
                <FiShield size={20} /> Legal Information
              </button>

              <div className="mbn-drawer-divider" />

              {/* Login / Logout */}
              {user ? (
                <button className="mbn-drawer-logout" onClick={handleLogout}>
                  <FiLogOut size={18} /> Logout
                </button>
              ) : (
                <button className="mbn-drawer-login" onClick={() => go('/login')}>
                  <FiLogIn size={18} /> Login / Sign Up
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
