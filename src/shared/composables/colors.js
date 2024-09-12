export default function useColors() {
    // calculate black or white color
    function expandHex(hex) {
        // If the HEX is in shorthand (3 digits), expand it to 6 digits
        if (hex.length === 4) {
            return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
        }
        return hex;
    }

    function hexToRgb(hex) {
        // Expand the HEX if it's shorthand
        const expandedHex = expandHex(hex);

        // Remove the leading # if it's present
        const cleanedHex = expandedHex.replace(/^#/, '');

        // Parse the RGB values using arithmetic operations
        const bigint = parseInt(cleanedHex, 16);
        const r = Math.floor(bigint / (256 * 256)); // Red component
        const g = Math.floor((bigint % (256 * 256)) / 256); // Green component
        const b = bigint % 256; // Blue component

        return [r, g, b];
    }

    function getLuminance(r, g, b) {
        // Normalize the RGB values to the range [0, 1]
        const normalizedR = r / 255;
        const normalizedG = g / 255;
        const normalizedB = b / 255;

        // Calculate luminance
        return 0.2126 * normalizedR + 0.7152 * normalizedG + 0.0722 * normalizedB;
    }

    function isHexBelow50Percent(hex) {
        // Convert HEX to RGB
        const [r, g, b] = hexToRgb(hex);

        // Get luminance
        const luminance = getLuminance(r, g, b);

        // Check if luminance is below 50% (i.e., < 0.5)
        return luminance < 0.5;
    }

    return {
        isHexBelow50Percent,
    };
}
