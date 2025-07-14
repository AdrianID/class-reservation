import React, { useState } from 'react';
import AdminLayout from '@/components/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import {
    ArrowLeftIcon,
    CheckIcon,
    XCircleIcon,
    DocumentIcon,
    ClockIcon,
    UserIcon,
    MapPinIcon,
    BuildingOfficeIcon,
    BookmarkIcon,
    DocumentTextIcon,
    UserGroupIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';

export default function BookingShow({ booking, flash }) {
    const [showFlash, setShowFlash] = useState(!!flash);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800';
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
            case 'cancelled':
                return 'Dibatalkan';
            default:
                return status;
        }
    };

    const handleApprove = () => {
        if (confirm('Apakah Anda yakin ingin menyetujui booking ini?')) {
            router.post(route('admin.booking.approve', booking.id));
        }
    };

    const handleReject = (e) => {
        e.preventDefault();
        if (rejectionReason.trim() === '') {
            alert('Alasan penolakan harus diisi');
            return;
        }

        router.post(route('admin.booking.reject', booking.id), {
            admin_notes: rejectionReason
        });

        setShowRejectModal(false);
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center">
                    <Link
                        href={route('admin.booking.index')}
                        className="mr-4 p-2 rounded-full hover:bg-gray-200 transition"
                    >
                        <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Detail Booking
                    </h2>
                </div>
            }
        >
            <Head title="Detail Booking" />

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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Main Booking Information */}
                        <div className="md:col-span-2">
                            <div className="bg-white overflow-hidden shadow-sm rounded-lg mb-6">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Informasi Booking
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Tanggal Pengajuan: {format(parseISO(booking.created_at), 'dd MMMM yyyy', { locale: id })}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                                            {getStatusText(booking.status)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                        <div className="space-y-4">
                                            <div className="flex items-start">
                                                <ClockIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Tanggal Booking</p>
                                                    <p className="text-base text-gray-900">{format(parseISO(booking.booking_date), 'dd MMMM yyyy', { locale: id })}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <ClockIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Waktu</p>
                                                    <p className="text-base text-gray-900">{booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)} WIB</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Jumlah Peserta</p>
                                                    <p className="text-base text-gray-900">{booking.number_of_participants} orang</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-start">
                                                <UserIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Pemohon</p>
                                                    <p className="text-base text-gray-900">{booking.user.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Fakultas</p>
                                                    <p className="text-base text-gray-900">{booking.room.building.faculty.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Gedung</p>
                                                    <p className="text-base text-gray-900">{booking.room.building.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <div className="flex items-start">
                                            <BookmarkIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Tujuan Penggunaan</p>
                                                <p className="text-base text-gray-900">{booking.purpose}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {booking.admin_notes && (
                                        <div className="mt-6 p-4 bg-gray-50 rounded-md">
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">Catatan Admin:</h4>
                                            <p className="text-base text-gray-900">{booking.admin_notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Room Information */}
                            <div className="bg-white overflow-hidden shadow-sm rounded-lg mb-6">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Informasi Ruangan
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Nama Ruangan</p>
                                                <p className="text-base text-gray-900">{booking.room.room_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Kode Ruangan</p>
                                                <p className="text-base text-gray-900">{booking.room.room_code}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Kategori Ruangan</p>
                                                <p className="text-base text-gray-900">{booking.room.category.category_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Kapasitas</p>
                                                <p className="text-base text-gray-900">{booking.room.capacity} orang</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dokumen Pendukung */}
                            {booking.documents.length > 0 && (
                                <div className="bg-white overflow-hidden shadow-sm rounded-lg mb-6">
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Dokumen Pendukung
                                        </h3>
                                        <div className="space-y-4">
                                            {booking.documents.map((doc) => (
                                                <div key={doc.id} className="flex items-center p-3 border border-gray-200 rounded-md">
                                                    <DocumentIcon className="h-6 w-6 text-gray-500 mr-3" />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900">{doc.type.type_name}</p>
                                                        <p className="text-xs text-gray-500">{doc.document_name}</p>
                                                    </div>
                                                    <a
                                                        href={`/storage/${doc.document_path}`}
                                                        target="_blank"
                                                        className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100"
                                                    >
                                                        Lihat
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="md:col-span-1">
                            <div className="bg-white overflow-hidden shadow-sm rounded-lg sticky top-6">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Tindakan
                                    </h3>

                                    {booking.status === 'pending' && (
                                        <div className="space-y-3">
                                            <button
                                                onClick={handleApprove}
                                                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                            >
                                                <CheckIcon className="h-5 w-5 mr-2" />
                                                Setujui Booking
                                            </button>
                                            <button
                                                onClick={() => setShowRejectModal(true)}
                                                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                <XCircleIcon className="h-5 w-5 mr-2" />
                                                Tolak Booking
                                            </button>
                                        </div>
                                    )}

                                    <Link
                                        href={route('admin.booking.index')}
                                        className="mt-3 w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Kembali ke Daftar
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rejection Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowRejectModal(false)}></div>
                        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
                        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <XCircleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">Tolak Booking</h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Silakan berikan alasan penolakan booking ini. Alasan ini akan ditampilkan kepada pemohon.
                                            </p>
                                            <textarea
                                                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                rows="4"
                                                placeholder="Alasan penolakan..."
                                                value={rejectionReason}
                                                onChange={e => setRejectionReason(e.target.value)}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={handleReject}
                                >
                                    Tolak
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                                    onClick={() => setShowRejectModal(false)}
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
