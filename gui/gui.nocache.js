function gui(){var bb='',$=' top: -1000px;',yb='" for "gwt:onLoadErrorFn"',wb='" for "gwt:onPropertyErrorFn"',hb='");',zb='#',qc='.cache.js',Bb='/',Hb='//',cc='47F181BCB730C0DDF388060436817142',pc=':',ec=':1',fc=':2',gc=':3',hc=':4',ic=':5',jc=':6',kc=':7',qb='::',Hc=':moduleBase',ab='<!doctype html>',cb='<html><head><\/head><body><\/body><\/html>',tb='=',Ab='?',vb='Bad handler "',lc='CBC8A77425656459D46750292748E2D6',_='CSS1Compat',fb='Chrome',mc='D1FA218B7D7F2BE33DFA423EA4B9F2B0',nc='DDF267CDFDC3EC3E7C6F9F3F7E4A2DAF',eb='DOMContentLoaded',V='DUMMY',oc='EF41AE4B3DB41BF7C544631660311C65',Gc='Ignoring non-whitelisted Dev Mode URL: ',Fc='__gwtDevModeHook:gui',Gb='base',Eb='baseUrl',Q='begin',W='body',P='bootstrap',Db='clear.cache.gif',Ib='clipboardData.access',yc='common/canvas.css',Bc='common/error.css',xc='common/global.css',Ac='common/periodicsystem.css',zc='common/toolbar.css',sb='content',Tb='default',Cc='end',gb='eval("',Kb='event',Ec='file:',dc='foobar',$b='gecko',Lb='gecko.variant',Nb='gecko1_8',T='gui',bc='gui.devmode.js',Fb='gui.nocache.js',pb='gui::',R='gwt.codesvr.gui=',S='gwt.codesvr=',wc='gwt/clean/clean.css',xb='gwt:onLoadErrorFn',ub='gwt:onPropertyErrorFn',rb='gwt:property',mb='head',uc='href',Dc='http:',Xb='ie10',Qb='ie11',Zb='ie8',Yb='ie9',X='iframe',Cb='img',jb='javascript',Y='javascript:""',rc='link',vc='loadExternalRefs',nb='meta',lb='moduleRequested',kb='moduleStartup',Wb='msie',ob='name',Ob='none',Sb='onLoad',Z='position:absolute; width:0; height:0; border:none; left: -1000px;',sc='rel',Vb='safari',ib='script',ac='selectingPermutation',U='startup',Rb='std',tc='stylesheet',Pb='trident',db='undefined',_b='unknown',Mb='user.agent',Ub='webkit',Jb='window';var o=window;var p=document;r(P,Q);function q(){var a=o.location.search;return a.indexOf(R)!=-1||a.indexOf(S)!=-1}
function r(a,b){if(o.__gwtStatsEvent){o.__gwtStatsEvent({moduleName:T,sessionId:o.__gwtStatsSessionId,subSystem:U,evtGroup:a,millis:(new Date).getTime(),type:b})}}
gui.__sendStats=r;gui.__moduleName=T;gui.__errFn=null;gui.__moduleBase=V;gui.__softPermutationId=0;gui.__computePropValue=null;gui.__getPropMap=null;gui.__gwtInstallCode=function(){};gui.__gwtStartLoadingFragment=function(){return null};var s=function(){return false};var t=function(){return null};__propertyErrorFunction=null;var u=o.__gwt_activeModules=o.__gwt_activeModules||{};u[T]={moduleName:T};var v;function w(){B();return v}
function A(){B();return v.getElementsByTagName(W)[0]}
function B(){if(v){return}var a=p.createElement(X);a.src=Y;a.id=T;a.style.cssText=Z+$;a.tabIndex=-1;p.body.appendChild(a);v=a.contentDocument;if(!v){v=a.contentWindow.document}v.open();var b=document.compatMode==_?ab:bb;v.write(b+cb);v.close()}
function C(k){function l(a){function b(){if(typeof p.readyState==db){return typeof p.body!=db&&p.body!=null}return /loaded|complete/.test(p.readyState)}
var c=b();if(c){a();return}function d(){if(!c){c=true;a();if(p.removeEventListener){p.removeEventListener(eb,d,false)}if(e){clearInterval(e)}}}
if(p.addEventListener){p.addEventListener(eb,d,false)}var e=setInterval(function(){if(b()){d()}},50)}
function m(c){function d(a,b){a.removeChild(b)}
var e=A();var f=w();var g;if(navigator.userAgent.indexOf(fb)>-1&&window.JSON){var h=f.createDocumentFragment();h.appendChild(f.createTextNode(gb));for(var i=0;i<c.length;i++){var j=window.JSON.stringify(c[i]);h.appendChild(f.createTextNode(j.substring(1,j.length-1)))}h.appendChild(f.createTextNode(hb));g=f.createElement(ib);g.language=jb;g.appendChild(h);e.appendChild(g);d(e,g)}else{for(var i=0;i<c.length;i++){g=f.createElement(ib);g.language=jb;g.text=c[i];e.appendChild(g);d(e,g)}}}
gui.onScriptDownloaded=function(a){l(function(){m(a)})};r(kb,lb);var n=p.createElement(ib);n.src=k;p.getElementsByTagName(mb)[0].appendChild(n)}
gui.__startLoadingFragment=function(a){return G(a)};gui.__installRunAsyncCode=function(a){var b=A();var c=w().createElement(ib);c.language=jb;c.text=a;b.appendChild(c);b.removeChild(c)};function D(){var c={};var d;var e;var f=p.getElementsByTagName(nb);for(var g=0,h=f.length;g<h;++g){var i=f[g],j=i.getAttribute(ob),k;if(j){j=j.replace(pb,bb);if(j.indexOf(qb)>=0){continue}if(j==rb){k=i.getAttribute(sb);if(k){var l,m=k.indexOf(tb);if(m>=0){j=k.substring(0,m);l=k.substring(m+1)}else{j=k;l=bb}c[j]=l}}else if(j==ub){k=i.getAttribute(sb);if(k){try{d=eval(k)}catch(a){alert(vb+k+wb)}}}else if(j==xb){k=i.getAttribute(sb);if(k){try{e=eval(k)}catch(a){alert(vb+k+yb)}}}}}t=function(a){var b=c[a];return b==null?null:b};__propertyErrorFunction=d;gui.__errFn=e}
function F(){function e(a){var b=a.lastIndexOf(zb);if(b==-1){b=a.length}var c=a.indexOf(Ab);if(c==-1){c=a.length}var d=a.lastIndexOf(Bb,Math.min(c,b));return d>=0?a.substring(0,d+1):bb}
function f(a){if(a.match(/^\w+:\/\//)){}else{var b=p.createElement(Cb);b.src=a+Db;a=e(b.src)}return a}
function g(){var a=t(Eb);if(a!=null){return a}return bb}
function h(){var a=p.getElementsByTagName(ib);for(var b=0;b<a.length;++b){if(a[b].src.indexOf(Fb)!=-1){return e(a[b].src)}}return bb}
function i(){var a=p.getElementsByTagName(Gb);if(a.length>0){return a[a.length-1].href}return bb}
function j(){var a=p.location;return a.href==a.protocol+Hb+a.host+a.pathname+a.search+a.hash}
var k=g();if(k==bb){k=h()}if(k==bb){k=i()}if(k==bb&&j()){k=e(p.location.href)}k=f(k);return k}
function G(a){if(a.match(/^\//)){return a}if(a.match(/^[a-zA-Z]+:\/\//)){return a}return gui.__moduleBase+a}
function H(){var f=[];var g;function h(a,b){var c=f;for(var d=0,e=a.length-1;d<e;++d){c=c[a[d]]||(c[a[d]]=[])}c[a[e]]=b}
var i=[];var j=[];function k(a){var b=j[a](),c=i[a];if(b in c){return b}var d=[];for(var e in c){d[c[e]]=e}if(__propertyErrorFunc){__propertyErrorFunc(a,d,b)}throw null}
j[Ib]=function(){if(!!window.clipboardData){return Jb}else{return Kb}};i[Ib]={event:0,window:1};j[Lb]=function(){try{if(!j.hasOwnProperty(Mb)||k(Mb)!==Nb){return Ob}}catch(a){return Ob}if(navigator.userAgent.toLowerCase().indexOf(Pb)!=-1){return Qb}return Rb};i[Lb]={ie11:0,none:1,std:2};j[Sb]=function(){o.marvin={onLoadArray:[],onLoad:function(){if(!o.marvin.onLoadArray){return}for(var a=0;a<o.marvin.onLoadArray.length;a++)o.marvin.onLoadArray[a]();delete o.marvin.onLoadArray},onReady:function(a){o.marvin.onLoadArray?o.marvin.onLoadArray.push(a):a()}};return Tb};i[Sb]={'default':0,foobar:1};j[Mb]=function(){var b=navigator.userAgent.toLowerCase();var c=function(a){return parseInt(a[1])*1000+parseInt(a[2])};if(function(){return b.indexOf(Ub)!=-1}())return Vb;if(function(){return b.indexOf(Wb)!=-1&&p.documentMode>=10}())return Xb;if(function(){return b.indexOf(Wb)!=-1&&p.documentMode>=9}())return Yb;if(function(){return b.indexOf(Wb)!=-1&&p.documentMode>=8}())return Zb;if(function(){return b.indexOf($b)!=-1}())return Nb;return _b};i[Mb]={gecko1_8:0,ie10:1,ie8:2,ie9:3,safari:4,unknown:5};s=function(a,b){return b in i[a]};gui.__getPropMap=function(){var a={};for(var b in i){if(i.hasOwnProperty(b)){a[b]=k(b)}}return a};gui.__computePropValue=k;o.__gwt_activeModules[T].bindings=gui.__getPropMap;r(P,ac);if(q()){return G(bc)}var l;try{h([Kb,Ob,Tb,Vb],cc);h([Kb,Ob,dc,Vb],cc);h([Kb,Ob,Tb,_b],cc+ec);h([Kb,Ob,dc,_b],cc+ec);h([Jb,Ob,Tb,Vb],cc+fc);h([Jb,Ob,dc,Vb],cc+fc);h([Jb,Ob,Tb,_b],cc+gc);h([Jb,Ob,dc,_b],cc+gc);h([Kb,Ob,Tb,Vb],cc+hc);h([Kb,Ob,dc,Vb],cc+hc);h([Kb,Ob,Tb,_b],cc+ic);h([Kb,Ob,dc,_b],cc+ic);h([Jb,Ob,Tb,Vb],cc+jc);h([Jb,Ob,dc,Vb],cc+jc);h([Jb,Ob,Tb,_b],cc+kc);h([Jb,Ob,dc,_b],cc+kc);h([Kb,Ob,Tb,Xb],lc);h([Kb,Ob,dc,Xb],lc);h([Jb,Ob,Tb,Xb],lc+ec);h([Jb,Ob,dc,Xb],lc+ec);h([Kb,Ob,Tb,Xb],lc+fc);h([Kb,Ob,dc,Xb],lc+fc);h([Jb,Ob,Tb,Xb],lc+gc);h([Jb,Ob,dc,Xb],lc+gc);h([Kb,Ob,Tb,Zb],mc);h([Kb,Ob,dc,Zb],mc);h([Jb,Ob,Tb,Zb],mc+ec);h([Jb,Ob,dc,Zb],mc+ec);h([Kb,Ob,Tb,Zb],mc+fc);h([Kb,Ob,dc,Zb],mc+fc);h([Jb,Ob,Tb,Zb],mc+gc);h([Jb,Ob,dc,Zb],mc+gc);h([Kb,Ob,Tb,Yb],nc);h([Kb,Ob,dc,Yb],nc);h([Jb,Ob,Tb,Yb],nc+ec);h([Jb,Ob,dc,Yb],nc+ec);h([Kb,Ob,Tb,Yb],nc+fc);h([Kb,Ob,dc,Yb],nc+fc);h([Jb,Ob,Tb,Yb],nc+gc);h([Jb,Ob,dc,Yb],nc+gc);h([Kb,Qb,Tb,Nb],oc);h([Kb,Qb,dc,Nb],oc);h([Kb,Rb,Tb,Nb],oc+ec);h([Kb,Rb,dc,Nb],oc+ec);h([Jb,Qb,Tb,Nb],oc+fc);h([Jb,Qb,dc,Nb],oc+fc);h([Jb,Rb,Tb,Nb],oc+gc);h([Jb,Rb,dc,Nb],oc+gc);h([Kb,Qb,Tb,Nb],oc+hc);h([Kb,Qb,dc,Nb],oc+hc);h([Kb,Rb,Tb,Nb],oc+ic);h([Kb,Rb,dc,Nb],oc+ic);h([Jb,Qb,Tb,Nb],oc+jc);h([Jb,Qb,dc,Nb],oc+jc);h([Jb,Rb,Tb,Nb],oc+kc);h([Jb,Rb,dc,Nb],oc+kc);l=f[k(Ib)][k(Lb)][k(Sb)][k(Mb)];var m=l.indexOf(pc);if(m!=-1){g=parseInt(l.substring(m+1),10);l=l.substring(0,m)}}catch(a){}gui.__softPermutationId=g;return G(l+qc)}
function I(){if(!o.__gwt_stylesLoaded){o.__gwt_stylesLoaded={}}function c(a){if(!__gwt_stylesLoaded[a]){var b=p.createElement(rc);b.setAttribute(sc,tc);b.setAttribute(uc,G(a));p.getElementsByTagName(mb)[0].appendChild(b);__gwt_stylesLoaded[a]=true}}
r(vc,Q);c(wc);c(xc);c(yc);c(zc);c(Ac);c(Bc);r(vc,Cc)}
D();gui.__moduleBase=F();u[T].moduleBase=gui.__moduleBase;var J=H();if(o){var K=!!(o.location.protocol==Dc||o.location.protocol==Ec);o.__gwt_activeModules[T].canRedirect=K;if(K){var L=Fc;var M=o.sessionStorage[L];if(!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/.*$/.test(M)){if(M&&(window.console&&console.log)){console.log(Gc+M)}M=bb}if(M&&!o[L]){o[L]=true;o[L+Hc]=F();var N=p.createElement(ib);N.src=M;var O=p.getElementsByTagName(mb)[0];O.insertBefore(N,O.firstElementChild||O.children[0]);return false}}}I();r(P,Cc);C(J);return true}
gui.succeeded=gui();