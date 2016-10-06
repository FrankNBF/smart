app.controller('appCtrl', function($scope) {
	$scope.header_menu ={
        name:'header',
        url  :'inc/header_menu.html'
    }
    $scope.footer ={
        name:'footer',
        url  :'inc/footer.html'
    }
	$scope.$on('$viewContentLoaded', function(event){ 
		console.log('view is loaded and ready to be use');
		loadPage();
	});
});


/* ------------------------- Controleur de gestion des events ----------------------------------------*/
app.controller('eventsCtrl', function($scope,UserFactory,EventsFactory,$location) {
    console.log('Je suis dans eventsCtrl');
	
	$scope.events=EventsFactory.events;
	$scope.getEvents = function(){
		var source ={
			'type': 'Event',
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


/* ------------------------- Controleur de gestion des news ----------------------------------------*/
app.controller('newsCtrl', function($scope,UserFactory,EventsFactory,$location) {
    console.log('Je suis dans newsCtrl');
	
	$scope.news=EventsFactory.news;
	$scope.getNews = function(){
		var source ={
			'type': 'News',
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
app.controller('userCtrl', function($scope,UserFactory,$location) {
	console.log('Je suis dans USERCTRL');
    var that = this;
	
	$scope.error='';
	$scope.user=UserFactory.getUser();
	$scope.items=UserFactory.universites;
	$scope.university=false;
	$scope.faculty=false;
	$scope.department=false;
	$scope.classe=false;
	$scope.titre='CHOOSE AN UNIVERSITY';
	
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
				$scope.items=UserFactory.faculties;
				$('#universites').hide(1000);
				$('#faculties').show(1000);
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
				$scope.items=UserFactory.departments;
				$('#faculties').hide(1000);
				$('#departments').show(1000);
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
				$scope.items=UserFactory.classes;
				$('#departments').hide(1000);
				$('#classes').show(1000);
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
		$location.url('/home');
    };
});



