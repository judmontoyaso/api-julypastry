// hacer el import de express tradicional
// const express = require('express');

// hacer el nuevo import
import dotenv from "dotenv";
import Express from "express";
import Cors from "cors";
import { connectServer } from "./db/db.js";
import jwt from "express-jwt";
import jwks from "jwks-rsa";

import rutasProducto from "./views/products/route.js";
import rutasUsuario from "./views/users/route.js";
import rutasVentas from "./views/sale/router.js";

dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 5000;
const app = Express();

app.use(Express.json());
app.use(Cors({origin: '*'}));
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://julypastry.us.auth0.com/.well-known/jwks.json",
  }),
  audience: "api-autenticacion-julyspastry",
  issuer: "https://julypastry.us.auth0.com/",
  algorithms: ["RS256"],
});

app.use(jwtCheck);

app.use(rutasProducto);
app.use(rutasUsuario);
app.use(rutasVentas);

const main = () => {
  return app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
};

connectServer(main);
