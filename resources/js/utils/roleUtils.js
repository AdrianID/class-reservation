// Role utility functions untuk frontend

/**
 * Mengecek apakah user memiliki role tertentu
 * @param {Object} user - User object dengan role
 * @param {string|Array} roles - Role yang ingin dicek (string atau array)
 * @returns {boolean}
 */
export function hasRole(user, roles) {
    if (!user || !user.role) {
        return false;
    }

    if (Array.isArray(roles)) {
        return roles.includes(user.role.role_name);
    }

    return user.role.role_name === roles;
}

/**
 * Mengecek apakah user adalah admin (Super Admin atau Admin)
 * @param {Object} user - User object dengan role
 * @returns {boolean}
 */
export function isAdmin(user) {
    return hasRole(user, ['Super Admin', 'Admin']);
}

/**
 * Mengecek apakah user adalah mahasiswa
 * @param {Object} user - User object dengan role
 * @returns {boolean}
 */
export function isMahasiswa(user) {
    return hasRole(user, 'Mahasiswa');
}

/**
 * Mengecek apakah user adalah dosen
 * @param {Object} user - User object dengan role
 * @returns {boolean}
 */
export function isDosen(user) {
    return hasRole(user, 'Dosen');
}

/**
 * Mengecek apakah user adalah dekan
 * @param {Object} user - User object dengan role
 * @returns {boolean}
 */
export function isDekan(user) {
    return hasRole(user, 'Dekan');
}

/**
 * Mengecek apakah user adalah akademisi (Dosen atau Dekan)
 * @param {Object} user - User object dengan role
 * @returns {boolean}
 */
export function isAkademisi(user) {
    return hasRole(user, ['Dosen', 'Dekan']);
}

/**
 * Mengecek apakah user adalah pengguna biasa (Mahasiswa, Dosen, Dekan)
 * @param {Object} user - User object dengan role
 * @returns {boolean}
 */
export function isUser(user) {
    return hasRole(user, ['Mahasiswa', 'Dosen', 'Dekan']);
}

/**
 * Mendapatkan nama role yang user-friendly
 * @param {Object} user - User object dengan role
 * @returns {string}
 */
export function getRoleName(user) {
    if (!user || !user.role) {
        return 'Tidak diketahui';
    }

    return user.role.role_name;
}

/**
 * Mendapatkan warna badge berdasarkan role
 * @param {Object} user - User object dengan role
 * @returns {string}
 */
export function getRoleColor(user) {
    if (!user || !user.role) {
        return 'gray';
    }

    switch (user.role.role_name) {
        case 'Super Admin':
            return 'red';
        case 'Admin':
            return 'orange';
        case 'Dekan':
            return 'blue';
        case 'Dosen':
            return 'green';
        case 'Mahasiswa':
            return 'purple';
        default:
            return 'gray';
    }
}

/**
 * Mendapatkan dashboard URL berdasarkan role
 * @param {Object} user - User object dengan role
 * @returns {string}
 */
export function getDashboardUrl(user) {
    if (isAdmin(user)) {
        return '/admin/dashboard';
    }
    
    return '/dashboard';
}

/**
 * Mengecek apakah user bisa mengakses halaman admin
 * @param {Object} user - User object dengan role
 * @returns {boolean}
 */
export function canAccessAdmin(user) {
    return isAdmin(user);
}

/**
 * Mengecek apakah user bisa melakukan booking ruangan
 * @param {Object} user - User object dengan role
 * @returns {boolean}
 */
export function canBookRoom(user) {
    return isUser(user);
}

/**
 * Mengecek apakah user bisa menyetujui booking
 * @param {Object} user - User object dengan role
 * @returns {boolean}
 */
export function canApproveBooking(user) {
    return isAdmin(user) || isDekan(user);
} 