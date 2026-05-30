// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.init();
    }

    init() {
        this.initializeSidebar();
        this.initializeCharts();
        this.initializeEventListeners();
        this.hideAllTabContents();
        this.showTab('dashboard');
    }

    hideAllTabContents() {
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
    }

    showTab(tabName) {
        this.hideAllTabContents();
        const tabContent = document.getElementById(`${tabName}Content`);
        if (tabContent) tabContent.classList.add('active');
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        const activeNav = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeNav) activeNav.classList.add('active');
        this.updatePageTitle(tabName);
    }

    updatePageTitle(tabName) {
        const pageTitle = document.querySelector('.page-title');
        const breadcrumbActive = document.querySelector('.breadcrumb .active');
        const tabTitles = {
            dashboard: 'Dashboard', products: 'Products', orders: 'Orders',
            users: 'Users', analytics: 'Analytics', categories: 'Categories',
            reviews: 'Reviews', settings: 'Settings'
        };
        if (tabTitles[tabName]) {
            if (pageTitle) pageTitle.textContent = tabTitles[tabName];
            if (breadcrumbActive) breadcrumbActive.textContent = tabTitles[tabName];
        }
    }

    initializeSidebar() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const sidebarClose = document.getElementById('sidebarClose');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');

        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                sidebar.classList.add('mobile-open');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        const closeSidebar = () => {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
        if (overlay) overlay.addEventListener('click', closeSidebar);

        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth < 1024) closeSidebar();
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024) closeSidebar();
        });
    }

    initializeCharts() {
        this.createRevenueChart();
        this.createSalesChart();
        this.createRolesChart();
    }

    createRevenueChart() {
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx) {
            new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'Revenue',
                        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 32000, 30000, 35000, 38000, 40000],
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#6366f1',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            mode: 'index', intersect: false,
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            titleColor: '#f1f5f9', bodyColor: '#f1f5f9',
                            borderColor: '#334155', borderWidth: 1,
                            padding: 12, cornerRadius: 8,
                            callbacks: {
                                label: (context) => 'Revenue: $' + context.parsed.y.toLocaleString()
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { drawBorder: false, color: 'rgba(100, 116, 139, 0.1)' },
                            ticks: { callback: (value) => '$' + value.toLocaleString() }
                        },
                        x: { grid: { display: false } }
                    }
                }
            });
        }
    }

    createSalesChart() {
        const salesCtx = document.getElementById('salesChart');
        if (salesCtx) {
            new Chart(salesCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Fiction', 'Non-Fiction', 'Romance', 'Mystery', 'Sci-Fi', 'Biography', 'Business', 'Children'],
                    datasets: [{
                        data: [35, 25, 20, 15, 5, 10, 8, 12],
                        backgroundColor: ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#3b82f6','#50b814','#420611'],
                        borderWidth: 0, hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false, cutout: '70%',
                    plugins: {
                        legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true, pointStyle: 'circle', font: { size: 12 } } },
                        tooltip: {
                            backgroundColor: 'rgba(15, 23, 42, 0.9)', titleColor: '#f1f5f9', bodyColor: '#f1f5f9',
                            borderColor: '#334155', borderWidth: 1, padding: 12, cornerRadius: 8,
                            callbacks: { label: (context) => context.label + ': ' + context.parsed + '%' }
                        }
                    }
                }
            });
        }
    }

    createRolesChart() {
        const rolesCtx = document.getElementById('rolesChart');
        if (rolesCtx) {
            new Chart(rolesCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Customers', 'Admins', 'Editors', 'Authors'],
                    datasets: [{
                        data: [75, 10, 8, 7],
                        backgroundColor: ['#6366f1','#10b981','#f59e0b','#8b5cf6'],
                        borderWidth: 0, hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false, cutout: '60%',
                    plugins: {
                        legend: { position: 'bottom', labels: { padding: 15, usePointStyle: true, pointStyle: 'circle', font: { size: 11 } } }
                    }
                }
            });
        }
    }

    initializeEventListeners() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = item.getAttribute('data-tab');
                if (tabName) this.switchTab(tabName);
            });
        });

        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', () => {
                const action = card.querySelector('.action-title')?.textContent;
                if (action) this.handleQuickAction(action);
            });
        });

        // Order filter buttons
        document.querySelectorAll('.order-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.order-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.getAttribute('data-filter');
                window.ordersManager && window.ordersManager.filterOrders(filter);
            });
        });
    }

    switchTab(tabName) { this.showTab(tabName); }

    handleQuickAction(action) {
        const actions = {
            'Add Product': () => {
                const modalElement = document.getElementById('addProductModal');
                if (modalElement) new bootstrap.Modal(modalElement).show();
            },
            'Process Order': () => { this.switchTab('orders'); },
            'View Reports': () => { this.switchTab('analytics'); },
            'Manage Users': () => { this.switchTab('users'); }
        };
        if (actions[action]) actions[action]();
    }
}

// ===================== NOTIFICATION HELPER =====================
function showNotify(status, title, text) {
    new Notify({
        status, title, text, effect: 'fade', speed: 300,
        showIcon: true, showCloseButton: true, autoclose: true, autotimeout: 3500,
        type: 'outline', position: 'right top'
    });
}

// ===================== DASHBOARD STATS =====================
async function loadDashboardStats() {
    try {
        const response = await fetch('api/admin/data/dashboard-stats');
        if (response.ok) {
            const data = await response.json();
            if (data.status) {
                const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
                set('dashboard-active-users', Number(data.activeUsers).toLocaleString());
                set('dashboard-monthly-revenue', 'LKR ' + Number(data.monthlyRevenue).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                set('dashboard-today-orders', Number(data.todayOrders).toLocaleString());
                set('dashboard-inventory', Number(data.productsInInventory).toLocaleString());
            }
        }
    } catch (e) { console.error("Error loading dashboard stats:", e); }
}

// ===================== CATEGORIES =====================
async function loadCategories() {
    try {
        const response = await fetch('api/admin/data/categories');
        if (response.ok) {
            const data = await response.json();
            const categorySelect = document.getElementById('categorySelect');
            const editCategorySelect = document.getElementById('editCategorySelect');
            if (data.categories && data.categories.length > 0) {
                renderDropDowns(categorySelect, data.categories, 'name');
                if (editCategorySelect) renderDropDowns(editCategorySelect, data.categories, 'name');
                renderCategoryGrid(data.categories);
            }
        }
    } catch (e) {
        showNotify('error', 'Error', 'Failed to load categories.');
        console.error("Error loading categories:", e);
    }
}

function renderCategoryGrid(categories) {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;

    const iconMap = { 1: 'bi-stars', 2: 'bi-book', 3: 'bi-heart', 4: 'bi-lightbulb', 5: 'bi-globe', 6: 'bi-trophy' };
    const gradients = [
        'linear-gradient(135deg, #6366f1, #8b5cf6)',
        'linear-gradient(135deg, #10b981, #059669)',
        'linear-gradient(135deg, #f59e0b, #d97706)',
        'linear-gradient(135deg, #ef4444, #dc2626)',
        'linear-gradient(135deg, #3b82f6, #2563eb)',
        'linear-gradient(135deg, #ec4899, #db2777)'
    ];

    grid.innerHTML = '';
    categories.forEach((cat, idx) => {
        const card = document.createElement('div');
        card.className = 'category-card';
        const gradient = gradients[idx % gradients.length];
        const icon = iconMap[cat.id] || 'bi-tag';
        card.innerHTML = `
            <div class="category-header">
                <div class="category-icon" style="background:${gradient}">
                    <i class="bi ${icon}"></i>
                </div>
                <div class="category-actions">
                    <button class="btn-action" title="Edit" onclick="openEditCategory(${cat.id}, '${cat.name.replace(/'/g,"\\'")}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn-action text-danger" title="Delete" onclick="deleteCategory(${cat.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
            <div class="category-content">
                <h4>${cat.name}</h4>
                <p class="text-muted small">${cat.description || 'No description'}</p>
                <div class="category-stats mt-2">
                    <span class="badge bg-light text-dark">${cat.productCount || 0} Products</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

async function saveCategory() {
    const name = document.getElementById('newCategoryName').value.trim();
    const description = document.getElementById('newCategoryDesc').value.trim();
    if (!name) { showNotify('warning', 'Warning', 'Category name is required.'); return; }

    try {
        const response = await fetch('api/admin/categories/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description })
        });
        const data = await response.json();
        if (data.status) {
            showNotify('success', 'Success', 'Category added successfully!');
            bootstrap.Modal.getInstance(document.getElementById('addCategoryModal')).hide();
            document.getElementById('newCategoryName').value = '';
            document.getElementById('newCategoryDesc').value = '';
            await loadCategories();
        } else {
            showNotify('error', 'Error', data.message || 'Failed to save category.');
        }
    } catch (e) {
        showNotify('error', 'Error', 'Server error while saving category.');
    }
}

function openEditCategory(id, name) {
    document.getElementById('editCategoryId').value = id;
    document.getElementById('editCategoryNameInput').value = name;
    new bootstrap.Modal(document.getElementById('editCategoryModal')).show();
}

async function updateCategory() {
    const id = document.getElementById('editCategoryId').value;
    const name = document.getElementById('editCategoryNameInput').value.trim();
    if (!name) { showNotify('warning', 'Warning', 'Category name is required.'); return; }

    try {
        const response = await fetch(`api/admin/categories/${id}/update`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        const data = await response.json();
        if (data.status) {
            showNotify('success', 'Success', 'Category updated!');
            bootstrap.Modal.getInstance(document.getElementById('editCategoryModal')).hide();
            await loadCategories();
        } else {
            showNotify('error', 'Error', data.message || 'Failed to update category.');
        }
    } catch (e) {
        showNotify('error', 'Error', 'Server error.');
    }
}

async function deleteCategory(id) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
        const response = await fetch(`api/admin/categories/${id}/delete`, { method: 'DELETE' });
        const data = await response.json();
        if (data.status) {
            showNotify('success', 'Success', 'Category deleted!');
            await loadCategories();
        } else {
            showNotify('error', 'Error', data.message || 'Failed to delete category.');
        }
    } catch (e) {
        showNotify('error', 'Error', 'Server error.');
    }
}

// ===================== PRODUCTS =====================
const editor1 = new RichTextEditor('#description');

function renderDropDowns(selector, list, suffix) {
    if (!selector) return;
    selector.innerHTML = `<option value="0">Select</option>`;
    list.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.innerHTML = item[suffix];
        selector.appendChild(option);
    });
}

function formatDateForInput(value) {
    if (!value) return '';
    const raw = value.toString().trim();
    const isoCandidate = raw.includes('T') ? raw.split('T')[0] : raw;
    if (/^\d{4}-\d{2}-\d{2}$/.test(isoCandidate)) return isoCandidate;
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) return '';
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function saveProduct() {
    let imgFileInput = document.getElementById('image-input');
    if (!imgFileInput.files || imgFileInput.files.length === 0) {
        showNotify('warning', 'Warning', 'Please select an image before saving the product.');
        return;
    }

    const productData = {
        title: document.getElementById('productTitle').value,
        description: editor1.getHTMLCode(),
        author: document.getElementById('author').value,
        price: parseFloat(document.getElementById('price').value),
        categoryId: document.getElementById('categorySelect').value,
        isbn: document.getElementById('isbn').value,
        publisher: document.getElementById('publisher').value,
        publishedDate: document.getElementById('publishDate').value,
        language: document.getElementById('language').value,
        pages: parseInt(document.getElementById('pages').value),
        genre: document.getElementById('genre').value,
        stock: parseInt(document.getElementById('stock').value)
    };

    try {
        const response = await fetch('api/admin/products/save-product', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        const data = await response.json();
        if (response.ok && data.status) {
            await uploadProductImage(data.productId);
        } else {
            showNotify('error', 'Error', data.message || 'Failed to save product.');
        }
    } catch (e) {
        showNotify('error', 'Error', "Server error while saving product.");
    }
}

async function uploadProductImage(productId) {
    let imgFileInput = document.getElementById('image-input');
    if (!imgFileInput.files || imgFileInput.files.length === 0) {
        showNotify('warning', 'Warning', 'Please select an image to upload.');
        return;
    }
    const file = imgFileInput.files[0];
    const validation = validateImageFile(file);
    if (!validation.valid) {
        showNotify('warning', 'Invalid File', validation.message);
        imgFileInput.value = '';
        return;
    }
    const formData = new FormData();
    formData.append('image', file);
    try {
        const response = await fetch(`api/admin/products/${productId}/upload-image`, { method: "PUT", body: formData });
        if (response.ok) {
            const data = await response.json();
            if (data.status) {
                showNotify('success', 'Success', 'Product and image saved successfully!');
                document.getElementById('productForm').reset();
                editor1.setHTMLCode("");
                imgFileInput.value = "";
                bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
                window.booksManager && window.booksManager.loadAllBooks();
            } else {
                showNotify('error', 'Error', data.message || 'Failed to upload image.');
            }
        }
    } catch (e) {
        showNotify('error', 'Error', 'Failed to upload image.');
    }
}

function validateImageFile(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const fileExtension = file.name.toLowerCase().split('.').pop();
    const maxSize = 5 * 1024 * 1024;
    if (!allowedExtensions.includes(fileExtension)) return { valid: false, message: 'Only JPG, JPEG, and PNG files are allowed!' };
    if (!allowedTypes.includes(file.type)) return { valid: false, message: 'Invalid file type detected!' };
    if (file.size > maxSize) return { valid: false, message: 'File size must be less than 5MB!' };
    return { valid: true, message: 'Valid image file' };
}

// ===================== BOOKS MANAGER =====================
class LoadBooks {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.allProducts = [];
        this.filteredProducts = [];
        this.changePage = this.changePage.bind(this);
        this.editProduct = this.editProduct.bind(this);
        this.viewProduct = this.viewProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        window.booksManager = this;
        this.init();
    }

    init() {
        this.loadAllBooks();
        this.initSearch();
    }

    initSearch() {
        const searchInput = document.querySelector('#productsContent .search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const q = e.target.value.toLowerCase();
                this.filteredProducts = this.allProducts.filter(p =>
                    p.title.toLowerCase().includes(q) ||
                    p.author.toLowerCase().includes(q) ||
                    (p.categoryName && p.categoryName.toLowerCase().includes(q))
                );
                this.currentPage = 1;
                this.displayBooks(this.filteredProducts);
            });
        }
    }

    async loadAllBooks() {
        try {
            const response = await fetch('api/admin/data/books');
            if (response.ok) {
                const data = await response.json();
                if (data.status) {
                    this.allProducts = data.allProducts;
                    this.filteredProducts = [...this.allProducts];
                    this.currentPage = 1;
                    this.displayBooks(this.filteredProducts);
                }
            }
        } catch (e) { console.error("Error loading books:", e); }
    }

    displayBooks(products) {
        const tbody = document.querySelector('#productsTable tbody');
        tbody.innerHTML = '';
        document.getElementById("books-count").innerHTML = this.allProducts.length;

        if (!products || products.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4"><p class="text-muted">No products found</p></td></tr>`;
            this.updatePagination(0);
            return;
        }

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedProducts = products.slice(startIndex, endIndex);

        paginatedProducts.forEach(product => tbody.appendChild(this.createProductRow(product)));
        this.updatePagination(products.length);
    }

    createProductRow(product) {
        const tr = document.createElement('tr');
        const firstStock = product.stockDTOList && product.stockDTOList.length > 0 ? product.stockDTOList[0] : null;
        const price = firstStock ? `LKR ${firstStock.price.toFixed(2)}` : 'N/A';
        const stock = firstStock ? firstStock.stock : 0;

        let stockBadge;
        if (stock === 0) stockBadge = '<span class="badge bg-danger">Out of Stock</span>';
        else if (stock < 10) stockBadge = `<span class="badge bg-warning">Low Stock (${stock})</span>`;
        else stockBadge = `<span class="badge bg-success">In Stock (${stock})</span>`;

        const imageUrl = product.images && product.images.length > 0
            ? product.images[0]
            : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=48&h=48&fit=crop';

        tr.innerHTML = `
            <td>
                <div class="product-cell">
                    <div class="product-image">
                        <img src="${imageUrl}" alt="${product.title}" onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=48&h=48&fit=crop'">
                    </div>
                    <div class="product-info">
                        <div class="product-name">${product.title}</div>
                        <div class="product-author">${product.author}</div>
                        <div class="product-isbn">ID: ${product.productId}</div>
                    </div>
                </div>
            </td>
            <td><span class="badge bg-light text-dark">${product.categoryName || 'N/A'}</span></td>
            <td><div class="product-price">${price}</div></td>
            <td><div class="stock-status">${stockBadge}</div></td>
            <td><span class="badge bg-success">Active</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-action" title="Edit" onclick="window.booksManager.editProduct(${product.productId})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn-action" title="View" onclick="window.booksManager.viewProduct(${product.productId})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn-action text-danger" title="Delete" onclick="window.booksManager.deleteProduct(${product.productId})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        return tr;
    }

    updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const startItem = totalItems === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, totalItems);

        const showingText = document.querySelector('.card-footer .text-muted');
        if (showingText) showingText.textContent = `Showing ${startItem} to ${endItem} of ${totalItems} products`;

        const pagination = document.querySelector('.pagination');
        if (!pagination) return;
        pagination.innerHTML = '';

        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${this.currentPage === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `<a class="page-link" href="#" onclick="window.booksManager.changePage(${this.currentPage - 1}); return false;"><i class="bi bi-chevron-left"></i></a>`;
        pagination.appendChild(prevLi);

        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        if (endPage - startPage < maxVisiblePages - 1) startPage = Math.max(1, endPage - maxVisiblePages + 1);

        if (startPage > 1) {
            const firstLi = document.createElement('li');
            firstLi.className = 'page-item';
            firstLi.innerHTML = `<a class="page-link" href="#" onclick="window.booksManager.changePage(1); return false;">1</a>`;
            pagination.appendChild(firstLi);
            if (startPage > 2) {
                const dotsLi = document.createElement('li');
                dotsLi.className = 'page-item disabled';
                dotsLi.innerHTML = `<a class="page-link" href="#">...</a>`;
                pagination.appendChild(dotsLi);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageLi = document.createElement('li');
            pageLi.className = `page-item ${i === this.currentPage ? 'active' : ''}`;
            pageLi.innerHTML = `<a class="page-link" href="#" onclick="window.booksManager.changePage(${i}); return false;">${i}</a>`;
            pagination.appendChild(pageLi);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const dotsLi = document.createElement('li');
                dotsLi.className = 'page-item disabled';
                dotsLi.innerHTML = `<a class="page-link" href="#">...</a>`;
                pagination.appendChild(dotsLi);
            }
            const lastLi = document.createElement('li');
            lastLi.className = 'page-item';
            lastLi.innerHTML = `<a class="page-link" href="#" onclick="window.booksManager.changePage(${totalPages}); return false;">${totalPages}</a>`;
            pagination.appendChild(lastLi);
        }

        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${this.currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`;
        nextLi.innerHTML = `<a class="page-link" href="#" onclick="window.booksManager.changePage(${this.currentPage + 1}); return false;"><i class="bi bi-chevron-right"></i></a>`;
        pagination.appendChild(nextLi);
    }

    changePage(page) {
        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        if (page < 1 || page > totalPages) return;
        this.currentPage = page;
        this.displayBooks(this.filteredProducts);
        document.querySelector('#productsTable').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    editProduct(productId) {
        const product = this.allProducts.find(p => p.productId === productId);
        if (!product) { showNotify('error', 'Error', 'Product not found.'); return; }
        this.openEditModal(product);
    }

    openEditModal(product) {
        // Populate edit modal fields
        document.getElementById('editProductId').value = product.productId;
        document.getElementById('editProductTitle').value = product.title || '';
        document.getElementById('editAuthor').value = product.author || '';
        document.getElementById('editIsbn').value = product.isbn || '';
        document.getElementById('editLanguage').value = product.language || '';
        document.getElementById('editPublisher').value = product.publisher || '';
        document.getElementById('editPublishDate').value = formatDateForInput(product.publishedDate);
        document.getElementById('editPages').value = product.pages || '';
        document.getElementById('editGenre').value = product.genre || '';

        const firstStock = product.stockDTOList && product.stockDTOList.length > 0 ? product.stockDTOList[0] : null;
        document.getElementById('editPrice').value = firstStock ? firstStock.price : '';
        document.getElementById('editStock').value = firstStock ? firstStock.stock : '';

        // Set category
        const editCatSelect = document.getElementById('editCategorySelect');
        if (editCatSelect) editCatSelect.value = product.categoryId || 0;

        // Preview image
        const imageUrl = product.images && product.images.length > 0 ? product.images[0] : '';
        const preview = document.getElementById('editImagePreview');
        if (preview) {
            preview.src = imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&h=100&fit=crop';
            preview.style.display = 'block';
        }

        if (window.editor2) window.editor2.setHTMLCode(product.description || '');

        new bootstrap.Modal(document.getElementById('editProductModal')).show();
    }

    viewProduct(productId) {
        const product = this.allProducts.find(p => p.productId === productId);
        if (!product) { showNotify('error', 'Error', 'Product not found.'); return; }

        const firstStock = product.stockDTOList && product.stockDTOList.length > 0 ? product.stockDTOList[0] : null;
        const price = firstStock ? `LKR ${firstStock.price.toFixed(2)}` : 'N/A';
        const stock = firstStock ? firstStock.stock : 0;
        const imageUrl = product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=200&fit=crop';

        document.getElementById('viewProductContent').innerHTML = `
            <div class="row g-3">
                <div class="col-md-4 text-center">
                    <img src="${imageUrl}" class="img-fluid rounded" style="max-height:200px;object-fit:cover;" onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=200&fit=crop'">
                    <div class="mt-2">
                        <span class="badge bg-success fs-6">${price}</span>
                    </div>
                    <div class="mt-1">
                        <span class="badge ${stock === 0 ? 'bg-danger' : stock < 10 ? 'bg-warning' : 'bg-success'}">
                            ${stock === 0 ? 'Out of Stock' : `Stock: ${stock}`}
                        </span>
                    </div>
                </div>
                <div class="col-md-8">
                    <h4>${product.title}</h4>
                    <p class="text-muted mb-3">by ${product.author}</p>
                    <table class="table table-sm">
                        <tr><td class="fw-semibold" style="width:40%">Category</td><td>${product.categoryName || 'N/A'}</td></tr>
                        <tr><td class="fw-semibold">ISBN</td><td>${product.isbn || 'N/A'}</td></tr>
                        <tr><td class="fw-semibold">Publisher</td><td>${product.publisher || 'N/A'}</td></tr>
                        <tr><td class="fw-semibold">Language</td><td>${product.language || 'N/A'}</td></tr>
                        <tr><td class="fw-semibold">Pages</td><td>${product.pages || 'N/A'}</td></tr>
                        <tr><td class="fw-semibold">Genre</td><td>${product.genre || 'N/A'}</td></tr>
                        <tr><td class="fw-semibold">Published</td><td>${product.publishedDate ? new Date(product.publishedDate).toLocaleDateString() : 'N/A'}</td></tr>
                    </table>
                    <div class="mt-2">
                        <span class="fw-semibold">Description:</span>
                        <div class="text-muted small mt-1" style="max-height:100px;overflow-y:auto;">${product.description || 'No description.'}</div>
                    </div>
                </div>
            </div>
        `;
        new bootstrap.Modal(document.getElementById('viewProductModal')).show();
    }

    deleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product?')) return;
        fetch(`api/admin/products/${productId}/delete`, { method: 'DELETE' })
            .then(r => r.json())
            .then(data => {
                if (data.status) {
                    showNotify('success', 'Deleted', 'Product deleted successfully.');
                    this.loadAllBooks();
                } else {
                    showNotify('error', 'Error', data.message || 'Failed to delete product.');
                }
            })
            .catch(() => showNotify('error', 'Error', 'Server error while deleting.'));
    }
}

async function updateProduct() {
    const productId = document.getElementById('editProductId').value;
    const productData = {
        title: document.getElementById('editProductTitle').value,
        description: window.editor2 ? window.editor2.getHTMLCode() : '',
        author: document.getElementById('editAuthor').value,
        price: parseFloat(document.getElementById('editPrice').value),
        categoryId: document.getElementById('editCategorySelect').value,
        isbn: document.getElementById('editIsbn').value,
        publisher: document.getElementById('editPublisher').value,
        publishedDate: document.getElementById('editPublishDate').value,
        language: document.getElementById('editLanguage').value,
        pages: parseInt(document.getElementById('editPages').value),
        genre: document.getElementById('editGenre').value,
        stock: parseInt(document.getElementById('editStock').value)
    };

    try {
        const response = await fetch(`api/admin/products/${productId}/update`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        const data = await response.json();
        if (data.status) {
            // Check if new image was selected
            const imgInput = document.getElementById('editImageInput');
            if (imgInput && imgInput.files && imgInput.files.length > 0) {
                const formData = new FormData();
                formData.append('image', imgInput.files[0]);
                await fetch(`api/admin/products/${productId}/upload-image`, { method: 'PUT', body: formData });
            }
            showNotify('success', 'Updated', 'Product updated successfully!');
            bootstrap.Modal.getInstance(document.getElementById('editProductModal')).hide();
            window.booksManager && window.booksManager.loadAllBooks();
        } else {
            showNotify('error', 'Error', data.message || 'Failed to update product.');
        }
    } catch (e) {
        showNotify('error', 'Error', 'Server error while updating product.');
    }
}

// ===================== ORDERS =====================
class OrdersManager {
    constructor() {
        this.allOrders = [];
        this.filteredOrders = [];
        window.ordersManager = this;
    }

    loadData(data) {
        this.allOrders = (data.allOrders || []).map(order => ({
            ...order,
            status: normalizeOrderStatus(order.status)
        }));
        this.filteredOrders = [...this.allOrders];
        this.renderStats();
        this.renderTable(this.filteredOrders);
        this.updateSidebarCount();
    }

    updateSidebarCount() {
        const el = document.getElementById("order-count");
        if (el) el.innerHTML = this.allOrders.length;
    }

    renderStats() {
        const pending = this.allOrders.filter(o => o.status === 'PENDING').length;
        const processing = this.allOrders.filter(o => o.status === 'PROCESSING').length;
        const completed = this.allOrders.filter(o => o.status === 'COMPLETED').length;
        const cancelled = this.allOrders.filter(o => o.status === 'CANCELLED').length;

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('order-stat-pending', pending);
        set('order-stat-processing', processing);
        set('order-stat-completed', completed);
        set('order-stat-cancelled', cancelled);
    }

    filterOrders(filter) {
        if (filter === 'ALL') {
            this.filteredOrders = [...this.allOrders];
        } else {
            this.filteredOrders = this.allOrders.filter(o => o.status === filter);
        }
        this.renderTable(this.filteredOrders);
    }

    renderTable(orders) {
        const tbody = document.querySelector('#ordersTable tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        if (!orders || orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4"><p class="text-muted">No orders found</p></td></tr>`;
            return;
        }

        orders.forEach(order => {
            const tr = document.createElement('tr');
            const statusColor = {
                PENDING: 'bg-warning text-dark',
                PROCESSING: 'bg-info text-white',
                COMPLETED: 'bg-success text-white',
                CANCELLED: 'bg-danger text-white'
            }[order.status] || 'bg-secondary';

            const paymentColor = order.status === 'COMPLETED' ? 'bg-success' : 'bg-warning text-dark';
            const paymentLabel = order.status === 'COMPLETED' ? 'Paid' : 'Pending';

            tr.innerHTML = `
                <td>
                    <a href="invoice.html?orderId=${order.orderId}" class="text-primary fw-semibold" target="_blank">#${order.orderId}</a>
                </td>
                <td>
                    <div class="customer-info">
                        <div class="customer-name">${order.customerName || 'N/A'}</div>
                        <div class="customer-email">${order.email || ''}</div>
                    </div>
                </td>
                <td>${order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</td>
                <td class="fw-semibold">LKR ${Number(order.totalAmount).toFixed(2)}</td>
                <td><span class="badge ${statusColor}">${order.status}</span></td>
                <td><span class="badge ${paymentColor}">${paymentLabel}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="window.ordersManager.changeStatus('${order.orderId}', '${order.status}')">
                            <i class="bi bi-arrow-repeat me-1"></i>Status
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="window.ordersManager.viewInvoice('${order.orderId}')">
                            <i class="bi bi-receipt me-1"></i>Invoice
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    viewInvoice(orderId) {
        window.open(`invoice.html?orderId=${orderId}`, '_blank');
    }

    changeStatus(orderId, currentStatus) {
        const statuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'];
        const modalHtml = document.getElementById('statusChangeOrderId');
        if (modalHtml) modalHtml.textContent = `#${orderId}`;

        const select = document.getElementById('newOrderStatus');
        if (select) select.value = normalizeOrderStatus(currentStatus);

        document.getElementById('confirmStatusChange').onclick = async () => {
            const newStatus = document.getElementById('newOrderStatus').value;
            try {
                const response = await fetch(`api/admin/orders/${orderId}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                });
                const data = await response.json();
                if (data.status) {
                    showNotify('success', 'Updated', `Order status changed to ${newStatus}`);
                    bootstrap.Modal.getInstance(document.getElementById('changeStatusModal')).hide();
                    // Update local data
                    const order = this.allOrders.find(o => String(o.orderId) === String(orderId));
                    if (order) order.status = newStatus;
                    this.renderStats();
                    this.renderTable(this.filteredOrders);
                } else {
                    showNotify('error', 'Error', data.message || 'Failed to update status.');
                }
            } catch (e) {
                showNotify('error', 'Error', 'Server error while updating status.');
            }
        };

        new bootstrap.Modal(document.getElementById('changeStatusModal')).show();
    }
}

function normalizeOrderStatus(status) {
    return (status || '').toString().trim().toUpperCase();
}

async function loadAllOrders() {
    try {
        const response = await fetch('api/admin/data/orders');
        if (response.ok) {
            const data = await response.json();
            window.ordersManager.loadData(data);
        }
    } catch (e) { console.error("Error loading orders:", e); }
}

// ===================== USERS =====================
class UsersManager {
    constructor() {
        this.allUsers = [];
        window.usersManager = this;
    }

    loadData(data) {
        this.allUsers = data.users || [];
        document.getElementById("user-count").innerHTML = this.allUsers.length;
        this.renderTable(this.allUsers);
        this.initSearch();
    }

    initSearch() {
        const searchInput = document.querySelector('#usersContent .search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const q = e.target.value.toLowerCase();
                const filtered = this.allUsers.filter(u =>
                    (`${u.firstName} ${u.lastName}`).toLowerCase().includes(q) ||
                    u.email.toLowerCase().includes(q)
                );
                this.renderTable(filtered);
            });
        }
    }

    renderTable(users) {
        const tbody = document.querySelector('#usersTable tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        if (!users || users.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4"><p class="text-muted">No users found</p></td></tr>`;
            return;
        }

        users.forEach(user => {
            const tr = document.createElement('tr');
            const fullName = `${user.firstName} ${user.lastName}`;
            const isBlocked = user.status === 'BLOCKED';

            tr.innerHTML = `
                <td>
                    <div class="user-cell">
                        <div class="user-avatar small">
                            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6366f1&color=fff&size=40" alt="${fullName}">
                        </div>
                        <div class="user-info">
                            <div class="user-name">${fullName}</div>
                            <div class="user-id">ID: ${user.id}</div>
                        </div>
                    </div>
                </td>
                <td>${user.email}</td>
                <td>${user.sinceAt ? new Date(user.sinceAt).toLocaleDateString() : 'N/A'}</td>
                <td><span class="badge ${isBlocked ? 'bg-danger' : user.status === 'PENDING' ? 'bg-warning' : 'bg-success'}">${user.status || 'ACTIVE'}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm ${isBlocked ? 'btn-outline-success' : 'btn-outline-danger'}" 
                            onclick="window.usersManager.toggleBlock('${user.id}', ${isBlocked})">
                            <i class="bi bi-${isBlocked ? 'unlock' : 'slash-circle'} me-1"></i>${isBlocked ? 'Unblock' : 'Block'}
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="window.usersManager.viewUser('${user.id}')">
                            <i class="bi bi-eye me-1"></i>View
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    toggleBlock(userId, isCurrentlyBlocked) {
        const action = isCurrentlyBlocked ? 'unblock' : 'block';
        const actionLabel = isCurrentlyBlocked ? 'Unblock' : 'Block';
        if (!confirm(`Are you sure you want to ${action} this user?`)) return;

        fetch(`api/admin/users/${userId}/${action}`, { method: 'PUT' })
            .then(r => r.json())
            .then(data => {
                if (data.status) {
                    showNotify('success', actionLabel, `User has been ${action}ed successfully.`);
                    const user = this.allUsers.find(u => String(u.id) === String(userId));
                    if (user) user.status = isCurrentlyBlocked ? 'ACTIVE' : 'BLOCKED';
                    this.renderTable(this.allUsers);
                } else {
                    showNotify('error', 'Error', data.message || `Failed to ${action} user.`);
                }
            })
            .catch(() => showNotify('error', 'Error', 'Server error.'));
    }

    viewUser(userId) {
        const user = this.allUsers.find(u => String(u.id) === String(userId));
        if (!user) { showNotify('error', 'Error', 'User not found.'); return; }
        const fullName = `${user.firstName} ${user.lastName}`;
        document.getElementById('viewUserContent').innerHTML = `
            <div class="text-center mb-4">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6366f1&color=fff&size=80" class="rounded-circle mb-3" width="80">
                <h5 class="mb-0">${fullName}</h5>
                <p class="text-muted">${user.email}</p>
                <span class="badge ${user.status === 'BLOCKED' ? 'bg-danger' : 'bg-success'}">${user.status || 'ACTIVE'}</span>
            </div>
            <table class="table table-sm">
                <tr><td class="fw-semibold">User ID</td><td>${user.id}</td></tr>
                <tr><td class="fw-semibold">Email</td><td>${user.email}</td></tr>
                <tr><td class="fw-semibold">Joined</td><td>${user.sinceAt ? new Date(user.sinceAt).toLocaleDateString() : 'N/A'}</td></tr>
                <tr><td class="fw-semibold">Status</td><td>${user.status || 'ACTIVE'}</td></tr>
            </table>
        `;
        new bootstrap.Modal(document.getElementById('viewUserModal')).show();
    }
}

async function loadAllUsers() {
    try {
        const response = await fetch('api/admin/data/users');
        if (response.ok) {
            const data = await response.json();
            if (data.status) window.usersManager.loadData(data);
        }
    } catch (e) { console.error("Error loading users:", e); }
}

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof bootstrap === 'undefined') {
        console.error('Bootstrap not loaded.');
        return;
    }
    new AdminPanel();
    new LoadBooks();
    new OrdersManager();
    new UsersManager();

    // Edit image preview
    const editImageInput = document.getElementById('editImageInput');
    if (editImageInput) {
        editImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const preview = document.getElementById('editImagePreview');
                    if (preview) { preview.src = ev.target.result; preview.style.display = 'block'; }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Initialize edit product rich text editor
    window.editor2 = new RichTextEditor('#editDescription');

    console.log('Admin Panel initialized successfully');
});

fetch('api/admin/auth/current-logged-admin')
    .then(r => r.json())
    .then(data => {
        if (data.status) {
            const el = document.getElementById('adminName');
            if (el) el.textContent = data.firstName + ' ' + data.lastName;
        }
    })
    .catch(e => console.error('Error:', e));

window.addEventListener('load', async () => {
    Notiflix.Loading.dots("Loading data...", { clickToClose: false, svgColor: "#6366f1" });
    try {
        await loadDashboardStats();
        await loadCategories();
        await loadAllOrders();
        await loadAllUsers();
    } catch (e) {
        console.error("Error loading initial data:", e);
    } finally {
        Notiflix.Loading.remove(800);
    }
});
