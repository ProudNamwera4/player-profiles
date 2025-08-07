//routes/swagger.js
const express = require("express");
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

router.get("/api-docs", (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.send(`
      <h1>Swagger UI</h1>
      <p><a href="/github">Login with GitHub to use API</a></p>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
      <script>
        SwaggerUIBundle({
          url: '/swagger.json',
          dom_id: '#swagger-ui',
          withCredentials: true
        });
      </script>
    `);
  }
  next();
});

router.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      withCredentials: true,
    },
  })
);

module.exports = router;
