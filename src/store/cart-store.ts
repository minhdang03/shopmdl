import {create} from "zustand";
import {produce} from "immer";

export interface CartItem {
    product: {
        id: string;
        name: string;
        price: number;
        image?: string;
    };
    product_id: string;
    quantity: number;
}

interface CartStore {
    list: CartItem[];
    add: (item: CartItem) => void;
    delete: (params: { product_id: string }) => void;
    updateQuantity: (params: { product_id: string, quantity: number }) => void;
    increaseQuantity: (params: { product_id: string, quantity: number }) => void;
    clearCart: () => void;
}

// Hàm để lấy cart từ localStorage
const getStoredCart = (): CartItem[] => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
};

// Hàm để lưu cart vào localStorage
const storeCart = (cart: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

export const useCartStore = create<CartStore>((set) => ({
    list: getStoredCart(), // Khởi tạo từ localStorage
    
    add: (item) => set(
        produce((state: CartStore) => {
            const existingItem = state.list.find(i => i.product_id === item.product_id);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                state.list.push(item);
            }
            storeCart(state.list); // Lưu vào localStorage
        })
    ),

    delete: ({product_id}) => set(
        produce((state: CartStore) => {
            state.list = state.list.filter(item => item.product_id !== product_id);
            storeCart(state.list); // Lưu vào localStorage
        })
    ),

    updateQuantity: ({product_id, quantity}) => set(
        produce((state: CartStore) => {
            const item = state.list.find(item => item.product_id === product_id);
            if (item) {
                item.quantity = quantity;
            }
            storeCart(state.list); // Lưu vào localStorage
        })
    ),

    increaseQuantity: ({product_id, quantity}) => set(
        produce((state: CartStore) => {
            const item = state.list.find(item => item.product_id === product_id);
            if (item) {
                item.quantity += quantity;
                if (item.quantity <= 0) {
                    state.list = state.list.filter(i => i.product_id !== product_id);
                }
            }
            storeCart(state.list); // Lưu vào localStorage
        })
    ),

    clearCart: () => set(
        produce((state: CartStore) => {
            state.list = [];
            storeCart(state.list); // Lưu vào localStorage
        })
    ),
}));
