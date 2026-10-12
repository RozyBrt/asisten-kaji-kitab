# Rencana Strategis & Rasional Integrasi Kitab Al-Kawakib Ad-Durriyyah (Pilar Ke-4 RAG)

Dokumen ini menjelaskan latar belakang, alasan akademis, arsitektur teknis, dan strategi integrasi Kitab **Al-Kawakib Ad-Durriyyah Syarah Mutammimah Al-Jurumiyyah** ke dalam basis pengetahuan lokal (*Knowledge Base RAG*) sistem **Asisten AI Kaji Kitab & Turats**.

---

## 1. Latar Belakang & Konteks Riset
Dalam persiapan Lomba Karya Ilmiah tingkat pesantren/dayah, tim penulis telah merampungkan naskah penelitian setebal 284 halaman yang mengkaji secara komprehensif literatur gramatika Arab klasik, yaitu:
* **Judul Karya:** *Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah Al-Jurumiyyah*
* **Penulis:** Iswandi El-Nisamy
* **Editor/Pengasuh:** Tgk. Dr. Safriadi, MA. (Mudir Dayah Raudhatul Ma'arif)
* **Karya Asli Rujukan:**
  1. *Mutammimah Al-Jurumiyyah* karya Al-Imam Syamsuddin Muhammad bin Muhammad bin 'Abdirrahman Al-Hatthab Ar-Ra'iniy (902–945 H).
  2. *Al-Kawakib Ad-Durriyyah* karya Al-Imam Muhammad bin Ahmad bin 'Abdil Bari Al-Ahdal (1241–1298 H).

---

## 2. Mengapa Kitab Ini Perlu Diintegrasikan ke Sistem? (Rasional Strategis)

### A. Sinkronisasi Mutlak Antara Naskah Makalah dan Aplikasi Produk
* **Tantangan Umum Lomba:** Seringkali dewan juri menemukan bahwa "aplikasi yang dibuat" tidak ada hubungannya dengan "naskah karya ilmiah yang ditulis" (aplikasi hanya bersifat chatbot umum generik).
* **Solusi Kami:** Dengan memasukkan naskah kajian Dayah Raudhatul Ma'arif ini ke dalam basis pengetahuan RAG, aplikasi software kita menjadi **bukti nyata implementasi digital** dari karya tulis tim peneliti. Juri akan melihat integrasi 100% antara teori di naskah dan praktik di aplikasi.

### B. Membangun "4 Pilar Kurikulum Lengkap Turats Pesantren"
Sebelumnya, sistem telah memiliki 3 kitab bawaan yang mewakili Fikih dan Akhlak. Dengan masuknya Al-Kawakib Ad-Durriyyah, sistem kini memiliki **4 Pilar Kurikulum Pesantren yang Paripurna**:
1. 📗 **Matan Safinatun Najah:** Pilar Fikih Ibadah Dasar (*Wudhu, Shalat, Puasa, Zakat*).
2. 📗 **Fathul Qarib al-Mujib:** Pilar Fikih Mazhab Syafi'i Madya (*Thaharah, Najis, Jamaah, Mu'amalah*).
3. 📗 **Ta'limul Muta'allim:** Pilar Adab, Akhlak, dan Metode Belajar Santri.
4. 📘 **Al-Kawakib Ad-Durriyyah:** **Pilar Gramatika Bahasa Arab (Ilmu Nahwu & Sharaf)** &mdash; Kunci utama membaca dan memahami seluruh literatur kitab kuning (Miftah al-Kutub).

### C. Mengatasi Kendala Teknis Berkas Tebal (284 Halaman)
* **Masalah:** Jika santri atau juri diminta mengunggah file PDF 284 halaman secara manual saat presentasi, server lokal berisiko terkena *rate-limit* API, waktu *indexing* lama (bisa memakan waktu beberapa menit), atau terkendala batas keamanan unggah.
* **Solusi:** Seluruh intisari 19 bab dari buku 284 halaman tersebut **ditanam dan di-vektorisasi terlebih dahulu di belakang layar (*pre-indexed*)**.
  * Hasil pencarian vektor instan (< 100 milidetik).
  * Ukuran file `.vector-store.json` tetap sangat hemat (di bawah 1 MB).
  * Tidak ada risiko kegagalan koneksi saat demonstrasi langsung di depan juri.

### D. Otomatis Dilindungi Sistem (Lencana 🔒 Kitab Inti)
Kitab ini akan didaftarkan ke dalam konstanta `PROTECTED_DOC_IDS` di sistem:
* Tidak akan memiliki tombol hapus (*trash icon*) di tampilan antarmuka web.
* Memiliki lencana perlindungan hijau **`🔒 Kitab Inti`**.
* Backend API secara otomatis menolak permintaan hapus (`403 Forbidden`).

---

## 3. Rincian Materi 19 Bab yang Akan Diindeks ke Vector Store

Data yang telah diekstrak dari naskah mencakup seluruh bab krusial ilmu Nahwu:
1. **Bab Kalam & Pembagian Kalimat:** Syarat kalam (Lafaz, Murakkab, Mufid, Wadh'u), tanda-tanda Isim, Fi'il, Huruf, dan 10 macam tanwin.
2. **Bab I'rab dan Bina':** Pembagian mu'rab & mabni, 4 sebab isim serupa dengan huruf, 6 isim mabni, serta hukum bina fi'il dan huruf.
3. **Bab Mengenal Tanda-Tanda I'rab:** Rincian lengkap 4 tanda Rafa', 5 tanda Nasab, 3 tanda Khafadh/Jar, dan 3 tanda Jazam.
4. **Fasal I'rab dengan Harkat vs Huruf:** Asma'ul Khamsah/Sittah, Af'alul Khamsah, Tatsniyah, Jamak Mudzakkar & Muannats Salim.
5. **Fasal Harkat Taqdiran:** Isim Maqshur, Isim Manqush, Mudhaf ke Ya' Mutakallim, dan Fi'il Mu'tal.
6. **Fasal Isim Ghairu Munsharif (Tegah Sharaf):** Rincian 9 'illat (Muntahal Jumu', Wazan Fi'il, 'Adal, Ta'nits, 'Alamiyah, Tarkib Majzi, Ziyadah Alif-Nun, 'Ajamiyah, Shifat).
7. **Bab Nakirah dan Ma'rifah:** Definisi nakirah, serta 7 kategori isim ma'rifah.
8. **Fasal Isim Dhamir:** Dhamir Mustatir (Wajib/Jawaz) dan Dhamir Bariz (Muttashil/Munfashil).
9. **Fasal Isim 'Alam:** 'Alam Syakhsi, 'Alam Jinsi, Isim, Kuniyah, Laqab.
10. **Fasal Isim Isyarah & Maushul:** Isyarah dekat/jauh, Maushul Harfi & Ismi, Syarat Shilah dan 'Aa'id.
11. **Fasal Alat Ma'rifah (Alif-Lam):** Pembagian Al-Ahdiyah dan Al-Jinsiyah.
12. **Bab Isim-Isim yang Marfu' (Marfu'atul Asma'):** Fa'il, Naib Fa'il, Mubtada' & Khabar, serta Amil Nawasikh (Kana, Inna, Zhanna, Serupa Laisa, Fi'il Muqarabah, La Nafi Jinsi).
13. **Bab Isim-Isim yang Manshub (Manshubatul Asma'):** Maf'ul Bih, Isytighal, Munada, Maf'ul Muthlaq, Dzaraf, Maf'ul Min Ajlih, Maf'ul Ma'ah, Hal, Tamyiz, dan Istitsna'.
14. **Bab Isim-Isim yang Majrur:** Majrur bil Harfi dan Majrur bil Idhafah.
15. **Bab I'rab Fi'il:** Amil Nawashib dan Jawazim pada fi'il mudhari'.
16. **Bab Tawabi' (Pengikut I'rab):** Na'at, 'Athaf (Bayan & Nasaq), Taukid (Lafzhi & Ma'nawi), dan Badal.
17. **Bab Lanjutan:** Isim beramal seperti fi'il, Tanazu', Ta'ajjub, 'Adad (bilangan), dan Kaidah Waqaf.

---

## 4. Rencana Langkah Eksekusi Teknis

1. **Penyusunan Skrip Seeder:**
   Menambahkan chunking terstruktur dari 19 bab ini dengan menyertakan teks kaidah ringkas berbahasa Indonesia & teks Arab istilah nahwunya.
2. **Generasi Vektor Asli via API:**
   Setiap chunk akan dibuatkan embedding vektor resminya (`text-embedding-3-small`) agar sistem RAG dapat melakukan pencarian kemiripan (*semantic search*).
3. **Pendaftaran Dokumen ke Daftar Proteksi:**
   Mendaftarkan id `al-kawakib-ad-durriyyah` ke daftar `PROTECTED_DOC_IDS` di [UploadUI.tsx](file:///d:/Documents/asisten-kaji-kitab/src/components/UploadUI.tsx), [route.ts](file:///d:/Documents/asisten-kaji-kitab/src/app/api/rag/route.ts), dan [vectorStore.ts](file:///d:/Documents/asisten-kaji-kitab/src/lib/vectorStore.ts).
4. **Verifikasi Web:**
   Memastikan tabel Dokumen Terindeks di web langsung menampilkan total **4 Dokumen** dengan status `🔒 Kitab Inti`.
5. **Pengujian Chat AI:**
   Menguji pertanyaan nahwu (misal: tentang isim ghairu munsharif atau tanda i'rab) di menu Kaji Kitab untuk memastikan AI merujuk langsung ke *Al-Kawakib Ad-Durriyyah*.

---

*Disiapkan untuk Tim Peneliti & Pengembang Aplikasi Asisten Kaji Kitab & Turats &bull; Oktober 2026*
