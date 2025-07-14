import AdminLayout from "@/components/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { Plus, Search, X, PenSquare, Trash2, Filter } from "lucide-react";

export default function RoomIndex({
    rooms = [],
    filters = {},
    buildings = [],
    categories = [],
    facilities = [],
    statuses = [],
    flash = null,
    selectedFaculty = null,
}) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        building_id: filters?.building_id || "",
        category_id: filters?.category_id || "",
        status: filters?.status || "",
        facility_id: filters?.facility_id || "",
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
        setSelectedFilters((prev) => ({ ...prev, [name]: value }));
    };

    const applyFilters = (additionalFilters = {}) => {
        const params = {
            ...selectedFilters,
            ...additionalFilters,
            search: searchTerm,
        };
        router.get(route("admin.ruangan.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setSelectedFilters({
            building_id: "",
            category_id: "",
            status: "",
            facility_id: "",
        });
        setSearchTerm("");
        router.get(
            route("admin.ruangan.index"),
            {},
            { preserveState: false, replace: true }
        );
    };

    const confirmDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete room "${name}"?`)) {
            router.delete(route("admin.ruangan.destroy", id));
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "available":
                return "bg-green-100 text-green-800";
            case "maintenance":
                return "bg-yellow-100 text-yellow-800";
            case "booked":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "available":
                return "Available";
            case "maintenance":
                return "Maintenance";
            case "booked":
                return "Booked";
            default:
                return status;
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-semibold leading-tight text-primary">
                        Room List{" "}
                        {selectedFaculty && `- ${selectedFaculty.faculty_name}`}
                    </h2>
                    <Link
                        href={route("admin.ruangan.create")}
                        className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2 hover:bg-primary-dark transition"
                    >
                        <Plus className="h-5 w-5" />
                        Add Room
                    </Link>
                </div>
            }
        >
            <Head title="Room List" />

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

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-primary-light">
                        <div className="p-4 sm:p-6 text-gray-900">
                            {/* Search and Filters */}
                            <div className="mb-6">
                                <form
                                    onSubmit={handleSearch}
                                    className="flex flex-col sm:flex-row gap-3 mb-4"
                                >
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            placeholder="Search by room name or code"
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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

                                <Transition
                                    show={isFiltersOpen}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 -translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 -translate-y-1"
                                >
                                    <div className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-md border border-primary-light">
                                        <div>
                                            <label
                                                htmlFor="building_id"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Building
                                            </label>
                                            <select
                                                id="building_id"
                                                name="building_id"
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                                                value={
                                                    selectedFilters.building_id
                                                }
                                                onChange={handleFilterChange}
                                            >
                                                <option value="">
                                                    All Buildings
                                                </option>
                                                {buildings?.map((building) => (
                                                    <option
                                                        key={building.id}
                                                        value={building.id}
                                                    >
                                                        {building.building_name}{" "}
                                                        -{" "}
                                                        {
                                                            building.faculty
                                                                ?.faculty_name
                                                        }
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="category_id"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Category
                                            </label>
                                            <select
                                                id="category_id"
                                                name="category_id"
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                                                value={
                                                    selectedFilters.category_id
                                                }
                                                onChange={handleFilterChange}
                                            >
                                                <option value="">
                                                    All Categories
                                                </option>
                                                {categories?.map((category) => (
                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.category_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="facility_id"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Facility
                                            </label>
                                            <select
                                                id="facility_id"
                                                name="facility_id"
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                                                value={
                                                    selectedFilters.facility_id
                                                }
                                                onChange={handleFilterChange}
                                            >
                                                <option value="">
                                                    All Facilities
                                                </option>
                                                {facilities?.map((facility) => (
                                                    <option
                                                        key={facility.id}
                                                        value={facility.id}
                                                    >
                                                        {facility.facility_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
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
                                                {statuses?.map((status) => (
                                                    <option
                                                        key={status}
                                                        value={status}
                                                    >
                                                        {getStatusText(status)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="md:col-span-4 flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={resetFilters}
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                            >
                                                Reset
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

                            {/* Rooms Table */}
                            <div className="overflow-x-auto">
                                {rooms && rooms.length > 0 ? (
                                    <>
                                        {/* Desktop Table */}
                                        <div className="hidden md:block">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-primary-lightborder-primary-light">
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider"
                                                        >
                                                            Actions
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider"
                                                        >
                                                            Name & Location
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider"
                                                        >
                                                            Category
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider"
                                                        >
                                                            Capacity
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider"
                                                        >
                                                            Status
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {rooms.map((room) => (
                                                        <tr
                                                            key={room.id}
                                                            className="hover:bg-background"
                                                        >
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                <div className="flex gap-2">
                                                                    <Link
                                                                        href={route(
                                                                            "admin.ruangan.edit",
                                                                            room.id
                                                                        )}
                                                                        className="text-primary hover:text-primary-dark p-1 rounded-md hover:bg-primary-lightborder-primary-light"
                                                                        title="Edit"
                                                                    >
                                                                        <PenSquare className="h-4 w-4" />
                                                                    </Link>
                                                                    <button
                                                                        onClick={() =>
                                                                            confirmDelete(
                                                                                room.id,
                                                                                room.room_name
                                                                            )
                                                                        }
                                                                        className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50"
                                                                        title="Delete"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div>
                                                                    <div className="text-sm font-medium text-primary">
                                                                        {
                                                                            room.room_name
                                                                        }
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {
                                                                            room
                                                                                .building
                                                                                .building_name
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {
                                                                    room
                                                                        .category
                                                                        .category_name
                                                                }
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                                                                {room.capacity}{" "}
                                                                people
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span
                                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                                                                        room.status
                                                                    )}`}
                                                                >
                                                                    {getStatusText(
                                                                        room.status
                                                                    )}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile Card Layout */}
                                        <div className="md:hidden space-y-4">
                                            {rooms.map((room) => (
                                                <div
                                                    key={room.id}
                                                    className="bg-white border border-primary-light rounded-lg p-4 shadow-sm"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1">
                                                            <h3 className="text-sm font-medium text-primary">
                                                                {room.room_name}
                                                            </h3>
                                                            <p className="text-sm text-gray-500 mb-1">
                                                                {
                                                                    room
                                                                        .building
                                                                        .building_name
                                                                }
                                                            </p>
                                                            <span
                                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(
                                                                    room.status
                                                                )}`}
                                                            >
                                                                {getStatusText(
                                                                    room.status
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-2 ml-2">
                                                            <Link
                                                                href={route(
                                                                    "admin.ruangan.edit",
                                                                    room.id
                                                                )}
                                                                className="text-primary hover:text-primary-dark p-2 rounded-md hover:bg-primary-lightborder-primary-light"
                                                            >
                                                                <PenSquare className="h-4 w-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() =>
                                                                    confirmDelete(
                                                                        room.id,
                                                                        room.room_name
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                                        <div>
                                                            <span className="text-gray-500">
                                                                Category:
                                                            </span>
                                                            <p className="font-medium text-gray-900">
                                                                {
                                                                    room
                                                                        .category
                                                                        .category_name
                                                                }
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">
                                                                Capacity:
                                                            </span>
                                                            <p className="font-medium text-primary">
                                                                {room.capacity}{" "}
                                                                people
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-gray-500">
                                            No room data found
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Simple Pagination Info */}
                            {rooms && rooms.length > 0 && (
                                <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                    <p className="text-sm text-gray-700">
                                        Showing {rooms.length} rooms
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
