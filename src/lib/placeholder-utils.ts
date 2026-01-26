import { getIconPaths } from './icon-paths';

/**
 * Generates a dynamic SVG placeholder image based on item properties.
 * This creates an instant, fast-loading placeholder without any network requests.
 * Includes dynamic icons, patterns, and shapes for better visual diversity.
 */
export function generateDynamicPlaceholder(
  name: string,
  category?: string,
  width: number = 400,
  height: number = 300
): string {
  // Handle undefined/null values with defaults
  const safeName = name || "Item";
  const safeCategory = category || "";
  
  // Extract initials from name (first letter of first 2-3 words)
  const words = safeName.split(/\s+/).filter((w) => w.length > 0);
  const initials = words
    .slice(0, 3)
    .map((w) => w[0].toUpperCase())
    .join("")
    .substring(0, 3);

  // Generate a color based on the name (deterministic hash)
  const hash = simpleHash(safeName + safeCategory);
  const hue = hash % 360;
  const saturation = 50 + (hash % 30); // 50-80%
  const lightness = 40 + (hash % 20); // 40-60%

  const bgColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const textColor = lightness > 50 ? "#1a1a1a" : "#ffffff";
  
  // Generate complementary colors for more diversity
  const complementaryHue = (hue + 180) % 360;
  const accentColor = `hsl(${complementaryHue}, ${Math.min(saturation + 20, 100)}%, ${Math.min(lightness + 15, 85)}%)`;
  
  // Choose pattern type based on hash for diversity
  const patternType = hash % 6; // 0-5 different patterns
  
  // Get icon paths for the category
  const iconData = safeCategory ? getIconPaths(safeCategory) : null;
  const iconSize = Math.min(width * 0.2, height * 0.2, 80);
  const iconScale = iconSize / 24; // Lucide icons are 24x24
  const iconX = width / 2;
  const iconY = height / 2 - (safeCategory ? 25 : 0);
  
  // Create icon SVG paths with proper scaling and centering
  const iconSvg = iconData ? `
    <g transform="translate(${iconX}, ${iconY}) scale(${iconScale}) translate(-12, -12)" filter="url(#shadow-${hash})">
      ${iconData.paths.map((path, idx) => 
        `<path d="${path}" fill="${textColor}" opacity="0.9" stroke="${textColor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`
      ).join('')}
    </g>
  ` : '';

  // Generate background pattern based on patternType
  const patternSvg = generatePattern(patternType, hash, width, height, bgColor, accentColor);

  // Create SVG with gradient background, pattern, icon, and text
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="grad-${hash}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${adjustBrightness(bgColor, -10)};stop-opacity:1" />
        </linearGradient>
        <radialGradient id="radial-${hash}" cx="50%" cy="50%">
          <stop offset="0%" style="stop-color:${accentColor};stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:${bgColor};stop-opacity:1" />
        </radialGradient>
        <filter id="shadow-${hash}">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
        </filter>
        <pattern id="pattern-${hash}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          ${patternSvg}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad-${hash})" />
      ${patternType < 3 ? `<rect width="100%" height="100%" fill="url(#pattern-${hash})" opacity="0.15" />` : ''}
      ${patternType >= 3 && patternType < 5 ? `<circle cx="50%" cy="50%" r="${Math.min(width, height) * 0.4}" fill="url(#radial-${hash})" opacity="0.4" />` : ''}
      ${iconSvg}
      <text 
        x="50%" 
        y="${iconSvg ? '70%' : '50%'}" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="${Math.min(width / 10, 32)}" 
        font-weight="600" 
        fill="${textColor}" 
        text-anchor="middle" 
        dominant-baseline="central"
        opacity="0.9"
        filter="url(#shadow-${hash})"
      >
        ${initials || "?"}
      </text>
      ${safeCategory ? `
        <text 
          x="50%" 
          y="${iconSvg ? '82%' : '65%'}" 
          font-family="system-ui, -apple-system, sans-serif" 
          font-size="${Math.min(width / 18, 12)}" 
          fill="${textColor}" 
          text-anchor="middle" 
          dominant-baseline="central"
          opacity="0.75"
        >
          ${safeCategory.substring(0, 24)}
        </text>
      ` : ""}
    </svg>
  `.trim();

  // Convert to data URL (using encodeURIComponent for better compatibility)
  const encodedSvg = encodeURIComponent(svg);
  return `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
}

/**
 * Generates different pattern types for visual diversity
 */
function generatePattern(
  patternType: number,
  hash: number,
  width: number,
  height: number,
  bgColor: string,
  accentColor: string
): string {
  switch (patternType) {
    case 0: // Dots pattern
      return `
        <circle cx="20" cy="20" r="2" fill="${accentColor}" opacity="0.4" />
        <circle cx="0" cy="0" r="1.5" fill="${accentColor}" opacity="0.3" />
      `;
    case 1: // Grid pattern
      return `
        <line x1="0" y1="20" x2="40" y2="20" stroke="${accentColor}" stroke-width="1" opacity="0.3" />
        <line x1="20" y1="0" x2="20" y2="40" stroke="${accentColor}" stroke-width="1" opacity="0.3" />
      `;
    case 2: // Diagonal lines
      return `
        <line x1="0" y1="0" x2="40" y2="40" stroke="${accentColor}" stroke-width="1.5" opacity="0.2" />
        <line x1="0" y1="40" x2="40" y2="0" stroke="${accentColor}" stroke-width="1.5" opacity="0.2" />
      `;
    case 3: // Hexagon pattern
      return `
        <polygon points="20,5 30,10 30,20 20,25 10,20 10,10" fill="${accentColor}" opacity="0.2" />
      `;
    case 4: // Wave pattern
      return `
        <path d="M 0,20 Q 10,10 20,20 T 40,20" stroke="${accentColor}" stroke-width="2" fill="none" opacity="0.3" />
      `;
    default: // No pattern (solid with gradient)
      return '';
  }
}

/**
 * Simple hash function for deterministic color generation
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Adjusts the brightness of an HSL color
 */
function adjustBrightness(hslColor: string, amount: number): string {
  const match = hslColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return hslColor;

  const [, h, s, l] = match;
  const newLightness = Math.max(0, Math.min(100, parseInt(l) + amount));
  return `hsl(${h}, ${s}%, ${newLightness}%)`;
}

/**
 * @deprecated Use generateDynamicPlaceholder instead - it generates instant SVG data URIs
 * without requiring external services. This function is kept for backwards compatibility.
 * 
 * Generates a fast-loading placeholder URL using a placeholder service.
 * Note: External URLs may not work reliably. Use generateDynamicPlaceholder for better reliability.
 */
export function getFastPlaceholderUrl(
  name: string,
  category?: string,
  width: number = 400,
  height: number = 300
): string {
  // Fallback to dynamic SVG placeholder instead of external service
  // This ensures reliability and fast loading
  return generateDynamicPlaceholder(name, category, width, height);
}

/**
 * Gets a hex color from a name (deterministic)
 */
function getColorFromName(name: string): string {
  const hash = simpleHash(name);
  // Generate a pleasant color palette
  const colors = [
    "4A90E2", "50C878", "FF6B6B", "FFA07A", "20B2AA",
    "9370DB", "FFD700", "FF69B4", "00CED1", "FF6347",
    "32CD32", "1E90FF", "FF1493", "00FF7F", "FF4500"
  ];
  return colors[hash % colors.length];
}

/**
 * Gets a contrasting text color (black or white)
 */
function getContrastColor(bgHex: string): string {
  // Convert hex to RGB
  const r = parseInt(bgHex.substring(0, 2), 16);
  const g = parseInt(bgHex.substring(2, 4), 16);
  const b = parseInt(bgHex.substring(4, 6), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? "000000" : "FFFFFF";
}
