package middleware

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/bigbi/ddos-backend/config"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// โครงสร้างผู้ใช้ (ไม่มี created_at)
type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"-"`
}

// สมัครสมาชิก
func Register(c *gin.Context) {
	var req struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Password hash error"})
		return
	}

	stmt, err := config.DB.Prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB prepare error"})
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(req.Username, req.Email, string(hash))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User insert error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User registered"})
}

// เข้าสู่ระบบ
func Login(c *gin.Context) {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	row := config.DB.QueryRow("SELECT id, username, email, password FROM users WHERE username = ?", req.Username)

	var user User
	err := row.Scan(&user.ID, &user.Username, &user.Email, &user.Password)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	} else if err != nil {
		fmt.Println("❌ SQL Scan Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB query error"})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Login successful",
		"username": user.Username,
		"email":    user.Email,
	})
}
