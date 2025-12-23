window.addEventListener('load', async () => {
    Notiflix.Loading.dots("Data is Loading...", {
        clickToClose: false,
        svgColor: "#000cf5"
    });
    try {
        // Only run on my-account.html
        if (window.location.pathname.includes('my-account.html')) {
            await loadDistricts();
            const districtSelect = document.getElementById('districtSelect');
            districtSelect.addEventListener('change', loadCities);
        }

    } catch (e) {
        console.log("Error loading initial data:", e);
    } finally {
        Notiflix.Loading.remove(3000);
    }
})

// Search functionality
const searchModal = document.getElementById('searchModal');
if (searchModal) {
    const searchForm = searchModal.querySelector('form');
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const searchInput = this.querySelector('input[type="text"]');
        const searchTerm = searchInput.value.trim();

        if (searchTerm) {
            // Close modal
            const modal = bootstrap.Modal.getInstance(searchModal);
            modal.hide();

            // Show search results notification
            showNotification(`Searching for: "${searchTerm}"`, 'info');

            // In a real application, you would redirect to search results page
            // window.location.href = `shop.html?search=${encodeURIComponent(searchTerm)}`;
        }
    });
}

// Mobile menu enhancement
const navbarToggler = document.querySelector('.navbar-toggler');
if (navbarToggler) {
    navbarToggler.addEventListener('click', function () {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        navbarCollapse.classList.toggle('show');
    });
}

// Category cards hover effect
const categoryCards = document.querySelectorAll('.category-card');
categoryCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-5px)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

async function loadCities() {
    const districtSelect = document.getElementById('districtSelect');
    const selectedDistrictId = districtSelect.value;

    console.log("Selected District ID:", selectedDistrictId);

    // Don't load cities if no district is selected
    if (selectedDistrictId === "0" || !selectedDistrictId) {
        const citySelect = document.getElementById('citySelect');
        citySelect.innerHTML = '<option value="0">Select City</option>';
        return;
    }

    Notiflix.Loading.dots("Loading Cities...", {
        clickToClose: false,
        svgColor: "#000cf5"
    });

    try {
        const response = await fetch(`api/data/${selectedDistrictId}/cities`, {
            method: 'GET',
            credentials: 'include'
        })

        if (response.ok) {
            const data = await response.json();
            console.log("Cities data:", data);

            const citySelect = document.getElementById('citySelect');

            if (data.status) {
                renderDropDowns(citySelect, data.cities, 'name');
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
                    notificationsGap: null,
                    notificationsPadding: null,
                    type: 'outline',
                    position: 'right top',
                })
            }
        } else {
            new Notify({
                status: 'error',
                title: 'Error',
                text: 'Failed to load cities',
                effect: 'fade',
                speed: 300,
                showIcon: true,
                showCloseButton: true,
                autoclose: true,
                autotimeout: 3000,
                notificationsGap: null,
                notificationsPadding: null,
                type: 'outline',
                position: 'right top',
            })
        }
    } catch (e) {
        console.error("Error loading cities:", e);
        new Notify({
            status: 'error',
            title: 'Error',
            text: e.message,
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            notificationsGap: null,
            notificationsPadding: null,
            type: 'outline',
            position: 'right top',
        })
    } finally {
        Notiflix.Loading.remove(1000);
    }
}

async function loadDistricts() {
    try {
        const response = await fetch(`api/data/districts`, {
            method: 'GET',
            credentials: 'include'
        })

        if (response.ok) {
            const data = await response.json();

            const districtSelect = document.getElementById('districtSelect');

            if (data.districts && data.districts.length > 0) {
                renderDropDowns(districtSelect, data.districts, 'name');
            }
        }
    } catch (e) {
        new Notify({
            status: 'error',
            title: 'Error',
            text: e.message,
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            notificationsGap: null,
            notificationsPadding: null,
            type: 'outline',
            position: 'right top',
        })
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

async function addToCart(stockId, qty) {
    try {
        Notiflix.Loading.dots('Adding to cart...', {
            clickToClose: false,
            svgColor: '#000cf5'
        });

        const response = await fetch(`api/common/add-to-cart?sId=${stockId}&qty=${qty}`);

        if (response.ok) {
            let data = await response.json();
            if (data.status) {
                new Notify({
                    status: 'success',
                    title: 'Success',
                    text: data.message,
                    effect: 'fade',
                    speed: 300,
                    showIcon: true,
                    showCloseButton: true,
                    autoclose: true,
                    autotimeout: 3000,
                    notificationsGap: null,
                    notificationsPadding: null,
                    type: 'outline',
                    position: 'right top',
                })
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
                    notificationsGap: null,
                    notificationsPadding: null,
                    type: 'outline',
                    position: 'right top',
                })
            }
        } else {
            new Notify({
                status: 'error',
                title: 'Error',
                text: 'Failed to add to cart. Please try again.',
                effect: 'fade',
                speed: 300,
                showIcon: true,
                showCloseButton: true,
                autoclose: true,
                autotimeout: 3000,
                notificationsGap: null,
                notificationsPadding: null,
                type: 'outline',
                position: 'right top',
            })
        }
    } catch (e) {
        new Notify({
            status: 'error',
            title: 'Error',
            text: e.message,
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            notificationsGap: null,
            notificationsPadding: null,
            type: 'outline',
            position: 'right top',
        })
    } finally {
        Notiflix.Loading.remove();
    }
}

async function loadCartItems() {
    try {
        Notiflix.Loading.dots('Loading cart items...', {
            clickToClose: false,
            svgColor: '#000cf5'
        });

        const response = await fetch('api/common/get-cart-items');
        if (response.ok) {
            let data = await response.json();
            if (data.status) {
                new Notify({
                    status: 'success',
                    title: 'Success',
                    text: data.message,
                    effect: 'fade',
                    speed: 300,
                    showIcon: true,
                    showCloseButton: true,
                    autoclose: true,
                    autotimeout: 3000,
                    notificationsGap: null,
                    notificationsPadding: null,
                    type: 'outline',
                    position: 'right top',
                })
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
                    notificationsGap: null,
                    notificationsPadding: null,
                    type: 'outline',
                    position: 'right top',
                })
            }
        } else {
            new Notify({
                status: 'error',
                title: 'Error',
                text: 'Failed to load cart items. Please try again.',
                effect: 'fade',
                speed: 300,
                showIcon: true,
                showCloseButton: true,
                autoclose: true,
                autotimeout: 3000,
                notificationsGap: null,
                notificationsPadding: null,
                type: 'outline',
                position: 'right top',
            })
        }
    } catch (e) {
        new Notify({
            status: 'error',
            title: 'Error',
            text: e.message,
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            notificationsGap: null,
            notificationsPadding: null,
            type: 'outline',
            position: 'right top',
        })
    } finally {
        Notiflix.Loading.remove();
    }
}
