import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { Layout } from './pages/Layout.tsx'
import { ProductPages } from './pages/ProductsPages.tsx'
import { ProductDetailsPage } from './pages/ProductDetailsPage.tsx'
import { HomePage } from "./pages/Home/HomePage";
import { CartProvider } from "./context/CartContext.tsx";
import { CartPage } from './pages/CartPage.tsx'
import { PaymentPage } from './pages/PayementPage.tsx'
import { UserProfilePage } from './pages/UserProfilePage.tsx'


const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:4200/graphql" }),
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
        { path: "profile", element: <UserProfilePage /> }

      ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <CartProvider>
        <RouterProvider router={router} />
        <ToastContainer position="bottom-right" autoClose={6000} />
      </CartProvider>
    </ApolloProvider>
    {/* <App /> */}
  </StrictMode>,
)
