-- ======================================================
-- FIESTA HOTEL & SUITES - BACKEND IMPLEMENTATION GUIDE
-- ======================================================

-- 1. DATABASE TABLES STRUCTURE
-- ------------------------------------------------------

-- Rooms Table
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100), -- Featured, Premium, Standard
    price DECIMAL(15, 2) NOT NULL,
    description TEXT,
    main_image VARCHAR(500),
    images TEXT, -- Store as JSON array or comma-separated URLs
    beds INT DEFAULT 1,
    baths INT DEFAULT 1,
    status ENUM('Available', 'Booked', 'Maintenance') DEFAULT 'Available'
);

-- Bookings Table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id VARCHAR(20) UNIQUE NOT NULL, -- e.g., FSTA-123456
    room_id INT,
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255) NOT NULL,
    guest_phone VARCHAR(20),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_price DECIMAL(15, 2) NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    sender_name VARCHAR(255), -- For bank transfer verification
    sender_account VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);


-- 2. ADMIN DASHBOARD QUERIES
-- ------------------------------------------------------

-- Calculate Total Revenue (Only from verified payments)
-- Use this for the 'Total Revenue' KPI
SELECT SUM(total_price) as revenue FROM bookings WHERE status = 'Approved';

-- Count Total Bookings
-- Use this for the 'Total Bookings' KPI
SELECT COUNT(*) as total_bookings FROM bookings;

-- Count Pending Bookings
-- Use this for the 'Pending' alerts
SELECT COUNT(*) as pending_count FROM bookings WHERE status = 'Pending';

-- Get Recent Bookings for the Table
SELECT b.*, r.name as room_name 
FROM bookings b
JOIN rooms r ON b.room_id = r.id
ORDER BY b.created_at DESC
LIMIT 10;


-- 3. DEVELOPER NOTES
-- ------------------------------------------------------
-- AUTHENTICATION: Keep as hardcoded for now (fiesta@gmail.com / 12345678).
-- EMAIL SERVICE: Frontend is already handling emails via Brevo API.
-- API ENDPOINTS EXPECTED BY FRONTEND:
-- GET  /rooms/list.php
-- GET  /rooms/view.php?id=X
-- POST /bookings/create.php
-- GET  /admin/stats.php
-- POST /admin/approve_booking.php
