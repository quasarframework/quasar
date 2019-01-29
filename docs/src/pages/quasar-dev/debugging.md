---
title: Debugging
---



If you need to use breakpoints and debug, it will help if you visit this page: [Official Node.js Debugging guide](https://nodejs.org/en/docs/guides/debugging-getting-started/)

### Inspect

Here is how you can 

```shell 
$ NODE_OPTIONS=--inspect DEBUG=v8:* quasar dev
$ curl http://127.0.0.1:9229/json/list
```

Then you can add the reserved word `debugger` in your code and you will get a stack trace at that position.

In your browser visit: [chrome://inspect](chrome://inspect)

### Out of memory

Sometimes node can run out of memory. Thankfully you can allocate more memory (in this case 4GB) with this command line environment setting:

```shell 
$ NODE_OPTIONS=--max_old_space_size=4096 quasar dev
```
