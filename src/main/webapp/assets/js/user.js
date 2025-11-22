window.addEventListener('load', async () => {
    Notiflix.Loading.dots("Loading...", {
        clickToClose: false,
        svgColor: "#f5006a"
    });
    try {
        console.log("Loading user data...");
        await loadUserData();
        console.log("User data loaded.");
    } catch (e) {
        Notiflix.Notify.failure(e.message, {
            position: 'right top',
        });
    } finally {
        Notiflix.Loading.remove(1000);
    }
});

//Initialize Bootstrap modals
const editProfileModal = new bootstrap.Modal(document.getElementById('editProfileModal'));
const editAddressModal = new bootstrap.Modal(document.getElementById('editAddressModal'));

// Edit Profile Button Click Handler
document.getElementById('editProfileBtn').addEventListener('click', function () {
    // Pre-fill the modal with current values
    document.getElementById('editFirstName').value = document.getElementById('firstNameDisplay').textContent || '';
    document.getElementById('editLastName').value = document.getElementById('lastNameDisplay').textContent || '';
    document.getElementById('editEmail').value = document.getElementById('emailDisplay').textContent || '';
    document.getElementById('editPhone').value = document.getElementById('phoneDisplay').textContent || '';

    // Show the modal
    editProfileModal.show();
});

// Save Profile Changes
document.getElementById('saveProfileBtn').addEventListener('click', async function () {
    const profileData = {
        firstName: document.getElementById('editFirstName').value,
        lastName: document.getElementById('editLastName').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value,
        dob: document.getElementById('editDob').value
    };

    try {
        Notiflix.Loading.dots("Saving...", {svgColor: "#f5006a"});

        const response = await fetch('api/profiles/update', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(profileData)
        });

        if (response.ok) {
            const data = await response.json();
            if (data.status) {
                // Update display values
                document.getElementById('firstNameDisplay').textContent = profileData.firstName;
                document.getElementById('lastNameDisplay').textContent = profileData.lastName;
                document.getElementById('emailDisplay').textContent = profileData.email;
                document.getElementById('phoneDisplay').textContent = profileData.phone;
                document.getElementById('name').innerHTML = `Hello, ${profileData.firstName} ${profileData.lastName}`;
                document.getElementById('uEmail').innerHTML = profileData.email;

                Notiflix.Notify.success('Profile updated successfully!', {position: 'right-top'});
                editProfileModal.hide();
            } else {
                Notiflix.Notify.failure(data.message, {position: 'right-top'});
            }
        }
    } catch (e) {
        Notiflix.Notify.failure('Failed to update profile', {position: 'right-top'});
    } finally {
        Notiflix.Loading.remove();
    }
});

// Edit Address Button Click Handler (using event delegation)
document.getElementById('addressList').addEventListener('click', function (e) {
    const editBtn = e.target.closest('.edit-address');
    if (editBtn) {
        const addressId = editBtn.dataset.addressId;
        const addressCard = editBtn.closest('.address-card');

        // Parse address from card (in real app, fetch from API)
        const cardBody = addressCard.querySelector('.card-body');
        const label = cardBody.querySelector('.card-title').textContent;
        const addressText = cardBody.querySelector('.card-text').innerHTML;

        // Set the address ID
        document.getElementById('editAddressId').value = addressId;
        document.getElementById('editAddressLabel').value = label;

        // Show the modal
        editAddressModal.show();
    }
});

// Update Address Handler
document.getElementById('updateAddressBtn').addEventListener('click', async function () {
    const addressData = {
        id: document.getElementById('editAddressId').value,
        label: document.getElementById('editAddressLabel').value,
        fullName: document.getElementById('editFullName').value,
        streetAddress: document.getElementById('editStreetAddress').value,
        city: document.getElementById('editCity').value,
        state: document.getElementById('editState').value,
        zipCode: document.getElementById('editZipCode').value,
        country: document.getElementById('editCountry').value,
        phone: document.getElementById('editAddressPhone').value,
        isDefault: document.getElementById('editSetAsDefault').checked
    };

    try {
        Notiflix.Loading.dots("Updating...", {svgColor: "#f5006a"});

        const response = await fetch('api/addresses/update', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(addressData)
        });

        if (response.ok) {
            const data = await response.json();
            if (data.status) {
                Notiflix.Notify.success('Address updated successfully!', {position: 'right-top'});
                editAddressModal.hide();
                // Reload addresses or update DOM
                location.reload();
            } else {
                Notiflix.Notify.failure(data.message, {position: 'right-top'});
            }
        }
    } catch (e) {
        Notiflix.Notify.failure('Failed to update address', {position: 'right-top'});
    } finally {
        Notiflix.Loading.remove();
    }
});

async function loadUserData() {

    Notiflix.Loading.dots("Loading your data...", {
        clickToClose: false,
        svgColor: "#f5006a"
    });

    try {
        const response = await fetch('api/profiles/user-profile', {
            method: 'GET'
        });
        if (response.ok) {
            if (response.redirected) {
                window.location.href = response.url // Redirect to the login page
                return;
            }
            const data = await response.json();

            let replacedText = String(data.user.sinceAt).replace("-", " ");
            let since = replacedText.split(" ");

            document.getElementById("firstName").innerText = data.user.firstName;
            document.getElementById("lastName").innerText = data.user.lastName;
            document.getElementById("email").innerText = data.user.email;
            document.getElementById("firstNameDisplay").innerText = data.user.firstName;
            document.getElementById("lastNameDisplay").innerText = data.user.lastName;
            document.getElementById("emailDisplay").innerText = data.user.email;
            document.getElementById("phoneDisplay").innerText = data.user.mobile === undefined ? '' : data.user.mobile;
            document.getElementById("mobile").innerText = data.user.mobile === undefined ? '' : data.user.mobile;
            document.getElementById("memberSinceDisplay").innerText = `Bookliy Member Since ${since[1]} ${since[0]}`
            document.getElementById("name").innerHTML = `Hello, ${data.user.firstName} ${data.user.lastName}`;
            document.getElementById("uEmail").innerHTML = data.user.email;
            document.getElementById("lineOne").innerText = data.user.lineOne === undefined ? "" : data.user.lineOne;
            document.getElementById("lineTwo").innerText = data.user.lineTwo === undefined ? "" : data.user.lineTwo;
            document.getElementById("RegName").innerHTML = `${data.user.firstName} ${data.user.lastName}`;

            // Render all addresses
            const fullName = `${data.user.firstName} ${data.user.lastName}`;

            if (data.addresses) {
                console.log("Rendering", data.addresses.length, "addresses");
                renderAddresses(data.addresses, fullName);
            } else {
                console.log("No addresses array in response!");
                renderAddresses([], fullName);  // Show empty state
            }

        } else {
            Notiflix.Notify.failure("Failed to load user data. Please try again.", {
                position: 'center-top',
            });
        }
    } catch (e) {
        Notiflix.Notify.failure(e.message, {
            position: 'center-top',
        });
    } finally {
        Notiflix.Loading.remove(1000);
    }
}

function renderAddresses(addresses, userName) {
    const addressList = document.getElementById('addressList');
    const emptyState = document.getElementById('emptyAddressState');

    // Clear existing content
    addressList.innerHTML = '';

    // Show empty state if no addresses
    if (!addresses || addresses.length === 0) {
        addressList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    addressList.style.display = 'flex';
    emptyState.style.display = 'none';

    // Loop through addresses and create cards
    addresses.forEach((address, index) => {
        const isPrimary = address.primary || address.isPrimary;

        const cardHTML = `
            <div class="col-md-6">
                <div class="address-card card ${isPrimary ? 'border-primary' : ''} h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h6 class="card-title fw-bold">${address.label || (isPrimary ? 'Primary Address' : 'Address ' + (index + 1))}</h6>
                            ${isPrimary
            ? '<span class="badge bg-primary">Default</span>'
            : `<button class="btn btn-outline-primary btn-sm set-default" data-address-id="${address.id}">Set Default</button>`
        }
                        </div>
                        <p class="card-text mb-2">
                            <strong>${userName}</strong><br>
                            ${address.lineOne || ''}<br>
                            ${address.lineTwo ? address.lineTwo + '<br>' : ''}
                            ${address.cityName || ''} ${address.postalCode || ''}
                        </p>
                        <p class="card-text">
                            <i class="bi bi-telephone me-1"></i>${address.mobile || 'No phone'}
                        </p>
                        <div class="address-actions mt-3">
                            <button class="btn btn-outline-primary btn-sm me-1 edit-address" 
                                    data-address-id="${address.id}"
                                    data-address='${JSON.stringify(address)}'>
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-danger btn-sm delete-address" 
                                    data-address-id="${address.id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        addressList.innerHTML += cardHTML;
    });
}