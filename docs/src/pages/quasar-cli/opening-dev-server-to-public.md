---
title: Opening Your Dev Server to the Public
---
At some point you may want to show someone else the project you've been working on. Fortunately, there is a simple CLI tool to accomplish this. [Ngrok](https://ngrok.com/) creates a tunnel to your dev server and (by default) generates a hexadecimal internet address on the ngrok server to offer to your clients or anyone special you'd like to show your work to.

> **IMPORTANT**
> Opening a dev server to the public constitutes security risks. Be absolutely cautious when using tools like this. This tip **is not** intended for the general public.
>
> When you've finished with your demonstration or testing, make sure to stop ngrok. This will prevent any unwanted access of your computer through ngrok.

### Getting started

1. Download and install ngrok [here](https://ngrok.com/download).
(Please note that the ngrok executable file does not need to be placed in or run from inside your cordova folder. When on a mac it's best to place the ngrok executable file inside `/usr/local/bin` to be able to run it globally.)

2. Start your Dev server
``` bash
$ quasar dev
```

3. Create your ngrok connection
``` bash
$ ngrok http 8080
# In case your development server doesn't run on port 8080 you need to change the number to the correct port
```

4. ngrok shows the url in the command line when it started.
``` bash
Tunnel Status                 online
Version                       2.0/2.0
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://92832de0.ngrok.io -> localhost:8080
Forwarding                    https://92832de0.ngrok.io -> localhost:8080

Connnections                  ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```
Please be careful as the 'Forwarding' URL will be accessible to anyone until this connection is closed again.

### Inspecting traffic

When running ngrok, visit `http://localhost:4040` to inspect the traffic.

This tool allows for custom domains, password protection and a lot more. If you require further assistance, please refer to the [ngrok docs](https://ngrok.com/docs) for more information.