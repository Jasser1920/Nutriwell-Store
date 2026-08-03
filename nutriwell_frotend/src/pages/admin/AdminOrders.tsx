import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAdminOrders, updateOrderStatus, deleteOrder, type Order } from "@/lib/order-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trash2,
  Search,
  ShoppingBag,
  ArrowLeft,
  Package,
  User,
  MapPin,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const formatPrice = (price: number) => {
  if (price === 0) return "Sur devis";
  return `${price.toFixed(3).replace(".", ",")} DT`;
};

const AdminOrders: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ["admin-orders", selectedStatus],
    queryFn: () => fetchAdminOrders(selectedStatus),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "en_attente" | "acceptee" | "refusee" }) =>
      updateOrderStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success(
        variables.status === "acceptee"
          ? "Commande acceptée avec succès !"
          : variables.status === "refusee"
          ? "Commande refusée."
          : "Statut mis à jour."
      );
      if (selectedOrder && selectedOrder.id === variables.id) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: variables.status } : null));
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "Erreur lors de la mise à jour du statut.");
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Commande supprimée.");
      setSelectedOrder(null);
    },
    onError: (err: any) => {
      toast.error(err.message || "Erreur lors de la suppression de la commande.");
    },
  });

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      order.orderReference.toLowerCase().includes(q) ||
      order.firstName.toLowerCase().includes(q) ||
      order.lastName.toLowerCase().includes(q) ||
      order.email.toLowerCase().includes(q) ||
      order.phone.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "acceptee":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle size={14} /> Acceptée
          </span>
        );
      case "refusee":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <XCircle size={14} /> Refusée
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Clock size={14} /> En attente
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 p-4 md:p-8 space-y-6">
      {/* Top Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/admin/products">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft size={16} /> Produits
            </Button>
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Gestion des Commandes</h1>
            <p className="text-sm text-muted-foreground">Consultez, acceptez ou refusez les commandes des clients.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/content">
            <Button variant="outline" size="sm">Éditeur CMS</Button>
          </Link>
          <Link to="/admin/contact-reports">
            <Button variant="outline" size="sm">Messages Contact</Button>
          </Link>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center bg-card border border-border rounded-xl p-1 shadow-sm overflow-x-auto">
          {[
            { id: "all", label: "Toutes" },
            { id: "en_attente", label: "En attente" },
            { id: "acceptee", label: "Acceptées" },
            { id: "refusee", label: "Refusées" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedStatus === tab.id
                  ? "bg-secondary text-secondary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Rechercher par ref, nom, email, tél..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {isLoading && (
          <div className="p-12 text-center text-muted-foreground">
            Chargement des commandes...
          </div>
        )}

        {isError && (
          <div className="p-12 text-center text-destructive">
            Erreur lors du chargement des commandes.
          </div>
        )}

        {!isLoading && !isError && filteredOrders.length === 0 && (
          <div className="p-12 text-center space-y-3">
            <ShoppingBag className="mx-auto text-muted-foreground" size={36} />
            <p className="text-muted-foreground font-medium">Aucune commande trouvée.</p>
          </div>
        )}

        {!isLoading && !isError && filteredOrders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/60 text-muted-foreground text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Référence</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Téléphone / Email</th>
                  <th className="py-3.5 px-4 text-right">Total</th>
                  <th className="py-3.5 px-4 text-center">Statut</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-foreground">
                      {order.orderReference}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground text-xs">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-4 px-4 font-medium text-foreground">
                      {order.firstName} {order.lastName}
                    </td>
                    <td className="py-4 px-4 text-xs text-muted-foreground">
                      <div>{order.phone}</div>
                      <div className="text-foreground/70">{order.email}</div>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-secondary">
                      {formatPrice(order.totalTtc)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Details */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedOrder(order)}
                          title="Voir les détails"
                        >
                          <Eye size={18} className="text-muted-foreground" />
                        </Button>

                        {/* Accept */}
                        {order.status !== "acceptee" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateStatusMutation.mutate({ id: order.id, status: "acceptee" })}
                            title="Accepter la commande"
                            className="hover:text-emerald-600 hover:bg-emerald-500/10"
                          >
                            <CheckCircle size={18} className="text-emerald-500" />
                          </Button>
                        )}

                        {/* Refuse */}
                        {order.status !== "refusee" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateStatusMutation.mutate({ id: order.id, status: "refusee" })}
                            title="Refuser la commande"
                            className="hover:text-rose-600 hover:bg-rose-500/10"
                          >
                            <XCircle size={18} className="text-rose-500" />
                          </Button>
                        )}

                        {/* Delete */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm(`Voulez-vous vraiment supprimer la commande ${order.orderReference} ?`)) {
                              deleteOrderMutation.mutate(order.id);
                            }
                          }}
                          title="Supprimer la commande"
                          className="hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 size={18} className="text-muted-foreground" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Dialog Modal */}
      <Dialog open={Boolean(selectedOrder)} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between gap-4">
                  <DialogTitle className="font-heading text-xl font-bold flex items-center gap-2">
                    <Package size={20} className="text-secondary" />
                    <span>Commande {selectedOrder.orderReference}</span>
                  </DialogTitle>
                  <div>{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <DialogDescription>
                  Détails complets de la commande et articles choisis par le client.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                {/* Customer Information */}
                <div className="bg-muted/40 p-4 rounded-xl space-y-3 border border-border">
                  <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                    <User size={16} className="text-primary" />
                    <span>Informations du Client</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-xs text-muted-foreground block">Nom & Prénom</span>
                      <strong className="text-foreground">{selectedOrder.firstName} {selectedOrder.lastName}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Téléphone</span>
                      <strong className="text-foreground">{selectedOrder.phone}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Email</span>
                      <span className="text-foreground">{selectedOrder.email}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Date de commande</span>
                      <span className="text-foreground">
                        {new Date(selectedOrder.createdAt).toLocaleString("fr-FR")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-muted/40 p-4 rounded-xl space-y-2 border border-border">
                  <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                    <MapPin size={16} className="text-primary" />
                    <span>Adresse de livraison</span>
                  </div>
                  <p className="text-sm text-foreground">{selectedOrder.address}</p>
                  {(selectedOrder.postalCode || selectedOrder.city) && (
                    <p className="text-xs text-muted-foreground">{selectedOrder.postalCode} {selectedOrder.city}</p>
                  )}
                  {selectedOrder.notes && (
                    <div className="pt-2 text-xs text-muted-foreground italic border-t border-border">
                      Remarques client: "{selectedOrder.notes}"
                    </div>
                  )}
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-foreground border-b border-border pb-2">
                    Articles Commandés ({selectedOrder.items?.length ?? 0})
                  </h4>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg text-sm">
                        <div>
                          <p className="font-semibold text-foreground">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">
                            Prix unitaire: {formatPrice(item.unitPriceTtc)} • Qté: {item.quantity}
                            {item.flavor && ` • Goût: ${item.flavor}`}
                            {item.format && ` • Format: ${item.format}`}
                          </p>
                        </div>
                        <span className="font-bold text-secondary">
                          {formatPrice(item.totalPriceTtc)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border font-bold text-base">
                    <span>Total de la commande</span>
                    <span className="text-secondary text-xl">{formatPrice(selectedOrder.totalTtc)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                  {selectedOrder.status !== "acceptee" && (
                    <Button
                      onClick={() => updateStatusMutation.mutate({ id: selectedOrder.id, status: "acceptee" })}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full gap-2"
                    >
                      <CheckCircle size={16} /> Accepter la commande
                    </Button>
                  )}
                  {selectedOrder.status !== "refusee" && (
                    <Button
                      variant="destructive"
                      onClick={() => updateStatusMutation.mutate({ id: selectedOrder.id, status: "refusee" })}
                      className="rounded-full gap-2"
                    >
                      <XCircle size={16} /> Refuser la commande
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
