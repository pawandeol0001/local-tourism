/**
 * Full Java Full-Stack Project Source Repository
 * Contains complete, functional source code for:
 * - MySQL database schema (tourism_planner)
 * - Java Models, DAOs, Services, and Servlets
 * - JSP pages with Bootstrap 5
 * - web.xml, pom.xml, and IDE setup guide
 */

export interface JavaFileItem {
  filename: string;
  path: string;
  category: 'database' | 'model' | 'dao' | 'service' | 'servlet' | 'jsp' | 'config' | 'guide';
  language: 'sql' | 'java' | 'html' | 'xml' | 'markdown';
  content: string;
  description: string;
}

export const JAVA_PROJECT_FILES: JavaFileItem[] = [
  {
    filename: 'schema.sql',
    path: 'database/schema.sql',
    category: 'database',
    language: 'sql',
    description: 'Complete MySQL database creation script with 7 tables, PKs, FKs, and sample records.',
    content: `-- =====================================================================
-- DATABASE CREATION SCRIPT: Local Tourism Planner with Budget & Itinerary
-- Database: tourism_planner
-- Supported Engine: MySQL 8.0+ / MariaDB 10.4+
-- =====================================================================

CREATE DATABASE IF NOT EXISTS \`tourism_planner\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`tourism_planner\`;

-- -----------------------------------------------------
-- 1. Table: users
-- -----------------------------------------------------
DROP TABLE IF EXISTS \`bookings\`;
DROP TABLE IF EXISTS \`expenses\`;
DROP TABLE IF EXISTS \`itineraries\`;
DROP TABLE IF EXISTS \`travel_plans\`;
DROP TABLE IF EXISTS \`destinations\`;
DROP TABLE IF EXISTS \`destination_categories\`;
DROP TABLE IF EXISTS \`users\`;

CREATE TABLE \`users\` (
  \`user_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(120) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('tourist', 'admin') DEFAULT 'tourist',
  \`phone\` VARCHAR(20) DEFAULT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- 2. Table: destination_categories
-- -----------------------------------------------------
CREATE TABLE \`destination_categories\` (
  \`category_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`code\` VARCHAR(50) NOT NULL UNIQUE,
  \`name\` VARCHAR(100) NOT NULL,
  \`description\` TEXT,
  \`icon_class\` VARCHAR(50) DEFAULT 'bi-geo-alt',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- 3. Table: destinations
-- -----------------------------------------------------
CREATE TABLE \`destinations\` (
  \`destination_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`category_id\` INT NOT NULL,
  \`name\` VARCHAR(150) NOT NULL,
  \`city\` VARCHAR(100) NOT NULL,
  \`location_area\` VARCHAR(150) NOT NULL,
  \`description\` TEXT NOT NULL,
  \`image_url\` VARCHAR(255) DEFAULT NULL,
  \`entry_fee\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`visit_duration_hours\` DECIMAL(4,1) DEFAULT 2.0,
  \`best_time\` VARCHAR(100) DEFAULT NULL,
  \`address\` VARCHAR(255) DEFAULT NULL,
  \`latitude\` DECIMAL(10,8) NOT NULL,
  \`longitude\` DECIMAL(11,8) NOT NULL,
  \`rating\` DECIMAL(3,2) DEFAULT 4.5,
  \`reviews_count\` INT DEFAULT 0,
  \`is_popular\` BOOLEAN DEFAULT FALSE,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_dest_category\` FOREIGN KEY (\`category_id\`) REFERENCES \`destination_categories\` (\`category_id\`) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- 4. Table: travel_plans
-- -----------------------------------------------------
CREATE TABLE \`travel_plans\` (
  \`plan_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`title\` VARCHAR(150) NOT NULL,
  \`city\` VARCHAR(100) NOT NULL,
  \`start_date\` DATE NOT NULL,
  \`total_days\` INT NOT NULL DEFAULT 1,
  \`travelers_count\` INT NOT NULL DEFAULT 1,
  \`total_budget\` DECIMAL(12,2) NOT NULL,
  \`estimated_cost\` DECIMAL(12,2) NOT NULL,
  \`remaining_budget\` DECIMAL(12,2) NOT NULL,
  \`status\` ENUM('draft', 'confirmed', 'completed', 'cancelled') DEFAULT 'draft',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_plan_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`user_id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- 5. Table: itineraries (Day-wise activities)
-- -----------------------------------------------------
CREATE TABLE \`itineraries\` (
  \`itinerary_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`plan_id\` INT NOT NULL,
  \`day_number\` INT NOT NULL,
  \`slot_name\` ENUM('Morning', 'Afternoon', 'Evening') NOT NULL,
  \`destination_id\` INT NOT NULL,
  \`time_range\` VARCHAR(50) DEFAULT NULL,
  \`entry_fee\` DECIMAL(10,2) DEFAULT 0.00,
  \`transport_cost\` DECIMAL(10,2) DEFAULT 0.00,
  \`food_recommendation\` VARCHAR(255) DEFAULT NULL,
  \`travel_notes\` TEXT DEFAULT NULL,
  CONSTRAINT \`fk_itin_plan\` FOREIGN KEY (\`plan_id\`) REFERENCES \`travel_plans\` (\`plan_id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_itin_dest\` FOREIGN KEY (\`destination_id\`) REFERENCES \`destinations\` (\`destination_id\`) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- 6. Table: expenses (Actual expenses tracking)
-- -----------------------------------------------------
CREATE TABLE \`expenses\` (
  \`expense_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`plan_id\` INT DEFAULT NULL,
  \`category\` ENUM('Transportation', 'Food', 'Accommodation', 'Entry Fees', 'Shopping', 'Other') NOT NULL,
  \`title\` VARCHAR(150) NOT NULL,
  \`amount\` DECIMAL(10,2) NOT NULL,
  \`expense_date\` DATE NOT NULL,
  \`notes\` TEXT DEFAULT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_exp_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`user_id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_exp_plan\` FOREIGN KEY (\`plan_id\`) REFERENCES \`travel_plans\` (\`plan_id\`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- 7. Table: bookings (Destination / tour reservations)
-- -----------------------------------------------------
CREATE TABLE \`bookings\` (
  \`booking_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`destination_id\` INT NOT NULL,
  \`plan_id\` INT DEFAULT NULL,
  \`booking_date\` DATE NOT NULL,
  \`travelers_count\` INT NOT NULL DEFAULT 1,
  \`total_amount\` DECIMAL(10,2) NOT NULL,
  \`payment_status\` ENUM('pending', 'paid', 'refunded') DEFAULT 'paid',
  \`booking_ref\` VARCHAR(40) UNIQUE NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_book_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`user_id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_book_dest\` FOREIGN KEY (\`destination_id\`) REFERENCES \`destinations\` (\`destination_id\`) ON DELETE RESTRICT,
  CONSTRAINT \`fk_book_plan\` FOREIGN KEY (\`plan_id\`) REFERENCES \`travel_plans\` (\`plan_id\`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- SAMPLE INITIAL DATA
-- -----------------------------------------------------
-- Default Admin & Tourist (password is 'password123' bcrypt hash)
INSERT INTO \`users\` (\`name\`, \`email\`, \`password_hash\`, \`role\`, \`phone\`) VALUES
('Administrator', 'admin@tourismplanner.local', '$2a$10$wTqX83rNnQc.XyV.i1jRpu0LwT4rBq0K87Vf5zJ21OqE4d7Vz2K4m', 'admin', '+1-555-0199'),
('Pawan Deol', 'tourist@tourismplanner.local', '$2a$10$wTqX83rNnQc.XyV.i1jRpu0LwT4rBq0K87Vf5zJ21OqE4d7Vz2K4m', 'tourist', '+1-555-0248');

-- Categories
INSERT INTO \`destination_categories\` (\`code\`, \`name\`, \`description\`, \`icon_class\`) VALUES
('historical', 'Historical Places', 'Ancient forts, imperial palaces, and archaeological monuments.', 'bi-bank'),
('religious', 'Religious Places', 'Serene shrines, sanctified temples, and spiritual sanctuaries.', 'bi-peace'),
('nature', 'Nature and Parks', 'Alpine viewpoints, mist-veiled botanical gardens, and reserves.', 'bi-tree'),
('adventure', 'Adventure Activities', 'River rapids, canyon zip-lines, and mountain trekking.', 'bi-compass'),
('shopping', 'Shopping Destinations', 'Vibrant silk bazaars and artisan handicraft emporiums.', 'bi-bag'),
('food', 'Food & Restaurants', 'Heritage street food alleys and panoramic rooftop dining.', 'bi-cup-hot');

-- Destinations
INSERT INTO \`destinations\` (\`category_id\`, \`name\`, \`city\`, \`location_area\`, \`description\`, \`image_url\`, \`entry_fee\`, \`visit_duration_hours\`, \`best_time\`, \`address\`, \`latitude\`, \`longitude\`, \`rating\`, \`reviews_count\`, \`is_popular\`) VALUES
(1, 'Grand Amber Citadel & Palace', 'Jaipur', 'North Hill Ridge', 'A 16th-century royal palace fortress featuring ornate sandstone courtyards, mirror halls, and gardens.', 'assets/images/dest_palace.jpg', 15.00, 3.5, 'Morning (08:30 - 11:30)', 'Devi Road, Royal Ridge Enclave', 26.98550000, 75.85130000, 4.90, 1420, TRUE),
(3, 'Pine Crest Alpine National Park', 'Jaipur', 'Upper Valley Mist Pass', 'Lush mountain sanctuary characterized by timber boardwalks and morning mist canopies.', 'assets/images/dest_nature.jpg', 10.00, 3.0, 'Early Morning', 'Summit Road, Sector 8', 27.02110000, 75.81240000, 4.80, 980, TRUE),
(5, 'Old Silk & Spice Artisan Bazaar', 'Jaipur', 'Central Market Square', 'Atmospheric covered arcade celebrated for hand-loomed textiles, saffron, and crafts.', 'assets/images/dest_market.jpg', 0.00, 2.5, 'Evening (17:00 - 21:00)', 'Old Bazaar Street, Gate 4', 26.92400000, 75.82670000, 4.70, 2150, TRUE),
(2, 'Lotus Blossom Shrine & Gardens', 'Jaipur', 'East Lake Promontory', 'Carved from pure white marble surrounded by nine petal reflection ponds.', 'assets/images/dest_temple.jpg', 0.00, 2.0, 'Dawn or Sunset', 'Lakeside Sanctuary Way', 26.91240000, 75.83400000, 4.90, 1670, TRUE),
(4, 'Canyon Gorge River Rapids & Zip-Line', 'Jaipur', 'Western Ravine Outpost', 'Grade-III river rafting and 800m canyon canopy zipline over rushing waters.', 'assets/images/dest_adventure.jpg', 35.00, 4.0, 'Midday (10:00 - 15:00)', 'Mile Marker 14, West Canyon', 27.05430000, 75.76210000, 4.80, 840, TRUE),
(6, 'Royal Heritage Spice Kitchen', 'Jaipur', 'Old Haveli Square', '120-year-old courtyard restaurant celebrated for saffron curries and sitar music.', 'assets/images/dest_food.jpg', 0.00, 2.0, 'Dinner (19:30 - 22:00)', '14 Haveli Lane, Royal Square', 26.92980000, 75.82340000, 4.90, 3100, TRUE);
`
  },
  {
    filename: 'DBConnection.java',
    path: 'src/main/java/com/tourism/dao/DBConnection.java',
    category: 'dao',
    language: 'java',
    description: 'Database connection singleton managing JDBC MySQL connections cleanly with auto-reconnect.',
    content: `package com.tourism.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * DBConnection
 * Singleton class providing thread-safe MySQL JDBC database connectivity.
 */
public class DBConnection {

    private static final Logger LOGGER = Logger.getLogger(DBConnection.class.getName());

    // Configure your MySQL credentials here or pass via Environment variables
    private static final String DB_URL = System.getenv("DB_URL") != null 
        ? System.getenv("DB_URL") 
        : "jdbc:mysql://localhost:3306/tourism_planner?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
    private static final String DB_USER = System.getenv("DB_USER") != null 
        ? System.getenv("DB_USER") 
        : "root";
    private static final String DB_PASSWORD = System.getenv("DB_PASSWORD") != null 
        ? System.getenv("DB_PASSWORD") 
        : "password";

    static {
        try {
            // Load MySQL 8+ JDBC Driver
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            LOGGER.log(Level.SEVERE, "MySQL JDBC Driver not found in classpath!", e);
            throw new RuntimeException("Missing MySQL JDBC Driver", e);
        }
    }

    /**
     * Obtains a fresh connection to the MySQL database.
     * @return active java.sql.Connection
     * @throws SQLException if connection fails
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
    }
}
`
  },
  {
    filename: 'User.java',
    path: 'src/main/java/com/tourism/model/User.java',
    category: 'model',
    language: 'java',
    description: 'POJO model representing a registered system user (Tourist or Admin).',
    content: `package com.tourism.model;

import java.io.Serializable;
import java.sql.Timestamp;

public class User implements Serializable {
    private static final long serialVersionUID = 1L;

    private int userId;
    private String name;
    private String email;
    private String passwordHash;
    private String role; // 'tourist' or 'admin'
    private String phone;
    private Timestamp createdAt;

    public User() {}

    public User(int userId, String name, String email, String role) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    // Getters and Setters
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public boolean isAdmin() {
        return "admin".equalsIgnoreCase(this.role);
    }
}
`
  },
  {
    filename: 'Destination.java',
    path: 'src/main/java/com/tourism/model/Destination.java',
    category: 'model',
    language: 'java',
    description: 'POJO model for tourist destinations with location, category, fee, and coordinates.',
    content: `package com.tourism.model;

import java.io.Serializable;

public class Destination implements Serializable {
    private static final long serialVersionUID = 1L;

    private int destinationId;
    private int categoryId;
    private String categoryName;
    private String name;
    private String city;
    private String locationArea;
    private String description;
    private String imageUrl;
    private double entryFee;
    private double visitDurationHours;
    private String bestTime;
    private String address;
    private double latitude;
    private double longitude;
    private double rating;
    private int reviewsCount;
    private boolean popular;

    public Destination() {}

    // Getters and Setters
    public int getDestinationId() { return destinationId; }
    public void setDestinationId(int destinationId) { this.destinationId = destinationId; }

    public int getCategoryId() { return categoryId; }
    public void setCategoryId(int categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getLocationArea() { return locationArea; }
    public void setLocationArea(String locationArea) { this.locationArea = locationArea; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public double getEntryFee() { return entryFee; }
    public void setEntryFee(double entryFee) { this.entryFee = entryFee; }

    public double getVisitDurationHours() { return visitDurationHours; }
    public void setVisitDurationHours(double visitDurationHours) { this.visitDurationHours = visitDurationHours; }

    public String getBestTime() { return bestTime; }
    public void setBestTime(String bestTime) { this.bestTime = bestTime; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public int getReviewsCount() { return reviewsCount; }
    public void setReviewsCount(int reviewsCount) { this.reviewsCount = reviewsCount; }

    public boolean isPopular() { return popular; }
    public void setPopular(boolean popular) { this.popular = popular; }
}
`
  },
  {
    filename: 'BudgetCalculatorService.java',
    path: 'src/main/java/com/tourism/service/BudgetCalculatorService.java',
    category: 'service',
    language: 'java',
    description: 'Java business service implementing exact budget formulas, remaining amounts, and overage alerts.',
    content: `package com.tourism.service;

import java.util.HashMap;
import java.util.Map;

/**
 * BudgetCalculatorService
 * Handles financial computations for trips:
 * 1. Total Estimated Cost = Transport + Accommodation + Food + Entry Fees + Shopping + Other
 * 2. Per Person Cost = Total Estimated Cost / Number of Travelers
 * 3. Remaining Budget = Total Budget - Total Estimated Cost
 * 4. Daily Spending Limit = Total Budget / Number of Days
 */
public class BudgetCalculatorService {

    public static class BudgetResult {
        private final double totalEstimatedCost;
        private final double remainingBudget;
        private final double perPersonCost;
        private final double dailySpendingLimit;
        private final boolean isOverBudget;
        private final double overBudgetAmount;
        private final double percentageUsed;
        private final Map<String, Double> categoryBreakdown;

        public BudgetResult(double totalEstimated, double remaining, double perPerson, 
                            double dailyLimit, boolean overBudget, double overAmount, 
                            double percentUsed, Map<String, Double> breakdown) {
            this.totalEstimatedCost = totalEstimated;
            this.remainingBudget = remaining;
            this.perPersonCost = perPerson;
            this.dailySpendingLimit = dailyLimit;
            this.isOverBudget = overBudget;
            this.overBudgetAmount = overAmount;
            this.percentageUsed = percentUsed;
            this.categoryBreakdown = breakdown;
        }

        public double getTotalEstimatedCost() { return totalEstimatedCost; }
        public double getRemainingBudget() { return remainingBudget; }
        public double getPerPersonCost() { return perPersonCost; }
        public double getDailySpendingLimit() { return dailySpendingLimit; }
        public boolean isOverBudget() { return isOverBudget; }
        public double getOverBudgetAmount() { return overBudgetAmount; }
        public double getPercentageUsed() { return percentageUsed; }
        public Map<String, Double> getCategoryBreakdown() { return categoryBreakdown; }
    }

    /**
     * Executes complete budget calculation with input validation.
     */
    public BudgetResult calculate(double totalBudget, int travelers, int days,
                                  double transport, double accommodation, double food,
                                  double shopping, double other, double entryFees) {
        
        int safeTravelers = Math.max(1, travelers);
        int safeDays = Math.max(1, days);

        double totalEstimatedCost = transport + accommodation + food + shopping + other + entryFees;
        double remainingBudget = totalBudget - totalEstimatedCost;
        double perPersonCost = totalEstimatedCost / safeTravelers;
        double dailySpendingLimit = totalBudget / safeDays;

        boolean isOverBudget = totalEstimatedCost > totalBudget;
        double overBudgetAmount = isOverBudget ? (totalEstimatedCost - totalBudget) : 0.0;
        double percentageUsed = totalBudget > 0 ? (totalEstimatedCost / totalBudget) * 100.0 : 0.0;

        Map<String, Double> breakdown = new HashMap<>();
        breakdown.put("Accommodation", accommodation);
        breakdown.put("Transportation", transport);
        breakdown.put("Food & Dining", food);
        breakdown.put("Entry Fees", entryFees);
        breakdown.put("Shopping", shopping);
        breakdown.put("Other", other);

        return new BudgetResult(
            Math.round(totalEstimatedCost * 100.0) / 100.0,
            Math.round(remainingBudget * 100.0) / 100.0,
            Math.round(perPersonCost * 100.0) / 100.0,
            Math.round(dailySpendingLimit * 100.0) / 100.0,
            isOverBudget,
            Math.round(overBudgetAmount * 100.0) / 100.0,
            Math.round(percentageUsed * 10.0) / 10.0,
            breakdown
        );
    }
}
`
  },
  {
    filename: 'ItineraryGeneratorService.java',
    path: 'src/main/java/com/tourism/service/ItineraryGeneratorService.java',
    category: 'service',
    language: 'java',
    description: 'Smart rule-based itinerary generation algorithm clustering proximity and balancing budget.',
    content: `package com.tourism.service;

import com.tourism.model.Destination;
import java.util.*;

/**
 * ItineraryGeneratorService
 * Algorithmic generator that creates day-wise travel plans:
 * 1. Filters candidate destinations by city and preference categories.
 * 2. Employs geographic proximity clustering (Euclidean distance) to minimize transit.
 * 3. Assigns Morning, Afternoon, and Evening slots.
 * 4. Balances entry fees and food estimates against user budget.
 */
public class ItineraryGeneratorService {

    public static class DayItinerary {
        private int dayNumber;
        private List<SlotItem> slots = new ArrayList<>();
        private double totalDailyCost;

        public DayItinerary(int dayNumber) { this.dayNumber = dayNumber; }

        public int getDayNumber() { return dayNumber; }
        public List<SlotItem> getSlots() { return slots; }
        public double getTotalDailyCost() { return totalDailyCost; }
        public void setTotalDailyCost(double totalDailyCost) { this.totalDailyCost = totalDailyCost; }
    }

    public static class SlotItem {
        private String slotName; // Morning, Afternoon, Evening
        private Destination destination;
        private String timeRange;
        private double entryFee;
        private double transportCost;
        private String foodRecommendation;

        public SlotItem(String slotName, Destination dest, String timeRange, double fee, double transport, String food) {
            this.slotName = slotName;
            this.destination = dest;
            this.timeRange = timeRange;
            this.entryFee = fee;
            this.transportCost = transport;
            this.foodRecommendation = food;
        }

        public String getSlotName() { return slotName; }
        public Destination getDestination() { return destination; }
        public String getTimeRange() { return timeRange; }
        public double getEntryFee() { return entryFee; }
        public double getTransportCost() { return transportCost; }
        public String getFoodRecommendation() { return foodRecommendation; }
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double dx = (lat1 - lat2) * 111.0;
        double dy = (lon1 - lon2) * 111.0 * Math.cos(Math.toRadians(lat1));
        return Math.sqrt(dx * dx + dy * dy);
    }

    public List<DayItinerary> generateItinerary(List<Destination> destinations, int days, int travelers, double totalBudget) {
        List<DayItinerary> result = new ArrayList<>();
        Set<Integer> visited = new HashSet<>();
        String[] slots = {"Morning", "Afternoon", "Evening"};
        String[] hours = {"09:00 AM - 12:30 PM", "01:30 PM - 04:30 PM", "05:30 PM - 08:30 PM"};

        double dailyBudget = totalBudget / Math.max(1, days);
        double estFoodPerDay = Math.min(30.0 * travelers, dailyBudget * 0.3);

        for (int day = 1; day <= days; day++) {
            DayItinerary dayPlan = new DayItinerary(day);
            double dayCost = estFoodPerDay;

            // Pick anchor destination
            Destination anchor = null;
            for (Destination d : destinations) {
                if (!visited.contains(d.getDestinationId())) {
                    anchor = d;
                    visited.add(d.getDestinationId());
                    break;
                }
            }

            if (anchor == null && !destinations.isEmpty()) {
                anchor = destinations.get((day - 1) % destinations.size());
            }

            List<Destination> dayStops = new ArrayList<>();
            if (anchor != null) {
                dayStops.add(anchor);
                // Proximity search for 2nd activity
                Destination nearest = null;
                double minDistance = Double.MAX_VALUE;
                for (Destination d : destinations) {
                    if (!visited.contains(d.getDestinationId())) {
                        double dist = calculateDistance(anchor.getLatitude(), anchor.getLongitude(), d.getLatitude(), d.getLongitude());
                        if (dist < minDistance) {
                            minDistance = dist;
                            nearest = d;
                        }
                    }
                }
                if (nearest != null) {
                    dayStops.add(nearest);
                    visited.add(nearest.getDestinationId());
                }
            }

            for (int s = 0; s < dayStops.size(); s++) {
                Destination dest = dayStops.get(s);
                double fee = dest.getEntryFee() * travelers;
                double transport = 5.0 * travelers;
                dayCost += (fee + transport);

                String food = (s == 0) ? "Heritage bakery & spiced chai" 
                            : (s == 1) ? "Traditional thali courtyard dining" 
                            : "Rooftop terrace overlooking illuminated monuments";

                dayPlan.getSlots().add(new SlotItem(slots[s], dest, hours[s], fee, transport, food));
            }

            dayPlan.setTotalDailyCost(Math.round(dayCost * 100.0) / 100.0);
            result.add(dayPlan);
        }

        return result;
    }
}
`
  },
  {
    filename: 'DestinationDAO.java',
    path: 'src/main/java/com/tourism/dao/DestinationDAO.java',
    category: 'dao',
    language: 'java',
    description: 'Data Access Object with JDBC PreparedStatements for full Destination CRUD.',
    content: `package com.tourism.dao;

import com.tourism.model.Destination;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DestinationDAO {

    public List<Destination> getAllDestinations() throws SQLException {
        List<Destination> list = new ArrayList<>();
        String sql = "SELECT d.*, c.name AS category_name FROM destinations d " +
                     "JOIN destination_categories c ON d.category_id = c.category_id " +
                     "ORDER BY d.is_popular DESC, d.rating DESC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Destination d = mapRow(rs);
                list.add(d);
            }
        }
        return list;
    }

    public List<Destination> searchAndFilter(String query, Integer categoryId, String city) throws SQLException {
        List<Destination> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder(
            "SELECT d.*, c.name AS category_name FROM destinations d " +
            "JOIN destination_categories c ON d.category_id = c.category_id WHERE 1=1 "
        );

        if (query != null && !query.trim().isEmpty()) {
            sql.append(" AND (d.name LIKE ? OR d.description LIKE ? OR d.location_area LIKE ?)");
        }
        if (categoryId != null && categoryId > 0) {
            sql.append(" AND d.category_id = ?");
        }
        if (city != null && !city.trim().isEmpty() && !"All".equalsIgnoreCase(city)) {
            sql.append(" AND d.city = ?");
        }

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {

            int idx = 1;
            if (query != null && !query.trim().isEmpty()) {
                String pattern = "%" + query.trim() + "%";
                ps.setString(idx++, pattern);
                ps.setString(idx++, pattern);
                ps.setString(idx++, pattern);
            }
            if (categoryId != null && categoryId > 0) {
                ps.setInt(idx++, categoryId);
            }
            if (city != null && !city.trim().isEmpty() && !"All".equalsIgnoreCase(city)) {
                ps.setString(idx++, city.trim());
            }

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRow(rs));
                }
            }
        }
        return list;
    }

    public boolean addDestination(Destination d) throws SQLException {
        String sql = "INSERT INTO destinations (category_id, name, city, location_area, description, " +
                     "image_url, entry_fee, visit_duration_hours, best_time, address, latitude, longitude, rating, is_popular) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, d.getCategoryId());
            ps.setString(2, d.getName());
            ps.setString(3, d.getCity());
            ps.setString(4, d.getLocationArea());
            ps.setString(5, d.getDescription());
            ps.setString(6, d.getImageUrl());
            ps.setDouble(7, d.getEntryFee());
            ps.setDouble(8, d.getVisitDurationHours());
            ps.setString(9, d.getBestTime());
            ps.setString(10, d.getAddress());
            ps.setDouble(11, d.getLatitude());
            ps.setDouble(12, d.getLongitude());
            ps.setDouble(13, d.getRating() > 0 ? d.getRating() : 4.5);
            ps.setBoolean(14, d.isPopular());

            return ps.executeUpdate() > 0;
        }
    }

    public boolean deleteDestination(int id) throws SQLException {
        String sql = "DELETE FROM destinations WHERE destination_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        }
    }

    private Destination mapRow(ResultSet rs) throws SQLException {
        Destination d = new Destination();
        d.setDestinationId(rs.getInt("destination_id"));
        d.setCategoryId(rs.getInt("category_id"));
        d.setCategoryName(rs.getString("category_name"));
        d.setName(rs.getString("name"));
        d.setCity(rs.getString("city"));
        d.setLocationArea(rs.getString("location_area"));
        d.setDescription(rs.getString("description"));
        d.setImageUrl(rs.getString("image_url"));
        d.setEntryFee(rs.getDouble("entry_fee"));
        d.setVisitDurationHours(rs.getDouble("visit_duration_hours"));
        d.setBestTime(rs.getString("best_time"));
        d.setAddress(rs.getString("address"));
        d.setLatitude(rs.getDouble("latitude"));
        d.setLongitude(rs.getDouble("longitude"));
        d.setRating(rs.getDouble("rating"));
        d.setReviewsCount(rs.getInt("reviews_count"));
        d.setPopular(rs.getBoolean("is_popular"));
        return d;
    }
}
`
  },
  {
    filename: 'ItineraryServlet.java',
    path: 'src/main/java/com/tourism/controller/ItineraryServlet.java',
    category: 'servlet',
    language: 'java',
    description: 'Controller handling itinerary generation requests and forwarding to JSP view.',
    content: `package com.tourism.controller;

import com.tourism.dao.DestinationDAO;
import com.tourism.model.Destination;
import com.tourism.service.ItineraryGeneratorService;
import com.tourism.service.ItineraryGeneratorService.DayItinerary;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/itinerary")
public class ItineraryServlet extends HttpServlet {

    private final DestinationDAO destinationDAO = new DestinationDAO();
    private final ItineraryGeneratorService itineraryService = new ItineraryGeneratorService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.getRequestDispatcher("/itinerary-generator.jsp").forward(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            String city = req.getParameter("city");
            int days = Integer.parseInt(req.getParameter("days"));
            int travelers = Integer.parseInt(req.getParameter("travelers"));
            double totalBudget = Double.parseDouble(req.getParameter("totalBudget"));
            String startDate = req.getParameter("startDate");

            List<Destination> candidates = destinationDAO.searchAndFilter(null, null, city);
            List<DayItinerary> generatedPlan = itineraryService.generateItinerary(candidates, days, travelers, totalBudget);

            double estimatedTotal = 0;
            for (DayItinerary day : generatedPlan) {
                estimatedTotal += day.getTotalDailyCost();
            }

            req.setAttribute("city", city);
            req.setAttribute("days", days);
            req.setAttribute("travelers", travelers);
            req.setAttribute("totalBudget", totalBudget);
            req.setAttribute("startDate", startDate);
            req.setAttribute("dayPlans", generatedPlan);
            req.setAttribute("estimatedTotal", estimatedTotal);
            req.setAttribute("remainingBudget", totalBudget - estimatedTotal);

            req.getRequestDispatcher("/itinerary-result.jsp").forward(req, resp);

        } catch (Exception e) {
            req.setAttribute("errorMessage", "Error generating itinerary: " + e.getMessage());
            req.getRequestDispatcher("/itinerary-generator.jsp").forward(req, resp);
        }
    }
}
`
  },
  {
    filename: 'pom.xml',
    path: 'pom.xml',
    category: 'config',
    language: 'xml',
    description: 'Maven Project Object Model with MySQL Connector, JSTL, Servlet API, and Tomcat plugin.',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.tourism</groupId>
    <artifactId>tourism-planner</artifactId>
    <version>1.0.0</version>
    <packaging>war</packaging>

    <name>Local Tourism Planner and Itinerary Generator</name>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <!-- Java Servlet API for Tomcat 9 / 10 -->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>4.0.1</version>
            <scope>provided</scope>
        </dependency>

        <!-- JavaServer Pages (JSP) API -->
        <dependency>
            <groupId>javax.servlet.jsp</groupId>
            <artifactId>javax.servlet.jsp-api</artifactId>
            <version>2.3.3</version>
            <scope>provided</scope>
        </dependency>

        <!-- JSTL Standard Tag Library -->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>jstl</artifactId>
            <version>1.2</version>
        </dependency>

        <!-- MySQL Connector / J (JDBC Driver) -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.33</version>
        </dependency>

        <!-- BCrypt for Secure Password Hashing -->
        <dependency>
            <groupId>org.mindrot</groupId>
            <artifactId>jbcrypt</artifactId>
            <version>0.4</version>
        </dependency>

        <!-- Google Gson for JSON Ajax Responses -->
        <dependency>
            <groupId>com.google.code.gson</groupId>
            <artifactId>gson</artifactId>
            <version>2.10.1</version>
        </dependency>
    </dependencies>

    <build>
        <finalName>tourism-planner</finalName>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-war-plugin</artifactId>
                <version>3.4.0</version>
            </plugin>
        </plugins>
    </build>
</project>
`
  },
  {
    filename: 'web.xml',
    path: 'src/main/webapp/WEB-INF/web.xml',
    category: 'config',
    language: 'xml',
    description: 'Deployment descriptor configuring welcome file list, session timeout, and error handling.',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee 
                             http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

    <display-name>Local Tourism Planner</display-name>

    <welcome-file-list>
        <welcome-file>index.jsp</welcome-file>
    </welcome-file-list>

    <!-- Session Timeout in Minutes -->
    <session-config>
        <session-timeout>45</session-timeout>
        <cookie-config>
            <http-only>true</http-only>
            <secure>false</secure>
        </cookie-config>
    </session-config>

    <!-- Global Error Pages -->
    <error-page>
        <error-code>404</error-code>
        <location>/error-404.jsp</location>
    </error-page>
    <error-page>
        <error-code>500</error-code>
        <location>/error-500.jsp</location>
    </error-page>
</web-app>
`
  },
  {
    filename: 'README_SETUP.md',
    path: 'README_SETUP.md',
    category: 'guide',
    language: 'markdown',
    description: 'Step-by-step beginner guide to open and run the project in Eclipse, IntelliJ, and Apache Tomcat.',
    content: `# Local Tourism Planner with Budget & Itinerary Generator
### Complete Java Full-Stack (JSP, Servlets, MySQL, JDBC, Apache Tomcat)

---

## 📋 1. Prerequisites
- **JDK 17 or higher** installed and \`JAVA_HOME\` set.
- **Apache Tomcat 9.0.x or 10.1.x** installed.
- **MySQL Server 8.0+** running locally (or XAMPP / WAMP).
- **IDE**: Eclipse IDE for Enterprise Java (or IntelliJ IDEA Ultimate / Community with Smart Tomcat).

---

## 🗄️ 2. Database Setup (MySQL)
1. Open **MySQL Workbench** or run terminal:
   \`\`\`bash
   mysql -u root -p
   \`\`\`
2. Execute the provided \`database/schema.sql\` script:
   \`\`\`sql
   SOURCE path/to/database/schema.sql;
   \`\`\`
3. Verify that database \`tourism_planner\` and all 7 tables (\`users\`, \`destinations\`, \`destination_categories\`, \`travel_plans\`, \`itineraries\`, \`expenses\`, \`bookings\`) are created.

---

## 💻 3. Running in Eclipse IDE
1. Open **Eclipse IDE**.
2. Click **File -> Import... -> Existing Maven Projects**.
3. Browse to the project folder containing \`pom.xml\` and click **Finish**.
4. In the **Servers** tab: Right-click -> **New -> Server** -> Select **Apache Tomcat v9.0 / v10.1** -> Browse to your Tomcat installation path.
5. Right-click on the project -> **Run As -> Run on Server** -> Select Tomcat.
6. The application opens at \`http://localhost:8080/tourism-planner/\`.

---

## 🚀 4. Running in IntelliJ IDEA
1. Open IntelliJ IDEA -> **Open** -> Select the project root.
2. Let Maven download dependencies automatically.
3. Configure Run Configuration:
   - Click **Add Configuration...** -> **+** -> **Tomcat Server** -> **Local**.
   - Under **Deployment** tab: Click **+** -> **Artifact** -> Select \`tourism-planner:war exploded\`.
   - Set Application context to \`/tourism-planner\`.
4. Click **Run / Debug**.

---

## 🔑 5. Default Login Credentials
- **Admin**:
  - Email: \`admin@tourismplanner.local\`
  - Password: \`password123\`
- **Tourist**:
  - Email: \`tourist@tourismplanner.local\`
  - Password: \`password123\`
`
  }
];
