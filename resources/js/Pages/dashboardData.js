// dashboardData.js
export const primaryMenuItems = [
    {
        id: "reservasi",
        name: "Room Reservation",
        description: "Book classrooms and campus facilities",
        active: true,
        bgColor: "bg-primary",
        hoverColor: "hover:bg-primary-dark",
    },
    {
        id: "jadwal",
        name: "Class Schedule",
        description: "Manage and view class schedules",
        active: true,
        route: "jadwal.index",
        bgColor: "bg-accent",
        hoverColor: "hover:bg-accent-dark",
    },
    {
        id: "ruangan",
        name: "Room List",
        description: "Complete information on available rooms",
        active: true,
        route: "ruangan.index",
        bgColor: "bg-primary-dark",
        hoverColor: "hover:bg-primary",
    },
];

export const secondaryMenuItems = [
    {
        id: "presensi",
        name: "Attendance",
        description: "Attendance and presence system",
        active: false,
    },
    {
        id: "materi",
        name: "Class Materials",
        description: "Upload and access learning materials",
        active: false,
    },
    {
        id: "pengaturan",
        name: "Settings",
        description: "Classroom system configuration",
        active: false,
    },
];

export const pendingRequestsData = [
    {
        id: "RSV567",
        ruangan: "Engineering Faculty Auditorium",
        tanggal: "2025-05-10T13:00:00",
        durasi: "2 hours",
        tujuan: "Technology Seminar",
        status: "Awaiting Approval",
        estimasi: "1-2 working days",
        priority: "high",
    },
    {
        id: "RSV568",
        ruangan: "Room 301 Building B",
        tanggal: "2025-05-15T10:00:00",
        durasi: "3 hours",
        tujuan: "Student Organization Meeting",
        status: "Awaiting Approval",
        estimasi: "1-2 working days",
        priority: "medium",
    },
];

export const activitiesData = [
    {
        icon: "CheckCircle",
        message:
            "Reservation #RSV123 for Computer Laboratory has been approved",
        timestamp: "2025-05-03T09:30:00",
        type: "success",
        details: "Computer Lab A - 2:00 PM-5:00 PM",
    },
    {
        icon: "Calendar",
        message: "Reservation #RSV567 is being processed",
        timestamp: "2025-05-02T14:20:00",
        type: "pending",
        details: "Engineering Faculty Auditorium",
    },
    {
        icon: "CheckCircle",
        message: "Reservation #RSV456 has been completed",
        timestamp: "2025-05-01T16:45:00",
        type: "completed",
        details: "Library Discussion Room",
    },
    {
        icon: "Clock",
        message: "Web Programming class schedule has been updated",
        timestamp: "2025-04-30T11:20:00",
        type: "info",
        details: "Time change: Monday 8:00 AM-10:00 AM",
    },
];

export const statsData = [
    {
        icon: "Calendar",
        title: "Total Reservations",
        value: "128",
        change: "+12%",
        trend: "up",
        bgColor: "bg-primary",
    },
    {
        icon: "CheckCircle",
        title: "Active Reservations",
        value: "12",
        change: "+3",
        trend: "up",
        bgColor: "bg-accent",
    },
    {
        icon: "Clock",
        title: "Pending Processing",
        value: pendingRequestsData.length,
        change: "0",
        trend: "neutral",
        bgColor: "bg-accent-dark",
    },
    {
        icon: "AlertCircle",
        title: "Needs Attention",
        value: "3",
        change: "-1",
        trend: "down",
        bgColor: "bg-red-500",
    },
];
