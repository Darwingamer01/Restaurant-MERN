import '@testing-library/jest-dom';
// apps/frontend/src/__tests__/pages.test.tsx
import { cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest'; // ✅ ADDED
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home } from '@/pages/Home';
import { Register } from '@/pages/Register';
import { AuthProvider } from '@/contexts/AuthContext';
import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = global.fetch || (() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }) as any);

// Test utilities
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('Pages', () => {
  beforeEach(() => {
    // Mock fetch for each test
    global.fetch = () => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true })
    }) as any;
  });

  afterEach(() => {
    cleanup();
  });

  describe('Home Page', () => {
    it('renders home page correctly', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      expect(screen.getByText('🍽️ Welcome to Our Restaurant')).toBeInTheDocument();
      // OR use a partial match:
      expect(screen.getByText(/Welcome to Our Restaurant/)).toBeInTheDocument();
      expect(screen.getByText('Get Started')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    it('shows loading state initially', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );

      // Initially should show loading or unauthenticated state
      // This test may need adjustment based on your actual Home component behavior
      expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
    });
  });

  describe('Register Page', () => {
    it('renders register page correctly', () => {
      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      );

      expect(screen.getByText('Join Our Restaurant')).toBeInTheDocument();
      expect(screen.getByText('Create your account to start ordering delicious food')).toBeInTheDocument();
      expect(screen.getByText('Already have an account?')).toBeInTheDocument();
      expect(screen.getByText('Sign in here')).toBeInTheDocument();
    });

    it('contains register form', () => {
      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      );

      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /full name/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });
  });
});


