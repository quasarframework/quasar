package main

import (
	"github.com/zserge/webview"
	"flag"
	"io/ioutil"
	"net/url"
	"os"
	"path/filepath"
)

type Webview struct {
}

func (c *Webview) Open(url string) {
	webview.Open("Opened URL", url, 800, 600, true)
}

func check(e error) {
    if e != nil {
        panic(e)
    }
}

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

func main() {
	var openUrl = flag.String("url", "", "URL for dev env")
	var debug = flag.Bool("debug", false, "Debug mode")
	flag.Parse()
	var production = *openUrl == ""
	if production {
		html, err := ioutil.ReadFile("../dist/webview/index.html")
		check(err)
		*openUrl = `data:text/html,` + url.PathEscape(string(html))
	}

	w := webview.New(webview.Settings {
		Title: "Quasar",
		URL: *openUrl,
		Width: 800,
		Height: 600,
		Resizable: true,
		Debug: *debug,
	})
	
	defer w.Exit()

	// TODO: bundle assets into executable with go-bindata like here https://github.com/zserge/webview/blob/master/examples/counter-go/vue.go#L5
	
	if production {
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

	w.Dispatch(func () {
		w.Bind("webview", &Webview{})
	})

	w.Run()
}