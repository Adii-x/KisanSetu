export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
  farmer: string;
  unit: string;
}

export const mockProducts: Product[] = [
  { id: '1', name: 'Organic Tomatoes', price: 40, quantity: 500, category: 'vegetables', image: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400', farmer: 'Rajesh Kumar', unit: 'kg' },
  { id: '2', name: 'Basmati Rice', price: 120, quantity: 1000, category: 'grains', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', farmer: 'Suresh Patil', unit: 'kg' },
  { id: '3', name: 'Fresh Mangoes', price: 80, quantity: 300, category: 'fruits', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400', farmer: 'Anita Devi', unit: 'kg' },
  { id: '4', name: 'Green Chillies', price: 30, quantity: 200, category: 'spices', image: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400', farmer: 'Mohan Singh', unit: 'kg' },
  { id: '5', name: 'Fresh Milk', price: 60, quantity: 100, category: 'dairy', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', farmer: 'Lakshmi Farms', unit: 'L' },
  { id: '6', name: 'Organic Potatoes', price: 25, quantity: 800, category: 'vegetables', image: 'https://images.unsplash.com/photo-1518977676601-b53f82ber633?w=400', farmer: 'Ramesh Yadav', unit: 'kg' },
  { id: '7', name: 'Turmeric Powder', price: 200, quantity: 150, category: 'spices', image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400', farmer: 'Priya Sharma', unit: 'kg' },
  { id: '8', name: 'Fresh Bananas', price: 35, quantity: 400, category: 'fruits', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', farmer: 'Vijay Reddy', unit: 'dozen' },
  { id: '9', name: 'Wheat Flour', price: 45, quantity: 600, category: 'grains', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400', farmer: 'Geeta Devi', unit: 'kg' },
];

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  category: string;
  likes: number;
  comments: number;
  time: string;
  liked: boolean;
}

export const mockPosts: CommunityPost[] = [
  { id: '1', author: 'Rajesh Kumar', avatar: 'RK', content: 'Just harvested 500 kg of organic tomatoes this season! The new drip irrigation system really helped.', category: 'crop', likes: 24, comments: 8, time: '2 hours ago', liked: false },
  { id: '2', author: 'Anita Devi', avatar: 'AD', content: 'Tomato prices are up 15% this week at the Pune mandi. Good time to sell!', category: 'prices', likes: 45, comments: 12, time: '4 hours ago', liked: false },
  { id: '3', author: 'Mohan Singh', avatar: 'MS', content: 'PM-KISAN scheme installment credited today. Have you all received yours?', category: 'schemes', likes: 67, comments: 23, time: '6 hours ago', liked: false },
  { id: '4', author: 'Priya Sharma', avatar: 'PS', content: 'Tip: Use neem oil spray to protect crops from pests naturally. Works great on chilli plants!', category: 'tips', likes: 89, comments: 15, time: '1 day ago', liked: false },
];

export const mockOrders = [
  { id: 'ORD001', product: 'Organic Tomatoes', quantity: 5, price: 200, status: 'delivered', date: '2026-02-20', buyer: 'Amit Shah' },
  { id: 'ORD002', product: 'Basmati Rice', quantity: 10, price: 1200, status: 'outForDelivery', date: '2026-02-25', buyer: 'Neha Gupta' },
  { id: 'ORD003', product: 'Fresh Mangoes', quantity: 3, price: 240, status: 'accepted', date: '2026-02-26', buyer: 'Rohit Verma' },
  { id: 'ORD004', product: 'Green Chillies', quantity: 2, price: 60, status: 'pending', date: '2026-02-27', buyer: 'Sita Ram' },
];

export const monthlyData = [
  { month: 'Sep', sales: 12000, orders: 15 },
  { month: 'Oct', sales: 18000, orders: 22 },
  { month: 'Nov', sales: 15000, orders: 18 },
  { month: 'Dec', sales: 22000, orders: 28 },
  { month: 'Jan', sales: 25000, orders: 32 },
  { month: 'Feb', sales: 31000, orders: 40 },
];
