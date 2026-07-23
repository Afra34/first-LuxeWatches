// ===== WISHLIST MODULE =====
const Wishlist = {
    get() {
        try {
            return JSON.parse(localStorage.getItem('wishlist')) || [];
        } catch {
            return [];
        }
    },

    save(wishlist) {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        this.updateBadges();
    },

    add(productId) {
        const wishlist = this.get();
        if (!wishlist.includes(productId)) {
            wishlist.push(productId);
            this.save(wishlist);
            Cart.showNotification('Added to wishlist! ❤️', 'success');
        }
    },

    remove(productId) {
        let wishlist = this.get();
        wishlist = wishlist.filter(id => id !== productId);
        this.save(wishlist);
        Cart.showNotification('Removed from wishlist', 'info');
    },

    toggle(productId) {
        const wishlist = this.get();
        if (wishlist.includes(productId)) {
            this.remove(productId);
            return false;
        } else {
            this.add(productId);
            return true;
        }
    },

    isInWishlist(productId) {
        return this.get().includes(productId);
    },

    updateBadges() {
        const wishlist = this.get();
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const id = parseInt(btn.dataset.id);
            if (wishlist.includes(id)) {
                btn.innerHTML = '<i class="fas fa-heart"></i>';
                btn.classList.add('active');
            } else {
                btn.innerHTML = '<i class="far fa-heart"></i>';
                btn.classList.remove('active');
            }
        });
    }
};

// ===== CART MODULE =====
const Cart = {
    get() {
        try {
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch {
            return [];
        }
    },

    save(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateBadge();
        document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
    },

    add(productId, quantity = 1) {
        const cart = this.get();
        const existing = cart.find(item => item.id === productId);
        
        if (existing) {
            existing.quantity += quantity;
        } else {
            const product = getProductById(productId);
            if (product && product.inStock) {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity
                });
            } else {
                this.showNotification('Product is out of stock!', 'error');
                return;
            }
        }
        
        this.save(cart);
        this.showNotification('Added to cart! 🛒', 'success');
    },

    remove(productId) {
        let cart = this.get();
        cart = cart.filter(item => item.id !== productId);
        this.save(cart);
        this.showNotification('Removed from cart', 'info');
    },

    updateQuantity(productId, quantity) {
        const cart = this.get();
        const item = cart.find(i => i.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.remove(productId);
                return;
            }
            item.quantity = quantity;
            this.save(cart);
        }
    },

    getTotalItems() {
        const cart = this.get();
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    },

    getTotalPrice() {
        const cart = this.get();
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    getSubtotal() {
        return this.getTotalPrice();
    },

    getTax() {
        return this.getTotalPrice() * 0.08;
    },

    getGrandTotal() {
        return this.getTotalPrice() + this.getTax();
    },

    clear() {
        this.save([]);
        this.showNotification('Cart cleared', 'info');
    },

    updateBadge() {
        const badges = document.querySelectorAll('.cart-badge');
        const count = this.getTotalItems();
        badges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline' : 'none';
        });
    },

    showNotification(message, type = 'success') {
        const existing = document.querySelector('.notification-toast');
        if (existing) existing.remove();

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };

        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.innerHTML = `
            <i class="fas ${icons[type] || icons.success}"></i>
            ${message}
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    renderCart() {
        const container = document.getElementById('cart-container');
        if (!container) return;

        const cart = this.get();
        
        if (cart.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-icon"><i class="fas fa-shopping-bag"></i></div>
                    <h2>Your Cart is Empty</h2>
                    <p>Discover our collection of luxury timepieces</p>
                    <a href="product-list.html" class="btn btn-gold">Explore watches</a>
                </div>
            `;
            return;
        }

        let html = `
            <div class="cart-container">
                <div class="cart-items">
        `;

        cart.forEach(item => {
            html += `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-brand">Luxewatches</div>
                        <div class="item-price">${formatPrice(item.price)}</div>
                    </div>
                    <div class="cart-item-actions">
                        <button class="qty-btn" data-id="${item.id}" data-action="minus">−</button>
                        <input type="number" min="1" value="${item.quantity}" 
                               data-id="${item.id}" class="cart-qty-input">
                        <button class="qty-btn" data-id="${item.id}" data-action="plus">+</button>
                        <button class="remove-btn" data-id="${item.id}" title="Remove item">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    <div class="cart-item-total">
                        ${formatPrice(item.price * item.quantity)}
                    </div>
                </div>
            `;
        });

        const subtotal = this.getSubtotal();
        const tax = this.getTax();
        const total = this.getGrandTotal();

        html += `
                </div>
                <div class="cart-summary">
                    <div class="cart-summary-row">
                        <span class="label">Subtotal</span>
                        <span class="value">${formatPrice(subtotal)}</span>
                    </div>
                    <div class="cart-summary-row">
                        <span class="label">Tax (8%)</span>
                        <span class="value">${formatPrice(tax)}</span>
                    </div>
                    <div class="cart-summary-row total">
                        <span class="label">Total</span>
                        <span class="value">${formatPrice(total)}</span>
                    </div>
                </div>
                <div class="cart-actions">
                    <a href="product-list.html" class="btn btn-outline">Continue Shopping</a>
                    <button class="btn btn-outline" id="clear-cart">Clear Cart</button>
                    <a href="checkout.html" class="btn btn-gold">Proceed to Checkout</a>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Quantity buttons
        container.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.dataset.id);
                const input = container.querySelector(`.cart-qty-input[data-id="${id}"]`);
                let qty = parseInt(input.value) || 1;
                if (btn.dataset.action === 'plus') qty++;
                else if (btn.dataset.action === 'minus') qty--;
                if (qty < 1) qty = 1;
                input.value = qty;
                this.updateQuantity(id, qty);
                this.renderCart();
            });
        });

        container.querySelectorAll('.cart-qty-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = parseInt(e.target.dataset.id);
                const qty = parseInt(e.target.value) || 1;
                this.updateQuantity(id, qty);
                this.renderCart();
            });
        });

        container.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.remove-btn').dataset.id);
                this.remove(id);
                this.renderCart();
            });
        });

        container.querySelector('#clear-cart')?.addEventListener('click', () => {
            if (confirm('Clear all items from your cart?')) {
                this.clear();
                this.renderCart();
            }
        });
    }
};

// ===== SIDEBAR MODULE =====
const Sidebar = {
    init() {
        this.createSidebar();
        this.createOverlay();
        this.setupEvents();
    },

    createSidebar() {
        if (document.querySelector('.sidebar')) return;

        const sidebarHTML = `
            <div class="sidebar" id="sidebar">
                <div class="sidebar-header">
                    <div class="sidebar-logo">
                        <i class="fas fa-crown"></i> Luxewatches
                    </div>
                    <button class="sidebar-close" id="sidebarClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <nav class="sidebar-nav">
                    <a href="home.html"><i class="fas fa-home"></i> Home</a>
                    <a href="product-list.html"><i class="fas fa-clock"></i> watches</a>
                    <a href="blog.html"><i class="fas fa-newspaper"></i> Blog</a>
                    <a href="events.html"><i class="fas fa-calendar-alt"></i> Events</a>
                    <a href="contact.html"><i class="fas fa-envelope"></i> Contact</a>
                    <a href="login.html"><i class="fas fa-user"></i> Login</a>
                    <a href="register.html"><i class="fas fa-user-plus"></i> Register</a>
                    <a href="cart.html"><i class="fas fa-shopping-bag"></i> Cart
                        <span class="cart-badge" style="margin-left:auto;">0</span>
                    </a>
                </nav>
                <div class="sidebar-footer">
                    <div class="social-links">
                        <a href="#"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-facebook"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', sidebarHTML);
    },

    createOverlay() {
        if (document.querySelector('.sidebar-overlay')) return;
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.id = 'sidebarOverlay';
        document.body.appendChild(overlay);
    },

    setupEvents() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const closeBtn = document.getElementById('sidebarClose');
        const hamburger = document.querySelector('.hamburger');

        if (!sidebar || !overlay) return;

        if (hamburger) {
            hamburger.addEventListener('click', () => {
                sidebar.classList.add('open');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        const closeSidebar = () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', closeSidebar);
        }

        overlay.addEventListener('click', closeSidebar);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('open')) {
                closeSidebar();
            }
        });

        sidebar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(closeSidebar, 300);
            });
        });

        document.addEventListener('cartUpdated', () => {
            const badge = sidebar.querySelector('.cart-badge');
            if (badge) {
                const count = Cart.getTotalItems();
                badge.textContent = count;
                badge.style.display = count > 0 ? 'inline' : 'none';
            }
        });
    },

    updateActiveLink() {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;

        const currentPage = window.location.pathname.split('/').pop() || 'home.html';
        sidebar.querySelectorAll('.sidebar-nav a').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
};

// ===== NAVIGATION =====
function initNavigation() {
    Sidebar.init();
    Sidebar.updateActiveLink();

    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

// ===== SEARCH =====
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        const results = searchProducts(query);
        
        if (searchResults) {
            if (results.length > 0 && query.length > 0) {
                searchResults.style.display = 'block';
                searchResults.innerHTML = results.slice(0, 5).map(p => `
                    <a href="product-detail.html?id=${p.id}" class="search-result-item">
                        <img src="${p.image}" alt="${p.name}" width="40" height="40">
                        <div>
                            <div style="font-weight: 600;">${p.name}</div>
                            <div style="color: #d4af37; font-size: 0.85rem;">${formatPrice(p.price)}</div>
                        </div>
                    </a>
                `).join('');
            } else {
                searchResults.style.display = 'none';
            }
        }
    });

    document.addEventListener('click', (e) => {
        if (searchResults && !e.target.closest('.search-container')) {
            searchResults.style.display = 'none';
        }
    });
}

// ===== PRODUCT LIST =====
function renderProductList() {
    const container = document.getElementById('product-list');
    if (!container) return;

    let filteredProducts = [...products];

    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const productCount = document.getElementById('productCount');

    if (categoryFilter && categoryFilter.value !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === categoryFilter.value);
    }

    if (sortFilter) {
        switch(sortFilter.value) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'name':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
    }

    if (productCount) {
        productCount.textContent = filteredProducts.length;
    }

    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-search"></i>
                <h2>No Products Found</h2>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            ${product.rating >= 4.9 ? '<span class="badge">★ Best Seller</span>' : ''}
            <button class="wishlist-btn" data-id="${product.id}" onclick="event.stopPropagation(); Wishlist.toggle(${product.id}); Wishlist.updateBadges();">
                <i class="${Wishlist.isInWishlist(product.id) ? 'fas' : 'far'} fa-heart"></i>
            </button>
            <h3>${product.name}</h3>
            <p class="brand">${product.brand}</p>
            <div class="price">${formatPrice(product.price)}</div>
            <div class="stock-status ${getStockClass(product)}">
                ${getStockStatus(product)}
            </div>
            <button class="btn btn-gold" data-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                <i class="fas fa-cart-plus"></i> ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <a href="product-detail.html?id=${product.id}" class="btn btn-outline btn-sm" style="margin-top: 0.5rem; width: 100%;">View Details</a>
        </div>
    `).join('');

    container.querySelectorAll('.btn-gold[data-id]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            if (!btn.disabled) {
                Cart.add(id);
                Cart.updateBadge();
            }
        });
    });

    container.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.btn') && !e.target.closest('a') && !e.target.closest('.wishlist-btn')) {
                window.location.href = `product-detail.html?id=${card.dataset.id}`;
            }
        });
    });

    Wishlist.updateBadges();
}

// ===== PRODUCT DETAIL =====
function renderProductDetail() {
    const container = document.getElementById('product-detail');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const product = getProductById(id);

    if (!product) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h2>Product Not Found</h2>
                <p>The watches you're looking for doesn't exist.</p>
                <a href="product-list.html" class="btn btn-gold">Browse Collection</a>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="product-detail-grid">
            <div>
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${product.rating >= 4.9 ? '<span class="badge" style="position:absolute;top:1rem;right:1rem;">★ Best Seller</span>' : ''}
            </div>
            <div>
                <nav class="breadcrumb">
                    <a href="home.html">Home</a> ›
                    <a href="product-list.html">watches</a> ›
                    <span>${product.name}</span>
                </nav>
                <h1>${product.name}</h1>
                <p style="color: var(--text-muted); font-size: 1.1rem;">${product.brand}</p>
                <div class="price">${formatPrice(product.price)}</div>
                <div style="margin: 1rem 0; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <span style="background: rgba(212,175,55,0.1); padding: 0.3rem 1rem; border-radius: 50px; font-size: 0.9rem; color: var(--gold);">${product.category}</span>
                    <span style="background: rgba(255,255,255,0.03); padding: 0.3rem 1rem; border-radius: 50px; font-size: 0.9rem; color: ${product.inStock ? '#4caf50' : '#e74c3c'};">${product.inStock ? '✓ In Stock' : '✗ Out of Stock'}</span>
                    <span style="background: rgba(255,255,255,0.03); padding: 0.3rem 1rem; border-radius: 50px; font-size: 0.9rem; color: #f0d060;">★ ${product.rating} (${product.reviews} reviews)</span>
                </div>
                <p style="color: var(--text-secondary); line-height: 2;">${product.description}</p>
                <div style="margin: 1.5rem 0;">
                    <h4 style="color: var(--gold); margin-bottom: 0.5rem;">Key Features</h4>
                    <ul style="color: var(--text-secondary); list-style: disc; padding-left: 1.5rem;">
                        ${product.features.map(f => `<li style="margin-bottom: 0.3rem;">${f}</li>`).join('')}
                    </ul>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; background: var(--bg-card); padding: 1rem; border-radius: var(--radius-sm);">
                    <div><span style="color: var(--text-muted);">Year:</span> ${product.year || '2024'}</div>
                    <div><span style="color: var(--text-muted);">Case:</span> ${product.caseMaterial}</div>
                    <div><span style="color: var(--text-muted);">Strap:</span> ${product.strapMaterial}</div>
                    <div><span style="color: var(--text-muted);">Movement:</span> ${product.movementType}</div>
                    <div><span style="color: var(--text-muted);">Water:</span> ${product.waterResistance}</div>
                    <div><span style="color: var(--text-muted);">Warranty:</span> ${product.warranty}</div>
                </div>
                <button class="btn btn-gold btn-block" data-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                    <i class="fas fa-cart-plus"></i> ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button class="btn btn-outline btn-block mt-1 wishlist-btn" data-id="${product.id}" onclick="event.stopPropagation();">
                    <i class="${Wishlist.isInWishlist(product.id) ? 'fas' : 'far'} fa-heart"></i>
                    ${Wishlist.isInWishlist(product.id) ? ' Remove from Wishlist' : ' Add to Wishlist'}
                </button>
                <a href="product-list.html" class="btn btn-outline btn-block mt-1">Back to Collection</a>
            </div>
        </div>
    `;

    const addBtn = container.querySelector('.btn-gold[data-id]');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const id = parseInt(addBtn.dataset.id);
            if (!addBtn.disabled) {
                Cart.add(id);
                Cart.updateBadge();
            }
        });
    }

    const wishlistBtn = container.querySelector('.wishlist-btn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', () => {
            const id = parseInt(wishlistBtn.dataset.id);
            const isInWishlist = Wishlist.toggle(id);
            wishlistBtn.innerHTML = `
                <i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>
                ${isInWishlist ? ' Remove from Wishlist' : ' Add to Wishlist'}
            `;
        });
    }
}

// ===== CHECKOUT =====
function initCheckout() {
    const form = document.getElementById('checkout-form');
    if (!form) return;

    const cart = Cart.get();
    if (cart.length === 0) {
        document.getElementById('checkout-container').innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon"><i class="fas fa-shopping-bag"></i></div>
                <h2>Your Cart is Empty</h2>
                <p>Add items to your cart before checking out.</p>
                <a href="product-list.html" class="btn btn-gold">Browse watches</a>
            </div>
        `;
        return;
    }

    const summary = document.getElementById('order-summary');
    if (summary) {
        let html = '<h3 style="color: var(--gold); margin-bottom: 1rem;">Order Summary</h3>';
        cart.forEach(item => {
            html += `
                <div style="display: flex; align-items: center; gap: 1rem; padding: 0.5rem 0; border-bottom: 1px solid var(--glass-border);">
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                    <div style="flex: 1;">
                        <div style="font-weight: 500;">${item.name}</div>
                        <div style="color: var(--text-muted); font-size: 0.85rem;">× ${item.quantity}</div>
                    </div>
                    <div style="color: var(--gold); font-weight: 600;">${formatPrice(item.price * item.quantity)}</div>
                </div>
            `;
        });
        const subtotal = Cart.getSubtotal();
        const tax = Cart.getTax();
        const total = Cart.getGrandTotal();
        html += `
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 2px solid var(--glass-border);">
                <div style="display: flex; justify-content: space-between; color: var(--text-muted); padding: 0.25rem 0;">
                    <span>Subtotal</span> <span>${formatPrice(subtotal)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; color: var(--text-muted); padding: 0.25rem 0;">
                    <span>Tax (8%)</span> <span>${formatPrice(tax)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; font-size: 1.2rem; font-weight: 700;">
                    <span style="color: var(--gold);">Total</span>
                    <span style="color: var(--gold);">${formatPrice(total)}</span>
                </div>
            </div>
        `;
        summary.innerHTML = html;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('full-name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const address = document.getElementById('address')?.value.trim();
        const card = document.getElementById('card-number')?.value.trim();

        if (!name || !email || !address || !card) {
            alert('Please fill in all required fields.');
            return;
        }

        const orderNumber = 'LW' + Date.now().toString().slice(-8);
        alert(`🎉 Order placed successfully!\nOrder #: ${orderNumber}\nThank you for your purchase!`);
        Cart.clear();
        Cart.updateBadge();
        window.location.href = 'home.html';
    });
}

// ===== CONTACT =====
function initContact() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contact-name')?.value.trim();
        const email = document.getElementById('contact-email')?.value.trim();
        const message = document.getElementById('contact-message')?.value.trim();

        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }

        alert('✓ Message sent! We\'ll get back to you soon.');
        form.reset();
    });
}

// ===== AUTH =====
function initAuth() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email')?.value.trim();
            const password = document.getElementById('login-password')?.value.trim();

            if (!email || !password) {
                alert('Please enter email and password.');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                alert('✓ Login successful! Welcome back.');
                window.location.href = 'home.html';
            } else {
                alert('❌ Invalid email or password. Please register first.');
            }
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name')?.value.trim();
            const email = document.getElementById('reg-email')?.value.trim();
            const password = document.getElementById('reg-password')?.value.trim();
            const confirm = document.getElementById('reg-confirm')?.value.trim();

            if (!name || !email || !password || !confirm) {
                alert('Please fill in all fields.');
                return;
            }

            if (password !== confirm) {
                alert('Passwords do not match.');
                return;
            }

            if (password.length < 6) {
                alert('Password must be at least 6 characters.');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.find(u => u.email === email)) {
                alert('❌ Email already registered. Please login.');
                return;
            }

            users.push({ name, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify({ name, email }));
            
            alert('✓ Registration successful! Welcome to Luxewatches.');
            window.location.href = 'home.html';
        });
    }
}

// ===== NEWSLETTER =====
function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('newsletter-email')?.value.trim();
        
        if (!email) {
            alert('Please enter your email address.');
            return;
        }

        const subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
        if (subscribers.includes(email)) {
            alert('You are already subscribed!');
            return;
        }

        subscribers.push(email);
        localStorage.setItem('subscribers', JSON.stringify(subscribers));
        alert('✓ Successfully subscribed to our newsletter!');
        form.reset();
    });
}

// ===== BLOG =====
function renderBlog() {
    const container = document.getElementById('blogGrid');
    if (!container) return;

    const blogPosts = [
        {
            title: "The Art of watchesmaking",
            description: "Discover the centuries-old craft behind luxury timepieces. From movement assembly to final finishing, explore the meticulous process.",
            icon: "fa-clock",
            tags: ["Craftsmanship", "Heritage"]
        },
        {
            title: "Choosing Your First Luxury watches",
            description: "A comprehensive guide to finding the perfect timepiece for your collection. Learn about movements, materials, and what to look for.",
            icon: "fa-gem",
            tags: ["Buying Guide", "Tips"]
        },
        {
            title: "watches Maintenance Tips",
            description: "Keep your luxury watches running perfectly for generations. Essential care tips, service intervals, and storage advice.",
            icon: "fa-tools",
            tags: ["Maintenance", "Care"]
        },
        {
            title: "The History of Chronographs",
            description: "From racing to aviation, explore the evolution of the chronograph watches. Discover how this complication became essential.",
            icon: "fa-history",
            tags: ["History", "Chronograph"]
        },
        {
            title: "GMT watches for Travelers",
            description: "Track multiple time zones with style and precision. The ultimate guide to GMT watches for the modern traveler.",
            icon: "fa-globe",
            tags: ["GMT", "Travel"]
        },
        {
            title: "watches Collecting 101",
            description: "Essential tips for starting your luxury watches collection. Investment advice, authentication, and building a curated collection.",
            icon: "fa-award",
            tags: ["Collecting", "Guide"]
        }
    ];

    container.innerHTML = blogPosts.map(post => `
        <div class="blog-card">
            <div class="blog-image"><i class="fas ${post.icon}"></i></div>
            <h3>${post.title}</h3>
            <p>${post.description}</p>
            <div class="blog-tags">${post.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
            <a href="#" class="btn btn-outline btn-sm">Read Article</a>
        </div>
    `).join('');
}

// ===== EVENTS =====
function renderEvents() {
    const container = document.getElementById('eventsContainer');
    if (!container) return;

    const events = [
        {
            day: "15", month: "June 2026", weekday: "Saturday",
            title: "Luxury watches Exhibition",
            description: "Join us for an exclusive showcase of our latest collection. Meet master watchesmakers and see rare timepieces.",
            location: "New York, NY", time: "10:00 AM - 8:00 PM"
        },
        {
            day: "28", month: "July 2026", weekday: "Tuesday",
            title: "watchesmaking Workshop",
            description: "Learn the art of watchesmaking from master craftsmen. Hands-on experience with movements and assembly.",
            location: "Geneva, Switzerland", time: "9:00 AM - 5:00 PM"
        },
        {
            day: "12", month: "August 2026", weekday: "Wednesday",
            title: "Collector's Auction",
            description: "Rare and vintage timepieces up for auction. Including limited edition pieces from renowned brands.",
            location: "London, UK", time: "2:00 PM - 10:00 PM"
        },
        {
            day: "5", month: "September 2026", weekday: "Saturday",
            title: "Luxewatches Gala",
            description: "An evening of elegance celebrating the finest in horology. Red carpet, dinner, and exclusive previews.",
            location: "Paris, France", time: "7:00 PM - 2:00 AM"
        }
    ];

    container.innerHTML = events.map(event => `
        <div class="event-card">
            <div class="event-date">
                <div class="day">${event.day}</div>
                <div class="month">${event.month}</div>
                <div class="weekday">${event.weekday}</div>
            </div>
            <div class="event-info">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <div class="event-meta">
                    <i class="fas fa-map-marker-alt"></i> ${event.location}
                    <span style="margin-left:16px;"><i class="fas fa-clock"></i> ${event.time}</span>
                </div>
                <a href="#" class="btn btn-gold btn-sm" style="margin-top:12px;">RSVP Now</a>
            </div>
        </div>
    `).join('');
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    Cart.updateBadge();
    initNavigation();
    setupSearch();
    initNewsletter();

    const path = window.location.pathname;
    
    if (path.includes('product-list.html')) {
        renderProductList();
        document.getElementById('categoryFilter')?.addEventListener('change', renderProductList);
        document.getElementById('sortFilter')?.addEventListener('change', renderProductList);
    } else if (path.includes('product-detail.html')) {
        renderProductDetail();
    } else if (path.includes('cart.html')) {
        Cart.renderCart();
    } else if (path.includes('checkout.html')) {
        initCheckout();
    } else if (path.includes('contact.html')) {
        initContact();
    } else if (path.includes('login.html') || path.includes('register.html')) {
        initAuth();
    } else if (path.includes('blog.html')) {
        renderBlog();
    } else if (path.includes('events.html')) {
        renderEvents();
    }
});