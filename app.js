const express = require('express');
const app = express();
const apiRoutes = require('./routes/api');

app.use(express.json());
app.get('/', (req, res) => {
  res.send('✅ Backend is working: chitkara__test is live!');
});
app.use('/', apiRoutes);

const PORT = process.env.PORT|| 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
