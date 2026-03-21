import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Plus,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Truck,
  ArrowLeft,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchAddresses, createAddress } from "../store/slices/addressSlice";
import { createOrder } from "../store/slices/orderSlice";
import type { Address } from "../store/slices/addressSlice";

const emptyForm = {
  fullName: "",
  phoneNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pinCode: "",
  addressType: "Home",
};

function getDeliveryRange() {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const from = new Date();
  from.setDate(from.getDate() + 3);
  const to = new Date();
  to.setDate(to.getDate() + 5);
  return `${fmt(from)} – ${fmt(to)}`;
}

const  Checkout = () =>{
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items, summary } = useAppSelector((s) => s.cart);
  const { items: addresses, loading: addressLoading } = useAppSelector(
    (s) => s.address,
  );
  const { placing, error: orderError } = useAppSelector((s) => s.order);

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [savingAddress, setSavingAddress] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  // auto select default address or show form if none
  useEffect(() => {
    if (!addressLoading) {
      if (addresses.length === 0) {
        setShowForm(true);
      } else {
        const def = addresses.find((a) => a.isDefault) ?? addresses[0];
        setSelectedAddressId(def.id);
        setShowForm(false);
      }
    }
  }, [addresses, addressLoading]);

  // redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      navigate("/cart");
    }
  }, [items, orderSuccess, navigate]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.phoneNumber.trim())
      errors.phoneNumber = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phoneNumber))
      errors.phoneNumber = "Enter valid 10 digit number";
    if (!formData.addressLine1.trim())
      errors.addressLine1 = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.pinCode.trim()) errors.pinCode = "Pin code is required";
    else if (!/^\d{6}$/.test(formData.pinCode))
      errors.pinCode = "Enter valid 6 digit pin code";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) return;
    setSavingAddress(true);
    try {
      const result = await dispatch(createAddress(formData)).unwrap();
      setSelectedAddressId(result.id);
      setShowForm(false);
      setFormData(emptyForm);
    } catch {
      // error handled by slice
    } finally {
      setSavingAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return;
    try {
      await dispatch(createOrder(selectedAddressId)).unwrap();
      setOrderSuccess(true);
    } catch {
      // error handled by slice
    }
  };

  const subtotal = summary ? Number(summary.subtotal) : 0;
  const shipping = summary ? Number(summary.shipping) : 0;

  // ─── Order Success Screen ──────────────────────────────────────
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-5 px-4">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900">Order Placed!</h2>
          <p className="text-gray-400 text-sm mt-1">
            Your order has been placed successfully.
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-3 text-sm text-gray-500">
            <Truck className="w-4 h-4 text-green-500" />
            <span>
              Estimated delivery:{" "}
              <span className="font-medium text-gray-700">
                {getDeliveryRange()}
              </span>
            </span>
          </div>
        </div>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 transition"
          >
            View Orders <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-50 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/cart")}
            className="text-gray-400 hover:text-black transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1
            className="text-2xl font-black uppercase tracking-tight text-black"
            style={{ letterSpacing: "-1px" }}
          >
            Checkout
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left — Address Section */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-black">
                Delivery Address
              </h2>
              {addresses.length > 0 && !showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-black transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New
                </button>
              )}
            </div>

            {/* Address loading skeleton */}
            {addressLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-gray-100 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <>
                {/* Saved addresses list */}
                {!showForm && addresses.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {addresses.map((addr: Address) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          selectedAddressId === addr.id
                            ? "border-black bg-gray-50"
                            : "border-gray-100 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition ${
                              selectedAddressId === addr.id
                                ? "border-black"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedAddressId === addr.id && (
                              <div className="w-2 h-2 rounded-full bg-black" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-gray-900">
                                {addr.fullName}
                              </p>
                              {addr.addressType && (
                                <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                                  {addr.addressType}
                                </span>
                              )}
                              {addr.isDefault && (
                                <span className="text-xs font-medium px-2 py-0.5 bg-green-50 text-green-600 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {addr.addressLine1}
                              {addr.addressLine2 && `, ${addr.addressLine2}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              {addr.city}, {addr.state} – {addr.pinCode}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {addr.phoneNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Address Form */}
                {showForm && (
                  <div className="border border-gray-100 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="text-sm font-semibold text-gray-700">
                        {addresses.length === 0
                          ? "Add Delivery Address"
                          : "Add New Address"}
                      </p>
                    </div>

                    {/* Full Name + Phone */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          name="fullName"
                          placeholder="Full Name"
                          value={formData.fullName}
                          onChange={handleFormChange}
                          className={`w-full px-4 py-3 text-sm rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder-gray-400 ${
                            formErrors.fullName
                              ? "border-red-300"
                              : "border-gray-200"
                          }`}
                        />
                        {formErrors.fullName && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.fullName}
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          name="phoneNumber"
                          placeholder="Phone Number"
                          value={formData.phoneNumber}
                          onChange={handleFormChange}
                          className={`w-full px-4 py-3 text-sm rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder-gray-400 ${
                            formErrors.phoneNumber
                              ? "border-red-300"
                              : "border-gray-200"
                          }`}
                        />
                        {formErrors.phoneNumber && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.phoneNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Address Line 1 */}
                    <div>
                      <input
                        name="addressLine1"
                        placeholder="Address Line 1"
                        value={formData.addressLine1}
                        onChange={handleFormChange}
                        className={`w-full px-4 py-3 text-sm rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder-gray-400 ${
                          formErrors.addressLine1
                            ? "border-red-300"
                            : "border-gray-200"
                        }`}
                      />
                      {formErrors.addressLine1 && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.addressLine1}
                        </p>
                      )}
                    </div>

                    {/* Address Line 2 */}
                    <input
                      name="addressLine2"
                      placeholder="Address Line 2 (Optional)"
                      value={formData.addressLine2}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 transition focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder-gray-400"
                    />

                    {/* City + State */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          name="city"
                          placeholder="City"
                          value={formData.city}
                          onChange={handleFormChange}
                          className={`w-full px-4 py-3 text-sm rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder-gray-400 ${
                            formErrors.city
                              ? "border-red-300"
                              : "border-gray-200"
                          }`}
                        />
                        {formErrors.city && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.city}
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          name="state"
                          placeholder="State"
                          value={formData.state}
                          onChange={handleFormChange}
                          className={`w-full px-4 py-3 text-sm rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder-gray-400 ${
                            formErrors.state
                              ? "border-red-300"
                              : "border-gray-200"
                          }`}
                        />
                        {formErrors.state && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.state}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Pin Code + Address Type */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          name="pinCode"
                          placeholder="Pin Code"
                          value={formData.pinCode}
                          onChange={handleFormChange}
                          className={`w-full px-4 py-3 text-sm rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder-gray-400 ${
                            formErrors.pinCode
                              ? "border-red-300"
                              : "border-gray-200"
                          }`}
                        />
                        {formErrors.pinCode && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.pinCode}
                          </p>
                        )}
                      </div>
                      <select
                        name="addressType"
                        value={formData.addressType}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 transition focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-700"
                      >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Form Buttons */}
                    <div className="flex gap-3 pt-1">
                      {addresses.length > 0 && (
                        <button
                          onClick={() => {
                            setShowForm(false);
                            setFormErrors({});
                            setFormData(emptyForm);
                          }}
                          className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-3 rounded-lg hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={handleSaveAddress}
                        disabled={savingAddress}
                        className="flex-1 bg-gray-900 hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-lg transition"
                      >
                        {savingAddress ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />{" "}
                            Saving...
                          </span>
                        ) : (
                          "Save Address"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right — Order Summary */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-gray-50 rounded-2xl p-6 sticky top-6 border border-gray-100">
              <h2 className="text-base font-bold uppercase tracking-widest text-black mb-4">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-gray-800 shrink-0">
                      ₹{(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-700">₹{summary?.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax (18%)</span>
                  <span className="text-gray-700">₹{summary?.tax}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span
                    className={
                      shipping === 0
                        ? "text-green-600 font-medium"
                        : "text-gray-700"
                    }
                  >
                    {shipping === 0 ? "Free" : `₹${summary?.shipping}`}
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="text-xs text-gray-400">
                    Add ₹{Math.max(0, 500 - subtotal).toFixed(0)} more for free
                    shipping
                  </p>
                )}
              </div>

              <div className="border-t border-gray-200 mt-3 pt-3 flex items-center justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-lg font-black text-black">
                  ₹{summary?.total}
                </span>
              </div>

              {/* Delivery info */}
              <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400">
                <Truck className="w-3.5 h-3.5 text-green-500 shrink-0" />
                <span>
                  Delivery by{" "}
                  <span className="font-medium text-gray-600">
                    {getDeliveryRange()}
                  </span>
                </span>
              </div>

              {/* Error */}
              {orderError && (
                <div className="mt-3 text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {orderError}
                </div>
              )}

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={!selectedAddressId || placing || showForm}
                className="mt-5 w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-3 rounded-xl transition"
              >
                {placing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Placing
                    Order...
                  </>
                ) : (
                  <>
                    Place Order <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-3 tracking-wide">
                Secure checkout · Free returns
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout