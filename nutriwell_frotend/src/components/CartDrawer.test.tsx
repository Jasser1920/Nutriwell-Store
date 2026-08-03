import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import CartDrawer from './CartDrawer';
import { useCart } from '@/context/CartContext';

vi.mock('@/context/CartContext', () => ({
  useCart: vi.fn(),
}));

const mockedUseCart = vi.mocked(useCart);

describe('CartDrawer', () => {
  beforeEach(() => {
    mockedUseCart.mockReturnValue({
      cart: [],
      addToCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      cartCount: 0,
      totalTtc: 0,
      isCartOpen: true,
      setIsCartOpen: vi.fn(),
    } as never);
  });

  it('redirects the empty cart CTA to the products page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<CartDrawer />} />
          <Route path="/products" element={<div>Products page</div>} />
        </Routes>
      </MemoryRouter>
    );

    const cta = screen.getByRole('link', { name: /découvrir nos produits/i });

    expect(cta).toHaveAttribute('href', '/products');
  });
});
