import React, { useState } from 'react';
import SearchImg from './components/SearchImg';
import CanvasImg from './components/CanvasImg';
import './App.css';
// import Logo from '';

function App() {
  const [selectedImage, setSelectedImage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control the mobile menu toggle

  return (
    <>
      <nav className="navbar bg-gray-800 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {/* <img src={Logo} alt="Logo" className="w-8 h-8" /> */}
            <h1 className="text-xl font-bold">Image Search App</h1>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-4">
            <li><a href="https://sdekrishna.netlify.app/" className="hover:text-blue-400">Krishna Kumar</a></li>
            {/* <li>|</li>
            <li><a href="mailto:" className="hover:text-blue-400">Email:</a></li> */}
          </ul>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">☰</button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <ul className="md:hidden bg-gray-700 p-4 space-y-2 text-center">
            <li><a href="https://sdekrishna.netlify.app/" className="hover:text-blue-400">Krishna Kumar</a></li>
            <li><a href="mailto:krishnakumar3kgt@gmail.com" className="hover:text-blue-400">Email: krishnakumar3kgt@gmail.com</a></li>
          </ul>
        )}
      </nav>

      <div className="container justify-center mx-auto p-4">
        {selectedImage ? (
          <CanvasImg imageUrl={selectedImage} onReset={() => setSelectedImage('')} />
        ) : (
          <SearchImg onSelect={setSelectedImage} />
        )}
      </div>
    </>
  );
}

export default App;
