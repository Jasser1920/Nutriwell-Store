import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchOrderByReference } from "@/lib/order-service";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, PackageCheck, ShoppingBag, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const formatPrice = (price: number) => {
  if (price === 0) return "Sur devis";
  return `${price.toFixed(3).replace(".", ",")} DT`;
};

const OrderConfirmation: React.FC = () => {
  const { reference } = useParams<{ reference: string }>();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["order-confirmation", reference],
    queryFn: () => fetchOrderByReference(reference ?? ""),
    enabled: Boolean(reference),
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          {isLoading && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Chargement de votre commande...</p>
            </div>
          )}

          {isError && (
            <div className="text-center py-20 space-y-4">
              <p className="text-destructive text-lg font-semibold">Impossible de récupérer les détails de cette commande.</p>
              <Link to="/products">
                <Button variant="outline" className="rounded-full">Retour au catalogue</Button>
              </Link>
            </div>
          )}

          {order && (
            <ScrollReveal>
              <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-md text-center space-y-8">
                {/* Header Badge */}
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-20 h-20 rounded-full bg-secondary/15 text-secondary flex items-center justify-center animate-scale-in">
                    <CheckCircle size={48} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full">
                    Commande enregistrée
                  </span>
                  <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                    Merci pour votre commande !
                  </h1>
                  <p className="text-muted-foreground max-w-md text-sm md:text-base leading-relaxed">
                    Votre commande <span className="font-bold text-foreground">{order.orderReference}</span> a bien été enregistrée et transmise à notre équipe Nutriwell.
                  </p>
                </div>

                {/* Status Box */}
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-center gap-3 text-amber-700 dark:text-amber-400">
                  <Clock size={20} className="shrink-0" />
                  <span className="text-sm font-medium text-left">
                    Statut actuel : <strong className="font-semibold">En attente de traitement par notre équipe</strong>
                  </span>
                </div>

                {/* Customer & Delivery Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left bg-muted/40 p-6 rounded-2xl border border-border">
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Client</h3>
                    <p className="font-bold text-foreground">{order.firstName} {order.lastName}</p>
                    <p className="text-sm text-muted-foreground">{order.email}</p>
                    <p className="text-sm text-muted-foreground">{order.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Adresse de livraison</h3>
                    <p className="text-sm text-foreground font-medium">{order.address}</p>
                    {(order.postalCode || order.city) && (
                      <p className="text-sm text-muted-foreground">{order.postalCode} {order.city}</p>
                    )}
                  </div>
                </div>

                {/* Ordered Items Table */}
                <div className="space-y-4 text-left">
                  <h3 className="font-heading font-semibold text-lg text-foreground border-b border-border pb-2">
                    Détail des articles commandés
                  </h3>
                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0 text-sm">
                        <div>
                          <p className="font-semibold text-foreground">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">
                            Quantité: {item.quantity} {item.flavor && `• Goût: ${item.flavor}`} {item.format && `• Format: ${item.format}`}
                          </p>
                        </div>
                        <span className="font-bold text-foreground">
                          {formatPrice(item.totalPriceTtc)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-border font-bold text-lg">
                    <span>Total à régler</span>
                    <span className="text-secondary text-2xl">{formatPrice(order.totalTtc)}</span>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/products">
                    <Button className="w-full sm:w-auto rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-8 py-6 flex items-center justify-center gap-2">
                      <ShoppingBag size={18} />
                      <span>Continuer la visite du catalogue</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
