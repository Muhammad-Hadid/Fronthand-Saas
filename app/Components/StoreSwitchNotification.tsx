"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Building2 } from 'lucide-react';

export default function StoreSwitchNotification() {
  const [notification, setNotification] = useState<{
    show: boolean;
    storeName: string;
  }>({ show: false, storeName: '' });

  useEffect(() => {
    const handleStoreChange = (event: CustomEvent) => {
      const newStore = event.detail.store;
      setNotification({
        show: true,
        storeName: newStore.store_name || newStore.subdomain
      });

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    };

    window.addEventListener('storeChanged', handleStoreChange as EventListener);
    
    return () => {
      window.removeEventListener('storeChanged', handleStoreChange as EventListener);
    };
  }, []);

  return (
    <AnimatePresence>
      {notification.show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 right-4 z-[9999] bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[300px]"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Store Switched Successfully</p>
              <p className="text-xs text-gray-600 mt-1">
                Now managing: <span className="font-medium text-blue-600">{notification.storeName}</span>
              </p>
            </div>
            <Building2 className="w-5 h-5 text-gray-400" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
