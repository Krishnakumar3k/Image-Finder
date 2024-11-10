import React, { useRef, useEffect, useState } from "react";
import * as fabric from "fabric";

const CanvasImg = ({ imageUrl, onReset }) => {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fillColor, setFillColor] = useState("#000000");

  useEffect(() => {
    fabricCanvas.current = new fabric.Canvas(canvasRef.current, { selection: true });

    if (!imageUrl) {
      setImageError(true);
      return;
    }

    const pugImg = new Image();
    pugImg.crossOrigin = "anonymous";
    pugImg.onload = function () {
      const canvasWidth = fabricCanvas.current.width;
      const canvasHeight = fabricCanvas.current.height;
      const scaleX = canvasWidth / pugImg.width;
      const scaleY = canvasHeight / pugImg.height;
      const scale = Math.min(scaleX, scaleY);

      const pug = new fabric.Image(pugImg, {
        scaleX: scale,
        scaleY: scale,
        originX: "center",
        originY: "center",
        left: canvasWidth / 2,
        top: canvasHeight / 2,
      });

      fabricCanvas.current.add(pug);
      fabricCanvas.current.renderAll();
      setImageLoaded(true);
      setImageError(false);
    };

    pugImg.onerror = () => {
      setImageError(true);
      setImageLoaded(false);
    };

    pugImg.src = imageUrl;

    return () => {
      fabricCanvas.current.dispose();
    };
  }, [imageUrl]);

  const addText = () => {
    const text = new fabric.Textbox("Edit me", {
      left: 100,
      top: 100,
      width: 200,
      fontSize: 20,
      fill: "black",
    });
    fabricCanvas.current.add(text);
    fabricCanvas.current.setActiveObject(text);
  };

  const toggleBold = () => {
    const activeObject = fabricCanvas.current.getActiveObject();
    if (activeObject && activeObject.type === "textbox") {
      activeObject.set("fontWeight", activeObject.fontWeight === "bold" ? "normal" : "bold");
      fabricCanvas.current.renderAll();
    }
  };

  const toggleItalic = () => {
    const activeObject = fabricCanvas.current.getActiveObject();
    if (activeObject && activeObject.type === "textbox") {
      activeObject.set("fontStyle", activeObject.fontStyle === "italic" ? "normal" : "italic");
      fabricCanvas.current.renderAll();
    }
  };

  const toggleUnderline = () => {
    const activeObject = fabricCanvas.current.getActiveObject();
    if (activeObject && activeObject.type === "textbox") {
      activeObject.set("underline", !activeObject.underline);
      fabricCanvas.current.renderAll();
    }
  };

  const addShape = (shapeType) => {
    let shape;
    const borderColor = "black";
    const borderWidth = 2;

    switch (shapeType) {
      case "circle":
        shape = new fabric.Circle({ radius: 50, left: 100, top: 100, fill: null, stroke: borderColor, strokeWidth: borderWidth });
        break;
      case "rectangle":
        shape = new fabric.Rect({ width: 100, height: 50, left: 100, top: 100, fill: null, stroke: borderColor, strokeWidth: borderWidth });
        break;
      case "triangle":
        shape = new fabric.Triangle({ width: 100, height: 100, left: 100, top: 100, fill: null, stroke: borderColor, strokeWidth: borderWidth });
        break;
      case "polygon":
        shape = new fabric.Polygon([{ x: 50, y: 0 }, { x: 100, y: 50 }, { x: 50, y: 100 }, { x: 0, y: 50 }], {
          left: 100,
          top: 100,
          fill: null,
          stroke: borderColor,
          strokeWidth: borderWidth,
        });
        break;
      default:
        return;
    }

    fabricCanvas.current.add(shape);
    fabricCanvas.current.setActiveObject(shape);
  };

  const fillShapeWithColor = (color) => {
    const activeObject = fabricCanvas.current.getActiveObject();
    if (activeObject) {
      activeObject.set({ fill: color, stroke: null });
      fabricCanvas.current.renderAll();
    }
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
    const dataURL = fabricCanvas.current.toDataURL({ format: "png", quality: 1 });
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas.png";
    link.click();
  };

  return (
    <div className="p-4">
      <button onClick={onReset} className="bg-gray-500 text-white p-2 rounded mb-4">Back to Search</button>

      {imageError && !imageLoaded && (
        <div className="text-red-500 mb-4">Image Loading Failed. Please Try Later</div>
      )}
      {!imageError && imageLoaded && (
        <div className="text-green-500 mb-4">Image Loaded Successfully</div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={addText} className="bg-blue-500 text-white p-2 rounded">Add Text</button>
        <button onClick={toggleBold} className="bg-purple-500 text-white p-2 rounded">Bold</button>
        <button onClick={toggleItalic} className="bg-purple-500 text-white p-2 rounded">Italic</button>
        <button onClick={toggleUnderline} className="bg-purple-500 text-white p-2 rounded">Underline</button>
        <button onClick={() => addShape("circle")} className="bg-blue-500 text-white p-2 rounded">Add Circle</button>
        <button onClick={() => addShape("rectangle")} className="bg-blue-500 text-white p-2 rounded">Add Rectangle</button>
        <button onClick={() => addShape("triangle")} className="bg-blue-500 text-white p-2 rounded">Add Triangle</button>
        <button onClick={() => addShape("polygon")} className="bg-blue-500 text-white p-2 rounded">Add Polygon</button>
        <button onClick={removeActiveObject} className="bg-yellow-500 text-white p-2 rounded">Remove Active</button>
        <button onClick={removeAllObjects} className="bg-red-500 text-white p-2 rounded">Clear All</button>
        <input
          value={fillColor}
          onChange={(e) => {
            setFillColor(e.target.value);
            fillShapeWithColor(e.target.value);
          }}
          type="color"
          className="p-1 h-10 w-14 bg-white border border-gray-400 cursor-pointer rounded-lg"
          title="Choose your color"
        />
        
      </div>

      <div className="w-full mt-4 flex justify-center">
        <canvas ref={canvasRef} width={800} height={600} className="border mt-4 w-full max-w-md md:max-w-lg lg:max-w-2xl"></canvas>
      </div>

      <div className="flex justify-center mt-4">
      <button onClick={downloadImage} className="bg-green-500 text-white p-2 rounded mr-10 mt-5">Download Image</button>
    </div>
    </div>
  );
};

export default CanvasImg;
