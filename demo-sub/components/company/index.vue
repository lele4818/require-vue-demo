<template>
	<div id="company">
		<link rel="stylesheet" type="text/css" href="/demo-sub/components/company/index.css"/>
		<h1>{{msg}}</h1>
	</div>
</template>

<script>
	define([],function(){
		var result={
			template,
			data(){
				return{
					msg:"我是公司"
				}
			}
		};
		return result;
	});
</script>

<style>

</style>
