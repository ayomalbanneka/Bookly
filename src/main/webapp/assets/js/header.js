// Header Component
class HeaderContent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <!-- Top Bar -->
        <div class="top-bar bg-dark text-white py-2">
            <div class="container">
                <div class="row align-items-center text-center text-md-start">
                    <div class="col-md-4 mb-1 mb-md-0">
                        <small class="d-block d-md-inline">Need help? Call us 
                            <a href="tel:+947113894655" class="text-white text-decoration-underline">+94 71 1389 4655</a>
                        </small>
                    </div>
                    <div class="col-md-4 mb-1 mb-md-0">
                        <small class="d-inline-block border-start border-end border-secondary px-3">
                            Summer sale discount off 60%! 
                            <a href="shop.html" class="text-decoration-underline text-white">Shop Now</a>
                        </small>
                    </div>
                    <div class="col-md-4">
                        <small>2-3 business days delivery & free returns</small>
                    </div>
                </div>
            </div>
        </div>

        <!-- Navigation -->
        <nav class="navbar navbar-expand-lg navbar-light py-3">
            <div class="container">
                <a class="navbar-brand fw-bold fs-3 text-primary" href="index.html">
                    <i class="bi bi-book-half me-2"></i>BOOKLY
                </a>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent"
                        aria-label="Toggle navigation">
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
                               data-bs-toggle="dropdown" aria-expanded="false">
                                Categories
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                <li><a class="dropdown-item" href="romance.html">Romance</a></li>
                                <li><a class="dropdown-item" href="fiction.html">Fiction</a></li>
                                <li><a class="dropdown-item" href="mystery.html">Mystrey</a></li>
                                <li><a class="dropdown-item" href="sci-fi.html">Sci-Fi</a></li>
                                <li><a class="dropdown-item" href="biography.html">Biography</a></li>
                                <li><a class="dropdown-item" href="business.html">Business</a></li>
                                <li><a class="dropdown-item" href="self-help.html">Self-Help</a></li>
                                <li><a class="dropdown-item" href="children.html">Children</a></li>
                            </ul>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="contact.html">Contact</a>
                        </li>
                    </ul>

                    <div class="d-flex align-items-center">
                        <!-- Search Button -->
                        <button class="btn btn-link text-dark p-2 me-1 me-md-2" data-bs-toggle="modal"
                                data-bs-target="#searchModal" aria-label="Search">
                            <i class="bi bi-search fs-5"></i>
                        </button>

                        <!-- User Account Dropdown -->
                        <div class="dropdown me-1 me-md-2">
                            <button class="btn btn-link text-dark p-2 dropdown-toggle" type="button"
                                    data-bs-toggle="dropdown" aria-expanded="false" aria-label="Account">
                                <i class="bi bi-person fs-5"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end p-3" style="min-width: 250px;">
                                <li><h5 class="dropdown-header">Account</h5></li>
                                <li><a class="dropdown-item" href="my-account.html">My Account</a></li>
                                <li><a class="dropdown-item" href="sign-in.html">Sign In</a></li>
                                <li><a class="dropdown-item" href="sign-up.html">Sign Up</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="wishlist.html">Wishlist</a></li>
                                <li><a class="dropdown-item" href="orders.html">Orders</a></li>
                            </ul>
                        </div>

                        <!-- Wishlist -->
                        <a href="wishlist.html" class="btn btn-link text-dark p-2 me-1 me-md-2 position-relative"
                           aria-label="Wishlist">
                            <i class="bi bi-heart fs-5"></i>
                            <span class="wishlist-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary" 
                                  style="display: none;">0</span>
                        </a>

                        <!-- Cart -->
                        <a href="cart.html" class="btn btn-link text-dark p-2 position-relative" aria-label="Cart">
                            <i class="bi bi-cart3 fs-5"></i>
                            <span class="cart-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary" 
                                  style="display: none;">0</span>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
        `;
    }
}

customElements.define('header-content', HeaderContent);