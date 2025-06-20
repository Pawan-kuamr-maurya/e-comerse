const mongoose = require('mongoose');
const Item = require('./models/item') // assuming you've defined itemSchema as above
const User = require('./models/User');
// Connect to your MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/noida', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');

  
  //   {
  //     name: 'Demo Item 1',
  //     description: 'Description for demo item 1',
  //     price: 10.99,
  //     category: 'Electronics',
  //     images: [
  //       { url: 'https://via.placeholder.com/150', alt: 'Demo Image 1' }
  //     ],
  //     ratings: [],
  //     stockQuantity: 50,
  //   },
  //   {
  //     name: 'Demo Item 2',
  //     description: 'Description for demo item 2',
  //     price: 20.99,
  //     category: 'Books',
  //     images: [
  //       { url: 'https://via.placeholder.com/150', alt: 'Demo Image 2' }
  //     ],
  //     ratings: [],
  //     stockQuantity: 30,
  //   },
  //   {
  //     name: 'Demo Item 3',
  //     description: 'Description for demo item 3',
  //     price: 15.5,
  //     category: 'Clothing',
  //     images: [
  //       { url: 'https://via.placeholder.com/150', alt: 'Demo Image 3' }
  //     ],
  //     ratings: [],
  //     stockQuantity: 20,
  //   },
  //   {
  //     name: 'Demo Item 4',
  //     description: 'Description for demo item 4',
  //     price: 99.99,
  //     category: 'Electronics',
  //     images: [
  //       { url: 'https://via.placeholder.com/150', alt: 'Demo Image 4' }
  //     ],
  //     ratings: [],
  //     stockQuantity: 10,
  //   },
  //   {
  //     name: 'Demo Item 5',
  //     description: 'Description for demo item 5',
  //     price: 5.75,
  //     category: 'Accessories',
  //     images: [
  //       { url: 'https://via.placeholder.com/150', alt: 'Demo Image 5' }
  //     ],
  //     ratings: [],
  //     stockQuantity: 100,
  //   },
  //   {
  //     name: 'Demo Item 6',
  //     description: 'Description for demo item 6',
  //     price: 45.00,
  //     category: 'Home',
  //     images: [
  //       { url: 'https://via.placeholder.com/150', alt: 'Demo Image 6' }
  //     ],
  //     ratings: [],
  //     stockQuantity: 15,
  //   },
  //   {
  //     name: 'Demo Item 7',
  //     description: 'Description for demo item 7',
  //     price: 12.99,
  //     category: 'Toys',
  //     images: [
  //       { url: 'https://via.placeholder.com/150', alt: 'Demo Image 7' }
  //     ],
  //     ratings: [],
  //     stockQuantity: 25,
  //   },
  //   {
  //     name: 'Demo Item 8',
  //     description: 'Description for demo item 8',
  //     price: 8.50,
  //     category: 'Groceries',
  //     images: [
  //       { url: 'https://via.placeholder.com/150', alt: 'Demo Image 8' }
  //     ],
  //     ratings: [],
  //     stockQuantity: 60,
  //   },
  //   {
  //     name: 'Demo Item 9',
  //     description: 'Description for demo item 9',
  //     price: 199.99,
  //     category: 'Electronics',
  //     images: [
  //       { url: 'https://via.placeholder.com/150', alt: 'Demo Image 9' }
  //     ],
  //     ratings: [],
  //     stockQuantity: 5,
  //   },
  //   {
  //     name: 'Demo Item 10',
  //     description: 'Description for demo item 10',
  //     price: 25.00,
  //     category: 'Beauty',
  //     images: [
  //       { url: 'https://via.placeholder.com/150', alt: 'Demo Image 10' }
  //     ],
  //     ratings: [],
  //     stockQuantity: 40,
  //   },
  // ];
const demoItems = [
  {
    
    name: 'Wireless Headphones',
    description: 'High quality wireless headphones with noise cancellation.',
    price: 99.99,
    category: 'Electronics',
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJeuWl2pfoZyC_7e3TpCxXVlDX4jcJFJgzxw&s', alt: 'Headphones' },{ url: 'https://www.aptronixindia.com/media/catalog/product/cache/31f0162e6f7d821d2237f39577122a8a/b/l/black-01-solo4.jpg.large.2x_1.png', alt: 'Headphones' }],
    stockQuantity: 50,
  },
  {
    
    name: 'Smart Watch',
    description: 'Smart Watch with health tracking features.',
    price: 149.99,
    category: 'Electronics',
    images: [{ url: 'https://m.media-amazon.com/images/I/6199ZpjY0GL.jpg', alt: 'Smart Watch' },{ url: 'https://m.media-amazon.com/images/I/41TXVlo+r4L.jpg', alt: 'Smart Watch' }],
    stockQuantity: 30,
  },
  {
    
    name: 'Leather Wallet',
    description: 'Genuine leather wallet with multiple compartments.',
    price: 45.50,
    category: 'Accessories',
    images: [{ url: 'https://www.wildhorn.in/cdn/shop/products/napa-hide-rfid-protected-genuine-high-quality-leather-wallet-and-pen-combo-for-men-tan-crunch-wildhorn-88366.jpg?v=1749726019&width=1946', alt: 'Wallet' },{ url: 'https://m.media-amazon.com/images/I/81pt1gaiiKL._SX466_.jpg', alt: 'Wallet' }],
    stockQuantity: 100,
  },
  {
    
    name: 'Running Shoes',
    description: 'Comfortable running shoes for daily exercise.',
    price: 85.00,
    category: 'Footwear',
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMtHL8StZoKa-zZRnvgjD2I9jLijqwXANXeQ&s', alt: 'Shoes' }],
    stockQuantity: 40,
  },
  {
    
    name: 'Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with deep bass.',
    price: 60.00,
    category: 'Electronics',
    images: [{ url: 'https://cdn.thewirecutter.com/wp-content/media/2024/11/portablebluetoothspeakers-2048px-9481.jpg?auto=webp&quality=75&width=1024', alt: 'Speaker' }],
    stockQuantity: 75,
  },
  {
    
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat for all exercises.',
    price: 25.99,
    category: 'Fitness',
    images: [{ url: 'https://bionmart.in/cdn/shop/files/EVA1_a511382e-742f-4c61-be90-d42e6501fa65.jpg?v=1709892038&width=1445', alt: 'Yoga Mat' }],
    stockQuantity: 120,
  },
  {
    
    name: 'Digital Camera',
    description: 'High-resolution digital camera with zoom.',
    price: 300.00,
    category: 'Electronics',
    images: [{ url: 'https://amateurphotographer.com/wp-content/uploads/sites/7/2023/03/olympus_C-765_silver_2_1024_Joshua_Waller_P2210025.jpg?w=1024', alt: 'Camera' }],
    stockQuantity: 20,
  },
  {
    
    name: 'Backpack',
    description: 'Water-resistant backpack suitable for travel.',
    price: 55.75,
    category: 'Accessories',
    images: [{ url: 'https://cdn.thewirecutter.com/wp-content/media/2022/09/backpacks-2048px.jpg?auto=webp&quality=75&crop=1.91:1&width=1200', alt: 'Backpack' }],
    stockQuantity: 60,
  },
  {
    
    name: 'LED Desk Lamp',
    description: 'Adjustable LED desk lamp with touch control.',
    price: 35.00,
    category: 'Home & Office',
    images: [{ url: 'https://image.benq.com/is/image/benqco/BenQ%20WiT%20Genie_Scenario%20Photo_Gold_thumbnail', alt: 'Desk Lamp' }],
    stockQuantity: 80,
  },
  {
    
    name: 'Fitness Tracker',
    description: 'Track your daily activity and sleep patterns.',
    price: 49.99,
    category: 'Fitness',
    images: [{ url: 'https://i.pcmag.com/imagery/roundups/0634CGyLGOHgKlIbVidl2zZ-43..v1697126352.jpg', alt: 'Fitness Tracker' }],
    stockQuantity: 90,
  },
  {
    
    name: 'Gaming Mouse',
    description: 'Ergonomic gaming mouse with RGB lighting.',
    price: 40.00,
    category: 'Electronics',
    images: [{ url: 'https://cdn.mos.cms.futurecdn.net/edJGH74sCgtdgFHmvCZxP9.jpg', alt: 'Gaming Mouse' }],
    stockQuantity: 50,
  },
  {
    
    name: 'Cookware Set',
    description: 'Non-stick cookware set for your kitchen.',
    price: 120.00,
    category: 'Home & Kitchen',
    images: [{ url: 'https://sumeetcookware.in/cdn/shop/files/41-1PrDZwKL.jpg?v=1720439438', alt: 'Cookware Set' }],
    stockQuantity: 25,
  },
  {
    
    name: 'Office Chair',
    description: 'Ergonomic office chair with lumbar support.',
    price: 180.00,
    category: 'Furniture',
    images: [{ url: 'https://shop.gkwretail.com/cdn/shop/products/OfficeChairUpholstered5CasterWheelsOfficeChair.jpg?v=1640772341', alt: 'Office Chair' }],
    stockQuantity: 15,
  },
  {
    
    name: 'Smartphone Case',
    description: 'Protective case for smartphones.',
    price: 15.00,
    category: 'Accessories',
    images: [{ url: 'https://www.mobiletorch.in/cdn/shop/files/ChocolatePufferTPU_Soft_CameraProtectionPhoneCase_10_90743620-a918-4fa7-971a-ccb535766e49.jpg?v=1737100742', alt: 'Phone Case' }],
    stockQuantity: 200,
  },
  {
    
    name: 'USB Flash Drive',
    description: '64GB USB 3.0 flash drive.',
    price: 12.50,
    category: 'Electronics',
    images: [{ url: 'https://www.jiomart.com/images/product/original/491004849/sandisk-64-gb-cruzer-blade-usb-flash-drive-cz50-digital-o491004849-p590039453-0-202109061316.jpeg?im=Resize=(1000,1000)', alt: 'USB Drive' }],
    stockQuantity: 150,
  },
  {
    
    name: 'Electric Kettle',
    description: 'Fast boiling electric kettle.',
    price: 30.00,
    category: 'Home & Kitchen',
    images: [{ url: 'https://rukminim2.flixcart.com/image/850/1000/krkyt8w0/electric-kettle/7/r/e/stainless-steel-electric-kettle-multipurpose-tea-coffee-maker-original-imag5cbdfjzrm6fc.jpeg?q=90&crop=false', alt: 'Kettle' }],
    stockQuantity: 35,
  },
  {
    
    name: 'Portable Hard Drive',
    description: '1TB portable external hard drive.',
    price: 80.00,
    category: 'Electronics',
    images: [{ url: 'https://cdn.thewirecutter.com/wp-content/media/2023/05/externalhardrives-2048px-09422.jpg', alt: 'Hard Drive' }],
    stockQuantity: 40,
  },
  {
    
    name: 'Wall Art',
    description: 'Decorative wall art for living room.',
    price: 70.00,
    category: 'Home Decor',
    images: [{ url: 'https://media.wallmantra.store/product/original/wallmantra-mandala-metal-wall-art-set-of-1-614C.jpg', alt: 'Wall Art' }],
    stockQuantity: 20,
  },
  {
    
    name: 'Wireless Charger',
    description: 'Fast wireless charging pad.',
    price: 25.00,
    category: 'Electronics',
    images: [{ url: 'https://honeywellconnection.com/in/wp-content/uploads/2024/08/main-image-4.jpg', alt: 'Wireless Charger' }],
    stockQuantity: 70,
  },
];


let admin= {
  
    name: 'pawan maurya',
    email: 'pawan@gmail.com',
    password: '$2b$10$qzhzxjCKihUMiyvc6s.zDe0gjTHIPHS3yVCfeJZxnuxh./D9VZLIm',
    role: 'admin',
    phone: '+917827897387',
    address: { street: '12 a', city: 'fbd', state: 'har', country: 'India' ,zipCode:121003 },
    age: 22,
    gender: 'male',
    profileImage: 'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?cs=srgb&dl=pexels-pixabay-268533.jpg&fm=jpg',

    cartitems: [  ],
    wallet: 50000,
    orders: []
  }

try{
  await User.insertOne(admin);
   console.log("admin  update sussfullt  pawan@gmail.com     1234");
}catch(e){
  console.log("admin not update sussfullt");
  
}


  try {
    await Item.insertMany(demoItems);
    console.log('Demo items inserted successfully');
  } catch (err) {
    console.error('Error inserting demo items:', err);
  } finally {
    mongoose.disconnect();
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});