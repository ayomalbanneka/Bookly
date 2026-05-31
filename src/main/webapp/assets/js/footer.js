// Footer Component
class FooterContent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="container">
            <div class="row g-4">
                <!-- Brand Info -->
                <div class="col-lg-4">
                    <h4 class="fw-bold mb-3">
                        <i class="bi bi-book-half me-2"></i>BOOKLY
                    </h4>
                    <p class="mb-4">Your trusted source for quality books. We offer a wide selection of titles across all genres with fast shipping and excellent customer service.</p>
                    <div class="social-links d-flex gap-3">
                        <a href="#" class="text-white" aria-label="Facebook"><i class="bi bi-facebook fs-5"></i></a>
                        <a href="#" class="text-white" aria-label="Twitter"><i class="bi bi-twitter fs-5"></i></a>
                        <a href="#" class="text-white" aria-label="Instagram"><i class="bi bi-instagram fs-5"></i></a>
                        <a href="#" class="text-white" aria-label="LinkedIn"><i class="bi bi-linkedin fs-5"></i></a>
                        <a href="#" class="text-white" aria-label="YouTube"><i class="bi bi-youtube fs-5"></i></a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div class="col-lg-2 col-md-6">
                    <h5 class="fw-bold mb-3">Quick Links</h5>
                    <ul class="list-unstyled">
                        <li class="mb-2"><a href="index.html" class="text-white text-decoration-none">Home</a></li>
                        <li class="mb-2"><a href="about.html" class="text-white text-decoration-none">About</a></li>
                        <li class="mb-2"><a href="shop.html" class="text-white text-decoration-none">Shop</a></li>
                        <li class="mb-2"><a href="blog.html" class="text-white text-decoration-none">Blog</a></li>
                        <li class="mb-2"><a href="contact.html" class="text-white text-decoration-none">Contact</a></li>
                    </ul>
                </div>

                <!-- Help & Info -->
                <div class="col-lg-3 col-md-6">
                    <h5 class="fw-bold mb-3">Help & Info</h5>
                    <ul class="list-unstyled">
                        <li class="mb-2"><a href="#" class="text-white text-decoration-none">Track Your Order</a></li>
                        <li class="mb-2"><a href="#" class="text-white text-decoration-none">Returns Policies</a></li>
                        <li class="mb-2"><a href="#" class="text-white text-decoration-none">Shipping + Delivery</a></li>
                        <li class="mb-2"><a href="#" class="text-white text-decoration-none">FAQs</a></li>
                        <li class="mb-2"><a href="#" class="text-white text-decoration-none">Size Guide</a></li>
                    </ul>
                </div>

                <!-- Contact Info -->
                <div class="col-lg-3">
                    <h5 class="fw-bold mb-3">Contact Us</h5>
                    <div class="mb-3">
                        <p class="mb-1">Email us:</p>
                        <a href="mailto:info@bookly.lk" class="text-white text-decoration-underline">info@bookly.lk</a>
                    </div>
                    <div class="mb-3">
                        <p class="mb-1">Call us:</p>
                        <a href="tel:+94112345678" class="text-white text-decoration-underline">+94 11 234 5678</a>
                    </div>
                    <div>
                        <p class="mb-1">Visit us:</p>
                        <small class="text-white-50">No. 45, Galle Road, Colombo 03, Sri Lanka</small>
                    </div>
                </div>
            </div>

            <hr class="my-5 border-secondary">

            <!-- Bottom Footer -->
            <div class="row align-items-center">
                <div class="col-md-6 mb-3 mb-md-0">
                    <div class="d-flex flex-wrap align-items-center gap-4">
                        <!-- Payment Methods -->
                        <div class="d-flex align-items-center">
                            <span class="me-2 d-none d-sm-inline">Payment methods:</span>
                            <div class="d-flex gap-2">
                                <!-- Visa - Blue/Yellow/Gold -->
                                <img src="https://img.icons8.com/color/48/000000/visa.png" 
                                     alt="Visa" 
                                     class="payment-icon"
                                     title="Visa">
                                
                                <!-- Mastercard - Red/Yellow -->
                                <img src="https://img.icons8.com/color/48/000000/mastercard.png" 
                                     alt="Mastercard" 
                                     class="payment-icon"
                                     title="Mastercard">
                                
                                <!-- PayPal - Blue -->
                                <img src="https://img.icons8.com/color/48/000000/paypal.png" 
                                     alt="PayPal" 
                                     class="payment-icon"
                                     title="PayPal">
                                
                                <!-- Discover - Orange (Bonus icon if needed) -->
                                <img src="https://img.icons8.com/color/48/000000/discover.png" 
                                     alt="Discover" 
                                     class="payment-icon"
                                     title="Discover">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 text-md-end">
                    <div class="d-flex flex-column flex-md-row justify-content-md-end align-items-center gap-3">
                        <small class="text-white-50">
                            &copy; ${new Date().getFullYear()} Bookly. All rights reserved.
                        </small>
                        <div class="d-flex gap-3">
                            <a href="#" class="text-white-50 text-decoration-none small">Privacy Policy</a>
                            <a href="#" class="text-white-50 text-decoration-none small">Terms of Service</a>
                            <a href="#" class="text-white-50 text-decoration-none small">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}

customElements.define('footer-content', FooterContent);