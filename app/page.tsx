"use client";

import React, { useEffect, useRef, useState } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const heartCount = 25;
    let hearts: { x: number; y: number; size: number; dy: number; alpha: number }[] = [];

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      hearts = [];

      for (let i = 0; i < heartCount; i++) {
        hearts.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 16 + 8,
          dy: Math.random() * 0.3 + 0.05,
          alpha: Math.random() * 0.25 + 0.1,
        });
      }
    };

    init();
    window.addEventListener("resize", init);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = "blur(1.5px)";

      hearts.forEach((h) => {
        const { x, y, size } = h;
        ctx.beginPath();
        ctx.moveTo(x, y);

        ctx.bezierCurveTo(x, y - size / 2, x - size, y - size / 2, x - size, y);
        ctx.bezierCurveTo(x - size, y + size / 2, x, y + size, x, y + size * 1.5);
        ctx.bezierCurveTo(x, y + size, x + size, y + size / 2, x + size, y);
        ctx.bezierCurveTo(x + size, y - size / 2, x, y - size / 2, x, y);

        ctx.closePath();
        ctx.fillStyle = `rgba(255, 180, 210, ${h.alpha})`;
        ctx.fill();

        h.y -= h.dy;
        h.x += Math.sin(h.y * 0.01) * 0.3;

        if (h.y < -size * 2) h.y = canvas.height + size * 2;
      });

      requestAnimationFrame(animate);
    };

    animate();
    return () => window.removeEventListener("resize", init);
  }, []);

  const handleStartScan = () => setShowModal(true);
  const handleAgree = () => (window.location.href = "/dashboard");
  const handleCancel = () => setShowModal(false);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 animate-gradient-x -z-20"></div>
      <canvas ref={canvasRef} className="absolute inset-0 -z-10"></canvas>
      <div className="absolute inset-0 bg-black/20 -z-5"></div>

      <header className="text-center mb-24 px-6">
        <h1 className="text-7xl md:text-8xl font-bold font-poppins text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-purple-200 tracking-wide drop-shadow-sm">
          NatSec Tools
        </h1>
        <p className="mt-4 text-xl md:text-2xl font-inter text-white/90">
          Automated Reconnaissance Suite by{" "}
          <span className="text-pink-200 font-semibold">Natasyadev</span>
        </p>
      </header>

      <section className="text-center px-6">
        <p className="mb-10 max-w-lg mx-auto font-inter text-white/85 text-lg md:text-xl leading-relaxed">
          Jalankan pemindaian lengkap: subdomain, direktori, framework, dan keamanan header secara otomatis.
        </p>

        <button
          onClick={handleStartScan}
          className="relative inline-flex items-center bg-pink-500 px-14 py-5 text-white font-semibold rounded-3xl shadow-xl hover:scale-105 transition-transform hover:bg-pink-600 active:scale-95"
        >
          <span className="relative z-10">Start Scan</span>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-3xl opacity-0 hover:opacity-40 transition-opacity"></div>
        </button>
      </section>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-modalPop relative">
            <div className="absolute inset-0 rounded-2xl bg-pink-200/20 blur-2xl"></div>

            <h2 className="relative text-2xl font-bold mb-4 text-pink-600">Peringatan</h2>
            <p className="relative text-gray-800 mb-6 leading-relaxed">
              Pastikan kamu memahami risiko dan menggunakan tool ini secara bertanggung jawab.
            </p>

            <div className="relative flex justify-center gap-4">
              <button
                onClick={handleAgree}
                className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition active:scale-95"
              >
                Setuju
              </button>

              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-400 transition active:scale-95"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 20s linear infinite;
        }

        @keyframes modalPop {
          0% { opacity: 0; transform: scale(0.92); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-modalPop {
          animation: modalPop 0.25s ease-out forwards;
        }

        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Poppins:wght@500;700&display=swap');
      `}</style>
    </main>
  );
}
