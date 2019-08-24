package main

import (
	"github.com/zserge/webview"
)

var open string
var debug bool

type Webview struct {
	window webview.WebView
}

func initWebViewInstance(window webview.WebView) {
	window.Dispatch(func () {
		window.Bind("webview", &Webview{window})
		window.Eval("webview.setTitle(document.title)")
	})
}

func (c *Webview) Open(url string) {
	window := webview.New(webview.Settings {
		Title: " ",
		URL: url,
		Width: 800,
		Height: 600,
		Resizable: true,
	})
	initWebViewInstance(window)
}

func (c *Webview) SetTitle(title string) {
	c.window.SetTitle(title)
}

func check(e error) {
    if e != nil {
        panic(e)
    }
}

func main() {
	initialize()

	w := webview.New(webview.Settings {
		Title: " ",
		URL: open,
		Width: 800,
		Height: 600,
		Resizable: true,
		Debug: debug,
	})
	
	defer w.Exit()

	// TODO: bundle assets into executable with go-bindata like here https://github.com/zserge/webview/blob/master/examples/counter-go/vue.go#L5
	
	setup(w)

	initWebViewInstance(w)

	w.Run()
}