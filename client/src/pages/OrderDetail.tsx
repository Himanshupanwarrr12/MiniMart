import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchOrderById, cancelOrder, clearSelectedOrder } from "../store/slices/ordersSlice";
import { ArrowLeft, Clock, Truck, Package, XCircle } from "lucide-react";

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

const OrderDetail = ()=> {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { selectedOrder: order, loading, error } = useAppSelector((s) => s.order);

  useEffect(() => {
    if (id) dispatch(fetchOrderById(Number(id)));
    return () => { dispatch(clearSelectedOrder()); };
  }, [id, dispatch]);

  const handleCancel = async () => {
    if (!order) return;
    await dispatch(cancelOrder(order.id));
  };

  const canCancel = order?.status === "PENDING" || order?.status === "PAID";

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-4 animate-pulse">
          <div className="h-6 w-32 bg-gray-100 rounded-lg" />
          <div className="h-32 bg-gray-100 rounded-2xl" />
          <div className="h-48 bg-gray-100 rounded-2xl" />
          <div className="h-24 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-4">
        <Package className="w-12 h-12 text-gray-300" />
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-800">Order not found</h2>
          <p className="text-gray-400 text-sm mt-1">{error || "This order doesn't exist"}</p>
        </div>
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 transition"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const status = statusConfig[order.status] ?? statusConfig.PENDING;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-10">

        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/orders")}
            className="text-gray-400 hover:text-black transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1
            className="text-2xl font-black uppercase tracking-tight text-black"
            style={{ letterSpacing: "-1px" }}
          >
            Order #{order.id}
          </h1>
        </div>

        <div className="space-y-4">

          <div className="border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${status.color}`}>
                  {status.label}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  Placed on {formatDate(order.createdAt)}
                </div>
              </div>
              {order.estimatedDelivery && order.status !== "CANCELLED" && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Truck className="w-3.5 h-3.5 text-green-500" />
                  Estimated delivery:{" "}
                  <span className="font-medium text-gray-700 ml-1">
                    {formatDate(order.estimatedDelivery)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="border border-gray-100 rounded-2xl p-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-4">
              Items ({order.summary.itemCount})
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {item.product.name}
                    </p>
                    {item.product.description && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                        {item.product.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-black">
                      ₹{(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">
                      ₹{Number(item.price).toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-100 rounded-2xl p-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-4">
              Price Details
            </h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="text-gray-700">₹{order.summary.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax (18%)</span>
                <span className="text-gray-700">₹{order.summary.tax}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className={Number(order.summary.shipping) === 0 ? "text-green-600 font-medium" : "text-gray-700"}>
                  {Number(order.summary.shipping) === 0 ? "Free" : `₹${order.summary.shipping}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2.5 border-t border-gray-100">
                <span>Total</span>
                <span className="text-black text-base">₹{order.summary.total}</span>
              </div>
            </div>
          </div>

          {canCancel && (
            <button
              onClick={handleCancel}
              className="w-full flex items-center justify-center gap-2 border-2 border-red-100 text-red-500 hover:bg-red-50 text-sm font-semibold py-3 rounded-xl transition"
            >
              <XCircle className="w-4 h-4" />
              Cancel Order
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

export default OrderDetail