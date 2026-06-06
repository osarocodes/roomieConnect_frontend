const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 text-base-content text-center">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-2xl mb-8">Oops! The page you're looking for doesn't exist.</p>
            <a href="/home" className="btn btn-primary">
                Go to Home
            </a>
        </div>
    );
}
export default NotFoundPage;