package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/bigbi/ddos-backend/controllers"
	"github.com/bigbi/ddos-backend/middleware"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		// Attack 
		api.GET("/attacks", controllers.GetAttacks)
		api.POST("/attack", controllers.CreateAttack)

		// User 
		api.POST("/register", middleware.Register)
		api.POST("/login", middleware.Login)
		api.POST("/predict", controllers.PredictAttack)
		api.GET("/attackall", controllers.GetAllAttacks)

	}

	// WebSocket route (อยู่นอก /api เพราะไม่ต้องมี prefix)
	r.GET("/ws", controllers.WebSocketHandler)
}
