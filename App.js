import React, { useState } from 'react';
import './styles.css';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import BrowsePage from './components/BrowsePage';
import AddProductPage from './components/AddProductPage';
import MyListingsPage from './components/MyListingsPage';
import EditProductPage from './components/EditProductPage';
import CartPage from './components/CartPage';
import PurchasesPage from './components/PurchasesPage';
import DashboardPage from './components/DashboardPage';
import ProductDetailPage from './components/ProductDetailPage';
import { mockUsers, mockProducts, categories } from './data/mockData';

// Default placeholder image for all products
const DEFAULT_PRODUCT_IMAGE = '/images/chair.jpg';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(mockUsers);
  const [products, setProducts] = useState(mockProducts);
  const [cart, setCart] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ---------------- AUTH FUNCTIONS ----------------
  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setCurrentPage('browse');
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const register = (email, password, username) => {
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'User already exists' };
    }
    const newUser = { id: Date.now(), email, password, username };
    setUsers([...users, newUser]);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
    setCart([]);
  };

  // ---------------- PRODUCT FUNCTIONS ----------------
  const addProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: Date.now(),
      sellerId: currentUser.id,
      image: productData.image || DEFAULT_PRODUCT_IMAGE  // ✅ fallback to chair.jpg
    };
    setProducts([...products, newProduct]);
    setCurrentPage('myListings');
  };

  const updateProduct = (id, productData) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, ...productData, image: productData.image || p.image || DEFAULT_PRODUCT_IMAGE } : p
    ));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addToCart = (product) => {
    if (!cart.find(item => item.id === product.id)) {
      setCart([...cart, product]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const makePurchase = () => {
    setPurchases([
      ...purchases,
      ...cart.map(item => ({ ...item, purchaseDate: new Date() }))
    ]);
    setCart([]);
    setCurrentPage('purchases');
  };

  const updateUser = (userData) => {
    const updatedUsers = users.map(user => 
      user.id === currentUser.id ? { ...user, ...userData } : user
    );
    setUsers(updatedUsers);
    setCurrentUser({ ...currentUser, ...userData });
  };

  // ---------------- PROPS ----------------
  const commonProps = {
    currentUser,
    currentPage,
    setCurrentPage,
    cart,
    products,
    categories,
    selectedProduct,
    setSelectedProduct,
    logout
  };

  const authProps = {
    login,
    register,
    setCurrentPage
  };

  const productProps = {
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    makePurchase,
    purchases,
    updateUser
  };

  // ---------------- RENDER ----------------
  if (!currentUser) {
    return currentPage === 'register' 
      ? <RegisterPage {...authProps} />
      : <LoginPage {...authProps} />;
  }

  switch (currentPage) {
    case 'browse':
      return <BrowsePage {...commonProps} {...productProps} />;
    case 'addProduct':
      return <AddProductPage {...commonProps} {...productProps} />;
    case 'myListings':
      return <MyListingsPage {...commonProps} {...productProps} />;
    case 'editProduct':
      return <EditProductPage {...commonProps} {...productProps} />;
    case 'cart':
      return <CartPage {...commonProps} {...productProps} />;
    case 'purchases':
      return <PurchasesPage {...commonProps} {...productProps} />;
    case 'dashboard':
      return <DashboardPage {...commonProps} {...productProps} />;
    case 'productDetail':
      return <ProductDetailPage {...commonProps} {...productProps} />;
    default:
      return <BrowsePage {...commonProps} {...productProps} />;
  }
}
