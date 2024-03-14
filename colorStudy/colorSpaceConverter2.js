"use strict";

class Color {
    static validTypes = ["rgb", "hex", "hsl", "xyz", "lab", "lchab", "luv", "lchuv"];
    static d65 = [95.05, 100, 108.9];  //Because sRGB is based on D65 or D50, D65 was used as reference white (Xw=95.05, Yw=100, and Zw=108.9) for a reverse transforming from CIELab to CIEXYZ 
    static maxZeroTolerance = Math.pow(10, -12); //Limit the feature spacial tolerance to these bounds.

    constructor(options = {}) {
        let { color = [0, 0, 0], type = "rgb", precision = 3, capitalize = true } = options;
        this.updateColor(color, type);
        this.precision = precision;
        this.capitalize = capitalize;
    }

    updateColor(color, type = "rgb") {
        if (typeof type !== "string" || !Color.validTypes.includes(type.toLowerCase())) {
            throw new TypeError(`Invalid type '${type}'.`);
        }
        type = type.toLowerCase();
        let xyz;
        switch (type) {
            case "rgb":
                xyz = Color.rgbToXyz(color);
                break;
            case "hsl":
                xyz = Color.rgbToXyz(Color.hslToRgb(color));
                break;
            case "hex":
                xyz = Color.rgbToXyz(Color.hexToRgb(color));
                break;
            case "lab":
                xyz = Color.labToXyz(color);
                break;
            case "lchab":
                xyz = Color.labToXyz(Color.lchABToLab(color));
                break;
            case "luv":
                xyz = Color.luvToXyz(color);
                break;
            case "lchuv":
                xyz = Color.luvToXyz(Color.lchUVToLuv(color));
                break;
            default:
                xyz = color;
                break;
        }
        if (type !== "xyz") {
            this.updateColor(xyz, "xyz");
        } else {
            this._xyz = xyz;
            this._rgb = Color.xyzToRgb(this._xyz);
            this._hsl = Color.rgbToHsl(this._rgb);
            this._hex = Color.rgbToHex(this._rgb);
            this._lab = Color.xyzToLab(this._xyz);
            this._lchab = Color.labToLCHab(this._lab);
            this._luv = Color.xyzToLuv(this._xyz);
            this._lchuv = Color.luvToLCHuv(this._luv);
        }
    }

    // RGB to HSL conversion
    static rgbToHsl(rgb) {
        let [r, g, b] = rgb.map(v => v / 255);
        let max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return [h * 360, s * 100, l * 100];
    }

    // HSL to RGB conversion
    static hslToRgb(hsl) {
        let h = hsl[0] / 360,
            s = hsl[1] / 100,
            l = hsl[2] / 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            let hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    static rgbToHex(rgb) {
        return '#' + rgb.map(v => {
            let hex = v.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }
    // HEX to RGB conversion
    static hexToRgb(hex) {
        if (hex.startsWith('#')) hex = hex.substring(1);
        if (hex.length === 3) {
            hex = Array.from(hex).map(h => h + h).join('');
        }
        let bigint = parseInt(hex, 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    }
    // RGB to XYZ conversion
    static rgbToXyz(rgb) {
        let [r, g, b] = rgb.map(v => {
            v /= 255;
            return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return [
            (r * 0.4124 + g * 0.3576 + b * 0.1805) * 100,
            (r * 0.2126 + g * 0.7152 + b * 0.0722) * 100,
            (r * 0.0193 + g * 0.1192 + b * 0.9505) * 100
        ];
    }

    // XYZ to RGB conversion
    static xyzToRgb(xyz) {
        let x = xyz[0] / 100,
            y = xyz[1] / 100,
            z = xyz[2] / 100;
        let r = (x * 3.2406 + y * -1.5372 + z * -0.4986),
            g = (x * -0.9689 + y * 1.8758 + z * 0.0415),
            b = (x * 0.0557 + y * -0.2040 + z * 1.0570);

        let rgb = [r, g, b].map(v => {
            v = v > 0.0031308 ? 1.055 * Math.pow(v, 1 / 2.4) - 0.055 : 12.92 * v;
            return Math.max(0, Math.min(1, v)) * 255;
        });
        return rgb.map(v => Math.round(v));
    }

    // XYZ to LAB conversion
    static xyzToLab(xyz) {
        let [x, y, z] = xyz.map((v, i) => v / Color.d65[i]);
        let f = v => v > Math.pow(6 / 29, 3) ? Math.cbrt(v) : ((29 / 6) ** 2 * v + 16) / 116;

        let [fx, fy, fz] = [x, y, z].map(v => f(v));
        return [(116 * fy) - 16, 500 * (fx - fy), 200 * (fy - fz)];
    }

    // LAB to XYZ conversion
    static labToXyz(lab) {
        let [l, a, b] = lab;
        let fy = (l + 16) / 116,
            fx = a / 500 + fy,
            fz = fy - b / 200;

        let fInv = v => v ** 3 > Math.pow(6 / 29, 3) ? v ** 3 : 3 * Math.pow(6 / 29, 2) * (v - 4 / 29);
        return [fx, fy, fz].map((v, i) => fInv(v) * Color.d65[i]);
    }

    // LAB to LCH(ab) conversion
    static labToLCHab(lab) {
        let [l, a, b] = lab;
        let c = Math.sqrt(a ** 2 + b ** 2),
            h = Math.atan2(b, a) * (180 / Math.PI);
        if (h < 0) h += 360;
        return [l, c, h];
    }

    // LCH(ab) to LAB conversion
    static lchABToLab(lchab) {
        let [l, c, h] = lchab;
        let a = Math.cos(h * Math.PI / 180) * c,
            b = Math.sin(h * Math.PI / 180) * c;
        return [l, a, b];
    }

    static xyzToLuv(xyz) {
        let [x, y, z] = xyz;
        const { d65 } = Color;
        let yr = y / d65[1];
        let u = (4 * x) / (x + (15 * y) + (3 * z));
        let v = (9 * y) / (x + (15 * y) + (3 * z));
        let ur = (4 * d65[0]) / (d65[0] + (15 * d65[1]) + (3 * d65[2]));
        let vr = (9 * d65[1]) / (d65[0] + (15 * d65[1]) + (3 * d65[2]));

        let L = yr > 0.008856 ? 116 * Math.cbrt(yr) - 16 : 903.3 * yr;
        let U = 13 * L * (u - ur);
        let V = 13 * L * (v - vr);
        return [L, U, V];
    }

    // LUV to XYZ conversion
    static luvToXyz(luv) {
        let [L, U, V] = luv;
        const { d65 } = Color;
        let ur = (4 * d65[0]) / (d65[0] + (15 * d65[1]) + (3 * d65[2]));
        let vr = (9 * d65[1]) / (d65[0] + (15 * d65[1]) + (3 * d65[2]));

        if (L == 0) return [0, 0, 0];

        let a = (((52 * L) / (U + 13 * L * ur)) - 1) / 3;
        let b = -5 * L;
        let c = -1 / 3;
        let d = L * ((39 * L) / (V + 13 * L * vr) - 5);

        let x = (d - b) / (a - c);
        let y = (a * x + b) / L;
        let z = x * a + b - y * L;

        return [x, y, z];
    }

    static luvToLCHuv(luv) {
        let [L, U, V] = luv;
        let C = Math.sqrt(U ** 2 + V ** 2);
        let H = Math.atan2(V, U) * (180 / Math.PI);
        if (H < 0) H += 360;
        return [L, C, H];
    }

    // LCHuv to LUV conversion
    static lchUVToLuv(lchuv) {
        let [L, C, H] = lchuv;
        let U = Math.cos(H * Math.PI / 180) * C;
        let V = Math.sin(H * Math.PI / 180) * C;
        return [L, U, V];
    }

    // Getters and setters for each color representation, for example:
    get rgb() {
        return this._rgb;
    }

    set rgb(value) {
        this.updateColor(value, "rgb");
    }

    // More getters and setters...

    // Additional utility methods (e.g., luminance, blending, contrast ratio...)
    // Utility method: Calculate luminance
    static luminance(rgb) {
        let [r, g, b] = rgb.map(c => {
            c /= 255;
            return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    // Utility method: Blend two colors
    static blend(color1, color2, ratio = 0.5, type = "rgb") {
        let blended = color1[type].map((c1, i) => c1 * ratio + color2[type][i] * (1 - ratio));
        return new Color({ color: blended, type });
    }

    // Utility method: Calculate contrast ratio
    static contrastRatio(color1, color2) {
        let l1 = Color.luminance(color1.rgb) + 0.05;
        let l2 = Color.luminance(color2.rgb) + 0.05;
        return l1 > l2 ? l1 / l2 : l2 / l1;
    }
}

if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = Color;
} else if (typeof define === "function" && define.amd) {
    define([], function() { return Color; });
} else {
    (typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : this).Color = Color;
}