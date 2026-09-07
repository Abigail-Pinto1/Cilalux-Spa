 
import React from "react";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-pink-50">
      <h1 className="text-4xl font-bold text-pink-700 mb-4">Oops!</h1>
      <p className="text-lg text-gray-600 mb-2">Something went wrong.</p>
      <p className="text-sm text-gray-500 italic">
        {error.statusText || error.message}
      </p>
      <a href="/" className="mt-4 text-pink-600 hover:underline">Go back home</a>
    </div>
  );
};

export default ErrorPage;
