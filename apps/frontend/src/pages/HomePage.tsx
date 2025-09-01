import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Restaurant MERN
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Delicious food, memorable experience
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">🍽️ Menu</h3>
            <p className="text-muted-foreground">
              Explore our delicious dishes
            </p>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">📅 Reservations</h3>
            <p className="text-muted-foreground">
              Book your table in advance
            </p>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">💳 Pay Bill</h3>
            <p className="text-muted-foreground">
              Quick and secure payments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
