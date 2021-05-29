---
title: Handling Back Button
desc: How to manage the back button in a Quasar app.
---
When writing reusable code for building a mobile App and a website, it's important to know how to handle the "Back" button. More specifically, how to manage buttons on your layout/page that should make your App's "go back" to the previous page.

::: tip
If you have no knowledge of [Vue Router](http://router.vuejs.org/), we highly recommend you read and understand how it works first.
:::

## GoBack API

<doc-api file="GoBack" />

## Cordova/Capacitor
Quasar handles the back button for you by default, so it can hide any opened Dialogs **instead of the default behavior** which is to return to the previous page (which is not a nice user experience).

Also, when on the home route (`/`) and user presses the back button on the phone/tablet, Quasar will make your app exit. Should you wish to disable or configure this behavior, then you can do so via quasar.conf.js options:
- `false` will disable the feature;
- `'*'` will make your app exit on any page, if the history length is 0;
- an array of strings (eg. `['login', 'home', 'my-page']`) will make your app exit when current path is included in that array (or on default `/`). The array automatically filters out non-strings or empty values and normalizes paths to match `#/<your-path>` format.

```js
// for Cordova (only!):
return {
  framework: {
    config: {
      cordova: {
        // Quasar handles app exit on mobile phone back button.
        // Requires Quasar v1.9.3+ for true/false, v1.12.6+ for '*' wildcard and array values
        backButtonExit: true/false/'*'/['/login', '/home', '/my-page'],

        // On the other hand, the following completely
        // disables Quasar's back button management.
        // Requires Quasar v1.14.1+
        backButton: true/false
      }
    }
  }
}

// for Capacitor (only!)
return {
  framework: {
    config: {
      capacitor: {
        // Quasar handles app exit on mobile phone back button.
        // Requires Quasar v1.9.3+ for true/false, v1.12.6+ for '*' wildcard and array values
        backButtonExit: true/false/'*'/['/login', '/home', '/my-page'],

        // On the other hand, the following completely
        // disables Quasar's back button management.
        // Requires Quasar v1.14.1+
        backButton: true/false
      }
    }
  }
}
```

## Navigation Scenario
Consider this situation: We have an App with two pages (so two routes): a login page (route "/") and another page with a list of items on multiple layout tabs - let's call this page "List page" from now on, where each tab has a route like "/list/shoes", "/list/hats". The Login page redirects to List page and List page has a "Logout" button, which redirects the user to the Login page.

How would you handle this situation? Normally, you'd write code like below for the Login and Logout button (we won't go into details of handling the login information and communicating with a server as this is outside of the exercise here):

``` html
<!-- Login button -->
<q-btn to="/list" label="Login" />

<!-- Logout button -->
<q-btn to="/login" label="Logout" />
```

Now you build your App and install it on a phone. You open up the App, hit login then logout, then the phone's back button. What you most likely want is for your App to exit at this point... but it doesn't! It goes to the "/list" route instead. It's kind of obvious why. Web history builds up as you hit the buttons:
```
# Start App
--> window.history.length is 1

# Hit Login button
--> window.history.length is 2

# Hit Logout button
--> window.history.length is 3!
```

What you'd like instead, is when you hit the Logout button, the `window.history.length` to be 1 again. Quasar can handle this automatically for you. Read about the `v-go-back` Vue directive.

## Directive v-go-back
Let's rewrite the Logout button to act as we would actually want it to work, which is to make `window.history.length` be 1 again. We're going to install the directive:

``` html
<!-- Logout button -->
<q-btn
  v-go-back=" '/' "
  color="primary"
  label="Logout"
/>
```

This directive determines if the Platform is Cordova or Capacitor, and if so, it performs a `window.history.back()` call instead of a `$router.push('/')`.

## Quirks
Now you may think everything will work smoothly, but you must be careful about how your app is stacking up the window history. Remember, we started out by saying that the List page has a layout with multiple tabs, each one with its own route ("/list/shoes", "/list/hats"). If we'd use `to="/list/shoes"` and `to="/list/hats"` on your Tabs (read more about [QTabs](/vue-components/tabs)), then window history will build up when switching between the tabs.

This incorrect behavior for apps is due to Vue Router pushing routes to the history by default. What you'd like instead, is for your window history length to stay the same, even if routes change. Fortunately, Vue Router comes to the rescue with the `replace` property, which essentially replaces current route instead of pushing it as a new route.

So, besides `to="/some/route"` you should add the `replace` attribute (becoming `to="/some/route" replace`). This will replace the current route in the window history rather than pushing it.

The same applies to `<router-link>`s.

::: warning
Always **think** about how you redirect your App to a new route, depending on what you want to achieve. Think if you really want to push a new route to window history or if you want to "replace" the current route. Otherwise the phone/tablet/browser "Back" button won't work quite as expected. Instead of finally exiting the App, it will make you go through all the routes in the reverse order they were visited. So when you hit back and go to the Login page, you'd expect another back to make the App exit, but it might make your App go to one of the List tabs, depending on the user's navigation history.
:::
