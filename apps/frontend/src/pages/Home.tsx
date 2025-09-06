// apps/frontend/src/pages/Home.tsx
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            🍽️ Welcome to Our Restaurant
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience exceptional dining with our authentic flavors and warm hospitality. 
            Your culinary journey starts here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <div className="space-y-4">
                <p className="text-lg text-gray-700">
                  Welcome back, <span className="font-semibold">{user?.name}</span>! 👋
                </p>
                <Button asChild size="lg">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🍜 Delicious Menu
              </CardTitle>
              <CardDescription>
                Explore our diverse menu with authentic flavors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Coming in Sprint 3! Browse our extensive menu with filtering and search capabilities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📅 Easy Reservations
              </CardTitle>
              <CardDescription>
                Book your table with just a few clicks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Coming in Sprint 3! Make reservations with our intuitive booking system.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🛒 Online Ordering
              </CardTitle>
              <CardDescription>
                Order your favorites for pickup or delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Coming in Sprint 4! Place orders online with secure payment processing.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Authentication Status Demo */}
        <div className="mt-16 text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
              <CardDescription>Sprint 2 Demo - Frontend Auth System</CardDescription>
            </CardHeader>
            <CardContent>
              {isAuthenticated ? (
                <div className="space-y-2">
                  <p className="text-green-600 font-semibold">✅ Authenticated</p>
                  <p className="text-sm">User: {user?.name}</p>
                  <p className="text-sm">Email: {user?.email}</p>
                  <p className="text-sm">Role: {user?.role}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-500">🔒 Not authenticated</p>
                  <p className="text-sm">Sign in or register to access protected features</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
