package config

import (
	"net/url"
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
	databaseURL := getEnv("DATABASE_URL", "")
	dbHost := getEnv("DB_HOST", "127.0.0.1")
	dbPort := getEnv("DB_PORT", "3306")
	dbUser := getEnv("DB_USER", "root")
	dbPassword := getEnv("DB_PASSWORD", "")
	dbName := getEnv("DB_NAME", "vwt_v1")

	if databaseURL != "" {
		if u, err := url.Parse(databaseURL); err == nil {
			if u.Scheme == "mysql" {
				dbHost = u.Hostname()
				if p := u.Port(); p != "" {
					dbPort = p
				}
				dbUser = u.User.Username()
				if pass, ok := u.User.Password(); ok {
					dbPassword = pass
				}
				dbName = strings.TrimPrefix(u.Path, "/")
			}
		}
	}

	return Config{
		Env:         getEnv("APP_ENV", "local"),
		Port:        getEnv("APP_PORT", "8083"),
		DBHost:      dbHost,
		DBPort:      dbPort,
		DBUser:      dbUser,
		DBPassword:  dbPassword,
		DBName:      dbName,
		JWTSecret:   getEnv("JWT_SECRET", "change-me"),
		CORSOrigins: splitCSV(getEnv("CORS_ORIGINS", "http://localhost:5173,https://robin.adovasoft.com,https://robin.adovasoft.com/vwt/")),
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
