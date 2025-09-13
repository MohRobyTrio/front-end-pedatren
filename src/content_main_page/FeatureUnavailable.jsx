import { useNavigate } from "react-router-dom"

const FeatureUnavailable = () => {
    const navigate = useNavigate()

    const handleGoBack = () => {
        navigate(-1)
    }

    return (
        <section className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-6">
            <div className="max-w-md mx-auto text-center space-y-6">
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl flex items-center justify-center shadow-sm">
                            <svg className="w-10 h-10 text-blue-500/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                                />
                            </svg>
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-2xl font-semibold text-foreground">Fitur Sedang Dikembangkan</h1>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                        Kami sedang membangun sesuatu yang menarik untuk Anda. Terima kasih atas kesabarannya!
                    </p>
                </div>

                <div className="flex gap-3 justify-center pt-6">
                    <button
                        onClick={handleGoBack}
                        className="inline-flex items-center text-white justify-center gap-2 px-4 py-2.5 bg-blue-500 text-blue-500-foreground rounded-lg hover:bg-blue-500/90 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali
                    </button>
                </div>
            </div>
        </section>
    )
}

export default FeatureUnavailable
