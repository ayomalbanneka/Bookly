package lk.cypher.bookliy.services;

import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lk.cypher.bookliy.dto.CartDTO;
import lk.cypher.bookliy.dto.ProductDTO;
import lk.cypher.bookliy.dto.StockDTO;
import lk.cypher.bookliy.entity.*;
import lk.cypher.bookliy.util.AppUtil;
import lk.cypher.bookliy.util.HibernateUtil;
import lk.cypher.bookliy.validation.Validator;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import java.util.ArrayList;
import java.util.List;

public class CommonServices {

    // Get all products
    public String getAllProducts() {
        JsonObject responseObj = new JsonObject();
        boolean status = false;
        String message = "";

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();

        // Load All Categories
        List<Category> categoryList = hibernateSession.createQuery("FROM Category c", Category.class).getResultList();

        // Create category list with counts
        List<JsonObject> categories = new ArrayList<>();
        for (Category category : categoryList) {
            JsonObject categoryObj = new JsonObject();
            categoryObj.addProperty("id", category.getId());
            categoryObj.addProperty("name", category.getName());

            // Get product count for this category
            Long count = hibernateSession.createQuery(
                            "SELECT COUNT(p) FROM Product p WHERE p.category = :category", Long.class)
                    .setParameter("category", category)
                    .getSingleResult();
            categoryObj.addProperty("count", count);

            categories.add(categoryObj);
        }

        // Get Min and Max Prices
        Double maxPrice = hibernateSession.createQuery("SELECT MAX(s.price) FROM Stock s", Double.class).getSingleResult();
        Double minPrice = hibernateSession.createQuery("SELECT MIN(s.price) FROM Stock s", Double.class).getSingleResult();

        // Load All Products
        List<Product> productList = hibernateSession.createQuery("FROM Product p", Product.class).getResultList();

        // Get total product count
        Long allProductCount = hibernateSession.createQuery("SELECT COUNT(p) FROM Product p", Long.class).getSingleResult();

        // Load Stocks with pagination
        Query<Stock> stockQuery = hibernateSession.createQuery("FROM Stock s ORDER BY s.id ASC", Stock.class);
        stockQuery.setFirstResult(AppUtil.FIRST_RESULT_VALUE);
        stockQuery.setMaxResults(AppUtil.MAX_RESULT_VALUE); // Get stocks from 0 to 10

        // Build Product DTO List
        List<ProductDTO> productDTOList = new ArrayList<>();
        for (Product product : productList) {
            ProductDTO productDTO = new ProductDTO();
            productDTO.setProductId(product.getId());
            productDTO.setTitle(product.getTitle());
            productDTO.setAuthor(product.getAuthor());
            productDTO.setCategoryName(product.getCategory().getName());
            productDTO.setImages(product.getImages());

            List<StockDTO> stockDTOList = new ArrayList<>();
            for (Stock stock : product.getStocks()) {
                StockDTO stockDTO = new StockDTO();
                stockDTO.setStockId(stock.getId());
                stockDTO.setPrice(stock.getPrice());
                stockDTO.setStock(stock.getQty());
                stockDTOList.add(stockDTO);
            }
            productDTO.setStockDTOList(stockDTOList);
            productDTOList.add(productDTO);
        }

        hibernateSession.close();

        // Add all data to response
        responseObj.add("categoryList", AppUtil.gson.toJsonTree(categories));
        responseObj.add("allProducts", AppUtil.gson.toJsonTree(productDTOList));
        responseObj.addProperty("allProductCount", allProductCount);
        responseObj.addProperty("minPrice", minPrice);
        responseObj.addProperty("maxPrice", maxPrice);
        responseObj.addProperty("maxResult", AppUtil.MAX_RESULT_VALUE);

        status = true;
        message = "All products retrieved successfully.";

        responseObj.addProperty("status", status);
        responseObj.addProperty("message", message);

        return AppUtil.gson.toJson(responseObj);
    }

    // Get all user carts service
    public String getAllUserCarts(HttpServletRequest request) {
        JsonObject responseObj = new JsonObject();
        boolean status = false;
        String message = "";

        HttpSession httpSession = request.getSession();
        User sessionUser = (User) httpSession.getAttribute("user");
        if (sessionUser == null) {
            //Use session cart
            List<Cart> sessionCart = getSessionAttribute(httpSession);
            if (sessionCart == null) {
                message = "No items in cart.";
            } else if (sessionCart.isEmpty()) {
                message = "No items in cart.";
            } else {
                // Generate Cart DTOs
                List<CartDTO> cartDTOList = generateCartDTOs(sessionCart);
                responseObj.add("cartItems", AppUtil.gson.toJsonTree(cartDTOList));
                status = true;
                message = "Cart items retrieved successfully.";
            }
        } else {
            // Use user cart from DB
            Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
            List<Cart> cartList = hibernateSession.createQuery("FROM Cart c WHERE c.user.id=:id", Cart.class)
                    .setParameter("id", sessionUser.getId())
                    .getResultList();
            if (cartList.isEmpty()) {
                message = "No items in cart.";
            } else {
                // Generate Cart DTOs
                List<CartDTO> cartDTOList = generateCartDTOs(cartList);
                responseObj.add("cartItems", AppUtil.gson.toJsonTree(cartDTOList));
                status = true;
                message = "Cart items retrieved successfully.";
            }
            hibernateSession.close();
        }

        responseObj.addProperty("status", status);
        responseObj.addProperty("message", message);
        return AppUtil.gson.toJson(responseObj);
    }

    private List<CartDTO> generateCartDTOs(List<Cart> cartList) {
        List<CartDTO> cartDTOList = new ArrayList<>();
        Session hinernateSession = HibernateUtil.getSessionFactory().openSession();
        for (Cart cart : cartList) {
            Stock stock = hinernateSession.find(Stock.class, cart.getStock().getId());

            CartDTO cartDTO = new CartDTO();
            cartDTO.setCartId(cart.getId());
            cartDTO.setStockId(stock.getId());
            cartDTO.setProductTitle(stock.getProduct().getTitle());
            cartDTO.setImages(stock.getProduct().getImages());
            cartDTO.setQty(cart.getQty());
            cartDTO.setPrice(stock.getPrice());
            cartDTO.setAuthorName(stock.getProduct().getAuthor());
            cartDTO.setBookCategory(stock.getProduct().getCategory().getName());
            cartDTO.setPages(stock.getProduct().getPages());
            cartDTOList.add(cartDTO);
        }
        return cartDTOList;
    }

    public void mergeUserCarts(HttpServletRequest request) {
        HttpSession httpSession = request.getSession();
        User sessionUser = (User) request.getSession().getAttribute("user");
        if (sessionUser != null) {
            List<Cart> sessionCart = getSessionAttribute(httpSession);
            if (sessionCart != null && !sessionCart.isEmpty()) {
                Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
                User dbUser = hibernateSession.find(User.class, sessionUser.getId());
                Transaction transaction = hibernateSession.beginTransaction();
                for (Cart cart : sessionCart) {
                    Stock stock = hibernateSession.find(Stock.class, cart.getStock().getId());
                    Cart existingCart = hibernateSession.createQuery("FROM Cart c WHERE c.user=:user AND c.stock=:stock", Cart.class)
                            .setParameter("user", dbUser)
                            .setParameter("stock", stock)
                            .getSingleResultOrNull();

                    if (existingCart == null) {
                        existingCart = new Cart();
                        existingCart.setUser(dbUser);
                        existingCart.setStock(stock);
                        existingCart.setQty(cart.getQty());
                        hibernateSession.persist(existingCart);
                    } else {
                        int newQuantity = existingCart.getQty() + cart.getQty();
                        if (newQuantity <= stock.getQty()) {
                            existingCart.setQty(newQuantity);
                            hibernateSession.merge(existingCart);
                        }
                    }
                }
                transaction.commit();
                hibernateSession.close();
            }
            httpSession.setAttribute("sessionCart", null); // Clear session cart after merging
        }
    }

    // Add to cart service
    public String addToCart(String sId, String qty, HttpServletRequest request) {
        JsonObject responseObj = new JsonObject();
        boolean status = false;
        String message = "";

        Session hibernateSession = null;

        try {
            if (sId == null || sId.isEmpty()) {
                message = "Product ID is not provided.";
            } else if (!sId.matches(Validator.IS_INTEGER)) {
                message = "Invalid Product ID.";
            } else if (qty == null || qty.isEmpty()) {
                message = "Product quantity is not provided.";
            } else if (!qty.matches(Validator.IS_INTEGER)) {
                message = "Invalid quantity value.";
            } else {
                int stockId = Integer.parseInt(sId);
                int requestQuantity = Integer.parseInt(qty);

                hibernateSession = HibernateUtil.getSessionFactory().openSession();
                Stock stock = hibernateSession.find(Stock.class, stockId);

                if (stock == null) {
                    message = "Product not found.";
                } else {
                    // Stock found, proceed to add to cart
                    HttpSession httpSession = request.getSession();
                    User user = (User) request.getSession().getAttribute("user");
                    List<Cart> sessionCart = getSessionAttribute(httpSession);

                    if (user == null) {
                        // User not logged in
                        if (sessionCart == null) {
                            // No session cart found, create a new one (First time)
                            return guestUserFirstTime(stock, requestQuantity, httpSession);
                        } else {
                            // Session cart found, proceed to add item (Second time)
                            return guestUserSecondTime(stock, requestQuantity, httpSession);
                        }
                    } else {
                        // User already logged in
                        return loggedUserCart(stock, requestQuantity, httpSession, hibernateSession);
                    }
                }
            }
        } finally {
            // Fixed: Ensure session is always closed
            if (hibernateSession != null) {
                hibernateSession.close();
            }
        }

        responseObj.addProperty("status", status);
        responseObj.addProperty("message", message);

        return AppUtil.gson.toJson(responseObj);
    }

    // Guest user adding to cart
    private String guestUserFirstTime(Stock stock, int requestQuantity, HttpSession httpSession) {
        JsonObject responseObj = new JsonObject();
        boolean status = false;
        String message = "";

        if (requestQuantity > stock.getQty()) {
            message = "Product quantity exceeds available stock.";
        } else {
            List<Cart> cartList = new ArrayList<>();
            Cart cart = new Cart();
            cart.setId(1);
            cart.setStock(stock);
            cart.setQty(requestQuantity);
            cart.setUser(null);
            cartList.add(cart);
            httpSession.setAttribute("sessionCart", cartList);
            status = true;
            message = "Product added to cart successfully.";
        }

        responseObj.addProperty("status", status);
        responseObj.addProperty("message", message);
        return AppUtil.gson.toJson(responseObj);
    }

    // Guest user adding to cart again
    private String guestUserSecondTime(Stock stock, int requestQuantity, HttpSession httpSession) {
        JsonObject responseObj = new JsonObject();
        boolean status = false;
        String message = "";

        List<Cart> sessionCart = getSessionAttribute(httpSession);
        boolean found = false;
        Cart cart = null;

        for (Cart c : sessionCart) {
            if (c.getStock().getId() == stock.getId()) {
                found = true;
                cart = c;
                break;
            }
        }

        if (found) {
            // Product already exists in cart, update quantity
            int newQuantity = cart.getQty() + requestQuantity;
            if (newQuantity > stock.getQty()) {
                message = "Product quantity exceeds available stock.";
            } else {
                cart.setQty(newQuantity);
                status = true;
                message = "Product quantity updated in cart successfully.";
            }
        } else {
            // Fixed: Added stock quantity validation for new items
            if (requestQuantity > stock.getQty()) {
                message = "Product quantity exceeds available stock.";
            } else {
                cart = new Cart();
                cart.setId(sessionCart.size() + 1);
                cart.setStock(stock);
                cart.setQty(requestQuantity);
                cart.setUser(null);
                sessionCart.add(cart);
                status = true;
                message = "Product added to cart successfully.";
            }
        }

        responseObj.addProperty("status", status);
        responseObj.addProperty("message", message);
        return AppUtil.gson.toJson(responseObj);
    }

    // Logged-in user adding to cart
    private String loggedUserCart(Stock stock, int requestQuantity, HttpSession httpSession, Session hibernateSession) {
        JsonObject responseObj = new JsonObject();
        boolean status = false;
        String message = "";

        User sessionUser = (User) httpSession.getAttribute("user");

        if (sessionUser != null) {
            User dbUser = hibernateSession.find(User.class, sessionUser.getId());
            Cart existingCart = hibernateSession.createQuery("FROM Cart c WHERE c.user=:user AND c.stock=:stock", Cart.class)
                    .setParameter("user", dbUser)
                    .setParameter("stock", stock)
                    .getSingleResultOrNull();

            Transaction transaction = hibernateSession.beginTransaction();

            try {
                if (existingCart == null) {
                    // Fixed: Added stock quantity validation for new cart items
                    if (requestQuantity > stock.getQty()) {
                        message = "Product quantity exceeds available stock.";
                    } else {
                        existingCart = new Cart();
                        existingCart.setUser(dbUser);
                        existingCart.setStock(stock);
                        existingCart.setQty(requestQuantity);
                        hibernateSession.persist(existingCart);
                        status = true;
                        message = "Product added to cart successfully.";
                    }
                } else {
                    // Update existing cart item
                    int newQuantity = existingCart.getQty() + requestQuantity;
                    if (newQuantity > stock.getQty()) {
                        message = "Product quantity exceeds available stock.";
                    } else {
                        existingCart.setQty(newQuantity);
                        hibernateSession.merge(existingCart);
                        status = true;
                        message = "User cart updated successfully.";
                    }
                }

                transaction.commit();
            } catch (Exception e) {
                transaction.rollback();
                status = false;
                message = "Error updating cart: " + e.getMessage();
            }
        }

        responseObj.addProperty("status", status);
        responseObj.addProperty("message", message);
        return AppUtil.gson.toJson(responseObj);
    }

    // Helper method to prevent warnings
    @SuppressWarnings("unchecked")
    private <T> T getSessionAttribute(HttpSession httpSession) {
        return (T) httpSession.getAttribute("sessionCart");
    }

    // Fetch single product details
    public String getSingleProduct(int productId) {
        JsonObject responseObj = new JsonObject();
        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        Product product = hibernateSession.find(Product.class, productId);
        ProductDTO productDTO = new ProductDTO();
        productDTO.setProductId(productId);
        productDTO.setTitle(product.getTitle());
        productDTO.setAuthor(product.getAuthor());
        productDTO.setIsbn(product.getIsbn());
        productDTO.setPublisher(product.getPublisher());
        productDTO.setGenre(product.getGenre());
        productDTO.setPages(product.getPages());
        productDTO.setPublishedDate(product.getPublishedDate());
        productDTO.setLanguage(product.getLanguage());
        productDTO.setCategoryId(product.getCategory().getId());
        productDTO.setCategoryName(product.getCategory().getName());
        productDTO.setDescription(product.getDescription());

        List<StockDTO> stockDTOList = new ArrayList<>();
        for (Stock stock : product.getStocks()) {
            StockDTO stockDTO = new StockDTO();
            stockDTO.setProductId(stock.getProduct().getId());
            stockDTO.setStockId(stock.getId());
            stockDTO.setStock(stock.getQty());
            stockDTO.setPrice(stock.getPrice());
            stockDTOList.add(stockDTO);
        }
        productDTO.setStockDTOList(stockDTOList);
        productDTO.setImages(product.getImages());
        responseObj.add("singleProduct", AppUtil.gson.toJsonTree(productDTO));
        hibernateSession.close();
        return AppUtil.gson.toJson(responseObj);
    }

    //Fetch related products
    public String getRelatedProducts(int productId) {
        JsonObject responseObj = new JsonObject();

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        Product product = hibernateSession.find(Product.class, productId);

        // Fetch products from the same category
//        List<Category> categoryList = hibernateSession.createQuery("FROM Category", Category.class)
//                .setParameter("category", product.getCategory())
//                .getResultList();

        List<Product> productList = hibernateSession.createQuery(
                        "FROM Product p WHERE p.category = :category AND p.id != :id", Product.class)
                .setParameter("category", product.getCategory())
                .setParameter("id", product.getId())
                .setMaxResults(12)
                .getResultList();

        List<ProductDTO> productDTOList = new ArrayList<>();
        for (Product p : productList) {
            ProductDTO productDTO = new ProductDTO();
            productDTO.setImages(p.getImages());
            productDTO.setProductId(p.getId());
            productDTO.setTitle(p.getTitle());
            productDTO.setAuthor(p.getAuthor());

            List<StockDTO> stockDTO = new ArrayList<>();
            for (Stock stock : p.getStocks()) {
                StockDTO stockDTOItem = new StockDTO();
                stockDTOItem.setPrice(stock.getPrice());
                stockDTO.add(stockDTOItem);
            }
            productDTO.setStockDTOList(stockDTO);
            productDTOList.add(productDTO);
        }

        responseObj.add("relatedProducts", AppUtil.gson.toJsonTree(productDTOList));
        hibernateSession.close();
        return AppUtil.gson.toJson(responseObj);
    }

    //Fetch category-wise books
    public String getRomanceBooks() {
        JsonObject responseObj = new JsonObject();

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        Category category = hibernateSession.find(Category.class, 1); // Just to get the category

        List<Product> romancetList = hibernateSession.createQuery(
                        "FROM Product p WHERE p.category = :category", Product.class)
                .setParameter("category", category)
                .setMaxResults(10)
                .getResultList();

        List<ProductDTO> productDTOList = new ArrayList<>();
        for (Product p : romancetList) {
            ProductDTO productDTO = new ProductDTO();
            productDTO.setImages(p.getImages());
            productDTO.setProductId(p.getId());
            productDTO.setTitle(p.getTitle());
            productDTO.setDescription(p.getDescription());
            productDTO.setAuthor(p.getAuthor());

            List<StockDTO> stockDTO = new ArrayList<>();
            for (Stock stock : p.getStocks()) {
                StockDTO stockDTOItem = new StockDTO();
                stockDTOItem.setPrice(stock.getPrice());
                stockDTOItem.setStock(stock.getQty());
                stockDTO.add(stockDTOItem);
            }
            productDTO.setStockDTOList(stockDTO);
            productDTOList.add(productDTO);
        }

        responseObj.add("romanceBooks", AppUtil.gson.toJsonTree(productDTOList));
        hibernateSession.close();
        return AppUtil.gson.toJson(responseObj);
    }

    public String getMysteryBooks() {
        JsonObject responseObj = new JsonObject();

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        Category category = hibernateSession.find(Category.class, 3); // Just to get the fiction category

        List<Product> fictionList = hibernateSession.createQuery("FROM Product p WHERE p.category = :category", Product.class)
                .setParameter("category", category)
                .setMaxResults(12)
                .getResultList();

        List<ProductDTO> productDTOList = new ArrayList<>();
        for (Product p : fictionList) {
            ProductDTO productDTO = new ProductDTO();
            productDTO.setImages(p.getImages());
            productDTO.setProductId(p.getId());
            productDTO.setTitle(p.getTitle());
            productDTO.setDescription(p.getDescription());
            productDTO.setAuthor(p.getAuthor());

            List<StockDTO> stockDTO = new ArrayList<>();
            for (Stock stock : p.getStocks()) {
                StockDTO stockDTOItem = new StockDTO();
                stockDTOItem.setPrice(stock.getPrice());
                stockDTOItem.setStock(stock.getQty());
                stockDTO.add(stockDTOItem);
            }
            productDTO.setStockDTOList(stockDTO);
            productDTOList.add(productDTO);
        }

        responseObj.add("mysteryBooks", AppUtil.gson.toJsonTree(productDTOList));
        hibernateSession.close();
        return AppUtil.gson.toJson(responseObj);
    }

    public String getFictionBooks() {
        JsonObject responseObj = new JsonObject();

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        Category category = hibernateSession.find(Category.class, 2); // Just to get the fiction category

        List<Product> fictionList = hibernateSession.createQuery("FROM Product p WHERE p.category = :category", Product.class)
                .setParameter("category", category)
                .setMaxResults(12)
                .getResultList();

        List<ProductDTO> productDTOList = new ArrayList<>();
        for (Product p : fictionList) {
            ProductDTO productDTO = new ProductDTO();
            productDTO.setImages(p.getImages());
            productDTO.setProductId(p.getId());
            productDTO.setTitle(p.getTitle());
            productDTO.setDescription(p.getDescription());
            productDTO.setAuthor(p.getAuthor());

            List<StockDTO> stockDTO = new ArrayList<>();
            for (Stock stock : p.getStocks()) {
                StockDTO stockDTOItem = new StockDTO();
                stockDTOItem.setPrice(stock.getPrice());
                stockDTOItem.setStock(stock.getQty());
                stockDTO.add(stockDTOItem);
            }
            productDTO.setStockDTOList(stockDTO);
            productDTOList.add(productDTO);
        }

        responseObj.add("fictionBooks", AppUtil.gson.toJsonTree(productDTOList));
        hibernateSession.close();
        return AppUtil.gson.toJson(responseObj);
    }

    public String getScienceFictionBooks() {
        JsonObject responseObj = new JsonObject();

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        Category category = hibernateSession.find(Category.class, 4); // Just to get the science category

        List<Product> scienceList = hibernateSession.createQuery("FROM Product p WHERE p.category = :category", Product.class)
                .setParameter("category", category)
                .setMaxResults(12)
                .getResultList();

        List<ProductDTO> productDTOList = new ArrayList<>();
        for (Product p : scienceList) {
            ProductDTO productDTO = new ProductDTO();
            productDTO.setImages(p.getImages());
            productDTO.setProductId(p.getId());
            productDTO.setTitle(p.getTitle());
            productDTO.setDescription(p.getDescription());
            productDTO.setAuthor(p.getAuthor());

            List<StockDTO> stockDTO = new ArrayList<>();
            for (Stock stock : p.getStocks()) {
                StockDTO stockDTOItem = new StockDTO();
                stockDTOItem.setPrice(stock.getPrice());
                stockDTOItem.setStock(stock.getQty());
                stockDTO.add(stockDTOItem);
            }
            productDTO.setStockDTOList(stockDTO);
            productDTOList.add(productDTO);
        }

        responseObj.add("scienceFictionBooks", AppUtil.gson.toJsonTree(productDTOList));
        hibernateSession.close();
        return AppUtil.gson.toJson(responseObj);
    }

    public String getBiographyBooks() {
        JsonObject responseObj = new JsonObject();

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        Category category = hibernateSession.find(Category.class, 5); // Just to get the biography category

        List<Product> biographyList = hibernateSession.createQuery("FROM Product p WHERE p.category = :category", Product.class)
                .setParameter("category", category)
                .setMaxResults(12)
                .getResultList();

        List<ProductDTO> productDTOList = new ArrayList<>();
        for (Product p : biographyList) {
            ProductDTO productDTO = new ProductDTO();
            productDTO.setImages(p.getImages());
            productDTO.setProductId(p.getId());
            productDTO.setTitle(p.getTitle());
            productDTO.setDescription(p.getDescription());
            productDTO.setAuthor(p.getAuthor());

            List<StockDTO> stockDTO = new ArrayList<>();
            for (Stock stock : p.getStocks()) {
                StockDTO stockDTOItem = new StockDTO();
                stockDTOItem.setPrice(stock.getPrice());
                stockDTOItem.setStock(stock.getQty());
                stockDTO.add(stockDTOItem);
            }
            productDTO.setStockDTOList(stockDTO);
            productDTOList.add(productDTO);
        }

        responseObj.add("biographyBooks", AppUtil.gson.toJsonTree(productDTOList));
        hibernateSession.close();
        return AppUtil.gson.toJson(responseObj);
    }

    public String getBusinessBooks() {
        JsonObject responseObj = new JsonObject();

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        Category category = hibernateSession.find(Category.class, 6); // Just to get the business category

        List<Product> businessList = hibernateSession.createQuery("FROM Product p WHERE p.category = :category", Product.class)
                .setParameter("category", category)
                .setMaxResults(12)
                .getResultList();

        List<ProductDTO> productDTOList = new ArrayList<>();
        for (Product p : businessList) {
            ProductDTO productDTO = new ProductDTO();
            productDTO.setImages(p.getImages());
            productDTO.setProductId(p.getId());
            productDTO.setTitle(p.getTitle());
            productDTO.setDescription(p.getDescription());
            productDTO.setAuthor(p.getAuthor());

            List<StockDTO> stockDTO = new ArrayList<>();
            for (Stock stock : p.getStocks()) {
                StockDTO stockDTOItem = new StockDTO();
                stockDTOItem.setPrice(stock.getPrice());
                stockDTOItem.setStock(stock.getQty());
                stockDTO.add(stockDTOItem);
            }
            productDTO.setStockDTOList(stockDTO);
            productDTOList.add(productDTO);
        }

        responseObj.add("businessBooks", AppUtil.gson.toJsonTree(productDTOList));
        hibernateSession.close();
        return AppUtil.gson.toJson(responseObj);
    }

    public String getSelfHelpBooks() {
        JsonObject responseObj = new JsonObject();

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        Category category = hibernateSession.find(Category.class, 7); // Just to get the self-help category

        List<Product> selfHelpList = hibernateSession.createQuery("FROM Product p WHERE p.category = :category", Product.class)
                .setParameter("category", category)
                .setMaxResults(12)
                .getResultList();

        List<ProductDTO> productDTOList = new ArrayList<>();
        for (Product p : selfHelpList) {
            ProductDTO productDTO = new ProductDTO();
            productDTO.setImages(p.getImages());
            productDTO.setProductId(p.getId());
            productDTO.setTitle(p.getTitle());
            productDTO.setDescription(p.getDescription());
            productDTO.setAuthor(p.getAuthor());

            List<StockDTO> stockDTO = new ArrayList<>();
            for (Stock stock : p.getStocks()) {
                StockDTO stockDTOItem = new StockDTO();
                stockDTOItem.setPrice(stock.getPrice());
                stockDTOItem.setStock(stock.getQty());
                stockDTO.add(stockDTOItem);
            }
            productDTO.setStockDTOList(stockDTO);
            productDTOList.add(productDTO);
        }

        responseObj.add("selfHelpBooks", AppUtil.gson.toJsonTree(productDTOList));
        hibernateSession.close();
        return AppUtil.gson.toJson(responseObj);
    }

    public String getChildrenBooks() {
        JsonObject responseObj = new JsonObject();

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        Category category = hibernateSession.find(Category.class, 8); // Just to get the children category

        List<Product> childrenList = hibernateSession.createQuery("FROM Product p WHERE p.category = :category", Product.class)
                .setParameter("category", category)
                .setMaxResults(12)
                .getResultList();

        List<ProductDTO> productDTOList = new ArrayList<>();
        for (Product p : childrenList) {
            ProductDTO productDTO = new ProductDTO();
            productDTO.setImages(p.getImages());
            productDTO.setProductId(p.getId());
            productDTO.setTitle(p.getTitle());
            productDTO.setDescription(p.getDescription());
            productDTO.setAuthor(p.getAuthor());

            List<StockDTO> stockDTO = new ArrayList<>();
            for (Stock stock : p.getStocks()) {
                StockDTO stockDTOItem = new StockDTO();
                stockDTOItem.setPrice(stock.getPrice());
                stockDTOItem.setStock(stock.getQty());
                stockDTO.add(stockDTOItem);
            }
            productDTO.setStockDTOList(stockDTO);
            productDTOList.add(productDTO);
        }

        responseObj.add("childrenBooks", AppUtil.gson.toJsonTree(productDTOList));
        hibernateSession.close();
        return AppUtil.gson.toJson(responseObj);
    }
}
