import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Loader2, AlertTriangle } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { SearchInput } from "@/components/products/SearchInput";
import { Pagination } from "@/components/products/Pagination";
import { StockBadge } from "@/components/products/StockBadge";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { toast } from "sonner";
import type { ProductListParams } from "@/types/product";

const ITEMS_PER_PAGE = 8;

const ProductsPage = () => {
  const { addItem } = useCart();
  const [params, setParams] = useState<ProductListParams>({ limit: ITEMS_PER_PAGE });
  const { products, meta, isLoading, error, refetch } = useProducts(params);
  const [sort, setSort] = useState("newest");

  const handleSearch = useCallback((search: string) => {
    setParams((prev) => ({ ...prev, search: search || undefined, page: 1 }));
  }, []);

  const handleCategoryChange = useCallback((categoryId: string | undefined) => {
    setParams((prev) => ({ ...prev, categoryId, page: 1 }));
  }, []);

  const handleSort = (value: string) => {
    setSort(value);
    const sortMap: Record<string, { sortBy?: string; sortOrder?: string }> = {
      newest: {},
      "price-low": { sortBy: "price", sortOrder: "asc" },
      "price-high": { sortBy: "price", sortOrder: "desc" },
      name: { sortBy: "name", sortOrder: "asc" },
    };
    setParams((prev) => ({ ...prev, ...sortMap[value], page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading state
  if (isLoading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Erro ao carregar produtos</h1>
        <p className="text-foreground mb-6">{error}</p>
        <button
          onClick={refetch}
          className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-md"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Produtos</h1>
        <p className="text-foreground mb-8">Peças premium para o seu próximo setup.</p>
      </motion.div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <SearchInput onSearch={handleSearch} isLoading={isLoading} />

        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value)}
          className="bg-card border border-border rounded-md px-3 py-2.5 text-sm text-foreground-strong focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          aria-label="Ordenar por"
        >
          <option value="newest">Mais recentes</option>
          <option value="price-low">Preço: menor para maior</option>
          <option value="price-high">Preço: maior para menor</option>
          <option value="name">Nome A-Z</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <CategoryFilter
          selectedCategoryId={params.categoryId}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Results count */}
      {meta && (
        <p className="text-sm text-muted-foreground mb-6">
          {meta.total} {meta.total === 1 ? "produto encontrado" : "produtos encontrados"}
          {params.search && <span> para &quot;{params.search}&quot;</span>}
        </p>
      )}

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, i) => {
            const primaryImage = product.images[0]?.url || "https://via.placeholder.com/300";
            const price = Number(product.basePrice);
            const salePrice = product.salePrice ? Number(product.salePrice) : null;
            const firstVariant = product.variants[0];
            const totalStock = product.variants.reduce((sum, v) => sum + v.stockQty, 0);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                whileHover={{ y: -4 }}
                className="bg-card rounded-lg shadow-card overflow-hidden group"
              >
                <Link to={`/products/${product.slug}`}>
                  <div className="h-48 bg-accent flex items-center justify-center">
                    <img
                      src={primaryImage}
                      alt={product.images[0]?.altText || product.name}
                      className="h-32 w-32 object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </Link>

                <div className="p-4">
                  {product.category && (
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                      {product.category.name}
                    </p>
                  )}

                  <Link to={`/products/${product.slug}`}>
                    <h3 className="font-semibold text-sm mb-1 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {product.description && (
                    <p className="text-xs text-foreground mb-2 line-clamp-2">{product.description}</p>
                  )}

                  <div className="mb-2">
                    <StockBadge stockQty={totalStock} />
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div>
                      {salePrice && salePrice < price ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-primary font-bold tabular-nums text-sm">
                            {salePrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </span>
                          <span className="text-xs text-muted-foreground line-through tabular-nums">
                            {price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-primary font-bold tabular-nums text-sm">
                          {price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (!firstVariant || totalStock === 0) {
                          toast.error("Produto esgotado");
                          return;
                        }
                        addItem({
                          id: firstVariant.id,
                          variantId: firstVariant.id,
                          name: product.name,
                          price,
                          image: primaryImage,
                        });
                        toast.success(`${product.name} adicionado ao carrinho`);
                      }}
                      disabled={totalStock === 0}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="h-3 w-3" /> Adicionar
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-foreground">
          <p className="text-lg">Nenhum produto encontrado.</p>
          {params.search && (
            <p className="text-sm text-muted-foreground mt-2">
              Tente buscar com outros termos.
            </p>
          )}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="mt-10">
          <Pagination meta={meta} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
