import React, { useState } from 'react';
import ImageSearch from './components/ImageSearch';
import ImageCanvas from './components/ImageCanvas';

function App() {
  const [selectedImage, setSelectedImage] = useState('');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Image Caption App</h1>
      {selectedImage ? (
        <ImageCanvas imageUrl={selectedImage} onReset={() => setSelectedImage("")} />
      ) : (
        <ImageSearch onSelect={setSelectedImage} />
      )}
    </div>
  );
}

export default App;
