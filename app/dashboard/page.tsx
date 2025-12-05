"use client";

import { useState } from "react";

export default function Dashboard() {
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addLine = (txt: string) => {
    setTerminalLines(prev => [...prev, txt]);
  };

  const runScan = async () => {
    setLoading(true);
    setTerminalLines([]);

    addLine(`[+] Memulai scan untuk: ${target}`);

    try {
      const req = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });

      const data = await req.json();

      if (data.error) {
        addLine(`[!] Error: ${data.error}`);
        setLoading(false);
        return;
      }

      addLine(`[+] IP: ${data.ip}`);
      addLine(`[+] Status Code: ${data.status}`);

      addLine("[+] Detected Technologies:");
      if (data.tech.length === 0) addLine("   - None");
      data.tech.forEach((t: string) => addLine("   - " + t));

      addLine("[+] Headers:");
      Object.entries(data.headers).forEach(([k, v]) =>
        addLine(`   - ${k}: ${v}`)
      );

      addLine("[+] Subdomain ditemukan:");
      if (data.subdomains.length === 0) addLine("   - None");
      data.subdomains.forEach((s: string) => addLine("   - " + s));

      addLine("[✓] Scan selesai!");
    } catch (err: any) {
      addLine("[!] ERROR: " + err);
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen text-white p-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black via-black to-pink-900/30 animate-gradientFlow"></div>

      <h1 className="text-4xl font-bold text-center mb-6 text-pink-400 tracking-wide animate-flicker">
        NatSec Tools
      </h1>

      <div className="max-w-xl mx-auto bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl">
        <input
          type="text"
          placeholder="Masukkan target: contoh.com"
          className="w-full p-3 rounded-xl bg-black/40 border border-pink-500/40
          focus:outline-pink-500 focus:ring-2 focus:ring-pink-500/40 transition"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          disabled={loading}
        />

        <button
          className="relative overflow-hidden w-full mt-4 py-3 rounded-xl font-bold 
          bg-pink-500 hover:bg-pink-400 transition group"
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
        >
          <span className="absolute inset-0 bg-white/20 scale-0 group-active:scale-150 rounded-full transition-transform duration-300"></span>
          {loading ? "Scanning..." : "Start Scan"}
        </button>

        <div className="mt-6 bg-black/70 p-4 rounded-xl border border-pink-500/30 
        h-64 overflow-y-auto font-mono text-sm shadow-inner">
          {terminalLines.map((line, i) => (
            <p
              key={i}
              className="text-pink-200 drop-shadow"
              style={{ textShadow: "0 0 6px rgba(255,120,170,0.6)" }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center 
        bg-black/70 backdrop-blur-lg animate-fade">
          <div className="bg-white/10 border border-pink-500/40 p-6 rounded-2xl 
          max-w-sm w-full shadow-xl">
            <h2 className="text-xl font-bold text-pink-300 mb-3">Konfirmasi</h2>
            <p className="text-pink-100 mb-4">
              Yakin ingin mulai scan pada target ini?
            </p>

            <button
              className="w-full py-3 bg-pink-500 rounded-xl hover:bg-pink-400 mb-3 font-bold"
              onClick={() => {
                setIsModalOpen(false);
                runScan();
              }}
            >
              Mulai Scan
            </button>

            <button
              className="w-full py-3 bg-white/20 rounded-xl font-bold"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
