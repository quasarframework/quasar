---
title: Opening Your Dev Server to the Public
desc: How to offer temporary access to your development server to anyone on the Internet.
---
At some point you may want to show someone else the project you've been working on. Fortunately, there are a couple of good tools to accomplish this, [Serveo](https://serveo.net/) and [Ngrok](https://ngrok.com/). Both create a tunnel to your dev server and (by default) auto-generate an internet address on their respective servers to offer to your clients or anyone special you'd like to show your work to.

::: warning
Opening your dev server to the public poses security risks. Be absolutely cautious when using tools like this.

When you've finished with your demonstration or testing, make sure to stop serveo or ngrok. This will prevent any unwanted access of your computer through them.
:::

## Using Serveo (easiest)

1. Assuming you have an SSH shell, you only need issue the following command (substituting your details)
``` bash
$ ssh -R 80:localhost:8080 serveo.net
# In case your development server doesn't run on port 8080 you need to change the number to the correct port
```

2. That's it, and you will now have a random subdomain assigned to you like so:
``` bash
$ ssh -R 80:localhost:8080 serveo.net
Hi there
Forwarding HTTP traffic from https://randomsubdomain.serveo.net
Press g to start a GUI session and ctrl-c to quit.
```

3. if you want to get fancy, you can even request your own subdomain like so
``` bash
$ ssh -R mysubdomain:80:localhost:8080 serveo.net
Hi there
Forwarding HTTP traffic from https://mysubdomain.serveo.net
Press g to start a GUI session and ctrl-c to quit.
# replace 'mysubdomain' above with whatever subdomain you want, and if it is available, you will have it.
```



## Using Ngrok

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
