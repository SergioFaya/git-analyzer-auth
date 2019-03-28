const app = module.exports = require('express')();

app.get('/', (_req, res) => {
	res.status(202).send(`<html>
    <body>
        <h1>Endpoints</h1>
        <ul>
            <li>/login</li>
            <li>/login/check</li>
            <li>/logout</li>
            <li>/login</li>
            <li>/installation</li>
            <li>/installation/check</li>
        </ul>
    </body>
</html>`);
});

app.use(require('./routerLogin'));
app.use(require('./routerAuthInstallation'));

app.all('*', (_req,res)=>{
	res.status(404).json({
		success: false,
		message: 'Not found'
	});
});