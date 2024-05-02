# Big Feelings (Starter)

A simpler version of the [Big Feelings](https://big-feelings.glitch.me/) project that appears in Chapter 10 "Design & Power" in Critical Web Design by xtine burrough and Owen Mundy (MIT Press, 2025).


## How does it work?

This project uses Node.js (backend) to returns data to the browser (frontend).

- `public/index.html`: The frontend for the API, uses client side JS to make requests to the server.
- `server.js`: [Node.js](https://nodejs.org/en/about/) runs Javascript in the backend using the [Fastify](https://www.fastify.io/) framework to start the server and import the `routes.js` file
- `database.js` creates the database connection
- `routes.js` contains the endpoints that return data
- `package.json`: The NPM packages for project dependencies

## Notes

- See [README.md](https://glitch.com/edit/#!/big-feelings) in the original project
