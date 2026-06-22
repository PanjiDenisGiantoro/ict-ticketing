-- Buat database ticketing
CREATE DATABASE IF NOT EXISTS ticketing
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ticketing;

-- Tabel kendala
CREATE TABLE IF NOT EXISTS kendala (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id VARCHAR(20) NOT NULL UNIQUE,
  tanggal DATE NOT NULL,
  jam TIME NOT NULL,
  nama_pelapor VARCHAR(100) NOT NULL,
  departemen VARCHAR(100) NOT NULL,
  aplikasi VARCHAR(100) NOT NULL,
  tipe VARCHAR(50) NOT NULL DEFAULT '',
  kategori VARCHAR(100) NOT NULL DEFAULT '',
  prioritas ENUM('HIGH', 'MEDIUM', 'LOW') NOT NULL DEFAULT 'MEDIUM',
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT NOT NULL,
  langkah TEXT,
  status ENUM('OPEN', 'IN PROGRESS', 'RESOLVED', 'ESCALATED', 'CLOSED') NOT NULL DEFAULT 'OPEN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel aplikasi
CREATE TABLE IF NOT EXISTS master_aplikasi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode VARCHAR(10) NOT NULL UNIQUE,
  nama VARCHAR(100) NOT NULL,
  tipe VARCHAR(50) NOT NULL DEFAULT '',
  pic VARCHAR(100) NOT NULL DEFAULT '',
  status ENUM('Aktif', 'Maintenance', 'Nonaktif') NOT NULL DEFAULT 'Aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel departemen
CREATE TABLE IF NOT EXISTS master_departemen (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode VARCHAR(10) NOT NULL UNIQUE,
  nama VARCHAR(100) NOT NULL,
  atasan VARCHAR(100) NOT NULL DEFAULT '',
  total_staff INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel kategori
CREATE TABLE IF NOT EXISTS master_kategori (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL UNIQUE,
  prioritas_default ENUM('HIGH', 'MEDIUM', 'LOW') NOT NULL DEFAULT 'MEDIUM',
  sla VARCHAR(20) NOT NULL DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Data sample master_aplikasi
INSERT INTO master_aplikasi (kode, nama, tipe, pic, status) VALUES
('LST', 'LST_CASE Mobile', 'Mobile', 'Tim Mobile', 'Aktif'),
('HRIS', 'HRIS Web', 'Web', 'Tim HRIS', 'Aktif'),
('ECL', 'E-CLAIM Web', 'Web', 'Tim Finance', 'Aktif'),
('EML', 'EMAIL Microsoft 365', 'SaaS', 'Tim IT', 'Aktif'),
('VPN', 'VPN Client', 'Network', 'Tim Infrastruktur', 'Aktif'),
('SAP', 'SAP ERP', 'Enterprise', 'Tim SAP', 'Maintenance');

-- Data sample master_departemen
INSERT INTO master_departemen (kode, nama, atasan, total_staff) VALUES
('ICT', 'ICT Ticketing', 'Manager ICT', 5),
('FIN', 'Finance', 'Manager Finance', 12),
('OPS', 'Operational', 'Manager Ops', 28),
('MKT', 'Marketing', 'Manager Marketing', 8),
('HRD', 'HRD', 'Manager HRD', 10),
('ITS', 'IT Support', 'Manager IT', 7),
('ACC', 'Accounting', 'Manager Accounting', 6),
('PRC', 'Procurement', 'Manager Procurement', 4);

-- Data sample master_kategori
INSERT INTO master_kategori (nama, prioritas_default, sla) VALUES
('Login / Autentikasi', 'HIGH', '1 jam'),
('Tampilan / UI Error', 'MEDIUM', '4 jam'),
('Upload / Download File', 'MEDIUM', '4 jam'),
('Koneksi / Jaringan', 'HIGH', '1 jam'),
('Data Tidak Tampil', 'MEDIUM', '4 jam'),
('Email Tidak Terkirim', 'HIGH', '2 jam'),
('Performa Lambat', 'LOW', '24 jam'),
('Bug / Error Sistem', 'HIGH', '1 jam'),
('Lainnya', 'MEDIUM', '8 jam');

-- Data sample kendala
INSERT INTO kendala (ticket_id, tanggal, jam, nama_pelapor, departemen, aplikasi, tipe, kategori, prioritas, judul, deskripsi, status) VALUES
('ICT-2025-00128', '2025-04-28', '10:24:00', 'AJ ZARKASIH', 'ICT Ticketing', 'LST_CASE', 'Mobile', 'Login / Autentikasi', 'HIGH', 'Tidak bisa login aplikasi LST_CASE Mobile', 'Tidak bisa login ke aplikasi LST_CASE Mobile sejak pagi ini. Sudah coba reset password tetapi tetap gagal.', 'IN PROGRESS'),
('ICT-2025-00127', '2025-04-28', '09:45:00', 'SRI WAHYUNI', 'Finance', 'HRIS', 'Web', 'Data Tidak Tampil', 'MEDIUM', 'Data tidak tampil pada halaman laporan', 'Halaman laporan keuangan tidak menampilkan data bulan April.', 'IN PROGRESS'),
('ICT-2025-00126', '2025-04-28', '09:15:00', 'BAMBANG S.', 'Operational', 'E-CLAIM', 'Web', 'Upload / Download File', 'MEDIUM', 'Gagal upload dokumen claim', 'Setiap kali upload file PDF di halaman E-Claim, muncul error timeout.', 'RESOLVED'),
('ICT-2025-00125', '2025-04-27', '16:30:00', 'NUR FITRI', 'Marketing', 'EMAIL', 'Microsoft 365', 'Email Tidak Terkirim', 'LOW', 'Tidak bisa mengirim email', 'Email yang dikirim ke external selalu bounce back.', 'RESOLVED'),
('ICT-2025-00124', '2025-04-27', '14:10:00', 'EDY SUSANTO', 'IT Support', 'VPN', 'Client', 'Koneksi / Jaringan', 'HIGH', 'Koneksi VPN sering terputus', 'VPN terputus setiap 10-15 menit sejak kemarin.', 'IN PROGRESS'),
('ICT-2025-00123', '2025-04-27', '11:05:00', 'DEWI RAHAYU', 'HRD', 'HRIS', 'Web', 'Bug / Error Sistem', 'HIGH', 'Tidak bisa mengakses modul cuti', 'Modul cuti HRIS menampilkan error 500 saat dibuka.', 'ESCALATED'),
('ICT-2025-00122', '2025-04-26', '15:20:00', 'RENDI PRATAMA', 'Finance', 'E-CLAIM', 'Web', 'Bug / Error Sistem', 'MEDIUM', 'Error saat submit klaim', 'Halaman submit klaim menunjukkan error validation padahal semua field sudah diisi.', 'RESOLVED'),
('ICT-2025-00121', '2025-04-26', '10:00:00', 'LINDA SARI', 'Operational', 'LST_CASE', 'Mobile', 'Bug / Error Sistem', 'HIGH', 'Aplikasi crash saat buka menu pengiriman', 'Aplikasi LST_CASE crash setiap membuka menu pengiriman di Android.', 'IN PROGRESS');