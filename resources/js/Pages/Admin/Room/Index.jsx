import AdminLayout from "@/components/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Transition } from '@headlessui/react';
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function RoomIndex({ rooms, filters, buildings, categories, facilities, statuses, flash }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        building_id: filters.building_id || '',
        category_id: filters.category_id || '',
        status: filters.status || '',
        facility_id: filters.facility_id || '',
    });
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
            route('admin.ruangan.index'),
            { ...selectedFilters, ...additionalFilters },
            { preserveState: true }
        );
    };

    const resetFilters = () => {
        setSelectedFilters({
            building_id: '',
            category_id: '',
            status: '',
            facility_id: '',
        });
        setSearchTerm('');
        router.get(route('admin.ruangan.index'));
    };

    const confirmDelete = (id, name) => {
        if (confirm(`Apakah Anda yakin ingin menghapus ruangan "${name}"?`)) {
            router.delete(route('admin.ruangan.destroy', id));
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-800';
            case 'booked':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'available':
                return 'Tersedia';
            case 'maintenance':
                return 'Maintenance';
            case 'booked':
                return 'Terpesan';
            default:
                return status;
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Daftar Ruangan
                    </h2>
                    <Link
                        href={route('admin.ruangan.create')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700 transition"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Tambah Ruangan
                    </Link>
                </div>
            }
        >
            <Head title="Daftar Ruangan" />

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

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Search and Filters */}
                            <div className="mb-6">
                                <form onSubmit={handleSearch} className="flex gap-4 mb-4">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Cari nama atau kode ruangan"
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
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        {isFiltersOpen ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
                                    </button>
                                </form>

                                {isFiltersOpen && (
                                    <div className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-md">
                                        <div>
                                            <label htmlFor="building_id" className="block text-sm font-medium text-gray-700 mb-1">
                                                Gedung
                                            </label>
                                            <select
                                                id="building_id"
                                                name="building_id"
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                                value={selectedFilters.building_id}
                                                onChange={handleFilterChange}
                                            >
                                                <option value="">Semua Gedung</option>
                                                {buildings.map(building => (
                                                    <option key={building.id} value={building.id}>
                                                        {building.building_name} - {building.faculty.faculty_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                                                Kategori
                                            </label>
                                            <select
                                                id="category_id"
                                                name="category_id"
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                                value={selectedFilters.category_id}
                                                onChange={handleFilterChange}
                                            >
                                                <option value="">Semua Kategori</option>
                                                {categories.map(category => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.category_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="facility_id" className="block text-sm font-medium text-gray-700 mb-1">
                                                Fasilitas
                                            </label>
                                            <select
                                                id="facility_id"
                                                name="facility_id"
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                                value={selectedFilters.facility_id}
                                                onChange={handleFilterChange}
                                            >
                                                <option value="">Semua Fasilitas</option>
                                                {facilities.map(facility => (
                                                    <option key={facility.id} value={facility.id}>
                                                        {facility.facility_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
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
                                                {statuses.map(status => (
                                                    <option key={status} value={status}>
                                                        {getStatusText(status)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="md:col-span-4 flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={resetFilters}
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Reset
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

                            {/* Rooms Table */}
                            <div className="overflow-x-auto">
                                {rooms.data.length > 0 ? (
                                    <>
                                        {/* Desktop Table */}
                                        <div className="hidden md:block">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Aksi
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Nama & Lokasi
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Fakultas
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Kategori
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Kapasitas
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {rooms.data.map((room) => (
                                                        <tr key={room.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                <div className="flex gap-2">
                                                                    <Link
                                                                        href={route('admin.ruangan.edit', room.id)}
                                                                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50"
                                                                        title="Edit"
                                                                    >
                                                                        <PencilSquareIcon className="h-4 w-4" />
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => confirmDelete(room.id, room.room_name)}
                                                                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                                                                        title="Hapus"
                                                                    >
                                                                        <TrashIcon className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {room.room_name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {room.building.building_name}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {room.building.faculty.faculty_name}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {room.category.category_name}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {room.capacity} orang
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(room.status)}`}>
                                                                    {getStatusText(room.status)}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile Card Layout */}
                                        <div className="md:hidden space-y-4">
                                            {rooms.data.map((room) => (
                                                <div key={room.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1">
                                                            <h3 className="text-sm font-medium text-gray-900">
                                                                {room.room_name}
                                                            </h3>
                                                            <p className="text-sm text-gray-500 mb-1">
                                                                {room.building.building_name}
                                                            </p>
                                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(room.status)}`}>
                                                                {getStatusText(room.status)}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-2 ml-2">
                                                            <Link
                                                                href={route('admin.ruangan.edit', room.id)}
                                                                className="text-indigo-600 hover:text-indigo-900 p-2 rounded-md hover:bg-indigo-50"
                                                            >
                                                                <PencilSquareIcon className="h-4 w-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() => confirmDelete(room.id, room.room_name)}
                                                                className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50"
                                                            >
                                                                <TrashIcon className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                                        <div>
                                                            <span className="text-gray-500">Fakultas:</span>
                                                            <p className="font-medium text-gray-900">{room.building.faculty.faculty_name}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Kategori:</span>
                                                            <p className="font-medium text-gray-900">{room.category.category_name}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Kapasitas:</span>
                                                            <p className="font-medium text-gray-900">{room.capacity} orang</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-gray-500">Tidak ada data ruangan yang ditemukan</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {rooms.data.length > 0 && (
                                <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        {rooms.prev_page_url && (
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    router.get(rooms.prev_page_url);
                                                }}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Sebelumnya
                                            </a>
                                        )}
                                        {rooms.next_page_url && (
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    router.get(rooms.next_page_url);
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
                                                Menampilkan <span className="font-medium">{rooms.from}</span> sampai <span className="font-medium">{rooms.to}</span> dari <span className="font-medium">{rooms.total}</span> hasil
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                {rooms.links.map((link, i) => {
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
