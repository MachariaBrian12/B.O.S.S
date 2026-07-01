'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

export default function Landing() {
  useEffect(() => {
    fetch('/api/ping').catch(() => {});
  }, []);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const neuralRef = useRef<HTMLCanvasElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    const COLS = [
      '#ffffff',
      '#06B6D4',
      '#8B5CF6',
      '#3B82F6',
      '#10B981',
      '#e0f0ff',
    ];
    const stars = Array.from({ length: 320 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 1.7 + 0.2,
      opacity: Math.random() * 0.65 + 0.1,
      twinkle: Math.random() * Math.PI * 2,
      speed: 0.006 + Math.random() * 0.016,
      color: COLS[Math.floor(Math.random() * 6)],
    }));
    interface Shoot {
      x: number;
      y: number;
      len: number;
      speed: number;
      angle: number;
      life: number;
      maxLife: number;
    }
    const shoots: Shoot[] = [];
    const spawnShoot = () =>
      shoots.push({
        x: Math.random() * W * 1.4 - W * 0.2,
        y: Math.random() * H * 0.5,
        len: 120 + Math.random() * 160,
        speed: 10 + Math.random() * 14,
        angle: Math.PI / 6 + (Math.random() - 0.5) * 0.3,
        life: 0,
        maxLife: 38,
      });
    const si = setInterval(spawnShoot, 3200);
    let starId: number;
    const drawStars = () => {
      ctx.clearRect(0, 0, W, H);
      [
        { x: W * 0.15, y: H * 0.25, r: 280, c: 'rgba(59,130,246,.028)' },
        { x: W * 0.8, y: H * 0.15, r: 220, c: 'rgba(139,92,246,.024)' },
        { x: W * 0.5, y: H * 0.75, r: 260, c: 'rgba(6,182,212,.02)' },
        { x: W * 0.9, y: H * 0.6, r: 180, c: 'rgba(16,185,129,.016)' },
      ].forEach((n) => {
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        g.addColorStop(0, n.c);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      });
      stars.forEach((s) => {
        s.twinkle += s.speed;
        const flicker = s.opacity * (0.6 + 0.4 * Math.sin(s.twinkle));
        const sz = s.size * (0.85 + 0.15 * Math.sin(s.twinkle * 1.3));
        if (s.color !== '#ffffff') {
          ctx.shadowBlur = 7;
          ctx.shadowColor = s.color;
        }
        ctx.globalAlpha = flicker;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, sz, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });
      for (let i = shoots.length - 1; i >= 0; i--) {
        const sh = shoots[i];
        sh.life++;
        sh.x += Math.cos(sh.angle) * sh.speed;
        sh.y += Math.sin(sh.angle) * sh.speed;
        const p = sh.life / sh.maxLife;
        const a = p < 0.3 ? p / 0.3 : 1 - (p - 0.3) / 0.7;
        const grd = ctx.createLinearGradient(
          sh.x,
          sh.y,
          sh.x - Math.cos(sh.angle) * sh.len,
          sh.y - Math.sin(sh.angle) * sh.len,
        );
        grd.addColorStop(0, `rgba(255,255,255,${a * 0.9})`);
        grd.addColorStop(0.3, `rgba(180,220,255,${a * 0.45})`);
        grd.addColorStop(1, 'transparent');
        ctx.strokeStyle = grd;
        ctx.lineWidth = 1.4;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(120,200,255,.7)';
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(
          sh.x - Math.cos(sh.angle) * sh.len,
          sh.y - Math.sin(sh.angle) * sh.len,
        );
        ctx.stroke();
        ctx.shadowBlur = 0;
        if (sh.life >= sh.maxLife) shoots.splice(i, 1);
      }
      starId = requestAnimationFrame(drawStars);
    };
    drawStars();
    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0,
      ax = 0,
      ay = 0,
      vx = 0,
      vy = 0,
      curId: number,
      isHover = false;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = mx + 'px';
        dotRef.current.style.top = my + 'px';
      }
    };
    const tick = () => {
      const rEase = isHover ? 0.72 : 0.82;
      const aEase = isHover ? 0.58 : 0.68;
      const prevRx = rx,
        prevRy = ry;
      rx += (mx - rx) * rEase;
      ry += (my - ry) * rEase;
      ax += (mx - ax) * aEase;
      ay += (my - ay) * aEase;
      vx = rx - prevRx;
      vy = ry - prevRy;
      const speed = Math.sqrt(vx * vx + vy * vy);
      const stretch = Math.min(1 + speed * 0.055, 1.35);
      const angle = Math.atan2(vy, vx) * (180 / Math.PI);
      if (ringRef.current) {
        ringRef.current.style.left = rx + 'px';
        ringRef.current.style.top = ry + 'px';
        ringRef.current.style.transform = `translate(-50%,-50%) rotate(${angle}deg) scaleX(${stretch}) scaleY(${1 / stretch})`;
      }
      if (auraRef.current) {
        auraRef.current.style.left = ax + 'px';
        auraRef.current.style.top = ay + 'px';
      }
      curId = requestAnimationFrame(tick);
    };
    document.addEventListener('mousemove', onMove);
    tick();
    const grow = () => {
      isHover = true;
      dotRef.current?.classList.add('dot-big');
      ringRef.current?.classList.add('ring-big');
      auraRef.current?.classList.add('aura-big');
    };
    const shrink = () => {
      isHover = false;
      dotRef.current?.classList.remove('dot-big');
      ringRef.current?.classList.remove('ring-big');
      auraRef.current?.classList.remove('aura-big');
    };
    document
      .querySelectorAll('button,a,.bento-card,.price-card')
      .forEach((el) => {
        el.addEventListener('mouseenter', grow);
        el.addEventListener('mouseleave', shrink);
      });
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = (link as HTMLAnchorElement).getAttribute('href');
        if (href?.startsWith('#')) {
          document
            .querySelector(href)
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(starId);
      cancelAnimationFrame(curId);
      clearInterval(si);
    };
  }, []);

  useEffect(() => {
    const canvas = neuralRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    const COLS = [
      'rgba(59,130,246,',
      'rgba(6,182,212,',
      'rgba(139,92,246,',
      'rgba(16,185,129,',
    ];
    const nodes = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1 + Math.random() * 2.5,
      col: COLS[Math.floor(Math.random() * 4)],
      p: Math.random() * Math.PI * 2,
      sp: 0.011 + Math.random() * 0.018,
    }));
    const packets: { from: number; to: number; t: number; sp: number }[] = [];
    let lastP = 0,
      nid = 0;
    const draw = (ts: number) => {
      const W = canvas.width,
        H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      if (ts - lastP > 1300 && packets.length < 10) {
        const a = Math.floor(Math.random() * nodes.length);
        let b = a;
        while (b === a) b = Math.floor(Math.random() * nodes.length);
        packets.push({
          from: a,
          to: b,
          t: 0,
          sp: 0.006 + Math.random() * 0.01,
        });
        lastP = ts;
      }
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.p += n.sp;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });
      nodes.forEach((a, i) =>
        nodes.forEach((b, j) => {
          if (j <= i) return;
          const dx = b.x - a.x,
            dy = b.y - a.y,
            d = Math.sqrt(dx * dx + dy * dy);
          if (d < 135) {
            ctx.strokeStyle = `rgba(59,130,246,${(1 - d / 135) * 0.11})`;
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }),
      );
      nodes.forEach((n) => {
        const g = 0.3 + 0.25 * Math.sin(n.p);
        ctx.shadowBlur = 9;
        ctx.shadowColor = n.col + '0.7)';
        ctx.fillStyle = n.col + g + ')';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * (0.85 + 0.15 * Math.sin(n.p)), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      for (let i = packets.length - 1; i >= 0; i--) {
        const pk = packets[i];
        pk.t += pk.sp;
        if (pk.t >= 1) {
          packets.splice(i, 1);
          continue;
        }
        const a = nodes[pk.from],
          b = nodes[pk.to];
        const x = a.x + (b.x - a.x) * pk.t,
          y = a.y + (b.y - a.y) * pk.t;
        const g2 = ctx.createRadialGradient(x, y, 0, x, y, 8);
        g2.addColorStop(0, 'rgba(6,182,212,0.95)');
        g2.addColorStop(1, 'transparent');
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      nid = requestAnimationFrame(draw);
    };
    nid = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(nid);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('revealed');
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' },
    );
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        :root{--void:#02020c;--blue:#3B82F6;--cyan:#06B6D4;--purple:#8B5CF6;--green:#10B981;--amber:#F59E0B;--pink:#EC4899;--t1:#F1F5F9;--t2:#94A3B8;--t3:#475569;--gb:rgba(255,255,255,0.022);--gbr:rgba(255,255,255,0.07);}
        .ham{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:8px;background:none;border:none;z-index:200;}
        @media(min-width:769px){.nav-links{display:flex;gap:4px;list-style:none;}.nav-btns{display:flex;gap:8px;align-items:center;}}
        .ham span{display:block;width:22px;height:2px;background:var(--t1);border-radius:2px;transition:all .3s ease;}
        .ham.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}
        .ham.open span:nth-child(2){opacity:0;}
        .ham.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}
        .mob-menu{display:none;position:fixed;inset:0;z-index:150;background:rgba(2,2,12,.97);backdrop-filter:blur(40px);flex-direction:column;align-items:center;justify-content:center;gap:32px;}
        .mob-menu.open{display:flex;}
        .mob-link{font-family:'Syne',sans-serif;font-size:28px;font-weight:700;color:var(--t1);text-decoration:none;letter-spacing:-.02em;transition:color .2s;}
        .mob-link:hover{color:var(--cyan);}
        .mob-btns{display:flex;flex-direction:column;gap:12px;width:260px;margin-top:16px;}
        @media(max-width:768px){.ham{display:flex;}.nav-links{display:none;}.nav-btns{display:none;}.stat{padding:24px 12px;}}
        html{scroll-behavior:smooth;}
        body{background:var(--void);color:var(--t1);font-family:'DM Sans',sans-serif;overflow-x:hidden;cursor:none;}
        html,body{max-width:100vw;overflow-x:hidden;}
        @media(max-width:768px){body{cursor:auto;}#cur-dot,#cur-ring,#cur-aura{display:none;}.nav-links,.nav-btns{display:none;}.nav{padding:10px 16px;}.hero{padding:110px 22px 90px;}.hero-title{font-size:clamp(42px,14vw,80px);}.hero-actions{flex-direction:column;width:100%;}.btn-primary,.btn-secondary{width:100%;justify-content:center;}.dash-frame{display:none;}.stats-inner{grid-template-columns:1fr 1fr;}.stat{padding:28px 16px;}.stat-n{font-size:36px;}.about{flex-direction:column;gap:40px;padding:80px 22px;}.about-h{font-size:clamp(28px,8.5vw,44px);}.features{padding:80px 22px;}.bento{grid-template-columns:1fr;}.bc.bw{grid-column:span 1;}.ai-sec{flex-direction:column;padding:80px 22px;gap:40px;}.ai-chat{max-width:100%;}.pg{flex-direction:column;align-items:center;}.price-card{width:100%;max-width:360px;}.cta-strip{padding:110px 22px;}.sec-h{font-size:clamp(28px,7.5vw,42px);}@keyframes aA{to{transform:translate(0,0) scale(1);}}@keyframes aB{to{transform:translate(0,0) scale(1);}}@keyframes aC{to{transform:translate(0,0) scale(1);}}}
        #cur-dot{position:fixed;z-index:10000;width:5px;height:5px;background:#fff;border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);transition:width .15s ease,height .15s ease;box-shadow:0 0 0 1px rgba(255,255,255,.6),0 0 8px 3px rgba(6,182,212,.85),0 0 18px 6px rgba(6,182,212,.45),0 0 32px 12px rgba(139,92,246,.25);}
        #cur-dot.dot-big{width:7px;height:7px;box-shadow:0 0 0 1.5px rgba(255,255,255,.8),0 0 12px 4px rgba(6,182,212,.95),0 0 28px 10px rgba(6,182,212,.55),0 0 50px 20px rgba(139,92,246,.35),0 0 80px 35px rgba(59,130,246,.2);}
        #cur-ring{position:fixed;z-index:9999;width:30px;height:30px;border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);border:1px solid rgba(6,182,212,.55);box-shadow:0 0 6px 1px rgba(6,182,212,.22),inset 0 0 6px 1px rgba(6,182,212,.08);transition:width .18s cubic-bezier(.16,1,.3,1),height .18s cubic-bezier(.16,1,.3,1),border-color .18s ease,box-shadow .18s ease;}
        #cur-ring.ring-big{width:52px;height:52px;border-color:rgba(6,182,212,.8);box-shadow:0 0 14px 3px rgba(6,182,212,.4),0 0 28px 8px rgba(139,92,246,.2),inset 0 0 10px 2px rgba(6,182,212,.12);}
        #cur-aura{position:fixed;z-index:9998;width:110px;height:110px;border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);background:radial-gradient(circle at center,rgba(6,182,212,.10) 0%,rgba(59,130,246,.06) 35%,rgba(139,92,246,.03) 60%,transparent 72%);transition:width .45s cubic-bezier(.16,1,.3,1),height .45s cubic-bezier(.16,1,.3,1);}
        #cur-aura.aura-big{width:180px;height:180px;background:radial-gradient(circle at center,rgba(6,182,212,.15) 0%,rgba(59,130,246,.09) 35%,rgba(139,92,246,.05) 60%,transparent 72%);}
        .aurora-bg{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none;}
        .a1{position:absolute;width:min(1000px,180vw);height:min(1000px,180vw);background:radial-gradient(circle,rgba(59,130,246,.15) 0%,transparent 65%);top:-300px;left:-200px;animation:aA 22s ease-in-out infinite alternate;}
        .a2{position:absolute;width:min(750px,150vw);height:min(750px,150vw);background:radial-gradient(circle,rgba(139,92,246,.13) 0%,transparent 65%);top:80px;right:-150px;animation:aB 28s ease-in-out infinite alternate;}
        .a3{position:absolute;width:min(850px,160vw);height:min(850px,160vw);background:radial-gradient(circle,rgba(6,182,212,.10) 0%,transparent 65%);bottom:-100px;left:22%;animation:aC 20s ease-in-out infinite alternate;}
        .a4{position:absolute;width:550px;height:550px;background:radial-gradient(circle,rgba(16,185,129,.08) 0%,transparent 65%);bottom:18%;right:8%;animation:aA 34s ease-in-out infinite alternate-reverse;}
        .a5{position:absolute;width:480px;height:480px;background:radial-gradient(circle,rgba(236,72,153,.06) 0%,transparent 65%);top:42%;left:42%;animation:aB 26s ease-in-out infinite alternate;}
        @keyframes aA{to{transform:translate(110px,85px) scale(1.16);}}
        @keyframes aB{to{transform:translate(-85px,125px) scale(.88);}}
        @keyframes aC{to{transform:translate(-125px,-85px) scale(1.12);}}
        .noise{position:fixed;inset:0;z-index:1;opacity:.018;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
        .grid{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.013;background-image:linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px);background-size:80px 80px;}
        .nav{position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:1000;width:calc(100% - 40px);max-width:1140px;display:flex;align-items:center;justify-content:space-between;padding:10px 22px;background:rgba(2,2,12,.76);backdrop-filter:blur(40px) saturate(200%);border:1px solid rgba(255,255,255,.075);border-radius:15px;}
        .nav-logo{font-family:'Syne',sans-serif;font-weight:800;font-size:17px;letter-spacing:.04em;background:linear-gradient(135deg,#fff,var(--cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;display:flex;align-items:center;gap:8px;text-decoration:none;}
        .nav-pulse{width:6px;height:6px;background:var(--green);border-radius:50%;box-shadow:0 0 10px var(--green);flex-shrink:0;-webkit-text-fill-color:initial;animation:blink 2s ease-in-out infinite;}
        @keyframes blink{0%,100%{box-shadow:0 0 8px var(--green);}50%{box-shadow:0 0 20px var(--green),0 0 40px rgba(16,185,129,.4);}}
        .nav-links{gap:4px;list-style:none;}
        .nav-link{color:var(--t3);text-decoration:none;font-size:13px;font-weight:400;padding:7px 14px;border-radius:10px;transition:all .22s ease;letter-spacing:.01em;cursor:none;}
        .nav-link:hover{color:var(--t1);background:rgba(255,255,255,.06);}
        .nav-btns{gap:8px;align-items:center;}
        .btn-nav-ghost{padding:8px 16px;background:transparent;border:1px solid rgba(255,255,255,.10);border-radius:10px;color:var(--t2);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:400;cursor:none;transition:all .22s ease;text-decoration:none;display:inline-flex;align-items:center;}
        .btn-nav-ghost:hover{background:rgba(255,255,255,.06);color:var(--t1);border-color:rgba(255,255,255,.18);}
        .btn-nav-primary{padding:8px 20px;background:linear-gradient(135deg,var(--blue),var(--purple));border:none;border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:none;transition:all .25s ease;text-decoration:none;display:inline-flex;align-items:center;}
        .btn-nav-primary:hover{transform:scale(1.05);box-shadow:0 8px 32px rgba(59,130,246,.45);}
        .hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:120px 24px 80px;text-align:center;position:relative;}
        .hero-badge{display:inline-flex;align-items:center;gap:8px;padding:5px 16px 5px 10px;background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.22);border-radius:100px;font-size:11px;color:var(--green);font-weight:500;letter-spacing:.08em;text-transform:uppercase;margin-bottom:40px;}
        .badge-dot{width:6px;height:6px;background:var(--green);border-radius:50%;box-shadow:0 0 8px var(--green);animation:blink 2s ease-in-out infinite;}
        .hero-wordmark{margin-bottom:14px;position:relative;}
        .hero-title{font-family:'Syne',sans-serif;font-size:clamp(48px,13vw,170px);font-weight:800;line-height:.88;letter-spacing:-.06em;background:linear-gradient(160deg,#ffffff 0%,rgba(255,255,255,.88) 28%,var(--cyan) 60%,var(--purple) 82%,var(--pink) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-size:200% 200%;animation:gradShift 6s ease infinite;filter:drop-shadow(0 0 60px rgba(6,182,212,.22)) drop-shadow(0 0 120px rgba(139,92,246,.12));}
        @keyframes gradShift{0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}
        .hero-fullname{font-family:'DM Sans',sans-serif;font-size:clamp(11px,1.3vw,15px);font-weight:400;color:var(--t3);letter-spacing:.26em;text-transform:uppercase;margin-bottom:36px;}
        .hero-tagline{display:inline-flex;align-items:center;gap:14px;font-family:'Syne',sans-serif;font-size:clamp(14px,1.7vw,19px);font-weight:600;letter-spacing:.01em;background:linear-gradient(90deg,var(--cyan),var(--purple),var(--blue),var(--pink));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-size:300% auto;animation:gradShift 4s linear infinite;margin-bottom:52px;}
        .tl{display:inline-block;width:36px;height:1px;border-radius:1px;background:linear-gradient(90deg,transparent,var(--cyan));vertical-align:middle;opacity:.7;}
        .tr{background:linear-gradient(90deg,var(--purple),transparent);}
        .hero-actions{display:flex;gap:12px;align-items:center;margin-bottom:88px;}
        .btn-primary{padding:14px 30px;background:linear-gradient(135deg,var(--blue) 0%,var(--purple) 100%);border:none;border-radius:12px;color:#fff;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;cursor:none;position:relative;overflow:hidden;transition:all .25s ease;text-decoration:none;display:inline-flex;align-items:center;}
        .btn-primary:hover{transform:translateY(-2px) scale(1.02);box-shadow:0 20px 60px rgba(59,130,246,.45),0 0 100px rgba(139,92,246,.18);}
        .btn-secondary{padding:14px 28px;background:transparent;border:1px solid rgba(255,255,255,.11);border-radius:12px;color:var(--t2);font-family:'DM Sans',sans-serif;font-size:15px;font-weight:400;cursor:none;transition:all .25s ease;text-decoration:none;display:inline-flex;align-items:center;}
        .btn-secondary:hover{background:rgba(255,255,255,.055);border-color:rgba(255,255,255,.2);color:var(--t1);transform:translateY(-2px);}
        .dash-frame{width:100%;max-width:980px;position:relative;}
        .dash-frame::before{content:'';position:absolute;inset:-1px;background:linear-gradient(135deg,rgba(59,130,246,.25),rgba(139,92,246,.22),rgba(6,182,212,.25));border-radius:24px;z-index:-1;filter:blur(.5px);}
        .dash-frame::after{content:'';position:absolute;inset:-80px;z-index:-2;background:radial-gradient(ellipse at 50% 40%,rgba(59,130,246,.09) 0%,rgba(139,92,246,.04) 40%,transparent 65%);}
        .dashboard{background:rgba(4,4,16,.95);backdrop-filter:blur(48px);border:1px solid rgba(255,255,255,.055);border-radius:22px;overflow:hidden;padding:22px;}
        .dash-bar{display:flex;align-items:center;gap:6px;margin-bottom:18px;}
        .dd{width:10px;height:10px;border-radius:50%;}.dr{background:#FF5F57;}.dy{background:#FFBD2E;}.dg{background:#28C840;}
        .dt{margin-left:14px;font-size:10px;color:var(--t3);letter-spacing:.08em;text-transform:uppercase;}
        .dash-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px;}
        .dc{background:rgba(255,255,255,.022);border:1px solid rgba(255,255,255,.05);border-radius:10px;padding:12px;}
        .dcl{font-size:9px;color:var(--t3);margin-bottom:5px;letter-spacing:.05em;text-transform:uppercase;}
        .dcv{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:var(--t1);letter-spacing:-.02em;}
        .dcd{font-size:9px;color:var(--green);font-weight:500;margin-top:3px;}
        .dash-bottom{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
        .dca{background:rgba(255,255,255,.016);border:1px solid rgba(255,255,255,.04);border-radius:10px;padding:14px;height:110px;overflow:hidden;}
        .dcal{font-size:9px;color:var(--t3);margin-bottom:7px;text-transform:uppercase;letter-spacing:.06em;}
        .bars{display:flex;align-items:flex-end;gap:2px;height:70px;}
        .bar{flex:1;background:linear-gradient(to top,var(--blue),var(--cyan));border-radius:2px 2px 0 0;opacity:.65;}
        .dlf{background:rgba(255,255,255,.016);border:1px solid rgba(255,255,255,.04);border-radius:10px;padding:12px;overflow:hidden;}
        .dlh{font-size:9px;color:var(--t3);margin-bottom:8px;display:flex;align-items:center;gap:5px;text-transform:uppercase;letter-spacing:.06em;}
        .dld{width:5px;height:5px;background:var(--green);border-radius:50%;box-shadow:0 0 5px var(--green);animation:blink 1.5s ease-in-out infinite;}
        .dfi{display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.03);}
        .dfl{font-size:10px;color:var(--t2);}.dfs{font-size:9px;color:var(--t3);margin-top:1px;}
        .dfa{font-size:11px;font-weight:600;color:var(--green);font-family:'Syne',sans-serif;}
        .stats{padding:40px 16px;}
        .stats-inner{max-width:100%;margin:0 auto;display:grid;grid-template-columns:1fr;gap:12px;border-radius:24px;overflow:hidden;}
        @media(min-width:769px){.stats-inner{grid-template-columns:repeat(3,1fr);gap:14px;}}
        .stat{background:linear-gradient(160deg,rgba(20,22,40,0.97) 0%,rgba(8,8,20,0.99) 100%);border:1px solid rgba(255,255,255,.09);border-top:1px solid rgba(255,255,255,.18);border-bottom:1px solid rgba(0,0,0,.6);box-shadow:0 2px 0 rgba(255,255,255,.06) inset,0 -1px 0 rgba(0,0,0,.5) inset,0 20px 60px rgba(0,0,0,.5),0 4px 16px rgba(0,0,0,.4);padding:44px 32px;text-align:center;transition:all .35s cubic-bezier(.16,1,.3,1);border-radius:18px;position:relative;overflow:hidden;}
        .stat::before{content:'';position:absolute;inset:0;border-radius:18px;background:linear-gradient(160deg,rgba(255,255,255,.04) 0%,transparent 50%);pointer-events:none;}
        .stat:hover{transform:translateY(-4px) scale(1.015);}
        .stat-n{font-family:'Syne',sans-serif;font-size:clamp(28px,8vw,50px);font-weight:800;letter-spacing:-.05em;background:linear-gradient(160deg,#ffffff 0%,rgba(255,255,255,.75) 60%,rgba(180,200,255,.6) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;display:block;margin-bottom:8px;overflow:hidden;filter:drop-shadow(0 2px 8px rgba(59,130,246,.3)) drop-shadow(0 0 20px rgba(139,92,246,.15));}
        .stat-l{font-size:11px;color:var(--t3);font-weight:300;letter-spacing:.07em;text-transform:uppercase;}
        .about{padding:60px 16px;max-width:100vw;margin:0 auto;display:grid;grid-template-columns:1fr;gap:40px;align-items:center;overflow:hidden;width:100%;box-sizing:border-box;}
        @media(min-width:769px){.about{padding:100px 24px;grid-template-columns:1fr 1fr;gap:80px;}}
        .about-tag{font-size:11px;color:var(--blue);font-weight:500;letter-spacing:.15em;text-transform:uppercase;margin-bottom:20px;display:flex;align-items:center;gap:10px;}
        .about-tag::before{content:'';display:block;width:24px;height:1px;background:var(--blue);}
        .about-h{font-family:'Syne',sans-serif;font-size:clamp(28px,3.5vw,48px);font-weight:700;letter-spacing:-.04em;line-height:1.05;margin-bottom:24px;}
        .about-h span{background:linear-gradient(135deg,var(--cyan),var(--blue),var(--purple),var(--pink));-webkit-background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 20px rgba(6,182,212,.35));background-size:200% auto;animation:gradShift 4s ease infinite;}
        .about-p{font-size:15px;color:var(--t2);line-height:1.88;font-weight:300;}
        .about-p strong{color:var(--t1);font-weight:500;}
        .pill{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.065);border-radius:14px;padding:16px 20px;display:flex;align-items:center;gap:14px;transition:all .3s cubic-bezier(.16,1,.3,1);margin-bottom:10px;cursor:none;}
        .pill:hover{background:rgba(59,130,246,.055)!important;border-color:rgba(59,130,246,.18)!important;transform:translateX(7px);}
        .pill-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;}
        .pill-text{font-size:12.5px;color:var(--t2);font-weight:300;line-height:1.5;}
        .pill-text strong{color:var(--t1);font-weight:500;display:block;margin-bottom:2px;font-size:13px;}
        .ib{background:rgba(59,130,246,.13);border:1px solid rgba(59,130,246,.2);}
        .ic{background:rgba(6,182,212,.13);border:1px solid rgba(6,182,212,.2);}
        .ip{background:rgba(139,92,246,.13);border:1px solid rgba(139,92,246,.2);}
        .ig{background:rgba(16,185,129,.13);border:1px solid rgba(16,185,129,.2);}
        .ia{background:rgba(245,158,11,.13);border:1px solid rgba(245,158,11,.2);}
        .features{padding:80px 24px;max-width:1140px;margin:0 auto;}
        .sec-tag{font-size:11px;color:var(--blue);font-weight:500;letter-spacing:.15em;text-transform:uppercase;margin-bottom:18px;}
        .sec-h{font-family:'Syne',sans-serif;font-size:clamp(32px,4.2vw,52px);font-weight:700;letter-spacing:-.035em;line-height:1.05;margin-bottom:52px;max-width:560px;background:linear-gradient(135deg,#ffffff 0%,rgba(255,255,255,.9) 40%,var(--cyan) 70%,var(--purple) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 30px rgba(6,182,212,.2));}
        .bento{display:grid;grid-template-columns:1fr;gap:10px;}
        @media(min-width:769px){.bento{grid-template-columns:repeat(3,1fr);}}
        .bw{grid-column:span 2;}
        .bc{background:var(--gb);border:1px solid var(--gbr);border-radius:18px;padding:26px;position:relative;overflow:hidden;transition:all .4s cubic-bezier(.16,1,.3,1);cursor:none;}
        .bc:hover{transform:translateY(-5px) scale(1.008);border-color:rgba(255,255,255,.11);}
        .bi{width:42px;height:42px;border-radius:11px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;font-size:17px;}
        .bt{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;letter-spacing:-.02em;margin-bottom:9px;}
        .bd{font-size:13px;color:var(--t2);line-height:1.65;font-weight:300;}
        .bg{position:absolute;width:180px;height:180px;border-radius:50%;filter:blur(70px);opacity:.1;bottom:-45px;right:-45px;pointer-events:none;}
        .ai-sec{padding:60px 20px;max-width:1140px;margin:0 auto;display:grid;grid-template-columns:1fr;gap:40px;align-items:center;}
        @media(min-width:769px){.ai-sec{padding:80px 24px;grid-template-columns:1fr 1fr;gap:70px;}}
        .ai-list{list-style:none;margin-top:28px;display:flex;flex-direction:column;gap:12px;}
        .ai-list li{display:flex;align-items:center;gap:11px;font-size:14px;color:var(--t2);font-weight:300;}
        .ai-ck{width:21px;height:21px;border-radius:7px;background:rgba(16,185,129,.10);border:1px solid rgba(16,185,129,.22);display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--green);flex-shrink:0;}
        .ai-chat{background:rgba(4,4,16,.92);border:1px solid rgba(255,255,255,.07);border-radius:18px;padding:22px;backdrop-filter:blur(24px);position:relative;}
        .ai-chat::before{content:'';position:absolute;inset:-1px;background:linear-gradient(135deg,rgba(139,92,246,.18),transparent 50%,rgba(59,130,246,.18));border-radius:19px;z-index:-1;}
        .ai-hdr{display:flex;align-items:center;gap:9px;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,.055);}
        .ai-av{width:30px;height:30px;background:linear-gradient(135deg,var(--purple),var(--blue));border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;font-family:'Syne',sans-serif;color:#fff;}
        .ai-nm{font-size:12px;font-weight:500;color:var(--t1);}
        .ai-st{font-size:10px;color:var(--green);margin-top:1px;}
        .cm{margin-bottom:11px;}.cu{display:flex;justify-content:flex-end;}
        .cb{max-width:82%;padding:9px 13px;border-radius:13px;font-size:12px;line-height:1.55;}
        .cbu{background:rgba(59,130,246,.17);border:1px solid rgba(59,130,246,.22);border-radius:13px 13px 4px 13px;color:var(--t1);}
        .cba{background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07);border-radius:13px 13px 13px 4px;color:var(--t2);}
        .hl{color:var(--cyan);font-weight:500;}
        .pricing{padding:80px 24px;max-width:1140px;margin:0 auto;text-align:center;}
        .pg{display:grid;grid-template-columns:1fr;gap:13px;margin-top:56px;text-align:left;}
        @media(min-width:769px){.pg{grid-template-columns:repeat(2,1fr);max-width:760px;margin-left:auto;margin-right:auto;}}
        .price-card{background:var(--gb);border:1px solid var(--gbr);border-radius:18px;padding:30px;position:relative;overflow:hidden;transition:all .35s ease;cursor:none;width:100%;box-sizing:border-box;}
        .price-card:hover{transform:translateY(-7px);box-shadow:0 36px 90px rgba(0,0,0,.55);}
        .price-card.feat{background:linear-gradient(135deg,rgba(59,130,246,.065),rgba(139,92,246,.065));border-color:rgba(59,130,246,.3);}
        .price-card.feat::before{content:'MOST POPULAR';position:absolute;top:18px;right:18px;font-size:9px;font-weight:700;letter-spacing:.1em;color:var(--blue);background:rgba(59,130,246,.12);padding:3px 9px;border-radius:100px;border:1px solid rgba(59,130,246,.22);}
        .pt{font-size:10px;font-weight:500;color:var(--t3);letter-spacing:.1em;text-transform:uppercase;margin-bottom:22px;}
        .pp{font-family:'Syne',sans-serif;font-size:clamp(28px,8vw,50px);font-weight:800;letter-spacing:-.05em;margin-bottom:4px;}
        .pper{font-size:12px;color:var(--t3);margin-bottom:28px;font-weight:300;}
        .pf{list-style:none;margin-bottom:28px;}
        .pf li{font-size:12.5px;color:var(--t2);padding:8px 0;border-bottom:1px solid rgba(255,255,255,.04);display:flex;align-items:center;gap:9px;font-weight:300;}
        .ck{color:var(--green);font-size:13px;flex-shrink:0;}
        .pb{width:100%;padding:13px;border-radius:11px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:none;transition:all .25s ease;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.04);color:var(--t2);}
        .pb:hover{background:rgba(255,255,255,.09);color:var(--t1);}
        .feat .pb{background:linear-gradient(135deg,var(--blue),var(--purple));border-color:transparent;color:#fff;}
        .feat .pb:hover{box-shadow:0 0 45px rgba(59,130,246,.42);transform:scale(1.02);}
        .cta-strip{padding:100px 24px;text-align:center;position:relative;}
        .cta-strip::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(59,130,246,.07) 0%,transparent 65%);pointer-events:none;}
        footer{padding:56px 24px;border-top:1px solid rgba(255,255,255,.045);position:relative;z-index:2;}
        @media(max-width:768px){footer{padding:40px 16px;}}
        .fl{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;background:linear-gradient(135deg,#fff,var(--cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:10px;}
        .ft{font-size:12px;color:var(--t3);font-weight:300;letter-spacing:.02em;margin-bottom:28px;}
        .reveal{opacity:0;transform:translateY(32px);transition:opacity .75s cubic-bezier(.16,1,.3,1),transform .75s cubic-bezier(.16,1,.3,1);}
        .reveal.revealed{opacity:1;transform:translateY(0);}
        .glow-breathe{animation:breathe 4s ease-in-out infinite;}
        @keyframes breathe{0%,100%{filter:drop-shadow(0 0 30px rgba(6,182,212,.25)) drop-shadow(0 0 80px rgba(139,92,246,.12));}50%{filter:drop-shadow(0 0 60px rgba(6,182,212,.45)) drop-shadow(0 0 140px rgba(139,92,246,.25));}}
        .btn-primary::before{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:conic-gradient(transparent,rgba(255,255,255,.08),transparent 30%);animation:spin 4s linear infinite;opacity:0;transition:opacity .3s;}
        .btn-primary:hover::before{opacity:1;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .btn-primary:active,.btn-secondary:active{transform:scale(.97)!important;}
        @keyframes beam{0%{opacity:0;transform:translateX(-100%) rotate(-45deg);}50%{opacity:.06;}100%{opacity:0;transform:translateX(100%) rotate(-45deg);}}
        .hero::after{content:'';position:absolute;top:0;left:0;right:0;height:100%;background:linear-gradient(135deg,transparent 30%,rgba(6,182,212,.04) 50%,transparent 70%);animation:beam 8s ease-in-out infinite;pointer-events:none;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:2px;}
      `}</style>

      <div id="cur-dot" ref={dotRef} />
      <div id="cur-ring" ref={ringRef} />
      <div id="cur-aura" ref={auraRef} />
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div className="aurora-bg">
        <div className="a1" />
        <div className="a2" />
        <div className="a3" />
        <div className="a4" />
        <div className="a5" />
      </div>
      <div className="noise" />
      <div className="grid" />

      <nav className="nav">
        <Link href="/" className="nav-logo">
          <span className="nav-pulse" />
          B.O.S.S
        </Link>
        <ul className="nav-links">
          <li>
            <a href="#platform" className="nav-link">
              Platform
            </a>
          </li>
          <li>
            <a href="#intelligence" className="nav-link">
              Intelligence
            </a>
          </li>
          <li>
            <a href="#about" className="nav-link">
              About
            </a>
          </li>
          <li>
            <a href="#pricing" className="nav-link">
              Pricing
            </a>
          </li>
        </ul>
        <div className="nav-btns">
          <Link href="/login" className="btn-nav-ghost">
            Sign In
          </Link>
          <Link href="/register" className="btn-nav-primary">
            Get Started →
          </Link>
        </div>
        <button
          className={`ham${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div
        className={`mob-menu${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(false)}
      >
        <a
          href="#platform"
          className="mob-link"
          onClick={() => setMenuOpen(false)}
        >
          Platform
        </a>
        <a
          href="#intelligence"
          className="mob-link"
          onClick={() => setMenuOpen(false)}
        >
          Intelligence
        </a>
        <a
          href="#about"
          className="mob-link"
          onClick={() => setMenuOpen(false)}
        >
          About
        </a>
        <a
          href="#pricing"
          className="mob-link"
          onClick={() => setMenuOpen(false)}
        >
          Pricing
        </a>
        <div className="mob-btns">
          <Link
            href="/login"
            className="btn-nav-ghost"
            style={{ textAlign: 'center', justifyContent: 'center' }}
            onClick={() => setMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="btn-nav-primary"
            style={{ textAlign: 'center', justifyContent: 'center' }}
            onClick={() => setMenuOpen(false)}
          >
            Get Started →
          </Link>
        </div>
      </div>

      <main style={{ position: 'relative', zIndex: 2 }}>
        {/* HERO */}
        <section className="hero" id="hero">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="hero-badge"
          >
            <span className="badge-dot" />
            Built in Nairobi · For African entrepreneurs
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="hero-wordmark"
          >
            <div className="hero-title glow-breathe">B.O.S.S</div>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="hero-fullname"
          >
            Business Orchestration Software Systems
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="hero-tagline"
          >
            <span className="tl" />
            Intelligent by design.&nbsp;&nbsp;Powerful by nature.
            <span className="tl tr" />
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="hero-actions"
          >
            <Link href="/register" className="btn-primary">
              Start for Free →
            </Link>
            <Link href="/login" className="btn-secondary">
              Sign In
            </Link>
            <a
              href="#about"
              className="btn-secondary nav-link"
              style={{ fontSize: 13, padding: '10px 20px' }}
            >
              See How It Works
            </a>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            style={{ width: '100%', maxWidth: 980 }}
            className="dash-frame"
          >
            <div className="dashboard">
              <div className="dash-bar">
                <div className="dd dr" />
                <div className="dd dy" />
                <div className="dd dg" />
                <span className="dt">B.O.S.S — Command Centre</span>
              </div>
              <div className="dash-grid">
                {[
                  {
                    l: 'Revenue Today',
                    v: 'KSh 48,250',
                    d: '↑ 23.4% vs yesterday',
                  },
                  { l: 'Net Profit', v: 'KSh 27,100', d: '56% margin' },
                  { l: 'Health Score', v: '92/100', d: 'Excellent' },
                  { l: 'Day Streak', v: '14 days', d: '🔥 Keep it going' },
                ].map((c) => (
                  <div key={c.l} className="dc">
                    <div className="dcl">{c.l}</div>
                    <div className="dcv">{c.v}</div>
                    <div className="dcd">{c.d}</div>
                  </div>
                ))}
              </div>
              <div className="dash-bottom">
                <div className="dca">
                  <div className="dcal">7-Day Revenue Trend</div>
                  <div className="bars">
                    {[
                      12, 18, 24, 31, 28, 45, 52, 61, 58, 72, 68, 84, 91, 87,
                      95, 102, 98, 88, 76, 65, 54, 43, 32, 21,
                    ].map((h, i) => (
                      <div
                        key={i}
                        className="bar"
                        style={{ height: `${(h / 102) * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="dlf">
                  <div className="dlh">
                    <span className="dld" />
                    Guru AI Insights
                  </div>
                  {[
                    {
                      item: 'Profit up 23%',
                      store: 'vs last Tuesday',
                      amt: '↑',
                    },
                    {
                      item: 'Expenses on track',
                      store: 'Below 45% threshold',
                      amt: '✓',
                    },
                    {
                      item: 'Best day: Friday',
                      store: 'KSh 63,000 revenue',
                      amt: '🏆',
                    },
                    {
                      item: 'Streak: 14 days',
                      store: 'Log today to keep it',
                      amt: '🔥',
                    },
                  ].map((r, i) => (
                    <div key={i} className="dfi">
                      <div>
                        <div className="dfl">{r.item}</div>
                        <div className="dfs">{r.store}</div>
                      </div>
                      <div className="dfa">{r.amt}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* STATS — honest */}
        <section className="stats">
          <div className="stats-inner">
            {[
              { n: '30s', l: 'To log your daily numbers' },
              { n: 'AI', l: 'Insights from your real data' },
              { n: 'KES', l: 'M-Pesa payments built in' },
            ].map((s) => (
              <div key={s.l} className="stat reveal">
                <span className="stat-n">{s.n}</span>
                <span className="stat-l">{s.l}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section
          className="about"
          id="about"
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <canvas
            ref={neuralRef}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              zIndex: 0,
              pointerEvents: 'none',
              opacity: 0.28,
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="about-tag">What B.O.S.S actually does</div>
            <h2 className="about-h">
              Your business numbers.
              <br />
              <span>Understood in seconds.</span>
            </h2>
            <p className="about-p">
              Most African business owners track their numbers in a notebook —
              or not at all. B.O.S.S gives you a{' '}
              <strong>30-second daily entry</strong> that turns into AI-powered
              insights, streak accountability, and a weekly CEO briefing written
              specifically for your business.{' '}
              <strong>No spreadsheets. No accountant needed.</strong>
            </p>
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            {[
              {
                icon: '⚡',
                cls: 'ib',
                title: '30-Second Daily Entry',
                body: 'Log your sales and expenses in under 30 seconds. Via the app or WhatsApp — whichever you prefer.',
              },
              {
                icon: '🧠',
                cls: 'ic',
                title: 'AI That Knows Your Business',
                body: 'Guru AI reads your actual numbers and gives you specific insights — not generic advice. "Your profit dropped Tuesday because expenses were 18% higher."',
              },
              {
                icon: '📊',
                cls: 'ip',
                title: 'Daily + Weekly Intelligence',
                body: 'Morning digest every day. Full CEO briefing every Sunday. Know exactly how your business is doing before you open your doors.',
              },
              {
                icon: '🔥',
                cls: 'ig',
                title: 'Streak & Accountability',
                body: 'A daily streak keeps you consistent. Businesses that track daily see 23% higher profits on average. B.O.S.S makes it effortless.',
              },
              {
                icon: '📱',
                cls: 'ia',
                title: 'M-Pesa Native',
                body: 'Kenyan-first. Pay with M-Pesa. Log M-Pesa transactions. Built for how business actually works in East Africa.',
              },
            ].map((p) => (
              <div key={p.title} className="pill reveal">
                <div className={`pill-icon ${p.cls}`}>{p.icon}</div>
                <div className="pill-text">
                  <strong>{p.title}</strong>
                  {p.body}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="features" id="platform">
          <div className="sec-tag">What you get</div>
          <h2 className="sec-h">Everything a serious business owner needs.</h2>
          <div className="bento">
            {[
              {
                cls: 'bc bw',
                icon: '📊',
                icls: 'ib',
                title: 'Real Business Intelligence',
                body: 'Your actual revenue, expenses, profit margin and health score — updated every time you log an entry. See trends, spot problems, and understand your business in one glance.',
                glow: 'var(--blue)',
              },
              {
                cls: 'bc',
                icon: '🤖',
                icls: 'ic',
                title: 'Guru AI Chat',
                body: 'Ask anything about your business. Get answers using your real data, not generic advice.',
                glow: 'var(--cyan)',
              },
              {
                cls: 'bc',
                icon: '📧',
                icls: 'ip',
                title: 'Daily Digest Email',
                body: "6am every morning: yesterday's numbers, today's AI insight, one action to take.",
                glow: 'var(--purple)',
              },
              {
                cls: 'bc',
                icon: '💱',
                icls: 'ig',
                title: 'Multi-Currency',
                body: 'KES, USD, EUR, GBP and 20+ more. Switch instantly. All conversions are live.',
                glow: 'var(--green)',
              },
              {
                cls: 'bc bw',
                icon: '📈',
                icls: 'ia',
                title: '7-Day Trend + Weekly CEO Report',
                body: "See your week at a glance. Get a full AI-written Sunday report: what went well, what didn't, and one thing to do differently next week.",
                glow: 'var(--amber)',
              },
            ].map((c) => (
              <div key={c.title} className={c.cls}>
                <div className={`bi ${c.icls}`}>{c.icon}</div>
                <div className="bt">{c.title}</div>
                <div className="bd">{c.body}</div>
                <div className="bg" style={{ background: c.glow }} />
              </div>
            ))}
          </div>
        </section>

        {/* AI SECTION */}
        <section className="ai-sec" id="intelligence">
          <div>
            <div className="sec-tag">Guru AI</div>
            <h2 className="sec-h" style={{ marginBottom: 16 }}>
              The AI that actually knows your business.
            </h2>
            <p
              style={{
                color: 'var(--t2)',
                fontSize: 15,
                lineHeight: 1.75,
                fontWeight: 300,
                maxWidth: 380,
              }}
            >
              B.O.S.S doesn&apos;t give generic business advice. Guru AI reads{' '}
              <strong style={{ color: '#06B6D4' }}>your actual data</strong> —
              your sales, your margins, your patterns — and tells you exactly
              what&apos;s happening and what to do about it.
            </p>
            <ul className="ai-list">
              {[
                'Why did my profit drop this week?',
                'What was my best day and why?',
                'Am I on track for my monthly target?',
                'What should I focus on tomorrow?',
              ].map((i) => (
                <li key={i}>
                  <span className="ai-ck">✓</span>
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="ai-chat">
            <div className="ai-hdr">
              <div className="ai-av">G</div>
              <div>
                <div className="ai-nm">Guru AI</div>
                <div className="ai-st">● Online · Reading your data</div>
              </div>
            </div>
            <div className="cm cu">
              <div className="cb cbu">Why did my profit drop on Tuesday?</div>
            </div>
            <div className="cm">
              <div className="cb cba">
                Your Tuesday expenses were{' '}
                <span className="hl">KSh 18,400</span> — 34% higher than your
                weekly average of KSh 13,700. Revenue was normal at KSh 42,000,
                but the expense spike cut your margin from 56% to 38%.
                <br />
                <br />
                The pattern matches your last 3 Tuesdays. Check if you have a
                recurring supplier payment hitting on Tuesdays.
              </div>
            </div>
            <div className="cm cu">
              <div className="cb cbu">What should I focus on this week?</div>
            </div>
            <div className="cm">
              <div className="cb cba">
                <span className="hl">
                  One thing: get expenses below KSh 15,000/day.
                </span>{' '}
                You&apos;ve hit your revenue target 5 of the last 7 days. The
                only thing limiting your profit is the expense side. Fix that
                and you&apos;re at 60%+ margin.
              </div>
            </div>
          </div>
        </section>

        {/* PRICING — honest 2 tiers */}
        <section className="pricing" id="pricing">
          <div className="sec-tag">Pricing</div>
          <h2
            className="sec-h"
            style={{
              maxWidth: '100%',
              margin: '0 auto 0',
              textAlign: 'center',
            }}
          >
            Simple. No surprises.
          </h2>
          <div className="pg">
            {[
              {
                tier: 'Free',
                price: 'KSh 0',
                per: 'forever · get started today',
                feat: [
                  'Daily entry (sales + expenses)',
                  'Health score + basic insights',
                  '7-day trend chart',
                  '14-day streak tracking',
                ],
                btn: 'Start Free',
                cls: 'price-card',
              },
              {
                tier: 'Pro',
                price: 'KSh 1,499',
                per: 'per month · cancel anytime',
                feat: [
                  'Everything in Free',
                  'Guru AI chat (unlimited)',
                  'Daily 6am digest email',
                  'Weekly CEO briefing',
                  'M-Pesa payment tracking',
                  'Multi-currency support',
                ],
                btn: 'Start 14-Day Free Trial',
                cls: 'price-card feat',
              },
            ].map((p) => (
              <div key={p.tier} className={p.cls}>
                <div className="pt">{p.tier}</div>
                <div className="pp">{p.price}</div>
                <div className="pper">{p.per}</div>
                <ul className="pf">
                  {p.feat.map((f) => (
                    <li key={f}>
                      <span className="ck">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="pb"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    textDecoration: 'none',
                  }}
                >
                  {p.btn}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="cta-strip">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp}>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--green)',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  marginBottom: 20,
                }}
              >
                Built in Nairobi. For Africa. 🇰🇪
              </div>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              style={{
                fontFamily: "'Syne',sans-serif",
                fontSize: 'clamp(32px,5vw,64px)',
                fontWeight: 800,
                letterSpacing: '-.04em',
                lineHeight: 1.0,
                marginBottom: 24,
                background:
                  'linear-gradient(135deg,#fff 0%,var(--cyan) 50%,var(--purple) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Know your numbers.
              <br />
              Grow your business.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              style={{
                color: 'var(--t2)',
                fontSize: 16,
                lineHeight: 1.7,
                fontWeight: 300,
                maxWidth: 440,
                margin: '0 auto 36px',
              }}
            >
              Log your first entry in 30 seconds. Get your first AI insight
              immediately. Join entrepreneurs across East Africa who track daily
              and grow faster.
            </motion.p>
            <motion.div
              variants={fadeUp}
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Link
                href="/register"
                className="btn-primary"
                style={{ fontSize: 16, padding: '16px 36px' }}
              >
                Get Started Free →
              </Link>
              <Link href="/login" className="btn-secondary">
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <footer>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: 40,
              marginBottom: 48,
            }}
          >
            <div style={{ minWidth: 200 }}>
              <div className="fl" style={{ marginBottom: 8 }}>
                B.O.S.S
              </div>
              <p className="ft" style={{ marginBottom: 4 }}>
                Business Orchestration Software Systems
              </p>
              <p style={{ fontSize: 11, color: '#334155', marginTop: 8 }}>
                A product of{' '}
                <strong style={{ color: '#475569' }}>
                  Guru Software Group
                </strong>
              </p>
            </div>
            <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
              <div>
                <div
                  style={{
                    fontSize: 10,
                    color: '#334155',
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    marginBottom: 12,
                    fontWeight: 600,
                  }}
                >
                  Product
                </div>
                <ul
                  style={{
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  {[
                    ['Platform', '#platform'],
                    ['Intelligence', '#intelligence'],
                    ['Pricing', '#pricing'],
                    ['Sign In', '/login'],
                  ].map(([l, h]) => (
                    <li key={l}>
                      <a
                        href={h}
                        style={{
                          fontSize: 13,
                          color: '#475569',
                          textDecoration: 'none',
                        }}
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 10,
                    color: '#334155',
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    marginBottom: 12,
                    fontWeight: 600,
                  }}
                >
                  Company
                </div>
                <ul
                  style={{
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  {[
                    ['About', '#about'],
                    ['Privacy', '#'],
                    ['Terms', '#'],
                    ['Contact', 'https://wa.me/254701937625'],
                  ].map(([l, h]) => (
                    <li key={l}>
                      <a
                        href={h}
                        style={{
                          fontSize: 13,
                          color: '#475569',
                          textDecoration: 'none',
                        }}
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,.045)',
              paddingTop: 24,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <p
              style={{ fontSize: 11, color: '#1e293b', letterSpacing: '.06em' }}
            >
              © 2026 Guru Software Group. Built in Nairobi, Kenya 🇰🇪 for Africa
              and the world.
            </p>
            <p
              style={{ fontSize: 11, color: '#1e293b', letterSpacing: '.04em' }}
            >
              B.O.S.S · Guru AI Core
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
