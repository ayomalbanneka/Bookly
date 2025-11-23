window.addEventListener('load', async () => {
    Notiflix.Loading.dots("Data is Loading...", {
        clickToClose: false,
        svgColor: "#000cf5"
    });
    try {
        await loadDistricts();
        // Add event listener for district selection change
        const districtSelect = document.getElementById('districtSelect');
        districtSelect.addEventListener('change', loadCities);

    } catch (e) {
        console.error("Error loading initial data:", e);
    } finally {
        Notiflix.Loading.remove(1000);
    }
})

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
            console.log("Districts data:", data);

            const districtSelect = document.getElementById('districtSelect');

            if (data.districts && data.districts.length > 0) {
                renderDropDowns(districtSelect, data.districts, 'name');
            }
        }
    } catch (e) {
        console.error("Error loading districts:", e);
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