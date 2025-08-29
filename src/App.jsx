import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './compoent/Homepage/Home';

import HoomieFooter from './compoent/Homepage/HoomieFooter';
import LuxeMain from './compoent/Secondpage/LuxeMain';
import ThirdMain from './compoent/ThirdPage/ThirdMain';
import Payment from './compoent/payment/Payment';
import Auth from './Auth';
import AuthPage from './compoent/Login/AuthPage';
import About from './compoent/about/About';



function App() {
  return (
    <Router>
  
      <Routes>
        <Route path="/" element={<Home />} />
       <Route path="/tmluxe" element={<LuxeMain />} />
       <Route path="/tmluxespecific/:id" element={<ThirdMain />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/login" element={<AuthPage />} />
         <Route path="/about" element={<About />} />
      </Routes>
      <HoomieFooter/>
    </Router>
  );
}

export default App;
