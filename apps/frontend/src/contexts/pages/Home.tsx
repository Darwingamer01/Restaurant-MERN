import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChefHat, Star, Clock, Users } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Welcome to Restaurant MERN
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience authentic flavors and exceptional dining in the heart of the city. 
            Fresh ingredients, traditional recipes, and modern presentation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/menu">View Our Menu</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/reservations">Make Reservation</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 border rounded-lg">
              <ChefHat className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Expert Chefs</h3>
              <p className="text-muted-foreground">
                Our experienced chefs bring years of culinary expertise to every dish.
              </p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <Star className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">
                Only the finest ingredients sourced from trusted local suppliers.
              </p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <Clock className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Fast Service</h3>
              <p className="text-muted-foreground">
                Quick and efficient service without compromising on quality.
              </p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <Users className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Family Friendly</h3>
              <p className="text-muted-foreground">
                A warm, welcoming atmosphere perfect for families and friends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Dishes</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-orange-400 to-orange-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Butter Chicken</h3>
                <p className="text-muted-foreground mb-4">
                  Tender chicken in rich, creamy tomato-based sauce with aromatic spices.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">₹420</span>
                  <Button size="sm">Order Now</Button>
                </div>
              </div>
            </div>
            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-green-400 to-green-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Paneer Tikka</h3>
                <p className="text-muted-foreground mb-4">
                  Marinated cottage cheese grilled to perfection with bell peppers.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">₹280</span>
                  <Button size="sm">Order Now</Button>
                </div>
              </div>
            </div>
            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-purple-400 to-purple-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Gulab Jamun</h3>
                <p className="text-muted-foreground mb-4">
                  Soft milk dumplings soaked in cardamom-flavored sugar syrup.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">₹160</span>
                  <Button size="sm">Order Now</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
