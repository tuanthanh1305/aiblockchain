
import React, { useState, useEffect, useCallback } from 'react';
import { MinusCircleIcon, CheckCircleIcon, ArrowsRightLeftIcon } from './Icons'; // Assuming you have these or similar icons
import { OrderType, DEFAULT_CURRENCY } from '../types';

interface Order {
  id: string;
  price: number;
  amount: number;
  total: number;
  type: 'bid' | 'ask'; // bid = buy, ask = sell
}

// Generate some initial fake orders
const generateInitialOrders = (count: number, type: 'bid' | 'ask', basePrice: number): Order[] => {
  const orders: Order[] = [];
  let currentPrice = type === 'bid' ? basePrice - Math.random() * 0.5 : basePrice + Math.random() * 0.5;
  for (let i = 0; i < count; i++) {
    const amount = parseFloat((Math.random() * 5 + 0.1).toFixed(3)); // Random amount
    currentPrice = type === 'bid' 
        ? currentPrice - Math.random() * 0.1 // Bids decrease in price
        : currentPrice + Math.random() * 0.1; // Asks increase in price
    orders.push({
      id: crypto.randomUUID(),
      price: parseFloat(currentPrice.toFixed(2)),
      amount: amount,
      total: parseFloat((currentPrice * amount).toFixed(2)),
      type: type,
    });
  }
  // Sort bids descending, asks ascending by price
  return orders.sort((a, b) => type === 'bid' ? b.price - a.price : a.price - b.price);
};

const SIMULATED_ASSET_SYMBOL = "DEMO-S"; // For the asset being traded against USD-Fake

const OrderBookDemo: React.FC = () => {
  const baseMarketPrice = 100; // Simulated base price for DEMO-S / USD-Fake
  const [bids, setBids] = useState<Order[]>(() => generateInitialOrders(8, 'bid', baseMarketPrice));
  const [asks, setAsks] = useState<Order[]>(() => generateInitialOrders(8, 'ask', baseMarketPrice));
  
  const [orderType, setOrderType] = useState<OrderType>(OrderType.MARKET);
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [amountInput, setAmountInput] = useState<string>('1');
  const [priceInput, setPriceInput] = useState<string>(baseMarketPrice.toFixed(2));
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  const addToLog = (message: string) => {
    setSimulationLog(prev => [message, ...prev.slice(0, 4)]); // Keep last 5 messages
  };

  const handlePlaceOrder = useCallback(() => {
    const amount = parseFloat(amountInput);
    const price = parseFloat(priceInput);

    if (isNaN(amount) || amount <= 0) {
      addToLog("Lỗi: Số lượng không hợp lệ.");
      return;
    }

    if (orderType === OrderType.LIMIT && (isNaN(price) || price <= 0)) {
      addToLog("Lỗi: Giá cho lệnh Giới Hạn không hợp lệ.");
      return;
    }

    const orderId = crypto.randomUUID();

    if (orderType === OrderType.MARKET) {
      addToLog(`Thực hiện lệnh ${orderSide === 'buy' ? 'MUA' : 'BÁN'} Thị Trường ${amount} ${SIMULATED_ASSET_SYMBOL}...`);
      if (orderSide === 'buy') {
        // Try to fill from asks (lowest price first)
        let remainingAmount = amount;
        let cost = 0;
        const newAsks = [...asks];
        for (let i = 0; i < newAsks.length && remainingAmount > 0; i++) {
          const order = newAsks[i];
          const canFill = Math.min(remainingAmount, order.amount);
          cost += canFill * order.price;
          order.amount -= canFill;
          remainingAmount -= canFill;
          if (order.amount <= 0.0001) newAsks.splice(i--, 1); // Remove filled order
        }
        setAsks(newAsks);
        if (remainingAmount > 0) addToLog(`Không đủ thanh khoản để MUA hết ${amount}. Đã MUA ${amount - remainingAmount} với giá trung bình ${(cost / (amount - remainingAmount)).toFixed(2)} USD-Fake.`);
        else addToLog(`Đã MUA ${amount} ${SIMULATED_ASSET_SYMBOL} với giá trung bình ${(cost / amount).toFixed(2)} USD-Fake.`);
      } else { // Sell Market
        let remainingAmount = amount;
        let revenue = 0;
        const newBids = [...bids];
        for (let i = 0; i < newBids.length && remainingAmount > 0; i++) {
          const order = newBids[i];
          const canFill = Math.min(remainingAmount, order.amount);
          revenue += canFill * order.price;
          order.amount -= canFill;
          remainingAmount -= canFill;
          if (order.amount <= 0.0001) newBids.splice(i--, 1);
        }
        setBids(newBids);
        if (remainingAmount > 0) addToLog(`Không đủ thanh khoản để BÁN hết ${amount}. Đã BÁN ${amount - remainingAmount} với giá trung bình ${(revenue / (amount - remainingAmount)).toFixed(2)} USD-Fake.`);
        else addToLog(`Đã BÁN ${amount} ${SIMULATED_ASSET_SYMBOL} với giá trung bình ${(revenue / amount).toFixed(2)} USD-Fake.`);
      }
    } else { // Limit Order
      const newOrder: Order = { id: orderId, price, amount, total: price * amount, type: orderSide === 'buy' ? 'bid' : 'ask' };
      addToLog(`Đặt lệnh ${orderSide === 'buy' ? 'MUA' : 'BÁN'} Giới Hạn: ${amount} ${SIMULATED_ASSET_SYMBOL} @ ${price} USD-Fake.`);
      if (orderSide === 'buy') {
        setBids(prev => [...prev, newOrder].sort((a,b) => b.price - a.price));
      } else {
        setAsks(prev => [...prev, newOrder].sort((a,b) => a.price - b.price));
      }
      setUserOrders(prev => [...prev, newOrder]);
    }
    setAmountInput('');
  }, [amountInput, priceInput, orderType, orderSide, asks, bids]);


  // Simulate some market fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate asks
      setAsks(prevAsks => {
        const newAsks = prevAsks.map(order => ({
          ...order,
          price: parseFloat((order.price + (Math.random() - 0.5) * 0.1).toFixed(2)), // Tiny fluctuation
        })).filter(o => o.price > 0 && o.amount > 0.001) // Remove if price is too low or amount too small
         .sort((a,b) => a.price - b.price);
        // Add a new ask occasionally
        if (Math.random() < 0.1 && newAsks.length < 10) {
            const topAskPrice = newAsks.length > 0 ? newAsks[newAsks.length-1].price : baseMarketPrice + 1;
            const newPrice = parseFloat((topAskPrice + Math.random() * 0.5).toFixed(2));
            const newAmount = parseFloat((Math.random() * 2 + 0.1).toFixed(3));
            newAsks.push({ id: crypto.randomUUID(), price: newPrice, amount: newAmount, total: newPrice * newAmount, type: 'ask' });
            newAsks.sort((a,b) => a.price - b.price);
        }
        return newAsks.slice(0,10); // Keep book depth manageable
      });

      // Fluctuate bids
      setBids(prevBids => {
        const newBids = prevBids.map(order => ({
          ...order,
          price: parseFloat((order.price + (Math.random() - 0.5) * 0.1).toFixed(2)),
        })).filter(o => o.price > 0 && o.amount > 0.001)
         .sort((a,b) => b.price - a.price);
        // Add a new bid occasionally
         if (Math.random() < 0.1 && newBids.length < 10) {
            const topBidPrice = newBids.length > 0 ? newBids[0].price : baseMarketPrice -1;
            const newPrice = parseFloat((topBidPrice - Math.random() * 0.5).toFixed(2));
            const newAmount = parseFloat((Math.random() * 2 + 0.1).toFixed(3));
            newBids.push({ id: crypto.randomUUID(), price: newPrice, amount: newAmount, total: newPrice * newAmount, type: 'bid' });
            newBids.sort((a,b) => b.price - a.price);
        }
        return newBids.slice(0,10);
      });
    }, 3000); // Fluctuate every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const OrderRow: React.FC<{order: Order, isUserOrder: boolean}> = ({order, isUserOrder}) => (
     <tr className={`text-xs ${order.type === 'ask' ? 'text-red-400' : 'text-green-400'} ${isUserOrder ? 'bg-sky-700/30 font-semibold' : ''} hover:bg-slate-600/50 transition-colors`}>
        <td className="p-1 text-left">{order.price.toFixed(2)}</td>
        <td className="p-1 text-right">{order.amount.toFixed(3)}</td>
        <td className="p-1 text-right">{order.total.toFixed(2)}</td>
    </tr>
  )

  const spread = asks.length > 0 && bids.length > 0 ? (asks[0].price - bids[0].price).toFixed(2) : "N/A";


  return (
    <div className="p-3 bg-slate-800/70 rounded-lg shadow-inner ring-1 ring-slate-700 space-y-4">
      <div className="text-center mb-2">
        <h5 className="text-sm font-semibold text-slate-300">Sổ Lệnh: {SIMULATED_ASSET_SYMBOL}/USD-Fake (Mô Phỏng)</h5>
        <p className="text-xs text-slate-400">Giá thị trường tham khảo: ~${baseMarketPrice} USD-Fake</p>
      </div>

      <div className="grid md:grid-cols-2 gap-3 text-xs">
        {/* Order Form */}
        <div className="p-3 bg-slate-700 rounded-md ring-1 ring-slate-600 space-y-2">
          <div className="flex gap-2">
            <button 
                onClick={() => setOrderSide('buy')} 
                className={`flex-1 py-1.5 px-2 text-xs rounded ${orderSide === 'buy' ? 'bg-green-600 text-white' : 'bg-slate-600 hover:bg-slate-500'}`}
            >MUA</button>
            <button 
                onClick={() => setOrderSide('sell')} 
                className={`flex-1 py-1.5 px-2 text-xs rounded ${orderSide === 'sell' ? 'bg-red-600 text-white' : 'bg-slate-600 hover:bg-slate-500'}`}
            >BÁN</button>
          </div>
          <div className="flex gap-2">
            <button 
                onClick={() => setOrderType(OrderType.MARKET)} 
                className={`flex-1 py-1.5 px-2 text-xs rounded ${orderType === OrderType.MARKET ? 'bg-sky-600 text-white' : 'bg-slate-600 hover:bg-slate-500'}`}
            >Thị Trường</button>
            <button 
                onClick={() => setOrderType(OrderType.LIMIT)} 
                className={`flex-1 py-1.5 px-2 text-xs rounded ${orderType === OrderType.LIMIT ? 'bg-sky-600 text-white' : 'bg-slate-600 hover:bg-slate-500'}`}
            >Giới Hạn</button>
          </div>
          <input 
            type="number" 
            placeholder={`Số lượng ${SIMULATED_ASSET_SYMBOL}`}
            value={amountInput}
            onChange={e => setAmountInput(e.target.value)}
            className="w-full p-1.5 text-xs bg-slate-800 border border-slate-600 rounded focus:ring-sky-500 focus:border-sky-500"
          />
          {orderType === OrderType.LIMIT && (
            <input 
              type="number" 
              placeholder="Giá (USD-Fake)"
              value={priceInput}
              onChange={e => setPriceInput(e.target.value)}
              className="w-full p-1.5 text-xs bg-slate-800 border border-slate-600 rounded focus:ring-sky-500 focus:border-sky-500"
            />
          )}
          <button 
            onClick={handlePlaceOrder}
            className={`w-full py-1.5 px-3 text-sm font-semibold rounded shadow-md transition-colors
              ${orderSide === 'buy' ? 'bg-green-500 hover:bg-green-400' : 'bg-red-500 hover:bg-red-400'} text-white`}
          >
            {orderSide === 'buy' ? 'Mua' : 'Bán'} {SIMULATED_ASSET_SYMBOL}
          </button>
        </div>

        {/* Order Book Display */}
        <div className="p-2 bg-slate-900 rounded-md ring-1 ring-slate-700 max-h-60 overflow-y-auto custom-scrollbar">
            <table className="w-full text-xs">
                <thead>
                    <tr className="text-slate-500">
                        <th className="p-1 text-left font-normal">Giá (USD-Fake)</th>
                        <th className="p-1 text-right font-normal">Số Lượng ({SIMULATED_ASSET_SYMBOL})</th>
                        <th className="p-1 text-right font-normal">Tổng (USD-Fake)</th>
                    </tr>
                </thead>
                {/* Asks (Sell Orders) - display reversed for traditional order book view */}
                <tbody>
                    {asks.slice().reverse().map(order => <OrderRow key={order.id} order={order} isUserOrder={userOrders.some(uo => uo.id === order.id)} />)}
                </tbody>
                 {/* Spread */}
                <tbody>
                    <tr className="border-t border-b border-slate-700">
                        <td colSpan={3} className="p-1 text-center text-slate-400 text-[10px] font-semibold">
                            Spread: {spread} USD-Fake
                        </td>
                    </tr>
                </tbody>
                {/* Bids (Buy Orders) */}
                <tbody>
                    {bids.map(order => <OrderRow key={order.id} order={order} isUserOrder={userOrders.some(uo => uo.id === order.id)} />)}
                </tbody>
            </table>
             {bids.length === 0 && asks.length === 0 && <p className="text-center text-slate-500 py-4 text-xs">Sổ lệnh trống.</p>}
        </div>
      </div>
        
      {/* Simulation Log */}
      {simulationLog.length > 0 && (
        <div className="mt-3 p-2 bg-slate-700/50 rounded-md ring-1 ring-slate-600 text-xs">
          <h6 className="font-semibold text-slate-400 mb-1">Nhật ký mô phỏng:</h6>
          <ul className="space-y-0.5 max-h-20 overflow-y-auto custom-scrollbar">
            {simulationLog.map((log, index) => (
              <li key={index} className={`text-slate-400 ${index === 0 ? 'text-sky-300 animate-fade-in-down' : ''}`}>
                <span className="text-sky-500">&gt; </span>{log}
              </li>
            ))}
          </ul>
        </div>
      )}
       <p className="text-xs text-yellow-400/80 bg-yellow-800/30 p-2 rounded-md ring-1 ring-yellow-600/50 mt-3">
        <strong>Lưu ý:</strong> Sổ lệnh này được đơn giản hóa và tự động biến động nhẹ để mô phỏng thị trường. Các lệnh của bạn được tô sáng. Thanh khoản và khớp lệnh chỉ mang tính minh họa.
      </p>
    </div>
  );
};

export default OrderBookDemo;
