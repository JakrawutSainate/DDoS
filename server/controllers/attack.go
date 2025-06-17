package controllers
import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/bigbi/ddos-backend/config"
	"github.com/bigbi/ddos-backend/ai"
)

type Attack struct {
	ID         int       `json:"id"`
	Type       string    `json:"type"`
	Confidence float64   `json:"confidence"`
	Timestamp  time.Time `json:"timestamp"`
}

func CreateAttack(c *gin.Context) {
	var req struct {
		Type       string  `json:"type"`
		Confidence float64 `json:"confidence"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	stmt, err := config.DB.Prepare("INSERT INTO attacks (attack_type, confidence, timestamp) VALUES (?, ?, NOW())")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to prepare statement"})
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(req.Type, req.Confidence)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to execute insert"})
		return
	}

	// ส่ง Broadcast ไปยัง WebSocket clients
	BroadcastMessage(fmt.Sprintf("🚨 การโจมตีใหม่: %s (%.2f)", req.Type, req.Confidence))
	c.JSON(http.StatusOK, gin.H{"message": "Attack record inserted"})
}

func GetAttacks(c *gin.Context) {
	rows, err := config.DB.Query("SELECT id, attack_type, confidence, timestamp FROM attacks ORDER BY timestamp DESC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query failed"})
		return
	}
	defer rows.Close()

	var attacks []Attack
	for rows.Next() {
		var atk Attack
		if err := rows.Scan(&atk.ID, &atk.Type, &atk.Confidence, &atk.Timestamp); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Row scan failed"})
			return
		}
		attacks = append(attacks, atk)
	}

	c.JSON(http.StatusOK, attacks)
}

func PredictAttack(c *gin.Context) {
	var req struct {
		Features []float64 `json:"features"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	result, err := ai.PredictWithPython(req.Features)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// บันทึกผลลง DB
	stmt, err := config.DB.Prepare("INSERT INTO attacks (attack_type, confidence, timestamp) VALUES (?, ?, NOW())")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB prepare failed"})
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(result.Prediction, result.Confidence)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB insert failed"})
		return
	}

	// ส่ง broadcast ด้วย WebSocket (ถ้ามี)
	BroadcastMessage(fmt.Sprintf("🚨 การโจมตีใหม่: %s (%.2f)", result.Prediction, result.Confidence))

	c.JSON(http.StatusOK, gin.H{
		"type":       result.Prediction,
		"confidence": result.Confidence,
		"message":    "AI prediction saved to DB",
	})
}

func GetAllAttacks(c *gin.Context) {
	rows, err := config.DB.Query("SELECT id, attack_type, confidence FROM attacks ORDER BY id DESC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query failed"})
		return
	}
	defer rows.Close()

	type Attack struct {
		ID         int     `json:"id"`
		Type       string  `json:"type"`
		Confidence float64 `json:"confidence"`
	}

	var attacks []Attack

	for rows.Next() {
		var atk Attack

		err := rows.Scan(&atk.ID, &atk.Type, &atk.Confidence)
		if err != nil {
			fmt.Println("❌ Scan error:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Row scan failed"})
			return
		}

		attacks = append(attacks, atk)
	}

	c.JSON(http.StatusOK, attacks)
}


