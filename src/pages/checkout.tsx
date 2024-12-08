import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from "../store/cart-store";
import styles from "../components/checkout/checkout.module.css";
import { API_URL } from '../config/constants';

interface CustomerInfo {
	name: string;
	phone: string;
	email: string;
	address: string;
	note: string;
}
export default function Checkout(){
	const cartStore = useCartStore()
	const navigate = useNavigate();
	const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
		name: '',
		phone: '',
		email: '',
		address: '',
		note: ''
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Kiểm tra API URL khi component mount
		try {
			if (!API_URL) {
				throw new Error('Chưa cấu hình API URL');
			}
			setLoading(false);
		} catch (error) {
			console.error('Lỗi:', error);
			setError('Lỗi cấu hình hệ thống');
			setLoading(false);
		}
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setCustomerInfo(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (loading) {
			alert('Đang tải dữ liệu. Vui lòng đợi!');
			return;
		}

		if (error) {
			alert(error);
			return;
		}

		if (cartStore.list.length === 0) {
			alert('Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng!');
			return;
		}

		if (!customerInfo.phone) {
			alert('Vui lòng nhập số điện thoại');
			return;
		}

		const newOrder = {
			customerInfo: {
				name: customerInfo.name || 'Khách hàng',
				phone: customerInfo.phone,
				email: customerInfo.email || '',
				address: customerInfo.address || '',
				note: customerInfo.note || ''
			},
			orderItems: cartStore.list.map(item => ({
				productId: Number(item.product_id.replace('product_', '')),
				quantity: item.quantity,
				price: item.product.price,
				productName: item.product.name
			})),
			totalAmount: cartStore.list.reduce((total, item) => 
				total + (item.product.price * item.quantity), 0)
		};

		try {
			console.log('Đang gửi đơn hàng:', JSON.stringify(newOrder, null, 2));

			const response = await fetch(`${API_URL}/api/orders`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'X-Requested-With': 'XMLHttpRequest'
				},
				body: JSON.stringify(newOrder)
			});

			const responseData = await response.json();
			
			if (!response.ok) {
				throw new Error(responseData.error || 'Không thể tạo đơn hàng');
			}

			// Lưu thông tin đơn hàng vào localStorage
			const orderInfo = {
				customerInfo,
				orderItems: newOrder.orderItems,
				totalAmount: newOrder.totalAmount,
				orderId: responseData.orderId || Date.now().toString() // Tạm thời dùng timestamp nếu server không trả về orderId
			};
			localStorage.setItem('lastOrderInfo', JSON.stringify(orderInfo));

			// Xóa giỏ hàng
			cartStore.clearCart();

			// Chuyển hướng đến trang confirmation
			navigate('/confirmation');

		} catch (error: any) {
			console.error('Chi tiết lỗi:', error);
			alert('Có lỗi xảy ra khi đặt hàng: ' + error.message);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Giỏ hàng */}
			<div className="bg-white rounded-lg shadow-md p-6 mb-8">
				<h2 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h2>
				
				{cartStore.list.length === 0 ? (
					<p className="text-gray-500">Giỏ hàng trống</p>
				) : (
					<div className="space-y-4">
						{cartStore.list.map((prod) => (
							<div key={prod.product_id} 
								className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4">
								{/* Ảnh sản phẩm */}
								<div className="flex items-center space-x-4 mb-4 sm:mb-0">
									<img 
										src={prod.product.image || '/placeholder.png'} 
										alt={prod.product.name}
										className="w-20 h-20 object-cover rounded"
									/>
									<div>
										<h3 className="font-semibold">{prod.product.name}</h3>
										<p className="text-blue-600">
											{prod.product.price.toLocaleString('vi-VN')}đ
										</p>
									</div>
								</div>

								{/* Số lượng và nút xóa */}
								<div className="flex items-center space-x-4">
									<div className="flex items-center border rounded">
										<button
											onClick={() => cartStore.updateQuantity({
												product_id: prod.product_id, 
												quantity: prod.quantity - 1  // Giảm số lượng đi 1
											})}
											className="px-3 py-1 hover:bg-gray-100"
										>
											-
										</button>
										<input
											type="number"
											value={prod.quantity}
											onChange={(e) => cartStore.updateQuantity({
												product_id: prod.product_id,
												quantity: Number(e.target.value)
											})}
											className="w-16 text-center border-x py-1"
											min="1"
										/>
										<button
											onClick={() => cartStore.increaseQuantity({
												product_id: prod.product_id,
												quantity: 1
											})}
											className="px-3 py-1 hover:bg-gray-100"
										>
											+
										</button>
									</div>
									<button
										onClick={() => cartStore.delete({product_id: prod.product_id})}
										className="text-red-500 hover:text-red-700"
									>
										Xóa
									</button>
								</div>
							</div>
						))}
						
						{/* Tổng tiền */}
						<div className="pt-4 text-right">
							<p className="text-lg font-semibold">
								Tổng tiền: {cartStore.list.reduce((total, item) => 
									total + (item.product.price * item.quantity), 0
								).toLocaleString('vi-VN')}đ
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Form thông tin người nhận */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-2xl font-bold mb-6">Thông tin người nhận</h2>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label className="block text-gray-700 mb-2">Họ và tên:</label>
						<input 
							type="text"
							name="name"
							value={customerInfo.name}
							onChange={handleInputChange}
							placeholder="Nhập họ tên người nhận"
							className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					<div>
						<label className="block text-gray-700 mb-2">Số điện thoại:</label>
						<input 
							type="tel"
							name="phone"
							value={customerInfo.phone}
							onChange={handleInputChange}
							required
							placeholder="Nhập số điện thoại"
							className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					<div>
						<label className="block text-gray-700 mb-2">Email:</label>
						<input 
							type="email"
							name="email"
							value={customerInfo.email}
							onChange={handleInputChange}
							placeholder="Nhập email"
							className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					<div>
						<label className="block text-gray-700 mb-2">Địa chỉ:</label>
						<textarea 
							name="address"
							value={customerInfo.address}
							onChange={handleInputChange}
							placeholder="Nhập địa chỉ giao hàng"
							rows={3}
							className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					<div>
						<label className="block text-gray-700 mb-2">Ghi chú:</label>
						<textarea 
							name="note"
							value={customerInfo.note}
							onChange={handleInputChange}
							placeholder="Ghi chú thêm (nếu có)"
							rows={3}
							className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					<button 
						type="submit" 
						className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
					>
						Đặt hàng
					</button>
				</form>
			</div>
		</div>
	)
}
