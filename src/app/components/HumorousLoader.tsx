import React, { useState, useEffect } from 'react';

const HumorousLoader: React.FC = () => {
    const [currentText, setCurrentText] = useState<number>(0);

    const humorousTexts: string[] = [
        "Our team is dribbling through the paperwork!",
        "Booking your venue faster than a tennis serve!",
        "Sweating the details so you don't have to!",
        "Coordinating with our sports ninjas...",
        "Measuring the field to perfection!",
        "Inflating balls and expectations simultaneously!"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentText((prev) => (prev + 1) % humorousTexts.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [humorousTexts.length]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-yellow-200 via-yellow-50 via-60% to-yellow-400 transition-colors duration-700">
            <div className="flex flex-col items-center p-10 bg-white/90 rounded-3xl shadow-2xl max-w-lg mx-4 border border-yellow-300 backdrop-blur-md">
                {/* Animated Loader */}
                <div className="relative mb-8">
                    {/* Outer ring */}
                    <div className="w-24 h-24 border-8 border-yellow-400 border-t-transparent rounded-full animate-spin-fast shadow-lg"></div>
                    {/* Middle ring */}
                    <div className="absolute top-2 left-2 w-20 h-20 border-6 border-black border-b-transparent rounded-full animate-spin-medium opacity-80"></div>
                    {/* Inner ring */}
                    <div className="absolute top-5 left-5 w-14 h-14 border-4 border-yellow-600 border-l-transparent rounded-full animate-spin-slow opacity-70"></div>
   
                </div>
                <h2 className="text-3xl font-extrabold text-black-700 mb-3 text-center drop-shadow">
                    Submitting your venue...
                </h2>
                <p
                    key={currentText}
                    className="text-lg text-gray-500 mb-6 text-center font-medium min-h-[48px] transition-all duration-500 opacity-100 animate-fade-in"
                >
                    {humorousTexts[currentText]}
                </p>
                <style>
                    {`
                    @keyframes fade-in {
                        0% { opacity: 0; transform: translateY(16px);}
                        100% { opacity: 1; transform: translateY(0);}
                    }
                    .animate-fade-in {
                        animation: fade-in 0.6s cubic-bezier(.4,0,.2,1);
                    }
                    `}
                </style>
                <p className="text-sm text-gray-500 text-center">
                    This usually takes just a moment.<br />Thanks for your patience!
                </p>
            </div>
            <style>
                {`
                .animate-spin-fast {
                    animation: spin 0.8s linear infinite;
                }
                .animate-spin-medium {
                    animation: spin 1.5s linear infinite;
                }
                .animate-spin-slow {
                    animation: spin 2.5s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg);}
                    100% { transform: rotate(360deg);}
                }
                .animate-bounce-soccer-smooth {
                    animation: bounce-soccer-smooth 1.2s cubic-bezier(.68,-0.55,.27,1.55) infinite;
                    display: inline-block;
                }
                @keyframes bounce-soccer-smooth {
                    0%, 100% { transform: translateY(0);}
                    10% { transform: translateY(-22px);}
                    20% { transform: translateY(-28px);}
                    30% { transform: translateY(-22px);}
                    40% { transform: translateY(-10px);}
                    50%, 60% { transform: translateY(0);}
                    70% { transform: translateY(-6px);}
                    80%, 90% { transform: translateY(0);}
                }
                `}
            </style>
        </div>
    );
};

export default HumorousLoader;
