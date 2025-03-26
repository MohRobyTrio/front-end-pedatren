const NotFound = () => {
    return (
        <section className="bg-gray-900 h-screen flex items-center justify-center">
            <div className="px-4 mx-auto max-w-screen-xl text-center">
                <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-blue-500">404</h1>
                <p className="mb-4 text-3xl tracking-tight font-bold md:text-4xl text-white">Somethings missing.</p>
                <p className="mb-4 text-lg font-light text-gray-400">
                    Sorry, we cant find that page. Youll find lots to explore on the home page.
                </p>
                <a href="/" className="inline-flex text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-blue-900 my-4">
                    Back to Homepage
                </a>
            </div>
        </section>
    );
}

export default NotFound;
