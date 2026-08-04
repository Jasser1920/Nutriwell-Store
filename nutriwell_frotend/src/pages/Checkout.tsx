import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/lib/order-service";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ShoppingBag, ArrowLeft, CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const formatPrice = (price: number) => {
  if (price === 0) return "Sur devis";
  return `${price.toFixed(3).replace(".", ",")} DT`;
};

const DELIVERY_FEE = 5;

const Checkout: React.FC = () => {
  const { cart, totalTtc, clearCart } = useCart();
  const navigate = useNavigate();
  const totalWithDelivery = totalTtc + DELIVERY_FEE;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address) {
      toast.error("Veuillez remplir tous les champs obligatoires (*)");
      return;
    }

    if (cart.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        postalCode: formData.postalCode,
        city: formData.city,
        notes: formData.notes,
        items: cart.map((item) => ({
          productSlug: item.slug,
          productName: item.name,
          flavor: item.flavor,
          format: item.format,
          unitPriceTtc: item.priceTtc,
          quantity: item.quantity,
        })),
      };

      const res = await createOrder(payload);
      if (res.success) {
        clearCart();
        toast.success(res.message);
        navigate(`/order-confirmation/${res.orderReference}`);
      }
    } catch (err: any) {
      toast.error(err.message || "Une erreur est survenue lors de l'enregistrement de votre commande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 pt-28 pb-16 container mx-auto px-4 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-4">
            <ShoppingBag size={40} />
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground mb-2">Votre panier est vide</h1>
          <p className="text-muted-foreground max-w-md mb-6">
            Vous n'avez actuellement aucun produit dans votre panier pour passer une commande.
          </p>
          <Link to="/products">
            <Button className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6">
              Découvrir le catalogue
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          {/* Back button */}
          <div className="mb-6">
            <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors font-medium">
              <ArrowLeft size={16} />
              <span>Continuer mes achats</span>
            </Link>
          </div>

          <h1 className="font-heading text-3xl font-bold text-foreground mb-8">
            Validation de votre commande
          </h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Customer Form */}
            <div className="lg:col-span-7 space-y-6">
              <ScrollReveal>
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                  <div className="flex items-center gap-3 pb-4 border-b border-border">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <h2 className="font-heading font-semibold text-xl text-foreground">Coordonnées du destinataire</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-semibold">Prénom *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="Ex: Jean"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-semibold">Nom *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Ex: Dupont"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="jean.dupont@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold">Téléphone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+33 6 12 34 56 78"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-semibold">Adresse de livraison *</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Numéro et nom de rue"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode" className="text-sm font-semibold">Code Postal</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        placeholder="75000"
                        value={formData.postalCode}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-semibold">Ville</Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="Paris"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label htmlFor="notes" className="text-sm font-semibold">Remarques ou instructions de livraison (optionnel)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      placeholder="Spécifications particulières, heure de livraison préférée..."
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 space-y-6">
              <ScrollReveal delay={0.1}>
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm sticky top-28">
                  <div className="flex items-center gap-3 pb-4 border-b border-border">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <h2 className="font-heading font-semibold text-xl text-foreground">Résumé du panier</h2>
                  </div>

                  {/* Items */}
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3 text-sm py-2 border-b border-border/50 last:border-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded bg-muted/30 p-1 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Qté: {item.quantity} {item.flavor && `• ${item.flavor}`} {item.format && `• ${item.format}`}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-foreground shrink-0">
                          {formatPrice(item.priceTtc * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-2 pt-4 border-t border-border">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Sous-total articles</span>
                      <span className="font-medium text-foreground">{formatPrice(totalTtc)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Frais de livraison</span>
                      <span className="font-medium text-accent">{formatPrice(DELIVERY_FEE)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-foreground pt-3 border-t border-border">
                      <span>Total à payer</span>
                      <span className="text-secondary text-2xl">{formatPrice(totalWithDelivery)}</span>
                    </div>
                  </div>

                  {/* Notice Box */}
                  <div className="bg-muted/60 p-4 rounded-xl space-y-2 border border-border/60">
                    <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                      <ShieldCheck size={16} />
                      <span>Prise de commande Nutriwell</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Aucun paiement en ligne requis immédiatement. Votre commande est transmise directement à notre service commercial qui vous contactera pour valider l'expédition et le règlement.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-base py-6 shadow-md flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={20} />
                    <span>{isSubmitting ? "Enregistrement en cours..." : "Confirmer la commande"}</span>
                  </Button>
                </div>
              </ScrollReveal>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
