// src/pages/NotFound.jsx
import React from 'react';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg w-96 text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-lg mt-4">Oops! Page not found.</p>
        <p className="mt-4">
          <a href="/login" className="text-blue-500">Go back to login</a>
        </p>
      </div>
    </div>
  );
};

export default NotFound;