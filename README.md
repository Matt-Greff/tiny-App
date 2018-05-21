# TinyApp Project

!["Screenshot of URls page"](https://github.com/Matt-Greff/tiny-App/blob/master/docs/URLS.png?raw=true)
!["Screenshot of new_URL page"](https://github.com/Matt-Greff/tiny-App/blob/master/docs/NEW_URL.png?raw=true)
!["Screenshot of Edit page"](https://github.com/Matt-Greff/tiny-App/blob/master/docs/EDIT.png?raw=true)
!["Screenshot of register page"](https://github.com/Matt-Greff/tiny-App/blob/master/docs/REGISTER.png?raw=true)
!["Screenshot of login page"](https://github.com/Matt-Greff/tiny-App/blob/master/docs/LOGIN.png?raw=true)

- A simple web app that shortens URLS, and keeps data anylitics for each URl made(who clicked, and time of click, totall clicks, unique clicks.) 
- has mock databases within the server file to store this information. all passwords are hashed. 
- all cookies encrypted, adds non legacy http protocols-- DELETE PUT.

##dependencies:
- express
- ejs
- body-parser
- cookie-session
- method-override
- bcrypt
- moment
- moment-time-zone

##Getting Started

- install all depndencies(via npm install)
- Run the development web server using the `node server.js` command