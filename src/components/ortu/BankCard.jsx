import { toast } from "sonner";
import useFetchDashboardOrtu from "../../hooks/hooks_ortu/Dashboard";
import { useActiveChild } from "./useActiveChild";

// bankcard.jsx
const BankCard = ({ className }) => {
    const { activeChild } = useActiveChild()
    const { data, error, loading } = useFetchDashboardOrtu();

    const formatRupiah = (value) => {
        if (typeof value !== 'number' || isNaN(value)) return "-";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            // maximumFractionDigits: 0,
        }).format(value);
    };

    if (error) {
        toast.error("Gagal memuat saldo");
    }

    return (
        <div
            className={`relative overflow-hidden rounded-2xl p-6 text-white 
      shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] 
      bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-600 
      ${className || ''}`}
        >
            {/* Background decorative elements */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-xl" />
            <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-white/5 blur-md" />

            <div className="relative z-10">
                {/* Card Holder */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold">{activeChild?.nama || "User"}</h3>
                    <p className="text-sm text-white/80">Santri</p>
                </div>

                {/* Card Number */}
                <div className="mb-4">
                    <p className="text-lg font-mono tracking-wider">{activeChild?.nis || "-"}</p>
                </div>

                {/* Balance + Brand */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-sm uppercase text-white/70">Saldo</p>
                        <p className="text-2xl font-bold">{loading ? (
                            <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : error ? (
                            "-"
                        ) : (
                            formatRupiah(parseFloat(data?.data?.saldo))
                        )}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BankCard;
