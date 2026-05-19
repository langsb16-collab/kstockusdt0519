import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export function FAQRobot() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Generate 30 indices
  const faqIndices = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              "premium-card mb-4 w-[380px] max-h-[70vh] flex flex-col shadow-2xl overflow-hidden",
              "border-orange-robot/30"
            )}
          >
            <div className="bg-orange-robot p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={24} />
                <span className="font-bold">{t('faq.title')}</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:opacity-80">
                <ChevronDown />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
              {faqIndices.map((idx) => (
                <div key={idx} className="border-b border-border-soft last:border-0 pb-2">
                  <button
                    onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                    className="w-full flex items-center justify-between text-left py-2 hover:text-orange-robot transition-colors font-medium text-sm"
                  >
                    <span>{t(`faq.q${idx}`)}</span>
                    {activeIndex === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <AnimatePresence>
                    {activeIndex === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-text-secondary py-2 bg-bg-secondary/50 px-3 rounded-lg leading-relaxed">
                          {t(`faq.a${idx}`)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-orange-robot shadow-lg flex items-center justify-center text-white relative"
      >
        <Bot size={32} />
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white text-[10px] flex items-center justify-center font-bold">
            30
          </span>
        )}
      </motion.button>
    </div>
  );
}
