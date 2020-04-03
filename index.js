const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const apiRoutev1 = require('./routes/v1/routes');
const apiRoutev2 = require('./routes/v2/routes');

dotenv.config({ path: './config/config.env'});

const app = express();
app.use(cors());

app.use('/api/v1', apiRoutev1);
app.use('/api/v2', apiRoutev2);

app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
