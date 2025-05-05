import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    MagnifyingGlassIcon, 
    FunnelIcon, 
    XMarkIcon, 
    EyeIcon, 
    CheckIcon, 
    XCircleIcon,
    ArrowDownIcon,
    ArrowUpIcon,
} from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { Transition } from '@headlessui/react';

export default function BookingIndex({ bookings, filters, statistics, errors, flash }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        status: filters.status || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });
    const [sortField, setSortField] = useState(filters.sort_field || 'created_at');
    const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'desc');
    const [showFlash, setShowFlash] = useState(!!flash);
    
    useEffect(() => {
        if (flash) {
            setShowFlash(true);
            const timer = setTimeout(() => {
                setShowFlash(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters({ search: searchTerm });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setSelectedFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = (additionalFilters = {}) => {
        router.get(
            route('admin.booking.index'),
            { 
                ...selectedFilters, 
                ...additionalFilters,
                sort_field: sortField,
                sort_direction: sortDirection
            },
            { preserveState: true }
        );
    };

    const resetFilters = () => {
        setSelectedFilters({
            status: '',
            date_from: '',
            date_to: '',
        });
        setSearchTerm('');
        router.get(route('admin.booking.index'), {
            sort_field: sortField,
            sort_direction: sortDirection
        });
    };

    const handleSort = (field) => {
        // Toggle direction if the same field is clicked, otherwise default to ascending
        const direction = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(direction);
        
        router.get(
            route('admin.booking.index'),
            { 
                ...selectedFilters, 
                search: searchTerm,
                sort_field: field,
                sort_direction: direction
            },
            { preserveState: true }
        );
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'approved':
                return 'Disetujui';
            case 'rejected':
                return 'Ditolak';
            case 'pending':
                return 'Menunggu';
            default:
                return status;
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Manajemen Booking
                    </h2>
                    <Link
                        href={route('admin.calendar.index')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Lihat Kalender
                    </Link>
                </div>
            }
        >
            <Head title="Manajemen Booking" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Flash Message */}
                    {flash && (
                        <Transition
                            show={showFlash}
                            enter="transition ease-out duration-300"
                            enterFrom="transform opacity-0"
                            enterTo="transform opacity-100"
                            leave="transition ease-in duration-200"
                            leaveFrom="transform opacity-100"
                            leaveTo="transform opacity-0"
                        >
                            <div className={`mb-6 p-4 rounded-md ${flash.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                <div className="flex justify-between items-center">
                                    <p>{flash.message}</p>
                                    <button onClick={() => setShowFlash(false)}>
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </Transition>
                    )}

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg p-4">
                            <div className="text-lg font-semibold text-gray-700">Total Booking</div>
                            <div className="text-3xl font-bold text-gray-900">{statistics.total}</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg p-4">
                            <div className="text-lg font-semibold text-yellow-600">Menunggu</div>
                            <div className="text-3xl font-bold text-yellow-700">{statistics.pending}</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg p-4">
                            <div className="text-lg font-semibold text-green-600">Disetujui</div>
                            <div className="text-3xl font-bold text-green-700">{statistics.approved}</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg p-4">
                            <div className="text-lg font-semibold text-red-600">Ditolak</div>
                            <div className="text-3xl font-bold text-red-700">{statistics.rejected}</div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg mb-6">
                        <div className="p-6">
                            <div className="mb-4">
                                <form onSubmit={handleSearch} className="flex gap-4">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Cari nama pemohon, ruangan, atau tujuan"
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cari
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                                        className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <FunnelIcon className="h-4 w-4" />
                                        {isFiltersOpen ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
                                    </button>
                                </form>
                            </div>

                            {isFiltersOpen && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            name="status"
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                            value={selectedFilters.status}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="">Semua Status</option>
                                            <option value="pending">Menunggu</option>
                                            <option value="approved">Disetujui</option>
                                            <option value="rejected">Ditolak</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="date_from" className="block text-sm font-medium text-gray-700 mb-1">
                                            Dari Tanggal
                                        </label>
                                        <input
                                            type="date"
                                            id="date_from"
                                            name="date_from"
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                            value={selectedFilters.date_from}
                                            onChange={handleFilterChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="date_to" className="block text-sm font-medium text-gray-700 mb-1">
                                            Sampai Tanggal
                                        </label>
                                        <input
                                            type="date"
                                            id="date_to"
                                            name="date_to"
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                            value={selectedFilters.date_to}
                                            onChange={handleFilterChange}
                                        />
                                    </div>
                                    <div className="md:col-span-3 flex justify-end gap-2 mt-4">
                                        <button
                                            type="button"
                                            onClick={resetFilters}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Reset Filter
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => applyFilters()}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Terapkan Filter
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bookings Table */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                {bookings.data.length > 0 ? (
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th 
                                                    scope="col" 
                                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                    onClick={() => handleSort('created_at')}
                                                >
                                                    <div className="flex items-center">
                                                        Tanggal Ajuan
                                                        {sortField === 'created_at' && (
                                                            sortDirection === 'asc' 
                                                                ? <ArrowUpIcon className="h-4 w-4 ml-1" />
                                                                : <ArrowDownIcon className="h-4 w-4 ml-1" />
                                                        )}
                                                    </div>
                                                </th>
                                                <th 
                                                    scope="col" 
                                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                    onClick={() => handleSort('booking_date')}
                                                >
                                                    <div className="flex items-center">
                                                        Tanggal Booking
                                                        {sortField === 'booking_date' && (
                                                            sortDirection === 'asc' 
                                                                ? <ArrowUpIcon className="h-4 w-4 ml-1" />
                                                                : <ArrowDownIcon className="h-4 w-4 ml-1" />
                                                        )}
                                                    </div>
                                                </th>
                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Pemohon
                                                </th>
                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Ruangan
                                                </th>
                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Waktu
                                                </th>
                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tujuan
                                                </th>
                                                <th 
                                                    scope="col" 
                                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                    onClick={() => handleSort('status')}
                                                >
                                                    <div className="flex items-center">
                                                        Status
                                                        {sortField === 'status' && (
                                                            sortDirection === 'asc' 
                                                                ? <ArrowUpIcon className="h-4 w-4 ml-1" />
                                                                : <ArrowDownIcon className="h-4 w-4 ml-1" />
                                                        )}
                                                    </div>
                                                </th>
                                                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {bookings.data.map((booking) => (
                                                <tr key={booking.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {format(parseISO(booking.created_at), 'dd MMM yyyy', { locale: id })}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                        {format(parseISO(booking.booking_date), 'dd MMM yyyy', { locale: id })}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {booking.user.name}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {booking.room.room_name}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                        {booking.purpose}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                                                            {getStatusText(booking.status)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end space-x-2">
                                                            <Link
                                                                href={route('admin.booking.show', booking.id)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                                title="Lihat Detail"
                                                            >
                                                                <EyeIcon className="h-5 w-5" />
                                                            </Link>
                                                            
                                                            {booking.status === 'pending' && (
                                                                <>
                                                                    <Link
                                                                        href={`#approve-${booking.id}`}
                                                                        className="text-green-600 hover:text-green-900"
                                                                        title="Setujui"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            if (confirm('Apakah Anda yakin ingin menyetujui booking ini?')) {
                                                                                router.post(route('admin.booking.approve', booking.id));
                                                                            }
                                                                        }}
                                                                    >
                                                                        <CheckIcon className="h-5 w-5" />
                                                                    </Link>
                                                                    <Link
                                                                        href={`#reject-${booking.id}`}
                                                                        className="text-red-600 hover:text-red-900"
                                                                        title="Tolak"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            const reason = prompt('Alasan penolakan:');
                                                                            if (reason !== null) {
                                                                                router.post(route('admin.booking.reject', booking.id), {
                                                                                    admin_notes: reason
                                                                                });
                                                                            }
                                                                        }}
                                                                    >
                                                                        <XCircleIcon className="h-5 w-5" />
                                                                    </Link>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-gray-500">Tidak ada data booking yang ditemukan</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {bookings.data.length > 0 && (
                                <div className="mt-4 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        {bookings.prev_page_url && (
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    router.get(bookings.prev_page_url);
                                                }}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Sebelumnya
                                            </a>
                                        )}
                                        {bookings.next_page_url && (
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    router.get(bookings.next_page_url);
                                                }}
                                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Selanjutnya
                                            </a>
                                        )}
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Menampilkan <span className="font-medium">{bookings.from}</span> sampai <span className="font-medium">{bookings.to}</span> dari <span className="font-medium">{bookings.total}</span> hasil
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                {bookings.links.map((link, i) => {
                                                    if (link.url === null) {
                                                        return (
                                                            <span
                                                                key={i}
                                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500"
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                            />
                                                        );
                                                    }
                                                    return (
                                                        <a
                                                            key={i}
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                router.get(link.url);
                                                            }}
                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                link.active
                                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                            }`}
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    );
                                                })}
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 