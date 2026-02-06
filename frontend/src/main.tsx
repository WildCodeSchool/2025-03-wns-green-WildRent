import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { CategoryGrid } from './components/CategoryGrid'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { Layout } from './pages/Layout.tsx'
import { ProductPages } from './pages/ProductsPages.tsx'

const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:5173/" }),
  cache: new InMemoryCache(),
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>, 
    children : 
    [
      { index: true, element: <CategoryGrid/> },
      { path: "products", element: <ProductPages/> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
      {/* <App /> */}
  </StrictMode>,
)
