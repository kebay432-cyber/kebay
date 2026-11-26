export interface DemoProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price: number;
  image: string;
  images: string[];
  category: string;
  stock: number;
  seller: {
    id: string;
    name: string;
    whatsapp: string;
    rating: number;
    sales: number;
  };
}

export const demoProducts: DemoProduct[] = [
  {
    id: 'demo-1',
    title: 'Samsung Galaxy A55 5G 128GB',
    description: 'Brand new Samsung Galaxy A55 5G. 6.6\" Super AMOLED display, 50MP triple camera, 5000mAh battery. Ships from Nairobi with 1-year local warranty. Perfect for content creators and professionals.',
    price: 45000,
    original_price: 52000,
    image: 'https://picsum.photos/seed/samsung-a55/400/400',
    images: ['https://picsum.photos/seed/samsung-a55-1/600/600', 'https://picsum.photos/seed/samsung-a55-2/600/600'],
    category: 'phones',
    stock: 3,
    seller: { id: 'seller-demo-1', name: 'Nairobi Tech Hub', whatsapp: '254712345678', rating: 4.8, sales: 142 }
  },
  {
    id: 'demo-2',
    title: 'iPhone 14 Pro Max 256GB',
    description: 'Apple iPhone 14 Pro Max. 48MP ProRAW camera, Dynamic Island, A16 Bionic chip. Space Black. Bought abroad, Kenyan warranty seal intact. Free delivery within Nairobi.',
    price: 145000,
    original_price: 165000,
    image: 'https://picsum.photos/seed/iphone14-pro/400/400',
    images: ['https://picsum.photos/seed/iphone14-pro-1/600/600', 'https://picsum.photos/seed/iphone14-pro-2/600/600'],
    category: 'phones',
    stock: 2,
    seller: { id: 'seller-demo-2', name: 'Nairobi Tech Hub', whatsapp: '254712345678', rating: 4.9, sales: 89 }
  },
  {
    id: 'demo-3',
    title: 'HP Laptop 15s Intel Core i5 11th Gen',
    description: 'HP 15s, Intel Core i5-1135G7, 8GB RAM, 512GB SSD, 15.6\" FHD IPS. Windows 11 Home. Ideal for university students and remote workers in Kenya. Fast, reliable, and light.',
    price: 68000,
    original_price: 75000,
    image: 'https://picsum.photos/seed/hp-laptop-15s/400/400',
    images: ['https://picsum.photos/seed/hp-laptop-15s-1/600/600', 'https://picsum.photos/seed/hp-laptop-15s-2/600/600'],
    category: 'computers',
    stock: 5,
    seller: { id: 'seller-demo-3', name: 'Mombasa Tech Store', whatsapp: '254722345678', rating: 4.7, sales: 67 }
  },
  {
    id: 'demo-4',
    title: 'MacBook Air M2 8GB 256GB',
    description: 'Apple MacBook Air with M2 chip. 13.6\" Liquid Retina display, 18-hour battery, fanless design. Silver. Brand new, sealed box. Best laptop for creatives and developers in Kenya.',
    price: 128000,
    original_price: 142000,
    image: 'https://picsum.photos/seed/macbook-air-m2/400/400',
    images: ['https://picsum.photos/seed/macbook-air-m2-1/600/600', 'https://picsum.photos/seed/macbook-air-m2-2/600/600'],
    category: 'computers',
    stock: 2,
    seller: { id: 'seller-demo-3', name: 'Mombasa Tech Store', whatsapp: '254722345678', rating: 4.9, sales: 55 }
  },
  {
    id: 'demo-5',
    title: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Sony WH-1000XM5. Industry-leading noise cancellation, 30-hour battery, multipoint connection. Perfect for Nairobi commuters on matatu or working from home. Sealed box.',
    price: 35000,
    original_price: 42000,
    image: 'https://picsum.photos/seed/sony-xm5/400/400',
    images: ['https://picsum.photos/seed/sony-xm5-1/600/600', 'https://picsum.photos/seed/sony-xm5-2/600/600'],
    category: 'electronics',
    stock: 4,
    seller: { id: 'seller-demo-4', name: 'Kisumu Electronics', whatsapp: '254733345678', rating: 4.9, sales: 55 }
  },
  {
    id: 'demo-6',
    title: 'LG Smart TV 43\" Full HD WebOS',
    description: 'LG 43\" Smart TV, Full HD 1080p, WebOS 22, built-in WiFi, Bluetooth. Access Netflix, YouTube, Showmax. Free wall-mount bracket. Free delivery within Nairobi and Kiambu.',
    price: 55000,
    original_price: 65000,
    image: 'https://picsum.photos/seed/lg-tv-43/400/400',
    images: ['https://picsum.photos/seed/lg-tv-43-1/600/600', 'https://picsum.photos/seed/lg-tv-43-2/600/600'],
    category: 'electronics',
    stock: 2,
    seller: { id: 'seller-demo-5', name: 'Kisumu Electronics', whatsapp: '254733345678', rating: 4.6, sales: 38 }
  },
  {
    id: 'demo-7',
    title: 'Nike Air Max 270 — Size 42',
    description: 'Authentic Nike Air Max 270. Black/white colourway, size EU 42 (UK 8). Brand new with original box. Imported directly. Popular with Nairobi youth. Limited stock.',
    price: 12000,
    original_price: 15000,
    image: 'https://picsum.photos/seed/nike-airmax-270/400/400',
    images: ['https://picsum.photos/seed/nike-airmax-270-1/600/600', 'https://picsum.photos/seed/nike-airmax-270-2/600/600'],
    category: 'fashion',
    stock: 2,
    seller: { id: 'seller-demo-6', name: 'Mombasa Fashion House', whatsapp: '254744345678', rating: 4.7, sales: 67 }
  },
  {
    id: 'demo-8',
    title: 'Kitenge Dress — Ankara Print Medium',
    description: 'Handmade Kenyan Kitenge dress, Ankara fabric, vibrant multi-colour print. Medium size. Tailored in Nairobi. Perfect for weddings, harambees, and casual Fridays. Machine washable.',
    price: 2500,
    original_price: 3200,
    image: 'https://picsum.photos/seed/kitenge-dress/400/400',
    images: ['https://picsum.photos/seed/kitenge-dress-1/600/600', 'https://picsum.photos/seed/kitenge-dress-2/600/600'],
    category: 'fashion',
    stock: 8,
    seller: { id: 'seller-demo-6', name: 'Mombasa Fashion House', whatsapp: '254744345678', rating: 4.8, sales: 203 }
  },
  {
    id: 'demo-9',
    title: 'Toyota Alloy Rims 15\" Set of 4',
    description: 'Set of 4 genuine Toyota alloy rims, 15 inch, fits Corolla, Fielder, Axio (2010–2022). With good-condition Bridgestone tyres 195/65 R15. Located in Ngong Road, Nairobi.',
    price: 28000,
    original_price: 32000,
    image: 'https://picsum.photos/seed/toyota-rims/400/400',
    images: ['https://picsum.photos/seed/toyota-rims-1/600/600', 'https://picsum.photos/seed/toyota-rims-2/600/600'],
    category: 'motors',
    stock: 1,
    seller: { id: 'seller-demo-7', name: 'Nairobi Auto Parts', whatsapp: '254755345678', rating: 4.5, sales: 23 }
  },
  {
    id: 'demo-10',
    title: 'Vitron 2-Door Fridge 120L',
    description: 'Vitron VR130DF 120-litre double-door refrigerator. Energy-saving compressor, vegetable crisper, interior light. Ideal for Nairobi bedsitters and small families. 1-year local warranty.',
    price: 22000,
    original_price: 26000,
    image: 'https://picsum.photos/seed/vitron-fridge/400/400',
    images: ['https://picsum.photos/seed/vitron-fridge-1/600/600', 'https://picsum.photos/seed/vitron-fridge-2/600/600'],
    category: 'home',
    stock: 3,
    seller: { id: 'seller-demo-8', name: 'Nakuru Home Furnishings', whatsapp: '254766345678', rating: 4.6, sales: 41 }
  },
  {
    id: 'demo-11',
    title: 'L-Shaped Sofa Set 5-Seater',
    description: 'Modern L-shaped sofa, brown leather finish, solid wood frame. 5-seater. Includes 3 throw pillows. Manufactured in Kenya. Free delivery within Nairobi. Assembly included.',
    price: 65000,
    original_price: 80000,
    image: 'https://picsum.photos/seed/sofa-lshape/400/400',
    images: ['https://picsum.photos/seed/sofa-lshape-1/600/600', 'https://picsum.photos/seed/sofa-lshape-2/600/600'],
    category: 'home',
    stock: 2,
    seller: { id: 'seller-demo-8', name: 'Nakuru Home Furnishings', whatsapp: '254766345678', rating: 4.7, sales: 18 }
  },
  {
    id: 'demo-12',
    title: 'Nunix 2-Plate Electric Cooker',
    description: 'Nunix 2-plate electric hot plate cooker. 2000W, stainless steel surface, cool-touch body. Ideal for hostels, bedsitters, and quick meals. Saves on gas costs. Widely used in Kenya.',
    price: 2800,
    original_price: 3500,
    image: 'https://picsum.photos/seed/nunix-cooker/400/400',
    images: ['https://picsum.photos/seed/nunix-cooker-1/600/600', 'https://picsum.photos/seed/nunix-cooker-2/600/600'],
    category: 'home',
    stock: 10,
    seller: { id: 'seller-demo-8', name: 'Nakuru Home Furnishings', whatsapp: '254766345678', rating: 4.4, sales: 88 }
  },
  {
    id: 'demo-13',
    title: 'Kipchoge Running Shoes — Size 43',
    description: 'Professional running shoes inspired by Kenyan athletics culture. Lightweight mesh upper, cushioned sole, anti-slip. Size EU 43. Great for Karura Forest joggers and Uhuru Park walkers.',
    price: 4500,
    original_price: 6000,
    image: 'https://picsum.photos/seed/running-shoes/400/400',
    images: ['https://picsum.photos/seed/running-shoes-1/600/600', 'https://picsum.photos/seed/running-shoes-2/600/600'],
    category: 'sporting',
    stock: 6,
    seller: { id: 'seller-demo-9', name: 'Eldoret Sports World', whatsapp: '254777345678', rating: 4.6, sales: 54 }
  },
  {
    id: 'demo-14',
    title: 'Football — FIFA Quality Pro',
    description: 'FIFA Quality Pro match football, size 5. Used by Kenya Premier League teams. Durable synthetic leather, perfect weight and balance. Comes with a hand pump. Ship to any county.',
    price: 3200,
    original_price: 4000,
    image: 'https://picsum.photos/seed/football-pro/400/400',
    images: ['https://picsum.photos/seed/football-pro-1/600/600', 'https://picsum.photos/seed/football-pro-2/600/600'],
    category: 'sporting',
    stock: 15,
    seller: { id: 'seller-demo-9', name: 'Eldoret Sports World', whatsapp: '254777345678', rating: 4.5, sales: 120 }
  },
  {
    id: 'demo-15',
    title: 'Tecno Spark 20 Pro 128GB',
    description: 'Tecno Spark 20 Pro. 6.78\" FHD+ display, 108MP AI camera, 5000mAh battery, 18W fast charge. Gravity Black. Best budget smartphone for Kenyan students and business people.',
    price: 18500,
    original_price: 21000,
    image: 'https://picsum.photos/seed/tecno-spark20/400/400',
    images: ['https://picsum.photos/seed/tecno-spark20-1/600/600', 'https://picsum.photos/seed/tecno-spark20-2/600/600'],
    category: 'phones',
    stock: 8,
    seller: { id: 'seller-demo-1', name: 'Nairobi Tech Hub', whatsapp: '254712345678', rating: 4.6, sales: 198 }
  },
  {
    id: 'demo-16',
    title: 'Citizen Solar Watch — Men\'s',
    description: 'Citizen Eco-Drive solar-powered watch for men. Stainless steel case and bracelet, sapphire glass, water-resistant to 100m. Never needs a battery. Ships from Nairobi CBD.',
    price: 25000,
    original_price: 30000,
    image: 'https://picsum.photos/seed/citizen-watch/400/400',
    images: ['https://picsum.photos/seed/citizen-watch-1/600/600', 'https://picsum.photos/seed/citizen-watch-2/600/600'],
    category: 'fashion',
    stock: 3,
    seller: { id: 'seller-demo-6', name: 'Mombasa Fashion House', whatsapp: '254744345678', rating: 4.7, sales: 32 }
  },
  {
    id: 'demo-17',
    title: 'Ramtons Blender 1.5L 600W',
    description: 'Ramtons RM/315 blender. 1.5-litre glass jar, 600W motor, stainless steel blades, 3-speed settings. Ideal for making mango juice, avocado smoothies, and githeri. Kenyan brand.',
    price: 3500,
    original_price: 4200,
    image: 'https://picsum.photos/seed/ramtons-blender/400/400',
    images: ['https://picsum.photos/seed/ramtons-blender-1/600/600', 'https://picsum.photos/seed/ramtons-blender-2/600/600'],
    category: 'home',
    stock: 7,
    seller: { id: 'seller-demo-8', name: 'Nakuru Home Furnishings', whatsapp: '254766345678', rating: 4.5, sales: 76 }
  },
  {
    id: 'demo-18',
    title: 'DJI Mini 3 Drone with RC-N1',
    description: 'DJI Mini 3 camera drone. 4K/60fps video, 48MP photo, 38-min flight time, under 249g (no KAA registration required in Kenya). Perfect for filming Kenyan landscapes and events.',
    price: 95000,
    original_price: 110000,
    image: 'https://picsum.photos/seed/dji-mini3/400/400',
    images: ['https://picsum.photos/seed/dji-mini3-1/600/600', 'https://picsum.photos/seed/dji-mini3-2/600/600'],
    category: 'electronics',
    stock: 1,
    seller: { id: 'seller-demo-4', name: 'Kisumu Electronics', whatsapp: '254733345678', rating: 4.8, sales: 12 }
  },
  {
    id: 'demo-19',
    title: 'Mahindra Tractor Spare Parts Kit',
    description: 'Genuine Mahindra tractor spare parts bundle: oil filter, air filter, fan belt, spark plugs. Compatible with Mahindra 575 and 605 models widely used in Kenyan farms.',
    price: 8500,
    original_price: 11000,
    image: 'https://picsum.photos/seed/tractor-parts/400/400',
    images: ['https://picsum.photos/seed/tractor-parts-1/600/600', 'https://picsum.photos/seed/tractor-parts-2/600/600'],
    category: 'motors',
    stock: 4,
    seller: { id: 'seller-demo-7', name: 'Nairobi Auto Parts', whatsapp: '254755345678', rating: 4.4, sales: 29 }
  },
  {
    id: 'demo-20',
    title: 'Chess Set — Handcarved Kisii Stone',
    description: 'Authentic hand-carved chess set made from Kisii soapstone, crafted by artisans in Kisii County. Each piece is unique. Comes in a wooden storage box. Great gift and collector item.',
    price: 4800,
    original_price: 6000,
    image: 'https://picsum.photos/seed/kisii-chess/400/400',
    images: ['https://picsum.photos/seed/kisii-chess-1/600/600', 'https://picsum.photos/seed/kisii-chess-2/600/600'],
    category: 'collectibles',
    stock: 5,
    seller: { id: 'seller-demo-10', name: 'Kisumu Craft Village', whatsapp: '254788345678', rating: 4.9, sales: 44 }
  }
];

export function getDemoProductById(id: string): DemoProduct | undefined {
  return demoProducts.find(p => p.id === id);
}

export function getDemoProductsByCategory(category: string): DemoProduct[] {
  return demoProducts.filter(p => p.category === category);
}

export function getStaticProductPaths() {
  return demoProducts.map(p => ({ params: { id: p.id } }));
}
