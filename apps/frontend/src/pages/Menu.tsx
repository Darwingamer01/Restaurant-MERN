import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dish } from '@restaurant/shared';

const Menu: React.FC = () => {
  const [filters, setFilters] = useState({
    category: '',
    cuisine: '',
    isVegetarian: false
  });

  const { data: dishesResponse, isLoading, error } = useQuery({
    queryKey: ['dishes', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.cuisine) params.append('cuisine', filters.cuisine);
      if (filters.isVegetarian) params.append('isVegetarian', 'true');
      
      const response = await api.get(`/dishes?${params.toString()}`);
      return response.data;
    }
  });

  const dishes = dishesResponse?.data?.items || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading menu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-500">Failed to load menu</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Our Menu</h1>
        <p className="text-lg text-muted-foreground">
          Discover our delicious selection of authentic dishes
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center">
        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Categories</option>
          <option value="appetizer">Appetizers</option>
          <option value="main">Main Course</option>
          <option value="dessert">Desserts</option>
          <option value="beverage">Beverages</option>
          <option value="special">Specials</option>
        </select>

        <select
          value={filters.cuisine}
          onChange={(e) => setFilters(prev => ({ ...prev, cuisine: e.target.value }))}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Cuisines</option>
          <option value="indian">Indian</option>
          <option value="chinese">Chinese</option>
          <option value="continental">Continental</option>
          <option value="italian">Italian</option>
          <option value="mexican">Mexican</option>
          <option value="thai">Thai</option>
        </select>

        <label className="flex items-center space-x-2 px-4 py-2 border rounded-md">
          <input
            type="checkbox"
            checked={filters.isVegetarian}
            onChange={(e) => setFilters(prev => ({ ...prev, isVegetarian: e.target.checked }))}
            className="form-checkbox"
          />
          <span>Vegetarian Only</span>
        </label>
      </div>

      {/* Menu Items */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map((dish: Dish) => (
          <div key={dish._id} className="bg-card border rounded-lg overflow-hidden shadow-lg">
            <div className="h-48 bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {dish.name}
              </span>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{dish.name}</h3>
                <span className="text-lg font-bold text-primary">₹{dish.price}</span>
              </div>
              
              <p className="text-muted-foreground mb-4 text-sm">
                {dish.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
                  {dish.category}
                </span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
                  {dish.cuisine}
                </span>
                {dish.isVegetarian && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Vegetarian
                  </span>
                )}
                {dish.isVegan && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Vegan
                  </span>
                )}
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {dish.spiceLevel}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  ⭐ {dish.averageRating.toFixed(1)} ({dish.totalReviews} reviews)
                </div>
                <Button size="sm">
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {dishes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No dishes found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Menu;
