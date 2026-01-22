# Bookliy 📚

A modern, full-featured e-commerce web application for an online bookstore built with Java Enterprise Edition technologies.

[![Version](https://img.shields.io/badge/version-1.0-blue.svg)](https://github.com/ayomalbanneka/Bookly)
[![Java](https://img.shields.io/badge/Java-25-orange.svg)](https://www.oracle.com/java/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [License](#license)

## 🌟 Overview

**Bookliy** is a comprehensive online bookstore platform that provides a seamless shopping experience for book lovers. The application features a modern user interface, secure authentication, shopping cart functionality, order management, and an admin panel for managing the entire e-commerce ecosystem.

### Key Highlights

- 🛒 Complete e-commerce functionality with cart and checkout
- 👤 User authentication and account management
- 📦 Order tracking and management
- 👨‍💼 Comprehensive admin panel for inventory and order management
- 📧 Email notifications with template support
- 💳 Payment integration with PayHere
- 📱 Responsive design for all devices
- 🔒 Secure session management and validation

## ✨ Features

### User Features

- **User Authentication**: Sign up, sign in, and account verification
- **Product Browsing**: Browse books by categories (Fiction, Romance, Mystery, Sci-Fi, Biography, Business, Self-Help, Children)
- **Shopping Cart**: Add, update, and remove items from cart
- **Checkout Process**: Secure checkout with address management
- **Order Management**: View order history and track pending orders
- **Account Management**: Update profile information and manage addresses
- **Invoice Generation**: Automatic invoice generation for completed orders

### Admin Features

- **Dashboard**: Overview of orders, users, and products
- **Product Management**: Add, edit, and manage book inventory
- **Order Management**: View and process customer orders
- **User Management**: View and manage registered users
- **Category Management**: Organize products by categories
- **Analytics**: Track pending orders and sales data

## 🛠 Technology Stack

### Backend

- **Java 25**: Core programming language
- **Jakarta Servlet 6.1**: Web application framework
- **Jersey 3.1**: JAX-RS implementation for RESTful APIs
- **Hibernate 7.1.5**: ORM framework for database operations
- **Embedded Tomcat 11.0**: Application server

### Frontend

- **HTML5/CSS3**: Markup and styling
- **JavaScript**: Client-side functionality
- **Bootstrap**: Responsive UI framework
- **DataTables**: Interactive data tables in admin panel

### Database

- **MySQL**: Primary database for persistent storage
- **Hibernate Validator**: Bean validation

### Additional Libraries

- **Gson 2.10.1**: JSON processing
- **Angus Mail 2.0.3**: Email functionality
- **Email Template Builder 2.5.0**: HTML email templates
- **Commons IO 2.16.1**: File upload/download utilities
- **Jersey Multipart**: File upload support

### Build Tools

- **Maven**: Dependency management and build automation

## 📁 Project Structure

```
Bookliy/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   ├── Main.java                 # Application entry point
│   │   │   └── lk/cypher/bookliy/
│   │   │       ├── annotation/           # Custom annotations
│   │   │       ├── config/               # Application configuration
│   │   │       ├── controller/           # REST API controllers
│   │   │       ├── dto/                  # Data Transfer Objects
│   │   │       ├── entity/               # JPA entities
│   │   │       ├── listener/             # Application listeners
│   │   │       ├── mail/                 # Email services
│   │   │       ├── middleware/           # Request/response filters
│   │   │       ├── provider/             # JAX-RS providers
│   │   │       ├── services/             # Business logic services
│   │   │       ├── util/                 # Utility classes
│   │   │       └── validation/           # Validation logic
│   │   ├── resources/
│   │   │   ├── app.properties            # Application properties
│   │   │   └── hibernate.cfg.xml         # Hibernate configuration
│   │   └── webapp/
│   │       ├── *.html                    # HTML pages
│   │       ├── assets/                   # Static assets (CSS, JS, images)
│   │       ├── uploads/                  # User uploaded files
│   │       └── WEB-INF/
│   │           └── web.xml               # Web application descriptor
│   └── test/
│       └── java/                         # Test classes
├── pom.xml                               # Maven configuration
├── CHANGELOG.md                          # Version history
└── README.md                             # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK) 25** or higher
- **Maven 3.8+** for dependency management
- **MySQL 8.0+** for the database
- **Git** for version control
- An IDE such as IntelliJ IDEA, Eclipse, or VS Code

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ayomalbanneka/Bookly.git
cd Bookliy
```

### 2. Set Up the Database

Create a MySQL database:

```sql
CREATE DATABASE bookliy;
```

The application will automatically create the necessary tables on first run using Hibernate's `hbm2ddl.auto=update` feature.

### 3. Install Dependencies

```bash
mvn clean install
```

This will download all required dependencies specified in `pom.xml`.

## ⚙️ Configuration

### Database Configuration

Update `src/main/resources/hibernate.cfg.xml` with your MySQL credentials:

```xml
<property name="hibernate.connection.url">jdbc:mysql://localhost:3306/bookliy?useSSL=false&amp;allowPublicKeyRetrieval=true</property>
<property name="hibernate.connection.username">your_username</property>
<property name="hibernate.connection.password">your_password</property>
```

### Application Configuration

Update `src/main/resources/app.properties`:

```properties
# Email Configuration
mail.host=smtp.gmail.com
mail.port=587
mail.username=your_email@gmail.com
mail.password=your_app_password
mail.from=bookly@info.com
mail.from.name=Bookly Team

# Application Settings
app.name=Bookly
app.url=http://localhost:8080/bookly
app.public.url=http://localhost:8080/bookly

# PayHere Configuration
payHere.merchant.id=your_merchant_id
payHere.merchant.secret=your_merchant_secret
```

**Note**: For Gmail, you need to generate an [App Password](https://support.google.com/accounts/answer/185833) instead of using your regular password.

### Port Configuration

The default port is `8080`. To change it, modify the `PORT` constant in `Main.java`:

```java
private static final int PORT = 8080; // Change to your desired port
```

## 🏃‍♂️ Running the Application

### Option 1: Using Maven

```bash
mvn clean package
java -cp target/Bookliy.war Main
```

### Option 2: Using IDE

1. Open the project in your IDE
2. Run the `Main.java` class
3. The application will start on `http://localhost:8080/bookly`

### Option 3: Using Command Line

```bash
mvn clean compile
mvn exec:java -Dexec.mainClass="Main"
```

### Access the Application

Once running, access the application at:

- **Homepage**: http://localhost:8080/bookly
- **Admin Panel**: http://localhost:8080/bookly/admin-panel.html
- **API Base URL**: http://localhost:8080/bookly/api

## 📚 API Documentation

The application exposes RESTful APIs under `/api/*`. Here are some key endpoints:

### Authentication APIs
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/verify` - Account verification
- `GET /api/auth/logout` - User logout

### Product APIs
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/category/{category}` - Get products by category

### Cart APIs
- `POST /api/cart/add` - Add item to cart
- `GET /api/cart` - Get cart items
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/{id}` - Remove item from cart

### Order APIs
- `POST /api/orders/place` - Place an order
- `GET /api/orders` - Get user orders
- `GET /api/orders/{id}` - Get order details

### Admin APIs
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/orders` - All orders
- `GET /api/admin/users` - All users
- `POST /api/admin/products` - Add new product
- `PUT /api/admin/products/{id}` - Update product

## 🗄️ Database Schema

### Main Entities

- **User**: Customer accounts with authentication
- **Admin**: Administrator accounts
- **Product**: Book inventory and details
- **Category**: Product categorization
- **Cart**: Shopping cart items
- **Order**: Customer orders
- **OrderItem**: Individual items in an order
- **Address**: User delivery addresses
- **City & District**: Location data
- **Stock**: Product inventory levels
- **Status**: Order status tracking
- **Discount**: Promotional discounts
- **DeliveryType**: Shipping methods

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed version history.

### Latest Version: 1.2.0 (2026-01-22)

#### New Features
- Add endpoint to load all users in admin panel
- Add endpoint to retrieve current logged-in admin details
- Dynamic user counts and admin name display in admin panel
- Status field in UserDTO for user management

See the [CHANGELOG.md](CHANGELOG.md) for complete version history.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Ayomal Banneka** - *Initial work* - [GitHub](https://github.com/ayomalbanneka)

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Inspired by modern e-commerce best practices
- Built as part of Web Development II coursework at Java Institute

## 📞 Support

For support, email ayomalkaushalya@gmail.com or create an issue in the GitHub repository.

## 🔮 Roadmap

- [ ] Add payment gateway integration beyond PayHere
- [ ] Implement advanced search and filtering
- [ ] Add product reviews and ratings
- [ ] Implement wishlist functionality
- [ ] Add real-time inventory tracking
- [ ] Mobile application development
- [ ] Multi-language support
- [ ] Enhanced analytics and reporting

---

**Made ❤️ by Ayomal Banneka**
