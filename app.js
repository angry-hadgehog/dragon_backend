const express        = require('express');
const path           = require('path');
const favicon        = require('serve-favicon');
const logger         = require('morgan');
const cookieParser   = require('cookie-parser');
const bodyParser     = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const session        = require('express-session');
const validate       = require('./middleware/validate');
const messages       = require('./middleware/messages');
const user           = require('./middleware/user');

const login    = require('./routes/login');
const entries  = require('./routes/entries');
const register = require('./routes/register');

const api = require('./routes/api');

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
                    secret: 'secret',
                    resave: false, saveUninitialized: true
                }));
app.use(sassMiddleware({
                           src:            path.join(__dirname, 'public'),
                           dest:           path.join(__dirname, 'public'),
                           indentedSyntax: false, // true = .sass and false = .scss
                           sourceMap:      true
                       }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api.auth);
app.use(user);
app.use(messages);

app.get('/', entries.list);
app.get('/post', entries.form);
app.post('/post',
         validate.required('entry[title]'),
         validate.lengthAbove('entry[title]', 4),
         entries.submit);
app.get('/register', register.form);
app.post('/register', register.submit);
app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);

app.get('/api/user/:id', api.user);
app.get('/api/entries/:page?', api.entries);
app.post('/api/entry', api.add);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err  = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error   = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
