import AdminLayout from "@/components/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";

export default function RoomCreate() {
    return (
        <AdminLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Tambah Ruangan Baru
                </h2>
            }
        >
            <Head title="Tambah Ruangan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <p>Form tambah ruangan akan ditampilkan di sini</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
