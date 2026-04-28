import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { Layout } from './pages/Layout.tsx'
import { ProductPages } from './pages/ProductsPages.tsx'
import { ProductDetailsPage } from './pages/ProductDetailsPage.tsx'
import { HomePage } from "./pages/Home/HomePage";
import { CartProvider } from "./context/CartContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { CartPage } from './pages/CartPage.tsx'
import { PaymentPage } from './pages/PayementPage.tsx'
import { UserProfilePage } from './pages/UserProfilePage.tsx'
import { LoginPage } from './pages/LoginPage.tsx'
import { RegisterPage } from './pages/RegisterPage.tsx'
import { ProtectedRoute } from './components/ProtectedRoute.tsx'

const apiUrl = import.meta.env.VITE_API_URL ?? "";

const client = new ApolloClient({
  link: new HttpLink({
    uri: `${apiUrl}/graphql`,
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children:
      [
        { index: true, element: <HomePage /> },
        { path: "products", element: <ProductPages /> },
        { path: "products/:id", element: <ProductDetailsPage /> },
        { path: "cart", element: <CartPage /> },
        { path: "payment", element: <PaymentPage /> },
        { path: "login", element: <LoginPage /> },
        { path: "register", element: <RegisterPage /> },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          ),
        },
      ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
          <ToastContainer position="bottom-right" autoClose={6000} />
        </CartProvider>
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>,
)
