import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CartDrawer } from '../components/CartDrawer';
import { Navbar } from '../components/Navbar';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { ProductListingPage } from '../pages/ProductListingPage';
import { CartProvider } from '../stores/CartContext';
import styles from './AppLayout.module.scss';

function AppLayout() {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </main>
      <CartDrawer />
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppLayout />
      </CartProvider>
    </BrowserRouter>
  );
}
