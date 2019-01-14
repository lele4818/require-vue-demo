 define(["VueRouter"],function(VueRouter){
	var Home = function (resolve) {
			 require(["VueLoader!/demo-sub/components/home/index"], resolve)   //路由懒加载
  };

	var Company = function (resolve) {
        require(["VueLoader!/demo-sub/components/company/index"], resolve)
  };	 
	 
	var Gym = function (resolve) {
	 			require(["VueLoader!/demo-sub/components/gym/index"], resolve)
	};
	
	
	var routes = [
	    { 
				path:"/home", 
				component:Home,
				children:[
					{ path:"gym", component:Gym},
					{ path:"company",component: Company}
				]
			},
			{path:"*",redirect:"/home"}
	];
	                          
	var router = new VueRouter({
	    routes // (缩写) 相当于 routes: routes
	});
	
	return router;
}) 

