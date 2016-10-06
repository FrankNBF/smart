var url = 'http://cbatconsult.com/smartstudent/webservice/';



/* ------------------------- Factory de gestion des utilisateurs ----------------------------------------*/
app.factory('UserFactory', function ($http, $q) {
    factory = {
		// Définition des attributs de la l'entité(factory)
        user:false,
		error:false,
		message:false,
		universites:false,
		faculties:false,
		departments:false,
		classes:false,
		universite:false,
		facultie:false,
		department:false,
		classe:false,
		
		// Définition des méthodes de la l'entité(factory)
		getUser:function (){ return factory.user; },

		getError:function (){ return factory.error; },
		
		getMessage:function (){ return factory.message; },
		
        registerUser: function (user) {
			var defered = $q.defer();
            $.post(url+'register', user)
                .success(function (data, status) {
					result=jQuery.parseJSON(data);
					if(result.error){
						factory.error=true;
						factory.message=result.message;
					}else{
						factory.user = result.user;
						factory.universites=result.universites;
					}
					//console.log(data);
                    defered.resolve(factory)
                })
                .error(function (data, status) {
					factory.error=true;
					factory.message='Error! No connexion to server.';
					defered.resolve(factory);
                })
            return defered.promise;
        },
		
		getStructure:function (source){ 
			var defered = $q.defer();
            $.post(url+'getStructure', source)
                .success(function (data, status) {
					console.log(data);
					result=jQuery.parseJSON(data);
					if(result.error){
						factory.error=true;
						factory.message=result.message;
					}else{
						if(source.type=="facultes") factory.faculties = result.data;
						if(source.type=="departements") factory.departments = result.data;
						if(source.type=="classes") factory.classes = result.data;
					}
                    defered.resolve(factory)
                })
                .error(function (data, status) {
					factory.error=true;
					factory.message='Error! No connexion to server.';
					defered.resolve(factory);
                })
            return defered.promise;
		},
		
		saveClasse:function (source){ 
			var defered = $q.defer();
            $.post(url+'saveClasse', source)
                .success(function (data, status) {
					console.log(data);
					result=jQuery.parseJSON(data);
					if(result.error){
						factory.error=true;
						factory.message=result.message;
					}
                    defered.resolve(factory)
                })
                .error(function (data, status) {
					factory.error=true;
					factory.message='Error! No connexion to server.';
					defered.resolve(factory);
                })
            return defered.promise;
		},
		
		login: function (user) {
			var defered = $q.defer();
            $.post(url+'login', user)
                .success(function (data, status) {
					console.log(data);
					result=jQuery.parseJSON(data);
					if(result.error){
						factory.error=true;
						factory.message=result.message;
					}else{
						factory.user = result.user;
						factory.classe=result.classe;
					}
                    defered.resolve(factory)
                })
                .error(function (data, status) {
					factory.error=true;
					factory.message='Error! No connexion to server.';
					defered.resolve(factory);
                })
            return defered.promise;
        },
	}
    return factory;
});



/* ------------------------- Factory de gestion des events et les news ----------------------------------------*/
app.factory('EventsFactory', function ($http, $q) {
    factory = {
		// Définition des attributs de la l'entité(factory)
		error:false,
		message:false,
		events:false,
		news:false,
		
		// Définition des méthodes de la l'entité(factory)
		getError:function (){ return factory.error; },
		
		getMessage:function (){ return factory.message; },
		
        getEvents: function (source) {
			var defered = $q.defer();
            $.post(url+'getEvents', source)
                .success(function (data, status) {
					console.log(data);
					result=jQuery.parseJSON(data);
					if(result.error){
						factory.error=true;
						factory.message=result.message;
					}else{
						if(source.type=="Event") factory.events = result.data;
						else factory.news = result.data;
					}
                    defered.resolve(factory)
                })
                .error(function (data, status) {
					factory.error=true;
					factory.message='Error! No connexion to server.';
					defered.resolve(factory);
                })
            return defered.promise;
        },
		
		getEvent: function (id) {
			return events[0];
        },
	}
    return factory;
});