<template>
	<div id="home">
		<link rel="stylesheet" type="text/css" href="/demo-sub/components/home/index.css"/>
		<span class="spanTitle">{{msg}}</span>
		
		<br>
		
		<button type="button" @click="goToGym">go to gym</button>
		<button type="button" @click="goToCompany">go to company</button>
		<router-view></router-view>
	</div>
</template>

<script>
	define([],function(){
		var result = {
			template,
			data(){
				return{
					msg:"大家好，我是home-vue"
				}
			},
			methods:{
				goToGym(){
					this.$router.push({path:"/home/gym"});
				},
				goToCompany(){
					this.$router.push({path:"/home/company"});
				}
			}
		};
		return result;
	})
</script>

<style>

</style>
