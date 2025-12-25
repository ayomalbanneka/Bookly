window.addEventListener('load', async () => {
    Notiflix.Loading.dots("Data is Loading...", {
        clickToClose: false,
        svgColor: "#000cf5"
    });
    try {
        await loadLatestArrivals();
    } catch (e) {
        console.log("Error loading initial data:", e);
    } finally {
        Notiflix.Loading.remove(3000);
    }
})

async function loadLatestArrivals() {
    try {
        const response = await fetch(`api/data/latest-arrivals`);
        if (response.ok) {
            const data = await response.json();
            console.log(data)
            await renderLatestArrivals(data.newArrivals)
        } else {
            new Notify({
                status: 'error',
                title: 'Error',
                text: 'Failed to load latest arrivals',
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
    }
}

async function renderLatestArrivals(newArrivals) {
    console.log(newArrivals)
    const newArrivalProductContainer = document.getElementById("new-arrival-product-container");
    newArrivalProductContainer.innerHTML = "";
    newArrivals.forEach((product) => {
        product.stockDTOList.forEach((stock) => {
            newArrivalProductContainer.innerHTML += `
        <div class="col-sm-6 col-md-4 col-lg-3">
            <div class="product-card card border-0 shadow-sm h-100" >
                <a class="text-decoration-none text-dark" href="single-product.html?productId=${product.productId}">
                    <div class="position-relative">
                                <img src="${product.images[0]}" class="card-img-top" alt="Book Title">
                                    <span class="badge bg-success position-absolute top-0 start-0 m-2">NEW</span>
                                    <div class="card-actions position-absolute top-0 end-0 m-2">
                                        <button class="btn btn-light btn-sm rounded-circle mb-1"><i class="bi bi-heart"></i>
                                        </button>
<!--                                        <button class="btn btn-light btn-sm rounded-circle"><i class="bi bi-eye"></i></button>-->
                                    </div>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title text-truncate h6">${product.title}</h5>
                                <p class="card-text text-muted small">${product.author}</p>
                                <div class="rating mb-2">
                                    <i class="bi bi-star-fill text-warning"></i>
                                    <i class="bi bi-star-fill text-warning"></i>
                                    <i class="bi bi-star-fill text-warning"></i>
                                    <i class="bi bi-star-fill text-warning"></i>
                                    <i class="bi bi-star-half text-warning"></i>
                                </div>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="fw-bold text-primary">LKR
                                        ${new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
            }).format(stock.price)}
                                    </span>
                                </div>
                            </div>
                </a>
                            <div class="card-footer bg-transparent border-0 pt-0">
                                <button class="btn btn-primary w-100 btn-sm" 
                                onclick="addToCart(${stock.stockId},1)">Add to Cart</button>
                            </div>
                    </div>
               </div>
`;
        })
    });
}