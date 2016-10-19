document.addEventListener('deviceready', function(){ 
    // Code au lancement de l'application
}, false);

//Ici on importe tous les plugins nécessaires dans l'application
var app =angular.module('smartstudent',['ngRoute']);


//Ici on déclare toutes les routes 
app.config(function($routeProvider){
    $routeProvider
        .when('/',{templateUrl:'inc/home.html'})
        .when('/home',{templateUrl:'inc/home.html'} )
        .when('/register', {templateUrl:'inc/register.html'})
		.when('/classes', {templateUrl:'inc/classes.html'})
        .when('/menu', {templateUrl:'inc/menu.html'})
        .when('/events', {templateUrl:'inc/events.html'})
		.when('/events/:id', {templateUrl:'inc/new.html'})
		.when('/news', {templateUrl:'inc/news.html'})
		.when('/news/:id', {templateUrl:'inc/new.html'})
        .otherwise({redirectTo : '/home'});
});
