import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFilterCategory,
  createFilterOption,
  deleteFilterCategory,
  deleteFilterOption,
  fetchAdminFilters,
  signOut,
  updateFilterCategory,
  updateFilterOption,
  type AdminFilterCategory,
} from "@/lib/admin-service";

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

const emptyCategory = { keyName: "", label: "", sortOrder: 0 };
const emptyOption = { label: "", slug: "", isActive: true, sortOrder: 0 };

type OptionDraftMap = Record<string, Record<string, typeof emptyOption>>;

type CategoryDraftMap = Record<string, typeof emptyCategory>;

const AdminFilters = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newCategory, setNewCategory] = useState(emptyCategory);
  const [categoryDrafts, setCategoryDrafts] = useState<CategoryDraftMap>({});
  const [optionDrafts, setOptionDrafts] = useState<OptionDraftMap>({});
  const [error, setError] = useState("");

  const { data: categories = [], isLoading, isError } = useQuery({
    queryKey: ["admin-filters"],
    queryFn: fetchAdminFilters,
  });

  useEffect(() => {
    setCategoryDrafts((current) => {
      const next = { ...current };
      let changed = false;
      for (const category of categories) {
        if (!next[category.id]) {
          next[category.id] = {
            keyName: category.keyName,
            label: category.label,
            sortOrder: category.sortOrder,
          };
          changed = true;
        }
      }
      return changed ? next : current;
    });

    setOptionDrafts((current) => {
      const next = { ...current };
      let changed = false;
      for (const category of categories) {
        if (!next[category.id]) next[category.id] = {};
        for (const option of category.options) {
          if (!next[category.id][option.id]) {
            next[category.id][option.id] = {
              label: option.label,
              slug: option.slug,
              isActive: option.isActive,
              sortOrder: option.sortOrder,
            };
            changed = true;
          }
        }
      }
      return changed ? next : current;
    });
  }, [categories]);

  const grouped = useMemo(() => categories, [categories]);

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-filters"] });
    await queryClient.invalidateQueries({ queryKey: ["public-filters"] });
  };

  const handleMutationError = (mutationError: unknown, fallback: string) => {
    setError(mutationError instanceof Error ? mutationError.message : fallback);
  };

  const createCategoryMutation = useMutation({
    mutationFn: createFilterCategory,
    onSuccess: refresh,
    onError: (mutationError) => handleMutationError(mutationError, "Création de catégorie impossible."),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: { keyName?: string; label: string; sortOrder?: number } }) =>
      updateFilterCategory(id, body),
    onSuccess: refresh,
    onError: (mutationError) => handleMutationError(mutationError, "Mise à jour de catégorie impossible."),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteFilterCategory,
    onSuccess: refresh,
    onError: (mutationError) => handleMutationError(mutationError, "Suppression de catégorie impossible."),
  });

  const createOptionMutation = useMutation({
    mutationFn: ({ categoryId, body }: { categoryId: string; body: { categoryId: string; label: string; slug?: string; isActive?: boolean; sortOrder?: number } }) =>
      createFilterOption({ ...body, categoryId }),
    onSuccess: refresh,
    onError: (mutationError) => handleMutationError(mutationError, "Création d'option impossible."),
  });

  const updateOptionMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: { categoryId: string; label: string; slug?: string; isActive?: boolean; sortOrder?: number } }) =>
      updateFilterOption(id, body),
    onSuccess: refresh,
    onError: (mutationError) => handleMutationError(mutationError, "Mise à jour d'option impossible."),
  });

  const deleteOptionMutation = useMutation({
    mutationFn: deleteFilterOption,
    onSuccess: refresh,
    onError: (mutationError) => handleMutationError(mutationError, "Suppression d'option impossible."),
  });

  const onLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const submitNewCategory = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!newCategory.label.trim()) {
      setError("Le libellé de catégorie est requis.");
      return;
    }
    try {
      await createCategoryMutation.mutateAsync({
        keyName: newCategory.keyName.trim() || slugify(newCategory.label),
        label: newCategory.label.trim(),
        sortOrder: Number(newCategory.sortOrder) || 0,
      });
      setNewCategory(emptyCategory);
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : "Création impossible.");
    }
  };

  const updateCategoryField = (id: string, field: keyof typeof emptyCategory, value: string | number) => {
    setCategoryDrafts((current) => ({
      ...current,
      [id]: {
        ...(current[id] ?? emptyCategory),
        [field]: value,
      },
    }));
  };

  const updateOptionField = (categoryId: string, optionId: string, field: keyof typeof emptyOption, value: string | number | boolean) => {
    setOptionDrafts((current) => ({
      ...current,
      [categoryId]: {
        ...(current[categoryId] ?? {}),
        [optionId]: {
          ...(current[categoryId]?.[optionId] ?? emptyOption),
          [field]: value,
        },
      },
    }));
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Filtres produits</h1>
            <p className="text-muted-foreground">Gérez les catégories et options utilisées par les produits et le filtre public.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin/products" className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted">
              Produits
            </Link>
            <button onClick={onLogout} className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted">
              Déconnexion
            </button>
          </div>
        </div>

        <form onSubmit={submitNewCategory} className="grid gap-3 rounded-xl border border-border bg-card p-5 md:grid-cols-4">
          <input
            value={newCategory.keyName}
            onChange={(e) => setNewCategory((prev) => ({ ...prev, keyName: e.target.value }))}
            placeholder="clé technique (texture, gout...)"
            className="rounded-lg border border-border bg-background px-3 py-2"
          />
          <input
            value={newCategory.label}
            onChange={(e) => setNewCategory((prev) => ({ ...prev, label: e.target.value }))}
            placeholder="libellé"
            className="rounded-lg border border-border bg-background px-3 py-2"
          />
          <input
            type="number"
            value={newCategory.sortOrder}
            onChange={(e) => setNewCategory((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))}
            placeholder="ordre"
            className="rounded-lg border border-border bg-background px-3 py-2"
          />
          <button
            type="submit"
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Ajouter catégorie
          </button>
        </form>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {isLoading && <p className="text-muted-foreground">Chargement des filtres...</p>}
        {isError && <p className="text-destructive">Erreur de chargement.</p>}

        <div className="space-y-4">
          {grouped.map((category) => {
            const categoryDraft = categoryDrafts[category.id] ?? {
              keyName: category.keyName,
              label: category.label,
              sortOrder: category.sortOrder,
            };
            const optionDraftByCategory = optionDrafts[category.id] ?? {};

            return (
              <div key={category.id} className="rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="grid gap-3 md:grid-cols-4">
                  <input
                    value={categoryDraft.keyName}
                    onChange={(e) => updateCategoryField(category.id, "keyName", e.target.value)}
                    className="rounded-lg border border-border bg-background px-3 py-2"
                  />
                  <input
                    value={categoryDraft.label}
                    onChange={(e) => updateCategoryField(category.id, "label", e.target.value)}
                    className="rounded-lg border border-border bg-background px-3 py-2"
                  />
                  <input
                    type="number"
                    value={categoryDraft.sortOrder}
                    onChange={(e) => updateCategoryField(category.id, "sortOrder", Number(e.target.value))}
                    className="rounded-lg border border-border bg-background px-3 py-2"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateCategoryMutation.mutate({
                          id: category.id,
                          body: {
                            keyName: categoryDraft.keyName,
                            label: categoryDraft.label,
                            sortOrder: Number(categoryDraft.sortOrder) || 0,
                          },
                        })
                      }
                      className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
                    >
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const confirmed = window.confirm(`Supprimer la catégorie \"${category.label}\" ?`);
                        if (!confirmed) return;
                        deleteCategoryMutation.mutate(category.id);
                      }}
                      disabled={deleteCategoryMutation.isPending || updateCategoryMutation.isPending}
                      className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-destructive hover:bg-muted"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {category.options.map((option) => {
                    const draft = optionDraftByCategory[option.id] ?? {
                      label: option.label,
                      slug: option.slug,
                      isActive: option.isActive,
                      sortOrder: option.sortOrder,
                    };

                    return (
                      <div key={option.id} className="grid gap-3 rounded-lg border border-border p-4 md:grid-cols-5">
                        <input
                          value={draft.label}
                          onChange={(e) => updateOptionField(category.id, option.id, "label", e.target.value)}
                          className="rounded-lg border border-border bg-background px-3 py-2"
                        />
                        <input
                          value={draft.slug}
                          onChange={(e) => updateOptionField(category.id, option.id, "slug", e.target.value)}
                          className="rounded-lg border border-border bg-background px-3 py-2"
                        />
                        <input
                          type="number"
                          value={draft.sortOrder}
                          onChange={(e) => updateOptionField(category.id, option.id, "sortOrder", Number(e.target.value))}
                          className="rounded-lg border border-border bg-background px-3 py-2"
                        />
                        <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground">
                          <input
                            type="checkbox"
                            checked={draft.isActive}
                            onChange={(e) => updateOptionField(category.id, option.id, "isActive", e.target.checked)}
                          />
                          Actif
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateOptionMutation.mutate({
                                id: option.id,
                                body: {
                                  categoryId: category.id,
                                  label: draft.label,
                                  slug: draft.slug,
                                  isActive: draft.isActive,
                                  sortOrder: Number(draft.sortOrder) || 0,
                                },
                              })
                            }
                            disabled={updateOptionMutation.isPending || deleteOptionMutation.isPending}
                            className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
                          >
                            Enregistrer
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const confirmed = window.confirm(`Supprimer l'option \"${option.label}\" ?`);
                              if (!confirmed) return;
                              deleteOptionMutation.mutate(option.id);
                            }}
                            disabled={deleteOptionMutation.isPending || updateOptionMutation.isPending}
                            className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-destructive hover:bg-muted"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <AddOptionRow
                  categoryId={category.id}
                  isPending={createOptionMutation.isPending}
                  onCreate={(body) => createOptionMutation.mutate({ categoryId: category.id, body })}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AddOptionRow = ({
  categoryId,
  isPending,
  onCreate,
}: {
  categoryId: string;
  isPending: boolean;
  onCreate: (body: { categoryId: string; label: string; slug?: string; isActive?: boolean; sortOrder?: number }) => void;
}) => {
  const [draft, setDraft] = useState(emptyOption);

  useEffect(() => {
    setDraft(emptyOption);
  }, [categoryId]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.label.trim()) return;
    onCreate({
      categoryId,
      label: draft.label.trim(),
      slug: draft.slug.trim(),
      isActive: draft.isActive,
      sortOrder: Number(draft.sortOrder) || 0,
    });
    setDraft(emptyOption);
  };

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-lg border border-dashed border-border p-4 md:grid-cols-5">
      <input
        value={draft.label}
        onChange={(e) => setDraft((prev) => ({ ...prev, label: e.target.value, slug: prev.slug || slugify(e.target.value) }))}
        placeholder="Nouvelle option"
        className="rounded-lg border border-border bg-background px-3 py-2"
      />
      <input
        value={draft.slug}
        onChange={(e) => setDraft((prev) => ({ ...prev, slug: e.target.value }))}
        placeholder="slug"
        className="rounded-lg border border-border bg-background px-3 py-2"
      />
      <input
        type="number"
        value={draft.sortOrder}
        onChange={(e) => setDraft((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))}
        placeholder="ordre"
        className="rounded-lg border border-border bg-background px-3 py-2"
      />
      <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={draft.isActive}
          onChange={(e) => setDraft((prev) => ({ ...prev, isActive: e.target.checked }))}
        />
        Actif
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Ajouter option
      </button>
    </form>
  );
};

export default AdminFilters;
