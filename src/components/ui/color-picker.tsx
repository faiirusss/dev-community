import * as React from "react";
import { cn } from "~/lib/utils";
import { X } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  className?: string;
}

// HSV to RGB conversion
function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

// RGB to Hex conversion
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toLowerCase();
}

// Hex to RGB conversion
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = hex.match(/^#([0-9a-fA-F]{6})$/);
  if (!match) return null;

  const bigint = parseInt(match[1], 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

// RGB to HSV conversion
function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  const s = max === 0 ? 0 : diff / max;
  const v = max;

  if (diff !== 0) {
    if (max === r) {
      h = ((g - b) / diff) % 6;
    } else if (max === g) {
      h = (b - r) / diff + 2;
    } else {
      h = (r - g) / diff + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  return { h, s, v };
}

// Validate hex color
function isValidHex(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

export function ColorPicker({ value, onChange, onClear, className }: ColorPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hsv, setHsv] = React.useState({ h: 320, s: 1, v: 1 });
  const [inputValue, setInputValue] = React.useState(value || "#000000");
  
  const gradientRef = React.useRef<HTMLCanvasElement>(null);
  const hueRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  const isDraggingGradient = React.useRef(false);
  const isDraggingHue = React.useRef(false);

  // Initialize HSV from value prop
  React.useEffect(() => {
    if (isValidHex(value)) {
      const rgb = hexToRgb(value);
      if (rgb) {
        const newHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
        setHsv(newHsv);
        setInputValue(value.toLowerCase());
      }
    }
  }, [value]);

  // Draw gradient canvas
  const drawGradient = React.useCallback(() => {
    const canvas = gradientRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw hue background
    const hueColor = hsvToRgb(hsv.h, 1, 1);
    ctx.fillStyle = `rgb(${hueColor.r}, ${hueColor.g}, ${hueColor.b})`;
    ctx.fillRect(0, 0, width, height);

    // Draw white gradient (horizontal)
    const whiteGradient = ctx.createLinearGradient(0, 0, width, 0);
    whiteGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    whiteGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = whiteGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw black gradient (vertical)
    const blackGradient = ctx.createLinearGradient(0, 0, 0, height);
    blackGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    blackGradient.addColorStop(1, "rgba(0, 0, 0, 1)");
    ctx.fillStyle = blackGradient;
    ctx.fillRect(0, 0, width, height);
  }, [hsv.h]);

  // Draw hue slider
  const drawHue = React.useCallback(() => {
    const canvas = hueRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Draw hue gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "#ff0000");
    gradient.addColorStop(0.17, "#ff00ff");
    gradient.addColorStop(0.33, "#0000ff");
    gradient.addColorStop(0.5, "#00ffff");
    gradient.addColorStop(0.67, "#00ff00");
    gradient.addColorStop(0.83, "#ffff00");
    gradient.addColorStop(1, "#ff0000");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }, []);

  // Draw canvases when HSV changes
  React.useEffect(() => {
    drawGradient();
    drawHue();
  }, [drawGradient, drawHue]);

  // Draw canvases immediately when popover opens
  React.useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        drawGradient();
        drawHue();
      });
    }
  }, [isOpen, drawGradient, drawHue]);

  // Handle gradient mouse/touch events
  const handleGradientChange = React.useCallback((clientX: number, clientY: number) => {
    const canvas = gradientRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

    const s = x;
    const v = 1 - y;

    setHsv(prev => {
      const newHsv = { ...prev, s, v };
      const rgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      onChange(hex);
      setInputValue(hex);
      return newHsv;
    });
  }, [onChange]);

  // Handle hue mouse/touch events
  const handleHueChange = React.useCallback((clientX: number) => {
    const canvas = hueRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const h = x * 360;

    setHsv(prev => {
      const newHsv = { ...prev, h };
      const rgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      onChange(hex);
      setInputValue(hex);
      return newHsv;
    });
  }, [onChange]);

  // Mouse event handlers for gradient
  const handleGradientMouseDown = (e: React.MouseEvent) => {
    isDraggingGradient.current = true;
    handleGradientChange(e.clientX, e.clientY);
  };

  // Mouse event handlers for hue
  const handleHueMouseDown = (e: React.MouseEvent) => {
    isDraggingHue.current = true;
    handleHueChange(e.clientX);
  };

  // Global mouse move/up handlers
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingGradient.current) {
        handleGradientChange(e.clientX, e.clientY);
      }
      if (isDraggingHue.current) {
        handleHueChange(e.clientX);
      }
    };

    const handleMouseUp = () => {
      isDraggingGradient.current = false;
      isDraggingHue.current = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleGradientChange, handleHueChange]);

  // Handle hex input change
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (isValidHex(newValue)) {
      const rgb = hexToRgb(newValue);
      if (rgb) {
        const newHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
        setHsv(newHsv);
        onChange(newValue.toLowerCase());
      }
    }
  };

  // Handle click outside to close
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Calculate selector positions
  const gradientX = hsv.s * 100;
  const gradientY = (1 - hsv.v) * 100;
  const hueX = (hsv.h / 360) * 100;

  const currentRgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
  const currentHex = rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Combined Color Box + Input + Clear */}
      <div className="flex items-center gap-2">
        <div 
          className="flex items-center gap-2 flex-1 h-10 px-3 rounded-md border border-input bg-background cursor-pointer hover:border-ring transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* Color Box */}
          <div
            className="h-6 w-6 rounded flex-shrink-0"
            style={{ backgroundColor: value || "#000000" }}
          />
          {/* Hex Value */}
          <input
            type="text"
            value={inputValue}
            onChange={handleHexChange}
            onClick={(e) => e.stopPropagation()}
            maxLength={7}
            placeholder="#000000"
            className="flex-1 bg-transparent text-sm font-mono outline-none"
          />
        </div>
        
        {/* Clear Button */}
        {onClear && (
          <button
            type="button"
            onClick={() => {
              onClear();
              setInputValue("#000000");
              setHsv({ h: 0, s: 0, v: 0 });
              setIsOpen(false);
            }}
            className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear color"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Color Picker Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-[100] p-3 rounded-lg border bg-popover shadow-lg">
          {/* Gradient Canvas */}
          <div className="relative mb-2">
            <canvas
              ref={gradientRef}
              width={200}
              height={150}
              onMouseDown={handleGradientMouseDown}
              className="rounded-md cursor-crosshair touch-none"
              style={{ width: "200px", height: "150px" }}
            />
            {/* Gradient Selector */}
            <div
              className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md pointer-events-none"
              style={{
                left: `${gradientX}%`,
                top: `${gradientY}%`,
                backgroundColor: currentHex,
              }}
            />
          </div>

          {/* Hue Slider */}
          <div className="relative">
            <canvas
              ref={hueRef}
              width={200}
              height={20}
              onMouseDown={handleHueMouseDown}
              className="rounded-md cursor-pointer touch-none"
              style={{ width: "200px", height: "20px" }}
            />
            {/* Hue Selector */}
            <div
              className="absolute top-0 w-2 h-full -translate-x-1/2 border-2 border-white shadow-md pointer-events-none"
              style={{
                left: `${hueX}%`,
                backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
