package config

import (
	"log"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	"github.com/joho/godotenv"
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

// LoadEnv loads the appropriate .env files dynamically.
// It searches for the .env files starting from the current working directory and going up,
// or checking the executable directory.
func LoadEnv() {
	// First, let's find the directory containing the .env files.
	// We'll search upwards from the current working directory.
	dir, err := os.Getwd()
	if err != nil {
		log.Printf("Warning: failed to get working directory: %v", err)
		return
	}

	var envDir string
	// Go up to 4 levels to find a directory containing a ".env" or ".env.production" file
	for i := 0; i < 4; i++ {
		if _, err := os.Stat(filepath.Join(dir, ".env")); err == nil {
			envDir = dir
			break
		}
		if _, err := os.Stat(filepath.Join(dir, ".env.production")); err == nil {
			envDir = dir
			break
		}
		if _, err := os.Stat(filepath.Join(dir, ".env.local")); err == nil {
			envDir = dir
			break
		}
		if _, err := os.Stat(filepath.Join(dir, "backend", ".env")); err == nil {
			envDir = filepath.Join(dir, "backend")
			break
		}
		if _, err := os.Stat(filepath.Join(dir, "backend", ".env.production")); err == nil {
			envDir = filepath.Join(dir, "backend")
			break
		}

		parent := filepath.Dir(dir)
		if parent == dir {
			break
		}
		dir = parent
	}

	// If not found, check the executable directory
	if envDir == "" {
		if exePath, err := os.Executable(); err == nil {
			exeDir := filepath.Dir(exePath)
			if _, err := os.Stat(filepath.Join(exeDir, ".env.production")); err == nil {
				envDir = exeDir
			} else if _, err := os.Stat(filepath.Join(exeDir, ".env")); err == nil {
				envDir = exeDir
			}
		}
	}

	// Fallback to current working directory if still not found
	if envDir == "" {
		envDir = "."
	}

	// Determine if we should run in production mode:
	// A) If APP_ENV environment variable is explicitly set in the system
	// B) Or if .env.production exists in envDir AND neither .env nor .env.local exists in envDir
	//    (which is the case for a production build deployment)
	appEnv := os.Getenv("APP_ENV")
	
	prodEnvPath := filepath.Join(envDir, ".env.production")
	localEnvPath := filepath.Join(envDir, ".env.local")
	primaryEnvPath := filepath.Join(envDir, ".env")

	_, hasProd := os.Stat(prodEnvPath)
	_, hasLocal := os.Stat(localEnvPath)
	_, hasPrimary := os.Stat(primaryEnvPath)

	// If we are in production runtime (no local/primary env files exist in the build folder,
	// only .env.production exists), we set appEnv to "production" automatically
	if appEnv == "" && hasProd == nil && hasLocal != nil && hasPrimary != nil {
		appEnv = "production"
	}

	// 1. If appEnv is set (e.g. "local", "production"), overload with the env-specific file first
	if appEnv != "" {
		specificEnvPath := filepath.Join(envDir, ".env."+appEnv)
		if _, err := os.Stat(specificEnvPath); err == nil {
			if err := godotenv.Overload(specificEnvPath); err == nil {
				log.Printf("Successfully loaded %s environment from %s", appEnv, specificEnvPath)
			} else {
				log.Printf("Warning: failed to load %s: %v", specificEnvPath, err)
			}
		}
	}

	// 2. Load the primary .env file (it will not override variables already set by the env-specific file)
	if hasPrimary == nil {
		if err := godotenv.Load(primaryEnvPath); err == nil {
			log.Printf("Successfully loaded primary environment from %s", primaryEnvPath)
		}
	}
}

func Load() Config {
	// Automatically load environment files before reading configuration
	LoadEnv()

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
