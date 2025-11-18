package lk.cypher.bookliy.middleware;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

public class AuthAccessFilter implements Filter {
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        HttpSession httpSession = request.getSession(false);

        if (httpSession != null && httpSession.getAttribute("user") != null) { // User is authenticated
            response.sendRedirect("index.html"); // Redirect to home page
//            System.out.println(httpSession.getAttribute("user"));
        } else {
            response.setHeader("Cache-Control", " no-cache, no-store, revalidate"); // HTTP 1.1.
            response.setHeader("Pragma", "no-cache"); // HTTP 1.0.
            response.setDateHeader("Expires", 0); // Proxies.
            filterChain.doFilter(servletRequest, servletResponse);  // Proceed to requested resource

        }
    }
}


