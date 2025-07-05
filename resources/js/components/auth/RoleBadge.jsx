import { getRoleName, getRoleColor } from '@/utils/roleUtils';

/**
 * Komponen untuk menampilkan badge role pengguna
 * @param {Object} props - Props komponen
 * @param {Object} props.user - User object dengan role
 * @param {string} props.size - Ukuran badge (sm, md, lg)
 * @param {string} props.variant - Variant badge (solid, outline)
 * @param {string} props.className - CSS classes tambahan
 * @returns {React.ReactNode}
 */
export default function RoleBadge({ 
    user, 
    size = 'md', 
    variant = 'solid', 
    className = '' 
}) {
    if (!user || !user.role) {
        return null;
    }

    const roleName = getRoleName(user);
    const roleColor = getRoleColor(user);

    // Size classes
    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-2 text-base'
    };

    // Color classes untuk solid variant
    const solidColorClasses = {
        red: 'bg-red-500 text-white',
        orange: 'bg-orange-500 text-white',
        blue: 'bg-blue-500 text-white',
        green: 'bg-green-500 text-white',
        purple: 'bg-purple-500 text-white',
        gray: 'bg-gray-500 text-white'
    };

    // Color classes untuk outline variant
    const outlineColorClasses = {
        red: 'border-red-500 text-red-600 bg-red-50',
        orange: 'border-orange-500 text-orange-600 bg-orange-50',
        blue: 'border-blue-500 text-blue-600 bg-blue-50',
        green: 'border-green-500 text-green-600 bg-green-50',
        purple: 'border-purple-500 text-purple-600 bg-purple-50',
        gray: 'border-gray-500 text-gray-600 bg-gray-50'
    };

    const baseClasses = 'inline-flex items-center rounded-full font-medium';
    const sizeClass = sizeClasses[size] || sizeClasses.md;
    
    const colorClass = variant === 'outline' 
        ? `border ${outlineColorClasses[roleColor]}` 
        : solidColorClasses[roleColor];

    return (
        <span 
            className={`${baseClasses} ${sizeClass} ${colorClass} ${className}`}
            title={`Role: ${roleName}`}
        >
            {roleName}
        </span>
    );
}

/**
 * Komponen untuk menampilkan role dengan icon
 * @param {Object} props - Props komponen
 * @param {Object} props.user - User object dengan role
 * @param {string} props.size - Ukuran badge
 * @param {string} props.variant - Variant badge
 * @param {string} props.className - CSS classes tambahan
 * @returns {React.ReactNode}
 */
export function RoleBadgeWithIcon({ 
    user, 
    size = 'md', 
    variant = 'solid', 
    className = '' 
}) {
    if (!user || !user.role) {
        return null;
    }

    const roleName = getRoleName(user);
    const roleColor = getRoleColor(user);

    // Icon berdasarkan role
    const getRoleIcon = (role) => {
        switch (role) {
            case 'Super Admin':
                return '🔐';
            case 'Admin':
                return '⚙️';
            case 'Dekan':
                return '👔';
            case 'Dosen':
                return '📚';
            case 'Mahasiswa':
                return '🎓';
            default:
                return '👤';
        }
    };

    const icon = getRoleIcon(user.role.role_name);

    // Size classes
    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-2 text-base'
    };

    // Color classes untuk solid variant
    const solidColorClasses = {
        red: 'bg-red-500 text-white',
        orange: 'bg-orange-500 text-white',
        blue: 'bg-blue-500 text-white',
        green: 'bg-green-500 text-white',
        purple: 'bg-purple-500 text-white',
        gray: 'bg-gray-500 text-white'
    };

    // Color classes untuk outline variant
    const outlineColorClasses = {
        red: 'border-red-500 text-red-600 bg-red-50',
        orange: 'border-orange-500 text-orange-600 bg-orange-50',
        blue: 'border-blue-500 text-blue-600 bg-blue-50',
        green: 'border-green-500 text-green-600 bg-green-50',
        purple: 'border-purple-500 text-purple-600 bg-purple-50',
        gray: 'border-gray-500 text-gray-600 bg-gray-50'
    };

    const baseClasses = 'inline-flex items-center gap-2 rounded-full font-medium';
    const sizeClass = sizeClasses[size] || sizeClasses.md;
    
    const colorClass = variant === 'outline' 
        ? `border ${outlineColorClasses[roleColor]}` 
        : solidColorClasses[roleColor];

    return (
        <span 
            className={`${baseClasses} ${sizeClass} ${colorClass} ${className}`}
            title={`Role: ${roleName}`}
        >
            <span>{icon}</span>
            <span>{roleName}</span>
        </span>
    );
} 