import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import PaymentGateway from './PaymentGateway';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
  planPrice?: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  planName = "Professional Plan",
  planPrice = 99 
}) => {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handlePaymentSuccess = (data: any) => {
    setPaymentData(data);
    setPaymentStatus('success');
    
    // Store payment info in localStorage for demo
    localStorage.setItem('payment_info', JSON.stringify({
      ...data,
      plan: planName,
      timestamp: new Date().toISOString()
    }));

    // Auto-close after 3 seconds
    setTimeout(() => {
      onClose();
      setPaymentStatus('idle');
    }, 3000);
  };

  const handlePaymentError = (error: string) => {
    setErrorMessage(error);
    setPaymentStatus('error');
    
    // Reset after 5 seconds
    setTimeout(() => {
      setPaymentStatus('idle');
      setErrorMessage('');
    }, 5000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">{planName}</h2>
            <p className="text-gray-400">Secure payment processing</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {paymentStatus === 'success' && paymentData && (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Payment Successful!</h3>
              <p className="text-gray-400 mb-6">
                Thank you for your payment. Your subscription is now active.
              </p>
              
              <div className="bg-gray-800 rounded-xl p-6 max-w-md mx-auto">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment ID:</span>
                    <span className="text-white font-mono">{paymentData.payment_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white">{paymentData.currency} {paymentData.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Method:</span>
                    <span className="text-white capitalize">{paymentData.method}</span>
                  </div>
                  {paymentData.crypto_amount && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Crypto Amount:</span>
                      <span className="text-white">{paymentData.crypto_amount} {paymentData.crypto_currency}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-green-400 font-semibold">Confirmed</span>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                Closing automatically in 3 seconds...
              </p>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Payment Failed</h3>
              <p className="text-red-400 mb-6">{errorMessage}</p>
              <button
                onClick={() => setPaymentStatus('idle')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {paymentStatus === 'idle' && (
            <PaymentGateway
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;