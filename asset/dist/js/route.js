define(["backbone","view/LeftMenuView","view/TopMenuView","view/TopicListView","view/TopicDetailView","view/TopicCreateView","view/UserListView","view/UserDetailView","util"],function(e,t,n,r,i,s,o,u,a){_.extend(e.Model.prototype,{validate:function(e,t){var n={},r;for(var i in e)r=this.validateItem(i,e[i]),r&&(n[i]=r);return!_.isEmpty(n)&&n},validateItem:function(e,t){return this.validators=this.validators||{},this.validators[e]?this.validators[e](t):!1}});var f=function(){$(document).scrollTop(0)},l=e.Router.extend({routes:{"":"topics",topics:"topics","topics/p:page":"topics","topics/search/:text":"search","topics/search/:text/p:page":"search","topics/create":"topicCreate","topics/:id":"topicDetail",users:"users","users/p:page":"users","users/:username":"user","users/:username/likes":"user","users/:username/comments":"user"},initialize:function(){this.topMenuView=new n},topics:function(e){a.alert.load(),e=e||1,new r({page:e}),this.topMenuView.select(".js-topics-link")},search:function(e,t){t=t||1,new r({search:e,page:t}),this.topMenuView.select(".js-topics-link")},topicDetail:function(e){new i({id:e}),this.topMenuView.select(".js-topics-link")},topicCreate:function(){new s,this.topMenuView.select(".js-topics-link")},user:function(t,n){new u({username:t,fragment:e.history.fragment}),this.topMenuView.select(".js-users-link")},users:function(e){a.alert.load(),e=e||1,new o({page:e}),this.topMenuView.select(".js-users-link")}}),c=function(){new l,e.history.start({pushState:!0})};return c});