import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/id';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';

// Setup localizer
moment.locale('id');
const localizer = momentLocalizer(moment);

export default function CalendarIndex({ rooms, events, filters, currentMonth }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [viewMode, setViewMode] = useState('month');
    const [currentEvents, setCurrentEvents] = useState([]);
    const [showEventDetail, setShowEventDetail] = useState(null);
    const [calendarDate, setCalendarDate] = useState(
        new Date(filters.year, filters.month - 1, 1)
    );
    const [currentFilters, setCurrentFilters] = useState({
        room_id: filters.room_id || '',
        category: filters.category || '',
    });
    const [isLoading, setIsLoading] = useState(false);

    // Persiapkan events untuk ditampilkan ke kalender
    useEffect(() => {
        // Transformasi events dari format yang dikelompokkan berdasarkan tanggal
        const transformedEvents = [];
        
        for (const [date, dateEvents] of Object.entries(events)) {
            dateEvents.forEach(event => {
                transformedEvents.push({
                    id: event.id,
                    title: event.title,
                    start: new Date(`${date}T${event.start_time}`),
                    end: new Date(`${date}T${event.end_time}`),
                    allDay: false,
                    resource: {
                        ...event,
                        formattedDate: format(new Date(date), 'EEEE, dd MMMM yyyy', { locale: id })
                    }
                });
            });
        }
        
        setCurrentEvents(transformedEvents);
    }, [events]);

    // Fungsi untuk mengganti bulan
    const handleNavigate = (action) => {
        const newDate = new Date(calendarDate);
        
        if (action === 'PREV') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else if (action === 'NEXT') {
            newDate.setMonth(newDate.getMonth() + 1);
        } else if (action === 'TODAY') {
            newDate.setMonth(new Date().getMonth());
            newDate.setFullYear(new Date().getFullYear());
        }
        
        setCalendarDate(newDate);
        
        // Ambil events baru untuk bulan yang dipilih
        window.location.href = route('admin.calendar.index', {
            month: newDate.getMonth() + 1,
            year: newDate.getFullYear(),
            room_id: currentFilters.room_id,
            category: currentFilters.category,
        });
    };

    // Fungsi untuk mengganti filter
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setCurrentFilters(prev => ({ ...prev, [name]: value }));
    };

    // Fungsi untuk menerapkan filter
    const applyFilters = () => {
        window.location.href = route('admin.calendar.index', {
            month: calendarDate.getMonth() + 1,
            year: calendarDate.getFullYear(),
            room_id: currentFilters.room_id,
            category: currentFilters.category,
        });
    };

    // Fungsi untuk reset filter
    const resetFilters = () => {
        setCurrentFilters({
            room_id: '',
            category: '',
        });
        
        window.location.href = route('admin.calendar.index', {
            month: calendarDate.getMonth() + 1,
            year: calendarDate.getFullYear(),
        });
    };

    // Fungsi untuk menangani klik pada event
    const handleEventClick = (event) => {
        setShowEventDetail(event.resource);
    };

    // Fungsi untuk menangani klik pada slot kalender (tanggal)
    const handleSlotClick = ({ start }) => {
        setSelectedDate(start);
    };

    // Kustom tampilan event
    const eventStyleGetter = (event) => {
        const style = {
            backgroundColor: event.resource.type === 'booking' ? '#3B82F6' : '#EF4444',
            borderRadius: '4px',
            color: '#fff',
            border: 'none',
            display: 'block',
            padding: '2px 5px',
        };
        return { style };
    };

    // Fungsi untuk menutup detail event
    const closeEventDetail = () => {
        setShowEventDetail(null);
    };

    // Kustom header toolbar kalender
    const CustomToolbar = ({ label, onNavigate, onView }) => {
        return (
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => onNavigate('TODAY')}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Hari Ini
                    </button>
                    <button
                        type="button"
                        onClick={() => onNavigate('PREV')}
                        className="p-1 rounded-full hover:bg-gray-200"
                    >
                        <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onNavigate('NEXT')}
                        className="p-1 rounded-full hover:bg-gray-200"
                    >
                        <ChevronRightIcon className="h-6 w-6" />
                    </button>
                    <h2 className="text-xl font-semibold">{label}</h2>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => onView('month')}
                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                            viewMode === 'month'
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Bulan
                    </button>
                    <button
                        type="button"
                        onClick={() => onView('week')}
                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                            viewMode === 'week'
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Minggu
                    </button>
                    <button
                        type="button"
                        onClick={() => onView('day')}
                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                            viewMode === 'day'
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Hari
                    </button>
                    <button
                        type="button"
                        onClick={() => onView('agenda')}
                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                            viewMode === 'agenda'
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Agenda
                    </button>
                </div>
            </div>
        );
    };

    // Badge untuk event pada sel tanggal
    const DayCellWrapper = ({ children, value }) => {
        const date = format(value, 'yyyy-MM-dd');
        const dateEvents = events[date] || [];
        
        return (
            <div className="relative h-full">
                {children}
                {dateEvents.length > 0 && viewMode === 'month' && (
                    <div className="absolute bottom-0 left-0 right-0 flex flex-wrap gap-1 p-1">
                        {dateEvents.length <= 3 ? (
                            dateEvents.map((event, index) => (
                                <div
                                    key={index}
                                    className={`text-xs px-1 py-0.5 rounded-sm truncate ${
                                        event.type === 'booking'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-red-500 text-white'
                                    }`}
                                    title={`${event.title} - ${event.room_name}`}
                                >
                                    {event.title.length > 12 ? event.title.substring(0, 12) + '...' : event.title}
                                </div>
                            ))
                        ) : (
                            <>
                                {dateEvents.slice(0, 2).map((event, index) => (
                                    <div
                                        key={index}
                                        className={`text-xs px-1 py-0.5 rounded-sm truncate ${
                                            event.type === 'booking'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-red-500 text-white'
                                        }`}
                                        title={`${event.title} - ${event.room_name}`}
                                    >
                                        {event.title.length > 12 ? event.title.substring(0, 12) + '...' : event.title}
                                    </div>
                                ))}
                                <Popover className="relative">
                                    <Popover.Button className="text-xs px-1 py-0.5 rounded-sm bg-gray-200 text-gray-700 hover:bg-gray-300">
                                        +{dateEvents.length - 2} lagi
                                    </Popover.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <Popover.Panel className="absolute z-10 w-80 bg-white shadow-lg rounded-md mt-1 p-2 right-0">
                                            <div className="text-sm font-medium mb-2">
                                                {format(value, 'EEEE, dd MMMM yyyy', { locale: id })}
                                            </div>
                                            <div className="max-h-48 overflow-y-auto">
                                                {dateEvents.map((event, index) => (
                                                    <div
                                                        key={index}
                                                        className={`p-2 mb-1 rounded-md ${
                                                            event.type === 'booking'
                                                                ? 'bg-blue-50 border-l-4 border-blue-500'
                                                                : 'bg-red-50 border-l-4 border-red-500'
                                                        }`}
                                                    >
                                                        <div className="font-medium">
                                                            {event.title}
                                                        </div>
                                                        <div className="text-xs text-gray-600">
                                                            {event.room_name} • {event.start_time.substring(0, 5)} - {event.end_time.substring(0, 5)}
                                                        </div>
                                                        <div className="text-xs">
                                                            {event.type === 'booking' ? (
                                                                <span>Peminjam: {event.user_name}</span>
                                                            ) : (
                                                                <span>{event.notes ? event.notes.substring(0, 50) + (event.notes.length > 50 ? '...' : '') : 'Maintenance'}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </Popover>
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <AdminLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard Kalender
                </h2>
            }
        >
            <Head title="Dashboard Kalender" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="mb-6 bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="room_id" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ruangan
                                </label>
                                <select
                                    id="room_id"
                                    name="room_id"
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    value={currentFilters.room_id}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Semua Ruangan</option>
                                    {rooms.map(room => (
                                        <option key={room.id} value={room.id}>
                                            {room.room_name} ({room.room_code})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                    Kategori
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    value={currentFilters.category}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Semua Kategori</option>
                                    <option value="booking">Peminjaman</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                            </div>
                            <div className="flex items-end space-x-2">
                                <button
                                    type="button"
                                    onClick={applyFilters}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Terapkan Filter
                                </button>
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mb-6 bg-white overflow-hidden shadow-sm sm:rounded-lg p-4">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-blue-500 rounded-sm mr-2"></div>
                                <span className="text-sm">Peminjaman</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
                                <span className="text-sm">Maintenance</span>
                            </div>
                        </div>
                    </div>

                    {/* Calendar */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div style={{ height: '75vh' }}>
                            <Calendar
                                localizer={localizer}
                                events={currentEvents}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ width: '100%', height: '100%' }}
                                onSelectEvent={handleEventClick}
                                onSelectSlot={handleSlotClick}
                                selectable
                                eventPropGetter={eventStyleGetter}
                                onView={(view) => setViewMode(view)}
                                view={viewMode}
                                components={{
                                    toolbar: CustomToolbar,
                                    dateCellWrapper: DayCellWrapper,
                                }}
                                messages={{
                                    today: 'Hari Ini',
                                    previous: 'Sebelumnya',
                                    next: 'Selanjutnya',
                                    month: 'Bulan',
                                    week: 'Minggu',
                                    day: 'Hari',
                                    agenda: 'Agenda',
                                    date: 'Tanggal',
                                    time: 'Waktu',
                                    event: 'Acara',
                                    allDay: 'Sepanjang Hari',
                                    noEventsInRange: 'Tidak ada acara dalam rentang ini',
                                }}
                                date={calendarDate}
                                onNavigate={date => setCalendarDate(date)}
                                popup
                                drilldownView="day"
                            />
                        </div>
                    </div>

                    {/* Detail Event */}
                    {showEventDetail && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                                <button
                                    onClick={closeEventDetail}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                                <div className="mt-2">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {showEventDetail.title}
                                    </h3>
                                    <div className="mt-4 space-y-3">
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Tanggal:</span>
                                            <p className="text-sm text-gray-900">{showEventDetail.formattedDate}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Waktu:</span>
                                            <p className="text-sm text-gray-900">
                                                {showEventDetail.start_time.substring(0, 5)} - {showEventDetail.end_time.substring(0, 5)}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Ruangan:</span>
                                            <p className="text-sm text-gray-900">{showEventDetail.room_name}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">
                                                {showEventDetail.type === 'booking' ? 'Peminjam:' : 'Catatan:'}
                                            </span>
                                            <p className="text-sm text-gray-900">
                                                {showEventDetail.type === 'booking'
                                                    ? showEventDetail.user_name
                                                    : showEventDetail.notes || 'Tidak ada catatan'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Status:</span>
                                            <p className={`text-sm ${
                                                showEventDetail.status === 'approved'
                                                    ? 'text-green-600'
                                                    : showEventDetail.status === 'pending'
                                                    ? 'text-yellow-600'
                                                    : 'text-red-600'
                                            }`}>
                                                {showEventDetail.status === 'approved'
                                                    ? 'Disetujui'
                                                    : showEventDetail.status === 'pending'
                                                    ? 'Menunggu Persetujuan'
                                                    : 'Ditolak'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Tipe:</span>
                                            <p className={`text-sm ${
                                                showEventDetail.type === 'booking'
                                                    ? 'text-blue-600'
                                                    : 'text-red-600'
                                            }`}>
                                                {showEventDetail.type === 'booking' ? 'Peminjaman' : 'Maintenance'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
} 