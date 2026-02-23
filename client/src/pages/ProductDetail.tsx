import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProductById, clearSelectedProduct } from "../store/slices/productSlice";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedProduct: product, loading, error } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(Number(id)));
    }

    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin w-12 h-12 text-[#4ECDC4] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-gray-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
        <div className="bg-white border border-red-200 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#000000] mb-2">Product not found</h2>
          <p className="text-gray-600 mb-6">
            {error || "The product you're looking for doesn't exist"}
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-[#000000] hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

const formattedPrice =
  typeof product.price === "string"
    ? parseFloat(product.price).toFixed(2)
    : typeof product.price === "number"
    ? product.price.toFixed(2)
    : "0.00";

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-gray-600 hover:text-[#000000] mb-6 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg className="w-32 h-32 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" />
                </svg>
              )}
            </div>

            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-[#000000] mb-4">
                {product.name}
              </h1>

              <div className="mb-6">
                <p className="text-4xl font-bold text-[#000000]">
                  ₹{formattedPrice}
                </p>
              </div>

              {product.stock !== undefined && (
                <div className="mb-6">
                  {product.stock > 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#51CF66] rounded-full"></div>
                      <span className="text-[#51CF66] font-medium">
                        In Stock ({product.stock} available)
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-red-500 font-medium">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
              )}

              {product.description && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-[#000000] mb-2">
                    Description
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="mt-auto">
                <button
                  disabled={product.stock === 0}
                  className="w-full bg-[#51CF66] hover:bg-[#47b85a] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition text-lg"
                >
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Product ID</p>
                    <p className="text-[#000000] font-medium">#{product.id}</p>
                  </div>
                  {product.stock !== undefined && (
                    <div>
                      <p className="text-gray-500 mb-1">Availability</p>
                      <p className="text-[#000000] font-medium">
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;