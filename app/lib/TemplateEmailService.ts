export type TemplateId =
  | "promo"
  | "fitur"
  | "transaksi"
  | "sistem"
  | "informasi"
  | "universal";

export interface EmailTemplate {
  idTemplate: TemplateId;
  label: string;
  icon: string;
  subject: string;
  message: string;
}

export const EMAIL_TEMPLATE: EmailTemplate[] = [
  // Promo
  {
    idTemplate: "promo",
    label: "Promo",
    icon: "Megaphone",
    subject: "🎉 Promo Spesial untuk Anda! Jangan Sampai Terlewat",
    message: `
        Kami dengan senang hati menghadirkan promo spesial untuk Anda.

Nikmati penawaran berupa [deskripsi promo, misalnya: diskon 30%, cashback, atau bonus eksklusif] yang berlaku hingga [tanggal berakhir].

Gunakan kode promo berikut saat melakukan transaksi:
[KODEPROMO]

Jangan lewatkan kesempatan ini untuk mendapatkan manfaat lebih dari layanan MyFinanceKu.

Jika Anda memiliki pertanyaan atau membutuhkan bantuan, jangan ragu untuk menghubungi kami.

Terima kasih atas kepercayaan Anda.

Hormat Kami,
Tim MyFinanceKu`,
  },

  //   Fitur
  {
    idTemplate: "fitur",
    label: "Fitur   ",
    icon: "Star",
    subject: "✨ Fitur Baru Telah Hadir untuk Anda!",
    message: `
Kami dengan senang hati menginformasikan bahwa fitur terbaru kami, yaitu [Nama Fitur], kini telah tersedia untuk Anda.

Melalui fitur ini, Anda dapat:
- [Manfaat 1]
- [Manfaat 2]
- [Manfaat 3]

Untuk mulai menggunakan fitur ini, silakan ikuti langkah berikut:
1. Masuk ke akun MyFinanceKu Anda
2. Buka menu [Nama Menu / Navigasi]
3. Pilih fitur [Nama Fitur]
4. Ikuti petunjuk yang tersedia pada halaman tersebut

Atau Anda dapat langsung mengakses melalui tautan berikut:
[Link]

Kami berharap fitur ini dapat membantu Anda mengelola keuangan dengan lebih mudah dan efisien.

Jika Anda memiliki pertanyaan atau membutuhkan bantuan, jangan ragu untuk menghubungi kami.

Terima kasih atas kepercayaan Anda.

Hormat Kami,
MyFinanceKu`,
  },

  //   Sistem
  {
    idTemplate: "sistem",
    label: "Sistem",
    icon: "AlertTriangle",
    subject: "Pemberitahuan Pemeliharaan Sistem",
    message: `
Kami ingin memberitahukan bahwa akan dilakukan pemeliharaan sistem untuk meningkatkan kualitas layanan MyFinanceKu.

Detail pemeliharaan:
Tanggal: [Tanggal]  
Waktu: [Waktu]  

Selama periode tersebut, beberapa atau seluruh layanan mungkin tidak dapat diakses untuk sementara waktu.

Kami menyarankan Anda untuk memastikan aktivitas penting telah diselesaikan sebelum waktu pemeliharaan dimulai.

Kami mohon maaf atas ketidaknyamanan yang mungkin terjadi dan sangat menghargai pengertian Anda.

Jika Anda memiliki pertanyaan, silakan hubungi tim dukungan kami.

Hormat Kami,
MyFinanceKu`,
  },

  // Transaksi
  {
    idTemplate: "transaksi",
    label: "Transaksi",
    icon: "AlertTriangle",
    subject: "Konfirmasi Transaksi MyFinanceKu",
    message: `
Terima kasih. Transaksi Anda telah berhasil diproses.

Berikut adalah detail transaksi Anda:
- ID Transaksi: [ID]
- Tanggal: [Tanggal]
- Jumlah: [Nominal]
- Metode Pembayaran: [Metode]

Anda dapat melihat riwayat transaksi secara lengkap melalui aplikasi MyFinanceKu.

Jika Anda merasa tidak melakukan transaksi ini atau memiliki pertanyaan, segera hubungi tim dukungan kami.

Terima kasih atas kepercayaan Anda dalam menggunakan MyFinanceKu.
Hormat Kami,
MyFinanceKu`,
  },

  //   Informasi
  {
    idTemplate: "informasi",
    label: "Informasi",
    icon: "Mail",
    subject: "Informasi Terbaru",
    message: `
Kami ingin menyampaikan informasi terbaru terkait:

[Judul Informasi]

[Isi penjelasan lengkap informasi]

Ringkasan informasi:
- [Poin penting 1]
- [Poin penting 2]
- [Poin penting 3]

Silakan lakukan penyesuaian yang diperlukan sesuai dengan informasi di atas.

Jika Anda membutuhkan bantuan lebih lanjut atau memiliki pertanyaan, silakan hubungi tim dukungan kami.

Terima kasih atas perhatian dan kepercayaan Anda.

Hormat Kami,
MyFinanceKu`,
  },

  //   Universal
  {
    idTemplate: "universal",
    label: "Universal",
    icon: "Mail",
    subject: "Informasi",
    message: `
Kami ingin menyampaikan informasi berikut:

[Isi pesan utama]

Untuk informasi lebih lanjut, silakan merujuk pada detail berikut:
- [Poin tambahan / penjelasan 1]
- [Poin tambahan / penjelasan 2]

Jika Anda perlu melakukan tindakan tertentu, silakan ikuti instruksi yang telah kami sampaikan di atas.

Apabila Anda memiliki pertanyaan atau membutuhkan bantuan, jangan ragu untuk menghubungi tim dukungan kami.

Terima kasih atas perhatian Anda.
Hormat Kami,
MyFinanceKu`,
  },
];
