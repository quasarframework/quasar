export default class WebView {
  static invoke (command) {
    external.invoke(JSON.stringify(command));
  }

  static readFile (file) {
	this.invoke({cmd: 'read', file})
  }

  static writeFile (cfg) {
	this.invoke({cmd: 'write', file: cfg.file, contents: cfg.contents})
  }

  static listFiles (cfg) {
	cfg.cmd = cfg.cmd || 'list';
	this.invoke(cfg);
  }

  static listDirs (cfg) {
	cfg.cmd = cfg.cmd || 'listDirs';
	cfg.path = cfg.path || '';
	this.invoke(cfg);
  }

  static setTitle (title) {
    this.invoke({cmd: 'setTitle', title})
  }
}
