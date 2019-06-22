const app = module.exports = require('express')();
app.use(require('./routerLogin'));
app.use(require('./routerAuthInstallation'));

app.all('*', (_req,res)=>{
	res.status(404).json({
		success: false,
		message: 'Not found'
	});
});