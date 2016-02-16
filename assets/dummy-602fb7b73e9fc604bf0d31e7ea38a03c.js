define("dummy/app",["exports","ember","ember/resolver","ember/load-initializers","dummy/config/environment"],function(e,t,r,n,o){"use strict";var l;t["default"].MODEL_FACTORY_INJECTIONS=!0,l=t["default"].Application.extend({modulePrefix:o["default"].modulePrefix,podModulePrefix:o["default"].podModulePrefix,Resolver:r["default"]}),n["default"](l,o["default"].modulePrefix),e["default"]=l}),define("dummy/components/basic-dropdown",["exports","ember-basic-dropdown/components/basic-dropdown"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/components/color-palette/component",["exports","ember-palette/components/color-palette/component"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/components/ember-palette-selected/component",["exports","ember-palette/components/ember-palette-selected/component"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/components/ember-wormhole",["exports","ember-wormhole/components/ember-wormhole"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/components/google-map/component",["exports","ember"],function(e,t){"use strict";var r=t["default"].on;e["default"]=t["default"].Component.extend({map:null,center:new google.maps.LatLng(42.43540000000001,-71.11295997924805),initMap:r("didInsertElement",function(){var e=this.get("center"),t=this.get("zoom"),r=this.$("#map").get(0);this.setup(r,e,t)}),setup:function(e,t,r){var n;google.maps.visualRefresh=!0;var o={zoom:r||10,maxZoom:19,center:t};return n=new google.maps.Map(e,o),window.gmap=n,this.setProperties({map:n}),n}})}),define("dummy/components/google-map/template",["exports"],function(e){"use strict";e["default"]=Ember.HTMLBars.template(function(){return{meta:{revision:"Ember@1.13.5",loc:{source:null,start:{line:1,column:0},end:{line:2,column:0}},moduleName:"dummy/components/google-map/template.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),r=e.createElement("div");e.setAttribute(r,"id","map"),e.appendChild(t,r);var r=e.createTextNode("\n");return e.appendChild(t,r),t},buildRenderNodes:function(){return[]},statements:[],locals:[],templates:[]}}())}),define("dummy/components/google-maps-markup/component",["exports","google-maps-markup/components/google-maps-markup/component"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/components/markup-result-item/component",["exports","google-maps-markup/components/markup-result-item/component"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/components/power-select-multiple",["exports","ember-power-select/components/power-select-multiple"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/components/power-select-multiple/options",["exports","ember-power-select/components/power-select-multiple/options"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/components/power-select-multiple/trigger",["exports","ember-power-select/components/power-select-multiple/trigger"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/components/power-select",["exports","ember-power-select/components/power-select"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/components/power-select/before-options",["exports","ember-power-select/components/power-select/before-options"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/components/power-select/options",["exports","ember-power-select/components/power-select/options"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/components/power-select/trigger",["exports","ember-power-select/components/power-select/trigger"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/controllers/array",["exports","ember"],function(e,t){"use strict";e["default"]=t["default"].Controller}),define("dummy/controllers/object",["exports","ember"],function(e,t){"use strict";e["default"]=t["default"].Controller}),define("dummy/helpers/ember-power-select-build-selection",["exports","ember-power-select/helpers/ember-power-select-build-selection"],function(e,t){"use strict";e["default"]=t["default"],e.emberPowerSelectBuildSelection=t.emberPowerSelectBuildSelection}),define("dummy/helpers/ember-power-select-option-classes",["exports","ember-power-select/helpers/ember-power-select-option-classes"],function(e,t){"use strict";e["default"]=t["default"],e.emberPowerSelectOptionClasses=t.emberPowerSelectOptionClasses}),define("dummy/helpers/get",["exports","ember","ember-get-helper/helpers/get","ember-get-helper/helpers/get-glimmer"],function(e,t,r,n){"use strict";var o=null;t["default"].Helper?o=n["default"]:t["default"].HTMLBars.makeBoundHelper&&(o=t["default"].HTMLBars.makeBoundHelper(r.getHelper)),e["default"]=o}),define("dummy/helpers/hash",["exports","ember-hash-helper-polyfill/helpers/hash"],function(e,t){"use strict";e["default"]=t["default"],e.hash=t.hash}),define("dummy/helpers/is-equal",["exports","google-maps-markup/helpers/is-equal"],function(e,t){"use strict";e["default"]=t["default"],e.isEqual=t.isEqual}),define("dummy/helpers/present",["exports","google-maps-markup/helpers/present"],function(e,t){"use strict";e["default"]=t["default"],e.present=t.present}),define("dummy/index",["exports","ember-uuid"],function(e,t){"use strict";e.v4=t.v4,e.v1=t.v1,e.parse=t.parse,e.unparse=t.unparse}),define("dummy/initializers/export-application-global",["exports","ember","dummy/config/environment"],function(e,t,r){"use strict";function n(e,n){if(r["default"].exportApplicationGlobal!==!1){var o,l=r["default"].exportApplicationGlobal;o="string"==typeof l?l:t["default"].String.classify(r["default"].modulePrefix),window[o]||(window[o]=n,n.reopen({willDestroy:function(){this._super.apply(this,arguments),delete window[o]}}))}}e.initialize=n,e["default"]={name:"export-application-global",initialize:n}}),define("dummy/initializers/get-helper",["exports","ember","ember-get-helper/utils/register-helper","ember-get-helper/helpers/get","ember-get-helper/helpers/get-glimmer"],function(e,t,r,n,o){"use strict";function l(){t["default"].Helper||r.registerHelper("get",n["default"])}e.initialize=l,e["default"]={name:"get-helper",initialize:l}}),define("dummy/instance-initializers/app-version",["exports","dummy/config/environment","ember"],function(e,t,r){"use strict";var n=r["default"].String.classify,o=!1;e["default"]={name:"App Version",initialize:function(e){if(!o){var l=n(e.toString());r["default"].libraries.register(l,t["default"].APP.version),o=!0}}}}),define("dummy/router",["exports","ember","dummy/config/environment"],function(e,t,r){"use strict";var n=t["default"].Router.extend({location:r["default"].locationType});n.map(function(){}),e["default"]=n}),define("dummy/services/markup-data",["exports","google-maps-markup/services/markup-data"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/templates/application",["exports"],function(e){"use strict";e["default"]=Ember.HTMLBars.template(function(){return{meta:{revision:"Ember@1.13.5",loc:{source:null,start:{line:1,column:0},end:{line:16,column:0}},moduleName:"dummy/templates/application.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),r=e.createElement("h2");e.setAttribute(r,"id","title");var n=e.createTextNode("google-maps-markup");e.appendChild(r,n),e.appendChild(t,r);var r=e.createTextNode("\n\n");e.appendChild(t,r);var r=e.createElement("div");e.setAttribute(r,"class","container-fluid");var n=e.createTextNode("\n  ");e.appendChild(r,n);var n=e.createElement("div");e.setAttribute(n,"class","row");var o=e.createTextNode("\n    ");e.appendChild(n,o);var o=e.createElement("div");e.setAttribute(o,"class","col-md-6 col-sm-12");var l=e.createTextNode("\n      ");e.appendChild(o,l);var l=e.createComment("");e.appendChild(o,l);var l=e.createTextNode("\n    ");e.appendChild(o,l),e.appendChild(n,o);var o=e.createTextNode("\n    ");e.appendChild(n,o);var o=e.createElement("div");e.setAttribute(o,"class","col-md-6 col-sm-12");var l=e.createTextNode("\n      ");e.appendChild(o,l);var l=e.createComment("");e.appendChild(o,l);var l=e.createTextNode("\n    ");e.appendChild(o,l),e.appendChild(n,o);var o=e.createTextNode("\n  ");e.appendChild(n,o),e.appendChild(r,n);var n=e.createTextNode("\n");e.appendChild(r,n),e.appendChild(t,r);var r=e.createTextNode("\n\n");e.appendChild(t,r);var r=e.createComment("");e.appendChild(t,r);var r=e.createTextNode("\n\n");return e.appendChild(t,r),t},buildRenderNodes:function(e,t,r){var n=e.childAt(t,[2,1]),o=new Array(3);return o[0]=e.createMorphAt(e.childAt(n,[1]),1,1),o[1]=e.createMorphAt(e.childAt(n,[3]),1,1),o[2]=e.createMorphAt(t,4,4,r),o},statements:[["inline","google-maps-markup",[],["map",["subexpr","@mut",[["get","map",["loc",[null,[6,31],[6,34]]]]],[],[]],"editable",!0,"panForOffscreen",!1,"autoResetToPan",!0],["loc",[null,[6,6],[6,92]]]],["inline","google-map",[],["map",["subexpr","@mut",[["get","map",["loc",[null,[9,23],[9,26]]]]],[],[]]],["loc",[null,[9,6],[9,28]]]],["content","outlet",["loc",[null,[14,0],[14,10]]]]],locals:[],templates:[]}}())}),define("dummy/utils/create-circle",["exports","google-maps-markup/utils/create-circle"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/utils/create-feature",["exports","google-maps-markup/utils/create-feature"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/utils/css-color",["exports","ember-palette/utils/css-color"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/utils/drawing-modes",["exports","google-maps-markup/utils/drawing-modes"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/utils/feature-center",["exports","google-maps-markup/utils/feature-center"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/utils/get-measurement",["exports","google-maps-markup/utils/get-measurement"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/utils/guid",["exports","google-maps-markup/utils/guid"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/utils/init-measure-label",["exports","google-maps-markup/utils/init-measure-label"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/utils/label-plotter",["exports","google-maps-markup/utils/label-plotter"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/utils/map-label",["exports","google-maps-markup/utils/map-label"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/utils/measure-type-result",["exports","google-maps-markup/utils/measure-type-result"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/utils/miles",["exports","google-maps-markup/utils/miles"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/utils/modes",["exports","google-maps-markup/utils/modes"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/utils/number-commas",["exports","google-maps-markup/utils/number-commas"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/utils/overlay-to-feature",["exports","google-maps-markup/utils/overlay-to-feature"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/utils/path-distance",["exports","google-maps-markup/utils/path-distance"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/utils/paths-to-bounds",["exports","google-maps-markup/utils/paths-to-bounds"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/utils/shape-area",["exports","google-maps-markup/utils/shape-area"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/utils/square-miles",["exports","google-maps-markup/utils/square-miles"],function(e,t){"use strict";e["default"]=t["default"]}),define("dummy/utils/uuid-generator",["exports","ember-uuid/utils/uuid-generator"],function(e,t){"use strict";e["default"]=t["default"],e.v4=t.v4,e.v1=t.v1,e.parse=t.parse,e.unparse=t.unparse}),define("dummy/config/environment",["ember"],function(e){var t="dummy";try{var r=t+"/config/environment",n=e["default"].$('meta[name="'+r+'"]').attr("content"),o=JSON.parse(unescape(n));return{"default":o}}catch(l){throw new Error('Could not read config from meta tag with name "'+r+'".')}}),runningTests?require("dummy/tests/test-helper"):require("dummy/app")["default"].create({name:"google-maps-markup",version:"1.19.3+1bf47db3"});