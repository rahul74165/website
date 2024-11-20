import { X } from 'lucide-react';
import { CartItem } from '../types';
import { useAuth } from '../contexts/AuthContext'; // Assuming you have this context
import { useHistory } from 'react-router-dom'; // UseHistory instead of useNavigate

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, size: string, quantity: number) => void;
  onRemoveItem: (id: number, size: string) => void;
}

export default function Cart({ isOpen, onClose, items = [], onUpdateQuantity, onRemoveItem }: CartProps) {
  const { currentUser } = useAuth();
  const history = useHistory(); // UseHistory hook
  const total = items.reduce((sum, item) => sum + item.price * Math.max(1, item.quantity), 0);

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (!currentUser) {
      history.push('/login'); // Redirect to login page using history.push
    } else {
      alert("Proceeding to checkout...");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      />
      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <div className="w-screen max-w-md transform transition-transform duration-500 ease-in-out">
          <div className="flex h-full flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-6">
              <h2 id="cart-title" className="text-lg font-medium">Shopping Cart</h2>
              <button onClick={onClose} aria-label="Close Cart">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4">
              {items.length === 0 ? (
                <p className="text-center text-gray-500 mt-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex items-center space-x-4 py-4 border-b">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">${item.price}</p>
                        <p className="text-sm text-gray-500">Size: {item.size}</p>
                        <div className="mt-2 flex items-center space-x-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))}
                            className="px-2 py-1 border rounded"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.size, item.quantity + 1)}
                            className="px-2 py-1 border rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id, item.size)}
                        className="text-gray-400 hover:text-gray-500"
                        aria-label="Remove Item"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t px-4 py-6">
              <div className="flex justify-between text-base font-medium">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
              <button
                className="mt-6 w-full bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-500"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
