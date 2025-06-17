package config

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func ConnectDB() {
	var err error
	dsn := "root:@tcp(127.0.0.1:3306)/ddos_db"
	DB, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("เชื่อมต่อฐานข้อมูลล้มเหลว:", err)
	}

	err = DB.Ping()
	if err != nil {
		log.Fatal("Ping DB ล้มเหลว:", err)
	}

	fmt.Println("เชื่อมต่อฐานข้อมูล MySQL สำเร็จ")
}
