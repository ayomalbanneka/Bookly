class headerContent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<!-- Top Bar -->
    <div class="top-bar bg-dark text-white py-2 d-none d-md-block">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-md-4 text-center text-md-start">
                    <small>Need help? Call us <a href="tel:+947113894655" class="text-white">+94 71 1389
                        4655</a></small>
                </div>
                <div class="col-md-4 text-center border-start border-end border-secondary">
                    <small>Summer sale discount off 60%! <a href="#" class="text-decoration-underline text-white">Shop
                        Now</a></small>
                </div>
                <div class="col-md-4 text-center text-md-end">
                    <small>2-3 business days delivery & free returns</small>
                </div>
            </div>
        </div>
    </div>

    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light py-3">
        <div class="container">
            <a class="navbar-brand fw-bold fs-3 text-primary" href="index.html">BOOKLY</a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarContent">
                <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link active" href="index.html">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="about.html">About</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="shop.html">Shop</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="blog.html">Blog</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                           data-bs-toggle="dropdown">
                            Pages
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="about.html">About</a></li>
                            <li><a class="dropdown-item" href="shop.html">Shop</a></li>
                            <li><a class="dropdown-item" href="product.html">Single Product</a></li>
                            <li><a class="dropdown-item" href="cart.html">Cart</a></li>
                            <li><a class="dropdown-item" href="checkout.html">Checkout</a></li>
                            <li><a class="dropdown-item" href="blog.html">Blog</a></li>
                            <li><a class="dropdown-item" href="post.html">Single Post</a></li>
                            <li><a class="dropdown-item" href="contact.html">Contact</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="contact.html">Contact</a>
                    </li>
                </ul>

                <div class="d-flex align-items-center">
                    <button class="btn btn-link text-dark p-2 me-2" data-bs-toggle="modal"
                            data-bs-target="#searchModal">
                        <i class="bi bi-search fs-5"></i>
                    </button>
                    <div class="dropdown me-2">
                        <button class="btn btn-link text-dark p-2 dropdown-toggle" type="button"
                                data-bs-toggle="dropdown">
                            <i class="bi bi-person fs-5"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end p-3" style="min-width: 300px;">
                            <li>
                                <h5 class="dropdown-header">Account</h5>
                            </li>
                            <li><a class="dropdown-item" href="sign-in.html">Sign In</a></li>
                            <li><a class="dropdown-item" href="sign-up.html">Sign Up</a></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item" href="wishlist.html">Wishlist</a></li>
                            <li><a class="dropdown-item" href="orders.html">Orders</a></li>
                        </ul>
                    </div>
                    <a href="wishlist.html" class="btn btn-link text-dark p-2 me-2 position-relative">
                        <i class="bi bi-heart fs-5"></i>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">2</span>
                    </a>
                    <a href="cart.html" class="btn btn-link text-dark p-2 position-relative">
                        <i class="bi bi-cart3 fs-5"></i>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">2</span>
                    </a>
                </div>
            </div>
        </div>
    </nav>`
    }
}

customElements.define('header-content', headerContent);