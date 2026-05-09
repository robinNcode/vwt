package config

import (
	"os"
	"strings"
)

type Config struct {
	Env         string
	Port        string
	DBHost      string
	DBPort      string
	DBUser      string
	DBPassword  string
	DBName      string
	JWTSecret   string
	CORSOrigins []string
}

func Load() Config {
	return Config{
		Env:        getEnv("APP_ENV", "local"),
		Port:       getEnv("APP_PORT", "8083"),
		DBHost:     getEnv("DB_HOST", "127.0.0.1"),
		DBPort:     getEnv("DB_PORT", "3306"),
		DBUser:     getEnv("DB_USER", "root"),
		DBPassword: getEnv("DB_PASSWORD", ""),
		DBName:     getEnv("DB_NAME", "vwt_v1"),
		JWTSecret:  getEnv("JWT_SECRET", "change-me"),
		CORSOrigins: splitCSV(
			getEnv("CORS_ORIGINS", "http://localhost:5173"),
		),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func splitCSV(s string) []string {
	parts := strings.Split(s, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		p = strings.TrimSpace(p)
		if p == "" {
			continue
		}
		out = append(out, p)
	}
	return out
}
