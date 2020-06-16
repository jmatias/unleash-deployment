const unleash = require('unleash-server');
const {User} = require('unleash-server/lib/server-impl');
const auth = require('basic-auth');


console.log(`Username: ${process.env.UNLEASH_USERNAME}`);
console.log(`Database: ${process.env.UNLEASH_DATABASE}`);
console.log(`Database URL: ${process.env.UNLEASH_DATABASE_URL}`);

function basicAuthentication(app) {
    app.use('/api/admin/', (req, res, next) => {
        const credentials = auth(req);
        console.log(credentials)

        if (credentials) {
            // TODO  - fixme
            if (credentials.pass === 'admin') {
                // you will need to do some verification of credentials here.
                const user = new User({email: `${credentials.name}@admin.com`, id: 1, name: 'Admin'});
                req.user = user;
                return next();
            }
        }

        return res
            .status('401')
            .set({'WWW-Authenticate': 'Basic realm="example"'})
            .end('access denied');
    });

    app.use((req, res, next) => {
        // Updates active sessions every hour
        req.session.nowInHours = Math.floor(Date.now() / 3600e3);
        next();
    });
}


unleash
    .start({
        databaseUrl: `postgres://${process.env.UNLEASH_USERNAME}:${process.env.UNLEASH_PASSWORD}@${process.env.UNLEASH_DATABASE_URL}:5432/${process.env.UNLEASH_DATABASE}`,
        ui: {
            headerBackground: `${process.env.HEADER_BACKGROUND_COLOR}`
        },
        port: 4242,
        adminAuthentication: 'none',
        getLogger: function (name) {
            // do something with the name
            return {
                debug: console.log,
                info: console.log,
                warn: console.log,
                error: console.error,
            };
        }

    })
    .then(unleash => {

        console.log(
            `Unleash started on http://${process.env.UNLEASH_HOST_URL}`,
        );
    });
