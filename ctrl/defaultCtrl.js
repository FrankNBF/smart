app.controller('appCtrl', function($scope, $http, $rootScope) {
	$scope._lang = getSession('_lang');
	$scope.header_menu ={
        name:'header',
        url  :'inc/header_menu.html'
    }
    $scope.footer ={
        name:'footer',
        url  :'inc/footer.html'
    }
	
	$rootScope.$on("LANGUAGE", function(){
           $scope.loadLanguage();
	});
	
	$scope.$on('$viewContentLoaded', function(event){ 
		console.log('view is loaded and ready to be use');
		loadPage();
	});
	
	$scope.doTheBack = function() {
	  window.history.back();
	};	
	
	$scope.loadLanguage = function(){
		if(getSession('user')) lang = getSession('user').LANG; else lang = 'En';
		$http.get('lang/'+lang+'.json').success(function (data, status) { console.log(data); $scope._lang=data; });
		setSession('_lang', $scope._lang);
    };
});


/* ------------------------- Controleur de gestion des events ----------------------------------------*/
app.controller('eventsCtrl', function($scope,UserFactory,EventsFactory,$location,$routeParams) {
    console.log('Je suis dans eventsCtrl');
	$scope.events=EventsFactory.events;
	$scope.getEvents = function(){
		var source ={
			'type': 'Event',
			'classe': getSession('classe').ID_CLASSE,
		};
		res =  EventsFactory.getEvents(source).then(function(response) {
			if(response.getError()){
				$scope.error = response.getMessage();
				$scope.initError();
			}else{
				$scope.events=response.events;
				loadPage();
			}
		});
    };
	$scope.getEvents();
});



/* ------------------------- Controleur de gestion d'une news ----------------------------------------*/
app.controller('newCtrl', function($scope,EventsFactory,$location,$routeParams, $sce) {
    console.log('Je suis dans newCtrl');
	var path = $location.path();
	var e = path.indexOf("events");
	if(e!=-1) $scope.row=EventsFactory.getEvent($routeParams.id);
	else $scope.row=EventsFactory.getNews($routeParams.id);
	console.log($routeParams.id);
	console.log($scope.row);
	$scope.description=$sce.trustAsHtml($scope.row.DESCRIPTION);
	console.log($scope.description);
});


/* ------------------------- Controleur de gestion des news ----------------------------------------*/
app.controller('newsCtrl', function($scope,UserFactory,EventsFactory,$location) {
    console.log('Je suis dans newsCtrl');
	
	$scope.news=EventsFactory.news;
	$scope.classe=getSession("classe");
	$scope.getNews = function(){
		var source ={
			'type': 'News',
			'classe': getSession('classe').ID_CLASSE,
		};
		res =  EventsFactory.getEvents(source).then(function(response) {
			if(response.getError()){
				$scope.error = response.getMessage();
				$scope.initError();
			}else{
				$scope.news=response.news;
				loadPage();
			}
		});
    };
	$scope.getNews();
});


/* ------------------------- Controleur de gestion des utilisateurs ----------------------------------------*/
app.controller('userCtrl', function($scope,UserFactory,$location,$rootScope) {
	console.log('Je suis dans USERCTRL');
    var that = this;
	
	$scope.error='';
	$scope.user=getSession('user');
	$scope.items=UserFactory.universites;
	$scope.university=false;
	$scope.faculty=false;
	$scope.department=false;
	$scope.classe=getSession('classe');
	$scope.titre='CHOOSE YOUR UNIVERSITY';
	$scope.lanquage1='';
	$scope.lanquage2='';
	$scope.lang1='';
	$scope.lang2='';
	
	$scope.init = function () {
		if($scope.user) {
			$location.url('/menu');
		}
	};
	
	$scope.registerUser = function(){
		if($scope.password!=$scope.password2){
			$scope.error='Error ! Please enter the same  password';
		}else{
			var user ={
				'matricule': $scope.matricule,
				'phone': $scope.phone,
				'name': $scope.name,
				'password':$scope.password,
				'email':$scope.email,
			};
			that.user=user;
			that.registerResult =  UserFactory.registerUser(that.user).then(function(response) {
				if(response.getError()){
					$scope.error = response.getMessage();
					$scope.initError();
				}else{
					$location.url('/classes');
				}
			});
		}
    };
	
	$scope.updateAccount = function(){
		that.updateResult =  UserFactory.updateUser($scope.user).then(function(response) {
			if(response.getError()){
				$scope.error = response.getMessage();
				$scope.initError();
			}else{
				window.localStorage.removeItem("user");
				setSession("user", UserFactory.getUser());
				$location.url('/user');
			}
		});
    };
	
	$scope.showLanguage = function(){
		if($scope.user.LANG == 'En') {
			$scope.language1 ='Vous pouvez changer la langue pour le Français en cliquant ci-dessus.';
			$scope.language2 ='La nouvelle langue sera prise en compte après reconnexion.';
			$scope.lang1='En';
			$scope.lang2='Fr';
		} else {
			$scope.language1 ='You can change the language for the English by clicking above.';
			$scope.language2 ='The new language will be taken into account after reconnection.';
			$scope.lang1='Fr';
			$scope.lang2='En';
		}
    };
	
	$scope.switchLanguage = function(){
		if($scope.user.LANG == 'En') {
			$scope.user.LANG='Fr';
		} else {
			$scope.user.LANG='En';
		}
    };
	
	$scope.choiceUniv = function(id){
		$scope.titre='CHOOSE A FACULTY';
		console.log('Je suis dans choiceUniv '+id);
		$scope.university=id;
		var source ={
			'type': 'facultes',
			'universite': id,
		};
		res =  UserFactory.getStructure(source).then(function(response) {
			if(response.getError()){
				$scope.error = response.getMessage();
				$scope.initError();
			}else{
				$scope.items=response.faculties;
				$('#universites').hide(500);
				$('#faculties').show(500);
			}
		});
    };
	
	$scope.choiceFac = function(id){
		$scope.titre='CHOOSE A DEPARTMENT';
		console.log('Je suis dans choiceFac '+id);
		$scope.faculty=id;
		var source ={
			'type': 'departements',
			'universite': $scope.university,
			'faculte': id,
		};
		res =  UserFactory.getStructure(source).then(function(response) {
			if(response.getError()){
				$scope.error = response.getMessage();
				$scope.initError();
			}else{
				$scope.items=response.departments;
				$('#faculties').hide(500);
				$('#departments').show(500);
			}
		});
    };
	
	$scope.choiceDep = function(id){
		$scope.titre='CHOOSE A CLASS';
		console.log('Je suis dans choiceDep '+id);
		$scope.department=id;
		var source ={
			'type': 'classes',
			'universite': $scope.university,
			'faculte': $scope.faculty,
			'departement': id,
		};
		res =  UserFactory.getStructure(source).then(function(response) {
			if(response.getError()){
				$scope.error = response.getMessage();
				$scope.initError();
			}else{
				$scope.items=response.classes;
				$('#departments').hide(500);
				$('#classes').show(500);
			}
		});
    };
	
	$scope.choiceCla = function(id){
		console.log('Je suis dans choiceCla '+id);
		$scope.classes=id;
		var source ={
			'classe': $scope.classes,
			'etudiant': UserFactory.getUser().ID_ETUDIANT,
		};
		res =  UserFactory.saveClasse(source).then(function(response) {
			if(response.getError()){
				$scope.error = response.getMessage();
				$scope.initError();
			}else{
				$('.cover-page.cover-image').remove();
				$('.coverpage-slider').show();
				loadPage();
			}
		});
    };
	
	$scope.loginUser = function(){
		var user ={
			'login': $scope.login,
			'password': $scope.password,
		};
		that.registerResult =  UserFactory.login(user).then(function(response) {
			if(response.getError()){
				$scope.error = response.getMessage();
				$scope.initError();
			}else{
				setSession("user", UserFactory.getUser());
				setSession("classe", UserFactory.getUserClasse());
				console.log(getSession("user").EMAIL);
				$rootScope.$emit("LANGUAGE", {});
				$location.url('/menu');
			}
		});
    };
	
	$scope.initError = function(){
		UserFactory.error=false;
		UserFactory.message=false;
    };
	
	$scope.logoutUser = function(){
		UserFactory.user=false;
		window.localStorage.removeItem("user");
		window.localStorage.removeItem("classe");
		$location.url('/home');
    };
	
});


/* ------------------------- Controleur de gestion des emplois de temps ----------------------------------------*/
app.controller('timetableCtrl', function($scope,TimetableFactory, $location) {
	
    console.log('Je suis dans timetableCtrl');
	$scope.error='';
	$scope.date=getdate(new Date());
	$scope.classe=getSession("classe");
	$scope.timetable=TimetableFactory.timetables;
	
	$scope.dateChanged = function(){
		var source ={
			'classe': $scope.classe.ID_CLASSE,
			'date': $scope.date,
		};
		res =  TimetableFactory.getTimetables(source).then(function(response) {
			if(response.getError()){
				$scope.error = response.getMessage();
				$scope.initError();
				$scope.timetable=false;
			}else{
				$scope.timetable=response.timetables;
				$scope.error='';
				loadPage();
			}
			
		});
    };
	
	$scope.initError = function(){
		TimetableFactory.error=false;
		TimetableFactory.message=false;
    };
	$scope.dateChanged();
});


/* ------------------------- Controleur de gestion des notifications ----------------------------------------*/
app.controller('notificationsCtrl', function($scope,NotificationsFactory, $location) {
	
    console.log('Je suis dans notificationsCtrl');
	$scope.error='';
	$scope.notifications=NotificationsFactory.notifications;
	
	$scope.getNotifications = function(){
		var source ={
			'user': getSession("user").ID_ETUDIANT,
		};
		res =  NotificationsFactory.getNotifications(source).then(function(response) {
			if(response.getError()){
				$scope.error = response.getMessage();
				$scope.initError();
			}else{
				$scope.notifications=response.notifications;
				loadPage();
			}
		});
    };
	$scope.getNotifications();
	
	$scope.initError = function(){
		NotificationsFactory.error=false;
		NotificationsFactory.message=false;
    };
});