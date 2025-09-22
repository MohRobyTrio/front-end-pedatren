import { useState } from 'react';
import { ArrowLeft, Delete } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PinEntryPage() {
    const navigate = useNavigate();
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [attempts, setAttempts] = useState(0);

    const correctPin = '123456'; // Mock PIN

    const handleNumberClick = (number) => {
        if (pin.length < 6) {
            setPin((prev) => prev + number);
            setError('');
        }
    };

    const onBack = () => {
        window.history.back();
    };

    const handleClear = () => {
        setPin('');
        setError('');
    };

    const handleDelete = () => {
        setPin((prev) => prev.slice(0, -1));
    };

    const handleSubmit = () => {
        if (pin.length !== 6) {
            setError('PIN harus 6 digit');
            return;
        }

        if (pin === correctPin) {
            navigate('/dashboard-anjungan');
        } else {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);

            if (newAttempts >= 3) {
                setError('PIN salah 3 kali. Kartu diblokir sementara.');
            } else {
                setError(`PIN salah. Sisa percobaan: ${3 - newAttempts}`);
            }
            setPin('');
        }
    };

    const numbers = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['Clear', '0', 'Delete'], // OK diganti Delete
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-6">
            <div className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center mb-6">
                        <button
                            onClick={onBack}
                            className="mr-3 p-2 rounded hover:bg-gray-100 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <h1 className="text-xl text-blue-900">Masukkan PIN</h1>
                    </div>

                    {/* PIN Display */}
                    <div className="mb-6">
                        <div className="relative">
                            <div className="bg-gray-100 rounded-lg p-4 text-center mb-2">
                                <div className="flex justify-center items-center space-x-2">
                                    {[...Array(6)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                i < pin.length
                                                    ? 'bg-blue-600 border-blue-600'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="text-red-600 text-sm text-center mt-2 p-2 bg-red-50 rounded">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Numpad */}
                    <div className="grid grid-cols-3 gap-3">
                        {numbers.flat().map((num, index) => {
                            if (num === 'Clear') {
                                return (
                                    <button
                                        key={index}
                                        onClick={handleClear}
                                        disabled={attempts >= 3}
                                        className="h-12 rounded-lg border text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-50"
                                    >
                                        Clear
                                    </button>
                                );
                            }

                            if (num === 'Delete') {
                                return (
                                    <button
                                        key={index}
                                        onClick={handleDelete}
                                        disabled={attempts >= 3 || pin.length === 0}
                                        className="h-12 rounded-lg border text-gray-600 border-blue-200 hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center"
                                    >
                                        <Delete className="w-5 h-5" />
                                    </button>
                                );
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleNumberClick(num)}
                                    disabled={attempts >= 3}
                                    className="h-12 rounded-lg border hover:bg-blue-50 border-blue-200 disabled:opacity-50"
                                >
                                    {num}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tombol OK full width di bawah */}
                    <button
                        onClick={handleSubmit}
                        disabled={pin.length !== 6 || attempts >= 3}
                        className="mt-4 w-full h-12 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                    >
                        OK
                    </button>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Jangan berikan PIN kepada siapapun
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
