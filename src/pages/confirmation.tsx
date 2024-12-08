import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from "../store/cart-store";

interface OrderInfo {
    customerInfo: {
        name: string;
        phone: string;
        email: string;
        address: string;
        note: string;
    };
    orderItems: {
        productId: number;
        productName: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    orderId: string;
}

export default function Confirmation() {
    const navigate = useNavigate();
    const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);

    useEffect(() => {
        const savedOrderInfo = localStorage.getItem('lastOrderInfo');
        if (savedOrderInfo) {
            setOrderInfo(JSON.parse(savedOrderInfo));
        } else {
            navigate('/');
        }
    }, []);

    if (!orderInfo) {
        return <div className="container mx-auto px-4 py-8">Đang tải...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Thông báo thành công */}
            <div className="max-w-6xl mx-auto mb-8">
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Đặt hàng thành công!</h1>
                    <p className="text-gray-600">Mã đơn hàng: {orderInfo.orderId}</p>
                </div>
            </div>

            {/* Layout 2 cột */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Cột trái - Thông tin đơn hàng */}
                <div className="space-y-8">
                    {/* Thông tin người nhận */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Thông tin người nhận</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-600">Họ và tên:</p>
                                <p className="font-medium">{orderInfo.customerInfo.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Số điện thoại:</p>
                                <p className="font-medium">{orderInfo.customerInfo.phone}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Email:</p>
                                <p className="font-medium">{orderInfo.customerInfo.email || "Không có"}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Địa chỉ:</p>
                                <p className="font-medium">{orderInfo.customerInfo.address}</p>
                            </div>
                            {orderInfo.customerInfo.note && (
                                <div>
                                    <p className="text-gray-600">Ghi chú:</p>
                                    <p className="font-medium">{orderInfo.customerInfo.note}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chi tiết đơn hàng */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Chi tiết đơn hàng</h2>
                        <div className="space-y-4">
                            {orderInfo.orderItems.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{item.productName}</p>
                                        <p className="text-gray-600">Số lượng: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium">
                                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                    </p>
                                </div>
                            ))}
                            <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-xl font-semibold">Tổng tiền:</p>
                                    <p className="text-xl font-bold text-blue-600">
                                        {orderInfo.totalAmount.toLocaleString('vi-VN')}đ
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cột phải - Thông tin thanh toán và lưu ý */}
                <div className="space-y-8">
                    {/* Thông tin thanh toán */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Thông tin thanh toán</h2>
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-blue-800 mb-2">Thông tin chuyển khoản:</h3>
                                <ul className="space-y-2 text-blue-700">
                                    <li>Ngân hàng: Vietcombank</li>
                                    <li>Số tài khoản: 1234567890</li>
                                    <li>Chủ tài khoản: NGUYEN VAN A</li>
                                    <li>Nội dung chuyển khoản: {orderInfo.orderId}</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Lưu ý quan trọng */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Lưu ý quan trọng</h2>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <ul className="list-disc list-inside space-y-2 text-yellow-700">
                                <li>Vui lòng thanh toán trong vòng 24h kể từ khi đặt hàng</li>
                                <li>Ghi đúng nội dung chuyển khoản là mã đơn hàng của bạn</li>
                                <li>Đơn hàng sẽ được xử lý sau khi nhận được thanh toán</li>
                                <li>Thời gian giao hàng dự kiến: 2-3 ngày làm việc</li>
                            </ul>
                        </div>
                    </div>

                    {/* Hỗ trợ khách hàng */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Hỗ trợ khách hàng</h2>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <ul className="space-y-2 text-green-700">
                                <li>Hotline: 1900 xxxx</li>
                                <li>Email: support@shopdang.com</li>
                                <li>Thời gian hỗ trợ: 8h00 - 22h00 (Thứ 2 - Chủ nhật)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nút tiếp tục mua sắm */}
            <div className="max-w-6xl mx-auto mt-8 text-center">
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                    Tiếp tục mua sắm
                </button>
            </div>
        </div>
    );
}