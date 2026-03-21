import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import AppLayout from "./AppLayout";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [

      {
        index: true,
        element: <Products />
      },

      {
        path: "products",
        element: <Products />
      },

      {
        path: "products/:id",
        element: <ProductDetail />
      },

      {
        path: "cart",
        element: <Cart />
      },

      {
        path: "login",
        element: <Login />
      },

      {
        path: "signup",
        element: <Signup />
      }
      ,
      {
        path:"profile",
        element:<Profile />
      },
      {
        path:"checkout",
        element:<Checkout/>
      },
      {
        path:"orders",
        element:<Orders/>
      }
    ]
  }
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;