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
	// STEP 1: Always check the executable's own directory first.
	// This is the most reliable approach for production: build.sh places
	// .env.production right next to the compiled binary.
	var envDir string
	if exePath, err := os.Executable(); err == nil {
		exeDir := filepath.Dir(exePath)
		if _, err := os.Stat(filepath.Join(exeDir, ".env.production")); err == nil {
			envDir = exeDir
		} else if _, err := os.Stat(filepath.Join(exeDir, ".env")); err == nil {
			envDir = exeDir
		} else if _, err := os.Stat(filepath.Join(exeDir, ".env.local")); err == nil {
			envDir = exeDir
		}
	}

	// STEP 2: If not found next to the binary, walk up from the working directory.
	// This covers `go run` in development where the "binary" is a temp file.
	if envDir == "" {
		dir, err := os.Getwd()
		if err != nil {
			log.Printf("Warning: failed to get working directory: %v", err)
		} else {
			for i := 0; i < 5; i++ {
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
		}
	}

	// STEP 3: Last resort fallback to CWD
	if envDir == "" {
		envDir = "."
	}

	prodEnvPath := filepath.Join(envDir, ".env.production")
	localEnvPath := filepath.Join(envDir, ".env.local")
	primaryEnvPath := filepath.Join(envDir, ".env")

	_, hasProd := os.Stat(prodEnvPath)
	_, hasLocal := os.Stat(localEnvPath)
	_, hasPrimary := os.Stat(primaryEnvPath)

	// Determine appEnv:
	// A) Honour an explicit APP_ENV system environment variable.
	// B) Auto-detect production: only .env.production is present (no .env / .env.local).
	appEnv := os.Getenv("APP_ENV")
	if appEnv == "" && hasProd == nil && hasLocal != nil && hasPrimary != nil {
		appEnv = "production"
	}

	// Load the env-specific file first (highest priority) using Overload so it
	// overrides any already-set system env vars.
	if appEnv != "" {
		specificEnvPath := filepath.Join(envDir, ".env."+appEnv)
		if _, err := os.Stat(specificEnvPath); err == nil {
			if err := godotenv.Overload(specificEnvPath); err == nil {
				log.Printf("Loaded %s config from: %s", appEnv, specificEnvPath)
			} else {
				log.Printf("Warning: could not load %s: %v", specificEnvPath, err)
			}
		}
	}

	// Load the primary .env without overriding variables already set above.
	if hasPrimary == nil {
		if err := godotenv.Load(primaryEnvPath); err == nil {
			log.Printf("Loaded base config from: %s", primaryEnvPath)
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
		CORSOrigins: splitCSV(getEnv("CORS_ORIGINS", "http://localhost:5173,https://voltwavebd.com,https://www.voltwavebd.com")),
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
