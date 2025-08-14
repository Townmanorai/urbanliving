import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './compoent/Homepage/Home';
import Navbar from './compoent/Homepage/Navabar';
import HoomieFooter from './compoent/Homepage/HoomieFooter';
import LuxeMain from './compoent/Secondpage/LuxeMain';

// Example pages (you'll need to create these components)
const About = () => <div>About Page</div>;
const Contact = () => <div>Contact Page</div>;
const NotFound = () => <div>404 - Page Not Found</div>;

function App() {
  return (
    <Router>
      <Navbar/>
      
      <Routes>
        <Route path="/" element={<Home />} />
       <Route path="/tmluxe" element={<LuxeMain />} />
      </Routes>
      <HoomieFooter/>
    </Router>
  );
}

export default App;
