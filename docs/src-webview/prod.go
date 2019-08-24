// +build !dev

package main

import (
	"github.com/zserge/webview"
	"io/ioutil"
	"net/url"
	"os"
	"path/filepath"
	"flag"
)

func getAssets(dirPath string) []string {
	var files []string
	err := filepath.Walk(dirPath, func(path string, info os.FileInfo, err error) error {
		if info.IsDir() {
			return nil
		}
		files = append(files, path)
		return nil
	})
	check(err)
	return files
}

func initialize() {
	var debugFlag = flag.Bool("debug", false, "URL for dev env")
	flag.Parse()
	debug = *debugFlag
	// TODO: bundle assets into executable with go-bindata like here https://github.com/zserge/webview/blob/master/examples/counter-go/vue.go#L5
	html, err := ioutil.ReadFile("../dist/webview/index.html")
	check(err)
	open = `data:text/html,` + url.PathEscape(string(html))
}

func setup(w webview.WebView) {
	w.Dispatch(func () {
		for _, file := range getAssets("../dist/webview/css") {
			css, err := ioutil.ReadFile(file)
			check(err)
			w.InjectCSS(string(css))
		}
		for _, file := range getAssets("../dist/webview/js") {
			js, err := ioutil.ReadFile(file)
			check(err)
			w.Eval(string(js))
		}
	})
}