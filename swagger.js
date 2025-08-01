const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Players API",
    description: "Players API",
  },
  host: "localhost:8080",
  schemes: ["http", "https"],
};

const outputFile = "./swagger.json";
const endpointFiles = ["./routes/index.js"];

swaggerAutogen(outputFile, endpointFiles, doc);
