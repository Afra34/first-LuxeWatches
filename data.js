// ===== PRODUCT DATA =====
const products = [
    {
        id: 1,
        name: "Royal Chronograph",
        brand: "Luxewatches",
        price: 12500,
        description: "Elegant chronograph with 18k gold bezel and Swiss automatic movement. Features a date window, sapphire crystal glass, and exhibition case back.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8nCq7cqTUS_QVTUxmZ_Zbb7V8uBcaefQvgnJvGeIjYfHahbDFT7B7RJOj&s=10",
        category: "Chronograph",
        inStock: true,
        rating: 4.9,
        reviews: 127,
        year: 2024,
        caseMaterial: "18k Gold",
        strapMaterial: "Leather",
        movementType: "Automatic",
        waterResistance: "50m",
        warranty: "5 Years",
        features: ["Swiss Automatic", "18k Gold Bezel", "Sapphire Crystal", "50m Water Resistance", "Date Window"]
    },
    {
        id: 2,
        name: "Ocean Diver Pro",
        brand: "Luxewatches",
        price: 8900,
        description: "Professional dive watches with 300m water resistance, helium escape valve, and unidirectional ceramic bezel.",
        image: "https://pk-live-21.slatic.net/kf/S3a74838fe74d494a9127a1c2779f617ea.jpg",
        category: "Diver",
        inStock: true,
        rating: 4.8,
        reviews: 98,
        year: 2024,
        caseMaterial: "Stainless Steel",
        strapMaterial: "Rubber",
        movementType: "Automatic",
        waterResistance: "300m",
        warranty: "5 Years",
        features: ["300m Water Resistance", "Helium Escape Valve", "Ceramic Bezel", "Luminous Dial", "Screw-down Crown"]
    },
    {
        id: 3,
        name: "Classic Dress",
        brand: "Luxewatches",
        price: 7500,
        description: "Timeless dress watches with slim profile, genuine alligator leather strap, and hand-engraved movement.",
        image: "https://i0.wp.com/www.satvagold.com/admin/uploads/2026/06/25/202606251131251603937772.jpg?w=500",
        category: "Dress",
        inStock: true,
        rating: 4.7,
        reviews: 84,
        year: 2024,
        caseMaterial: "Stainless Steel",
        strapMaterial: "Alligator Leather",
        movementType: "Manual-wind",
        waterResistance: "30m",
        warranty: "3 Years",
        features: ["Manual-wind Movement", "Alligator Leather Strap", "Slim Profile", "Hand-engraved", "Sapphire Crystal"]
    },
    {
        id: 4,
        name: "Aviator GMT",
        brand: "Luxewatches",
        price: 14200,
        description: "Pilot watches with GMT function, 24-hour bidirectional bezel, and anti-magnetic movement.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH-iKQqrNSti0qNPLb2f7gERWB8PXb_GcFYaFlX559T3kkJPhst1jObn8&s=10",
        category: "Aviator",
        inStock: false,
        rating: 4.9,
        reviews: 156,
        year: 2023,
        caseMaterial: "Titanium",
        strapMaterial: "Leather",
        movementType: "Automatic",
        waterResistance: "100m",
        warranty: "5 Years",
        features: ["GMT Function", "Anti-magnetic", "24-hour Bezel", "Swiss Movement", "100m Water Resistance"]
    },
    {
        id: 5,
        name: "Skeleton Tourbillon",
        brand: "Luxewatches",
        price: 28500,
        description: "Masterpiece skeleton watches with visible tourbillon mechanism, hand-finished bridges, and 18k rose gold case.",
        image: "https://jsstore.com.pk/wp-content/uploads/2020/09/WhatsApp-Image-2020-09-17-at-18.27.04-400x533.jpeg",
        category: "Tourbillon",
        inStock: true,
        rating: 5.0,
        reviews: 43,
        year: 2024,
        caseMaterial: "18k Rose Gold",
        strapMaterial: "Leather",
        movementType: "Manual-wind",
        waterResistance: "30m",
        warranty: "5 Years",
        features: ["Tourbillon Movement", "18k Rose Gold", "Skeleton Dial", "Hand-finished Bridges", "Limited Edition"]
    },
    {
        id: 6,
        name: "Racing Chrono",
        brand: "Luxewatches",
        price: 9800,
        description: "Sporty chronograph inspired by vintage racing, with tachymeter bezel and high-contrast dial.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd0RbJwSqclEvH2E7-jcYupxne4bKgALt9wq8u7IqFHS9c3pAcKcqvESqS&s=10",
        category: "Chronograph",
        inStock: true,
        rating: 4.6,
        reviews: 72,
        year: 2024,
        caseMaterial: "Stainless Steel",
        strapMaterial: "Leather",
        movementType: "Automatic",
        waterResistance: "100m",
        warranty: "3 Years",
        features: ["Column-wheel Chronograph", "Tachymeter Bezel", "High-contrast Dial", "Sapphire Crystal", "100m Water Resistance"]
    } ,
    {
        id: 7,
        name: "Gold watchesed",
        brand: "Luxewatches",
        price: 285000,
        description: "Masterpiece skeleton watches with visible tourbillon mechanism, hand-finished bridges, and 18k rose gold case.",
        image: "https://sc04.alicdn.com/kf/He7bb978f696845af82b6f11e9991a6ceL.jpg_350x350.jpg",
        category: "Tourbillon",
        inStock: true,
        rating: 5.0,
        reviews: 43,
        year: 2024,
        caseMaterial: "18k Rose Gold",
        strapMaterial: "Leather",
        movementType: "Manual-wind",
        waterResistance: "30m",
        warranty: "5 Years",
        features: ["Tourbillon Movement", "18k Rose Gold", "Skeleton Dial", "Hand-finished Bridges", "Limited Edition"]
    },
    {
        id: 8,
        name: "Black watchesed",
        brand: "Luxewatches",
        price: 10800,
        description: "Sporty chronograph inspired by vintage racing, with tachymeter bezel and high-contrast dial.",
        image: "https://www.coveted.com/_next/image?url=https%3A%2F%2Fassets.coveted.com%2Fwatches%2Fimages%2Funmapped%2Fv1%2Fgenerated%2Fbriaai_final_1734679266_46b9dd2b0ba8_1aa62230765a32b4a3a9f2831105b50c_r27655172_2048x.png&w=3840&q=60",
        category: "Chronograph",
        inStock: true,
        rating: 4.6,
        reviews: 72,
        year: 2024,
        caseMaterial: "Stainless Steel",
        strapMaterial: "Leather",
        movementType: "Automatic",
        waterResistance: "100m",
        warranty: "3 Years",
        features: ["Column-wheel Chronograph", "Tachymeter Bezel", "High-contrast Dial", "Sapphire Crystal", "100m Water Resistance"]
    }
];

// ===== HELPER FUNCTIONS =====
function getProductById(id) {
    return products.find(p => p.id === parseInt(id));
}

function getFeaturedProducts(count = 4) {
    return products.slice(0, count);
}

function formatPrice(price) {
    return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 0 });
}

function getStockStatus(product) {
    return product.inStock ? 'In Stock' : 'Out of Stock';
}

function getStockClass(product) {
    return product.inStock ? 'in-stock' : 'out-of-stock';
}

function searchProducts(query) {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return products;
    return products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.brand.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
    );
}