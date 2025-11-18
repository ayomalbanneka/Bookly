class footerContent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<div class="container">
        <div class="row g-4">
            <div class="col-lg-4">
                <h4 class="fw-bold mb-3">BOOKLY</h4>
                <p class="mb-4">Your trusted source for quality books. We offer a wide selection of titles across all
                    genres with fast shipping and excellent customer service.</p>
                <div class="social-links d-flex gap-3">
                    <a href="#" class="text-white"><i class="bi bi-facebook fs-5"></i></a>
                    <a href="#" class="text-white"><i class="bi bi-twitter fs-5"></i></a>
                    <a href="#" class="text-white"><i class="bi bi-instagram fs-5"></i></a>
                    <a href="#" class="text-white"><i class="bi bi-linkedin fs-5"></i></a>
                </div>
            </div>

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

            <div class="col-lg-3 col-md-6">
                <h5 class="fw-bold mb-3">Help & Info</h5>
                <ul class="list-unstyled">
                    <li class="mb-2"><a href="#" class="text-white text-decoration-none">Track Your Order</a></li>
                    <li class="mb-2"><a href="#" class="text-white text-decoration-none">Returns Policies</a></li>
                    <li class="mb-2"><a href="#" class="text-white text-decoration-none">Shipping + Delivery</a></li>
                    <li class="mb-2"><a href="#" class="text-white text-decoration-none">Contact Us</a></li>
                    <li class="mb-2"><a href="#" class="text-white text-decoration-none">FAQs</a></li>
                </ul>
            </div>

            <div class="col-lg-3">
                <h5 class="fw-bold mb-3">Contact Us</h5>
                <p class="mb-2">Do you have any queries or suggestions?</p>
                <p class="mb-3"><a href="mailto:info@bookly.com" class="text-white text-decoration-underline">info@bookly.com</a>
                </p>
                <p class="mb-2">If you need support? Just give us a call.</p>
                <p><a href="tel:+5511122233344" class="text-white text-decoration-underline">+94 71 1389 4655</a></p>
            </div>
        </div>

        <hr class="my-5 border-secondary">

        <div class="row align-items-center">
            <div class="col-md-6">
                <div class="d-flex flex-wrap align-items-center gap-4">
<!--                    <div class="d-flex align-items-center">-->
<!--                        <span class="me-2">We ship with:</span>-->
<!--                        <div class="d-flex gap-2">-->
<!--                            <img src="https://via.placeholder.com/40x25" alt="DHL" class="img-fluid">-->
<!--                            <img src="https://via.placeholder.com/40x25" alt="Shipping" class="img-fluid">-->
<!--                        </div>-->
<!--                    </div>-->
                    <div class="d-flex align-items-center">
                        <span class="me-2">Payment options:</span>
                        <div class="d-flex gap-2">
                            <img src="assets/images/visa.png" alt="Visa" class="img-fluid" style="width:40px;height:auto;">
                            <img src="assets/images/mastercard.png" alt="Mastercard" class="img-fluid" style="width:40px;height:auto;">
                            <img src="assets/images/paypal.png" alt="PayPal" class="img-fluid" style="width:40px;height:auto;">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 text-md-end mt-3 mt-md-0">
                <p class="mb-0">&copy; 2025 Bookly. All rights reserved.</p>
            </div>
        </div>
    </div>`;
    }
}

customElements.define('footer-content', footerContent);