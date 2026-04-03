import { useState, useEffect, useRef } from 'react';
import * as ort from 'onnxruntime-web';

// Disable multi-threading to avoid extra module loading issues
ort.env.wasm.numThreads = 1;

const CLASSES = ['bathroom','bedroom','dining','gaming','kitchen','laundry','living','office','terrace','yard'];

const ROOM_COLORS = {
  bathroom: '#3b82f6', bedroom: '#8b5cf6', dining: '#f97316',
  gaming: '#ef4444',   kitchen: '#22c55e', laundry: '#06b6d4',
  living:  '#14b8a6',  office:  '#6366f1', terrace: '#eab308',
  yard:    '#84cc16',
};
const ROOM_ICONS = {
  bathroom: '🚿', bedroom: '🛏️', dining: '🍽️', gaming: '🎮',
  kitchen:  '🍳', laundry: '👕', living: '🛋️', office: '💼',
  terrace:  '🌇', yard:    '🌿',
};
const ROOM_LABELS = {
  bathroom: 'Bathroom',    bedroom: 'Bedroom',       dining:  'Dining Area',
  gaming:   'Gaming Room', kitchen: 'Kitchen',        laundry: 'Laundry',
  living:   'Living Room', office:  'Office / Study', terrace: 'Terrace',
  yard:     'Yard / Garden',
};

const MEAN = [0.485, 0.456, 0.406];
const STD  = [0.229, 0.224, 0.225];

// ── softmax ───────────────────────────────────────────────────────────────────
function softmax(arr) {
  const max = Math.max(...arr);
  const exps = arr.map(v => Math.exp(v - max));
  const sum  = exps.reduce((a, b) => a + b, 0);
  return exps.map(v => v / sum);
}

// ── image url → Float32Array tensor [1,3,224,224] ─────────────────────────────
async function imageToTensor(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width  = 224;
        canvas.height = 224;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 224, 224);
        const { data } = ctx.getImageData(0, 0, 224, 224); // RGBA

        const tensor = new Float32Array(3 * 224 * 224);
        for (let i = 0; i < 224 * 224; i++) {
          tensor[i]                 = (data[i * 4]     / 255 - MEAN[0]) / STD[0]; // R
          tensor[224 * 224 + i]     = (data[i * 4 + 1] / 255 - MEAN[1]) / STD[1]; // G
          tensor[224 * 224 * 2 + i] = (data[i * 4 + 2] / 255 - MEAN[2]) / STD[2]; // B
        }
        resolve(tensor);
      } catch (e) { reject(e); }
    };
    img.onerror = reject;
    img.src = url;
  });
}

// ── classify one image using loaded ONNX session ──────────────────────────────
async function classifyImage(session, url) {
  const tensorData  = await imageToTensor(url);
  const inputTensor = new ort.Tensor('float32', tensorData, [1, 3, 224, 224]);
  const feeds       = { input: inputTensor };
  const results     = await session.run(feeds);
  const outputKey   = Object.keys(results)[0];
  const logits      = Array.from(results[outputKey].data);
  const probs       = softmax(logits);

  const sorted = probs
    .map((p, i) => ({ label: CLASSES[i], confidence: p }))
    .sort((a, b) => b.confidence - a.confidence);

  return {
    label:      sorted[0].label,
    confidence: sorted[0].confidence,
    top3:       sorted.slice(0, 3),
  };
}

// ── parse photos from property ────────────────────────────────────────────────
function getPhotos(property) {
  let photos = [];
  if (Array.isArray(property.photos)) photos = property.photos;
  else if (typeof property.photos === 'string') {
    try { photos = JSON.parse(property.photos); }
    catch { photos = property.photos.split(','); }
  }
  return photos.map(p => (typeof p === 'string' ? p.trim() : '')).filter(Boolean);
}

// ─────────────────────────────────────────────────────────────────────────────
export default function ImageClassificationModal({ property, onClose }) {
  const [results, setResults]       = useState({});
  const [photos, setPhotos]         = useState([]);
  const [done, setDone]             = useState(0);
  const [modelStatus, setModelStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [activeGroup, setActiveGroup] = useState('all');
  const [expandedUrl, setExpandedUrl] = useState(null);
  const sessionRef = useRef(null);

  // ── Load ONNX model once ──────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        setModelStatus('loading');
        sessionRef.current = await ort.InferenceSession.create('/bestmodel.onnx', {
          executionProviders: ['wasm'],
        });
        setModelStatus('ready');
      } catch (e) {
        console.error('ONNX model load failed:', e);
        setModelStatus('error');
      }
    })();
  }, []);

  // ── Start classifying when model is ready ─────────────────────────────────
  useEffect(() => {
    if (modelStatus !== 'ready') return;

    const list = getPhotos(property);
    setPhotos(list);
    setDone(0);
    setActiveGroup('all');
    setExpandedUrl(null);

    const initial = {};
    list.forEach(url => { initial[url] = { loading: true }; });
    setResults(initial);

    let completed = 0;
    list.forEach(async (url) => {
      try {
        const res = await classifyImage(sessionRef.current, url);
        setResults(prev => ({ ...prev, [url]: { ...res, loading: false } }));
      } catch (e) {
        console.warn('classify failed for', url, e);
        setResults(prev => ({ ...prev, [url]: { error: true, loading: false } }));
      }
      completed++;
      setDone(completed);
    });
  }, [modelStatus, property]);

  // ── Build grouped map ─────────────────────────────────────────────────────
  const grouped = {};
  photos.forEach(url => {
    const r = results[url];
    if (!r || r.loading) return;
    const label = r.error ? '_error' : (r.label || '_unknown');
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(url);
  });

  const classifying   = done < photos.length;
  const groups        = Object.keys(grouped).filter(g => g !== '_error').sort();
  const errorUrls     = grouped['_error'] || [];
  const displayGroups = activeGroup === 'all' ? groups : (groups.includes(activeGroup) ? [activeGroup] : []);

  return (
    <div
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background:'#fff', borderRadius:'16px', width:'100%', maxWidth:'960px', maxHeight:'92vh', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:'0 25px 60px rgba(0,0,0,0.4)' }}>

        {/* ── HEADER ──────────────────────────────────────────────── */}
        <div style={{ padding:'18px 24px', borderBottom:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div>
            <div style={{ fontWeight:'700', fontSize:'17px', color:'#1e293b' }}>Room Image Classification</div>
            <div style={{ fontSize:'12px', color:'#64748b', marginTop:'2px' }}>
              {property.property_name || 'Property'} &nbsp;·&nbsp; {photos.length} image{photos.length !== 1 ? 's' : ''}
              {modelStatus === 'loading' && <span style={{ marginLeft:'8px', color:'#f97316', fontWeight:'600' }}>Loading AI model...</span>}
              {modelStatus === 'error'   && <span style={{ marginLeft:'8px', color:'#ef4444', fontWeight:'600' }}>Model failed to load — put bestmodel.onnx in /public folder</span>}
              {modelStatus === 'ready' && classifying && <span style={{ marginLeft:'8px', color:'#3b82f6', fontWeight:'600' }}>{done}/{photos.length} classified</span>}
              {modelStatus === 'ready' && !classifying && photos.length > 0 && <span style={{ marginLeft:'8px', color:'#22c55e', fontWeight:'600' }}>Done</span>}
            </div>
          </div>
          <button onClick={onClose} style={{ background:'#f1f5f9', border:'none', borderRadius:'8px', padding:'8px 18px', cursor:'pointer', fontSize:'13px', fontWeight:'600', color:'#475569' }}>
            Close
          </button>
        </div>

        {/* ── PROGRESS BAR ────────────────────────────────────────── */}
        {modelStatus === 'ready' && classifying && (
          <div style={{ height:'3px', background:'#e2e8f0', flexShrink:0 }}>
            <div style={{ height:'100%', background:'#3b82f6', width:`${photos.length ? (done/photos.length)*100 : 0}%`, transition:'width 0.3s ease' }} />
          </div>
        )}

        {/* ── MODEL LOADING STATE ──────────────────────────────────── */}
        {modelStatus === 'loading' && (
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'12px', color:'#64748b' }}>
            <div style={{ width:'40px', height:'40px', border:'4px solid #e2e8f0', borderTopColor:'#3b82f6', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
            <div style={{ fontSize:'14px' }}>Loading AI model (first time may take a moment)...</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* ── MODEL ERROR STATE ────────────────────────────────────── */}
        {modelStatus === 'error' && (
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'8px', padding:'40px', textAlign:'center' }}>
            <div style={{ fontSize:'32px' }}>⚠️</div>
            <div style={{ fontWeight:'700', color:'#ef4444', fontSize:'15px' }}>Model file not found</div>
            <div style={{ color:'#64748b', fontSize:'13px', maxWidth:'400px' }}>
              Run <code style={{ background:'#f1f5f9', padding:'2px 6px', borderRadius:'4px' }}>python export_to_onnx.py</code> once,
              then copy <strong>bestmodel.onnx</strong> to the <strong>public/</strong> folder of the React app.
            </div>
          </div>
        )}

        {/* ── GROUP TABS ───────────────────────────────────────────── */}
        {modelStatus === 'ready' && !classifying && groups.length > 0 && (
          <div style={{ padding:'10px 24px', borderBottom:'1px solid #e2e8f0', display:'flex', gap:'8px', flexWrap:'wrap', flexShrink:0 }}>
            <button
              onClick={() => setActiveGroup('all')}
              style={{ padding:'4px 14px', borderRadius:'20px', border:'none', cursor:'pointer', fontWeight:'600', fontSize:'12px', background: activeGroup==='all'?'#1e293b':'#f1f5f9', color: activeGroup==='all'?'#fff':'#64748b' }}
            >
              All ({photos.length - errorUrls.length})
            </button>
            {groups.map(g => (
              <button key={g} onClick={() => setActiveGroup(g)}
                style={{ padding:'4px 14px', borderRadius:'20px', border:'none', cursor:'pointer', fontWeight:'600', fontSize:'12px', background: activeGroup===g?(ROOM_COLORS[g]||'#64748b'):'#f1f5f9', color: activeGroup===g?'#fff':'#64748b' }}
              >
                {ROOM_ICONS[g]||'📷'} {ROOM_LABELS[g]||g} ({grouped[g].length})
              </button>
            ))}
          </div>
        )}

        {/* ── BODY ─────────────────────────────────────────────────── */}
        {modelStatus === 'ready' && (
          <div style={{ flex:1, overflowY:'auto', padding:'24px' }}>
            {photos.length === 0 && (
              <div style={{ textAlign:'center', color:'#94a3b8', padding:'60px 0', fontSize:'15px' }}>No images found for this property.</div>
            )}

            {/* While classifying */}
            {classifying && photos.length > 0 && (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(165px, 1fr))', gap:'14px' }}>
                {photos.map(url => (
                  <div key={url} style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid #e2e8f0', background:'#f8fafc' }}>
                    <img src={url} alt="" style={{ width:'100%', height:'130px', objectFit:'cover', display:'block' }} onError={e=>{e.target.style.display='none';}} />
                    <div style={{ padding:'7px 8px', textAlign:'center', minHeight:'32px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {results[url]?.loading ? (
                        <span style={{ fontSize:'11px', color:'#94a3b8' }}>Classifying...</span>
                      ) : results[url]?.error ? (
                        <span style={{ fontSize:'11px', color:'#ef4444' }}>Error</span>
                      ) : (
                        <span style={{ fontSize:'11px', fontWeight:'700', color:ROOM_COLORS[results[url]?.label]||'#1e293b' }}>
                          {ROOM_ICONS[results[url]?.label]} {ROOM_LABELS[results[url]?.label]||results[url]?.label}
                          <span style={{ color:'#94a3b8', fontWeight:'500', marginLeft:'4px' }}>
                            {Math.round((results[url]?.confidence||0)*100)}%
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* After classifying — grouped view */}
            {!classifying && (
              <>
                {displayGroups.map(group => (
                  <div key={group} style={{ marginBottom:'28px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
                      <div style={{ width:'12px', height:'12px', borderRadius:'50%', background:ROOM_COLORS[group]||'#64748b', flexShrink:0 }} />
                      <span style={{ fontWeight:'700', fontSize:'15px', color:'#1e293b' }}>
                        {ROOM_ICONS[group]||'📷'} {ROOM_LABELS[group]||group}
                      </span>
                      <span style={{ background:'#f1f5f9', color:'#64748b', borderRadius:'12px', padding:'1px 10px', fontSize:'12px', fontWeight:'600' }}>
                        {grouped[group]?.length} image{grouped[group]?.length!==1?'s':''}
                      </span>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(165px, 1fr))', gap:'12px' }}>
                      {(grouped[group]||[]).map(url => (
                        <div key={url}
                          onClick={() => setExpandedUrl(url)}
                          onMouseEnter={e => e.currentTarget.style.transform='scale(1.03)'}
                          onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                          style={{ borderRadius:'12px', overflow:'hidden', border:`2px solid ${ROOM_COLORS[group]||'#e2e8f0'}`, cursor:'pointer', transition:'transform 0.15s', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}
                        >
                          <img src={url} alt={group} style={{ width:'100%', height:'140px', objectFit:'cover', display:'block' }} onError={e=>{e.target.style.display='none';}} />
                          <div style={{ padding:'6px 10px', background:ROOM_COLORS[group]||'#f8fafc', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                            <span style={{ fontSize:'11px', fontWeight:'700', color:'#fff' }}>{ROOM_LABELS[group]||group}</span>
                            <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.85)', fontWeight:'600' }}>{Math.round((results[url]?.confidence||0)*100)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Unclassified / error images */}
                {activeGroup==='all' && errorUrls.length > 0 && (
                  <div style={{ marginBottom:'28px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
                      <div style={{ width:'12px', height:'12px', borderRadius:'50%', background:'#94a3b8', flexShrink:0 }} />
                      <span style={{ fontWeight:'700', fontSize:'15px', color:'#94a3b8' }}>Unclassified ({errorUrls.length})</span>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(165px, 1fr))', gap:'12px' }}>
                      {errorUrls.map(url => (
                        <div key={url} style={{ borderRadius:'12px', overflow:'hidden', border:'1px dashed #cbd5e1' }}>
                          <img src={url} alt="" style={{ width:'100%', height:'140px', objectFit:'cover', display:'block' }} onError={e=>{e.target.style.display='none';}} />
                          <div style={{ padding:'6px 10px', background:'#f8fafc', fontSize:'11px', color:'#94a3b8', textAlign:'center' }}>CORS blocked</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── LIGHTBOX ─────────────────────────────────────────────── */}
      {expandedUrl && (
        <div
          onClick={() => setExpandedUrl(null)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.92)', zIndex:10000, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'16px' }}
        >
          <img src={expandedUrl} alt="expanded" style={{ maxWidth:'88vw', maxHeight:'76vh', borderRadius:'12px', objectFit:'contain' }} />
          {results[expandedUrl] && !results[expandedUrl].error && (
            <div style={{ background:'rgba(255,255,255,0.12)', borderRadius:'12px', padding:'10px 24px', display:'flex', gap:'24px' }}>
              {(results[expandedUrl].top3||[]).map((t, i) => (
                <div key={i} style={{ textAlign:'center', color:'#fff' }}>
                  <div style={{ fontSize:'11px', opacity:0.6 }}>#{i+1}</div>
                  <div style={{ fontWeight:'700', fontSize:'14px', color:ROOM_COLORS[t.label]||'#fff' }}>
                    {ROOM_ICONS[t.label]||'📷'} {ROOM_LABELS[t.label]||t.label}
                  </div>
                  <div style={{ fontSize:'13px', opacity:0.85 }}>{Math.round(t.confidence*100)}%</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'12px' }}>Click anywhere to close</div>
        </div>
      )}
    </div>
  );
}
