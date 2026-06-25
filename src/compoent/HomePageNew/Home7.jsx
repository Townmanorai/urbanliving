

import { useState, useRef, useEffect } from "react";

const SAMPLE_VIDEOS = [
  {
    id: 1,
    title: "Signature Stay 1, Greater Noida",
    thumbnail: "/tmluxe1.jpeg",
    category: "Studio",
    videoUrl: "/tmvideo1.mp4",
    bookingUrlShort: "/property/77",
    bookingUrlLong: "/property/323",
    availableInLong: true,
  },
  {
    id: 2,
    title: "Signature Stay 2, Noida",
    thumbnail: "/tm2newimage.jpeg",
    category: "Apartment",
    videoUrl: "/tm2video.mp4",
    bookingUrlShort: "/property/78",
    bookingUrlLong: null,
    availableInLong: false, // monthly me show nahi hoga
  },
  {
    id: 3,
    title: "Signature Stay 3, Greater Noida",
    thumbnail: "/tm3image.jpeg",
    category: "Suite",
    videoUrl: "/tm3newvideo.mp4",
    bookingUrlShort: "/property/79",
    bookingUrlLong: "/property/315",
    availableInLong: true,
  },
  {
    id: 4,
    title: "Signature Stay 4, Noida",
    thumbnail: "/tmluxe44.png",
    category: "Suite",
    videoUrl: "/tm4newvideo.mp4",
    bookingUrlShort: "/property/80",
    bookingUrlLong: "/property/316",
    availableInLong: true,
    availableInNightly: false,
  },
  {
    id: 5,
    title: "Signature Stay 5, Noida",
    thumbnail: "/tm5.png",
    category: "Suite",
    videoUrl: "/tm5newvideo.mp4",
    bookingUrlShort: "/property/81",
    bookingUrlLong: "/property/317",
    availableInLong: true,
    availableInNightly: false,
  },
];


const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .vs-root {
    --gold: #c2772b;
    --gold-light: #d4924a;
    --gold-pale: #f5e8d8;
    --gold-glow: rgba(194,119,43,0.18);
    --white: #ffffff;
    --off-white: #fdf7ee;
    --text-dark: #1a1209;
    --text-mid: #6b5540;
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(160deg, #fdf7ee 0%, #f5ead6 60%, #ede4cf 100%);
    padding: 40px 24px 52px;
    position: relative;
    overflow: hidden;
  }

  .vs-root::before {
    content: '';
    position: absolute;
    top: -100px; right: -100px;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(194,119,43,0.07) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }
  .vs-root::after {
    content: '';
    position: absolute;
    bottom: -100px; left: -100px;
    width: 350px; height: 350px;
    background: radial-gradient(circle, rgba(194,119,43,0.05) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .vs-wrapper { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; }

  .vs-header {
    text-align: center;
    margin-bottom: 28px;
    animation: fadeDown 0.8s ease both;
  }
  .vs-eyebrow {
    display: inline-flex;
    background: rgba(194,119,43,0.1);
    border: 1px solid rgba(194,119,43,0.25);
    border-radius: 20px;
    padding: 4px 16px;
    margin-bottom: 12px;
    font-size: 0.62rem;
    color: var(--gold);
    letter-spacing: 1.4px;
    text-transform: uppercase;
    font-weight: 600;
  }
  .vs-title {
    font-size: clamp(1.3rem, 1.8vw, 1.75rem);
    font-weight: 600;
    color: var(--text-dark);
    line-height: 1.2;
    margin-bottom: 6px;
    font-family: 'Poppins', sans-serif;
  }
  .vs-title em { font-style: normal; color: var(--gold); }
  .vs-subtitle {
    font-size: 0.86rem;
    font-weight: 400;
    color: var(--text-mid);
    line-height: 1.6;
  }

  .vs-rental-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    margin-top: 16px;
    animation: fadeUp 0.6s 0.1s ease both;
  }
  .vs-rental-btn {
    font-family: 'Poppins', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 9px 22px;
    border: 1.5px solid var(--gold);
    cursor: pointer;
    transition: all 0.3s ease;
    background: transparent;
    color: var(--gold);
    position: relative;
  }
  .vs-rental-btn:first-child {
    border-radius: 50px 0 0 50px;
    border-right: none;
  }
  .vs-rental-btn:last-child {
    border-radius: 0 50px 50px 0;
  }
  .vs-rental-btn.active {
    background: var(--gold);
    color: white;
    box-shadow: 0 4px 16px rgba(194,119,43,0.35);
  }
  .vs-rental-btn:not(.active):hover {
    background: rgba(194,119,43,0.08);
  }
  .vs-rental-btn .vs-rental-icon {
    margin-right: 5px;
    font-size: 12px;
  }

  .vs-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin-bottom: 28px;
    background: #fff;
    border: 1.5px solid #f0e8da;
    border-radius: 50px;
    padding: 4px;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0 4px 18px rgba(0,0,0,0.08);
    animation: fadeUp 0.8s 0.2s ease both;
  }
  .vs-view-btn {
    font-family: 'Poppins', sans-serif;
    font-size: 0.74rem;
    font-weight: 600;
    padding: 8px 20px;
    border-radius: 50px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    background: transparent;
    color: #8a6a3a;
  }
  .vs-view-btn.active {
    background: var(--gold);
    color: white;
    box-shadow: 0 4px 16px rgba(194,119,43,0.35);
  }

  .instant-book-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-family: 'Jost', sans-serif;
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: white;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
    border: none;
    padding: 11px 22px;
    border-radius: 50px;
    cursor: pointer;
    text-decoration: none;
    box-shadow: 0 6px 20px rgba(194,119,43,0.4);
    transition: all 0.3s cubic-bezier(0.25,0.46,0.45,0.94);
    white-space: nowrap;
  }
  .instant-book-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(194,119,43,0.55);
    background: linear-gradient(135deg, var(--gold-light) 0%, #e0a060 100%);
  }
  .instant-book-btn:active { transform: translateY(0px); }
  .instant-book-btn .bolt-icon { font-size: 12px; line-height: 1; }

  .instant-book-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: 'Jost', sans-serif;
    font-size: 0.56rem;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--gold);
    background: transparent;
    border: 1px solid rgba(194,119,43,0.4);
    padding: 6px 14px;
    border-radius: 50px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.25s ease;
    white-space: nowrap;
    margin-top: 6px;
  }
  .instant-book-btn-ghost:hover {
    background: var(--gold);
    color: white;
    border-color: var(--gold);
    box-shadow: 0 4px 14px rgba(194,119,43,0.35);
  }

  .view-spotlight { animation: fadeIn 0.5s ease both; }
  .spotlight-main {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 32px;
    margin-bottom: 32px;
  }
  @media(max-width: 900px) { .spotlight-main { grid-template-columns: 1fr; } }

  .spotlight-player {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    background: #0a0805;
    aspect-ratio: 16/9;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(194,119,43,0.2);
    cursor: pointer;
  }
  .spotlight-player video, .spotlight-player img.thumb {
    width: 100%; height: 100%; object-fit: cover; display: block;
  }
  .spotlight-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(10,8,5,0.88) 0%, transparent 55%);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 28px;
    transition: opacity 0.3s;
  }
  .spotlight-player:hover .spotlight-overlay { opacity: 0.85; }
  .play-btn-large {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    width: 72px; height: 72px;
    background: rgba(194,119,43,0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
    border: 2px solid rgba(255,255,255,0.4);
    box-shadow: 0 8px 32px rgba(194,119,43,0.5);
    transition: all 0.3s ease;
    z-index: 5;
  }
  .spotlight-player:hover .play-btn-large {
    transform: translate(-50%,-50%) scale(1.1);
    background: var(--gold);
    box-shadow: 0 12px 40px rgba(194,119,43,0.7);
  }
  .play-icon {
    width: 0; height: 0;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-left: 20px solid white;
    margin-left: 4px;
  }
  .spotlight-info { position: relative; z-index: 2; }
  .spotlight-cat { font-size: 0.56rem; letter-spacing: 3px; text-transform: uppercase; color: var(--gold-light); margin-bottom: 6px; }
  .spotlight-name { font-family: 'Poppins', sans-serif; font-size: 1.3rem; font-weight: 600; color: white; margin-bottom: 12px; }
  .spotlight-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; position: relative; z-index: 10; }
  @media(max-width: 600px) { .spotlight-actions { display: none; } }

  .spotlight-sidebar {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 460px;
    overflow-y: auto;
    padding-right: 4px;
    scrollbar-width: thin;
    scrollbar-color: var(--gold) transparent;
  }
  .playlist-item {
    display: flex;
    gap: 12px;
    padding: 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.25s ease;
    border: 1.5px solid #f0e8da;
    background: #fff;
  }
  .playlist-item:hover { background: #fdf7ee; border-color: rgba(194,119,43,0.3); box-shadow: 0 4px 16px rgba(194,119,43,0.1); transform: translateX(4px); }
  .playlist-item.active { background: #fff; border-color: var(--gold); box-shadow: 0 4px 20px rgba(194,119,43,0.15); }
  .playlist-thumb { width: 80px; height: 52px; border-radius: 8px; object-fit: cover; flex-shrink: 0; position: relative; overflow: hidden; }
  .playlist-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .playlist-thumb-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; }
  .play-icon-sm { width: 0; height: 0; border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-left: 10px solid rgba(255,255,255,0.9); margin-left: 2px; }
  .playlist-meta { flex: 1; min-width: 0; }
  .playlist-cat { font-size: 0.5rem; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); margin-bottom: 4px; }
  .playlist-title { font-family: 'Poppins', sans-serif; font-size: 0.82rem; font-weight: 600; color: var(--text-dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
  .playlist-active-bar { width: 3px; background: var(--gold); border-radius: 2px; flex-shrink: 0; transition: opacity 0.3s; }

  .spotlight-nav { display: flex; align-items: center; justify-content: center; gap: 12px; }
  .nav-arrow { width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(194,119,43,0.3); background: white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.25s ease; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
  .nav-arrow:hover { background: var(--gold); border-color: var(--gold); box-shadow: 0 4px 16px rgba(194,119,43,0.35); }
  .nav-arrow:hover svg { stroke: white; }
  .nav-arrow svg { stroke: var(--gold); transition: stroke 0.25s; }
  .nav-dots { display: flex; gap: 6px; align-items: center; }
  .nav-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(194,119,43,0.2); cursor: pointer; transition: all 0.3s; }
  .nav-dot.active { width: 24px; border-radius: 3px; background: var(--gold); }

  .view-grid { animation: fadeIn 0.5s ease both; }
  .grid-layout { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
  .grid-card { background: white; border-radius: 16px; overflow: hidden; border: 1.5px solid #f0e8da; box-shadow: 0 4px 18px rgba(194,119,43,0.07); cursor: pointer; transition: all 0.35s cubic-bezier(0.25,0.46,0.45,0.94); animation: cardIn 0.5s ease both; }
  .grid-card:nth-child(1) { animation-delay: 0.05s }
  .grid-card:nth-child(2) { animation-delay: 0.1s }
  .grid-card:nth-child(3) { animation-delay: 0.15s }
  .grid-card:nth-child(4) { animation-delay: 0.2s }
  .grid-card:nth-child(5) { animation-delay: 0.25s }
  .grid-card:hover { transform: translateY(-8px); box-shadow: 0 20px 48px rgba(194,119,43,0.15); border-color: rgba(194,119,43,0.3); }
  .grid-thumb { position: relative; aspect-ratio: 16/9; overflow: hidden; }
  .grid-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; }
  .grid-card:hover .grid-thumb img { transform: scale(1.06); }
  .grid-thumb-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; }
  .grid-card:hover .grid-thumb-overlay { opacity: 1; }
  .play-btn-grid { width: 52px; height: 52px; border-radius: 50%; background: rgba(194,119,43,0.9); display: flex; align-items: center; justify-content: center; border: 2px solid rgba(255,255,255,0.5); box-shadow: 0 8px 24px rgba(194,119,43,0.5); transform: scale(0.8); transition: transform 0.3s; }
  .grid-card:hover .play-btn-grid { transform: scale(1); }
  .grid-body { padding: 16px 20px 20px; }
  .grid-cat { font-size: 0.5rem; letter-spacing: 3px; text-transform: uppercase; color: var(--gold); margin-bottom: 6px; }
  .grid-title { font-family: 'Poppins', sans-serif; font-size: 0.95rem; font-weight: 600; color: var(--text-dark); margin-bottom: 4px; line-height: 1.2; }
  .grid-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(194,119,43,0.1); gap: 8px; flex-wrap: wrap; }
  .watch-btn { font-size: 0.56rem; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); display: flex; align-items: center; gap: 4px; font-weight: 500; cursor: pointer; }
  .watch-btn::after { content: '→'; transition: transform 0.2s; display: inline-block; }
  .grid-card:hover .watch-btn::after { transform: translateX(4px); }

  .view-filmstrip { animation: fadeIn 0.5s ease both; }
  .filmstrip-featured { position: relative; border-radius: 20px; overflow: hidden; aspect-ratio: 16/7; margin-bottom: 24px; box-shadow: 0 24px 64px rgba(0,0,0,0.12); background: #0a0805; }
  .filmstrip-featured img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .filmstrip-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(10,8,5,0.82) 0%, transparent 60%, rgba(194,119,43,0.15) 100%); padding: 48px; display: flex; flex-direction: column; justify-content: center; }
  .filmstrip-tag { font-size: 0.56rem; letter-spacing: 4px; text-transform: uppercase; color: var(--gold-light); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .filmstrip-tag::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
  .filmstrip-featured-title { font-family: 'Poppins', sans-serif; font-size: clamp(1.3rem, 3vw, 2rem); font-weight: 600; color: white; line-height: 1.2; margin-bottom: 8px; max-width: 500px; }
  .filmstrip-actions { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; position: relative; z-index: 10; }
  @media(max-width: 600px) { .filmstrip-actions .instant-book-btn { display: none; } }
  .watch-now-btn { font-size: 0.62rem; letter-spacing: 3px; text-transform: uppercase; color: white; background: transparent; border: 1px solid rgba(255,255,255,0.45); padding: 11px 28px; border-radius: 50px; cursor: pointer; font-family: 'Jost', sans-serif; font-weight: 400; transition: all 0.3s; text-decoration: none; display: inline-block; }
  .watch-now-btn:hover { background: rgba(255,255,255,0.15); border-color: white; }
  .filmstrip-play-big { position: absolute; right: 48px; top: 50%; transform: translateY(-50%); width: 80px; height: 80px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); background: rgba(255,255,255,0.1); transition: all 0.3s; cursor: pointer; }
  .filmstrip-featured:hover .filmstrip-play-big { background: rgba(194,119,43,0.8); border-color: transparent; box-shadow: 0 0 40px rgba(194,119,43,0.5); }
  .filmstrip-strip { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: thin; scrollbar-color: var(--gold) transparent; }
  .strip-item { flex-shrink: 0; width: 200px; border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.3s ease; border: 1.5px solid #f0e8da; background: white; box-shadow: 0 4px 14px rgba(194,119,43,0.07); }
  .strip-item.active { border-color: var(--gold); box-shadow: 0 8px 28px rgba(194,119,43,0.2); }
  .strip-item:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(194,119,43,0.15); }
  .strip-thumb { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
  .strip-body { padding: 10px 12px 14px; }
  .strip-cat { font-size: 0.44rem; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); margin-bottom: 3px; }
  .strip-title { font-family: 'Poppins', sans-serif; font-size: 0.78rem; font-weight: 600; color: var(--text-dark); line-height: 1.3; margin-bottom: 8px; }

  .modal-backdrop { position: fixed; inset: 0; background: rgba(10,8,5,0.92); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 24px; animation: fadeIn 0.3s ease; }
  .modal-box { width: 100%; max-width: 900px; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.4), 0 0 0 1px rgba(194,119,43,0.2); animation: modalIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
  .modal-video-wrap { position: relative; aspect-ratio: 16/9; background: black; }
  .modal-video-wrap video { width: 100%; height: 100%; display: block; }
  .modal-close { position: absolute; top: 16px; right: 16px; width: 40px; height: 40px; border-radius: 50%; background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2); color: white; font-size: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; backdrop-filter: blur(4px); transition: all 0.2s; }
  .modal-close:hover { background: var(--gold); border-color: transparent; }
  .modal-info { padding: 24px 32px; border-top: 1px solid rgba(194,119,43,0.15); display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  .modal-cat { font-size: 0.56rem; letter-spacing: 3px; text-transform: uppercase; color: var(--gold); margin-bottom: 4px; }
  .modal-title { font-family: 'Poppins', sans-serif; font-size: 1.05rem; font-weight: 600; color: var(--text-dark); }

  @media (max-width: 768px) {
    .vs-root { padding: 24px 16px 28px; }
    .vs-title { font-size: 1.2rem; font-weight: 600; }
    .vs-subtitle { font-size: 0.7rem; }
    .vs-eyebrow { font-size: 0.55rem; padding: 3px 12px; margin-bottom: 7px; }
    .vs-header { margin-bottom: 16px; }
    .vs-controls { margin-bottom: 16px; }
    .vs-view-btn { font-size: 0.66rem; padding: 6px 14px; }
    .vs-rental-btn { font-size: 0.72rem; padding: 7px 16px; }
    .grid-layout { grid-template-columns: 1fr 1fr; gap: 12px; }
    .grid-title { font-size: 0.78rem; font-weight: 600; }
  }

  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  @keyframes fadeDown { from { opacity: 0; transform: translateY(-20px) } to { opacity: 1; transform: translateY(0) } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
  @keyframes cardIn { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
  @keyframes modalIn { from { opacity: 0; transform: scale(0.9) } to { opacity: 1; transform: scale(1) } }
`;

export default function VideoShowcase({ videos = SAMPLE_VIDEOS }) {
const [activeIdx, setActiveIdx] = useState(0);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [rentalType, setRentalType] = useState('short');
  const videoRef = useRef(null);

  // sessionStorage se rental type read karo + changes listen karo
  useEffect(() => {
    const stored = sessionStorage.getItem('ovika_rental_type');
    if (stored) setRentalType(stored);

    // Poll for changes (jab popup se toggle ho)
    const interval = setInterval(() => {
      const current = sessionStorage.getItem('ovika_rental_type') || 'short';
      setRentalType(prev => {
        if (prev !== current) return current;
        return prev;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const isMonthly = rentalType === 'long';

  // Monthly / Nightly mode me unavailable videos filter out karo
  const filteredVideos = isMonthly
    ? videos.filter(v => v.availableInLong !== false)
    : videos.filter(v => v.availableInNightly !== false);

  // Agar activeIdx out of bounds ho jaye filtered list me
  useEffect(() => {
    if (activeIdx >= filteredVideos.length) {
      setActiveIdx(0);
    }
  }, [filteredVideos.length, activeIdx]);

  const current = filteredVideos[activeIdx] || filteredVideos[0];

  // Correct booking URL based on rental type
  const getBookingUrl = (video) => {
    if (isMonthly) {
      return video.bookingUrlLong || video.bookingUrlShort;
    }
    return video.bookingUrlShort;
  };

  // Toggle rental type + sync sessionStorage
  const handleRentalToggle = (type) => {
    setRentalType(type);
    sessionStorage.setItem('ovika_rental_type', type);
    setActiveIdx(0); // reset to first item when switching
  };

  const goNext = () => setActiveIdx((i) => (i + 1) % filteredVideos.length);
  const goPrev = () => setActiveIdx((i) => (i - 1 + filteredVideos.length) % filteredVideos.length);
  const openModal = (video) => setPlayingVideo(video);
  const closeModal = () => setPlayingVideo(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (!current) return null;

  return (
    <div id="signature-stays-section" className="vs-root">
      <style>{styles}</style>

      <div className="vs-wrapper">
        <div className="vs-header">
          <div className="vs-eyebrow">✦ Signature Stays</div>
          <div className="vs-rental-toggle">
            <button 
              className={`vs-rental-btn${!isMonthly ? ' active' : ''}`} 
              onClick={() => handleRentalToggle('short')}
            >
              <span className="vs-rental-icon">🏨</span>Nightly
            </button>
            <button 
              className={`vs-rental-btn${isMonthly ? ' active' : ''}`} 
              onClick={() => handleRentalToggle('long')}
            >
              <span className="vs-rental-icon">🏠</span>Monthly
            </button>
          </div>
        </div>

        {/* SPOTLIGHT */}
        <div className="view-spotlight">
            <div className="spotlight-main">
              <div className="spotlight-player" onClick={() => openModal(current)}>
                <img 
                  src="/ovikaver.png" 
                  alt="Verified" 
                  style={{ 
                    position: 'absolute', 
                    top: -15, 
                    left: -15, 
                    width: 100, 
                    zIndex: 20, 
                    pointerEvents: 'none',
                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))'
                  }} 
                />
                <img className="thumb" src={current.thumbnail} alt={current.title} />
                <div className="spotlight-overlay">
                  <div className="spotlight-info">
                    <div className="spotlight-cat">{current.category}</div>
                    <div className="spotlight-name">{current.title}</div>
                    <div className="spotlight-actions">
                      <a className="instant-book-btn" href={getBookingUrl(current)} onClick={(e) => e.stopPropagation()}>
                        <span className="bolt-icon">⚡</span>
                        Instant Booking
                      </a>
                    </div>
                  </div>
                </div>
                <div className="play-btn-large"><div className="play-icon" /></div>
              </div>

              <div className="spotlight-sidebar">
                {filteredVideos.map((v, i) => (
                  <div key={v.id} className={`playlist-item${activeIdx === i ? " active" : ""}`} onClick={() => setActiveIdx(i)}>
                    <div className="playlist-thumb">
                      <img src={v.thumbnail} alt={v.title} />
                      <div className="playlist-thumb-overlay"><div className="play-icon-sm" /></div>
                    </div>
                    <div className="playlist-meta">
                      <div className="playlist-cat">{v.category}</div>
                      <div className="playlist-title">{v.title}</div>
                      <a className="instant-book-btn-ghost" href={getBookingUrl(v)} onClick={(e) => e.stopPropagation()}>
                        ⚡ Instant Booking
                      </a>
                    </div>
                    {activeIdx === i && <div className="playlist-active-bar" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="spotlight-nav">
              <div className="nav-arrow" onClick={goPrev}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
              </div>
              <div className="nav-dots">
                {filteredVideos.map((_, i) => (
                  <div key={i} className={`nav-dot${activeIdx === i ? " active" : ""}`} onClick={() => setActiveIdx(i)} />
                ))}
              </div>
              <div className="nav-arrow" onClick={goNext}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              </div>
            </div>
          </div>

      </div>

      {/* VIDEO MODAL */}
      {playingVideo && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-video-wrap">
              <img 
                src="/ovikaver.png" 
                alt="Verified" 
                style={{ 
                  position: 'absolute', 
                  top: 20, 
                  left: 20, 
                  width: 130, 
                  zIndex: 110, 
                  pointerEvents: 'none',
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))'
                }} 
              />
              <video ref={videoRef} src={playingVideo.videoUrl} controls autoPlay style={{ width: "100%", height: "100%", display: "block" }} />
              <div className="modal-close" onClick={closeModal}>×</div>
            </div>
            <div className="modal-info">
              <div>
                <div className="modal-cat">{playingVideo.category}</div>
                <div className="modal-title">{playingVideo.title}</div>
              </div>
              <a className="instant-book-btn" href={getBookingUrl(playingVideo)} onClick={(e) => e.stopPropagation()}>
                <span className="bolt-icon">⚡</span>Instant Booking
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}