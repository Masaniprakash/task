const express = require("express");
const cors = require("cors");
const { CONFIG } = require("./config/configData");
const passport = require('passport');
require("./middleware/passport")(passport);
const db = require("./models");
const PORT = CONFIG.port;
const { socketConfig } = require("./config/socket");

const app = express();
app.use(cors());

app.use(passport.initialize());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// parse requests of content-type - application/json
app.use(express.json({ limit: '50mb' }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const userRoute=require('./routes/user.routes');
const { scheduleData } = require("./controllers/common");

app.use('/api/user',userRoute);

scheduleData()

const server=app.listen(PORT, async () => {
    console.log(`Server is listening to port ${PORT} 🚀`);
});

socketConfig(server);