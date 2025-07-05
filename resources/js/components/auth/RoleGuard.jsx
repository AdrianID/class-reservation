import { usePage } from '@inertiajs/react';
import { hasRole } from '@/utils/roleUtils';

/**
 * Komponen untuk melindungi konten berdasarkan role pengguna
 * @param {Object} props - Props komponen
 * @param {string|Array} props.roles - Role yang diizinkan mengakses konten
 * @param {React.ReactNode} props.children - Konten yang akan dilindungi
 * @param {React.ReactNode} props.fallback - Konten alternatif jika tidak memiliki akses
 * @returns {React.ReactNode}
 */
export default function RoleGuard({ roles, children, fallback = null }) {
    const { auth } = usePage().props;
    const user = auth.user;

    // Jika user tidak ada atau tidak memiliki role yang sesuai
    if (!hasRole(user, roles)) {
        return fallback;
    }

    return children;
}

/**
 * Komponen untuk menampilkan konten hanya untuk admin
 * @param {Object} props - Props komponen
 * @param {React.ReactNode} props.children - Konten untuk admin
 * @param {React.ReactNode} props.fallback - Konten alternatif
 * @returns {React.ReactNode}
 */
export function AdminOnly({ children, fallback = null }) {
    return (
        <RoleGuard roles={['Super Admin', 'Admin']} fallback={fallback}>
            {children}
        </RoleGuard>
    );
}

/**
 * Komponen untuk menampilkan konten hanya untuk mahasiswa
 * @param {Object} props - Props komponen
 * @param {React.ReactNode} props.children - Konten untuk mahasiswa
 * @param {React.ReactNode} props.fallback - Konten alternatif
 * @returns {React.ReactNode}
 */
export function MahasiswaOnly({ children, fallback = null }) {
    return (
        <RoleGuard roles={['Mahasiswa']} fallback={fallback}>
            {children}
        </RoleGuard>
    );
}

/**
 * Komponen untuk menampilkan konten hanya untuk dosen
 * @param {Object} props - Props komponen
 * @param {React.ReactNode} props.children - Konten untuk dosen
 * @param {React.ReactNode} props.fallback - Konten alternatif
 * @returns {React.ReactNode}
 */
export function DosenOnly({ children, fallback = null }) {
    return (
        <RoleGuard roles={['Dosen']} fallback={fallback}>
            {children}
        </RoleGuard>
    );
}

/**
 * Komponen untuk menampilkan konten hanya untuk dekan
 * @param {Object} props - Props komponen
 * @param {React.ReactNode} props.children - Konten untuk dekan
 * @param {React.ReactNode} props.fallback - Konten alternatif
 * @returns {React.ReactNode}
 */
export function DekanOnly({ children, fallback = null }) {
    return (
        <RoleGuard roles={['Dekan']} fallback={fallback}>
            {children}
        </RoleGuard>
    );
}

/**
 * Komponen untuk menampilkan konten hanya untuk akademisi (Dosen atau Dekan)
 * @param {Object} props - Props komponen
 * @param {React.ReactNode} props.children - Konten untuk akademisi
 * @param {React.ReactNode} props.fallback - Konten alternatif
 * @returns {React.ReactNode}
 */
export function AkademisiOnly({ children, fallback = null }) {
    return (
        <RoleGuard roles={['Dosen', 'Dekan']} fallback={fallback}>
            {children}
        </RoleGuard>
    );
}

/**
 * Komponen untuk menampilkan konten hanya untuk pengguna biasa (non-admin)
 * @param {Object} props - Props komponen
 * @param {React.ReactNode} props.children - Konten untuk pengguna biasa
 * @param {React.ReactNode} props.fallback - Konten alternatif
 * @returns {React.ReactNode}
 */
export function UserOnly({ children, fallback = null }) {
    return (
        <RoleGuard roles={['Mahasiswa', 'Dosen', 'Dekan']} fallback={fallback}>
            {children}
        </RoleGuard>
    );
} 