import React, { useEffect, useRef, useState, SyntheticEvent } from 'react';

interface SeamlessVideoProps {
  src: string;
}

export function SeamlessVideo({ src }: SeamlessVideoProps) {
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState<'v1' | 'v2'>('v1');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video1 = videoRef1.current;
    const video2 = videoRef2.current;
    if (!video1 || !video2) return;

    // Reset state on src change
    setActiveVideo('v1');
    video1.currentTime = 0;
    video2.currentTime = 0;

    // Pre-play attempts to bypass browser autoplay issues
    const playPromises1 = video1.play();
    if (playPromises1 !== undefined) {
      playPromises1.catch(() => {
        // Safe catch for autoplay restrictions
      });
    }

    const handleTimeUpdate = () => {
      const active = activeVideo === 'v1' ? video1 : video2;
      const next = activeVideo === 'v1' ? video2 : video1;

      const duration = active.duration;
      if (duration && !isNaN(duration) && duration > 1) {
        // Crossfade starting 0.6 seconds before the video ends
        if (active.currentTime >= duration - 0.6) {
          if (next.paused) {
            next.currentTime = 0;
            const playPromise = next.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  setActiveVideo(activeVideo === 'v1' ? 'v2' : 'v1');
                })
                .catch(() => {
                  // Safe catch if browser blocks play
                });
            }
          }
        }
      }
    };

    // If one video ends and for some reason the timeupdate didn't catch it, fallback transition
    const handleEnded = () => {
      const active = activeVideo === 'v1' ? video1 : video2;
      const next = activeVideo === 'v1' ? video2 : video1;
      next.currentTime = 0;
      next.play()
        .then(() => {
          setActiveVideo(activeVideo === 'v1' ? 'v2' : 'v1');
        })
        .catch(() => {
          // Native loop fallback if blocked
          active.currentTime = 0;
          active.play().catch(() => {});
        });
    };

    video1.addEventListener('timeupdate', handleTimeUpdate);
    video2.addEventListener('timeupdate', handleTimeUpdate);
    video1.addEventListener('ended', handleEnded);
    video2.addEventListener('ended', handleEnded);

    return () => {
      video1.removeEventListener('timeupdate', handleTimeUpdate);
      video2.removeEventListener('timeupdate', handleTimeUpdate);
      video1.removeEventListener('ended', handleEnded);
      video2.removeEventListener('ended', handleEnded);
    };
  }, [activeVideo, src]);

  // Handle explicit loading / playing
  const handleCanPlay = (e: SyntheticEvent<HTMLVideoElement>) => {
    setIsReady(true);
    const video = e.currentTarget;
    video.play().catch(() => {});
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#030206] overflow-hidden">
      
      {/* INSTANT HIGH-END COSMIC AMBIENT BACKDROP (0kb / 0ms delay) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
        {/* Deep Violet Blob */}
        <div className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-950/30 filter blur-[120px] sm:blur-[160px] animate-drift-slow" />
        
        {/* Celestial Blue Blob */}
        <div className="absolute -bottom-[10%] -right-[10%] w-[65%] h-[65%] rounded-full bg-blue-950/35 filter blur-[120px] sm:blur-[170px] animate-drift-slower" />
        
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/80" />
      </div>

      {/* Video Buffer 1 */}
      <video
        ref={videoRef1}
        src={src}
        autoPlay
        muted
        playsInline
        preload="auto"
        onCanPlay={handleCanPlay}
        onLoadedData={() => setIsReady(true)}
        referrerPolicy="no-referrer"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] pointer-events-none select-none z-10 ${
          isReady && activeVideo === 'v1' ? 'opacity-[0.85]' : 'opacity-0'
        }`}
      />
      {/* Video Buffer 2 */}
      <video
        ref={videoRef2}
        src={src}
        autoPlay
        muted
        playsInline
        preload="auto"
        onCanPlay={handleCanPlay}
        onLoadedData={() => setIsReady(true)}
        referrerPolicy="no-referrer"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] pointer-events-none select-none z-10 ${
          isReady && activeVideo === 'v2' ? 'opacity-[0.85]' : 'opacity-0'
        }`}
      />

      {/* Subtle overlay to integrate video and background style perfectly */}
      <div className="absolute inset-0 bg-black/5 backdrop-blur-[0.5px] z-20 pointer-events-none select-none" />
    </div>
  );
}
