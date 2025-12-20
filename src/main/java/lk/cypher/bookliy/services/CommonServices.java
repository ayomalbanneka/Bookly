package lk.cypher.bookliy.services;

import com.google.gson.JsonObject;
import lk.cypher.bookliy.dto.ProductDTO;
import lk.cypher.bookliy.dto.StockDTO;
import lk.cypher.bookliy.entity.Category;
import lk.cypher.bookliy.entity.Product;
import lk.cypher.bookliy.entity.Stock;
import lk.cypher.bookliy.util.AppUtil;
import lk.cypher.bookliy.util.HibernateUtil;
import org.hibernate.Session;

import java.util.ArrayList;
import java.util.List;

public class CommonServices {
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
