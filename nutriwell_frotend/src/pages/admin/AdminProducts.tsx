import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAdminProducts, signOut, updateProductPublishStatus } from "@/lib/admin-service";
import { Link, useNavigate } from "react-router-dom";

const AdminProducts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["admin-products"],
    queryFn: fetchAdminProducts,
  });

  const publishMutation = useMutation({
    mutationFn: ({ id, nextStatus }: { id: string; nextStatus: boolean }) =>
      updateProductPublishStatus(id, nextStatus),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      await queryClient.invalidateQueries({ queryKey: ["products-grid"] });
      await queryClient.invalidateQueries({ queryKey: ["product-detail"] });
      await queryClient.invalidateQueries({ queryKey: ["related-products"] });
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(q) ||
        product.slug.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q)
      );
    });
  }, [products, search]);

  const onLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Produits Admin</h1>
            <p className="text-muted-foreground">Gérez la publication des produits.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/recipes"
              className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Recettes
            </Link>
            <Link
              to="/admin/contact-reports"
              className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Rapports contact
            </Link>
            <Link
              to="/admin/content"
              className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Contenu pages
            </Link>
            <Link
              to="/admin/products/new"
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Nouveau produit
            </Link>
            <button
              onClick={onLogout}
              className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Déconnexion
            </button>
          </div>
        </div>

        <div className="mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, slug, catégorie"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Nom</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Slug</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Catégorie</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Texture</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Statut</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      Chargement des produits...
                    </td>
                  </tr>
                )}

                {isError && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-destructive">
                      Erreur de chargement.
                    </td>
                  </tr>
                )}

                {!isLoading && !isError && filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      Aucun produit trouvé.
                    </td>
                  </tr>
                )}

                {filtered.map((product) => (
                  <tr key={product.id} className="border-t border-border">
                    <td className="px-4 py-3 text-sm text-foreground">{product.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{product.slug}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{product.category}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{product.texture}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          product.is_published
                            ? "bg-secondary/15 text-secondary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {product.is_published ? "Publié" : "Brouillon"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() =>
                            publishMutation.mutate({
                              id: product.id,
                              nextStatus: !product.is_published,
                            })
                          }
                          disabled={publishMutation.isPending}
                          className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-60"
                        >
                          {product.is_published ? "Dépublier" : "Publier"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
