import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchOrders } from "../store/slices/ordersSlice";
import { ShoppingBag, ChevronRight, Clock } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING:    { label: "Pending",    color: "bg-yellow-50 text-yellow-600 border-yellow-100" },
  PAID:       { label: "Paid",       color: "bg-blue-50 text-blue-600 border-blue-100" },
  PROCESSING: { label: "Processing", color: "bg-purple-50 text-purple-600 border-purple-100" },
  SHIPPED:    { label: "Shipped",    color: "bg-orange-50 text-orange-600 border-orange-100" },
  DELIVERED:  { label: "Delivered",  color: "bg-green-50 text-green-600 border-green-100" },
  CANCELLED:  { label: "Cancelled",  color: "bg-red-50 text-red-500 border-red-100" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const Orders = () =>{
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items: orders, loading, error } = useAppSelector((s) => s.order);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (!loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-5 px-4">
        <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">No orders yet</h2>
          <p className="text-gray-400 text-sm mt-1">Looks like you haven't placed any orders yet.</p>
        </div>
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 transition"
        >
          Start Shopping <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-10">

        <h1
          className="text-2xl font-black uppercase tracking-tight text-black mb-8"
          style={{ letterSpacing: "-1px" }}
        >
          My Orders
          <span className="ml-2 text-base font-normal text-gray-400 tracking-normal">
            ({orders.length})
          </span>
        </h1>

        {error && (
          <div className="mb-6 text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-100 rounded-2xl p-5 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-4 w-32 bg-gray-100 rounded-lg" />
                  <div className="h-6 w-20 bg-gray-100 rounded-full" />
                </div>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="w-12 h-12 rounded-xl bg-gray-100" />
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="h-4 w-24 bg-gray-100 rounded-lg" />
                  <div className="h-4 w-16 bg-gray-100 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status] ?? statusConfig.PENDING;

              return (
                <div
                  key={order.id}
                  className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">Order #{order.id}</p>
                      <span className="text-gray-300">·</span>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  <div className="flex gap-2 mb-4">
                    {order.items.slice(0, 4).map((item) => (
                      <div
                        key={item.productId}
                        className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0"
                      >
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-gray-400">
                          +{order.items.length - 4}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <p className="text-xs text-gray-400">
                        {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                      </p>
                      {order.total && (
                        <>
                          <span className="text-gray-200">|</span>
                          <p className="text-sm font-bold text-black">
                            ₹{Number(order.total).toFixed(2)}
                          </p>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-black transition"
                    >
                      View Details <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders