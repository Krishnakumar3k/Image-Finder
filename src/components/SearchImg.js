import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

const SearchImg = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchImages = useCallback(async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: { query, per_page: 20 },
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
  }, [query]);

  useEffect(() => {
    if (query) {
      const handler = setTimeout(fetchImages, 300);
      return () => clearTimeout(handler);
    }
  }, [query, fetchImages]);

  const handleAddCaption = (image) => {
    onSelect(image.urls.regular); // Pass the selected image URL directly to the canvas editor
  };

  const handleDownloadImage = (imageUrl) => {
    // Fetch the image and trigger the download with FileSaver.js
    axios.get(imageUrl, { responseType: 'blob' })
      .then(response => {
        // Extract the file name from the URL
        const fileName = imageUrl.split('/').pop().split('?')[0];
        const pngFileName = fileName.endsWith('.png') ? fileName : fileName + '.png'; // Ensure the file ends with .png
        saveAs(response.data, pngFileName); // Save as PNG
      })
      .catch((error) => {
        console.error('Download error:', error);
      });
  };

  return (
    <>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-3 rounded text-base w-full sm:w-2/3 md:w-1/2 lg:w-1/3"
          placeholder="Type Here To Search..."
        />
        <button
          onClick={fetchImages}
          className="bg-blue-500 text-white p-3 rounded ml-2 text-base"
          disabled={!query}
        >
          Search
        </button>
      </div>

      {loading && <p className="text-center text-blue-500">Loading...</p>}
      {query && !loading && images.length === 0 && !error && (
        <p className="text-center text-red-500">No images found. Try a different search!</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {images.map((image) => (
            <div key={image.id} className="cursor-pointer">
              <img
                src={image.urls.small}
                alt={image.alt_description}
                className="w-full h-auto rounded object-cover"
              />
              <div className="flex justify-between items-center mt-2 ">
                <button
                  className="bg-green-500 text-white p-1 rounded ml-5"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddCaption(image); // Pass the image object directly to the handleAddCaption function
                  }}
                >
                  Add Caption
                </button>
                <button
                  className="bg-blue-500 text-white p-1 rounded mr-5"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadImage(image.urls.full); // Download the image in PNG format
                  }}
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchImg;
