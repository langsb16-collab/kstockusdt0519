import { useState, useEffect } from 'react';
import { Stock } from './stockService';

export interface Holding {
  code: string;
  name: string;
  quantity: number;
  avgPrice: number;
}

export interface TradeRecord {
  id: string;
  type: 'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAW';
  symbol: string;
  quantity: number;
  price: number;
  totalUsdt: number;
  timestamp: string;
}

export interface UserAccount {
  usdtBalance: number;
  holdings: Holding[];
  history: TradeRecord[];
}

const STORAGE_KEY = 'kstock_account_v1';

export function useAccount() {
  const [account, setAccount] = useState<UserAccount>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      usdtBalance: 10000.00,
      holdings: [],
      history: []
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
  }, [account]);

  const deposit = (amount: number) => {
    setAccount(prev => ({
      ...prev,
      usdtBalance: prev.usdtBalance + amount,
      history: [{
        id: Date.now().toString(),
        type: 'DEPOSIT',
        symbol: 'USDT',
        quantity: amount,
        price: 1,
        totalUsdt: amount,
        timestamp: new Date().toISOString()
      }, ...prev.history]
    }));
  };

  const withdraw = (amount: number) => {
    if (account.usdtBalance < amount) return false;
    setAccount(prev => ({
      ...prev,
      usdtBalance: prev.usdtBalance - amount,
      history: [{
        id: Date.now().toString(),
        type: 'WITHDRAW',
        symbol: 'USDT',
        quantity: amount,
        price: 1,
        totalUsdt: amount,
        timestamp: new Date().toISOString()
      }, ...prev.history]
    }));
    return true;
  };

  const buyStock = (stock: Stock, quantity: number, currentRate: number) => {
    const totalKrw = stock.price * quantity;
    const totalUsdt = totalKrw / currentRate;
    const fee = totalUsdt * 0.001; // 0.1% fee
    const finalCost = totalUsdt + fee;

    if (account.usdtBalance < finalCost) return { success: false, reason: 'common.insufficient_balance' };

    setAccount(prev => {
      const existing = prev.holdings.find(h => h.code === stock.code);
      let newHoldings;
      if (existing) {
        newHoldings = prev.holdings.map(h => h.code === stock.code ? {
          ...h,
          quantity: h.quantity + quantity,
          avgPrice: (h.avgPrice * h.quantity + stock.price * quantity) / (h.quantity + quantity)
        } : h);
      } else {
        newHoldings = [...prev.holdings, { code: stock.code, name: stock.name, quantity, avgPrice: stock.price }];
      }

      return {
        ...prev,
        usdtBalance: prev.usdtBalance - finalCost,
        holdings: newHoldings,
        history: [{
          id: Date.now().toString(),
          type: 'BUY',
          symbol: stock.name,
          quantity,
          price: stock.price,
          totalUsdt: finalCost,
          timestamp: new Date().toISOString()
        }, ...prev.history]
      };
    });
    return { success: true };
  };

  const sellStock = (stock: Stock, quantity: number, currentRate: number) => {
    const holding = account.holdings.find(h => h.code === stock.code);
    if (!holding || holding.quantity < quantity) return { success: false, reason: 'common.insufficient_stock' };

    const totalKrw = stock.price * quantity;
    const totalUsdt = totalKrw / currentRate;
    const fee = totalUsdt * 0.001;
    const finalReturn = totalUsdt - fee;

    setAccount(prev => {
      const newHoldings = prev.holdings.map(h => h.code === stock.code ? {
        ...h,
        quantity: h.quantity - quantity
      } : h).filter(h => h.quantity > 0);

      return {
        ...prev,
        usdtBalance: prev.usdtBalance + finalReturn,
        holdings: newHoldings,
        history: [{
          id: Date.now().toString(),
          type: 'SELL',
          symbol: stock.name,
          quantity,
          price: stock.price,
          totalUsdt: finalReturn,
          timestamp: new Date().toISOString()
        }, ...prev.history]
      };
    });
    return { success: true };
  };

  return { account, deposit, withdraw, buyStock, sellStock };
}
