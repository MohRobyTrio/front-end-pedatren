/**
 * Menerjemahkan objek error validasi dari backend menjadi string yang ramah pengguna.
 * Jika error tidak ada di pemetaan, error asli akan dikembalikan.
 * @param {object} errors - Objek 'errors' dari respons JSON.
 * @returns {string} - String pesan error yang sudah diformat.
 */
export function formatValidationErrors(errors) {
    // Kamus untuk menerjemahkan nama field
    const fieldNames = {
        'no_kk': 'Nomor KK',
        'no_hp': 'Nomor HP',
        'email': 'Email',
        'name': 'Nama',
        'password': 'Password',
        // ...
    };

    // Kamus untuk menerjemahkan KODE error (bukan pesan lengkap)
    const errorMessages = {
        'validation.unique': 'ini sudah terdaftar. Mohon gunakan yang lain.',
        'validation.required': 'ini wajib diisi.',
        'validation.email': 'harus berupa format email yang valid.',
        'validation.min.string': 'minimal harus {min} karakter.',
        // ...
    };

    let friendlyMessages = [];

    // Iterasi setiap field yang error (cth: 'no_kk', 'no_hp')
    for (const field in errors) {
        // Dapatkan pesan error asli pertama dari backend
        // bisa berupa "validation.unique" ATAU "Nomor KK sudah terpakai."
        const originalError = errors[field][0]; 

        // Coba cari di kamus error kita
        const mappedMessage = errorMessages[originalError];

        if (mappedMessage) {
            // --- KASUS 1: Kode error DITEMUKAN di map ---
            // (Backend mengirim 'validation.unique')
            
            // Dapatkan nama field yang ramah (atau gunakan key aslinya jika tidak ada)
            const fieldName = fieldNames[field] || field;
            
            // Gabungkan: "Nomor KK" + "ini sudah terdaftar..."
            friendlyMessages.push(`${fieldName} ${mappedMessage}`);

        } else {
            // --- KASUS 2: Kode error TIDAK DITEMUKAN di map ---
            // (Backend mengirim "Nomor KK sudah terpakai" atau "validation.unknown")
            
            // Tampilkan error asli apa adanya
            friendlyMessages.push(originalError);
        }
    }

    // Gabungkan semua pesan error dengan pemisah baris baru
    return friendlyMessages.join('\n');
}