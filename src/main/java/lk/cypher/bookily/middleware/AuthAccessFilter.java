package lk.cypher.bookily.middleware;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

public class AuthAccessFilter implements Filter {
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        HttpServletRequest request = (HttpServletRequest) servletRequest;

        HttpSession httpSession = request.getSession();
        if (httpSession != null && httpSession.getAttribute("user") != null) { // User is authenticated
            response.sendRedirect("index.html");
        } else {
            filterChain.doFilter(servletRequest, servletResponse);
            response.setHeader("Cache-Control", " no-cache, no-store, revalidate"); // HTTP 1.1.
            response.setHeader("Pragma", "no-cache"); // HTTP 1.0.
            response.setDateHeader("Expires", 0); // Proxies.
        }
    }
}

