export interface Stock {
  id: string;
  name: string;
  code: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export const K_STOCKS: Stock[] = [
  { id: '1', name: 'S-Electronics', code: '005930', price: 78500, change: 1200, changePercent: 1.55, volume: 15200000 },
  { id: '2', name: 'S-Hynix', code: '000660', price: 182400, change: -3200, changePercent: -1.72, volume: 4500000 },
  { id: '3', name: 'N-Corp', code: '035420', price: 189000, change: 4500, changePercent: 2.44, volume: 890000 },
  { id: '4', name: 'K-Bank', code: '035720', price: 48200, change: -500, changePercent: -1.03, volume: 2100000 },
  { id: '5', name: 'L-Energy', code: '373220', price: 395000, change: 12500, changePercent: 3.27, volume: 320000 },
  { id: '6', name: 'POSCO-H', code: '005490', price: 382000, change: -4500, changePercent: -1.16, volume: 670000 },
  { id: '7', name: 'S-Biologics', code: '207940', price: 812000, change: 0, changePercent: 0, volume: 120000 },
  { id: '8', name: 'H-Motor', code: '005380', price: 245000, change: 8000, changePercent: 3.38, volume: 1100000 },
  { id: '9', name: 'K-Aero', code: '047810', price: 54600, change: 2100, changePercent: 4.00, volume: 4500000 },
  { id: '10', name: 'E-Soft', code: '036570', price: 195000, change: -8500, changePercent: -4.18, volume: 540000 },
];

export const getSimulationPrice = (basePrice: number) => {
  const volatile = (Math.random() - 0.5) * 0.002;
  return basePrice * (1 + volatile);
};
