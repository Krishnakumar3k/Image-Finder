import React, { useRef, useEffect, useState } from "react";
import * as fabric from "fabric";

const CanvasImg = ({ imageUrl, onReset }) => {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Initialize the Fabric.js canvas
    fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
      backgroundColor: 'white',
      selection: true,
    });

    // Check if image URL is valid
    if (!imageUrl) {
      setImageError(true);
      return;
    }

    // Load and set the background image
    fabric.Image.fromURL(
      imageUrl,
      (img) => {
        const canvasWidth = fabricCanvas.current.width;
        const canvasHeight = fabricCanvas.current.height;
        const scaleX = canvasWidth / img.width;
        const scaleY = canvasHeight / img.height;
        const scale = Math.min(scaleX, scaleY);

        fabricCanvas.current.setBackgroundImage(
          img,
          fabricCanvas.current.renderAll.bind(fabricCanvas.current),
          {
            scaleX: scale,
            scaleY: scale,
            originX: "center",
            originY: "center",
            top: canvasHeight / 2,
            left: canvasWidth / 2,
          }
        );
        fabricCanvas.current.renderAll(); // Ensure canvas is re-rendered
        setImageLoaded(true); // Update state when image is loaded
        setImageError(false); // Reset error state if image is loaded successfully
      },
      () => {
        setImageError(true); // Set error if image loading fails
        setImageLoaded(false); // Reset loaded state on error
      },
      { crossOrigin: "anonymous" }
    );

    // Cleanup on component unmount
    return () => {
      fabricCanvas.current.dispose();
    };
  }, [imageUrl]);

  // Add a text box to the canvas with customizable properties
  const addText = () => {
    const text = new fabric.Textbox("Edit me", {
      left: 100,
      top: 100,
      width: 200,
      fontSize: 20,
      fill: "black", // Text color
      fontWeight: "bold", // Default font weight
      fontStyle: "italic", // Default font style
      underline: true, // Default underline
    });
    fabricCanvas.current.add(text);
    fabricCanvas.current.setActiveObject(text);
  };

  // Add a shape to the canvas based on the shapeType argument
  const addShape = (shapeType) => {
    let shape;
    const borderColor = "black"; // Default border color
    const borderWidth = 2; // Border width

    switch (shapeType) {
      case "circle":
        shape = new fabric.Circle({
          radius: 50,
          left: 100,
          top: 100,
          fill: null, // Transparent by default
          stroke: borderColor, // Set border color
          strokeWidth: borderWidth, // Set border width
        });
        break;
      case "rectangle":
        shape = new fabric.Rect({
          width: 100,
          height: 50,
          left: 100,
          top: 100,
          fill: null, // Transparent by default
          stroke: borderColor, // Set border color
          strokeWidth: borderWidth, // Set border width
        });
        break;
      case "triangle":
        shape = new fabric.Triangle({
          width: 100,
          height: 100,
          left: 100,
          top: 100,
          fill: null, // Transparent by default
          stroke: borderColor, // Set border color
          strokeWidth: borderWidth, // Set border width
        });
        break;
      case "polygon":
        shape = new fabric.Polygon(
          [
            { x: 50, y: 0 },
            { x: 100, y: 50 },
            { x: 50, y: 100 },
            { x: 0, y: 50 },
          ],
          {
            left: 100,
            top: 100,
            fill: null, // Transparent by default
            stroke: borderColor, // Set border color
            strokeWidth: borderWidth, // Set border width
          }
        );
        break;
      default:
        return;
    }

    fabricCanvas.current.add(shape);
    fabricCanvas.current.setActiveObject(shape);
  };

  // Function to fill the selected shape with a color and remove the border
  const fillShapeWithColor = (color) => {
    const activeObject = fabricCanvas.current.getActiveObject();
    if (activeObject) {
      activeObject.set({ fill: color, stroke: null }); // Fill the shape with the selected color and remove border
      fabricCanvas.current.renderAll();
    }
  };

  // Remove the currently active object from the canvas
  const removeActiveObject = () => {
    const activeObject = fabricCanvas.current.getActiveObject();
    if (activeObject) {
      fabricCanvas.current.remove(activeObject);
      fabricCanvas.current.discardActiveObject();
      fabricCanvas.current.renderAll();
    }
  };

  // Remove all objects except the background image
  const removeAllObjects = () => {
    fabricCanvas.current.getObjects().forEach((obj) => {
      if (obj !== fabricCanvas.current.backgroundImage) {
        fabricCanvas.current.remove(obj);
      }
    });
    fabricCanvas.current.renderAll();
  };

  // Download the canvas as an image
  const downloadImage = () => {
    const dataURL = fabricCanvas.current.toDataURL({
      format: "png",
      quality: 1,
    });
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas.png";
    link.click();
  };

  return (
    <div className="p-4">
      <button onClick={onReset} className="bg-gray-500 text-white p-2 rounded mb-4">
        Back to Search
      </button>

      {imageError && !imageLoaded && (
        <div className="text-red-500 mb-4">Image Loading Failed. Please Try Later</div>
      )}
      {!imageError && imageLoaded && (
        <div className="text-green-500 mb-4">Image Loaded Successfully</div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={addText} className="bg-blue-500 text-white p-2 rounded">Add Text</button>
        <button onClick={() => addShape("circle")} className="bg-blue-500 text-white p-2 rounded">Add Circle</button>
        <button onClick={() => addShape("rectangle")} className="bg-blue-500 text-white p-2 rounded">Add Rectangle</button>
        <button onClick={() => addShape("triangle")} className="bg-blue-500 text-white p-2 rounded">Add Triangle</button>
        <button onClick={() => addShape("polygon")} className="bg-blue-500 text-white p-2 rounded">Add Polygon</button>
        <button onClick={removeActiveObject} className="bg-yellow-500 text-white p-2 rounded">Remove Active</button>
        <button onClick={removeAllObjects} className="bg-red-500 text-white p-2 rounded">Clear All</button>
        <button onClick={() => fillShapeWithColor("red")} className="bg-red-500 text-white p-2 rounded">Fill Red</button>
        <button onClick={() => fillShapeWithColor("green")} className="bg-green-500 text-white p-2 rounded">Fill Green</button>
        <button onClick={() => fillShapeWithColor("blue")} className="bg-blue-500 text-white p-2 rounded">Fill Blue</button>
      </div>

      <canvas ref={canvasRef} width={800} height={600} className="border"></canvas>

      <button onClick={downloadImage} className="bg-red-500 text-white p-2 rounded mt-4">Download</button>
    </div>
  );
};

export default CanvasImg;
