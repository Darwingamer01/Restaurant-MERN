// apps/frontend/src/pages/Dashboard.tsx
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome back, {user?.name}! 👋</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>🍽️ Menu</CardTitle>
            <CardDescription>Browse our delicious offerings</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Coming in Sprint 3!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📅 Reservations</CardTitle>
            <CardDescription>Book your table</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Coming in Sprint 3!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🛒 Orders</CardTitle>
            <CardDescription>Your order history</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Coming in Sprint 3!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
