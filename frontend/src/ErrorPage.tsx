export const ErrorPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl font-bold">Something went wrong</h1>
            <p className="text-lg">We are sorry, an error occurred. Please try again later or email us at </p>
            <a href="mailto:botwhirl@gmail.com" className="text-blue-500">
                botwhirl@gmail.com
            </a>
        </div>
    )
}
