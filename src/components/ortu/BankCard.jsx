import { useActiveChild } from "./useActiveChild";

// bankcard.jsx
const BankCard = ({ className }) => {
    const { activeChild } = useActiveChild()
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
                    <p className="text-sm text-white/80">Peserta Didik</p>
                </div>

                {/* Card Number */}
                <div className="mb-4">
                    <p className="text-lg font-mono tracking-wider">4756 3216 90</p>
                </div>

                {/* Balance + Brand */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-sm uppercase text-white/70">Saldo</p>
                        <p className="text-2xl font-bold">Rp. 100.000</p>
                    </div>
                    {/* <div className="text-right">
                        <div className="text-xl font-bold italic">VISA</div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default BankCard;
