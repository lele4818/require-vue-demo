define(["Vue","VueRouter"],function(Vue,VueRouter){
	const Home = function (resolve) {
        require(["../components/home/index"], resolve)   //路由懒加载
  };

	const Company = function (resolve) {
        require(["../components/company/index"], resolve)
  };	 
	 
	 const Gym = function (resolve) {
	 			require(["../components/gym/index"], resolve)
	};
	
	
	const routes = [
	    { 
				path:"/home", 
				component:Home,
				redirect: {name:"Gym"},
				children:[
					{ path:"gym", component:Gym,name:"Gym"},
					{ path:"company",component: Company}
				]
			},
			{path:"*",redirect:"/home"}
	];
	                          
	const router = new VueRouter({
	    routes // (缩写) 相当于 routes: routes
	});
	
	return router;
})

