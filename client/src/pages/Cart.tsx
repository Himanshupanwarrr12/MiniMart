import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Trash2, Plus, Minus, ShoppingBag,
  ArrowRight, Loader2, Truck, ChevronRight,
} from "lucide-react";
import { fetchCart, updateQuantity, removeItem } from "../store/slices/cartSlice";
import type { CartItem } from "../store/slices/cartSlice";
import type { Product } from "../store/slices/productSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

function getDeliveryRange() {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const from = new Date(); from.setDate(from.getDate() + 3);
  const to   = new Date(); to.setDate(to.getDate() + 5);
  return `${fmt(from)} – ${fmt(to)}`;
}

export default function CartPage() {
  const dispatch = useAppDispatch();

  const { items, summary, loading, actionLoading, error } = useAppSelector(
    (s) => s.cart
  );
  const allProducts = useAppSelector((s) => s.products.items);

  const cartProductIds = items.map((item: CartItem) => item.product.id);
  const recommendations: Product[] = allProducts
    .filter((p: Product) => !cartProductIds.includes(p.id))
    .slice(0, 4);

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  const handleQty = (itemId: number, current: number, delta: number) => {
    const next = current + delta;
    if (next < 1) return;
    dispatch(updateQuantity({ itemId, quantity: next }));
  };

  const subtotal  = summary ? Number(summary.subtotal) : 0;
  const shipping  = summary ? Number(summary.shipping) : 0;

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (!loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-5 px-4">
        <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Your cart is empty</h2>
          <p className="text-gray-400 text-sm mt-1">Looks like you haven't added anything yet.</p>
        </div>
        <Link
          to="/products"
          className="flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 transition"
        >
          Browse Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* ── Header ───────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black uppercase tracking-tight text-black" style={{ letterSpacing: "-1px" }}>
            Your Cart
            {summary && (
              <span className="ml-2 text-base font-normal text-gray-400 tracking-normal">
                ({summary.itemCount} items)
              </span>
            )}
          </h1>
          <Link
            to="/products"
            className="text-sm text-gray-400 hover:text-black transition flex items-center gap-1"
          >
            Continue Shopping <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Items List ───────────────────────────────────────────────────────── */}
          <div className="flex-1 space-y-px">

            {/* Column headers — desktop only */}
            <div className="hidden md:grid grid-cols-12 text-xs font-medium text-gray-400 uppercase tracking-widest pb-3 border-b border-gray-100">
              <span className="col-span-6">Product</span>
              <span className="col-span-2 text-center">Price</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-2 text-right">Total</span>
            </div>

            {loading && items.length === 0 ? (
              <CartSkeleton />
            ) : (
              items.map((item: CartItem) => {
                const busy      = !!actionLoading[item.id];
                const lineTotal = (Number(item.price) * item.quantity).toFixed(2);
                return (
                  <div
                    key={item.id}
                    className={`grid grid-cols-12 items-center gap-4 py-5 border-b border-gray-100 transition-opacity ${
                      busy ? "opacity-40 pointer-events-none" : ""
                    }`}
                  >
                    {/* Product info */}
                    <div className="col-span-12 md:col-span-6 flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        {item.product.description && (
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                            {item.product.description}
                          </p>
                        )}
                        {/* Remove — mobile */}
                        <button
                          onClick={() => dispatch(removeItem(item.id))}
                          className="md:hidden mt-1 flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition"
                        >
                          {busy
                            ? <Loader2 className="w-3 h-3 animate-spin" />
                            : <Trash2 className="w-3 h-3" />
                          }
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Unit price */}
                    <div className="hidden md:flex col-span-2 justify-center text-sm text-gray-500">
                      ₹{Number(item.price).toFixed(2)}
                    </div>

                    {/* Qty stepper */}
                    <div className="col-span-8 md:col-span-2 flex justify-start md:justify-center">
                      <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-1.5 py-1">
                        <button
                          onClick={() => handleQty(item.id, item.quantity, -1)}
                          disabled={item.quantity <= 1}
                          className="w-5 h-5 flex items-center justify-center text-gray-500 disabled:opacity-30 hover:text-black transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-gray-800 select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQty(item.id, item.quantity, 1)}
                          className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-black transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Line total + desktop remove */}
                    <div className="col-span-4 md:col-span-2 flex items-center justify-end gap-3">
                      <span className="text-sm font-bold text-black">₹{lineTotal}</span>
                      <button
                        onClick={() => dispatch(removeItem(item.id))}
                        className="hidden md:flex text-gray-300 hover:text-red-400 transition"
                      >
                        {busy
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />
                        }
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {/* Delivery notice */}
            {items.length > 0 && (
              <div className="flex items-center gap-2.5 pt-4 text-sm text-gray-500">
                <Truck className="w-4 h-4 text-green-500 shrink-0" />
                <span>
                  Estimated delivery:{" "}
                  <span className="font-medium text-gray-700">{getDeliveryRange()}</span>
                </span>
                {shipping === 0 && (
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    Free Shipping
                  </span>
                )}
              </div>
            )}
          </div>

          {/* ── Order Summary ─────────────────────────────────────────────────────── */}
          {summary && (
            <div className="lg:w-72 shrink-0">
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-6 border border-gray-100">
                <h2 className="text-base font-bold uppercase tracking-widest text-black mb-4">
                  Order Summary
                </h2>

                <div className="space-y-2.5 text-sm">
                  <SummaryRow label="Subtotal"  value={`₹${summary.subtotal}`} />
                  <SummaryRow label="Tax (18%)" value={`₹${summary.tax}`} />
                  <SummaryRow
                    label="Shipping"
                    value={
                      shipping === 0
                        ? <span className="text-green-600 font-medium">Free</span>
                        : `₹${summary.shipping}`
                    }
                  />
                  {shipping > 0 && (
                    <p className="text-xs text-gray-400">
                      Add ₹{Math.max(0, 500 - subtotal).toFixed(0)} more for free shipping
                    </p>
                  )}
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4 flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-black text-black">₹{summary.total}</span>
                </div>

                <Link
                  to="/checkout"
                  className="mt-5 w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-medium py-3 rounded-xl transition"
                >
                  Checkout <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Nike-style trust line */}
                <p className="text-center text-xs text-gray-400 mt-3 tracking-wide">
                  Secure checkout · Free returns
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── You May Also Like ────────────────────────────────────────────────────── */}
        {recommendations.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black uppercase tracking-tight text-black" style={{ letterSpacing: "-0.5px" }}>
                You May Also Like
              </h2>
              <Link
                to="/products"
                className="text-sm text-gray-400 hover:text-black flex items-center gap-1 transition"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recommendations.map((p: Product) => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square bg-gray-50 overflow-hidden">
                    <img
                      src={p.image ?? "/placeholder.png"}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">₹{Number(p.price).toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-gray-500">
      <span>{label}</span>
      <span className="text-gray-700">{value}</span>
    </div>
  );
}

function CartSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="grid grid-cols-12 items-center gap-4 py-4 border-b border-gray-100 animate-pulse">
          <div className="col-span-6 flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3.5 bg-gray-100 rounded-lg w-3/4" />
              <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
            </div>
          </div>
          <div className="col-span-2 flex justify-center">
            <div className="h-3.5 w-12 bg-gray-100 rounded-lg" />
          </div>
          <div className="col-span-2 flex justify-center">
            <div className="h-8 w-20 bg-gray-100 rounded-lg" />
          </div>
          <div className="col-span-2 flex justify-end">
            <div className="h-3.5 w-14 bg-gray-100 rounded-lg" />
          </div>
        </div>
      ))}
    </>
  );
}