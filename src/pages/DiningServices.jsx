import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { useHotel } from '../context/HotelContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  Utensils,
  Clock,
  ShoppingBag,
  Search,
  Sparkles,
  PlusCircle,
  Truck,
  CheckCheck,
  X,
  ChefHat,
  DollarSign,
  TrendingUp,
  BedDouble,
  XCircle
} from 'lucide-react';

const initialMenuItems = [
  { id: 'm-1', name: 'Executive Gourmet Breakfast', category: 'Breakfast', price: 850, time: '15 mins', calories: '480 kcal', veg: true, image: '☕' },
  { id: 'm-2', name: 'Royal Hyderabadi Dum Biryani', category: 'Main Course', price: 1250, time: '25 mins', calories: '750 kcal', veg: false, image: '🍲' },
  { id: 'm-3', name: 'Woodfired Truffle & Mushroom Pizza', category: 'Main Course', price: 1100, time: '20 mins', calories: '620 kcal', veg: true, image: '🍕' },
  { id: 'm-4', name: 'Artisanal Cheese & Wine Platter', category: 'Beverages', price: 1850, time: '10 mins', calories: '340 kcal', veg: true, image: '🍷' },
  { id: 'm-5', name: 'Belgian Chocolate Lava Soufflé', category: 'Desserts', price: 650, time: '15 mins', calories: '420 kcal', veg: true, image: '🍰' },
  { id: 'm-6', name: 'Exotic Fresh Fruit & Berry Bowl', category: 'Breakfast', price: 550, time: '10 mins', calories: '210 kcal', veg: true, image: '🍍' },
  { id: 'm-7', name: 'Royal Aromatherapy Spa Therapy (60 Min)', category: 'Spa & Wellness', price: 3500, time: '60 mins', calories: 'Wellness', veg: true, image: '🌿' },
  { id: 'm-8', name: 'Fresh Espresso & Croissant Combo', category: 'Beverages', price: 450, time: '10 mins', calories: '310 kcal', veg: true, image: '🥐' }
];

const initialOrders = [
  { id: 'ORD-901', roomNumber: '201', guestName: 'John Doe', guestEmail: 'guest@hotel.com', items: 'Royal Hyderabadi Dum Biryani (x2)', amount: 2500, status: 'Preparing', time: '10 mins ago', notes: 'Extra raita requested' },
  { id: 'ORD-902', roomNumber: '101', guestName: 'Rajesh Verma', guestEmail: 'rajesh@example.com', items: 'Executive Gourmet Breakfast (x1)', amount: 850, status: 'Dispatched', time: '25 mins ago', notes: 'Deliver with morning newspaper' },
  { id: 'ORD-903', roomNumber: '301', guestName: 'Vikram Malhotra', guestEmail: 'vikram@example.com', items: 'Artisanal Cheese & Wine Platter (x1)', amount: 1850, status: 'Delivered', time: '50 mins ago', notes: 'Chilled wine glass' }
];

const DiningServices = () => {
  const { currentUser } = useAuth();
  const { bookings = [], addNotification } = useHotel();

  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  // Modal Custom Order Form State
  const [orderRoomNumber, setOrderRoomNumber] = useState('201');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderNotes, setOrderNotes] = useState('');

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Filtered Menu Catalog
  const filteredMenu = useMemo(() => {
    return initialMenuItems.filter((item) => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [search, selectedCategory]);

  // Filter orders according to user role: Guest sees ONLY their orders
  const visibleOrders = useMemo(() => {
    if (currentUser?.role === 'Guest') {
      return orders.filter(
        (o) =>
          (currentUser?.email && o.guestEmail?.toLowerCase() === currentUser.email.toLowerCase()) ||
          (currentUser?.name && o.guestName?.toLowerCase() === currentUser.name.toLowerCase()) ||
          (currentUser?.email === 'guest@hotel.com' && o.guestName === 'John Doe')
      );
    }
    return orders;
  }, [orders, currentUser]);

  // Derived Kitchen KPI Statistics
  const totalDiningRevenue = useMemo(() => {
    return visibleOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  }, [visibleOrders]);

  const preparingCount = useMemo(() => {
    return visibleOrders.filter((o) => o.status === 'Preparing').length;
  }, [visibleOrders]);

  const dispatchedCount = useMemo(() => {
    return visibleOrders.filter((o) => o.status === 'Dispatched').length;
  }, [visibleOrders]);

  const deliveredCount = useMemo(() => {
    return visibleOrders.filter((o) => o.status === 'Delivered').length;
  }, [visibleOrders]);

  // Order Status Transition Handler
  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    if (newStatus === 'Dispatched') {
      toast.info(`🚚 Order ${orderId} marked as Dispatched! On the way to Room ${targetOrder?.roomNumber}.`);
      addNotification({
        title: `Dining Order Dispatched (${orderId})`,
        message: `Order ${orderId} dispatched for Room ${targetOrder?.roomNumber}.`,
        type: 'room'
      });
    } else if (newStatus === 'Delivered') {
      toast.success(`✅ Order ${orderId} Delivered to Room ${targetOrder?.roomNumber}!`);
      addNotification({
        title: `Dining Order Delivered (${orderId})`,
        message: `Room ${targetOrder?.roomNumber} received order ${orderId}.`,
        type: 'room'
      });
    } else if (newStatus === 'Cancelled') {
      toast.warning(`❌ Order ${orderId} cancelled.`);
    }
  };

  // Open Order Modal for specific item
  const handleOpenOrderModal = (item) => {
    setSelectedMenuItem(item);
    setOrderQuantity(1);
    setOrderNotes('');
    // Auto detect logged-in guest room if available
    const activeGuestBooking = bookings.find(
      (b) =>
        ((currentUser?.email && b.guestEmail?.toLowerCase() === currentUser.email.toLowerCase()) ||
          (currentUser?.name && b.guestName?.toLowerCase() === currentUser.name.toLowerCase())) &&
        (b.status === 'Checked-In' || b.status === 'Confirmed')
    );
    setOrderRoomNumber(activeGuestBooking?.roomNumber || '201');
    setIsOrderModalOpen(true);
  };

  // Submit Order to Live Kitchen Queue
  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!selectedMenuItem) return;

    const totalAmt = selectedMenuItem.price * orderQuantity;
    const newOrder = {
      id: `ORD-${Math.floor(100 + Math.random() * 900)}`,
      roomNumber: orderRoomNumber.trim(),
      guestName: currentUser?.name || 'John Doe',
      guestEmail: currentUser?.email || 'guest@hotel.com',
      items: `${selectedMenuItem.name} (x${orderQuantity})`,
      amount: totalAmt,
      status: 'Preparing',
      time: 'Just now',
      notes: orderNotes.trim() || 'Standard express room delivery'
    };

    setOrders([newOrder, ...orders]);
    setIsOrderModalOpen(false);

    addNotification({
      title: `New In-Room Dining Order (${newOrder.id})`,
      message: `Room ${newOrder.roomNumber} ordered ${newOrder.items} (${formatINR(totalAmt)}).`,
      type: 'guest'
    });

    toast.success(`👨‍🍳 Order ${newOrder.id} dispatched to kitchen for Room ${newOrder.roomNumber}!`);
  };

  const categories = ['All', 'Breakfast', 'Main Course', 'Beverages', 'Desserts', 'Spa & Wellness'];

  return (
    <Layout>
      <div className="space-y-8 max-w-7xl mx-auto pb-12 select-none">
        
        {/* Top Control Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-indigo-700 text-xs font-bold mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Real-Time Culinary & Room Service Desk
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Dining & Room Services
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Live kitchen order queue management, in-room gourmet catalog, and express service dispatch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleOpenOrderModal(initialMenuItems[0])}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs shadow-md transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              New Room Order
            </button>
          </div>
        </div>

        {/* 1. OPERATIONAL KITCHEN KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Dining Revenue</span>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{formatINR(totalDiningRevenue)}</div>
            <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Live Kitchen Ledger
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kitchen Preparing</span>
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <ChefHat className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-600">{preparingCount} Active Orders</div>
            <div className="text-[11px] text-amber-700 font-bold animate-pulse">
              Chef Station Working
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">On The Way</span>
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-indigo-600">{dispatchedCount} Dispatched</div>
            <div className="text-[11px] text-indigo-700 font-bold">
              In Transit to Guest Rooms
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Delivered Today</span>
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                <CheckCheck className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{deliveredCount} Fulfilled</div>
            <div className="text-[11px] text-slate-500 font-bold">
              Avg Delivery: ~18 Mins
            </div>
          </div>
        </div>

        {/* 2. LIVE KITCHEN ORDERS QUEUE */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 text-indigo-600" />
                Live Kitchen Orders Dispatch Queue
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Real-time room dining order statuses & delivery triggers.</p>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-200 self-start sm:self-auto">
              {preparingCount} Kitchen Orders Preparing
            </span>
          </div>

          {visibleOrders.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Utensils className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-extrabold text-slate-700">No active dining orders registered for your stay</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Select any gourmet dish below to place an order to your room.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleOrders.map((ord) => (
              <div key={ord.id} className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 shadow-xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-mono font-black text-indigo-600 text-xs">{ord.id}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        ord.status === 'Preparing'
                          ? 'bg-amber-100 text-amber-800 border-amber-200 animate-pulse'
                          : ord.status === 'Dispatched'
                          ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                          : ord.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border-rose-200'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 text-sm flex items-center gap-1">
                        <BedDouble className="w-4 h-4 text-indigo-600" /> Room {ord.roomNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-500">({ord.guestName})</span>
                    </div>
                    <p className="text-xs font-extrabold text-slate-800 mt-1">{ord.items}</p>
                    {ord.notes && (
                      <p className="text-[11px] text-slate-500 italic mt-0.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        " {ord.notes} "
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-black text-slate-900 text-sm">{formatINR(ord.amount)}</span>

                  <div className="flex items-center gap-1.5">
                    {ord.status === 'Preparing' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(ord.id, 'Dispatched')}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] transition shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" /> Dispatch
                      </button>
                    )}

                    {ord.status === 'Dispatched' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(ord.id, 'Delivered')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] transition shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCheck className="w-3.5 h-3.5" /> Deliver
                      </button>
                    )}

                    {ord.status !== 'Delivered' && ord.status !== 'Cancelled' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(ord.id, 'Cancelled')}
                        className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 transition cursor-pointer"
                        title="Cancel Order"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </section>

        {/* 3. IN-ROOM GOURMET CULINARY CATALOG */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Utensils className="w-4.5 h-4.5 text-indigo-600" />
                In-Room Gourmet Culinary & Wellness Menu
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Select menu items to dispatch directly to guest rooms.</p>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search dishes & spa..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 shadow-xs"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredMenu.map((item) => (
              <div key={item.id} className="p-5 rounded-3xl border border-slate-200 bg-white hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4 shadow-xs group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl group-hover:scale-110 transition-transform">{item.image}</span>
                    <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                      {formatINR(item.price)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{item.name}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold mt-1">
                      <span>⏱️ ~{item.time}</span>
                      <span>•</span>
                      <span>🔥 {item.calories}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenOrderModal(item)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-extrabold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition shadow-sm cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Express Order to Room
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CREATE ORDER MODAL */}
      {isOrderModalOpen && selectedMenuItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn select-none">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl p-6 text-slate-900 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5 font-black text-base text-slate-900">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <ChefHat className="w-5 h-5" />
                </div>
                Dispatch Room Service Order
              </div>
              <button
                type="button"
                onClick={() => setIsOrderModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <span className="text-3xl">{selectedMenuItem.image}</span>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{selectedMenuItem.name}</h4>
                  <p className="text-indigo-600 font-black mt-0.5">{formatINR(selectedMenuItem.price)} per item</p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Select Guest Room Number</label>
                <input
                  type="text"
                  value={orderRoomNumber}
                  onChange={(e) => setOrderRoomNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-extrabold text-slate-900 focus:outline-none focus:border-indigo-600"
                  placeholder="e.g. 201"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Order Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderQuantity((q) => Math.max(q - 1, 1))}
                    className="w-9 h-9 rounded-xl bg-slate-100 font-black text-slate-700 hover:bg-slate-200 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-sm font-black text-slate-900">{orderQuantity}</span>
                  <button
                    type="button"
                    onClick={() => setOrderQuantity((q) => q + 1)}
                    className="w-9 h-9 rounded-xl bg-slate-100 font-black text-slate-700 hover:bg-slate-200 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Special Chef / Room Instructions</label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-600"
                  placeholder="e.g. Extra cutlery, less spicy, deliver at 2 PM"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between font-black text-sm text-slate-900">
                <span>Total Billing Amount:</span>
                <span className="text-indigo-600">{formatINR(selectedMenuItem.price * orderQuantity)}</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold text-slate-600 border border-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <ChefHat className="w-4 h-4" /> Send to Kitchen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default DiningServices;
