package main

import (
        "net/http"
)

func main() {
        http.Handle("/", http.FileServer(http.Dir("")))
        http.ListenAndServe("192.168.0.156:8000", nil)
}