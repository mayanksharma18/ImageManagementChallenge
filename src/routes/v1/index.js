const express = require('express');
const imageRoute = require('./image.route');


const router = express.Router();

const routes = [
  {
    path: '/image',
    route: imageRoute,
  }
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
