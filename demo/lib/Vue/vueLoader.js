/**
 * 组件加载器
 */

//缓存Vue对象
var pool = {};


define([], () => {
    //根据path获取名称
    function cal(path) {
        let r = path.split('/');
        return r[r.length - 1];
    }

    return {
        /**
         * 加载全局配置单
         * @param configs
         */
        config(configs, res){
            return new Promise(() => {
                configs.forEach((path, index) => {
                    require(['text!../components/' + path + '.html', '../components/' + path], (html, js) => {
                        let v = {
                            template: html,
                            mixins: [
                                js
                            ]
                        };
                        pool[path] = v;
                        let name = cal(path);
                        Vue.component('v-' + name, pool[path]);
                        if (res && index == configs.length - 1)
                            res();
                    });
                });
            });
        },
        /**
         * 加载指定path的组件，返回Promise
         * @param path
         * @returns {function(*)}
         */
        load(path){
            return res => {
                let t;
                if (t = pool[path])
                    res(t);
                else
                    require(['text!../components/' + path + '.html', '../components/' + path], (html, js) => {
                        let v = {
                            template: html,
                            mixins: [
                                js
                            ]
                        };
                        pool[path] = v;
                        res(v);
                    });
            }
        }
    };
});