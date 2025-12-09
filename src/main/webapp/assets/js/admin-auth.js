async function adminLogin() {
    const adminEmail = document.getElementById('admin-email').value;
    const adminPassword = document.getElementById('admin-password').value;
    const submitButton = document.querySelector('.form-submit button');
    const btnContent = submitButton.querySelector('.btn-content');
    const loadingContent = submitButton.querySelectorAll('span')[1];

    const loginObject = {
        email: adminEmail,
        password: adminPassword
    }

    // Show loading state
    btnContent.classList.add('d-none');
    loadingContent.classList.remove('d-none');
    submitButton.disabled = true;

    try {
        const response = await fetch('api/admin/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginObject)
        });

        if (response.ok) {
            const data = await response.json();
            if (data.status) {
                new Notify({
                    status: 'success',
                    title: 'Login Successful',
                    text: 'Welcome back, Admin!',
                    effect: 'fade',
                    speed: 300,
                    autoclose: true,
                    autotimeout: 3000,
                    position: 'top-right',
                    customClass: null,
                    customIcon: null,
                    showIcon: true,
                    closeOnClick: true,
                    pauseOnHover: true
                })
                setTimeout(() => {
                    window.location.href = 'admin-panel.html';
                }, 3000)
            } else {
                new Notify({
                    status: 'error',
                    title: 'Login Failed',
                    text: data.message,
                    effect: 'fade',
                    speed: 300,
                    autoclose: true,
                    autotimeout: 3000,
                    position: 'top-right',
                    customClass: null,
                    customIcon: null,
                    showIcon: true,
                    closeOnClick: true,
                    pauseOnHover: true
                })
                // Reset button state
                btnContent.classList.remove('d-none');
                loadingContent.classList.add('d-none');
                submitButton.disabled = false;
            }
        } else {
            new Notify({
                status: 'error',
                title: 'Server Error',
                text: 'An error occurred on the server. Please try again later.',
                effect: 'fade',
                speed: 300,
                autoclose: true,
                autotimeout: 3000,
                position: 'top-right',
                customClass: null,
                customIcon: null,
                showIcon: true,
                closeOnClick: true,
                pauseOnHover: true
            })
            // Reset button state
            btnContent.classList.remove('d-none');
            loadingContent.classList.add('d-none');
            submitButton.disabled = false;
        }
    } catch (error) {
        new Notify({
            status: 'error',
            title: 'Network Error',
            text: 'Unable to connect to the server. Please try again later.',
            effect: 'fade',
            speed: 300,
            autoclose: true,
            autotimeout: 3000,
            position: 'top-right',
            customClass: null,
            customIcon: null,
            showIcon: true,
            closeOnClick: true,
            pauseOnHover: true
        })
        // Reset button state
        btnContent.classList.remove('d-none');
        loadingContent.classList.add('d-none');
        submitButton.disabled = false;
    }
}