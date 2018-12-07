/**
 * Vue loader for RequireJS
 *
 * @version 1.0.0
 * @author vikseriq
 * @license MIT
 */
define([], function(){
  'use strict';

  var fetchContent = null;

  if (typeof window !== 'undefined' && window.document){
    if (typeof XMLHttpRequest === 'undefined')
      throw new Error('XMLHttpRequest not available');

    fetchContent = function(url, callback){
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onreadystatechange = function(){
        if (xhr.readyState === 4 && this.status < 400)
          callback(xhr.responseText);
      };
      xhr.send();
    };
  } else {
    throw new Error('Unsupported environment');
  }

  var extractor = {
    /**
     * Extract content surrounded by tag
     */
    _wrapped_content: function(text, tagname, options){
      options = options || {whitespaces: false};
      var start = text.lastIndexOf('<' + tagname);
      if (start < 0)
        return '';
      var s = start;
      start = text.indexOf('>', start) + 1;
      var tag = text.substring(s, start);
      var end = text.indexOf('</' + tagname + '>', start);
      if (options.lastIndex)
        end = text.lastIndexOf('</' + tagname + '>');

      text = text.substring(start, end);

      if (!options.whitespaces)
        text = text.replace(/[\n\r]+(\s{2,})/g, '');

      if (options.escape)
        text = text.replace(/([^\\])'/g, "$1\\'");

      if (text.length == 0){
        start = tag.indexOf('src="');
        if (start){
            start += 5;
            end = tag.indexOf('"', start);
            var src = tag.substring(start, end);
            var url = src;
            if (!(src.charAt(0) == '/' || src.indexOf('://') > 0)) {
                url = this.path.substring(0, this.path.lastIndexOf('/')+1) + src;
            }
            if (options.stylesheet) {
              var html = '<link rel="stylesheet" type="text/css" href="' + url + '"/>'
              return html;
            }
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.send();
            if (xhr.readyState === 4 && xhr.status < 400)
                text = xhr.responseText;
        }
      } else {
          if (options.stylesheet) {
              text = text.replace(/[\r\n]/g,'');
          }
      }
      return text;
    },

    cleanup: function(text){
      return text.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*|<!--[\s\S]*?-->$/, '');
    },

    /**
     * Vue template extractor
     */
    template: function(text){
      var start = text.indexOf('<template');
      var end = text.lastIndexOf('</template>');
      return this._wrapped_content(text, 'template', {lastIndex: true, escape: true})
        .trim();
    },

    /**
     * Component source code extractor
     */
    style: function(text){
      return this._wrapped_content(text, 'style', {stylesheet:arguments[1], escape: !arguments[1]});
    },

    /**
     * Styles extractor
     */
    script: function(text){
      return this._wrapped_content(text, 'script', {whitespaces: true});
    }
  };

  var injector = {
    /**
     * Inject styles to DOM
     */
    style: function(text, dom, path){
      var e = document.createElement('style');
      e.type = 'text/css';
      if (path) {
        e.setAttribute('data-path', path);
      }
      e.appendChild(document.createTextNode(text));
      (dom||document.body).appendChild(e);
    }
  };

  /**
   * Rearrange .vue file to executable content
   * @param text raw file content
   * @returns {string} executable js
   */
  var parse = function(text, path){
    extractor.path = path;
    text = extractor.cleanup(text);
    var findElem = function () {
      var dom = undefined;
      var panels = document.getElementsByClassName("main-content-panel");
      for (var i=0; i<panels.length; i++) {
        var panel = panels[i];
        if (panel.id) {
          var temp = panel.id.replace('_','/');
          if (path.indexOf(temp) != -1) {
              dom = panel;
          }
        }
      }
      return dom;
    };
    //injector.style(extractor.style(text), findElem());
    var script = extractor.script(text);
    var template = extractor.template(text);
    var style = extractor.style(text, true);
    if (style.indexOf('link') !== -1) {
      var index = template.indexOf('>') + 1;
      if (style.length !== 0) {
        template = template.substring(0, index) + style + template.substring(index);
      }
    } else {
      if (style.length > 0) {
        injector.style(style, findElem(), path);
      }
    }
    return '(function(template){'
      + script
      + '})(\''
      + template
      + '\');'
  };

  return {
    version: '1.0.0',

    fetchContent: fetchContent,

    load: function(name, require, load, config){

      var fullName = name + (/\.(vue|html)$/.test(name) ? '' : '.vue');
      var path = require.toUrl(fullName);

      fetchContent(path, function(text){
        load.fromText(parse(text, path));
      });
    }
  }
});