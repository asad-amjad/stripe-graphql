const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../schema');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // replace with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: false, // if you need to send cookies or other credentials
}));

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
