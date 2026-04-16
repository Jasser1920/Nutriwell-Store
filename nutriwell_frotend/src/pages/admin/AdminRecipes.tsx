import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { deleteRecipe, fetchAdminRecipes, updateRecipePublishStatus } from "@/lib/recipe-service";
import { signOut } from "@/lib/admin-service";

const AdminRecipes = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: recipes = [], isLoading, isError } = useQuery({
    queryKey: ["admin-recipes"],
    queryFn: fetchAdminRecipes,
  });

  const publishMutation = useMutation({
    mutationFn: ({ id, nextStatus }: { id: string; nextStatus: boolean }) =>
      updateRecipePublishStatus(id, nextStatus),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-recipes"] });
      await queryClient.invalidateQueries({ queryKey: ["recipes-public"] });
      await queryClient.invalidateQueries({ queryKey: ["recipe-detail"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRecipe(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-recipes"] });
      await queryClient.invalidateQueries({ queryKey: ["recipes-public"] });
      await queryClient.invalidateQueries({ queryKey: ["recipe-detail"] });
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return recipes;

    return recipes.filter((recipe) => {
      return (
        recipe.title.toLowerCase().includes(q) ||
        recipe.slug.toLowerCase().includes(q) ||
        recipe.category.toLowerCase().includes(q)
      );
    });
  }, [recipes, search]);

  const onLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Recettes Admin</h1>
            <p className="text-muted-foreground">Gerez les recettes et leur publication.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/products"
              className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Produits
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
              to="/admin/recipes/new"
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Nouvelle recette
            </Link>
            <button
              onClick={onLogout}
              className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Deconnexion
            </button>
          </div>
        </div>

        <div className="mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par titre, slug, categorie"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Titre</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Slug</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Categorie</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Preparation</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Statut</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      Chargement des recettes...
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
                      Aucune recette trouvee.
                    </td>
                  </tr>
                )}

                {filtered.map((recipe) => (
                  <tr key={recipe.id} className="border-t border-border">
                    <td className="px-4 py-3 text-sm text-foreground">{recipe.title}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{recipe.slug}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{recipe.category}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{recipe.prep_time}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          recipe.is_published
                            ? "bg-secondary/15 text-secondary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {recipe.is_published ? "Publiee" : "Brouillon"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/recipes/${recipe.id}/edit`}
                          className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() =>
                            publishMutation.mutate({
                              id: recipe.id,
                              nextStatus: !recipe.is_published,
                            })
                          }
                          disabled={publishMutation.isPending}
                          className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-60"
                        >
                          {recipe.is_published ? "Depublier" : "Publier"}
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(recipe.id)}
                          disabled={deleteMutation.isPending}
                          className="rounded-full border border-destructive/40 px-4 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 disabled:opacity-60"
                        >
                          Supprimer
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

export default AdminRecipes;
