import { useEffect, useRef, useMemo, useState } from 'react';
import music from './assets/music.mp3';

// ============================================
// 3D SHAPES BACKGROUND COMPONENT
// ============================================
function Shapes3DBackground() {
  const shapes = useMemo(() => [
    // Cubes
    { type: 'cube', x: '10%', y: '15%', scale: 1, delay: 0, duration: 25 },
    { type: 'cube', x: '85%', y: '20%', scale: 0.7, delay: 2, duration: 30 },
    { type: 'cube', x: '75%', y: '70%', scale: 0.9, delay: 5, duration: 28 },
    { type: 'cube', x: '5%', y: '80%', scale: 0.6, delay: 3, duration: 32 },
    
    // Octahedrons
    { type: 'octahedron', x: '20%', y: '60%', scale: 1.2, delay: 1, duration: 30 },
    { type: 'octahedron', x: '90%', y: '50%', scale: 0.8, delay: 4, duration: 35 },
    { type: 'octahedron', x: '50%', y: '10%', scale: 0.6, delay: 2, duration: 28 },
    
    // Rings
    { type: 'ring', x: '30%', y: '25%', scale: 1, delay: 0, duration: 20 },
    { type: 'ring', x: '70%', y: '85%', scale: 0.7, delay: 3, duration: 25 },
    { type: 'ring', x: '15%', y: '45%', scale: 0.5, delay: 5, duration: 22 },
    
    // Pyramids
    { type: 'pyramid', x: '60%', y: '30%', scale: 0.9, delay: 2, duration: 35 },
    { type: 'pyramid', x: '25%', y: '85%', scale: 0.7, delay: 4, duration: 32 },
    
    // Diamonds
    { type: 'diamond', x: '80%', y: '40%', scale: 1.1, delay: 1, duration: 28 },
    { type: 'diamond', x: '40%', y: '75%', scale: 0.8, delay: 3, duration: 26 },
    { type: 'diamond', x: '55%', y: '55%', scale: 0.5, delay: 6, duration: 30 },
    
    // Spheres
    { type: 'sphere', x: '45%', y: '40%', scale: 1, delay: 0, duration: 22 },
    { type: 'sphere', x: '10%', y: '30%', scale: 0.6, delay: 4, duration: 25 },
    { type: 'sphere', x: '95%', y: '75%', scale: 0.7, delay: 2, duration: 24 },
  ], []);

  const renderShape = (shape: typeof shapes[0], index: number) => {
    const baseStyle: React.CSSProperties = {
      left: shape.x,
      top: shape.y,
      transform: `scale(${shape.scale})`,
      animationDelay: `${shape.delay}s`,
      animationDuration: `${shape.duration}s`,
    };

    switch (shape.type) {
      case 'cube':
        return (
          <div key={index} className="shape" style={baseStyle}>
            <div className="cube" style={{ animationDuration: `${shape.duration * 1.2}s`, animationDelay: `${shape.delay}s` }}>
              <div className="cube-face front"></div>
              <div className="cube-face back"></div>
              <div className="cube-face right"></div>
              <div className="cube-face left"></div>
              <div className="cube-face top"></div>
              <div className="cube-face bottom"></div>
            </div>
          </div>
        );
      
      case 'octahedron':
        return (
          <div key={index} className="shape" style={baseStyle}>
            <div className="octahedron" style={{ animationDuration: `${shape.duration * 1.5}s`, animationDelay: `${shape.delay}s` }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="octahedron-face"></div>
              ))}
            </div>
          </div>
        );
      
      case 'ring':
        return (
          <div key={index} className="shape" style={baseStyle}>
            <div className="ring" style={{ animationDuration: `${shape.duration}s`, animationDelay: `${shape.delay}s` }}></div>
          </div>
        );
      
      case 'pyramid':
        return (
          <div key={index} className="shape" style={baseStyle}>
            <div className="pyramid" style={{ animationDuration: `${shape.duration * 1.3}s`, animationDelay: `${shape.delay}s` }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="pyramid-face"></div>
              ))}
              <div className="pyramid-base"></div>
            </div>
          </div>
        );
      
      case 'diamond':
        return (
          <div key={index} className="shape" style={baseStyle}>
            <div className="diamond" style={{ animationDuration: `${shape.duration}s`, animationDelay: `${shape.delay}s` }}>
              <div className="diamond-top">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="diamond-face"></div>
                ))}
              </div>
              <div className="diamond-bottom">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="diamond-face"></div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'sphere':
        return (
          <div key={index} className="shape" style={baseStyle}>
            <div className="sphere" style={{ animationDuration: `${shape.duration}s`, animationDelay: `${shape.delay}s` }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="sphere-ring"></div>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="shapes-container">
      {shapes.map((shape, index) => renderShape(shape, index))}
    </div>
  );
}

// ============================================
// RAIN OVERLAY COMPONENT
// ============================================
function RainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<WaterDrop[]>([]);
  const animationRef = useRef<number>(0);

  class WaterDrop {
    x: number;
    y: number;
    radius: number;
    speed: number;
    opacity: number;
    isTrickling: boolean;
    trickleSpeed: number;
    trail: { x: number; y: number; opacity: number }[];
    maxTrailLength: number;
    wobble: number;
    wobbleSpeed: number;
    isStatic: boolean;
    staticTimer: number;

    constructor(canvasWidth: number, canvasHeight: number, startFromTop: boolean = true) {
      this.x = Math.random() * canvasWidth;
      this.y = startFromTop ? Math.random() * -100 : Math.random() * canvasHeight;
      this.radius = Math.random() * 2.5 + 1;
      this.speed = Math.random() * 0.6 + 0.2;
      this.opacity = Math.random() * 0.25 + 0.08;
      this.isTrickling = Math.random() > 0.25;
      this.trickleSpeed = Math.random() * 0.4 + 0.1;
      this.trail = [];
      this.maxTrailLength = Math.floor(Math.random() * 20) + 8;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.015 + 0.005;
      this.isStatic = Math.random() > 0.65;
      this.staticTimer = Math.random() * 300 + 150;
    }

    update(canvasHeight: number, canvasWidth: number) {
      if (this.isStatic) {
        this.staticTimer--;
        if (this.staticTimer <= 0) {
          this.isStatic = false;
        }
        return;
      }

      this.wobble += this.wobbleSpeed;
      const wobbleOffset = Math.sin(this.wobble) * 0.25;

      if (this.isTrickling) {
        this.trail.unshift({ 
          x: this.x, 
          y: this.y, 
          opacity: this.opacity * 0.5 
        });
        
        if (this.trail.length > this.maxTrailLength) {
          this.trail.pop();
        }

        this.y += this.trickleSpeed;
        this.x += wobbleOffset;

        this.trail.forEach((point) => {
          point.opacity *= 0.93;
        });
      } else {
        this.y += this.speed * 1.5;
      }

      if (this.y > canvasHeight + 10) {
        this.reset(canvasWidth, canvasHeight);
      }

      if (this.x < 0) this.x = canvasWidth;
      if (this.x > canvasWidth) this.x = 0;
    }

    reset(canvasWidth: number, _canvasHeight: number) {
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * -50 - 10;
      this.radius = Math.random() * 2.5 + 1;
      this.speed = Math.random() * 0.6 + 0.2;
      this.opacity = Math.random() * 0.25 + 0.08;
      this.isTrickling = Math.random() > 0.25;
      this.trail = [];
      this.isStatic = Math.random() > 0.65;
      this.staticTimer = Math.random() * 300 + 150;
      this.wobble = Math.random() * Math.PI * 2;
    }

    draw(ctx: CanvasRenderingContext2D) {
      if (this.isTrickling && this.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(this.trail[0].x, this.trail[0].y);
        
        for (let i = 1; i < this.trail.length; i++) {
          ctx.lineTo(this.trail[i].x, this.trail[i].y);
        }
        
        ctx.strokeStyle = `rgba(200, 215, 230, ${this.opacity * 0.25})`;
        ctx.lineWidth = this.radius * 0.7;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      const gradient = ctx.createRadialGradient(
        this.x - this.radius * 0.3,
        this.y - this.radius * 0.3,
        0,
        this.x,
        this.y,
        this.radius * 1.5
      );
      
      gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity * 0.7})`);
      gradient.addColorStop(0.4, `rgba(200, 215, 230, ${this.opacity * 0.4})`);
      gradient.addColorStop(1, `rgba(150, 170, 190, ${this.opacity * 0.15})`);

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(
        this.x - this.radius * 0.25,
        this.y - this.radius * 0.25,
        this.radius * 0.25,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.5})`;
      ctx.fill();
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    
    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      
      dropsRef.current = initDrops(width, height);
    };

    const initDrops = (width: number, height: number) => {
      const drops: WaterDrop[] = [];
      const dropCount = Math.floor((width * height) / 30000);
      
      for (let i = 0; i < Math.min(dropCount, 120); i++) {
        drops.push(new WaterDrop(width, height, false));
      }
      
      return drops;
    };

    resize();
    window.addEventListener('resize', resize);

    dropsRef.current = initDrops(window.innerWidth, window.innerHeight);

    const animate = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Math.random() > 0.93 && dropsRef.current.length < 120) {
        dropsRef.current.push(new WaterDrop(width, height, true));
      }

      dropsRef.current.forEach(drop => {
        drop.update(height, width);
        drop.draw(ctx);
      });

      if (dropsRef.current.length > 100) {
        dropsRef.current = dropsRef.current.filter(
          drop => !drop.isStatic || Math.random() > 0.1
        );
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="rain-overlay"
      aria-hidden="true"
    />
  );
}

// ============================================
// AUDIO PLAYER & VISUALIZER COMPONENT
// ============================================
function AudioVisualizer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      ctx.clearRect(0, 0, width, height);

      if (analyserRef.current && isPlaying) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        const barWidth = (width / bufferLength) * 2.5;
        const gap = 3;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * height * 0.8;
          
          // Gradient based on frequency
          const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
          gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');

          ctx.fillStyle = gradient;
          
          // Draw rounded bars
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(x, height - barHeight, barWidth - gap, barHeight, 4);
          } else {
            ctx.rect(x, height - barHeight, barWidth - gap, barHeight);
          }
          ctx.fill();

          // Subtle glow
          ctx.shadowColor = 'rgba(255, 255, 255, 0.2)';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;

          x += barWidth;
        }
      } else {
        // Idle animation - gentle pulse
        const time = Date.now() / 1000;
        const barWidth = (width / 32) * 2.5;
        const gap = 3;
        for (let i = 0; i < 32; i++) {
          const barHeight = 4 + Math.sin(time * 2 + i * 0.2) * 4;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(i * barWidth, height - barHeight, barWidth - gap, barHeight, 2);
          } else {
            ctx.rect(i * barWidth, height - barHeight, barWidth - gap, barHeight);
          }
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isPlaying]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 128; // Smaller fft for cleaner bars
      analyserRef.current.smoothingTimeConstant = 0.8;

      const source = audioContextRef.current.createMediaElementSource(audio);
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    if (isPlaying) {
      audio.pause();
    } else {
      try {
        await audio.play();
      } catch (e) {
        console.error('Playback failed:', e);
        return;
      }
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="equalizer-container">
      <audio
        ref={audioRef}
        src={music}
        loop
        preload="auto"
      />
      
      <div className="equalizer-inner">
        <button 
          onClick={togglePlay}
          className="play-button-small"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.14v14.72a1 1 0 001.5.86l11-7.36a1 1 0 000-1.72l-11-7.36a1 1 0 00-1.5.86z" />
            </svg>
          )}
        </button>
        <canvas ref={canvasRef} className="equalizer-canvas" />
      </div>
    </div>
  );
}

// ============================================
// SVG ICON COMPONENTS
// ============================================
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="18" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function DribbbleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
      <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
      <path d="M8.56 2.75c4.37 6 6 12 6.93 18.93" />
    </svg>
  );
}

// ============================================
// SOCIAL LINK COMPONENT
// ============================================
interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function SocialLink({ href, icon, label }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="social-icon"
      aria-label={label}
      title={label}
    >
      {icon}
    </a>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function App() {
  const socialLinks = [
    { href: "https://github.com/kolyamips", icon: <GitHubIcon />, label: "GitHub" },
  ];

  return (
    <>
      {/* 3D Shapes Background */}
      <Shapes3DBackground />

      {/* Foreground Rain Overlay */}
      <RainOverlay />

      {/* Main Content Container */}
      <div className="main-container">
        <div className="w-full max-w-md mx-auto">
          {/* Liquid Glass Card */}
          <div className="liquid-glass p-10 sm:p-12">
            
            {/* Avatar */}
            <div className="avatar initial-hidden animate-fade-in delay-1">
              <span className="avatar-text">KM</span>
            </div>

            {/* Greeting */}
            <p className="text-center text-white/40 text-xs tracking-[0.3em] uppercase mb-3 initial-hidden animate-fade-in delay-2">
              Welcome, I'm
            </p>

            {/* Name */}
            <h1 
              className="text-center text-4xl sm:text-5xl font-semibold text-gradient mb-3 initial-hidden animate-fade-in delay-3"
              style={{ letterSpacing: '-0.02em' }}
            >
              kolyamips
            </h1>

            {/* Title */}
            <p className="text-center text-white/50 text-base font-light tracking-wide initial-hidden animate-fade-in delay-4">
              Systems Architect / java developer
            </p>

            {/* Divider */}
            <div className="glass-divider initial-hidden animate-fade-in delay-4" />

            {/* Bio */}
            <p className="text-center text-white/35 text-sm leading-relaxed mb-8 initial-hidden animate-fade-in delay-5">
              watchdemo.
              <br />
              .
            </p>

            {/* Social Links */}
            <div className="flex justify-center gap-3 flex-wrap initial-hidden animate-fade-in delay-6">
              {socialLinks.map((link) => (
                <SocialLink
                  key={link.label}
                  href={link.href}
                  icon={link.icon}
                  label={link.label}
                />
              ))}
            </div>

            {/* Equalizer */}
            <div className="mt-8 initial-hidden animate-fade-in delay-6">
              <AudioVisualizer />
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-white/15 text-xs mt-10 tracking-widest uppercase initial-hidden animate-fade-in delay-6">
            © 2026 — kolyamips
          </p>
        </div>
      </div>
    </>
  );
}
