package main

import (
	"embed"
  "fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
)

const DEFAULT_PORT = "3000"

// Embed the contents of the "dist" directory into the binary.
// This allows the files in the "dist" directory to be served directly from the embedded filesystem.
//go:embed dist/**
var embeddedFiles embed.FS

func main() {
	port := getEnv("PORT", DEFAULT_PORT)

	// Create a sub-filesystem rooted at "dist"
	distFS, err := fs.Sub(embeddedFiles, "dist")
	if err != nil {
		log.Fatalf("failed to create sub filesystem: %v", err)
	}

	// Serve the embedded files
	http.Handle("/", http.FileServer(http.FS(distFS)))

	log.Printf("Server running at http://localhost:%s", port)
	if err := http.ListenAndServe(fmt.Sprintf(":%s", port), nil); err != nil {
		log.Fatal(err)
	}
}

func getEnv(name string, defaultValue string) string {
	envValue := os.Getenv(name)
	if envValue == "" {
		return defaultValue
	}
	return envValue
}
