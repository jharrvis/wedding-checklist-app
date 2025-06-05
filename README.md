# 💍 Wedding Checklist App

Aplikasi checklist persiapan pernikahan yang komprehensif dan user-friendly untuk membantu merencanakan hari bahagia Anda dengan mudah dan terorganisir.

## 🚀 Fitur Utama

### ✨ Manajemen Kategori

- ➕ Tambah kategori baru dengan saran otomatis
- ✏️ Edit nama kategori
- 🗑️ Hapus kategori beserta semua tugasnya
- 📊 Progress tracking per kategori

### 📝 Manajemen Tugas

- ➕ Tambah tugas dengan saran berdasarkan kategori
- ✏️ Edit tugas yang sudah ada
- ✅ Centang tugas yang sudah selesai
- 🗑️ Hapus tugas dengan konfirmasi modal
- 📅 Tambah tanggal dan lokasi
- 📝 Catatan untuk setiap tugas

### 🎯 Sistem Prioritas

- 🟢 **Normal** - Tugas standar
- 🟡 **Penting** - Perlu perhatian khusus
- 🟠 **Sangat Penting** - Prioritas tinggi
- 🔴 **Urgent** - Mendesak dan harus segera dikerjakan

### 🚨 Tugas Urgent

- Tampilan khusus untuk tugas urgent
- Notifikasi visual dengan animasi pulse
- Sorting otomatis tugas urgent di bagian atas

### 📒 Sistem Catatan

- 📝 Catatan umum terpisah
- 📋 Catatan terkait tugas
- 🗂️ Organisasi catatan berdasarkan kategori
- 📅 Timestamp untuk semua catatan

### 📊 Statistik & Progress

- Total tugas keseluruhan
- Jumlah tugas yang sudah selesai
- Jumlah tugas urgent
- Progress bar visual
- Persentase penyelesaian

### 💾 Penyimpanan Data

- Data tersimpan di localStorage browser
- Tidak memerlukan database atau server
- Data persisten meski browser ditutup
- Fungsi reset untuk menghapus semua data

## 🎨 Desain & UX

### 📱 Responsive Design

- Tampil sempurna di desktop, tablet, dan mobile
- Grid layout yang adaptif
- Touch-friendly interface

### 🎭 Visual Design

- Gradient warna romantis (pink-purple theme)
- Animasi halus dan transisi smooth
- Card-based layout yang modern
- Priority flags dengan warna-warna intuitif

### ⌨️ Keyboard Shortcuts

- `Esc` - Tutup modal
- `Ctrl/Cmd + N` - Tambah kategori baru
- `Ctrl/Cmd + K` - Focus ke search
- `Ctrl/Cmd + S` - Export data

## 📁 Struktur File

```
wedding-checklist/
├── index.html              # File utama aplikasi
├── assets/
│   ├── css/
│   │   └── style.css       # Styling aplikasi
│   ├── js/
│   │   ├── app.js          # Logika aplikasi utama
│   │   └── data.js         # Data dan suggestions
│   └── images/
│       └── favicon.ico     # Icon aplikasi
├── README.md               # Dokumentasi
├── CHANGELOG.md            # Log perubahan
└── LICENSE                 # Lisensi
```

## 🛠️ Teknologi

- **HTML5** - Struktur dan semantik
- **CSS3** - Styling dengan Flexbox/Grid dan animasi
- **Vanilla JavaScript** - Logika aplikasi tanpa framework
- **localStorage API** - Penyimpanan data di browser
- **Responsive Design** - Mobile-first approach

## 🚀 Cara Menggunakan

### Instalasi

1. Clone atau download repository ini
2. Buka `index.html` di browser modern
3. Mulai menambahkan kategori dan tugas

### Quick Start

1. **Tambah Kategori**: Klik "➕ Tambah Kategori" atau pilih dari saran
2. **Tambah Tugas**: Klik "➕ Tugas" pada kategori, gunakan saran atau tulis sendiri
3. **Set Prioritas**: Pilih tingkat prioritas sesuai kebutuhan
4. **Tambah Detail**: Isi tanggal, lokasi, dan catatan (opsional)
5. **Track Progress**: Centang tugas yang sudah selesai

### Saran Kategori

Aplikasi menyediakan 20+ saran kategori siap pakai:

- Dekorasi & Bunga
- Catering & Makanan
- Undangan & Stationery
- Rias & Kecantikan
- Busana & Aksesoris
- Dokumentasi & Foto
- Venue & Lokasi
- Dan masih banyak lagi...

### Saran Tugas

Setiap kategori memiliki 15+ saran tugas yang relevan dan praktis, seperti:

- **Dekorasi**: Pilih tema, booking dekorator, setup lighting, dll.
- **Catering**: Test food, pilih menu, booking vendor, dll.
- **Undangan**: Design, cetak, RSVP system, dll.

## 📊 Fitur Analytics

### Progress Tracking

- Real-time progress calculation
- Visual progress bar
- Category-wise completion stats
- Priority-based task organization

### Task Management

- Smart sorting (urgent tasks first)
- Completion timestamps
- Task metadata (date, location, notes)
- Search and filter capabilities

## 🔧 Kustomisasi

### Menambah Kategori Baru

Edit file `assets/js/data.js` pada bagian `categorySuggestions`:

```javascript
const categorySuggestions = [
  "Kategori Existing",
  "Kategori Baru Anda",
  // ...
];
```

### Menambah Saran Tugas

Edit file `assets/js/data.js` pada bagian `taskSuggestions`:

```javascript
const taskSuggestions = {
  "kategori-baru": [
    "Tugas 1",
    "Tugas 2",
    // ...
  ],
};
```

## 🐛 Bug Reports & Feature Requests

Jika Anda menemukan bug atau memiliki ide fitur baru:

1. Buka GitHub Issues
2. Pilih template yang sesuai
3. Berikan deskripsi yang detail

## 🤝 Contributing

Kontribusi sangat diterima! Silakan:

1. Fork repository
2. Buat feature branch
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## 📝 License

MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 📞 Support

Untuk pertanyaan atau bantuan:

- 📧 Email: support@weddingchecklist.com
- 💬 Discord: Wedding Checklist Community
- 📱 Telegram: @WeddingChecklistApp

## ⭐ Acknowledgments

Terima kasih kepada:

- Komunitas wedding planner Indonesia
- Open source contributors
- Beta testers yang telah memberikan feedback

---

**Made with ❤️ for couples planning their special day**

_Version 2.0.0 - January 2025_
