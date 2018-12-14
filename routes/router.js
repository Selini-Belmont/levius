/*===================================================
	WEB APP ROUTER
===================================================*/
var express = require('express');
var router = express.Router();


/*	STATIC PAGES
===================================================*/
// index page
router.get('/', function(req, res, next) {
	res.render('index', {});
});

// about page
router.get('/sobre', function(req, res, next){
	res.render('sobre', {});
});

// contact page
router.get('/contato', function(req, res, next){
	res.render('contato', {});
});



/*	LOGIN STUFF
===================================================*/
// login view
router.get('/login', function(req, res, next){
	if( req.session.uid ){
		res.redirect('/chat');
	}
	else res.render('login', { error: false });
});

// login action
router.post('/login', function(req, res, next){
	if( req.session.uid ){
		res.redirect('/chat');
	}
	else if( req.body.user && req.body.pass ){
		// Check on db
		//correct = false;
		if( req.body.user == '123456' && req.body.pass == '12345' ){
			if( req.session.pid )
				delete req.session.pid;
			req.session.uid = 1;
			req.session.data = {
				name: "Luana",
				picture: "img/pic.jpg",
				crm: "123456",
				about: "Cat ipsum dolor at nanum etc..."
			}
			res.redirect("/chat");
		}
		else res.render('login', { error: true, msg: 'Usuário ou senha incorreto'});
	}
	else res.render('login', { error: true, msg: 'Preencha os campos abaixo!'});
});

// logout
router.get('/logout', function(req, res, next){
	if( req.session.uid ){
		req.session.destroy();
		res.redirect('/');
	}
});



/*	CHAT STUFF
===================================================*/
router.get('/chat', function(req, res, next){
	if( req.session.uid || req.session.pid ){
		// Render chat
		var psycho = (req.session.uid) ? true : false;
		res.render('chat', {is_psycho: psycho});
	}
	else res.redirect('/');	
});

router.post('/chat', function(req, res, next){
	if( req.session.uid ){
		res.redirect('/login');
	}
	else if( req.session.pid ){
		res.render('chat', {is_psycho: false});
	}
	else{
		var name = req.body.name,
			email = req.body.email;
		if( !req.body.name )
			name = "Anônimo";
		req.session.pid = 0;
		req.session.data = {
			name: name,
			email: email
		};
		res.render('chat', {is_psycho: false});
	}
});


module.exports = router;
