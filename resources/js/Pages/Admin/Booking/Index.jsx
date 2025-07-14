import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Search,
    Filter,
    X,
    Eye,
    Check,
    XCircle,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import { Transition } from "@headlessui/react";
import Swal from "sweetalert2";

export default function BookingIndex({
    bookings,
    filters,
    statistics,
    errors,
    flash,
}) {
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        status: filters.status || "",
        date_from: filters.date_from || "",
        date_to: filters.date_to || "",
    });
    const [sortField, setSortField] = useState(
        filters.sort_field || "created_at"
    );
    const [sortDirection, setSortDirection] = useState(
        filters.sort_direction || "desc"
    );
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
        setSelectedFilters((prev) => ({ ...prev, [name]: value }));
    };

    const applyFilters = (additionalFilters = {}) => {
        router.get(
            route("admin.booking.index"),
            {
                ...selectedFilters,
                ...additionalFilters,
                sort_field: sortField,
                sort_direction: sortDirection,
            },
            { preserveState: true }
        );
    };

    const resetFilters = () => {
        setSelectedFilters({
            status: "",
            date_from: "",
            date_to: "",
        });
        setSearchTerm("");
        router.get(route("admin.booking.index"), {
            sort_field: sortField,
            sort_direction: sortDirection,
        });
    };

    const handleSort = (field) => {
        const direction =
            field === sortField && sortDirection === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortDirection(direction);

        router.get(
            route("admin.booking.index"),
            {
                ...selectedFilters,
                search: searchTerm,
                sort_field: field,
                sort_direction: direction,
            },
            { preserveState: true }
        );
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "approved":
                return "Approved";
            case "rejected":
                return "Rejected";
            case "pending":
                return "Pending";
            default:
                return status;
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-semibold leading-tight text-primary">
                        Booking Management
                    </h2>
                    <Link
                        href={route("admin.calendar.index")}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition flex items-center gap-2"
                    >
                        View Calendar
                    </Link>
                </div>
            }
        >
            <Head title="Booking Management" />

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
                            <div
                                className={`mb-6 p-4 rounded-md ${
                                    flash.type === "success"
                                        ? "bg-green-50 text-green-800"
                                        : "bg-red-50 text-red-800"
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <p>{flash.message}</p>
                                    <button onClick={() => setShowFlash(false)}>
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </Transition>
                    )}

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg p-4 border border-primary-light">
                            <div className="text-lg font-semibold text-gray-700">
                                Total Booking
                            </div>
                            <div className="text-3xl font-bold text-primary">
                                {statistics.total}
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg p-4 border border-primary-light">
                            <div className="text-lg font-semibold text-yellow-600">
                                Pending
                            </div>
                            <div className="text-3xl font-bold text-yellow-700">
                                {statistics.pending}
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg p-4 border border-primary-light">
                            <div className="text-lg font-semibold text-green-600">
                                Approved
                            </div>
                            <div className="text-3xl font-bold text-green-700">
                                {statistics.approved}
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg p-4 border border-primary-light">
                            <div className="text-lg font-semibold text-red-600">
                                Rejected
                            </div>
                            <div className="text-3xl font-bold text-red-700">
                                {statistics.rejected}
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg mb-6 border border-primary-light">
                        <div className="p-4 sm:p-6">
                            <div className="mb-4">
                                <form
                                    onSubmit={handleSearch}
                                    className="flex flex-col sm:flex-row gap-3"
                                >
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            placeholder="Search by applicant, room, or purpose"
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        >
                                            <Search className="h-4 w-4 sm:mr-1" />
                                            <span className="hidden sm:inline">
                                                Search
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsFiltersOpen(!isFiltersOpen)
                                            }
                                            className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        >
                                            <Filter className="h-4 w-4" />
                                            <span>
                                                {isFiltersOpen
                                                    ? "Hide Filters"
                                                    : "Show Filters"}
                                            </span>
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <Transition
                                show={isFiltersOpen}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 -translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 -translate-y-1"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                                    <div>
                                        <label
                                            htmlFor="status"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            name="status"
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                                            value={selectedFilters.status}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="">
                                                All Statuses
                                            </option>
                                            <option value="pending">
                                                Pending
                                            </option>
                                            <option value="approved">
                                                Approved
                                            </option>
                                            <option value="rejected">
                                                Rejected
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="date_from"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            From Date
                                        </label>
                                        <input
                                            type="date"
                                            id="date_from"
                                            name="date_from"
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                                            value={selectedFilters.date_from}
                                            onChange={handleFilterChange}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="date_to"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            To Date
                                        </label>
                                        <input
                                            type="date"
                                            id="date_to"
                                            name="date_to"
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                                            value={selectedFilters.date_to}
                                            onChange={handleFilterChange}
                                        />
                                    </div>
                                    <div className="md:col-span-3 flex justify-end gap-2 mt-4">
                                        <button
                                            type="button"
                                            onClick={resetFilters}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        >
                                            Reset Filters
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => applyFilters()}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        >
                                            Apply Filters
                                        </button>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </div>

                    {/* Bookings Table */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-primary-light">
                        <div className="p-4 sm:p-6">
                            <div className="overflow-x-auto">
                                {bookings.data.length > 0 ? (
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-primary-light">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider cursor-pointer"
                                                    onClick={() =>
                                                        handleSort("created_at")
                                                    }
                                                >
                                                    <div className="flex items-center">
                                                        Request Date
                                                        {sortField ===
                                                            "created_at" &&
                                                            (sortDirection ===
                                                            "asc" ? (
                                                                <ChevronUp className="h-4 w-4 ml-1" />
                                                            ) : (
                                                                <ChevronDown className="h-4 w-4 ml-1" />
                                                            ))}
                                                    </div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider cursor-pointer"
                                                    onClick={() =>
                                                        handleSort(
                                                            "booking_date"
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-center">
                                                        Booking Date
                                                        {sortField ===
                                                            "booking_date" &&
                                                            (sortDirection ===
                                                            "asc" ? (
                                                                <ChevronUp className="h-4 w-4 ml-1" />
                                                            ) : (
                                                                <ChevronDown className="h-4 w-4 ml-1" />
                                                            ))}
                                                    </div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider"
                                                >
                                                    Applicant
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider"
                                                >
                                                    Room
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider"
                                                >
                                                    Time
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider"
                                                >
                                                    Purpose
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider cursor-pointer"
                                                    onClick={() =>
                                                        handleSort("status")
                                                    }
                                                >
                                                    <div className="flex items-center">
                                                        Status
                                                        {sortField ===
                                                            "status" &&
                                                            (sortDirection ===
                                                            "asc" ? (
                                                                <ChevronUp className="h-4 w-4 ml-1" />
                                                            ) : (
                                                                <ChevronDown className="h-4 w-4 ml-1" />
                                                            ))}
                                                    </div>
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-3 text-right text-xs font-medium text-primary uppercase tracking-wider"
                                                >
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {bookings.data.map((booking) => (
                                                <tr
                                                    key={booking.id}
                                                    className="hover:bg-background"
                                                >
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {format(
                                                            parseISO(
                                                                booking.created_at
                                                            ),
                                                            "dd MMM yyyy",
                                                            { locale: enUS }
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-primary">
                                                        {format(
                                                            parseISO(
                                                                booking.booking_date
                                                            ),
                                                            "dd MMM yyyy",
                                                            { locale: enUS }
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {booking.user.name}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {booking.room.room_name}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {booking.start_time.substring(
                                                            0,
                                                            5
                                                        )}{" "}
                                                        -{" "}
                                                        {booking.end_time.substring(
                                                            0,
                                                            5
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                        {booking.purpose}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                                                                booking.status
                                                            )}`}
                                                        >
                                                            {getStatusText(
                                                                booking.status
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end space-x-2">
                                                            <Link
                                                                href={route(
                                                                    "admin.booking.show",
                                                                    booking.id
                                                                )}
                                                                className="text-primary hover:text-primary-dark p-1 rounded-md hover:bg-primary-light"
                                                                title="View Details"
                                                            >
                                                                <Eye className="h-5 w-5" />
                                                            </Link>

                                                            {booking.status ===
                                                                "pending" && (
                                                                <>
                                                                    <button
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.preventDefault();
                                                                            Swal.fire(
                                                                                {
                                                                                    title: "Approve this booking?",
                                                                                    icon: "question",
                                                                                    showCancelButton: true,
                                                                                    confirmButtonText:
                                                                                        "Yes, Approve",
                                                                                    cancelButtonText:
                                                                                        "Cancel",
                                                                                    confirmButtonColor:
                                                                                        "#22c55e",
                                                                                    cancelButtonColor:
                                                                                        "#d1d5db",
                                                                                }
                                                                            ).then(
                                                                                (
                                                                                    result
                                                                                ) => {
                                                                                    if (
                                                                                        result.isConfirmed
                                                                                    ) {
                                                                                        router.post(
                                                                                            route(
                                                                                                "admin.booking.approve",
                                                                                                booking.id
                                                                                            ),
                                                                                            {
                                                                                                onSuccess:
                                                                                                    () => {
                                                                                                        Swal.fire(
                                                                                                            {
                                                                                                                icon: "success",
                                                                                                                title: "Booking Approved",
                                                                                                                text: "The booking has been approved successfully.",
                                                                                                                timer: 2000,
                                                                                                                showConfirmButton: false,
                                                                                                            }
                                                                                                        );
                                                                                                    },
                                                                                            }
                                                                                        );
                                                                                    }
                                                                                }
                                                                            );
                                                                        }}
                                                                        className="text-green-600 hover:text-green-800 p-1 rounded-md hover:bg-green-50"
                                                                        title="Approve"
                                                                    >
                                                                        <Check className="h-5 w-5" />
                                                                    </button>

                                                                    <button
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.preventDefault();
                                                                            Swal.fire(
                                                                                {
                                                                                    title: "Reject Booking",
                                                                                    input: "text",
                                                                                    inputLabel:
                                                                                        "Reason for rejection",
                                                                                    inputPlaceholder:
                                                                                        "Type reason here...",
                                                                                    inputValidator:
                                                                                        (
                                                                                            value
                                                                                        ) => {
                                                                                            if (
                                                                                                !value
                                                                                            ) {
                                                                                                return "You must provide a reason!";
                                                                                            }
                                                                                        },
                                                                                    showCancelButton: true,
                                                                                    confirmButtonText:
                                                                                        "Reject",
                                                                                    cancelButtonText:
                                                                                        "Cancel",
                                                                                    confirmButtonColor:
                                                                                        "#ef4444", // red-500
                                                                                    cancelButtonColor:
                                                                                        "#d1d5db", // gray-300
                                                                                }
                                                                            ).then(
                                                                                (
                                                                                    result
                                                                                ) => {
                                                                                    if (
                                                                                        result.isConfirmed &&
                                                                                        result.value
                                                                                    ) {
                                                                                        router.post(
                                                                                            route(
                                                                                                "admin.booking.reject",
                                                                                                booking.id
                                                                                            ),
                                                                                            {
                                                                                                admin_notes:
                                                                                                    result.value,
                                                                                            },
                                                                                            {
                                                                                                preserveScroll: true,
                                                                                                onSuccess:
                                                                                                    () => {
                                                                                                        Swal.fire(
                                                                                                            {
                                                                                                                icon: "success",
                                                                                                                title: "Booking Rejected",
                                                                                                                text: "The booking has been rejected successfully.",
                                                                                                                timer: 2000,
                                                                                                                showConfirmButton: false,
                                                                                                            }
                                                                                                        );
                                                                                                    },
                                                                                            }
                                                                                        );
                                                                                    }
                                                                                }
                                                                            );
                                                                        }}
                                                                        className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50"
                                                                        title="Reject"
                                                                    >
                                                                        <XCircle className="h-5 w-5" />
                                                                    </button>
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
                                        <p className="text-gray-500">
                                            No booking data found
                                        </p>
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
                                                    router.get(
                                                        bookings.prev_page_url
                                                    );
                                                }}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Previous
                                            </a>
                                        )}
                                        {bookings.next_page_url && (
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    router.get(
                                                        bookings.next_page_url
                                                    );
                                                }}
                                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Next
                                            </a>
                                        )}
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Showing{" "}
                                                <span className="font-medium">
                                                    {bookings.from}
                                                </span>{" "}
                                                to{" "}
                                                <span className="font-medium">
                                                    {bookings.to}
                                                </span>{" "}
                                                of{" "}
                                                <span className="font-medium">
                                                    {bookings.total}
                                                </span>{" "}
                                                results
                                            </p>
                                        </div>
                                        <div>
                                            <nav
                                                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                                aria-label="Pagination"
                                            >
                                                {bookings.links.map(
                                                    (link, i) => {
                                                        if (link.url === null) {
                                                            return (
                                                                <span
                                                                    key={i}
                                                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: link.label,
                                                                    }}
                                                                />
                                                            );
                                                        }
                                                        return (
                                                            <a
                                                                key={i}
                                                                href="#"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault();
                                                                    router.get(
                                                                        link.url
                                                                    );
                                                                }}
                                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                    link.active
                                                                        ? "z-10 bg-primary border-primary text-white"
                                                                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                                }`}
                                                                dangerouslySetInnerHTML={{
                                                                    __html: link.label,
                                                                }}
                                                            />
                                                        );
                                                    }
                                                )}
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
