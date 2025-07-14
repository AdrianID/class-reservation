import AdminLayout from "@/components/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState, useRef, useCallback, useMemo } from "react";
import {
    XMarkIcon,
    PlusCircleIcon,
    PhotoIcon,
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
                    <h2 className="text-xl font-semibold leading-tight text-primary">
                        Loading...
                    </h2>
                }
            >
                <div className="py-6">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-primary-light">
                            <div className="p-6 text-gray-900">
                                <p>Loading data...</p>
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

        setTimeout(() => {
            put(route("admin.ruangan.update", room.id), {
                onSuccess: () => {
                    if (fileInputRef.current) fileInputRef.current.value = "";
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
                    <h2 className="text-xl font-semibold leading-tight text-primary">
                        Edit Ruangan: {room?.room_name || "Loading..."}
                    </h2>
                </div>
            }
        >
            <Head title="Edit Ruangan" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-primary-light">
                        <div className="p-6 text-gray-900">
                            {!room || !room.id ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">
                                        Loading data ruangan...
                                    </p>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    {/* Basic Information Section */}
                                    <div className="bg-gray-50 p-6 rounded-md border border-primary-light">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            Informasi Dasar
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Room Code */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Kode Ruangan{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                                                        errors.room_code
                                                            ? "border-red-500"
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
                                                    <p className="mt-1 text-sm text-red-500">
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
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Nama Ruangan{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                                                        errors.room_name
                                                            ? "border-red-500"
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
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {errors.room_name}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Building */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Gedung{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <select
                                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                                                        errors.building_id
                                                            ? "border-red-500"
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
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {errors.building_id}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Room Category */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Kategori{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <select
                                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                                                        errors.category_id
                                                            ? "border-red-500"
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
                                                        categories.length > 0 &&
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
                                                            Tidak ada kategori
                                                            tersedia
                                                        </option>
                                                    )}
                                                </select>
                                                {errors.category_id && (
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {errors.category_id}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Capacity */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Kapasitas{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                                                        errors.capacity
                                                            ? "border-red-500"
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
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {errors.capacity}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Status */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Status{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <select
                                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                                                        errors.status
                                                            ? "border-red-500"
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
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {errors.status}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Location Detail & Description */}
                                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Detail Lokasi
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                                                        errors.location_detail
                                                            ? "border-red-500"
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
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {errors.location_detail}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Foto Ruangan (opsional)
                                                </label>
                                                <div className="mt-1 flex items-center">
                                                    <div className="flex-shrink-0 h-16 w-24 border border-gray-300 rounded-md overflow-hidden">
                                                        {imagePreview ? (
                                                            <img
                                                                src={
                                                                    imagePreview
                                                                }
                                                                alt="Room preview"
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                                                                <PhotoIcon className="h-8 w-8 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4 flex">
                                                        <div className="relative bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm flex items-center cursor-pointer hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                                            <label className="relative text-sm font-medium text-primary pointer-events-none">
                                                                <span>
                                                                    Ganti gambar
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
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {errors.image}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Deskripsi
                                            </label>
                                            <textarea
                                                rows="3"
                                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                                                    errors.description
                                                        ? "border-red-500"
                                                        : ""
                                                }`}
                                                value={data.description || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Informasi tambahan tentang ruangan"
                                            ></textarea>
                                            {errors.description && (
                                                <p className="mt-1 text-sm text-red-500">
                                                    {errors.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Facilities Section */}
                                    <div className="bg-gray-50 p-6 rounded-md border border-primary-light">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                Fasilitas Ruangan
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={addFacility}
                                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                            >
                                                <PlusCircleIcon className="h-4 w-4 mr-1" />
                                                Tambah Fasilitas
                                            </button>
                                        </div>

                                        {roomFacilities &&
                                        roomFacilities.length > 0 ? (
                                            roomFacilities.map(
                                                (facility, index) => (
                                                    <div
                                                        key={index}
                                                        className="border border-gray-200 rounded-md p-4 mb-4"
                                                    >
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h4 className="text-sm font-medium text-gray-700">
                                                                Fasilitas #
                                                                {index + 1}
                                                            </h4>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeFacility(
                                                                        index
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                <XMarkIcon className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700">
                                                                    Jenis
                                                                    Fasilitas{" "}
                                                                    <span className="text-red-500">
                                                                        *
                                                                    </span>
                                                                </label>
                                                                <select
                                                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                                                                        errors[
                                                                            `facilities.${index}.facility_id`
                                                                        ]
                                                                            ? "border-red-500"
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
                                                                    <p className="mt-1 text-sm text-red-500">
                                                                        {
                                                                            errors[
                                                                                `facilities.${index}.facility_id`
                                                                            ]
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700">
                                                                    Jumlah{" "}
                                                                    <span className="text-red-500">
                                                                        *
                                                                    </span>
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                                                                        errors[
                                                                            `facilities.${index}.quantity`
                                                                        ]
                                                                            ? "border-red-500"
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
                                                                    <p className="mt-1 text-sm text-red-500">
                                                                        {
                                                                            errors[
                                                                                `facilities.${index}.quantity`
                                                                            ]
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="mt-2">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Catatan
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                                                                    errors[
                                                                        `facilities.${index}.notes`
                                                                    ]
                                                                        ? "border-red-500"
                                                                        : ""
                                                                }`}
                                                                value={
                                                                    facility?.notes ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    updateFacility(
                                                                        index,
                                                                        "notes",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="Catatan tambahan tentang fasilitas"
                                                            />
                                                            {errors[
                                                                `facilities.${index}.notes`
                                                            ] && (
                                                                <p className="mt-1 text-sm text-red-500">
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
                                            )
                                        ) : (
                                            <div className="text-center py-4">
                                                <p className="text-gray-500">
                                                    Tidak ada fasilitas tersedia
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                                                processing
                                                    ? "opacity-75 cursor-not-allowed"
                                                    : ""
                                            }`}
                                        >
                                            {processing
                                                ? "Menyimpan..."
                                                : "Perbarui Ruangan"}
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
