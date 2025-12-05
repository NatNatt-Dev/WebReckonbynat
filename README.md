# WebReckonbynat

> Toolkit kecil untuk melakukan reconnaissance ringan pada sebuah website.  
> Dibuat dengan Next.js untuk keperluan edukasi dan testing pribadi.

## 🔍 Deskripsi
WebReckon adalah web scanner sederhana berbasis **Next.js** yang dapat melakukan pengecekan cepat terhadap sebuah domain.  
Tujuan utamanya adalah mendeteksi informasi dasar yang biasanya digunakan saat melakukan recon awal pada penetration testing, seperti:

- Resolusi IP
- Header respons
- Teknologi yang terdeteksi (Cloudflare, Vercel, Next.js, dll)
- Subdomain sederhana dari wordlist bawaan


## 🖼 Preview
![Preview 1](/preview1.png)
![Preview 2](/preview2.png)

## ⚙ Fitur Utama
- Resolusi **IP Address** target
- Fetch **HTTP Headers**
- Deteksi teknologi berdasarkan header
- Scan **subdomain** menggunakan wordlist internal
- API route menggunakan Next.js Edge/Server Functions
- Tampilan UI modern dan mudah dipakai

## 📦 Cara Install
```bash
git clone https://github.com/NatNatt-Dev/WebReckonbynat.git
cd webreckon
npm install
npm run dev
