const toggleButtons = document.querySelectorAll('.toggle-password');

let params = new URLSearchParams(window.location.search)

const inputVCode = document.getElementById("verificationCode");
inputVCode.value = params.get("verificationCode");
const userEmail = params.get("email");

async function createAccount() {
    Notiflix.Loading.dots("Loading...", {
        clickToClose: true,
        svgColor: "#000cf5"
    });

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const termsAccepted = document.getElementById("terms").checked;

    if (!termsAccepted) {
        new Notify({
            status: 'error',
            title: 'Terms Not Accepted',
            text: 'You must accept the terms and conditions to proceed.',
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
        Notiflix.Loading.remove(1000);
        return;
    }

    if (password !== confirmPassword) {
        new Notify({
            status: 'error',
            title: 'Password Mismatch',
            text: 'Passwords do not match. Please try again.',
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
        Notiflix.Loading.remove(1000);
        return;
    }

    const userObject = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        confirmPassword: confirmPassword
    }

    try {
        const response = await fetch("api/users/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userObject)
        })

        if (response.ok) {
            const data = await response.json();
            if (data.status) {
                new Notify({
                    status: 'success',
                    title: 'Account Created Successfully',
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

                setTimeout(() => {
                    window.location.href = `verify-account.html?email=${encodeURIComponent(email)}`;
                }, 3000)
            } else {
                new Notify({
                    status: 'error',
                    title: 'Registration Failed',
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
                title: 'Registration Failed',
                text: 'Please try again.',
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
    } catch (error) {
        new Notify({
            status: 'error',
            title: 'API Error',
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
    } finally {
        Notiflix.Loading.remove(1000);
    }
}

async function loginAccount() {
    Notiflix.Loading.dots("Loading...", {
        clickToClose: true,
        svgColor: "#000cf5"
    });

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const loginObject = {
        email: email,
        password: password
    }

    try {
        const response = await fetch("api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginObject)
        })

        if (response.ok) {
            const data = await response.json();
            if (data.status) {
                new Notify({
                    status: 'success',
                    title: 'Login Successful',
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

                setTimeout(() => {
                    window.location = "index.html";
                }, 3000)
            } else {
                new Notify({
                    status: 'error',
                    title: 'Login Failed',
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
                title: 'Login Failed',
                text: 'Please try again.',
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
    } catch (error) {
        new Notify({
            status: 'error',
            title: 'API Error',
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
    } finally {
        Notiflix.Loading.remove(1000);
    }
}

async function verifyAccount() {
    Notiflix.Loading.dots("Loading...", {
        clickToClose: false,
        svgColor: "#000cf5"
    });

    const verifyObj = {
        verificationCode: inputVCode.value,
        email: userEmail
    }

    console.log("Email sent to API:", userEmail);
    console.log("Verification Code sent to API:", inputVCode.value);

    try {
        const response = await fetch("api/verify-accounts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(verifyObj)
        });

        if (response.ok) {
            const data = await response.json();
            if (data.status) {
                new Notify({
                    status: 'success',
                    title: 'Account Verified',
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
                setTimeout(() => {
                    window.location = "sign-in.html";
                }, 3000)
            } else {
                new Notify({
                    status: 'error',
                    title: 'Verification Failed',
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
                title: 'Verification Failed',
                text: 'Please try again.',
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
    } catch (error) {
        new Notify({
            status: 'error',
            title: 'API Error',
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
    } finally {
        Notiflix.Loading.remove(1000);
    }
}