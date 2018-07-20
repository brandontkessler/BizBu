Facebook Auth is currently hidden, to unhide, follow these steps:
* in app/auth - unhide all three hidden areas
* development.json file, stayed as is
* in config/index - unhide the FB portion
* in app/helpers/success-handler/auth-factory - unhide FB portion
* in app/models/user - unhide FB portion
* in app/routes/auth/social - unhide all 3 FB portions and exports
* in app/routes/auth/index - unhide the three require functions and combine with the rest of the auth functions. Unhide the two FB ROUTES
* in views/home/get-started - unhide the FB button
