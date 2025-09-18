import {
    Receipt,
    FileText,
    Wallet,
    BookOpen,
    Calendar,
    GraduationCap,
    AlertTriangle,
    Settings,
    MessageSquare
} from "lucide-react";
import BankCard from "../../components/ortu/BankCard";
import ServiceItem from "../../components/ortu/ServiceItem";

export const DashboardPage = () => {
    const services = [
        {
            title: "Transaksi",
            subtitle: "Riwayat transaksi",
            icon: Wallet,
            iconColor: "text-purple-500 bg-purple-100",
            href: "/wali/transaksi",
        },
        {
            title: "Hafalan",
            subtitle: `Tahfidz & Nadhoman`,
            icon: BookOpen,
            iconColor: "text-emerald-500 bg-emerald-100",
            href: "/wali/hafalan",
        },
        {
            title: "Presensi",
            subtitle: "Kehadiran",
            icon: Calendar,
            iconColor: "text-blue-500 bg-blue-100",
            href: "/wali/presensi",
        },
        {
            title: "Pesan",
            subtitle: "Kirim pesan ke santri",
            icon: MessageSquare,
            iconColor: "text-pink-500 bg-pink-100",
            href: "/wali/pesan",
        },
        {
            title: "Akademik",
            subtitle: "Nilai rata-rata",
            icon: GraduationCap,
            iconColor: "text-blue-500 bg-blue-100",
            href: "/wali/akademik",
        },
        {
            title: "Perizinan",
            subtitle: "Status izin",
            icon: FileText,
            iconColor: "text-green-500 bg-green-100",
            href: "/wali/perizinan",
        },
        {
            title: "Pelanggaran",
            subtitle: "Bulan ini",
            icon: AlertTriangle,
            iconColor: "text-orange-500 bg-orange-100",
            href: "/wali/pelanggaran",
        },
        {
            title: "Tagihan",
            subtitle: "Pengaturan",
            icon: Receipt,
            iconColor: "text-red-500 bg-red-100",
            href: "/wali/tagihan",
        },
        {
            title: "Batas Pengeluaran",
            subtitle: "Pengaturan",
            icon: Settings,
            iconColor: "text-gray-500 bg-gray-100",
            href: "/wali/batas-pengeluaran",
        },
    ]

    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 10) {
            return "Selamat Pagi";
        } else if (hour >= 10 && hour < 15) {
            return "Selamat Siang";
        } else if (hour >= 15 && hour < 18) {
            return "Selamat Sore";
        } else {
            return "Selamat Malam";
        }
    };

    return (
        <div className="bg-background">
            <div className="max-w-md mx-auto p-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        {getGreeting() || "Halo"}, Wali Santri!
                    </h1>
                    <h2 className="text-2xl font-bold text-foreground">
                    </h2>
                </div>

                {/* Bank Card */}
                <div className="mb-8">
                    <BankCard />
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-3 gap-4">
                    {services.map((service, index) => (
                        <ServiceItem
                            key={index}
                            icon={service.icon}
                            title={service.title}
                            subtitle={service.subtitle}
                            iconColor={service.iconColor}
                            href={service.href}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

