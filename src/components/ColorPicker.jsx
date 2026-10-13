import { useEffect, useRef, useState } from 'react';
import { t } from '../i18n';

const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, '0');

function hslToHex(h, s, l) {
  const sat = s / 100;
  const lig = l / 100;
  const a = sat * Math.min(lig, 1 - lig);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    return lig - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
  };
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function hsvToHex(h, s, v) {
  const f = (n) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return `#${toHex(f(5))}${toHex(f(3))}${toHex(f(1))}`;
}

function hexToHsv(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max ? d / max : 0, v: max };
}

const HUES = [0, 20, 38, 52, 90, 140, 170, 195, 215, 250, 285, 330];
const LIGHTNESS = [80, 67, 55, 45, 33];
const PALETTE = [
  ...LIGHTNESS.flatMap((l) => HUES.map((h) => hslToHex(h, 75, l))),
  ...Array.from({ length: 12 }, (_, i) => hslToHex(0, 0, 92 - i * 7.6)),
];

function useDrag(onMove) {
  const ref = useRef(null);
  const handle = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    onMove(x, y);
  };
  return {
    ref,
    onPointerDown: (e) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      handle(e);
    },
    onPointerMove: (e) => {
      if (e.buttons || e.pointerType === 'touch') handle(e);
    },
  };
}

function ColorPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [hsv, setHsv] = useState(() => hexToHsv(value) || { h: 120, s: 0.7, v: 0.5 });
  const [typing, setTyping] = useState(null); // texte en cours de saisie dans le champ hex
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const apply = (next) => {
    setTyping(null);
    setHsv(next);
    onChange(hsvToHex(next.h, next.s, next.v));
  };

  const square = useDrag((x, y) => apply({ ...hsv, s: x, v: 1 - y }));
  const hueBar = useDrag((x) => apply({ ...hsv, h: x * 360 }));

  const handleHex = (e) => {
    const text = e.target.value;
    setTyping(text);
    const full = text.startsWith('#') ? text : `#${text}`;
    const parsed = hexToHsv(full);
    if (parsed) {
      setHsv((prev) => ({ ...parsed, h: parsed.s === 0 ? prev.h : parsed.h }));
      onChange(full.toLowerCase());
    }
  };

  return (
    <div className="color-picker" ref={wrapRef}>
      <button
        type="button"
        className="color-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="color-dot" style={{ backgroundColor: value }} />
        <span className="color-trigger-text">{t('Choisir une couleur')}</span>
        <span className="color-hex">{value.toUpperCase()}</span>
        <span className="color-chevron">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="color-popover">
          <p className="color-section">{t('Couleurs')}</p>
          <div className="color-grid">
            {PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                className={`color-cell ${c === value.toLowerCase() ? 'on' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => {
                  setTyping(null);
                  onChange(c);
                  setHsv(hexToHsv(c));
                }}
                aria-label={t('Couleur {hex}', { hex: c })}
              />
            ))}
          </div>

          <p className="color-section">{t('Mélanger une couleur')}</p>
          <div
            className="color-square"
            style={{ backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
            {...square}
          >
            <span
              className="color-thumb"
              style={{
                left: `${hsv.s * 100}%`,
                top: `${(1 - hsv.v) * 100}%`,
                backgroundColor: value,
              }}
            />
          </div>
          <div className="color-hue" {...hueBar}>
            <span className="color-thumb hue" style={{ left: `${(hsv.h / 360) * 100}%` }} />
          </div>

          <div className="color-hex-row">
            <span className="color-dot big" style={{ backgroundColor: value }} />
            <input
              value={typing ?? value}
              onBlur={() => setTyping(null)}
              onChange={handleHex}
              maxLength={7}
              spellCheck={false}
              aria-label={t('Code couleur hexadécimal')}
            />
            <button type="button" className="color-done" onClick={() => setOpen(false)}>
              {t('OK')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ColorPicker;
