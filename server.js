const express = require('express');
const connectDB = require('./config/db');

const app = express();

// connected database
 connectDB();

 // Init Middleware

 //app.use(bodyParser.json()) we can also use this
 app.use(express.json({extended: false})); //so just using this one line should allow us to get data in req.body

app.get('/', ( req, res) => res.send('API Running'));

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));