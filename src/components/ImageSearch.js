import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageSearch = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchImages = async () => {
    if (!query) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: { query, per_page: 20 }, // Add per_page for optimization
        headers: {
          Authorization: 'Client-ID RV8KcXQYoLo5djNFZOxnJk5egtXl9VkTG_AP2pBuNOU',
        },
      });
      setImages(response.data.results);
    } catch (error) {
      setError('Error fetching images. Please try again later.');
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce API call on query change
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchImages();
    }, 300); // Debounce delay of 300ms

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  return (
    <div className="p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded"
        placeholder="Search for images..."
      />
      <button 
        onClick={fetchImages} 
        className="bg-blue-500 text-white p-2 rounded ml-2"
        disabled={!query} // Disable button if no query
      >
        Search
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {images.length === 0 && !loading && !error && (
        <p>No images found. Try a different search!</p> // Empty state message
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {images.map((image) => (
          <div key={image.id} className="cursor-pointer" onClick={() => onSelect(image.urls.regular)}>
            <img src={image.urls.small} alt={image.alt_description} className="w-full h-auto rounded" />
            <button className="bg-green-500 text-white p-2 rounded mt-2">Add Captions</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSearch;
