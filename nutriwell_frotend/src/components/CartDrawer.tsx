import React from "react";
import { useCart } from "@/context/CartContext";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const formatPrice = (price: number) => {
  if (price === 0) return "Sur devis";
  return `${price.toFixed(3).replace(".", ",")} DT`;
};

const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalTtc, cartCount } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-background shadow-2xl flex flex-col border-l border-border">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h2 className="font-heading font-semibold text-lg text-foreground">Mon Panier</h2>
                <p className="text-xs text-muted-foreground">{cartCount} article{cartCount > 1 ? "s" : ""}</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Fermer le panier"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body / Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <ShoppingBag size={32} />
                </div>
                <p className="text-muted-foreground font-medium">Votre panier est vide</p>
                <Button
                  variant="outline"
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-full border-primary text-primary hover:bg-primary/5"
                >
                  Découvrir nos produits
                </Button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-card border border-border rounded-xl shadow-sm hover:border-secondary/30 transition-all"
                >
                  <div className="w-20 h-20 bg-muted/50 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-sm text-foreground truncate">{item.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors shrink-0 p-1"
                        title="Supprimer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    {(item.flavor || item.format) && (
                      <p className="text-xs text-muted-foreground">
                        {item.flavor && <span>Goût: {item.flavor}</span>}
                        {item.flavor && item.format && <span> • </span>}
                        {item.format && <span>Format: {item.format}</span>}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-semibold text-sm text-secondary">
                        {formatPrice(item.priceTtc)}
                      </span>
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-border rounded-lg bg-background overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-border bg-card space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Sous-total</span>
                  <span className="font-medium text-foreground">{formatPrice(totalTtc)}</span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-foreground pt-1 border-t border-border">
                  <span>Total</span>
                  <span className="text-secondary text-xl">{formatPrice(totalTtc)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full block"
              >
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-6 rounded-full text-base flex items-center justify-center gap-2 shadow-md">
                  <span>Valider mon choix / Commander</span>
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
