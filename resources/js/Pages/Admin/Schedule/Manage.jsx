import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";

export default function ScheduleManage() {
    return (
        <AdminLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Daftar Ruangan
                </h2>
            }
        >
            <Head title="Atur Jadwal" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <p>atur semua jadwal di sini</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
