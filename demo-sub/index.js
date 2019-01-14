requirejs.config({
	baseUrl: "lib",
    paths: {
        "Vue": "Vue/vue",
        "VueRouter": "Vue/vueRouter",
        "router": "router/router",
        "text": "text/text",
		"VueLoader": "requirejs-vueLoader/VueLoader"//未使用 .vue解析解析有问题
    }
});

require(["Vue","VueRouter","router"], function(Vue,VueRouter,router) {
	Vue.use(VueRouter)
    const app = new Vue({
        el: "#app",
        router
    })
});