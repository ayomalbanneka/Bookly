package lk.cypher.bookliy.services.admin;

import com.google.gson.JsonObject;
import jakarta.ws.rs.core.Context;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lk.cypher.bookliy.entity.Category;
import lk.cypher.bookliy.util.AppUtil;
import lk.cypher.bookliy.util.HibernateUtil;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;

public class AdminCategoryServices {

    public String saveCategory(String name, String description, @Context HttpServletRequest request) {
        JsonObject responseObj = new JsonObject();
        boolean status = false;
        String message = "";

        if (name == null || name.isBlank()) {
            message = "Category name is required.";
        } else {
            HttpSession httpSession = request.getSession(false);
            if (httpSession == null || httpSession.getAttribute("admin") == null) {
                message = "Session is invalid. Please login again.";
            } else {
                Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
                try {
                    Category existing = hibernateSession.createQuery("FROM Category c WHERE lower(c.name)=:name", Category.class)
                            .setParameter("name", name.trim().toLowerCase())
                            .getSingleResultOrNull();
                    if (existing != null) {
                        message = "Category already exists.";
                    } else {
                        Transaction transaction = hibernateSession.beginTransaction();
                        Category category = new Category();
                        category.setName(name.trim());
                        hibernateSession.persist(category);
                        transaction.commit();
                        status = true;
                        message = "Category added successfully.";
                    }
                } catch (HibernateException e) {
                    message = "Failed to save category. Please try again.";
                    e.printStackTrace();
                } finally {
                    hibernateSession.close();
                }
            }
        }

        responseObj.addProperty("status", status);
        responseObj.addProperty("message", message);
        return AppUtil.gson.toJson(responseObj);
    }

    public String updateCategory(int categoryId, String name, @Context HttpServletRequest request) {
        JsonObject responseObj = new JsonObject();
        boolean status = false;
        String message = "";

        if (categoryId <= 0) {
            message = "Invalid category Id.";
        } else if (name == null || name.isBlank()) {
            message = "Category name is required.";
        } else {
            HttpSession httpSession = request.getSession(false);
            if (httpSession == null || httpSession.getAttribute("admin") == null) {
                message = "Session is invalid. Please login again.";
            } else {
                Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
                Transaction transaction = hibernateSession.beginTransaction();
                try {
                    Category category = hibernateSession.find(Category.class, categoryId);
                    if (category == null) {
                        message = "Category not found.";
                    } else {
                        Category existing = hibernateSession.createQuery("FROM Category c WHERE lower(c.name)=:name AND c.id<>:id", Category.class)
                                .setParameter("name", name.trim().toLowerCase())
                                .setParameter("id", categoryId)
                                .getSingleResultOrNull();
                        if (existing != null) {
                            message = "Category name already exists.";
                        } else {
                            category.setName(name.trim());
                            hibernateSession.merge(category);
                            transaction.commit();
                            status = true;
                            message = "Category updated successfully.";
                        }
                    }
                } catch (HibernateException e) {
                    transaction.rollback();
                    message = "Failed to update category. Please try again.";
                    e.printStackTrace();
                } finally {
                    hibernateSession.close();
                }
            }
        }

        responseObj.addProperty("status", status);
        responseObj.addProperty("message", message);
        return AppUtil.gson.toJson(responseObj);
    }

    public String deleteCategory(int categoryId, @Context HttpServletRequest request) {
        JsonObject responseObj = new JsonObject();
        boolean status = false;
        String message = "";

        if (categoryId <= 0) {
            message = "Invalid category Id.";
        } else {
            HttpSession httpSession = request.getSession(false);
            if (httpSession == null || httpSession.getAttribute("admin") == null) {
                message = "Session is invalid. Please login again.";
            } else {
                Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
                Transaction transaction = hibernateSession.beginTransaction();
                try {
                    Category category = hibernateSession.find(Category.class, categoryId);
                    if (category == null) {
                        message = "Category not found.";
                    } else {
                        Long productCount = hibernateSession.createQuery("SELECT COUNT(p) FROM Product p WHERE p.category=:category", Long.class)
                                .setParameter("category", category)
                                .getSingleResult();
                        if (productCount != null && productCount > 0) {
                            message = "Cannot delete category with products.";
                        } else {
                            hibernateSession.remove(category);
                            transaction.commit();
                            status = true;
                            message = "Category deleted successfully.";
                        }
                    }
                } catch (HibernateException e) {
                    transaction.rollback();
                    message = "Failed to delete category. Please try again.";
                    e.printStackTrace();
                } finally {
                    hibernateSession.close();
                }
            }
        }

        responseObj.addProperty("status", status);
        responseObj.addProperty("message", message);
        return AppUtil.gson.toJson(responseObj);
    }
}
