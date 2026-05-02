import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

const TAKEAWAY_COLORS = [
  { bg: '#FFF0F3', border: '#FFAFC3', num: '#E84393' },
  { bg: '#EFF6FF', border: '#BFDBFE', num: '#3B82F6' },
  { bg: '#F5F3FF', border: '#DDD6FE', num: '#8B5CF6' },
  { bg: '#FEFCE8', border: '#FEF08A', num: '#CA8A04' },
  { bg: '#FFF7ED', border: '#FED7AA', num: '#F97316' },
];

export default function BookInfographic({ book }) {
  const ref = useRef(null);
  const { title, author, quote, formula, bannerColor, framework, takeaways, mistakes } = book;
  const color = bannerColor || '#1E3A8A';

  const download = () => {
    if (!ref.current) return;
    toPng(ref.current, { cacheBust: true, pixelRatio: 2 })
      .then(url => {
        const a = document.createElement('a');
        a.download = `${(title || 'book').replace(/\s+/g, '-').toLowerCase()}-infographic.png`;
        a.href = url; a.click();
      })
      .catch(e => console.error('Export failed', e));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div ref={ref} style={{ width: '860px', backgroundColor: '#FFFFFF', fontFamily: "'Outfit','Inter',sans-serif", borderRadius: '16px', overflow: 'hidden' }}>

        {/* BANNER */}
        <div style={{ backgroundColor: color, padding: '36px 48px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)', fontSize: '11px', fontWeight: '800', letterSpacing: '3px', textTransform: 'uppercase', padding: '4px 14px', borderRadius: '100px', marginBottom: '14px' }}>Book Summary Infographic</div>
            <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: '900', lineHeight: 1.15, margin: '0 0 10px', maxWidth: '560px' }}>{title}</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '17px', fontStyle: 'italic', margin: 0 }}>by {author}</p>
          </div>
          <div style={{ width: '72px', height: '90px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', flexShrink: 0, marginLeft: '24px', border: '2px solid rgba(255,255,255,0.25)' }}>📚</div>
        </div>

        {/* QUOTE + FORMULA */}
        <div style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', padding: '22px 48px', display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1, backgroundColor: '#fff', borderLeft: `4px solid ${color}`, padding: '14px 18px', borderRadius: '0 8px 8px 0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '8px' }}>✦ KEY QUOTE</div>
            <p style={{ margin: 0, fontSize: '13px', fontStyle: 'italic', color: '#334155', lineHeight: 1.6 }}>"{quote}"</p>
          </div>
          <div style={{ width: '230px', flexShrink: 0, backgroundColor: '#fff', borderTop: `3px solid ${color}`, padding: '14px 18px', borderRadius: '0 0 8px 8px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '8px' }}>⚡ KEY FORMULA</div>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: '#1E293B', lineHeight: 1.5 }}>{formula}</p>
          </div>
        </div>

        {/* FRAMEWORK TABLE */}
        {framework && (
          <div style={{ padding: '28px 48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '12px' }}>
              <div style={{ width: '4px', height: '22px', backgroundColor: color, borderRadius: '2px' }} />
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>{framework.title}</h2>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr>
                  <th style={{ backgroundColor: color, color: 'rgba(255,255,255,0.7)', padding: '10px 12px', width: '36px', textAlign: 'center', fontSize: '10px' }}>#</th>
                  {(framework.columns || []).map((c, i) => (
                    <th key={i} style={{ backgroundColor: color, color: '#fff', padding: '10px 14px', textAlign: 'left', fontWeight: '700', fontSize: '10px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(framework.rows || []).map((row, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#F8FAFC' : '#fff' }}>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '18px', borderBottom: '1px solid #F1F5F9' }}>{row.icon}</td>
                    {(row.cells || []).map((cell, j) => (
                      <td key={j} style={{ padding: '12px 14px', color: j === 0 ? '#1E293B' : '#475569', fontWeight: j === 0 ? '700' : '400', fontSize: '12px', lineHeight: 1.4, borderBottom: '1px solid #F1F5F9' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAKEAWAYS */}
        {takeaways && (
          <div style={{ padding: '0 48px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '12px' }}>
              <div style={{ width: '4px', height: '22px', backgroundColor: '#8B5CF6', borderRadius: '2px' }} />
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>5 Key Takeaways</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px' }}>
              {takeaways.map((t, i) => {
                const c = TAKEAWAY_COLORS[i];
                return (
                  <div key={i} style={{ backgroundColor: c.bg, border: `1.5px solid ${c.border}`, borderRadius: '12px', padding: '14px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                      <div style={{ width: '20px', height: '20px', backgroundColor: c.num, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: '800', flexShrink: 0 }}>{i + 1}</div>
                      <span style={{ fontSize: '16px' }}>{t.icon}</span>
                    </div>
                    <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: '800', color: '#1E293B', lineHeight: 1.3 }}>{t.headline}</p>
                    <p style={{ margin: 0, fontSize: '10px', color: '#475569', lineHeight: 1.5 }}>{t.explanation}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MISTAKES */}
        {mistakes && (
          <div style={{ padding: '0 48px 36px' }}>
            <div style={{ backgroundColor: '#FFF8F8', border: '1px solid #FECACA', borderRadius: '12px', padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <span style={{ fontSize: '18px' }}>⚠️</span>
                <h2 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#DC2626' }}>5 Common Mistakes to Avoid</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px' }}>
                {mistakes.map((m, i) => (
                  <div key={i} style={{ backgroundColor: '#fff', border: '1px solid #FEE2E2', borderRadius: '10px', padding: '12px 10px', fontSize: '10px', lineHeight: 1.45 }}>
                    <div style={{ color: '#DC2626', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '5px' }}><span>❌</span><span>{m.wrong}</span></div>
                    <div style={{ borderTop: '1px solid #FEE2E2', paddingTop: '8px', color: '#16A34A', fontWeight: '600', display: 'flex', alignItems: 'flex-start', gap: '5px' }}><span>✅</span><span>{m.right}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div style={{ backgroundColor: '#0F172A', padding: '14px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>BookShelf Insights</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>Powered by Gemini AI</span>
        </div>
      </div>

      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={download}
        style={{ marginTop: '22px', backgroundColor: '#2563EB', color: '#fff', fontWeight: '800', padding: '13px 30px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '9px', border: 'none', cursor: 'pointer', fontSize: '14px', boxShadow: '0 10px 30px -8px rgba(37,99,235,0.5)' }}>
        <Download size={18} />
        Download High-Res PNG
      </motion.button>
    </div>
  );
}
