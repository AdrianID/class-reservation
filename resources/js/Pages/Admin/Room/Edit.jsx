// File: RoomEdit.jsx
import AdminLayout from "@/components/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState, useRef, useCallback, useMemo } from "react";
import {
    XMarkIcon,
    PlusCircleIcon,
    PhotoIcon,
    BuildingOfficeIcon,
    MapPinIcon,
    UserGroupIcon,
    QueueListIcon,
    InformationCircleIcon,
    ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function RoomEdit({
    room = {},
    faculties = [],
    buildings = [],
    categories = [],
    facilities = [],
}) {
    if (!room || Object.keys(room).length === 0) {
        return (
            <AdminLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Memuat Ruangan...
                    </h2>
                }
            >
                <div className="py-6">
                    <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-8 text-center">
                                <div className="flex justify-center">
                                    <ArrowPathIcon className="h-10 w-10 text-gray-400 animate-spin" />
                                </div>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">
                                    Memuat data ruangan
                                </h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Sedang mengambil data ruangan dari server...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(
        room?.image_path ? `/storage/${room.image_path}` : null
    );
    const [roomFacilities, setRoomFacilities] = useState(
        room?.facilities_list && room.facilities_list.length > 0
            ? room.facilities_list
            : []
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Refs untuk immediate values
    const capacityRef = useRef(room.capacity || "");
    const roomCodeRef = useRef(room.room_code || "");
    const roomNameRef = useRef(room.room_name || "");

    const { data, setData, put, processing, errors } = useForm({
        building_id: room.building_id || "",
        category_id: room.category_id || "",
        room_code: room.room_code || "",
        room_name: room.room_name || "",
        location_detail: room.location_detail || "",
        capacity: room.capacity || "",
        description: room.description || "",
        status: room.status || "available",
        image: null,
        facilities: roomFacilities,
    });

    // Debounced input handlers
    const debouncedSetData = useCallback(
        (key, value) => {
            setTimeout(() => {
                setData(key, value);
            }, 0);
        },
        [setData]
    );

    // Handle input dengan ref
    const handleInputChange = useCallback(
        (field, value) => {
            if (field === "capacity") capacityRef.current = value;
            else if (field === "room_code") roomCodeRef.current = value;
            else if (field === "room_name") roomNameRef.current = value;

            debouncedSetData(field, value);
        },
        [debouncedSetData]
    );

    // Handle quantity input untuk facilities
    const handleQuantityChange = useCallback(
        (index, value) => {
            const newFacilities = [...roomFacilities];
            newFacilities[index].quantity = value;
            setRoomFacilities(newFacilities);
            debouncedSetData("facilities", newFacilities);
        },
        [roomFacilities, debouncedSetData]
    );

    // Add more facility fields
    const addFacility = () => {
        const newFacilities = [
            ...roomFacilities,
            { facility_id: "", quantity: 1, notes: "" },
        ];
        setRoomFacilities(newFacilities);
        setData("facilities", newFacilities);
    };

    // Remove facility field
    const removeFacility = (index) => {
        const newFacilities = [...roomFacilities];
        newFacilities.splice(index, 1);
        setRoomFacilities(newFacilities);
        setData("facilities", newFacilities);
    };

    // Update facility fields
    const updateFacility = (index, field, value) => {
        const newFacilities = [...roomFacilities];
        newFacilities[index][field] = value;
        setRoomFacilities(newFacilities);
        setData("facilities", newFacilities);
    };

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    // Pre-submit validation
    const validateForm = () => {
        if (capacityRef.current !== data.capacity)
            setData("capacity", capacityRef.current);
        if (roomCodeRef.current !== data.room_code)
            setData("room_code", roomCodeRef.current);
        if (roomNameRef.current !== data.room_name)
            setData("room_name", roomNameRef.current);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        validateForm();
        setIsSubmitting(true);

        setTimeout(() => {
            put(route("admin.ruangan.update", room.id), {
                onSuccess: () => {
                    if (fileInputRef.current) fileInputRef.current.value = "";
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            });
        }, 100);
    };

    // Filter buildings
    const filteredBuildings = useMemo(() => {
        if (!buildings || !Array.isArray(buildings)) return [];
        return buildings;
    }, [buildings]);

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Edit Ruangan:{" "}
                        <span className="text-primary">
                            {room?.room_name || "Loading..."}
                        </span>
                    </h2>
                </div>
            }
        >
            <Head title="Edit Ruangan" />

            <div className="py-6">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6">
                            {!room || !room.id ? (
                                <div className="text-center py-8">
                                    <div className="flex justify-center">
                                        <ArrowPathIcon className="h-10 w-10 text-gray-400 animate-spin" />
                                    </div>
                                    <p className="mt-4 text-gray-600">
                                        Memuat data ruangan...
                                    </p>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    {/* Basic Information Section */}
                                    <div>
                                        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                Informasi Dasar
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Perbarui informasi dasar ruangan
                                            </p>
                                        </div>

                                        <div className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Room Code */}
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                                        <QueueListIcon className="h-4 w-4 mr-2 text-gray-500" />
                                                        Kode Ruangan{" "}
                                                        <span className="text-red-500 ml-1">
                                                            *
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                                                            errors.room_code
                                                                ? "border-red-300"
                                                                : ""
                                                        }`}
                                                        defaultValue={
                                                            data.room_code || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                "room_code",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Contoh: R101"
                                                    />
                                                    {errors.room_code && (
                                                        <p className="mt-1 text-sm text-red-500 flex items-center">
                                                            <InformationCircleIcon className="h-4 w-4 mr-1" />
                                                            {errors.room_code}
                                                        </p>
                                                    )}
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Kode unik untuk ruangan.
                                                        Pastikan tidak ada
                                                        duplikasi.
                                                    </p>
                                                </div>

                                                {/* Room Name */}
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                                        <BuildingOfficeIcon className="h-4 w-4 mr-2 text-gray-500" />
                                                        Nama Ruangan{" "}
                                                        <span className="text-red-500 ml-1">
                                                            *
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                                                            errors.room_name
                                                                ? "border-red-300"
                                                                : ""
                                                        }`}
                                                        defaultValue={
                                                            data.room_name || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                "room_name",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Contoh: Ruang Kuliah 101"
                                                    />
                                                    {errors.room_name && (
                                                        <p className="mt-1 text-sm text-red-500 flex items-center">
                                                            <InformationCircleIcon className="h-4 w-4 mr-1" />
                                                            {errors.room_name}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Building */}
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                                        <BuildingOfficeIcon className="h-4 w-4 mr-2 text-gray-500" />
                                                        Gedung{" "}
                                                        <span className="text-red-500 ml-1">
                                                            *
                                                        </span>
                                                    </label>
                                                    <select
                                                        className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                                                            errors.building_id
                                                                ? "border-red-300"
                                                                : ""
                                                        }`}
                                                        value={data.building_id}
                                                        onChange={(e) =>
                                                            setData(
                                                                "building_id",
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="">
                                                            Pilih Gedung
                                                        </option>
                                                        {filteredBuildings &&
                                                            filteredBuildings.length >
                                                                0 &&
                                                            filteredBuildings.map(
                                                                (building) => (
                                                                    <option
                                                                        key={
                                                                            building.id
                                                                        }
                                                                        value={
                                                                            building.id
                                                                        }
                                                                    >
                                                                        {
                                                                            building.building_name
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        {(!filteredBuildings ||
                                                            filteredBuildings.length ===
                                                                0) && (
                                                            <option
                                                                value=""
                                                                disabled
                                                            >
                                                                Tidak ada gedung
                                                                tersedia
                                                            </option>
                                                        )}
                                                    </select>
                                                    {errors.building_id && (
                                                        <p className="mt-1 text-sm text-red-500 flex items-center">
                                                            <InformationCircleIcon className="h-4 w-4 mr-1" />
                                                            {errors.building_id}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Room Category */}
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                                        <QueueListIcon className="h-4 w-4 mr-2 text-gray-500" />
                                                        Kategori{" "}
                                                        <span className="text-red-500 ml-1">
                                                            *
                                                        </span>
                                                    </label>
                                                    <select
                                                        className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                                                            errors.category_id
                                                                ? "border-red-300"
                                                                : ""
                                                        }`}
                                                        value={data.category_id}
                                                        onChange={(e) =>
                                                            setData(
                                                                "category_id",
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="">
                                                            Pilih Kategori
                                                        </option>
                                                        {categories &&
                                                            categories.length >
                                                                0 &&
                                                            categories.map(
                                                                (category) => (
                                                                    <option
                                                                        key={
                                                                            category.id
                                                                        }
                                                                        value={
                                                                            category.id
                                                                        }
                                                                    >
                                                                        {
                                                                            category.category_name
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        {(!categories ||
                                                            categories.length ===
                                                                0) && (
                                                            <option
                                                                value=""
                                                                disabled
                                                            >
                                                                Tidak ada
                                                                kategori
                                                                tersedia
                                                            </option>
                                                        )}
                                                    </select>
                                                    {errors.category_id && (
                                                        <p className="mt-1 text-sm text-red-500 flex items-center">
                                                            <InformationCircleIcon className="h-4 w-4 mr-1" />
                                                            {errors.category_id}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Capacity */}
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                                        <UserGroupIcon className="h-4 w-4 mr-2 text-gray-500" />
                                                        Kapasitas{" "}
                                                        <span className="text-red-500 ml-1">
                                                            *
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                                                            errors.capacity
                                                                ? "border-red-300"
                                                                : ""
                                                        }`}
                                                        defaultValue={
                                                            data.capacity || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                "capacity",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Jumlah orang"
                                                    />
                                                    {errors.capacity && (
                                                        <p className="mt-1 text-sm text-red-500 flex items-center">
                                                            <InformationCircleIcon className="h-4 w-4 mr-1" />
                                                            {errors.capacity}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Status */}
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                                        <InformationCircleIcon className="h-4 w-4 mr-2 text-gray-500" />
                                                        Status{" "}
                                                        <span className="text-red-500 ml-1">
                                                            *
                                                        </span>
                                                    </label>
                                                    <select
                                                        className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                                                            errors.status
                                                                ? "border-red-300"
                                                                : ""
                                                        }`}
                                                        value={data.status}
                                                        onChange={(e) =>
                                                            setData(
                                                                "status",
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="available">
                                                            Tersedia
                                                        </option>
                                                        <option value="maintenance">
                                                            Maintenance
                                                        </option>
                                                        <option value="booked">
                                                            Terpesan
                                                        </option>
                                                    </select>
                                                    {errors.status && (
                                                        <p className="mt-1 text-sm text-red-500 flex items-center">
                                                            <InformationCircleIcon className="h-4 w-4 mr-1" />
                                                            {errors.status}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Location Detail & Description */}
                                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                                        <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" />
                                                        Detail Lokasi
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                                                            errors.location_detail
                                                                ? "border-red-300"
                                                                : ""
                                                        }`}
                                                        value={
                                                            data.location_detail ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "location_detail",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Contoh: Lantai 1, Sayap Timur"
                                                    />
                                                    {errors.location_detail && (
                                                        <p className="mt-1 text-sm text-red-500 flex items-center">
                                                            <InformationCircleIcon className="h-4 w-4 mr-1" />
                                                            {
                                                                errors.location_detail
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                                        <PhotoIcon className="h-4 w-4 mr-2 text-gray-500" />
                                                        Foto Ruangan (opsional)
                                                    </label>
                                                    <div className="mt-1 flex items-center">
                                                        <div className="flex-shrink-0 h-20 w-28 border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                                                            {imagePreview ? (
                                                                <img
                                                                    src={
                                                                        imagePreview
                                                                    }
                                                                    alt="Room preview"
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="h-full w-full bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                                                                    <PhotoIcon className="h-8 w-8" />
                                                                    <span className="text-xs mt-1">
                                                                        No image
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4 flex">
                                                            <div className="relative bg-white py-2 px-3 border border-gray-300 rounded-lg shadow-sm flex items-center cursor-pointer hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                                                <label className="relative text-sm font-medium text-primary flex items-center">
                                                                    <span>
                                                                        Ganti
                                                                        Gambar
                                                                    </span>
                                                                </label>
                                                                <input
                                                                    type="file"
                                                                    className="sr-only"
                                                                    ref={
                                                                        fileInputRef
                                                                    }
                                                                    onChange={
                                                                        handleImageChange
                                                                    }
                                                                    accept="image/*"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {errors.image && (
                                                        <p className="mt-1 text-sm text-red-500 flex items-center">
                                                            <InformationCircleIcon className="h-4 w-4 mr-1" />
                                                            {errors.image}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-6 space-y-1">
                                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                                    <InformationCircleIcon className="h-4 w-4 mr-2 text-gray-500" />
                                                    Deskripsi Ruangan
                                                </label>
                                                <textarea
                                                    rows="3"
                                                    className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                                                        errors.description
                                                            ? "border-red-300"
                                                            : ""
                                                    }`}
                                                    value={
                                                        data.description || ""
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "description",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Informasi tambahan tentang ruangan"
                                                ></textarea>
                                                {errors.description && (
                                                    <p className="mt-1 text-sm text-red-500 flex items-center">
                                                        <InformationCircleIcon className="h-4 w-4 mr-1" />
                                                        {errors.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Facilities Section */}
                                    <div>
                                        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    Fasilitas Ruangan
                                                </h3>
                                                <button
                                                    type="button"
                                                    onClick={addFacility}
                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                                >
                                                    <PlusCircleIcon className="h-4 w-4 mr-1" />
                                                    Tambah Fasilitas
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Kelola fasilitas yang tersedia
                                                di ruangan ini
                                            </p>
                                        </div>

                                        <div className="p-6">
                                            {roomFacilities &&
                                            roomFacilities.length > 0 ? (
                                                <div className="space-y-4">
                                                    {roomFacilities.map(
                                                        (facility, index) => (
                                                            <div
                                                                key={index}
                                                                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                                                            >
                                                                <div className="flex justify-between items-center mb-3">
                                                                    <h4 className="text-sm font-medium text-gray-700 flex items-center">
                                                                        <QueueListIcon className="h-4 w-4 mr-2 text-gray-500" />
                                                                        Fasilitas
                                                                        #
                                                                        {index +
                                                                            1}
                                                                    </h4>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            removeFacility(
                                                                                index
                                                                            )
                                                                        }
                                                                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                                                                        title="Hapus fasilitas"
                                                                    >
                                                                        <XMarkIcon className="h-5 w-5" />
                                                                    </button>
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div className="space-y-1">
                                                                        <label className="block text-xs font-medium text-gray-600">
                                                                            Jenis
                                                                            Fasilitas{" "}
                                                                            <span className="text-red-500">
                                                                                *
                                                                            </span>
                                                                        </label>
                                                                        <select
                                                                            className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                                                                                errors[
                                                                                    `facilities.${index}.facility_id`
                                                                                ]
                                                                                    ? "border-red-300"
                                                                                    : ""
                                                                            }`}
                                                                            value={
                                                                                facility?.facility_id ||
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateFacility(
                                                                                    index,
                                                                                    "facility_id",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                        >
                                                                            <option value="">
                                                                                Pilih
                                                                                Fasilitas
                                                                            </option>
                                                                            {facilities &&
                                                                                facilities.length >
                                                                                    0 &&
                                                                                facilities.map(
                                                                                    (
                                                                                        fac
                                                                                    ) => (
                                                                                        <option
                                                                                            key={
                                                                                                fac.id
                                                                                            }
                                                                                            value={
                                                                                                fac.id
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                fac.facility_name
                                                                                            }{" "}
                                                                                            (
                                                                                            {
                                                                                                fac.facility_code
                                                                                            }

                                                                                            )
                                                                                        </option>
                                                                                    )
                                                                                )}
                                                                            {(!facilities ||
                                                                                facilities.length ===
                                                                                    0) && (
                                                                                <option
                                                                                    value=""
                                                                                    disabled
                                                                                >
                                                                                    Tidak
                                                                                    ada
                                                                                    fasilitas
                                                                                    tersedia
                                                                                </option>
                                                                            )}
                                                                        </select>
                                                                        {errors[
                                                                            `facilities.${index}.facility_id`
                                                                        ] && (
                                                                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                                                                <InformationCircleIcon className="h-4 w-4 mr-1" />
                                                                                {
                                                                                    errors[
                                                                                        `facilities.${index}.facility_id`
                                                                                    ]
                                                                                }
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <label className="block text-xs font-medium text-gray-600">
                                                                            Jumlah{" "}
                                                                            <span className="text-red-500">
                                                                                *
                                                                            </span>
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            min="1"
                                                                            className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                                                                                errors[
                                                                                    `facilities.${index}.quantity`
                                                                                ]
                                                                                    ? "border-red-300"
                                                                                    : ""
                                                                            }`}
                                                                            defaultValue={
                                                                                facility.quantity ||
                                                                                1
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleQuantityChange(
                                                                                    index,
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                        />
                                                                        {errors[
                                                                            `facilities.${index}.quantity`
                                                                        ] && (
                                                                            <p className="mt-1 text-sm text-red-500 flex items-center">
                                                                                <InformationCircleIcon className="h-4 w-4 mr-1" />
                                                                                {
                                                                                    errors[
                                                                                        `facilities.${index}.quantity`
                                                                                    ]
                                                                                }
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="mt-4 space-y-1">
                                                                    <label className="block text-xs font-medium text-gray-600">
                                                                        Catatan
                                                                        Tambahan
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                                                                            errors[
                                                                                `facilities.${index}.notes`
                                                                            ]
                                                                                ? "border-red-300"
                                                                                : ""
                                                                        }`}
                                                                        value={
                                                                            facility?.notes ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            updateFacility(
                                                                                index,
                                                                                "notes",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        placeholder="Catatan tambahan tentang fasilitas"
                                                                    />
                                                                    {errors[
                                                                        `facilities.${index}.notes`
                                                                    ] && (
                                                                        <p className="mt-1 text-sm text-red-500 flex items-center">
                                                                            <InformationCircleIcon className="h-4 w-4 mr-1" />
                                                                            {
                                                                                errors[
                                                                                    `facilities.${index}.notes`
                                                                                ]
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                                    <QueueListIcon className="h-12 w-12 mx-auto text-gray-400" />
                                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                                        Belum ada fasilitas
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Tambahkan fasilitas yang
                                                        tersedia di ruangan ini
                                                    </p>
                                                    <div className="mt-6">
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                addFacility
                                                            }
                                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                                        >
                                                            <PlusCircleIcon className="h-5 w-5 mr-1" />
                                                            Tambah Fasilitas
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
                                        <button
                                            type="reset"
                                            className="inline-flex justify-center py-2.5 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                        >
                                            Batalkan Perubahan
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={
                                                processing || isSubmitting
                                            }
                                            className={`inline-flex justify-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                                                processing || isSubmitting
                                                    ? "opacity-75 cursor-not-allowed"
                                                    : ""
                                            }`}
                                        >
                                            {processing || isSubmitting ? (
                                                <>
                                                    <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                "Perbarui Ruangan"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
