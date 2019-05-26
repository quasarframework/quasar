package main

import (
	"github.com/zserge/webview"
)

var w webview.WebView
var open string
var debug bool

type Webview struct {
}

func (c *Webview) Open(url string) {
	webview.Open("Opened URL", url, 800, 600, true)
}

func (c *Webview) SetTitle(title string) {
	w.SetTitle(title)
}

func check(e error) {
    if e != nil {
        panic(e)
    }
}

func main() {
	initialize()

	w = webview.New(webview.Settings {
		Title: "Quasar",
		URL: open,
		Width: 800,
		Height: 600,
		Resizable: true,
		Debug: debug,
	})
	
	defer w.Exit()

	// TODO: bundle assets into executable with go-bindata like here https://github.com/zserge/webview/blob/master/examples/counter-go/vue.go#L5
	
	setup(w)

	w.Dispatch(func () {
		w.Bind("webview", &Webview{})
	})

	w.Run()
}