// +build dev

package main

import (
	"github.com/zserge/webview"
	"flag"
)

func initialize() {
	var openUrl = flag.String("url", "", "URL for dev env")
	flag.Parse()
	open = *openUrl
	debug = true
}

func setup(w webview.WebView) {

}