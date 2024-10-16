import React, { useRef, useEffect, useState } from "react";
import { Canvas, Image, Textbox, Circle, Rect, Triangle, Polygon } from "fabric";

const ImageCanvas = ({ imageUrl, onReset }) => {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const [imageError, setImageError] = useState(false); // Track image loading error

  useEffect(() => {
    fabricCanvas.current = new Canvas(canvasRef.current, {
      backgroundColor: 'white',
      selection: true, // Allow selection of objects
    });

    // Load image onto canvas
    Image.fromURL(
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
        setImageError(false); // Reset image error
      },
      { crossOrigin: "anonymous" }
    ).catch((err) => {
      console.error("Error loading image:", err);
      setImageError(true); // Set error state
    });

    return () => {
      fabricCanvas.current.dispose();
    };
  }, [imageUrl]);

  const addText = () => {
    const text = new Textbox("Edit me", {
      left: 100,
      top: 100,
      width: 200,
      fontSize: 20,
      fill: "black",
    });
    fabricCanvas.current.add(text);
    fabricCanvas.current.setActiveObject(text);
  };

  const addShape = (shapeType) => {
    let shape;
    switch (shapeType) {
      case "circle":
        shape = new Circle({
          radius: 50,
          fill: "blue",
          left: 100,
          top: 100,
        });
        break;
      case "rectangle":
        shape = new Rect({
          width: 100,
          height: 50,
          fill: "green",
          left: 100,
          top: 100,
        });
        break;
      case "triangle":
        shape = new Triangle({
          width: 100,
          height: 100,
          fill: "yellow",
          left: 100,
          top: 100,
        });
        break;
      case "polygon":
        shape = new Polygon(
          [
            { x: 50, y: 0 },
            { x: 100, y: 50 },
            { x: 50, y: 100 },
            { x: 0, y: 50 },
          ],
          {
            fill: "red",
            left: 100,
            top: 100,
          }
        );
        break;
      default:
        return;
    }

    fabricCanvas.current.add(shape);
    fabricCanvas.current.setActiveObject(shape);
  };

  const removeActiveObject = () => {
    const activeObject = fabricCanvas.current.getActiveObject();
    if (activeObject) {
      fabricCanvas.current.remove(activeObject);
      fabricCanvas.current.discardActiveObject();
      fabricCanvas.current.renderAll();
    }
  };

  const removeAllObjects = () => {
    fabricCanvas.current.getObjects().forEach((obj) => {
      if (obj !== fabricCanvas.current.backgroundImage) {
        fabricCanvas.current.remove(obj);
      }
    });
    fabricCanvas.current.renderAll();
  };

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

      {imageError && (
        <div className="text-red-500 mb-4">Failed to load image. Please try again later.</div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={addText} className="bg-blue-500 text-white p-2 rounded">Add Text</button>
        <button onClick={() => addShape("circle")} className="bg-blue-500 text-white p-2 rounded">Add Circle</button>
        <button onClick={() => addShape("rectangle")} className="bg-blue-500 text-white p-2 rounded">Add Rectangle</button>
        <button onClick={() => addShape("triangle")} className="bg-blue-500 text-white p-2 rounded">Add Triangle</button>
        <button onClick={() => addShape("polygon")} className="bg-blue-500 text-white p-2 rounded">Add Polygon</button>
        <button onClick={removeActiveObject} className="bg-yellow-500 text-white p-2 rounded">Remove Active</button>
        <button onClick={removeAllObjects} className="bg-red-500 text-white p-2 rounded">Clear All</button>
      </div>

      <canvas ref={canvasRef} width={800} height={600} className="border"></canvas>

      <button onClick={downloadImage} className="bg-red-500 text-white p-2 rounded mt-4">Download</button>
    </div>
  );
};

export default ImageCanvas;
