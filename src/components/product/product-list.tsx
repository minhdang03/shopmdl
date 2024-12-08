import { useState, useEffect } from 'react';
import { useCartStore } from "../../store/cart-store";
import { API_URL } from '../../config/constants';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Link } from 'react-router-dom';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    description?: string;
    image?: string;
    category_id?: string;
    category?: string;
}

export default function ProductList() {
    const cartStore = useCartStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [activeCategory]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const url = activeCategory === 'all' 
                ? `${API_URL}/api/products`
                : `${API_URL}/api/products?category_id=${activeCategory}`;

            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setProducts(data.products);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/api/categories`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            if (!data.categories) {
                throw new Error('Dữ liệu categories không đúng định dạng');
            }
            
            console.log('Categories loaded:', data.categories);
            setCategories(data.categories);
        } catch (error) {
            console.error('Lỗi khi tải danh mục:', error);
            setCategories([]);
        }
    };

    const handleAddToCart = (product: Product) => {
        cartStore.add({
            product: {
                ...product,
                id: product.id.toString()
            },
            product_id: `product_${product.id}`,
            quantity: 1
        });
        setIsCartOpen(true);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex overflow-x-auto pb-2">
                <button
                    onClick={() => setActiveCategory('all')}
                    className={`px-4 py-2 mx-1 rounded-lg whitespace-nowrap ${
                        activeCategory === 'all'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                    Tất cả
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`px-4 py-2 mx-1 rounded-lg whitespace-nowrap ${
                            activeCategory === category.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div 
                        key={product.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="relative pb-[100%]">
                            <LazyLoadImage
                                src={product.image || '/placeholder.png'}
                                alt={product.name}
                                effect="blur"
                                className="absolute top-0 left-0 w-full h-full object-cover"
                                wrapperClassName="w-full"
                            />
                        </div>
                        
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                                {product.name}
                            </h3>
                            
                            <p className="text-xl font-bold text-blue-600 mb-2">
                                {product.price.toLocaleString('vi-VN')}đ
                            </p>
                            
                            {product.description && (
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {product.description}
                                </p>
                            )}
                            
                            <button 
                                onClick={() => handleAddToCart(product)}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center space-x-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                </svg>
                                <span>Thêm vào giỏ</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showNotification && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
                    Đã thêm vào giỏ hàng!
                </div>
            )}

            <div className={`fixed top-0 bottom-0 right-0 w-96 bg-white shadow-xl transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Giỏ hàng</h2>
                        <button 
                            onClick={() => setIsCartOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-4">
                        {cartStore.list.map((item) => (
                            <div key={item.product_id} className="flex items-center space-x-4">
                                <img 
                                    src={item.product.image} 
                                    alt={item.product.name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold">{item.product.name}</h3>
                                    <p className="text-blue-500">{item.product.price.toLocaleString('vi-VN')}đ</p>
                                    <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 border-t pt-4">
                        <div className="flex justify-between mb-4">
                            <span className="font-semibold">Tổng cộng:</span>
                            <span className="font-bold text-blue-500">
                                {cartStore.list.reduce((total, item) => total + (item.product.price * item.quantity), 0).toLocaleString('vi-VN')}đ
                            </span>
                        </div>
                        <Link 
                            to="/checkout"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 text-center block"
                        >
                            Thanh toán
                        </Link>
                    </div>
                </div>
            </div>

            {isCartOpen && (
                <div 
                    className="fixed inset-0 bg-black/30 z-40"
                    onClick={() => setIsCartOpen(false)}
                />
            )}
        </div>
    );
}