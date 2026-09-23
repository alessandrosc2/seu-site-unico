"use client";

import React from "react";

const Globe: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`relative flex items-center justify-center ${className || ""}`}>
      <style>
        {`
          @keyframes earthRotate {
            0% { background-position: 0px 0; }
            100% { background-position: 1000px 0; }
          }
          @keyframes twinkling { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-slow { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-long { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-fast { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
        `}
      </style>
      
      {/* 3D Photorealistic Earth Sphere */}
      <div
        className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] rounded-full overflow-hidden shadow-[0_0_60px_rgba(56,189,248,0.4),-8px_0_16px_#38bdf8_inset,25px_4px_40px_#070d1e_inset,-35px_-4px_50px_#38bdf888_inset,280px_0_70px_#00000099_inset,180px_0_50px_#000000ee_inset]"
        style={{
          backgroundImage: "url('https://cdn.21st.dev/assets/mirror/f2/f2fe23d0c6a8406962e4c5ef969e13dc9de3faf37d3e7258a1067173325b254f.jpg')",
          backgroundSize: "auto 100%",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "0 0",
          animation: "earthRotate 32s linear infinite",
        }}
      >
        {/* Glowing Atmosphere Halo */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/30 via-transparent to-blue-600/35 pointer-events-none ring-1 ring-cyan-400/50" />

        {/* Twinkling ambient stars */}
        <div className="absolute left-[-20px] w-1 h-1 bg-white rounded-full" style={{ animation: "twinkling 3s infinite" }} />
        <div className="absolute left-[-40px] top-[30px] w-1 h-1 bg-white rounded-full" style={{ animation: "twinkling-slow 2s infinite" }} />
        <div className="absolute left-[350px] top-[90px] w-1 h-1 bg-white rounded-full" style={{ animation: "twinkling-long 4s infinite" }} />
        <div className="absolute left-[200px] top-[290px] w-1 h-1 bg-white rounded-full" style={{ animation: "twinkling 3s infinite" }} />
        <div className="absolute left-[50px] top-[270px] w-1 h-1 bg-white rounded-full" style={{ animation: "twinkling-fast 1.5s infinite" }} />
        <div className="absolute left-[250px] top-[-50px] w-1 h-1 bg-white rounded-full" style={{ animation: "twinkling-long 4s infinite" }} />
        <div className="absolute left-[290px] top-[60px] w-1 h-1 bg-white rounded-full" style={{ animation: "twinkling-slow 2s infinite" }} />
      </div>
    </div>
  );
};

export default Globe;
