# mbta-project

A personal project to make some sort of web application that utilizes [MBTA's API](https://www.mbta.com/developers/v3-api) and display data from it. Currently, it shows stop times and alerts for the Orange line. 

Styled with Bootstrap.
It makes AJAX calls using JQuery.
It uses Gulp as a task runner to interpret sass into css; bundles js together and minifies it; and hosts it locally. 

## TODO
- Clean up the look of the site and possibly style it better
- Add additional specific stop functionality
- maybe remove browsersync (it gets kinda annoying)
- Host it 

## SETUP
Install node. [You can find the one I used within the redist folder.](redist/node-v6.17.1-x64.msi)

Then after that, try reinstalling all of the package dependencies.
Launch this command from the root of the project directory:
```
npm install
```

To have any of the AJAX requests to work, you'll need an API key.
You can get request one [here](https://api-v3.mbta.com/).
After you get one, you should make a blank js file and format it like this:
```js
var apikey = "your-key-here";

export {apikey}
```
It should go in the 'js' directory.
ex: mbta-project/js

To run it, just type:

```
gulp serve
```
## CORS Workaround
When you run it, the results of the AJAX calls would never come, due to the CORS policy. 
Right now, it's not exactly *CORS* compliant, seeing as I'm just making AJAX calls willy nilly.
But what exactly is CORS? I'm not exactly too sure of it myself, but you can try googling it.

Here are two resources that I used to get some idea of it:

[Understanding through a metaphor](https://dev.to/dougblackjr/cors-in-a-way-i-can-understand-501d)
[Security reasons why](https://www.moesif.com/blog/technical/cors/Authoritative-Guide-to-CORS-Cross-Origin-Resource-Sharing-for-REST-APIs/)

I'm sure you could find better sources.

I got around this policy by using [this chrome extension](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=en).
Not sure if it's the best idea, but up for any other suggestion.



