// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.init();
    }

    init() {
        this.initializeSidebar();
        this.initializeCharts();
        this.initializeEventListeners();
        this.initializeModal();
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

        // Sales Distribution Chart
        const salesCtx = document.getElementById('salesChart');
        if (salesCtx) {
            new Chart(salesCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Fiction', 'Non-Fiction', 'Romance', 'Mystery', 'Sci-Fi'],
                    datasets: [{
                        data: [35, 25, 20, 15, 5],
                        backgroundColor: [
                            '#6366f1',
                            '#10b981',
                            '#f59e0b',
                            '#ef4444',
                            '#8b5cf6'
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

    // initializeModal() {
    //     const submitBtn = document.getElementById('submitProduct');
    //     const productForm = document.getElementById('productForm');
    //     const modal = document.getElementById('addProductModal');
    //
    //     if (submitBtn && productForm) {
    //         submitBtn.addEventListener('click', () => {
    //             if (productForm.checkValidity()) {
    //                 // Get form data
    //                 const formData = new FormData(productForm);
    //                 const productData = Object.fromEntries(formData.entries());
    //
    //                 // Show success notification
    //                 this.showNotification('Success', 'Product added successfully!', 'success');
    //
    //                 // Reset form
    //                 productForm.reset();
    //
    //                 // Close modal using Bootstrap's modal instance
    //                 const bsModal = bootstrap.Modal.getInstance(modal);
    //                 if (bsModal) {
    //                     bsModal.hide();
    //                 }
    //             } else {
    //                 // Show validation errors
    //                 productForm.reportValidity();
    //                 this.showNotification('Error', 'Please fill in all required fields', 'error');
    //             }
    //         });
    //     }
    // }

    switchTab(tabName) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        const activeItem = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }

        // Update page title and breadcrumb
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
                setTimeout(() => this.switchTab('orders'), 1000);
            },
            'View Reports': () => {
                this.showNotification('Reports', 'Loading analytics...', 'info');
                setTimeout(() => this.switchTab('analytics'), 1000);
            },
            'Manage Users': () => {
                this.showNotification('User Management', 'Loading users...', 'info');
                setTimeout(() => this.switchTab('users'), 1000);
            }
        };

        if (actions[action]) {
            actions[action]();
        }
    }

    handleSearch(query) {
        if (query.length > 2) {
            // Implement search logic based on current tab
            console.log('Searching for:', query);
            // You can add actual search functionality here
        }
    }

    showNotification(title, message, type = 'info') {
        // Create notification element
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

        // Add styles
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

        // Auto remove after 5 seconds
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
    // Check if Bootstrap is loaded
    if (typeof bootstrap === 'undefined') {
        console.error('Bootstrap is not loaded. Please ensure Bootstrap JS is included before this script.');
        return;
    }

    // Initialize Admin Panel
    new AdminPanel();

    console.log('Admin Panel initialized successfully');
});

window.addEventListener('load', async () => {
    Notiflix.Loading.dots("Data is Loading...", {
        clickToClose: false,
        svgColor: "#000cf5"
    });
    try {
        await loadCategories();

    } catch (e) {
        console.error("Error loading initial data:", e);
    } finally {
        Notiflix.Loading.remove(1000);
    }
})

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
    let title = document.getElementById('productTitle').value;
    let description = editor1.getHTMLCode();
    let author = document.getElementById('author').value;
    let price = document.getElementById('price').value;
    let categoryId = document.getElementById('categorySelect').value;
    let isbn = document.getElementById('isbn').value;
    let language = document.getElementById('language').value;
    let publishDate = document.getElementById('publishDate').value;
    let publisher = document.getElementById('publisher').value;
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

function renderDropDowns(selector, list, suffix) {
    selector.innerHTML = `<option value="0">Select</option>`; // Clear existing options first!
    list.forEach((item) => {
        const option = document.createElement("option"); // Create a new option element
        option.value = item.id;
        option.innerHTML = item[suffix]; // Set the display text
        selector.appendChild(option); // Append the option to the select element
    })
}