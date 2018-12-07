define(["Vue","text!/demo/components/home/index.html"],function(Vue,template){
	var result={
		template,
		data(){
			return{
				msg:"我是home"
			}
		},
		
		methods:{
			goToGym(){
				this.$router.push({path:"/home/gym"});
			},
			goToCompany(){
				this.$router.push({path:"/home/company"});
			}
		},
		watch:{},
		mounted(){
			
		}
	};
	return result;
});