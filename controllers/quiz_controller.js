//GET /question
var  models = require('../models');
// Autoload el quiz asociado a :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId)
  		.then(function(quiz) {
      		if (quiz) {
        		req.quiz = quiz;
        		next();
      		} else { 
      			throw new Error('No existe quizId=' + quizId);
      		}
        })
        .catch(function(error) { next(error); });
};

exports.index = function(req,res,next){
	if(req.query.search!==undefined){
		models.Quiz.findAll({where: {question: {$like: "%"+req.query.search+"%"}}}).then(function(quizzes){
			res.render('quizzes/index',{ quizzes: quizzes});
		});
	}
		else{
			models.Quiz.findAll().then(function(quizzes){
			res.render('quizzes/index',{ quizzes: quizzes});
	}).catch(function(error){next(error);});
		}
	
};

exports.show = function(req,res,next){
	
	models.Quiz.findById(req.params.quizId).then(function(quiz){
		if(quiz){
			var answer = req.query.answer || '';
			res.render('quizzes/show',{quiz: req.quiz,
									answer: answer});
		}else{
			throw new Error('No hay preguntas en la BBDD.');
		}
	}).catch(function(error){next(error);});
};

//GET /check

exports.check = function(req,res,next){
	
models.Quiz.findById(req.params.quizId).then(function(quiz){
		if(quiz){
			var answer = req.query.answer || '';
			var result = answer === req.quiz.answer ? 'Correcta' : 'Incorrecta' ;
			res.render('quizzes/result', { quiz: req.quiz, result: result,answer: answer});
		}else{
			throw new Error('No hay preguntas en la BBDD.');
		}
	}).catch(function(error){next(error);});
};

exports.author = function(req,res,next){
	res.render('quizzes/author');
};
// GET /quizzes/new
exports.new = function(req, res, next) {


    var quiz = models.Quiz.build({question: "", answer: ""});
    res.render('quizzes/new', {quiz: quiz});
};

// POST /quizzes/create
exports.create = function(req, res, next) {

    var quiz =  models.Quiz.build({ question: req.body.quiz.question, 
                 answer:   req.body.quiz.answer});

    // Guarda en la tabla Quizzes el nuevo quiz.
    quiz.save({fields : ["question", "answer"]})
    .then(function(quiz) {
        req.flash('success', 'Pregunta y Respuesta guardadas con éxito.');
        res.redirect('/quizzes');
    }).catch(function(error) {
        req.flash('error', 'Error al crear un Quiz: '+error.message);
        next(error);
    }); 
};

