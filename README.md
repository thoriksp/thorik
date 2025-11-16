# 💰 Budget Tracker Harian

Budget tracker modern dengan fitur lengkap untuk mengelola keuangan harian Anda.

## ✨ Fitur

- 💾 **Persistent Storage** - Data tersimpan otomatis
- ⚡ **Input Cepat** - Masukkan banyak transaksi sekaligus
- 📊 **Grafik Mingguan** - Visualisasi pemasukan & pengeluaran
- 🥧 **Pie Chart** - Breakdown pengeluaran per kategori
- 🎯 **Target Budget** - Monitor pengeluaran tetap
- 🚨 **Alert System** - Notifikasi saat mendekati/melewati budget
- 🔍 **Search & Filter** - Cari dan filter transaksi
- 📥 **Export Excel** - Export data ke CSV
- 📱 **Mobile Responsive** - Optimal di semua perangkat
- ✨ **Animasi** - Feedback visual yang menarik

## 🚀 Cara Install

1. Clone repository:
```bash
git clone <repository-url>
cd budget-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan development server:
```bash
npm run dev
```

4. Buka browser di `http://localhost:3000`

## 📦 Build untuk Production

```bash
npm run build
```

File production akan ada di folder `dist/`

## 🌐 Deploy ke Vercel

1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Vercel akan otomatis detect Vite project
4. Deploy!

## ⚠️ PENTING: Storage API

Karena menggunakan `window.storage` API dari Claude.ai, untuk production deployment Anda perlu:

**Ganti storage implementation** di `BudgetTracker.jsx`:

```javascript
// Ganti ini (Claude.ai storage):
await window.storage.get('transactions')
await window.storage.set('transactions', data)

// Dengan localStorage (untuk web biasa):
localStorage.getItem('transactions')
localStorage.setItem('transactions', data)
```

Atau gunakan library seperti:
- IndexedDB
- localForage
- Supabase
- Firebase

## 📥 Download ZIP

Untuk membuat ZIP file:
1. Copy semua file di atas ke folder `budget-tracker/`
2. Compress folder menjadi `budget-tracker.zip`
3. Extract dan jalankan `npm install`
