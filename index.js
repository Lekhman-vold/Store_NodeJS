const express = require('express');
const path = require(`path`);
const exphbs = require('express-handlebars');
const csrf = require('csurf')
//const helmet = require('helmet')
const flash = require('connect-flash')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const mongoose = require('mongoose')
const compression = require('compression')
const bodyParser  = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const app = express();
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const orderRoutes = require('./routes/orders')
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const coursesRoutes = require('./routes/courses');
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const errorHandler = require('./middleware/error')
//const fileMiddleware = require('./middleware/file')
const keys = require('./keys')
const multer = require('multer')

const hbs = exphbs.create({
    defaultLayout: "main",
    extname: "hbs",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
});


const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URL
})


app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs');
app.set('views', 'pages');

app.use(express.static(path.join(__dirname, 'public')))

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(multer({dest: 'images'}).single('avatar'))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))
//app.use(fileMiddleware.single('avatar'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(csrf({ cookie: true }))
app.use(varMiddleware)
app.use(flash())
//app.use(helmet())
app.use(compression())
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)
app.use('/orders', orderRoutes)
app.use('/auth', authRouter)
app.use('/profile', profileRouter)

app.use(errorHandler)

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            }, () => console.log('Database connected')
        )
        app.listen(PORT, () => {
            console.log(`Server started ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()