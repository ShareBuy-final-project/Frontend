import React from 'react';
import HomePage from '../pages/HomePage'; // Import the HomePage component

const Welcome = () => {
  return (
    <div>
      <section className="bg-indigo500 py-32 mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              Welcome to Share Buy
            </h1>
            <p className="my-4 text-xl text-white">
              ShareBuy is a platform for group purchases, helping you save money by teaming up with others!
            </p>
          </div>
        </div>
      </section>
      
      {/* Render the HomePage component here */}
      <HomePage />
    </div>
  );
};

export default Welcome;
