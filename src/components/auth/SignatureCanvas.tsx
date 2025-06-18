
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PenTool, RotateCcw, Check } from 'lucide-react';

interface SignatureCanvasProps {
  onSave: (dataUrl: string) => void;
  width?: number;
  height?: number;
  backgroundColor?: string; 
  penColor?: string;      
}

export function SignatureCanvas({ 
  onSave, 
  width = 500, 
  height = 200,
  backgroundColor, 
  penColor         
}: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  
  const [resolvedBgColor, setResolvedBgColor] = useState<string>('');
  const [resolvedPenColor, setResolvedPenColor] = useState<string>('');

  useEffect(() => {
    const computedStyle = getComputedStyle(document.documentElement);

    const formatColorValue = (cssVarName: string, fallbackColor: string): string => {
      let colorStr = computedStyle.getPropertyValue(cssVarName).trim();
      if (colorStr) {
        if (colorStr.includes(' ') && !colorStr.match(/^(hsl|rgb|#|transparent|currentcolor)/i)) {
          colorStr = `hsl(${colorStr})`;
        }
        return colorStr;
      }
      return fallbackColor;
    };
    
    // Resolve background color
    if (backgroundColor) {
        // If an explicit backgroundColor is provided (e.g., "transparent"), use it.
        setResolvedBgColor(backgroundColor);
    } else {
        // Otherwise, default to CSS variable or a fallback.
        setResolvedBgColor(formatColorValue('--card', '#FFFFFF'));
    }
    
    // Resolve pen color
    if (penColor) {
        setResolvedPenColor(penColor);
    } else {
        setResolvedPenColor(formatColorValue('--foreground', '#000000'));
    }

  }, [backgroundColor, penColor]); 


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !resolvedBgColor || !resolvedPenColor) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;

    // Clear canvas before redrawing background (important if background changes)
    context.clearRect(0,0,canvas.width, canvas.height);

    // Set background color only if it's not meant to be transparent for the PNG output
    if (resolvedBgColor !== 'transparent') {
        context.fillStyle = resolvedBgColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
    // If resolvedBgColor IS 'transparent', the canvas context remains transparent.
    // The visual background for the user is handled by the CSS class on the <canvas> element.

    context.strokeStyle = resolvedPenColor;
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.lineJoin = 'round';

  }, [resolvedBgColor, resolvedPenColor, width, height]);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    
    const pos = getMousePos(event);
    context.beginPath();
    context.moveTo(pos.x, pos.y);
    setIsDrawing(true);
    setIsEmpty(false);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;

    const pos = getMousePos(event);
    context.lineTo(pos.x, pos.y);
    context.stroke();
  };

  const stopDrawing = () => {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
  };
  
  const getMousePos = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    let clientX, clientY;

    if (event.nativeEvent instanceof MouseEvent) {
      clientX = event.nativeEvent.clientX;
      clientY = event.nativeEvent.clientY;
    } else if (event.nativeEvent instanceof TouchEvent && event.nativeEvent.touches.length > 0) {
      clientX = event.nativeEvent.touches[0].clientX;
      clientY = event.nativeEvent.touches[0].clientY;
    } else {
      return { x: 0, y: 0 }; 
    }
    
    const scaleX = canvasRef.current!.width / rect.width;
    const scaleY = canvasRef.current!.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };


  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !resolvedBgColor) return; // Need resolvedBgColor to clear properly
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Clear the canvas completely first
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Then, if the background isn't meant to be transparent, fill it.
    if (resolvedBgColor !== 'transparent') {
        context.fillStyle = resolvedBgColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
    setIsEmpty(true);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas && !isEmpty) {
      // If backgroundColor was 'transparent', the canvas context is already transparent,
      // so toDataURL will produce a transparent PNG.
      // If backgroundColor was a color, toDataURL will include that background.
      // The logic in useEffect already handles this setup.
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl);
    } else {
      alert("Please provide your signature.");
    }
  };

  if(!resolvedBgColor || !resolvedPenColor) {
    return <div style={{ width, height }} className="bg-muted rounded-lg border border-input animate-pulse"></div>;
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <p className="text-sm text-muted-foreground flex items-center">
        <PenTool className="w-4 h-4 mr-2" /> Draw your signature below.
      </p>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="border border-input rounded-lg bg-card cursor-crosshair shadow-inner" // bg-card provides VISUAL background
        style={{ touchAction: 'none' }}
      />
      <div className="flex space-x-4">
        <Button variant="outline" onClick={clearCanvas} type="button">
          <RotateCcw className="mr-2 h-4 w-4" /> Clear
        </Button>
        <Button onClick={handleSave} disabled={isEmpty} type="button" className="btn-gradient-hover">
          <Check className="mr-2 h-4 w-4" /> <span>Confirm Signature</span>
        </Button>
      </div>
    </div>
  );
}
