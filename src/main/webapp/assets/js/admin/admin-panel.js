// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.init();
    }

    init() {
        this.initializeSidebar();
        this.initializeCharts();
        this.initializeEventListeners();
        this.initializeDataTables();
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
        if (tabContent) {
            tabContent.classList.add('active');
        }

        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        const activeNav = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
        }

        // Update page title and breadcrumb
        this.updatePageTitle(tabName);
    }

    updatePageTitle(tabName) {
        const pageTitle = document.querySelector('.page-title');
        const breadcrumbActive = document.querySelector('.breadcrumb .active');

        const tabTitles = {
            dashboard: 'Dashboard',
            products: 'Products',
            orders: 'Orders',
            users: 'Users',
            analytics: 'Analytics',
            categories: 'Categories',
            reviews: 'Reviews',
            settings: 'Settings'
        };

        if (tabTitles[tabName]) {
            if (pageTitle) {
                pageTitle.textContent = tabTitles[tabName];
            }
            if (breadcrumbActive) {
                breadcrumbActive.textContent = tabTitles[tabName];
            }
        }
    }

    initializeSidebar() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const sidebarClose = document.getElementById('sidebarClose');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');

        // Open sidebar on mobile
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                sidebar.classList.add('mobile-open');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        // Close sidebar
        const closeSidebar = () => {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (sidebarClose) {
            sidebarClose.addEventListener('click', closeSidebar);
        }

        // Close sidebar when clicking overlay
        if (overlay) {
            overlay.addEventListener('click', closeSidebar);
        }

        // Close sidebar when clicking nav item on mobile
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth < 1024) {
                    closeSidebar();
                }
            });
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024) {
                closeSidebar();
            }
        });
    }

    initializeCharts() {
        // Revenue Chart
        this.createRevenueChart();

        // Sales Distribution Chart
        this.createSalesChart();

        // Roles Chart for Users page
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
                        legend: {
                            display: false
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            titleColor: '#f1f5f9',
                            bodyColor: '#f1f5f9',
                            borderColor: '#334155',
                            borderWidth: 1,
                            padding: 12,
                            cornerRadius: 8,
                            callbacks: {
                                label: function (context) {
                                    return 'Revenue: $' + context.parsed.y.toLocaleString();
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                drawBorder: false,
                                color: 'rgba(100, 116, 139, 0.1)'
                            },
                            ticks: {
                                callback: function (value) {
                                    return '$' + value.toLocaleString();
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
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
                        backgroundColor: [
                            '#6366f1',
                            '#10b981',
                            '#f59e0b',
                            '#ef4444',
                            '#8b5cf6',
                            '#3b82f6',
                            '#50b814',
                            '#420611'
                        ],
                        borderWidth: 0,
                        hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true,
                                pointStyle: 'circle',
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            titleColor: '#f1f5f9',
                            bodyColor: '#f1f5f9',
                            borderColor: '#334155',
                            borderWidth: 1,
                            padding: 12,
                            cornerRadius: 8,
                            callbacks: {
                                label: function (context) {
                                    return context.label + ': ' + context.parsed + '%';
                                }
                            }
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
                        backgroundColor: [
                            '#6366f1',
                            '#10b981',
                            '#f59e0b',
                            '#8b5cf6'
                        ],
                        borderWidth: 0,
                        hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '60%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 15,
                                usePointStyle: true,
                                pointStyle: 'circle',
                                font: {
                                    size: 11
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    initializeDataTables() {
        // Initialize DataTables if they exist
        if ($.fn.DataTable) {
            $('#productsTable').DataTable({
                paging: true,
                searching: false,
                info: false,
                ordering: true,
                pageLength: 10,
                language: {
                    emptyTable: "No products found"
                }
            });

            $('#ordersTable').DataTable({
                paging: true,
                searching: false,
                info: false,
                ordering: true,
                pageLength: 10
            });

            $('#usersTable').DataTable({
                paging: true,
                searching: false,
                info: false,
                ordering: true,
                pageLength: 10
            });
        }
    }

    initializeEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = item.getAttribute('data-tab');
                if (tabName) {
                    this.switchTab(tabName);
                }
            });
        });

        // Quick actions
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', () => {
                const action = card.querySelector('.action-title')?.textContent;
                if (action) {
                    this.handleQuickAction(action);
                }
            });
        });

        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    }

    switchTab(tabName) {
        this.showTab(tabName);
    }

    handleQuickAction(action) {
        const actions = {
            'Add Product': () => {
                const modalElement = document.getElementById('addProductModal');
                if (modalElement) {
                    const modal = new bootstrap.Modal(modalElement);
                    modal.show();
                }
            },
            'Process Order': () => {
                this.showNotification('Order Processing', 'Redirecting to orders...', 'info');
                this.switchTab('orders');
            },
            'View Reports': () => {
                this.showNotification('Reports', 'Loading analytics...', 'info');
                this.switchTab('analytics');
            },
            'Manage Users': () => {
                this.showNotification('User Management', 'Loading users...', 'info');
                this.switchTab('users');
            }
        };

        if (actions[action]) {
            actions[action]();
        }
    }

    handleSearch(query) {
        if (query.length > 2) {
            console.log('Searching for:', query);
        }
    }

    showNotification(title, message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        const iconMap = {
            success: 'check-circle-fill',
            error: 'exclamation-circle-fill',
            warning: 'exclamation-triangle-fill',
            info: 'info-circle-fill'
        };

        const colorMap = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        notification.innerHTML = `
            <div style="display: flex; align-items: start; gap: 12px;">
                <i class="bi bi-${iconMap[type]}" style="font-size: 1.25rem; color: ${colorMap[type]};"></i>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #0f172a; margin-bottom: 4px;">${title}</div>
                    <div style="font-size: 0.875rem; color: #64748b;">${message}</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #94a3b8; cursor: pointer; padding: 4px; font-size: 1rem;">
                    <i class="bi bi-x"></i>
                </button>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            border-left: 4px solid ${colorMap[type]};
            max-width: 350px;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof bootstrap === 'undefined') {
        console.error('Bootstrap is not loaded. Please ensure Bootstrap JS is included before this script.');
        return;
    }

    new AdminPanel();
    console.log('Admin Panel initialized successfully');
});

window.addEventListener('load', async () => {
    Notiflix.Loading.dots("Data is Loading...", {
        clickToClose: false,
        svgColor: "#000cf5"
    });
    try {
        await loadDashboardStats();
        await loadCategories();
        await loadAllOrders();
        await loadAllUsers();
    } catch (e) {
        console.error("Error loading initial data:", e);
    } finally {
        Notiflix.Loading.remove(1000);
    }
})

// Load Dashboard Stats
async function loadDashboardStats() {
    try {
        const response = await fetch('api/admin/data/dashboard-stats', {
            method: 'GET',
        });

        if (response.ok) {
            const data = await response.json();
            if (data.status) {
                // Active Users
                const activeUsersEl = document.getElementById('dashboard-active-users');
                if (activeUsersEl) {
                    activeUsersEl.textContent = Number(data.activeUsers).toLocaleString();
                }

                // Monthly Revenue
                const monthlyRevenueEl = document.getElementById('dashboard-monthly-revenue');
                if (monthlyRevenueEl) {
                    monthlyRevenueEl.textContent = 'LKR ' + Number(data.monthlyRevenue).toLocaleString('en-LK', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                }

                // Today Orders
                const todayOrdersEl = document.getElementById('dashboard-today-orders');
                if (todayOrdersEl) {
                    todayOrdersEl.textContent = Number(data.todayOrders).toLocaleString();
                }

                // Products in Inventory
                const inventoryEl = document.getElementById('dashboard-inventory');
                if (inventoryEl) {
                    inventoryEl.textContent = Number(data.productsInInventory).toLocaleString();
                }
            } else {
                console.error("Failed to load dashboard stats:", data.message);
            }
        }
    } catch (e) {
        console.error("Error loading dashboard stats:", e);
    }
}

// Load Categories for Product Form
async function loadCategories() {
    try {
        const response = await fetch('api/admin/data/categories', {
            method: 'GET',
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data)
            const categorySelect = document.getElementById('categorySelect');

            if (data.categories && data.categories.length > 0) {
                renderDropDowns(categorySelect, data.categories, 'name');
            }
        }
    } catch (e) {
        new Notify({
            status: 'error',
            title: 'Error',
            text: 'Failed to load categories.',
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            type: 'outline',
            position: 'right top'
        });
        console.error("Error loading categories:", e);
    }
}

const editor1 = new RichTextEditor('#description');

async function saveProduct() {

    // Validate image before doing anything else
    let imgFileInput = document.getElementById('image-input');
    if (!imgFileInput.files || imgFileInput.files.length === 0) {
        new Notify({
            status: 'warning',
            title: 'Warning',
            text: 'Please select an image before saving the product.',
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            type: 'outline',
            position: 'right top'
        });
        return; // STOP the function immediately
    }

    let title = document.getElementById('productTitle').value;
    let description = editor1.getHTMLCode();
    let author = document.getElementById('author').value;
    let price = document.getElementById('price').value;
    let categoryId = document.getElementById('categorySelect').value;
    let isbn = document.getElementById('isbn').value;
    let language = document.getElementById('language').value;
    let publishDate = document.getElementById('publishDate').value;
    let publisher = document.getElementById('publisher').value;
    let pages = document.getElementById('pages').value;
    let genre = document.getElementById('genre').value;
    let stock = document.getElementById('stock').value;

    const productData = {
        title: title,
        description: description,
        author: author,
        price: parseFloat(price),
        categoryId: categoryId,
        isbn: isbn,
        publisher: publisher,
        publishedDate: publishDate,
        language: language,
        pages: parseInt(pages),
        genre: genre,
        stock: parseInt(stock)
    }

    try {
        const response = await fetch('api/admin/products/save-product', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        })
        const data = await response.json();
        if (response.ok) {
            if (data.status) {
                await uploadProductImage(data.productId);
            } else {
                new Notify({
                    status: 'error',
                    title: 'Error',
                    text: data.message,
                    effect: 'fade',
                    speed: 300,
                    showIcon: true,
                    showCloseButton: true,
                    autoclose: true,
                    autotimeout: 3000,
                    type: 'outline',
                    position: 'right top'
                })
            }
        } else {
            new Notify({
                status: 'error',
                title: 'Error',
                text: data.message,
                effect: 'fade',
                speed: 300,
                showIcon: true,
                showCloseButton: true,
                autoclose: true,
                autotimeout: 3000,
                type: 'outline',
                position: 'right top'
            });
        }
    } catch (e) {
        new Notify({
            status: 'error',
            title: 'Error',
            text: "Server error while saving product.",
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            type: 'outline',
            position: 'right top'
        });
        console.error("Error saving product:", e);
    }
}

async function uploadProductImage(productId) {
    let imgFileInput = document.getElementById('image-input');

    // Validate file selection
    if (!imgFileInput.files || imgFileInput.files.length === 0) {
        new Notify({
            status: 'warning',
            title: 'Warning',
            text: 'Please select an image to upload.',
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            type: 'outline',
            position: 'right top'
        });
        return;
    }

    const file = imgFileInput.files[0];

    // Validate image file
    const validation = validateImageFile(file);
    if (!validation.valid) {
        new Notify({
            status: 'warning',
            title: 'Invalid File',
            text: validation.message,
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            type: 'outline',
            position: 'right top'
        });
        imgFileInput.value = ''; // Clear the input
        return;
    }

    const formData = new FormData();
    formData.append('image', imgFileInput.files[0]);

    try {
        const response = await fetch(`api/admin/products/${productId}/upload-image`, {
            method: "PUT",
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            if (data.status) {
                console.log("Image uploaded:", data);
                new Notify({
                    status: 'success',
                    title: 'Success',
                    text: 'Product and image saved successfully!',
                    effect: 'fade',
                    speed: 300,
                    showIcon: true,
                    showCloseButton: true,
                    autoclose: true,
                    autotimeout: 3000,
                    type: 'outline',
                    position: 'right top'
                });
                document.getElementById('productTitle').value = "";
                editor1.setHTMLCode(""); // Clear rich-text editor
                document.getElementById('author').value = "";
                document.getElementById('price').value = "";
                document.getElementById('categorySelect').value = "";
                document.getElementById('stock').value = "";
                document.getElementById('isbn').value = "";
                document.getElementById('language').value = "";
                document.getElementById('publishDate').value = "";
                document.getElementById('publisher').value = "";
                document.getElementById('pages').value = "";
                document.getElementById('genre').value = "";
                imgFileInput.value = "";
            } else {
                console.error("Failed to upload image:", data.message);
                new Notify({
                    status: 'error',
                    title: 'Error',
                    text: data.message || 'Failed to upload image.',
                    effect: 'fade',
                    speed: 300,
                    showIcon: true,
                    showCloseButton: true,
                    autoclose: true,
                    autotimeout: 3000,
                    type: 'outline',
                    position: 'right top'
                });
            }
        }
    } catch (e) {
        console.error("Error uploading image:", e);
        new Notify({
            status: 'error',
            title: 'Error',
            text: 'Failed to upload image.',
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            type: 'outline',
            position: 'right top'
        });
    }
}

function validateImageFile(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const fileExtension = file.name.toLowerCase().split('.').pop();
    const maxSize = 5 * 1024 * 1024; // 5MB

    // Check extension
    if (!allowedExtensions.includes(fileExtension)) {
        return {
            valid: false,
            message: 'Only JPG, JPEG, and PNG files are allowed!'
        };
    }

    // Check MIME type
    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            message: 'Invalid file type detected!'
        };
    }

    // Check file size
    if (file.size > maxSize) {
        return {
            valid: false,
            message: 'File size must be less than 5MB!'
        };
    }

    return {
        valid: true,
        message: 'Valid image file'
    };
}

function renderDropDowns(selector, list, suffix) {
    selector.innerHTML = `<option value="0">Select</option>`; // Clear existing options first!
    list.forEach((item) => {
        const option = document.createElement("option"); // Create a new option element
        option.value = item.id;
        option.innerHTML = item[suffix]; // Set the display text
        selector.appendChild(option); // Append the option to the select element
    })
}

class LoadBooks {
    constructor() {
        // Initialize instance variables
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.allProducts = [];

        // Bind methods to ensure 'this' context is preserved
        this.changePage = this.changePage.bind(this);
        this.changeItemsPerPage = this.changeItemsPerPage.bind(this);
        this.editProduct = this.editProduct.bind(this);
        this.viewProduct = this.viewProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);

        // Store instance reference globally for onclick handlers
        window.booksManager = this;

        this.init();
    }

    init() {
        // Just load books - don't call other methods directly
        this.loadAllBooks();
    }

    // Load all books from the server
    async loadAllBooks() {
        try {
            const response = await fetch('api/admin/data/books', {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);

                if (data.status) {
                    this.allProducts = data.allProducts;
                    this.currentPage = 1;
                    this.displayBooks();
                } else {
                    console.error("Failed to load books:", data.message);
                }
            } else {
                console.error("Failed to load books:", response.statusText);
            }
        } catch (e) {
            console.error("Error loading books:", e);
        }
    }

    // Display books in the table with pagination
    displayBooks() {
        const tbody = document.querySelector('#productsTable tbody');
        tbody.innerHTML = '';

        const allBookCount = document.getElementById("books-count").innerHTML = this.allProducts.length;

        if (!this.allProducts || this.allProducts.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4">
                        <p class="text-muted">No products found</p>
                    </td>
                </tr>
            `;
            this.updatePagination(0);
            return;
        }

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedProducts = this.allProducts.slice(startIndex, endIndex);

        // Display products for current page
        paginatedProducts.forEach(product => {
            const row = this.createProductRow(product);
            tbody.appendChild(row);
        });

        // Update pagination
        this.updatePagination(this.allProducts.length);
    }

    // Create a table row for a product
    createProductRow(product) {
        const tr = document.createElement('tr');

        // Get first stock item for price and quantity
        const firstStock = product.stockDTOList && product.stockDTOList.length > 0
            ? product.stockDTOList[0]
            : null;

        const price = firstStock ? `LKR ${firstStock.price.toFixed(2)}` : 'N/A';
        const stock = firstStock ? firstStock.stock : 0;

        // Determine stock status
        let stockBadge;
        if (stock === 0) {
            stockBadge = '<span class="badge bg-danger">Out of Stock</span>';
        } else if (stock < 10) {
            stockBadge = `<span class="badge bg-warning">Low Stock (${stock})</span>`;
        } else {
            stockBadge = `<span class="badge bg-success">In Stock (${stock})</span>`;
        }

        // Get first image or use placeholder
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
            <td>
                <span class="badge bg-light text-dark">${product.categoryName}</span>
            </td>
            <td>
                <div class="product-price">${price}</div>
            </td>
            <td>
                <div class="stock-status">
                    ${stockBadge}
                </div>
            </td>
            <td>
                <span class="badge bg-success">Active</span>
            </td>
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

    // Update pagination controls
    updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const startItem = totalItems === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, totalItems);

        // Update showing text
        const showingText = document.querySelector('.card-footer .text-muted');
        if (showingText) {
            showingText.textContent = `Showing ${startItem} to ${endItem} of ${totalItems} products`;
        }

        // Update pagination buttons
        const pagination = document.querySelector('.pagination');
        if (!pagination) return;

        pagination.innerHTML = '';

        // Previous button
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${this.currentPage === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `
            <a class="page-link" href="#" onclick="window.booksManager.changePage(${this.currentPage - 1}); return false;">
                <i class="bi bi-chevron-left"></i>
            </a>
        `;
        pagination.appendChild(prevLi);

        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // First page
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

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            const pageLi = document.createElement('li');
            pageLi.className = `page-item ${i === this.currentPage ? 'active' : ''}`;
            pageLi.innerHTML = `<a class="page-link" href="#" onclick="window.booksManager.changePage(${i}); return false;">${i}</a>`;
            pagination.appendChild(pageLi);
        }

        // Last page
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

        // Next button
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${this.currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`;
        nextLi.innerHTML = `
            <a class="page-link" href="#" onclick="window.booksManager.changePage(${this.currentPage + 1}); return false;">
                <i class="bi bi-chevron-right"></i>
            </a>
        `;
        pagination.appendChild(nextLi);
    }

    // Change page
    changePage(page) {
        const totalPages = Math.ceil(this.allProducts.length / this.itemsPerPage);

        if (page < 1 || page > totalPages) {
            return;
        }

        this.currentPage = page;
        this.displayBooks();

        // Scroll to top of table
        document.querySelector('#productsTable').scrollIntoView({behavior: 'smooth', block: 'start'});
    }

    // Change items per page
    changeItemsPerPage(newItemsPerPage) {
        this.itemsPerPage = newItemsPerPage;
        this.currentPage = 1;
        this.displayBooks();
    }

    // Placeholder functions for product actions
    editProduct(productId) {
        console.log('Edit product:', productId);
        // Add your edit logic here
    }

    viewProduct(productId) {
        console.log('View product:', productId);
        // Add your view logic here
    }

    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            console.log('Delete product:', productId);
            // Add your delete logic here
            // After deletion, refresh the list:
            this.loadAllBooks();
        }
    }
}

async function loadAllOrders() {
    try {
        const response = await fetch('api/admin/data/orders', {
            method: 'GET',
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            loadOrderData(data)
        }
    } catch (e) {
        console.error("Error loading orders:", e);
    }
}

function loadOrderData(data) {
    const ordersTbody = document.querySelector('#ordersTable tbody');
    ordersTbody.innerHTML = '';

    const orderCount = document.getElementById("order-count").innerHTML =
        data.allOrders.status === "COMPLETED" ? data.allOrders.length  : 0;

    if (!data.allOrders || data.allOrders.length === 0) {
        ordersTbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">
                    <p class="text-muted">No orders found</p>
                </td>
            </tr>
        `;
        return;
    }

    data.allOrders.forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><a href="invoice.html?orderId=${order.orderId}" target="_blank" class="text-primary">#${order.orderId}</a></td>
            <td>
                <div class="customer-info">
                    <div class="customer-name">${order.customerName}</div>
                    <div class="customer-email">${order.email}</div>
                </div>
            </td>
            <td>${new Date(order.orderDate).toLocaleDateString()}</td>
            <td>LKR ${order.totalAmount.toFixed(2)}</td>
            <td><span class="badge ${order.status === "PENDING" ? "bg-warning text-dark":"bg-success text-white"} 
            text-dark">${order.status}</span></td>
            
            <td><span class="badge ${order.status === "PENDING" ? "bg-warning text-dark":"bg-success text-white"}">
            ${order.status === "PENDING" ? "Payment Pending":"Paid"}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-outline-primary">Process</button>
                    <button class="btn btn-sm btn-outline-secondary">View</button>
                </div>
            </td>
        `;
        ordersTbody.appendChild(tr);
    });
}

async function loadAllUsers(){
    try {
        const response = await fetch('api/admin/data/users', {
            method: 'GET',
        });

        if (response.ok) {
            const data = await response.json();
            if(data.status){
                console.log(data);
                loadUserData(data)
            }else{
                console.error("Failed to load users data:", data.message);
            }
        }else{
            console.error("Failed to load users:", response.statusText);
        }
    } catch (e) {
        console.error("Error loading users:", e);
    }
}

function loadUserData(data) {
    const usersTbody = document.querySelector('#usersTable tbody');
    usersTbody.innerHTML = '';

    const userCount = document.getElementById("user-count").innerHTML = data.users.length;

    if (!data.users || data.users.length === 0) {
        usersTbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <p class="text-muted">No users found</p>
                </td>
            </tr>
        `;
        return;
    }

    data.users.forEach(user => {
        const tr = document.createElement('tr');

        const fullName = `${user.firstName} ${user.lastName}`;
        user.fullName = fullName; // Add fullName property for easier access

        tr.innerHTML = `
            <td>${user.id}</td>
            <td>
                <div class="user-info">
                    <div class="user-name">${user.fullName}</div>
                    <div class="user-email">${user.email}</div>
                </div>
            </td>
            <td>${user.sinceAt}</td>
            <td><span class="badge ${user.status === "PENDING" ? "bg-warning":"bg-success"}">${user.status}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-outline-primary">Edit</button>
                    <button class="btn btn-sm btn-outline-secondary">View</button>
                </div>
            </td>
        `;
        usersTbody.appendChild(tr);
    });
}

// Load books when the page loads
document.addEventListener('DOMContentLoaded', function () {
    new LoadBooks();
    // new loadOrders()
});
