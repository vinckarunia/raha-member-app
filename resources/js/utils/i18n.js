/**
 * Internationalization (i18n) Translations
 * 
 * Translation strings for English and Indonesian.
 * Base language is English, with Indonesian translations available.
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha DBAJ Development Team
 */

/**
 * Translations Object
 * 
 * Contains translation strings organized by language and category.
 * Structure: translations[language][category][key]
 */
export const translations = {
    // English (Base Language)
    en: {
        // Common translations used across the app
        common: {
            welcome: 'Welcome',
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            save: 'Save',
            cancel: 'Cancel',
            edit: 'Edit',
            delete: 'Delete',
            confirm: 'Confirm',
            close: 'Close',
            yes: 'Yes',
            no: 'No',
            back: 'Back',
            next: 'Next',
            submit: 'Submit',
            search: 'Search',
            filter: 'Filter',
            noData: 'No data',
            retry: 'Retry',
            appName: 'Portal Jemaat GKI Raha',
        },

        // Authentication translations
        auth: {
            login: 'Login',
            logout: 'Logout',
            username: 'Username',
            password: 'Password',
            showPassword: 'Show Password',
            rememberMe: 'Remember me',
            loginButton: 'Sign In',
            loginSuccess: 'Login successful',
            loginError: 'Login failed. Please check your credentials.',
            logoutSuccess: 'Logout successful',
            invalidCredentials: 'Invalid username or password',
            sessionExpired: 'Session expired. Please login again.',
        },

        // Navigation translations
        nav: {
            dashboard: 'Dashboard',
            profile: 'Profile',
            qrCode: 'QR Code',
            settings: 'Settings',
        },

        // Profile translations
        profile: {
            title: 'Profile',
            viewProfile: 'View Profile',
            editProfile: 'Edit Profile',
            updateSuccess: 'Profile updated successfully',
            updateError: 'Failed to update profile',
            instruction: 'For further data changes, please visit the Church Administration or contact us by WhatsApp or E-mail.',
            
            // Personal information
            personalInfo: 'Personal Information',
            fullName: 'Full Name',
            firstName: 'First Name',
            middleName: 'Middle Name',
            lastName: 'Last Name',
            gender: 'Gender',
            birthDate: 'Birth Date',
            age: 'Age',
            membershipDate: 'Membership Date',
            
            // Address information
            addressInfo: 'Address Information',
            address1: 'Address 1',
            address2: 'Address 2',
            city: 'City',
            state: 'State/Province',
            zipCode: 'Postal Code',
            country: 'Country',
            
            // Contact information
            contactInfo: 'Contact Information',
            homePhone: 'Home Phone',
            cellPhone: 'Cell Phone',
            email: 'Email',
            
            // Custom fields
            churchInfo: 'Church Information',
            memberNumber: 'Member Number',
            membershipStatus: 'Membership Status',
            education: 'Education',
            occupation: 'Occupation',
            ethnicity: 'Ethnicity',
            baptismDate: 'Baptism Date',
            confirmationDate: 'Confirmation Date',
            region: 'Region',
            bloodType: 'Blood Type',
            expertise: 'Area of Expertise',
        },

        history: {
            title: 'Attendance History',
            viewHistory: 'View Attended Events',
        },

        // Dashboard translations
        dashboard: {
            title: 'Dashboard',
            greeting: 'Hello, {name}!',
            welcome: 'Welcome to Portal Jemaat GKI Raha',
            quickActions: 'Quick Actions',
            viewProfile: 'Profile',
            viewHistory: 'Attendance History',
            showQR: 'Show QR Code',
            recentActivity: 'Recent Activity',
        },

        // QR Code translations
        qr: {
            title: 'QR Code',
            description: 'Show this QR code for attendance or identification',
            yourQR: 'Your QR Code',
            memberNumber: 'Member Number',
            download: 'Download QR',
            print: 'Print QR',
            instruction: 'Screenshot this QR code for offline use',
            noNumber: 'Member Number Not Found',
        },

        // Form validation translations
        validation: {
            required: 'This field is required',
            email: 'Please enter a valid email address',
            phone: 'Please enter a valid phone number',
            minLength: 'Minimum {min} characters required',
            maxLength: 'Maximum {max} characters allowed',
        },

        // Error messages
        errors: {
            networkError: 'Network error. Please check your connection.',
            serverError: 'Server error. Please try again later.',
            notFound: 'Page not found',
            unauthorized: 'Unauthorized access',
            forbidden: 'Access forbidden',
            unknown: 'An unexpected error occurred',
        },

        // Settings translations
        settings: {
            title: 'Settings',
            language: 'Language',
            theme: 'Theme',
            lightMode: 'Light Mode',
            darkMode: 'Dark Mode',
            notifications: 'Notifications',
        },
    },

    // Indonesian Language
    id: {
        // Terjemahan umum
        common: {
            welcome: 'Selamat Datang',
            loading: 'Memuat...',
            error: 'Kesalahan',
            success: 'Berhasil',
            save: 'Simpan',
            cancel: 'Batal',
            edit: 'Ubah',
            delete: 'Hapus',
            confirm: 'Konfirmasi',
            close: 'Tutup',
            yes: 'Ya',
            no: 'Tidak',
            back: 'Kembali',
            next: 'Lanjut',
            submit: 'Kirim',
            search: 'Cari',
            filter: 'Filter',
            noData: 'Tidak ada data',
            retry: 'Coba Lagi',
            appName: 'Portal Jemaat GKI Raha',
        },

        // Terjemahan autentikasi
        auth: {
            login: 'Masuk',
            logout: 'Keluar',
            username: 'Nama Pengguna',
            password: 'Kata Sandi',
            showPassword: 'Tampilkan Kata Sandi',
            rememberMe: 'Ingat saya',
            loginButton: 'Masuk',
            loginSuccess: 'Login berhasil',
            loginError: 'Login gagal. Periksa kredensial Anda.',
            logoutSuccess: 'Logout berhasil',
            invalidCredentials: 'Nama pengguna atau kata sandi salah',
            sessionExpired: 'Sesi telah berakhir. Silakan login kembali.',
        },

        // Terjemahan navigasi
        nav: {
            dashboard: 'Beranda',
            profile: 'Profil',
            qrCode: 'Kode QR',
            settings: 'Pengaturan',
        },

        // Terjemahan profil
        profile: {
            title: 'Profil',
            viewProfile: 'Lihat Profil',
            editProfile: 'Ubah Profil',
            updateSuccess: 'Profil berhasil diperbarui',
            updateError: 'Gagal memperbarui profil',
            instruction: 'Untuk perubahan data lebih lanjut, harap mengunjungi Tata Usaha Gereja atau menghubungi via Whatsapp atau E-mail.',
            
            // Informasi pribadi
            personalInfo: 'Informasi Pribadi',
            fullName: 'Nama Lengkap',
            firstName: 'Nama Depan',
            middleName: 'Nama Tengah',
            lastName: 'Nama Belakang',
            gender: 'Jenis Kelamin',
            birthDate: 'Tanggal Lahir',
            age: 'Usia',
            membershipDate: 'Tanggal Keanggotaan',
            
            // Informasi alamat
            addressInfo: 'Informasi Alamat',
            address1: 'Alamat 1',
            address2: 'Alamat 2',
            city: 'Kota',
            state: 'Provinsi',
            zipCode: 'Kode Pos',
            country: 'Negara',
            
            // Informasi kontak
            contactInfo: 'Informasi Kontak',
            homePhone: 'Telepon Rumah',
            cellPhone: 'Telepon Seluler',
            email: 'Email',
            
            // Custom fields
            churchInfo: 'Informasi Gereja',
            memberNumber: 'Nomor Anggota',
            membershipStatus: 'Status Keanggotaan',
            education: 'Pendidikan',
            occupation: 'Pekerjaan',
            ethnicity: 'Etnis',
            baptismDate: 'Tanggal Baptis',
            confirmationDate: 'Tanggal Sidi',
            region: 'Wilayah',
            bloodType: 'Golongan Darah',
            expertise: 'Bidang Keahlian',
        },

        history: {
            title: 'Riwayat Kehadiran',
            viewHistory: 'Lihat Acara yang Pernah Dihadiri',
        },

        // Terjemahan dashboard
        dashboard: {
            title: 'Beranda',
            greeting: 'Halo, {name}!',
            welcome: 'Selamat datang di Portal Jemaat GKI Raha',
            quickActions: 'Aksi Cepat',
            viewProfile: 'Profil',
            viewHistory: 'Riwayat Kehadiran',
            showQR: 'Tampilkan Kode QR',
            recentActivity: 'Aktivitas Terkini',
        },

        // Terjemahan QR Code
        qr: {
            title: 'Kode QR',
            description: 'Tampilkan kode QR ini untuk absensi atau identifikasi',
            yourQR: 'Kode QR Anda',
            memberNumber: 'Nomor Anggota',
            download: 'Unduh QR',
            print: 'Cetak QR',
            instruction: 'Screenshot QR code ini untuk penggunaan offline',
            noNumber: 'Nomor Anggota Tidak Ditemukan',
        },

        // Terjemahan validasi form
        validation: {
            required: 'Kolom ini wajib diisi',
            email: 'Masukkan alamat email yang valid',
            phone: 'Masukkan nomor telepon yang valid',
            minLength: 'Minimal {min} karakter diperlukan',
            maxLength: 'Maksimal {max} karakter diizinkan',
        },

        // Pesan kesalahan
        errors: {
            networkError: 'Kesalahan jaringan. Periksa koneksi Anda.',
            serverError: 'Kesalahan server. Coba lagi nanti.',
            notFound: 'Halaman tidak ditemukan',
            unauthorized: 'Akses tidak diizinkan',
            forbidden: 'Akses ditolak',
            unknown: 'Terjadi kesalahan yang tidak terduga',
        },

        // Terjemahan pengaturan
        settings: {
            title: 'Pengaturan',
            language: 'Bahasa',
            theme: 'Tema',
            lightMode: 'Mode Terang',
            darkMode: 'Mode Gelap',
            notifications: 'Notifikasi',
        },
    },
};