(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function t(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(a){if(a.ep)return;a.ep=!0;const i=t(a);fetch(a.href,i)}})();function l(o,e,t,r){var a=arguments.length,i=a<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,t):r,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(o,e,t,r);else for(var s=o.length-1;s>=0;s--)(n=o[s])&&(i=(a<3?n(i):a>3?n(e,t,i):n(e,t))||i);return a>3&&i&&Object.defineProperty(e,t,i),i}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const E=o=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(o,e)}):customElements.define(o,e)};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kr=globalThis,ba=kr.ShadowRoot&&(kr.ShadyCSS===void 0||kr.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ga=Symbol(),Za=new WeakMap;let Ii=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==ga)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(ba&&e===void 0){const r=t!==void 0&&t.length===1;r&&(e=Za.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&Za.set(t,e))}return e}toString(){return this.cssText}};const As=o=>new Ii(typeof o=="string"?o:o+"",void 0,ga),S=(o,...e)=>{const t=o.length===1?o[0]:e.reduce((r,a,i)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+o[i+1],o[0]);return new Ii(t,o,ga)},Ps=(o,e)=>{if(ba)o.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const r=document.createElement("style"),a=kr.litNonce;a!==void 0&&r.setAttribute("nonce",a),r.textContent=t.cssText,o.appendChild(r)}},Qa=ba?o=>o:o=>o instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return As(t)})(o):o;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Is,defineProperty:zs,getOwnPropertyDescriptor:Os,getOwnPropertyNames:Rs,getOwnPropertySymbols:Ms,getPrototypeOf:Ls}=Object,et=globalThis,Ja=et.trustedTypes,Ds=Ja?Ja.emptyScript:"",Wr=et.reactiveElementPolyfillSupport,Nt=(o,e)=>o,$r={toAttribute(o,e){switch(e){case Boolean:o=o?Ds:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,e){let t=o;switch(e){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},ya=(o,e)=>!Is(o,e),ei={attribute:!0,type:String,converter:$r,reflect:!1,useDefault:!1,hasChanged:ya};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),et.litPropertyMetadata??(et.litPropertyMetadata=new WeakMap);let St=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ei){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const r=Symbol(),a=this.getPropertyDescriptor(e,r,t);a!==void 0&&zs(this.prototype,e,a)}}static getPropertyDescriptor(e,t,r){const{get:a,set:i}=Os(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:a,set(n){const s=a==null?void 0:a.call(this);i==null||i.call(this,n),this.requestUpdate(e,s,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ei}static _$Ei(){if(this.hasOwnProperty(Nt("elementProperties")))return;const e=Ls(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Nt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Nt("properties"))){const t=this.properties,r=[...Rs(t),...Ms(t)];for(const a of r)this.createProperty(a,t[a])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[r,a]of t)this.elementProperties.set(r,a)}this._$Eh=new Map;for(const[t,r]of this.elementProperties){const a=this._$Eu(t,r);a!==void 0&&this._$Eh.set(a,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const a of r)t.unshift(Qa(a))}else e!==void 0&&t.push(Qa(e));return t}static _$Eu(e,t){const r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ps(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var r;return(r=t.hostConnected)==null?void 0:r.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var r;return(r=t.hostDisconnected)==null?void 0:r.call(t)})}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){var i;const r=this.constructor.elementProperties.get(e),a=this.constructor._$Eu(e,r);if(a!==void 0&&r.reflect===!0){const n=(((i=r.converter)==null?void 0:i.toAttribute)!==void 0?r.converter:$r).toAttribute(t,r.type);this._$Em=e,n==null?this.removeAttribute(a):this.setAttribute(a,n),this._$Em=null}}_$AK(e,t){var i,n;const r=this.constructor,a=r._$Eh.get(e);if(a!==void 0&&this._$Em!==a){const s=r.getPropertyOptions(a),d=typeof s.converter=="function"?{fromAttribute:s.converter}:((i=s.converter)==null?void 0:i.fromAttribute)!==void 0?s.converter:$r;this._$Em=a;const c=d.fromAttribute(t,s.type);this[a]=c??((n=this._$Ej)==null?void 0:n.get(a))??c,this._$Em=null}}requestUpdate(e,t,r,a=!1,i){var n;if(e!==void 0){const s=this.constructor;if(a===!1&&(i=this[e]),r??(r=s.getPropertyOptions(e)),!((r.hasChanged??ya)(i,t)||r.useDefault&&r.reflect&&i===((n=this._$Ej)==null?void 0:n.get(e))&&!this.hasAttribute(s._$Eu(e,r))))return;this.C(e,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:a,wrapped:i},n){r&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,n??t??this[e]),i!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),a===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}const a=this.constructor.elementProperties;if(a.size>0)for(const[i,n]of a){const{wrapped:s}=n,d=this[i];s!==!0||this._$AL.has(i)||d===void 0||this.C(i,void 0,n,d)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(r=this._$EO)==null||r.forEach(a=>{var i;return(i=a.hostUpdate)==null?void 0:i.call(a)}),this.update(t)):this._$EM()}catch(a){throw e=!1,this._$EM(),a}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(r=>{var a;return(a=r.hostUpdated)==null?void 0:a.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};St.elementStyles=[],St.shadowRootOptions={mode:"open"},St[Nt("elementProperties")]=new Map,St[Nt("finalized")]=new Map,Wr==null||Wr({ReactiveElement:St}),(et.reactiveElementVersions??(et.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Fs={attribute:!0,type:String,converter:$r,reflect:!1,hasChanged:ya},Bs=(o=Fs,e,t)=>{const{kind:r,metadata:a}=t;let i=globalThis.litPropertyMetadata.get(a);if(i===void 0&&globalThis.litPropertyMetadata.set(a,i=new Map),r==="setter"&&((o=Object.create(o)).wrapped=!0),i.set(t.name,o),r==="accessor"){const{name:n}=t;return{set(s){const d=e.get.call(this);e.set.call(this,s),this.requestUpdate(n,d,o,!0,s)},init(s){return s!==void 0&&this.C(n,void 0,o,s),s}}}if(r==="setter"){const{name:n}=t;return function(s){const d=this[n];e.call(this,s),this.requestUpdate(n,d,o,!0,s)}}throw Error("Unsupported decorator location: "+r)};function u(o){return(e,t)=>typeof t=="object"?Bs(o,e,t):((r,a,i)=>{const n=a.hasOwnProperty(i);return a.constructor.createProperty(i,r),n?Object.getOwnPropertyDescriptor(a,i):void 0})(o,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function T(o){return u({...o,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Zt=(o,e,t)=>(t.configurable=!0,t.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(o,e,t),t);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function U(o,e){return(t,r,a)=>{const i=n=>{var s;return((s=n.renderRoot)==null?void 0:s.querySelector(o))??null};return Zt(t,r,{get(){return i(this)}})}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Ns;function Vs(o){return(e,t)=>Zt(e,t,{get(){return(this.renderRoot??Ns??(Ns=document.createDocumentFragment())).querySelectorAll(o)}})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function zi(o){return(e,t)=>Zt(e,t,{async get(){var r;return await this.updateComplete,((r=this.renderRoot)==null?void 0:r.querySelector(o))??null}})}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ce(o){return(e,t)=>{const{slot:r,selector:a}=o??{},i="slot"+(r?`[name=${r}]`:":not([name])");return Zt(e,t,{get(){var d;const n=(d=this.renderRoot)==null?void 0:d.querySelector(i),s=(n==null?void 0:n.assignedElements(o))??[];return a===void 0?s:s.filter(c=>c.matches(a))}})}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function xa(o){return(e,t)=>{const{slot:r}=o??{},a="slot"+(r?`[name=${r}]`:":not([name])");return Zt(e,t,{get(){var n;const i=(n=this.renderRoot)==null?void 0:n.querySelector(a);return(i==null?void 0:i.assignedNodes(o))??[]}})}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Vt=globalThis,ti=o=>o,Tr=Vt.trustedTypes,ri=Tr?Tr.createPolicy("lit-html",{createHTML:o=>o}):void 0,Oi="$lit$",Qe=`lit$${Math.random().toFixed(9).slice(2)}$`,Ri="?"+Qe,Hs=`<${Ri}>`,ft=document,Kt=()=>ft.createComment(""),jt=o=>o===null||typeof o!="object"&&typeof o!="function",_a=Array.isArray,Us=o=>_a(o)||typeof(o==null?void 0:o[Symbol.iterator])=="function",Yr=`[ 	
\f\r]`,Ft=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,oi=/-->/g,ai=/>/g,ht=RegExp(`>|${Yr}(?:([^\\s"'>=/]+)(${Yr}*=${Yr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ii=/'/g,ni=/"/g,Mi=/^(?:script|style|textarea|title)$/i,Li=o=>(e,...t)=>({_$litType$:o,strings:e,values:t}),h=Li(1),Ht=Li(2),Ae=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),si=new WeakMap,ut=ft.createTreeWalker(ft,129);function Di(o,e){if(!_a(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return ri!==void 0?ri.createHTML(e):e}const qs=(o,e)=>{const t=o.length-1,r=[];let a,i=e===2?"<svg>":e===3?"<math>":"",n=Ft;for(let s=0;s<t;s++){const d=o[s];let c,p,v=-1,g=0;for(;g<d.length&&(n.lastIndex=g,p=n.exec(d),p!==null);)g=n.lastIndex,n===Ft?p[1]==="!--"?n=oi:p[1]!==void 0?n=ai:p[2]!==void 0?(Mi.test(p[2])&&(a=RegExp("</"+p[2],"g")),n=ht):p[3]!==void 0&&(n=ht):n===ht?p[0]===">"?(n=a??Ft,v=-1):p[1]===void 0?v=-2:(v=n.lastIndex-p[2].length,c=p[1],n=p[3]===void 0?ht:p[3]==='"'?ni:ii):n===ni||n===ii?n=ht:n===oi||n===ai?n=Ft:(n=ht,a=void 0);const _=n===ht&&o[s+1].startsWith("/>")?" ":"";i+=n===Ft?d+Hs:v>=0?(r.push(c),d.slice(0,v)+Oi+d.slice(v)+Qe+_):d+Qe+(v===-2?s:_)}return[Di(o,i+(o[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]};class Gt{constructor({strings:e,_$litType$:t},r){let a;this.parts=[];let i=0,n=0;const s=e.length-1,d=this.parts,[c,p]=qs(e,t);if(this.el=Gt.createElement(c,r),ut.currentNode=this.el.content,t===2||t===3){const v=this.el.content.firstChild;v.replaceWith(...v.childNodes)}for(;(a=ut.nextNode())!==null&&d.length<s;){if(a.nodeType===1){if(a.hasAttributes())for(const v of a.getAttributeNames())if(v.endsWith(Oi)){const g=p[n++],_=a.getAttribute(v).split(Qe),w=/([.?@])?(.*)/.exec(g);d.push({type:1,index:i,name:w[2],strings:_,ctor:w[1]==="."?js:w[1]==="?"?Gs:w[1]==="@"?Ws:zr}),a.removeAttribute(v)}else v.startsWith(Qe)&&(d.push({type:6,index:i}),a.removeAttribute(v));if(Mi.test(a.tagName)){const v=a.textContent.split(Qe),g=v.length-1;if(g>0){a.textContent=Tr?Tr.emptyScript:"";for(let _=0;_<g;_++)a.append(v[_],Kt()),ut.nextNode(),d.push({type:2,index:++i});a.append(v[g],Kt())}}}else if(a.nodeType===8)if(a.data===Ri)d.push({type:2,index:i});else{let v=-1;for(;(v=a.data.indexOf(Qe,v+1))!==-1;)d.push({type:7,index:i}),v+=Qe.length-1}i++}}static createElement(e,t){const r=ft.createElement("template");return r.innerHTML=e,r}}function At(o,e,t=o,r){var n,s;if(e===Ae)return e;let a=r!==void 0?(n=t._$Co)==null?void 0:n[r]:t._$Cl;const i=jt(e)?void 0:e._$litDirective$;return(a==null?void 0:a.constructor)!==i&&((s=a==null?void 0:a._$AO)==null||s.call(a,!1),i===void 0?a=void 0:(a=new i(o),a._$AT(o,t,r)),r!==void 0?(t._$Co??(t._$Co=[]))[r]=a:t._$Cl=a),a!==void 0&&(e=At(o,a._$AS(o,e.values),a,r)),e}class Ks{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:r}=this._$AD,a=((e==null?void 0:e.creationScope)??ft).importNode(t,!0);ut.currentNode=a;let i=ut.nextNode(),n=0,s=0,d=r[0];for(;d!==void 0;){if(n===d.index){let c;d.type===2?c=new Qt(i,i.nextSibling,this,e):d.type===1?c=new d.ctor(i,d.name,d.strings,this,e):d.type===6&&(c=new Ys(i,this,e)),this._$AV.push(c),d=r[++s]}n!==(d==null?void 0:d.index)&&(i=ut.nextNode(),n++)}return ut.currentNode=ft,a}p(e){let t=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}class Qt{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,r,a){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=a,this._$Cv=(a==null?void 0:a.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=At(this,e,t),jt(e)?e===b||e==null||e===""?(this._$AH!==b&&this._$AR(),this._$AH=b):e!==this._$AH&&e!==Ae&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Us(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==b&&jt(this._$AH)?this._$AA.nextSibling.data=e:this.T(ft.createTextNode(e)),this._$AH=e}$(e){var i;const{values:t,_$litType$:r}=e,a=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=Gt.createElement(Di(r.h,r.h[0]),this.options)),r);if(((i=this._$AH)==null?void 0:i._$AD)===a)this._$AH.p(t);else{const n=new Ks(a,this),s=n.u(this.options);n.p(t),this.T(s),this._$AH=n}}_$AC(e){let t=si.get(e.strings);return t===void 0&&si.set(e.strings,t=new Gt(e)),t}k(e){_a(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let r,a=0;for(const i of e)a===t.length?t.push(r=new Qt(this.O(Kt()),this.O(Kt()),this,this.options)):r=t[a],r._$AI(i),a++;a<t.length&&(this._$AR(r&&r._$AB.nextSibling,a),t.length=a)}_$AR(e=this._$AA.nextSibling,t){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,t);e!==this._$AB;){const a=ti(e).nextSibling;ti(e).remove(),e=a}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}}class zr{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,a,i){this.type=1,this._$AH=b,this._$AN=void 0,this.element=e,this.name=t,this._$AM=a,this.options=i,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=b}_$AI(e,t=this,r,a){const i=this.strings;let n=!1;if(i===void 0)e=At(this,e,t,0),n=!jt(e)||e!==this._$AH&&e!==Ae,n&&(this._$AH=e);else{const s=e;let d,c;for(e=i[0],d=0;d<i.length-1;d++)c=At(this,s[r+d],t,d),c===Ae&&(c=this._$AH[d]),n||(n=!jt(c)||c!==this._$AH[d]),c===b?e=b:e!==b&&(e+=(c??"")+i[d+1]),this._$AH[d]=c}n&&!a&&this.j(e)}j(e){e===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class js extends zr{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===b?void 0:e}}class Gs extends zr{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==b)}}class Ws extends zr{constructor(e,t,r,a,i){super(e,t,r,a,i),this.type=5}_$AI(e,t=this){if((e=At(this,e,t,0)??b)===Ae)return;const r=this._$AH,a=e===b&&r!==b||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,i=e!==b&&(r===b||a);a&&this.element.removeEventListener(this.name,this,r),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class Ys{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){At(this,e)}}const Xr=Vt.litHtmlPolyfillSupport;Xr==null||Xr(Gt,Qt),(Vt.litHtmlVersions??(Vt.litHtmlVersions=[])).push("3.3.3");const wa=(o,e,t)=>{const r=(t==null?void 0:t.renderBefore)??e;let a=r._$litPart$;if(a===void 0){const i=(t==null?void 0:t.renderBefore)??null;r._$litPart$=a=new Qt(e.insertBefore(Kt(),i),i,void 0,t??{})}return a._$AI(o),a};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const mt=globalThis;let O=class extends St{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=wa(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return Ae}};var Ai;O._$litElement$=!0,O.finalized=!0,(Ai=mt.litElementHydrateSupport)==null||Ai.call(mt,{LitElement:O});const Zr=mt.litElementPolyfillSupport;Zr==null||Zr({LitElement:O});(mt.litElementVersions??(mt.litElementVersions=[])).push("4.2.2");/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Xs extends O{connectedCallback(){super.connectedCallback(),this.setAttribute("aria-hidden","true")}render(){return h`<span class="shadow"></span>`}}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Fi=S`:host,.shadow,.shadow::before,.shadow::after{border-radius:inherit;inset:0;position:absolute;transition-duration:inherit;transition-property:inherit;transition-timing-function:inherit}:host{display:flex;pointer-events:none;transition-property:box-shadow,opacity}.shadow::before,.shadow::after{content:"";transition-property:box-shadow,opacity;--_level: var(--md-elevation-level, 0);--_shadow-color: var(--md-elevation-shadow-color, var(--md-sys-color-shadow, #000))}.shadow::before{box-shadow:0px calc(1px*(clamp(0,var(--_level),1) + clamp(0,var(--_level) - 3,1) + 2*clamp(0,var(--_level) - 4,1))) calc(1px*(2*clamp(0,var(--_level),1) + clamp(0,var(--_level) - 2,1) + clamp(0,var(--_level) - 4,1))) 0px var(--_shadow-color);opacity:.3}.shadow::after{box-shadow:0px calc(1px*(clamp(0,var(--_level),1) + clamp(0,var(--_level) - 1,1) + 2*clamp(0,var(--_level) - 2,3))) calc(1px*(3*clamp(0,var(--_level),2) + 2*clamp(0,var(--_level) - 2,3))) calc(1px*(clamp(0,var(--_level),4) + 2*clamp(0,var(--_level) - 4,1))) var(--_shadow-color);opacity:.15}
`;Fi.styleSheet;/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let ho=class extends Xs{};ho.styles=[Fi];ho=l([E("md-elevation")],ho);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Bi=Symbol("attachableController");let Cr;Cr=new MutationObserver(o=>{var e;for(const t of o)(e=t.target[Bi])==null||e.hostConnected()});class Ni{get htmlFor(){return this.host.getAttribute("for")}set htmlFor(e){e===null?this.host.removeAttribute("for"):this.host.setAttribute("for",e)}get control(){return this.host.hasAttribute("for")?!this.htmlFor||!this.host.isConnected?null:this.host.getRootNode().querySelector(`#${this.htmlFor}`):this.currentControl||this.host.parentElement}set control(e){e?this.attach(e):this.detach()}constructor(e,t){this.host=e,this.onControlChange=t,this.currentControl=null,e.addController(this),e[Bi]=this,Cr==null||Cr.observe(e,{attributeFilter:["for"]})}attach(e){e!==this.currentControl&&(this.setCurrentControl(e),this.host.removeAttribute("for"))}detach(){this.setCurrentControl(null),this.host.setAttribute("for","")}hostConnected(){this.setCurrentControl(this.control)}hostDisconnected(){this.setCurrentControl(null)}setCurrentControl(e){this.onControlChange(this.currentControl,e),this.currentControl=e}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Zs=["focusin","focusout","pointerdown"];class ka extends O{constructor(){super(...arguments),this.visible=!1,this.inward=!1,this.attachableController=new Ni(this,this.onControlChange.bind(this))}get htmlFor(){return this.attachableController.htmlFor}set htmlFor(e){this.attachableController.htmlFor=e}get control(){return this.attachableController.control}set control(e){this.attachableController.control=e}attach(e){this.attachableController.attach(e)}detach(){this.attachableController.detach()}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-hidden","true")}handleEvent(e){var t;if(!e[li]){switch(e.type){default:return;case"focusin":this.visible=((t=this.control)==null?void 0:t.matches(":focus-visible"))??!1;break;case"focusout":case"pointerdown":this.visible=!1;break}e[li]=!0}}onControlChange(e,t){for(const r of Zs)e==null||e.removeEventListener(r,this),t==null||t.addEventListener(r,this)}update(e){e.has("visible")&&this.dispatchEvent(new Event("visibility-changed")),super.update(e)}}l([u({type:Boolean,reflect:!0})],ka.prototype,"visible",void 0);l([u({type:Boolean,reflect:!0})],ka.prototype,"inward",void 0);const li=Symbol("handledByFocusRing");/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Vi=S`:host{animation-delay:0s,calc(var(--md-focus-ring-duration, 600ms)*.25);animation-duration:calc(var(--md-focus-ring-duration, 600ms)*.25),calc(var(--md-focus-ring-duration, 600ms)*.75);animation-timing-function:cubic-bezier(0.2, 0, 0, 1);box-sizing:border-box;color:var(--md-focus-ring-color, var(--md-sys-color-secondary, #625b71));display:none;pointer-events:none;position:absolute}:host([visible]){display:flex}:host(:not([inward])){animation-name:outward-grow,outward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));inset:calc(-1*var(--md-focus-ring-outward-offset, 2px));outline:var(--md-focus-ring-width, 3px) solid currentColor}:host([inward]){animation-name:inward-grow,inward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border:var(--md-focus-ring-width, 3px) solid currentColor;inset:var(--md-focus-ring-inward-offset, 0px)}@keyframes outward-grow{from{outline-width:0}to{outline-width:var(--md-focus-ring-active-width, 8px)}}@keyframes outward-shrink{from{outline-width:var(--md-focus-ring-active-width, 8px)}}@keyframes inward-grow{from{border-width:0}to{border-width:var(--md-focus-ring-active-width, 8px)}}@keyframes inward-shrink{from{border-width:var(--md-focus-ring-active-width, 8px)}}@media(prefers-reduced-motion){:host{animation:none}}
`;Vi.styleSheet;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let po=class extends ka{};po.styles=[Vi];po=l([E("md-focus-ring")],po);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ze={ATTRIBUTE:1,PROPERTY:3,BOOLEAN_ATTRIBUTE:4},Ca=o=>(...e)=>({_$litDirective$:o,values:e});let Sa=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,r){this._$Ct=e,this._$AM=t,this._$Ci=r}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Q=Ca(class extends Sa{constructor(o){var e;if(super(o),o.type!==Ze.ATTRIBUTE||o.name!=="class"||((e=o.strings)==null?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(o){return" "+Object.keys(o).filter(e=>o[e]).join(" ")+" "}update(o,[e]){var r,a;if(this.st===void 0){this.st=new Set,o.strings!==void 0&&(this.nt=new Set(o.strings.join(" ").split(/\s/).filter(i=>i!=="")));for(const i in e)e[i]&&!((r=this.nt)!=null&&r.has(i))&&this.st.add(i);return this.render(e)}const t=o.element.classList;for(const i of this.st)i in e||(t.remove(i),this.st.delete(i));for(const i in e){const n=!!e[i];n===this.st.has(i)||(a=this.nt)!=null&&a.has(i)||(n?(t.add(i),this.st.add(i)):(t.remove(i),this.st.delete(i)))}return Ae}});/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Le={STANDARD:"cubic-bezier(0.2, 0, 0, 1)",EMPHASIZED:"cubic-bezier(.3,0,0,1)",EMPHASIZED_ACCELERATE:"cubic-bezier(.3,0,.8,.15)"};function Qs(){let o=null;return{start(){return o==null||o.abort(),o=new AbortController,o.signal},finish(){o=null}}}/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Js=450,di=225,el=.2,tl=10,rl=75,ol=.35,al="::after",il="forwards";var me;(function(o){o[o.INACTIVE=0]="INACTIVE",o[o.TOUCH_DELAY=1]="TOUCH_DELAY",o[o.HOLDING=2]="HOLDING",o[o.WAITING_FOR_CLICK=3]="WAITING_FOR_CLICK"})(me||(me={}));const nl=["click","contextmenu","pointercancel","pointerdown","pointerenter","pointerleave","pointerup"],sl=150,Qr=window.matchMedia("(forced-colors: active)");class Jt extends O{constructor(){super(...arguments),this.disabled=!1,this.hovered=!1,this.pressed=!1,this.rippleSize="",this.rippleScale="",this.initialSize=0,this.state=me.INACTIVE,this.attachableController=new Ni(this,this.onControlChange.bind(this))}get htmlFor(){return this.attachableController.htmlFor}set htmlFor(e){this.attachableController.htmlFor=e}get control(){return this.attachableController.control}set control(e){this.attachableController.control=e}attach(e){this.attachableController.attach(e)}detach(){this.attachableController.detach()}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-hidden","true")}render(){const e={hovered:this.hovered,pressed:this.pressed};return h`<div class="surface ${Q(e)}"></div>`}update(e){e.has("disabled")&&this.disabled&&(this.hovered=!1,this.pressed=!1),super.update(e)}handlePointerenter(e){this.shouldReactToEvent(e)&&(this.hovered=!0)}handlePointerleave(e){this.shouldReactToEvent(e)&&(this.hovered=!1,this.state!==me.INACTIVE&&this.endPressAnimation())}handlePointerup(e){if(this.shouldReactToEvent(e)){if(this.state===me.HOLDING){this.state=me.WAITING_FOR_CLICK;return}if(this.state===me.TOUCH_DELAY){this.state=me.WAITING_FOR_CLICK,this.startPressAnimation(this.rippleStartEvent);return}}}async handlePointerdown(e){if(this.shouldReactToEvent(e)){if(this.rippleStartEvent=e,!this.isTouch(e)){this.state=me.WAITING_FOR_CLICK,this.startPressAnimation(e);return}this.state=me.TOUCH_DELAY,await new Promise(t=>{setTimeout(t,sl)}),this.state===me.TOUCH_DELAY&&(this.state=me.HOLDING,this.startPressAnimation(e))}}handleClick(){if(!this.disabled){if(this.state===me.WAITING_FOR_CLICK){this.endPressAnimation();return}this.state===me.INACTIVE&&(this.startPressAnimation(),this.endPressAnimation())}}handlePointercancel(e){this.shouldReactToEvent(e)&&this.endPressAnimation()}handleContextmenu(){this.disabled||this.endPressAnimation()}determineRippleSize(){const{height:e,width:t}=this.getBoundingClientRect(),r=Math.max(e,t),a=Math.max(ol*r,rl),i=this.currentCSSZoom??1,n=Math.floor(r*el/i),d=Math.sqrt(t**2+e**2)+tl;this.initialSize=n;const c=(d+a)/n;this.rippleScale=`${c/i}`,this.rippleSize=`${n}px`}getNormalizedPointerEventCoords(e){const{scrollX:t,scrollY:r}=window,{left:a,top:i}=this.getBoundingClientRect(),n=t+a,s=r+i,{pageX:d,pageY:c}=e,p=this.currentCSSZoom??1;return{x:(d-n)/p,y:(c-s)/p}}getTranslationCoordinates(e){const{height:t,width:r}=this.getBoundingClientRect(),a=this.currentCSSZoom??1,i={x:(r/a-this.initialSize)/2,y:(t/a-this.initialSize)/2};let n;return e instanceof PointerEvent?n=this.getNormalizedPointerEventCoords(e):n={x:r/a/2,y:t/a/2},n={x:n.x-this.initialSize/2,y:n.y-this.initialSize/2},{startPoint:n,endPoint:i}}startPressAnimation(e){var n;if(!this.mdRoot)return;this.pressed=!0,(n=this.growAnimation)==null||n.cancel(),this.determineRippleSize();const{startPoint:t,endPoint:r}=this.getTranslationCoordinates(e),a=`${t.x}px, ${t.y}px`,i=`${r.x}px, ${r.y}px`;this.growAnimation=this.mdRoot.animate({top:[0,0],left:[0,0],height:[this.rippleSize,this.rippleSize],width:[this.rippleSize,this.rippleSize],transform:[`translate(${a}) scale(1)`,`translate(${i}) scale(${this.rippleScale})`]},{pseudoElement:al,duration:Js,easing:Le.STANDARD,fill:il})}async endPressAnimation(){this.rippleStartEvent=void 0,this.state=me.INACTIVE;const e=this.growAnimation;let t=1/0;if(typeof(e==null?void 0:e.currentTime)=="number"?t=e.currentTime:e!=null&&e.currentTime&&(t=e.currentTime.to("ms").value),t>=di){this.pressed=!1;return}await new Promise(r=>{setTimeout(r,di-t)}),this.growAnimation===e&&(this.pressed=!1)}shouldReactToEvent(e){if(this.disabled||!e.isPrimary||this.rippleStartEvent&&this.rippleStartEvent.pointerId!==e.pointerId)return!1;if(e.type==="pointerenter"||e.type==="pointerleave")return!this.isTouch(e);const t=e.buttons===1;return this.isTouch(e)||t}isTouch({pointerType:e}){return e==="touch"}async handleEvent(e){if(!(Qr!=null&&Qr.matches))switch(e.type){case"click":this.handleClick();break;case"contextmenu":this.handleContextmenu();break;case"pointercancel":this.handlePointercancel(e);break;case"pointerdown":await this.handlePointerdown(e);break;case"pointerenter":this.handlePointerenter(e);break;case"pointerleave":this.handlePointerleave(e);break;case"pointerup":this.handlePointerup(e);break}}onControlChange(e,t){for(const r of nl)e==null||e.removeEventListener(r,this),t==null||t.addEventListener(r,this)}}l([u({type:Boolean,reflect:!0})],Jt.prototype,"disabled",void 0);l([T()],Jt.prototype,"hovered",void 0);l([T()],Jt.prototype,"pressed",void 0);l([U(".surface")],Jt.prototype,"mdRoot",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Hi=S`:host{display:flex;margin:auto;pointer-events:none}:host([disabled]){display:none}@media(forced-colors: active){:host{display:none}}:host,.surface{border-radius:inherit;position:absolute;inset:0;overflow:hidden}.surface{-webkit-tap-highlight-color:rgba(0,0,0,0)}.surface::before,.surface::after{content:"";opacity:0;position:absolute}.surface::before{background-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));inset:0;transition:opacity 15ms linear,background-color 15ms linear}.surface::after{background:radial-gradient(closest-side, var(--md-ripple-pressed-color, var(--md-sys-color-on-surface, #1d1b20)) max(100% - 70px, 65%), transparent 100%);transform-origin:center center;transition:opacity 375ms linear}.hovered::before{background-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-ripple-hover-opacity, 0.08)}.pressed::after{opacity:var(--md-ripple-pressed-opacity, 0.12);transition-duration:105ms}
`;Hi.styleSheet;/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let uo=class extends Jt{};uo.styles=[Hi];uo=l([E("md-ripple")],uo);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ui=["role","ariaAtomic","ariaAutoComplete","ariaBusy","ariaChecked","ariaColCount","ariaColIndex","ariaColSpan","ariaCurrent","ariaDisabled","ariaExpanded","ariaHasPopup","ariaHidden","ariaInvalid","ariaKeyShortcuts","ariaLabel","ariaLevel","ariaLive","ariaModal","ariaMultiLine","ariaMultiSelectable","ariaOrientation","ariaPlaceholder","ariaPosInSet","ariaPressed","ariaReadOnly","ariaRequired","ariaRoleDescription","ariaRowCount","ariaRowIndex","ariaRowSpan","ariaSelected","ariaSetSize","ariaSort","ariaValueMax","ariaValueMin","ariaValueNow","ariaValueText"],ll=Ui.map(qi);function Jr(o){return ll.includes(o)}function qi(o){return o.replace("aria","aria-").replace(/Elements?/g,"").toLowerCase()}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const cr=Symbol("privateIgnoreAttributeChangesFor");function ue(o){var e;class t extends o{constructor(){super(...arguments),this[e]=new Set}attributeChangedCallback(a,i,n){if(!Jr(a)){super.attributeChangedCallback(a,i,n);return}if(this[cr].has(a))return;this[cr].add(a),this.removeAttribute(a),this[cr].delete(a);const s=vo(a);n===null?delete this.dataset[s]:this.dataset[s]=n,this.requestUpdate(vo(a),i)}getAttribute(a){return Jr(a)?super.getAttribute(mo(a)):super.getAttribute(a)}removeAttribute(a){super.removeAttribute(a),Jr(a)&&(super.removeAttribute(mo(a)),this.requestUpdate())}}return e=cr,dl(t),t}function dl(o){for(const e of Ui){const t=qi(e),r=mo(t),a=vo(t);o.createProperty(e,{attribute:t,noAccessor:!0}),o.createProperty(Symbol(r),{attribute:r,noAccessor:!0}),Object.defineProperty(o.prototype,e,{configurable:!0,enumerable:!0,get(){return this.dataset[a]??null},set(i){const n=this.dataset[a]??null;i!==n&&(i===null?delete this.dataset[a]:this.dataset[a]=i,this.requestUpdate(e,n))}})}}function mo(o){return`data-${o}`}function vo(o){return o.replace(/-\w/,e=>e[1].toUpperCase())}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function Or(o){const e=new MouseEvent("click",{bubbles:!0});return o.dispatchEvent(e),e}function er(o){return o.currentTarget!==o.target||o.composedPath()[0]!==o.target||o.target.disabled?!1:!cl(o)}function cl(o){const e=fo;return e&&(o.preventDefault(),o.stopImmediatePropagation()),hl(),e}let fo=!1;async function hl(){fo=!0,await null,fo=!1}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const ge=Symbol("internals"),eo=Symbol("privateInternals");function at(o){class e extends o{get[ge](){return this[eo]||(this[eo]=this.attachInternals()),this[eo]}}return e}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const qe=Symbol("getFormValue"),Wt=Symbol("getFormState");function it(o){class e extends o{get form(){return this[ge].form}get labels(){return this[ge].labels}get name(){return this.getAttribute("name")??""}set name(r){this.setAttribute("name",r)}get disabled(){return this.hasAttribute("disabled")}set disabled(r){this.toggleAttribute("disabled",!!r)}attributeChangedCallback(r,a,i){if(r==="name"||r==="disabled"){const n=r==="disabled"?a!==null:a;this.requestUpdate(r,n);return}super.attributeChangedCallback(r,a,i)}requestUpdate(r,a,i){super.requestUpdate(r,a,i),this[ge].setFormValue(this[qe](),this[Wt]())}[qe](){return this.getAttribute("value")}[Wt](){return this[qe]()}formDisabledCallback(r){this.disabled=r}}return e.formAssociated=!0,l([u({noAccessor:!0})],e.prototype,"name",null),l([u({type:Boolean,noAccessor:!0})],e.prototype,"disabled",null),e}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ki=Symbol("dispatchHooks");function $a(o,e){const t=o[Ki];if(!t)throw new Error(`'${o.type}' event needs setupDispatchHooks().`);t.addEventListener("after",e,{once:!0})}const ci=new WeakMap;function Ta(o,...e){let t=ci.get(o);t||(t=new Set,ci.set(o,t));for(const r of e)t.has(r)||(o.addEventListener(r,a=>{const i=new EventTarget;a[Ki]=i;const n=new AbortController,s=()=>{n.abort(),i.dispatchEvent(new Event("after"))},d=v=>function(){v.call(this),s()};a.stopPropagation=d(a.stopPropagation),a.stopImmediatePropagation=d(a.stopImmediatePropagation);const c=a.composedPath();let p;a.composed&&a.bubbles?p=c[c.length-1]:a.bubbles?p=c[0].getRootNode():p=c[0],p.addEventListener(r,()=>{s()},{once:!0,signal:n.signal})},{capture:!0}),t.add(r))}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function ji(o){class e extends o{get name(){return this.getAttribute("name")??""}set name(r){this.setAttribute("name",r)}constructor(...r){super(...r),this.type="submit",this.value="",Ta(this,"click"),this.addEventListener("click",async a=>{const i=this.type==="reset",n=this.type==="submit",s=this[ge],{form:d}=s;!d||!(n||i)||$a(a,()=>{if(!a.defaultPrevented){if(i){d.reset();return}d.addEventListener("submit",c=>{Object.defineProperty(c,"submitter",{configurable:!0,enumerable:!0,get:()=>this})},{capture:!0,once:!0}),s.setFormValue(this.value),d.requestSubmit()}})})}}return l([u()],e.prototype,"type",void 0),l([u({reflect:!0})],e.prototype,"value",void 0),e}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const pl=ue(ji(it(at(O))));class xe extends pl{constructor(){super(),this.softDisabled=!1,this.href="",this.download="",this.target="",this.trailingIcon=!1,this.hasIcon=!1,this.addEventListener("click",this.handleClick.bind(this))}focus(){var e;(e=this.buttonElement)==null||e.focus()}blur(){var e;(e=this.buttonElement)==null||e.blur()}render(){var a;const e=this.disabled||this.softDisabled,t=this.href?this.renderLink():this.renderButton(),r=this.href?"link":"button";return h`
      ${(a=this.renderElevationOrOutline)==null?void 0:a.call(this)}
      <div class="background"></div>
      <md-focus-ring part="focus-ring" for=${r}></md-focus-ring>
      <md-ripple
        part="ripple"
        for=${r}
        ?disabled="${e}"></md-ripple>
      ${t}
    `}renderButton(){const{ariaLabel:e,ariaHasPopup:t,ariaExpanded:r}=this;return h`<button
      id="button"
      class="button"
      ?disabled=${this.disabled}
      aria-disabled=${this.softDisabled||b}
      aria-label="${e||b}"
      aria-haspopup="${t||b}"
      aria-expanded="${r||b}">
      ${this.renderContent()}
    </button>`}renderLink(){const{ariaLabel:e,ariaHasPopup:t,ariaExpanded:r}=this;return h`<a
      id="link"
      class="button"
      aria-label="${e||b}"
      aria-haspopup="${t||b}"
      aria-expanded="${r||b}"
      aria-disabled=${this.disabled||this.softDisabled||b}
      tabindex="${this.disabled&&!this.softDisabled?-1:b}"
      href=${this.href}
      download=${this.download||b}
      target=${this.target||b}
      >${this.renderContent()}
    </a>`}renderContent(){const e=h`<slot
      name="icon"
      @slotchange="${this.handleSlotChange}"></slot>`;return h`
      <span class="touch"></span>
      ${this.trailingIcon?b:e}
      <span class="label"><slot></slot></span>
      ${this.trailingIcon?e:b}
    `}handleClick(e){if(this.softDisabled||this.disabled&&this.href){e.stopImmediatePropagation(),e.preventDefault();return}!er(e)||!this.buttonElement||(this.focus(),Or(this.buttonElement))}handleSlotChange(){this.hasIcon=this.assignedIcons.length>0}}xe.shadowRootOptions={mode:"open",delegatesFocus:!0};l([u({type:Boolean,attribute:"soft-disabled",reflect:!0})],xe.prototype,"softDisabled",void 0);l([u()],xe.prototype,"href",void 0);l([u()],xe.prototype,"download",void 0);l([u()],xe.prototype,"target",void 0);l([u({type:Boolean,attribute:"trailing-icon",reflect:!0})],xe.prototype,"trailingIcon",void 0);l([u({type:Boolean,attribute:"has-icon",reflect:!0})],xe.prototype,"hasIcon",void 0);l([U(".button")],xe.prototype,"buttonElement",void 0);l([ce({slot:"icon",flatten:!0})],xe.prototype,"assignedIcons",void 0);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class ul extends xe{renderElevationOrOutline(){return h`<md-elevation part="elevation"></md-elevation>`}}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Gi=S`:host{--_container-color: var(--md-elevated-button-container-color, var(--md-sys-color-surface-container-low, #f7f2fa));--_container-elevation: var(--md-elevated-button-container-elevation, 1);--_container-height: var(--md-elevated-button-container-height, 40px);--_container-shadow-color: var(--md-elevated-button-container-shadow-color, var(--md-sys-color-shadow, #000));--_disabled-container-color: var(--md-elevated-button-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-elevation: var(--md-elevated-button-disabled-container-elevation, 0);--_disabled-container-opacity: var(--md-elevated-button-disabled-container-opacity, 0.12);--_disabled-label-text-color: var(--md-elevated-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-elevated-button-disabled-label-text-opacity, 0.38);--_focus-container-elevation: var(--md-elevated-button-focus-container-elevation, 1);--_focus-label-text-color: var(--md-elevated-button-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-container-elevation: var(--md-elevated-button-hover-container-elevation, 2);--_hover-label-text-color: var(--md-elevated-button-hover-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-color: var(--md-elevated-button-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-elevated-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-elevated-button-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-font: var(--md-elevated-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-elevated-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-elevated-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-elevated-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-container-elevation: var(--md-elevated-button-pressed-container-elevation, 1);--_pressed-label-text-color: var(--md-elevated-button-pressed-label-text-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-color: var(--md-elevated-button-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-elevated-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-elevated-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-elevated-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-elevated-button-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-icon-color: var(--md-elevated-button-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-color: var(--md-elevated-button-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-elevated-button-icon-size, 18px);--_pressed-icon-color: var(--md-elevated-button-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_container-shape-start-start: var(--md-elevated-button-container-shape-start-start, var(--md-elevated-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-elevated-button-container-shape-start-end, var(--md-elevated-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-elevated-button-container-shape-end-end, var(--md-elevated-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-elevated-button-container-shape-end-start, var(--md-elevated-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-elevated-button-leading-space, 24px);--_trailing-space: var(--md-elevated-button-trailing-space, 24px);--_with-leading-icon-leading-space: var(--md-elevated-button-with-leading-icon-leading-space, 16px);--_with-leading-icon-trailing-space: var(--md-elevated-button-with-leading-icon-trailing-space, 24px);--_with-trailing-icon-leading-space: var(--md-elevated-button-with-trailing-icon-leading-space, 24px);--_with-trailing-icon-trailing-space: var(--md-elevated-button-with-trailing-icon-trailing-space, 16px)}
`;Gi.styleSheet;/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Rr=S`md-elevation{transition-duration:280ms}:host(:is([disabled],[soft-disabled])) md-elevation{transition:none}md-elevation{--md-elevation-level: var(--_container-elevation);--md-elevation-shadow-color: var(--_container-shadow-color)}:host(:focus-within) md-elevation{--md-elevation-level: var(--_focus-container-elevation)}:host(:hover) md-elevation{--md-elevation-level: var(--_hover-container-elevation)}:host(:active) md-elevation{--md-elevation-level: var(--_pressed-container-elevation)}:host(:is([disabled],[soft-disabled])) md-elevation{--md-elevation-level: var(--_disabled-container-elevation)}
`;Rr.styleSheet;/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ot=S`:host{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end);box-sizing:border-box;cursor:pointer;display:inline-flex;gap:8px;min-height:var(--_container-height);outline:none;padding-block:calc((var(--_container-height) - max(var(--_label-text-line-height),var(--_icon-size)))/2);padding-inline-start:var(--_leading-space);padding-inline-end:var(--_trailing-space);place-content:center;place-items:center;position:relative;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);text-overflow:ellipsis;text-wrap:nowrap;user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);vertical-align:top;--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}:host(:is([disabled],[soft-disabled])){cursor:default;pointer-events:none}.button{border-radius:inherit;cursor:inherit;display:inline-flex;align-items:center;justify-content:center;border:none;outline:none;-webkit-appearance:none;vertical-align:middle;background:rgba(0,0,0,0);text-decoration:none;min-width:calc(64px - var(--_leading-space) - var(--_trailing-space));width:100%;z-index:0;height:100%;font:inherit;color:var(--_label-text-color);padding:0;gap:inherit;text-transform:inherit}.button::-moz-focus-inner{padding:0;border:0}:host(:hover) .button{color:var(--_hover-label-text-color)}:host(:focus-within) .button{color:var(--_focus-label-text-color)}:host(:active) .button{color:var(--_pressed-label-text-color)}.background{background:var(--_container-color);border-radius:inherit;inset:0;position:absolute}.label{overflow:hidden}:is(.button,.label,.label slot),.label ::slotted(*){text-overflow:inherit}:host(:is([disabled],[soft-disabled])) .label{color:var(--_disabled-label-text-color);opacity:var(--_disabled-label-text-opacity)}:host(:is([disabled],[soft-disabled])) .background{background:var(--_disabled-container-color);opacity:var(--_disabled-container-opacity)}@media(forced-colors: active){.background{border:1px solid CanvasText}:host(:is([disabled],[soft-disabled])){--_disabled-icon-color: GrayText;--_disabled-icon-opacity: 1;--_disabled-container-opacity: 1;--_disabled-label-text-color: GrayText;--_disabled-label-text-opacity: 1}}:host([has-icon]:not([trailing-icon])){padding-inline-start:var(--_with-leading-icon-leading-space);padding-inline-end:var(--_with-leading-icon-trailing-space)}:host([has-icon][trailing-icon]){padding-inline-start:var(--_with-trailing-icon-leading-space);padding-inline-end:var(--_with-trailing-icon-trailing-space)}::slotted([slot=icon]){display:inline-flex;position:relative;writing-mode:horizontal-tb;fill:currentColor;flex-shrink:0;color:var(--_icon-color);font-size:var(--_icon-size);inline-size:var(--_icon-size);block-size:var(--_icon-size)}:host(:hover) ::slotted([slot=icon]){color:var(--_hover-icon-color)}:host(:focus-within) ::slotted([slot=icon]){color:var(--_focus-icon-color)}:host(:active) ::slotted([slot=icon]){color:var(--_pressed-icon-color)}:host(:is([disabled],[soft-disabled])) ::slotted([slot=icon]){color:var(--_disabled-icon-color);opacity:var(--_disabled-icon-opacity)}.touch{position:absolute;top:50%;height:max(48px,100%);left:0;right:0;transform:translateY(-50%)}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) 0}:host([touch-target=none]) .touch{display:none}
`;Ot.styleSheet;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let bo=class extends ul{};bo.styles=[Ot,Rr,Gi];bo=l([E("md-elevated-button")],bo);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class ml extends xe{renderElevationOrOutline(){return h`<md-elevation part="elevation"></md-elevation>`}}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Wi=S`:host{--_container-color: var(--md-filled-button-container-color, var(--md-sys-color-primary, #6750a4));--_container-elevation: var(--md-filled-button-container-elevation, 0);--_container-height: var(--md-filled-button-container-height, 40px);--_container-shadow-color: var(--md-filled-button-container-shadow-color, var(--md-sys-color-shadow, #000));--_disabled-container-color: var(--md-filled-button-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-elevation: var(--md-filled-button-disabled-container-elevation, 0);--_disabled-container-opacity: var(--md-filled-button-disabled-container-opacity, 0.12);--_disabled-label-text-color: var(--md-filled-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filled-button-disabled-label-text-opacity, 0.38);--_focus-container-elevation: var(--md-filled-button-focus-container-elevation, 0);--_focus-label-text-color: var(--md-filled-button-focus-label-text-color, var(--md-sys-color-on-primary, #fff));--_hover-container-elevation: var(--md-filled-button-hover-container-elevation, 1);--_hover-label-text-color: var(--md-filled-button-hover-label-text-color, var(--md-sys-color-on-primary, #fff));--_hover-state-layer-color: var(--md-filled-button-hover-state-layer-color, var(--md-sys-color-on-primary, #fff));--_hover-state-layer-opacity: var(--md-filled-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-filled-button-label-text-color, var(--md-sys-color-on-primary, #fff));--_label-text-font: var(--md-filled-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filled-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-filled-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-filled-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-container-elevation: var(--md-filled-button-pressed-container-elevation, 0);--_pressed-label-text-color: var(--md-filled-button-pressed-label-text-color, var(--md-sys-color-on-primary, #fff));--_pressed-state-layer-color: var(--md-filled-button-pressed-state-layer-color, var(--md-sys-color-on-primary, #fff));--_pressed-state-layer-opacity: var(--md-filled-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-filled-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-filled-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-filled-button-focus-icon-color, var(--md-sys-color-on-primary, #fff));--_hover-icon-color: var(--md-filled-button-hover-icon-color, var(--md-sys-color-on-primary, #fff));--_icon-color: var(--md-filled-button-icon-color, var(--md-sys-color-on-primary, #fff));--_icon-size: var(--md-filled-button-icon-size, 18px);--_pressed-icon-color: var(--md-filled-button-pressed-icon-color, var(--md-sys-color-on-primary, #fff));--_container-shape-start-start: var(--md-filled-button-container-shape-start-start, var(--md-filled-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-filled-button-container-shape-start-end, var(--md-filled-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-filled-button-container-shape-end-end, var(--md-filled-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-filled-button-container-shape-end-start, var(--md-filled-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-filled-button-leading-space, 24px);--_trailing-space: var(--md-filled-button-trailing-space, 24px);--_with-leading-icon-leading-space: var(--md-filled-button-with-leading-icon-leading-space, 16px);--_with-leading-icon-trailing-space: var(--md-filled-button-with-leading-icon-trailing-space, 24px);--_with-trailing-icon-leading-space: var(--md-filled-button-with-trailing-icon-leading-space, 24px);--_with-trailing-icon-trailing-space: var(--md-filled-button-with-trailing-icon-trailing-space, 16px)}
`;Wi.styleSheet;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let go=class extends ml{};go.styles=[Ot,Rr,Wi];go=l([E("md-filled-button")],go);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class vl extends xe{renderElevationOrOutline(){return h`<md-elevation part="elevation"></md-elevation>`}}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Yi=S`:host{--_container-color: var(--md-filled-tonal-button-container-color, var(--md-sys-color-secondary-container, #e8def8));--_container-elevation: var(--md-filled-tonal-button-container-elevation, 0);--_container-height: var(--md-filled-tonal-button-container-height, 40px);--_container-shadow-color: var(--md-filled-tonal-button-container-shadow-color, var(--md-sys-color-shadow, #000));--_disabled-container-color: var(--md-filled-tonal-button-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-elevation: var(--md-filled-tonal-button-disabled-container-elevation, 0);--_disabled-container-opacity: var(--md-filled-tonal-button-disabled-container-opacity, 0.12);--_disabled-label-text-color: var(--md-filled-tonal-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filled-tonal-button-disabled-label-text-opacity, 0.38);--_focus-container-elevation: var(--md-filled-tonal-button-focus-container-elevation, 0);--_focus-label-text-color: var(--md-filled-tonal-button-focus-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_hover-container-elevation: var(--md-filled-tonal-button-hover-container-elevation, 1);--_hover-label-text-color: var(--md-filled-tonal-button-hover-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_hover-state-layer-color: var(--md-filled-tonal-button-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_hover-state-layer-opacity: var(--md-filled-tonal-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-filled-tonal-button-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_label-text-font: var(--md-filled-tonal-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filled-tonal-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-filled-tonal-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-filled-tonal-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-container-elevation: var(--md-filled-tonal-button-pressed-container-elevation, 0);--_pressed-label-text-color: var(--md-filled-tonal-button-pressed-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_pressed-state-layer-color: var(--md-filled-tonal-button-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_pressed-state-layer-opacity: var(--md-filled-tonal-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-filled-tonal-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-filled-tonal-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-filled-tonal-button-focus-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_hover-icon-color: var(--md-filled-tonal-button-hover-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_icon-color: var(--md-filled-tonal-button-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_icon-size: var(--md-filled-tonal-button-icon-size, 18px);--_pressed-icon-color: var(--md-filled-tonal-button-pressed-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_container-shape-start-start: var(--md-filled-tonal-button-container-shape-start-start, var(--md-filled-tonal-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-filled-tonal-button-container-shape-start-end, var(--md-filled-tonal-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-filled-tonal-button-container-shape-end-end, var(--md-filled-tonal-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-filled-tonal-button-container-shape-end-start, var(--md-filled-tonal-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-filled-tonal-button-leading-space, 24px);--_trailing-space: var(--md-filled-tonal-button-trailing-space, 24px);--_with-leading-icon-leading-space: var(--md-filled-tonal-button-with-leading-icon-leading-space, 16px);--_with-leading-icon-trailing-space: var(--md-filled-tonal-button-with-leading-icon-trailing-space, 24px);--_with-trailing-icon-leading-space: var(--md-filled-tonal-button-with-trailing-icon-leading-space, 24px);--_with-trailing-icon-trailing-space: var(--md-filled-tonal-button-with-trailing-icon-trailing-space, 16px)}
`;Yi.styleSheet;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let yo=class extends vl{};yo.styles=[Ot,Rr,Yi];yo=l([E("md-filled-tonal-button")],yo);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class fl extends xe{renderElevationOrOutline(){return h`<div class="outline"></div>`}}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Xi=S`:host{--_container-height: var(--md-outlined-button-container-height, 40px);--_disabled-label-text-color: var(--md-outlined-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-outlined-button-disabled-label-text-opacity, 0.38);--_disabled-outline-color: var(--md-outlined-button-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-outlined-button-disabled-outline-opacity, 0.12);--_focus-label-text-color: var(--md-outlined-button-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-label-text-color: var(--md-outlined-button-hover-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-color: var(--md-outlined-button-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-outlined-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-outlined-button-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-font: var(--md-outlined-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-outlined-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-outlined-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-outlined-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_outline-color: var(--md-outlined-button-outline-color, var(--md-sys-color-outline, #79747e));--_outline-width: var(--md-outlined-button-outline-width, 1px);--_pressed-label-text-color: var(--md-outlined-button-pressed-label-text-color, var(--md-sys-color-primary, #6750a4));--_pressed-outline-color: var(--md-outlined-button-pressed-outline-color, var(--md-sys-color-outline, #79747e));--_pressed-state-layer-color: var(--md-outlined-button-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-outlined-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-outlined-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-outlined-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-outlined-button-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-icon-color: var(--md-outlined-button-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-color: var(--md-outlined-button-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-outlined-button-icon-size, 18px);--_pressed-icon-color: var(--md-outlined-button-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_container-shape-start-start: var(--md-outlined-button-container-shape-start-start, var(--md-outlined-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-outlined-button-container-shape-start-end, var(--md-outlined-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-outlined-button-container-shape-end-end, var(--md-outlined-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-outlined-button-container-shape-end-start, var(--md-outlined-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-outlined-button-leading-space, 24px);--_trailing-space: var(--md-outlined-button-trailing-space, 24px);--_with-leading-icon-leading-space: var(--md-outlined-button-with-leading-icon-leading-space, 16px);--_with-leading-icon-trailing-space: var(--md-outlined-button-with-leading-icon-trailing-space, 24px);--_with-trailing-icon-leading-space: var(--md-outlined-button-with-trailing-icon-leading-space, 24px);--_with-trailing-icon-trailing-space: var(--md-outlined-button-with-trailing-icon-trailing-space, 16px);--_container-color: none;--_disabled-container-color: none;--_disabled-container-opacity: 0}.outline{inset:0;border-style:solid;position:absolute;box-sizing:border-box;border-color:var(--_outline-color);border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}:host(:active) .outline{border-color:var(--_pressed-outline-color)}:host(:is([disabled],[soft-disabled])) .outline{border-color:var(--_disabled-outline-color);opacity:var(--_disabled-outline-opacity)}@media(forced-colors: active){:host(:is([disabled],[soft-disabled])) .background{border-color:GrayText}:host(:is([disabled],[soft-disabled])) .outline{opacity:1}}.outline,md-ripple{border-width:var(--_outline-width)}md-ripple{inline-size:calc(100% - 2*var(--_outline-width));block-size:calc(100% - 2*var(--_outline-width));border-style:solid;border-color:rgba(0,0,0,0)}
`;Xi.styleSheet;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let xo=class extends fl{};xo.styles=[Ot,Xi];xo=l([E("md-outlined-button")],xo);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class bl extends xe{}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Zi=S`:host{--_container-height: var(--md-text-button-container-height, 40px);--_disabled-label-text-color: var(--md-text-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-text-button-disabled-label-text-opacity, 0.38);--_focus-label-text-color: var(--md-text-button-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-label-text-color: var(--md-text-button-hover-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-color: var(--md-text-button-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-text-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-text-button-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-font: var(--md-text-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-text-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-text-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-text-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-label-text-color: var(--md-text-button-pressed-label-text-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-color: var(--md-text-button-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-text-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-text-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-text-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-text-button-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-icon-color: var(--md-text-button-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-color: var(--md-text-button-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-text-button-icon-size, 18px);--_pressed-icon-color: var(--md-text-button-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_container-shape-start-start: var(--md-text-button-container-shape-start-start, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-text-button-container-shape-start-end, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-text-button-container-shape-end-end, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-text-button-container-shape-end-start, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-text-button-leading-space, 12px);--_trailing-space: var(--md-text-button-trailing-space, 12px);--_with-leading-icon-leading-space: var(--md-text-button-with-leading-icon-leading-space, 12px);--_with-leading-icon-trailing-space: var(--md-text-button-with-leading-icon-trailing-space, 16px);--_with-trailing-icon-leading-space: var(--md-text-button-with-trailing-icon-leading-space, 16px);--_with-trailing-icon-trailing-space: var(--md-text-button-with-trailing-icon-trailing-space, 12px);--_container-color: none;--_disabled-container-color: none;--_disabled-container-opacity: 0}
`;Zi.styleSheet;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let _o=class extends bl{};_o.styles=[Ot,Zi];_o=l([E("md-text-button")],_o);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function rt(o,e){e.bubbles&&(!o.shadowRoot||e.composed)&&e.stopPropagation();const t=Reflect.construct(e.constructor,[e.type,e]),r=o.dispatchEvent(t);return r||e.preventDefault(),r}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const bt=Symbol("createValidator"),gt=Symbol("getValidityAnchor"),to=Symbol("privateValidator"),He=Symbol("privateSyncValidity"),hr=Symbol("privateCustomValidationMessage");function tr(o){var e;class t extends o{constructor(){super(...arguments),this[e]=""}get validity(){return this[He](),this[ge].validity}get validationMessage(){return this[He](),this[ge].validationMessage}get willValidate(){return this[He](),this[ge].willValidate}checkValidity(){return this[He](),this[ge].checkValidity()}reportValidity(){return this[He](),this[ge].reportValidity()}setCustomValidity(a){this[hr]=a,this[He]()}requestUpdate(a,i,n){super.requestUpdate(a,i,n),this[He]()}firstUpdated(a){super.firstUpdated(a),this[He]()}[(e=hr,He)](){this[to]||(this[to]=this[bt]());const{validity:a,validationMessage:i}=this[to].getValidity(),n=!!this[hr],s=this[hr]||i;this[ge].setValidity({...a,customError:n},s,this[gt]()??void 0)}[bt](){throw new Error("Implement [createValidator]")}[gt](){throw new Error("Implement [getValidityAnchor]")}}return t}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Mr{constructor(e){this.getCurrentState=e,this.currentValidity={validity:{},validationMessage:""}}getValidity(){const e=this.getCurrentState();if(!(!this.prevState||!this.equals(this.prevState,e)))return this.currentValidity;const{validity:r,validationMessage:a}=this.computeValidity(e);return this.prevState=this.copy(e),this.currentValidity={validationMessage:a,validity:{badInput:r.badInput,customError:r.customError,patternMismatch:r.patternMismatch,rangeOverflow:r.rangeOverflow,rangeUnderflow:r.rangeUnderflow,stepMismatch:r.stepMismatch,tooLong:r.tooLong,tooShort:r.tooShort,typeMismatch:r.typeMismatch,valueMissing:r.valueMissing}},this.currentValidity}}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Qi extends Mr{computeValidity(e){return this.checkboxControl||(this.checkboxControl=document.createElement("input"),this.checkboxControl.type="checkbox"),this.checkboxControl.checked=e.checked,this.checkboxControl.required=e.required,{validity:this.checkboxControl.validity,validationMessage:this.checkboxControl.validationMessage}}equals(e,t){return e.checked===t.checked&&e.required===t.required}copy({checked:e,required:t}){return{checked:e,required:t}}}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const gl=ue(tr(it(at(O))));class Ne extends gl{constructor(){super(),this.checked=!1,this.indeterminate=!1,this.required=!1,this.value="on",this.prevChecked=!1,this.prevDisabled=!1,this.prevIndeterminate=!1,this.addEventListener("click",e=>{!er(e)||!this.input||(this.focus(),Or(this.input))})}update(e){(e.has("checked")||e.has("disabled")||e.has("indeterminate"))&&(this.prevChecked=e.get("checked")??this.checked,this.prevDisabled=e.get("disabled")??this.disabled,this.prevIndeterminate=e.get("indeterminate")??this.indeterminate),super.update(e)}render(){const e=!this.prevChecked&&!this.prevIndeterminate,t=this.prevChecked&&!this.prevIndeterminate,r=this.prevIndeterminate,a=this.checked&&!this.indeterminate,i=this.indeterminate,n=Q({disabled:this.disabled,selected:a||i,unselected:!a&&!i,checked:a,indeterminate:i,"prev-unselected":e,"prev-checked":t,"prev-indeterminate":r,"prev-disabled":this.prevDisabled}),{ariaLabel:s,ariaInvalid:d}=this;return h`
      <div class="container ${n}">
        <input
          type="checkbox"
          id="input"
          aria-checked=${i?"mixed":b}
          aria-label=${s||b}
          aria-invalid=${d||b}
          ?disabled=${this.disabled}
          ?required=${this.required}
          .indeterminate=${this.indeterminate}
          .checked=${this.checked}
          @input=${this.handleInput}
          @change=${this.handleChange} />

        <div class="outline"></div>
        <div class="background"></div>
        <md-focus-ring part="focus-ring" for="input"></md-focus-ring>
        <md-ripple for="input" ?disabled=${this.disabled}></md-ripple>
        <svg class="icon" viewBox="0 0 18 18" aria-hidden="true">
          <rect class="mark short" />
          <rect class="mark long" />
        </svg>
      </div>
    `}handleInput(e){const t=e.target;this.checked=t.checked,this.indeterminate=t.indeterminate}handleChange(e){rt(this,e)}[qe](){return!this.checked||this.indeterminate?null:this.value}[Wt](){return String(this.checked)}formResetCallback(){this.checked=this.hasAttribute("checked")}formStateRestoreCallback(e){this.checked=e==="true"}[bt](){return new Qi(()=>this)}[gt](){return this.input}}Ne.shadowRootOptions={...O.shadowRootOptions,delegatesFocus:!0};l([u({type:Boolean})],Ne.prototype,"checked",void 0);l([u({type:Boolean})],Ne.prototype,"indeterminate",void 0);l([u({type:Boolean})],Ne.prototype,"required",void 0);l([u()],Ne.prototype,"value",void 0);l([T()],Ne.prototype,"prevChecked",void 0);l([T()],Ne.prototype,"prevDisabled",void 0);l([T()],Ne.prototype,"prevIndeterminate",void 0);l([U("input")],Ne.prototype,"input",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ji=S`:host{border-start-start-radius:var(--md-checkbox-container-shape-start-start, var(--md-checkbox-container-shape, 2px));border-start-end-radius:var(--md-checkbox-container-shape-start-end, var(--md-checkbox-container-shape, 2px));border-end-end-radius:var(--md-checkbox-container-shape-end-end, var(--md-checkbox-container-shape, 2px));border-end-start-radius:var(--md-checkbox-container-shape-end-start, var(--md-checkbox-container-shape, 2px));display:inline-flex;height:var(--md-checkbox-container-size, 18px);position:relative;vertical-align:top;width:var(--md-checkbox-container-size, 18px);-webkit-tap-highlight-color:rgba(0,0,0,0);cursor:pointer}:host([disabled]){cursor:default}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--md-checkbox-container-size, 18px))/2)}md-focus-ring{height:44px;inset:unset;width:44px}input{appearance:none;height:48px;margin:0;opacity:0;outline:none;position:absolute;width:48px;z-index:1;cursor:inherit}:host([touch-target=none]) input{height:100%;width:100%}.container{border-radius:inherit;display:flex;height:100%;place-content:center;place-items:center;position:relative;width:100%}.outline,.background,.icon{inset:0;position:absolute}.outline,.background{border-radius:inherit}.outline{border-color:var(--md-checkbox-outline-color, var(--md-sys-color-on-surface-variant, #49454f));border-style:solid;border-width:var(--md-checkbox-outline-width, 2px);box-sizing:border-box}.background{background-color:var(--md-checkbox-selected-container-color, var(--md-sys-color-primary, #6750a4))}.background,.icon{opacity:0;transition-duration:150ms,50ms;transition-property:transform,opacity;transition-timing-function:cubic-bezier(0.3, 0, 0.8, 0.15),linear;transform:scale(0.6)}:where(.selected) :is(.background,.icon){opacity:1;transition-duration:350ms,50ms;transition-timing-function:cubic-bezier(0.05, 0.7, 0.1, 1),linear;transform:scale(1)}md-ripple{border-radius:var(--md-checkbox-state-layer-shape, var(--md-sys-shape-corner-full, 9999px));height:var(--md-checkbox-state-layer-size, 40px);inset:unset;width:var(--md-checkbox-state-layer-size, 40px);--md-ripple-hover-color: var(--md-checkbox-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-checkbox-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-checkbox-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--md-ripple-pressed-opacity: var(--md-checkbox-pressed-state-layer-opacity, 0.12)}.selected md-ripple{--md-ripple-hover-color: var(--md-checkbox-selected-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--md-ripple-hover-opacity: var(--md-checkbox-selected-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-checkbox-selected-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-opacity: var(--md-checkbox-selected-pressed-state-layer-opacity, 0.12)}.icon{fill:var(--md-checkbox-selected-icon-color, var(--md-sys-color-on-primary, #fff));height:var(--md-checkbox-icon-size, 18px);width:var(--md-checkbox-icon-size, 18px)}.mark.short{height:2px;transition-property:transform,height;width:2px}.mark.long{height:2px;transition-property:transform,width;width:10px}.mark{animation-duration:150ms;animation-timing-function:cubic-bezier(0.3, 0, 0.8, 0.15);transition-duration:150ms;transition-timing-function:cubic-bezier(0.3, 0, 0.8, 0.15)}.selected .mark{animation-duration:350ms;animation-timing-function:cubic-bezier(0.05, 0.7, 0.1, 1);transition-duration:350ms;transition-timing-function:cubic-bezier(0.05, 0.7, 0.1, 1)}.checked .mark,.prev-checked.unselected .mark{transform:scaleY(-1) translate(7px, -14px) rotate(45deg)}.checked .mark.short,.prev-checked.unselected .mark.short{height:5.6568542495px}.checked .mark.long,.prev-checked.unselected .mark.long{width:11.313708499px}.indeterminate .mark,.prev-indeterminate.unselected .mark{transform:scaleY(-1) translate(4px, -10px) rotate(0deg)}.prev-unselected .mark{transition-property:none}.prev-unselected.checked .mark.long{animation-name:prev-unselected-to-checked}@keyframes prev-unselected-to-checked{from{width:0}}:where(:hover) .outline{border-color:var(--md-checkbox-hover-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-hover-outline-width, 2px)}:where(:hover) .background{background:var(--md-checkbox-selected-hover-container-color, var(--md-sys-color-primary, #6750a4))}:where(:hover) .icon{fill:var(--md-checkbox-selected-hover-icon-color, var(--md-sys-color-on-primary, #fff))}:where(:focus-within) .outline{border-color:var(--md-checkbox-focus-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-focus-outline-width, 2px)}:where(:focus-within) .background{background:var(--md-checkbox-selected-focus-container-color, var(--md-sys-color-primary, #6750a4))}:where(:focus-within) .icon{fill:var(--md-checkbox-selected-focus-icon-color, var(--md-sys-color-on-primary, #fff))}:where(:active) .outline{border-color:var(--md-checkbox-pressed-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-pressed-outline-width, 2px)}:where(:active) .background{background:var(--md-checkbox-selected-pressed-container-color, var(--md-sys-color-primary, #6750a4))}:where(:active) .icon{fill:var(--md-checkbox-selected-pressed-icon-color, var(--md-sys-color-on-primary, #fff))}:where(.disabled,.prev-disabled) :is(.background,.icon,.mark){animation-duration:0s;transition-duration:0s}:where(.disabled) .outline{border-color:var(--md-checkbox-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-disabled-outline-width, 2px);opacity:var(--md-checkbox-disabled-container-opacity, 0.38)}:where(.selected.disabled) .outline{visibility:hidden}:where(.selected.disabled) .background{background:var(--md-checkbox-selected-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-checkbox-selected-disabled-container-opacity, 0.38)}:where(.disabled) .icon{fill:var(--md-checkbox-selected-disabled-icon-color, var(--md-sys-color-surface, #fef7ff))}@media(forced-colors: active){.background{background-color:CanvasText}.selected.disabled .background{background-color:GrayText;opacity:1}.outline{border-color:CanvasText}.disabled .outline{border-color:GrayText;opacity:1}.icon{fill:Canvas}}
`;Ji.styleSheet;/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let wo=class extends Ne{};wo.styles=[Ji];wo=l([E("md-checkbox")],wo);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const yl=ue(O);class je extends yl{get rippleDisabled(){return this.disabled||this.softDisabled}constructor(){super(),this.disabled=!1,this.softDisabled=!1,this.alwaysFocusable=!1,this.label="",this.hasIcon=!1,this.addEventListener("click",this.handleClick.bind(this))}focus(e){this.disabled&&!this.alwaysFocusable||super.focus(e)}render(){return h`
      <div class="container ${Q(this.getContainerClasses())}">
        ${this.renderContainerContent()}
      </div>
    `}updated(e){e.has("disabled")&&e.get("disabled")!==void 0&&this.dispatchEvent(new Event("update-focus",{bubbles:!0}))}getContainerClasses(){return{disabled:this.disabled||this.softDisabled,"has-icon":this.hasIcon}}renderContainerContent(){return h`
      ${this.renderOutline()}
      <md-focus-ring part="focus-ring" for=${this.primaryId}></md-focus-ring>
      <md-ripple
        for=${this.primaryId}
        ?disabled=${this.rippleDisabled}></md-ripple>
      ${this.renderPrimaryAction(this.renderPrimaryContent())}
    `}renderOutline(){return h`<span class="outline"></span>`}renderLeadingIcon(){return h`<slot name="icon" @slotchange=${this.handleIconChange}></slot>`}renderPrimaryContent(){return h`
      <span class="leading icon" aria-hidden="true">
        ${this.renderLeadingIcon()}
      </span>
      <span class="label">
        <span class="label-text" id="label">
          ${this.label?this.label:h`<slot></slot>`}
        </span>
      </span>
      <span class="touch"></span>
    `}handleIconChange(e){const t=e.target;this.hasIcon=t.assignedElements({flatten:!0}).length>0}handleClick(e){if(this.softDisabled||this.disabled&&this.alwaysFocusable){e.stopImmediatePropagation(),e.preventDefault();return}}}je.shadowRootOptions={...O.shadowRootOptions,delegatesFocus:!0};l([u({type:Boolean,reflect:!0})],je.prototype,"disabled",void 0);l([u({type:Boolean,attribute:"soft-disabled",reflect:!0})],je.prototype,"softDisabled",void 0);l([u({type:Boolean,attribute:"always-focusable"})],je.prototype,"alwaysFocusable",void 0);l([u()],je.prototype,"label",void 0);l([u({type:Boolean,reflect:!0,attribute:"has-icon"})],je.prototype,"hasIcon",void 0);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Rt extends je{constructor(){super(...arguments),this.elevated=!1,this.href="",this.download="",this.target=""}get primaryId(){return this.href?"link":"button"}get rippleDisabled(){return!this.href&&(this.disabled||this.softDisabled)}getContainerClasses(){return{...super.getContainerClasses(),disabled:!this.href&&(this.disabled||this.softDisabled),elevated:this.elevated,link:!!this.href}}renderPrimaryAction(e){const{ariaLabel:t}=this;return this.href?h`
        <a
          class="primary action"
          id="link"
          aria-label=${t||b}
          href=${this.href}
          download=${this.download||b}
          target=${this.target||b}
          >${e}</a
        >
      `:h`
      <button
        class="primary action"
        id="button"
        aria-label=${t||b}
        aria-disabled=${this.softDisabled||b}
        ?disabled=${this.disabled&&!this.alwaysFocusable}
        type="button"
        >${e}</button
      >
    `}renderOutline(){return this.elevated?h`<md-elevation part="elevation"></md-elevation>`:super.renderOutline()}}l([u({type:Boolean})],Rt.prototype,"elevated",void 0);l([u()],Rt.prototype,"href",void 0);l([u()],Rt.prototype,"download",void 0);l([u()],Rt.prototype,"target",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const en=S`:host{--_container-height: var(--md-assist-chip-container-height, 32px);--_disabled-label-text-color: var(--md-assist-chip-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-assist-chip-disabled-label-text-opacity, 0.38);--_elevated-container-color: var(--md-assist-chip-elevated-container-color, var(--md-sys-color-surface-container-low, #f7f2fa));--_elevated-container-elevation: var(--md-assist-chip-elevated-container-elevation, 1);--_elevated-container-shadow-color: var(--md-assist-chip-elevated-container-shadow-color, var(--md-sys-color-shadow, #000));--_elevated-disabled-container-color: var(--md-assist-chip-elevated-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_elevated-disabled-container-elevation: var(--md-assist-chip-elevated-disabled-container-elevation, 0);--_elevated-disabled-container-opacity: var(--md-assist-chip-elevated-disabled-container-opacity, 0.12);--_elevated-focus-container-elevation: var(--md-assist-chip-elevated-focus-container-elevation, 1);--_elevated-hover-container-elevation: var(--md-assist-chip-elevated-hover-container-elevation, 2);--_elevated-pressed-container-elevation: var(--md-assist-chip-elevated-pressed-container-elevation, 1);--_focus-label-text-color: var(--md-assist-chip-focus-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-assist-chip-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-color: var(--md-assist-chip-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-opacity: var(--md-assist-chip-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-assist-chip-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_label-text-font: var(--md-assist-chip-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-assist-chip-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-assist-chip-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-assist-chip-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-label-text-color: var(--md-assist-chip-pressed-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_pressed-state-layer-color: var(--md-assist-chip-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_pressed-state-layer-opacity: var(--md-assist-chip-pressed-state-layer-opacity, 0.12);--_disabled-outline-color: var(--md-assist-chip-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-assist-chip-disabled-outline-opacity, 0.12);--_focus-outline-color: var(--md-assist-chip-focus-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_outline-color: var(--md-assist-chip-outline-color, var(--md-sys-color-outline, #79747e));--_outline-width: var(--md-assist-chip-outline-width, 1px);--_disabled-leading-icon-color: var(--md-assist-chip-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-icon-opacity: var(--md-assist-chip-disabled-leading-icon-opacity, 0.38);--_focus-leading-icon-color: var(--md-assist-chip-focus-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-leading-icon-color: var(--md-assist-chip-hover-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_leading-icon-color: var(--md-assist-chip-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-assist-chip-icon-size, 18px);--_pressed-leading-icon-color: var(--md-assist-chip-pressed-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_container-shape-start-start: var(--md-assist-chip-container-shape-start-start, var(--md-assist-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-start-end: var(--md-assist-chip-container-shape-start-end, var(--md-assist-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-end-end: var(--md-assist-chip-container-shape-end-end, var(--md-assist-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-end-start: var(--md-assist-chip-container-shape-end-start, var(--md-assist-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_leading-space: var(--md-assist-chip-leading-space, 16px);--_trailing-space: var(--md-assist-chip-trailing-space, 16px);--_icon-label-space: var(--md-assist-chip-icon-label-space, 8px);--_with-leading-icon-leading-space: var(--md-assist-chip-with-leading-icon-leading-space, 8px)}@media(forced-colors: active){.link .outline{border-color:ActiveText}}
`;en.styleSheet;/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Lr=S`.elevated{--md-elevation-level: var(--_elevated-container-elevation);--md-elevation-shadow-color: var(--_elevated-container-shadow-color)}.elevated::before{background:var(--_elevated-container-color)}.elevated:hover{--md-elevation-level: var(--_elevated-hover-container-elevation)}.elevated:focus-within{--md-elevation-level: var(--_elevated-focus-container-elevation)}.elevated:active{--md-elevation-level: var(--_elevated-pressed-container-elevation)}.elevated.disabled{--md-elevation-level: var(--_elevated-disabled-container-elevation)}.elevated.disabled::before{background:var(--_elevated-disabled-container-color);opacity:var(--_elevated-disabled-container-opacity)}@media(forced-colors: active){.elevated md-elevation{border:1px solid CanvasText}.elevated.disabled md-elevation{border-color:GrayText}}
`;Lr.styleSheet;/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const rr=S`:host{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end);display:inline-flex;height:var(--_container-height);cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}:host(:is([disabled],[soft-disabled])){pointer-events:none}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) 0}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}.container{border-radius:inherit;box-sizing:border-box;display:flex;height:100%;position:relative;width:100%}.container::before{border-radius:inherit;content:"";inset:0;pointer-events:none;position:absolute}.container:not(.disabled){cursor:pointer}.container.disabled{pointer-events:none}.cell{display:flex}.action{align-items:baseline;appearance:none;background:none;border:none;border-radius:inherit;display:flex;outline:none;padding:0;position:relative;text-decoration:none}.primary.action{min-width:0;padding-inline-start:var(--_leading-space);padding-inline-end:var(--_trailing-space)}.has-icon .primary.action{padding-inline-start:var(--_with-leading-icon-leading-space)}.touch{height:48px;inset:50% 0 0;position:absolute;transform:translateY(-50%);width:100%}:host([touch-target=none]) .touch{display:none}.outline{border:var(--_outline-width) solid var(--_outline-color);border-radius:inherit;inset:0;pointer-events:none;position:absolute}:where(:focus) .outline{border-color:var(--_focus-outline-color)}:where(.disabled) .outline{border-color:var(--_disabled-outline-color);opacity:var(--_disabled-outline-opacity)}md-ripple{border-radius:inherit}.label,.icon,.touch{z-index:1}.label{align-items:center;color:var(--_label-text-color);display:flex;font-family:var(--_label-text-font);font-size:var(--_label-text-size);font-weight:var(--_label-text-weight);height:100%;line-height:var(--_label-text-line-height);overflow:hidden;user-select:none}.label-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:where(:hover) .label{color:var(--_hover-label-text-color)}:where(:focus) .label{color:var(--_focus-label-text-color)}:where(:active) .label{color:var(--_pressed-label-text-color)}:where(.disabled) .label{color:var(--_disabled-label-text-color);opacity:var(--_disabled-label-text-opacity)}.icon{align-self:center;display:flex;fill:currentColor;position:relative}.icon ::slotted(:first-child){font-size:var(--_icon-size);height:var(--_icon-size);width:var(--_icon-size)}.leading.icon{color:var(--_leading-icon-color)}.leading.icon ::slotted(*),.leading.icon svg{margin-inline-end:var(--_icon-label-space)}:where(:hover) .leading.icon{color:var(--_hover-leading-icon-color)}:where(:focus) .leading.icon{color:var(--_focus-leading-icon-color)}:where(:active) .leading.icon{color:var(--_pressed-leading-icon-color)}:where(.disabled) .leading.icon{color:var(--_disabled-leading-icon-color);opacity:var(--_disabled-leading-icon-opacity)}@media(forced-colors: active){:where(.disabled) :is(.label,.outline,.leading.icon){color:GrayText;opacity:1}}a,button{text-transform:inherit}a,button:not(:disabled,[aria-disabled=true]){cursor:inherit}
`;rr.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let ko=class extends Rt{};ko.styles=[rr,Lr,en];ko=l([E("md-assist-chip")],ko);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class tn extends O{get chips(){return this.childElements.filter(e=>e instanceof je)}constructor(){super(),this.internals=this.attachInternals(),this.addEventListener("focusin",this.updateTabIndices.bind(this)),this.addEventListener("update-focus",this.updateTabIndices.bind(this)),this.addEventListener("keydown",this.handleKeyDown.bind(this)),this.internals.role="toolbar"}render(){return h`<slot @slotchange=${this.updateTabIndices}></slot>`}handleKeyDown(e){const t=e.key==="ArrowLeft",r=e.key==="ArrowRight",a=e.key==="Home",i=e.key==="End";if(!t&&!r&&!a&&!i)return;const{chips:n}=this;if(n.length<2)return;if(e.preventDefault(),a||i){const g=a?0:n.length-1;n[g].focus({trailing:i}),this.updateTabIndices();return}const d=getComputedStyle(this).direction==="rtl"?t:r,c=n.find(g=>g.matches(":focus-within"));if(!c){(d?n[0]:n[n.length-1]).focus({trailing:!d}),this.updateTabIndices();return}const p=n.indexOf(c);let v=d?p+1:p-1;for(;v!==p;){v>=n.length?v=0:v<0&&(v=n.length-1);const g=n[v];if(g.disabled&&!g.alwaysFocusable){d?v++:v--;continue}g.focus({trailing:!d}),this.updateTabIndices();break}}updateTabIndices(){const{chips:e}=this;let t;for(const r of e){const a=r.alwaysFocusable||!r.disabled;if(r.matches(":focus-within")&&a){t=r;continue}a&&!t&&(t=r),r.tabIndex=-1}t&&(t.tabIndex=0)}}l([ce()],tn.prototype,"childElements",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const rn=S`:host{display:flex;flex-wrap:wrap;gap:8px}
`;rn.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Co=class extends tn{};Co.styles=[rn];Co=l([E("md-chip-set")],Co);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const pr="aria-label-remove";class on extends je{get ariaLabelRemove(){if(this.hasAttribute(pr))return this.getAttribute(pr);const{ariaLabel:e}=this;return e||this.label?`Remove ${e||this.label}`:null}set ariaLabelRemove(e){const t=this.ariaLabelRemove;e!==t&&(e===null?this.removeAttribute(pr):this.setAttribute(pr,e),this.requestUpdate())}constructor(){super(),this.handleTrailingActionFocus=this.handleTrailingActionFocus.bind(this),this.addEventListener("keydown",this.handleKeyDown.bind(this))}focus(e){if((this.alwaysFocusable||!this.disabled)&&(e!=null&&e.trailing)&&this.trailingAction){this.trailingAction.focus(e);return}super.focus(e)}renderContainerContent(){return h`
      ${super.renderContainerContent()}
      ${this.renderTrailingAction(this.handleTrailingActionFocus)}
    `}handleKeyDown(e){var c,p;const t=e.key==="ArrowLeft",r=e.key==="ArrowRight";if(!t&&!r||!this.primaryAction||!this.trailingAction)return;const i=getComputedStyle(this).direction==="rtl"?t:r,n=(c=this.primaryAction)==null?void 0:c.matches(":focus-within"),s=(p=this.trailingAction)==null?void 0:p.matches(":focus-within");if(i&&s||!i&&n)return;e.preventDefault(),e.stopPropagation(),(i?this.trailingAction:this.primaryAction).focus()}handleTrailingActionFocus(){const{primaryAction:e,trailingAction:t}=this;!e||!t||(e.tabIndex=-1,t.addEventListener("focusout",()=>{e.tabIndex=0},{once:!0}))}}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function an({ariaLabel:o,disabled:e,focusListener:t,tabbable:r=!1}){return h`
    <span id="remove-label" hidden aria-hidden="true">Remove</span>
    <button
      class="trailing action"
      aria-label=${o||b}
      aria-labelledby=${o?b:"remove-label label"}
      tabindex=${r?b:-1}
      @click=${xl}
      @focus=${t}>
      <md-focus-ring part="trailing-focus-ring"></md-focus-ring>
      <md-ripple ?disabled=${e}></md-ripple>
      <span class="trailing icon" aria-hidden="true">
        <slot name="remove-trailing-icon">
          <svg viewBox="0 96 960 960">
            <path
              d="m249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
          </svg>
        </slot>
      </span>
      <span class="touch"></span>
    </button>
  `}function xl(o){this.disabled||this.softDisabled||(o.stopPropagation(),!this.dispatchEvent(new Event("remove",{cancelable:!0})))||this.remove()}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class _t extends on{constructor(){super(...arguments),this.elevated=!1,this.removable=!1,this.selected=!1,this.hasSelectedIcon=!1}get primaryId(){return"button"}getContainerClasses(){return{...super.getContainerClasses(),elevated:this.elevated,selected:this.selected,"has-trailing":this.removable,"has-icon":this.hasIcon||this.selected}}renderPrimaryAction(e){const{ariaLabel:t}=this;return h`
      <button
        class="primary action"
        id="button"
        aria-label=${t||b}
        aria-pressed=${this.selected}
        aria-disabled=${this.softDisabled||b}
        ?disabled=${this.disabled&&!this.alwaysFocusable}
        @click=${this.handleClickOnChild}
        >${e}</button
      >
    `}renderLeadingIcon(){return this.selected?h`
      <slot name="selected-icon">
        <svg class="checkmark" viewBox="0 0 18 18" aria-hidden="true">
          <path
            d="M6.75012 12.1274L3.62262 8.99988L2.55762 10.0574L6.75012 14.2499L15.7501 5.24988L14.6926 4.19238L6.75012 12.1274Z" />
        </svg>
      </slot>
    `:super.renderLeadingIcon()}renderTrailingAction(e){return this.removable?an({focusListener:e,ariaLabel:this.ariaLabelRemove,disabled:this.disabled||this.softDisabled}):b}renderOutline(){return this.elevated?h`<md-elevation part="elevation"></md-elevation>`:super.renderOutline()}handleClickOnChild(e){if(this.disabled||this.softDisabled)return;const t=this.selected;if(this.selected=!this.selected,!rt(this,e)){this.selected=t;return}}}l([u({type:Boolean})],_t.prototype,"elevated",void 0);l([u({type:Boolean})],_t.prototype,"removable",void 0);l([u({type:Boolean,reflect:!0})],_t.prototype,"selected",void 0);l([u({type:Boolean,reflect:!0,attribute:"has-selected-icon"})],_t.prototype,"hasSelectedIcon",void 0);l([U(".primary.action")],_t.prototype,"primaryAction",void 0);l([U(".trailing.action")],_t.prototype,"trailingAction",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const nn=S`:host{--_container-height: var(--md-filter-chip-container-height, 32px);--_disabled-label-text-color: var(--md-filter-chip-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filter-chip-disabled-label-text-opacity, 0.38);--_elevated-container-elevation: var(--md-filter-chip-elevated-container-elevation, 1);--_elevated-container-shadow-color: var(--md-filter-chip-elevated-container-shadow-color, var(--md-sys-color-shadow, #000));--_elevated-disabled-container-color: var(--md-filter-chip-elevated-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_elevated-disabled-container-elevation: var(--md-filter-chip-elevated-disabled-container-elevation, 0);--_elevated-disabled-container-opacity: var(--md-filter-chip-elevated-disabled-container-opacity, 0.12);--_elevated-focus-container-elevation: var(--md-filter-chip-elevated-focus-container-elevation, 1);--_elevated-hover-container-elevation: var(--md-filter-chip-elevated-hover-container-elevation, 2);--_elevated-pressed-container-elevation: var(--md-filter-chip-elevated-pressed-container-elevation, 1);--_elevated-selected-container-color: var(--md-filter-chip-elevated-selected-container-color, var(--md-sys-color-secondary-container, #e8def8));--_label-text-font: var(--md-filter-chip-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filter-chip-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-filter-chip-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-filter-chip-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_selected-focus-label-text-color: var(--md-filter-chip-selected-focus-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-label-text-color: var(--md-filter-chip-selected-hover-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-state-layer-color: var(--md-filter-chip-selected-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-state-layer-opacity: var(--md-filter-chip-selected-hover-state-layer-opacity, 0.08);--_selected-label-text-color: var(--md-filter-chip-selected-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-label-text-color: var(--md-filter-chip-selected-pressed-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-state-layer-color: var(--md-filter-chip-selected-pressed-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_selected-pressed-state-layer-opacity: var(--md-filter-chip-selected-pressed-state-layer-opacity, 0.12);--_elevated-container-color: var(--md-filter-chip-elevated-container-color, var(--md-sys-color-surface-container-low, #f7f2fa));--_disabled-outline-color: var(--md-filter-chip-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-filter-chip-disabled-outline-opacity, 0.12);--_disabled-selected-container-color: var(--md-filter-chip-disabled-selected-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-selected-container-opacity: var(--md-filter-chip-disabled-selected-container-opacity, 0.12);--_focus-outline-color: var(--md-filter-chip-focus-outline-color, var(--md-sys-color-on-surface-variant, #49454f));--_outline-color: var(--md-filter-chip-outline-color, var(--md-sys-color-outline, #79747e));--_outline-width: var(--md-filter-chip-outline-width, 1px);--_selected-container-color: var(--md-filter-chip-selected-container-color, var(--md-sys-color-secondary-container, #e8def8));--_selected-outline-width: var(--md-filter-chip-selected-outline-width, 0px);--_focus-label-text-color: var(--md-filter-chip-focus-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-label-text-color: var(--md-filter-chip-hover-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-filter-chip-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-opacity: var(--md-filter-chip-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-filter-chip-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-label-text-color: var(--md-filter-chip-pressed-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-color: var(--md-filter-chip-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_pressed-state-layer-opacity: var(--md-filter-chip-pressed-state-layer-opacity, 0.12);--_icon-size: var(--md-filter-chip-icon-size, 18px);--_disabled-leading-icon-color: var(--md-filter-chip-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-icon-opacity: var(--md-filter-chip-disabled-leading-icon-opacity, 0.38);--_selected-focus-leading-icon-color: var(--md-filter-chip-selected-focus-leading-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-leading-icon-color: var(--md-filter-chip-selected-hover-leading-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-leading-icon-color: var(--md-filter-chip-selected-leading-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-leading-icon-color: var(--md-filter-chip-selected-pressed-leading-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_focus-leading-icon-color: var(--md-filter-chip-focus-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-leading-icon-color: var(--md-filter-chip-hover-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_leading-icon-color: var(--md-filter-chip-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_pressed-leading-icon-color: var(--md-filter-chip-pressed-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_disabled-trailing-icon-color: var(--md-filter-chip-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-icon-opacity: var(--md-filter-chip-disabled-trailing-icon-opacity, 0.38);--_selected-focus-trailing-icon-color: var(--md-filter-chip-selected-focus-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-trailing-icon-color: var(--md-filter-chip-selected-hover-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-trailing-icon-color: var(--md-filter-chip-selected-pressed-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-trailing-icon-color: var(--md-filter-chip-selected-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_focus-trailing-icon-color: var(--md-filter-chip-focus-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-icon-color: var(--md-filter-chip-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-trailing-icon-color: var(--md-filter-chip-pressed-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-icon-color: var(--md-filter-chip-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_container-shape-start-start: var(--md-filter-chip-container-shape-start-start, var(--md-filter-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-start-end: var(--md-filter-chip-container-shape-start-end, var(--md-filter-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-end-end: var(--md-filter-chip-container-shape-end-end, var(--md-filter-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-end-start: var(--md-filter-chip-container-shape-end-start, var(--md-filter-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_leading-space: var(--md-filter-chip-leading-space, 16px);--_trailing-space: var(--md-filter-chip-trailing-space, 16px);--_icon-label-space: var(--md-filter-chip-icon-label-space, 8px);--_with-leading-icon-leading-space: var(--md-filter-chip-with-leading-icon-leading-space, 8px);--_with-trailing-icon-trailing-space: var(--md-filter-chip-with-trailing-icon-trailing-space, 8px)}.selected.elevated::before{background:var(--_elevated-selected-container-color)}.checkmark{height:var(--_icon-size);width:var(--_icon-size)}.disabled .checkmark{opacity:var(--_disabled-leading-icon-opacity)}@media(forced-colors: active){.disabled .checkmark{opacity:1}}
`;nn.styleSheet;/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ea=S`.selected{--md-ripple-hover-color: var(--_selected-hover-state-layer-color);--md-ripple-hover-opacity: var(--_selected-hover-state-layer-opacity);--md-ripple-pressed-color: var(--_selected-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_selected-pressed-state-layer-opacity)}:where(.selected)::before{background:var(--_selected-container-color)}:where(.selected) .outline{border-width:var(--_selected-outline-width)}:where(.selected.disabled)::before{background:var(--_disabled-selected-container-color);opacity:var(--_disabled-selected-container-opacity)}:where(.selected) .label{color:var(--_selected-label-text-color)}:where(.selected:hover) .label{color:var(--_selected-hover-label-text-color)}:where(.selected:focus) .label{color:var(--_selected-focus-label-text-color)}:where(.selected:active) .label{color:var(--_selected-pressed-label-text-color)}:where(.selected) .leading.icon{color:var(--_selected-leading-icon-color)}:where(.selected:hover) .leading.icon{color:var(--_selected-hover-leading-icon-color)}:where(.selected:focus) .leading.icon{color:var(--_selected-focus-leading-icon-color)}:where(.selected:active) .leading.icon{color:var(--_selected-pressed-leading-icon-color)}@media(forced-colors: active){:where(.selected:not(.elevated))::before{border:1px solid CanvasText}:where(.selected) .outline{border-width:1px}}
`;Ea.styleSheet;/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Aa=S`.trailing.action{align-items:center;justify-content:center;padding-inline-start:var(--_icon-label-space);padding-inline-end:var(--_with-trailing-icon-trailing-space)}.trailing.action :is(md-ripple,md-focus-ring){border-radius:50%;height:calc(1.3333333333*var(--_icon-size));width:calc(1.3333333333*var(--_icon-size))}.trailing.action md-focus-ring{inset:unset}.has-trailing .primary.action{padding-inline-end:0}.trailing.icon{color:var(--_trailing-icon-color);height:var(--_icon-size);width:var(--_icon-size)}:where(:hover) .trailing.icon{color:var(--_hover-trailing-icon-color)}:where(:focus) .trailing.icon{color:var(--_focus-trailing-icon-color)}:where(:active) .trailing.icon{color:var(--_pressed-trailing-icon-color)}:where(.disabled) .trailing.icon{color:var(--_disabled-trailing-icon-color);opacity:var(--_disabled-trailing-icon-opacity)}:where(.selected) .trailing.icon{color:var(--_selected-trailing-icon-color)}:where(.selected:hover) .trailing.icon{color:var(--_selected-hover-trailing-icon-color)}:where(.selected:focus) .trailing.icon{color:var(--_selected-focus-trailing-icon-color)}:where(.selected:active) .trailing.icon{color:var(--_selected-pressed-trailing-icon-color)}@media(forced-colors: active){.trailing.icon{color:ButtonText}:where(.disabled) .trailing.icon{color:GrayText;opacity:1}}
`;Aa.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let So=class extends _t{};So.styles=[rr,Lr,Aa,Ea,nn];So=l([E("md-filter-chip")],So);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class wt extends on{constructor(){super(...arguments),this.avatar=!1,this.href="",this.target="",this.removeOnly=!1,this.selected=!1}get primaryId(){return this.href?"link":this.removeOnly?"":"button"}get rippleDisabled(){return!this.href&&(this.disabled||this.softDisabled)}get primaryAction(){return this.removeOnly?null:this.renderRoot.querySelector(".primary.action")}getContainerClasses(){return{...super.getContainerClasses(),avatar:this.avatar,disabled:!this.href&&(this.disabled||this.softDisabled),link:!!this.href,selected:this.selected,"has-trailing":!0}}renderPrimaryAction(e){const{ariaLabel:t}=this;return this.href?h`
        <a
          class="primary action"
          id="link"
          aria-label=${t||b}
          href=${this.href}
          target=${this.target||b}
          >${e}</a
        >
      `:this.removeOnly?h`
        <span class="primary action" aria-label=${t||b}>
          ${e}
        </span>
      `:h`
      <button
        class="primary action"
        id="button"
        aria-label=${t||b}
        aria-disabled=${this.softDisabled||b}
        ?disabled=${this.disabled&&!this.alwaysFocusable}
        type="button"
        >${e}</button
      >
    `}renderTrailingAction(e){return an({focusListener:e,ariaLabel:this.ariaLabelRemove,disabled:!this.href&&(this.disabled||this.softDisabled),tabbable:this.removeOnly})}}l([u({type:Boolean})],wt.prototype,"avatar",void 0);l([u()],wt.prototype,"href",void 0);l([u()],wt.prototype,"target",void 0);l([u({type:Boolean,attribute:"remove-only"})],wt.prototype,"removeOnly",void 0);l([u({type:Boolean,reflect:!0})],wt.prototype,"selected",void 0);l([U(".trailing.action")],wt.prototype,"trailingAction",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const sn=S`:host{--_container-height: var(--md-input-chip-container-height, 32px);--_disabled-label-text-color: var(--md-input-chip-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-input-chip-disabled-label-text-opacity, 0.38);--_disabled-selected-container-color: var(--md-input-chip-disabled-selected-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-selected-container-opacity: var(--md-input-chip-disabled-selected-container-opacity, 0.12);--_label-text-font: var(--md-input-chip-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-input-chip-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-input-chip-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-input-chip-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_selected-container-color: var(--md-input-chip-selected-container-color, var(--md-sys-color-secondary-container, #e8def8));--_selected-focus-label-text-color: var(--md-input-chip-selected-focus-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-label-text-color: var(--md-input-chip-selected-hover-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-state-layer-color: var(--md-input-chip-selected-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-state-layer-opacity: var(--md-input-chip-selected-hover-state-layer-opacity, 0.08);--_selected-label-text-color: var(--md-input-chip-selected-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-outline-width: var(--md-input-chip-selected-outline-width, 0px);--_selected-pressed-label-text-color: var(--md-input-chip-selected-pressed-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-state-layer-color: var(--md-input-chip-selected-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-state-layer-opacity: var(--md-input-chip-selected-pressed-state-layer-opacity, 0.12);--_disabled-outline-color: var(--md-input-chip-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-input-chip-disabled-outline-opacity, 0.12);--_focus-label-text-color: var(--md-input-chip-focus-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-outline-color: var(--md-input-chip-focus-outline-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-label-text-color: var(--md-input-chip-hover-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-input-chip-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-opacity: var(--md-input-chip-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-input-chip-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_outline-color: var(--md-input-chip-outline-color, var(--md-sys-color-outline, #79747e));--_outline-width: var(--md-input-chip-outline-width, 1px);--_pressed-label-text-color: var(--md-input-chip-pressed-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-color: var(--md-input-chip-pressed-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-opacity: var(--md-input-chip-pressed-state-layer-opacity, 0.12);--_avatar-shape: var(--md-input-chip-avatar-shape, var(--md-sys-shape-corner-full, 9999px));--_avatar-size: var(--md-input-chip-avatar-size, 24px);--_disabled-avatar-opacity: var(--md-input-chip-disabled-avatar-opacity, 0.38);--_disabled-leading-icon-color: var(--md-input-chip-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-icon-opacity: var(--md-input-chip-disabled-leading-icon-opacity, 0.38);--_icon-size: var(--md-input-chip-icon-size, 18px);--_selected-focus-leading-icon-color: var(--md-input-chip-selected-focus-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-leading-icon-color: var(--md-input-chip-selected-hover-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-leading-icon-color: var(--md-input-chip-selected-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-leading-icon-color: var(--md-input-chip-selected-pressed-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_focus-leading-icon-color: var(--md-input-chip-focus-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-leading-icon-color: var(--md-input-chip-hover-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_leading-icon-color: var(--md-input-chip-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_pressed-leading-icon-color: var(--md-input-chip-pressed-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_disabled-trailing-icon-color: var(--md-input-chip-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-icon-opacity: var(--md-input-chip-disabled-trailing-icon-opacity, 0.38);--_selected-focus-trailing-icon-color: var(--md-input-chip-selected-focus-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-trailing-icon-color: var(--md-input-chip-selected-hover-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-trailing-icon-color: var(--md-input-chip-selected-pressed-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-trailing-icon-color: var(--md-input-chip-selected-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_focus-trailing-icon-color: var(--md-input-chip-focus-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-icon-color: var(--md-input-chip-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-trailing-icon-color: var(--md-input-chip-pressed-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-icon-color: var(--md-input-chip-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_container-shape-start-start: var(--md-input-chip-container-shape-start-start, var(--md-input-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-start-end: var(--md-input-chip-container-shape-start-end, var(--md-input-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-end-end: var(--md-input-chip-container-shape-end-end, var(--md-input-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-end-start: var(--md-input-chip-container-shape-end-start, var(--md-input-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_leading-space: var(--md-input-chip-leading-space, 16px);--_trailing-space: var(--md-input-chip-trailing-space, 16px);--_icon-label-space: var(--md-input-chip-icon-label-space, 8px);--_with-leading-icon-leading-space: var(--md-input-chip-with-leading-icon-leading-space, 8px);--_with-trailing-icon-trailing-space: var(--md-input-chip-with-trailing-icon-trailing-space, 8px)}:host([avatar]){--_container-shape-start-start: var( --md-input-chip-container-shape-start-start, var(--md-input-chip-container-shape, calc(var(--_container-height) / 2)) );--_container-shape-start-end: var( --md-input-chip-container-shape-start-end, var(--md-input-chip-container-shape, calc(var(--_container-height) / 2)) );--_container-shape-end-end: var( --md-input-chip-container-shape-end-end, var(--md-input-chip-container-shape, calc(var(--_container-height) / 2)) );--_container-shape-end-start: var( --md-input-chip-container-shape-end-start, var(--md-input-chip-container-shape, calc(var(--_container-height) / 2)) )}.avatar .primary.action{padding-inline-start:4px}.avatar .leading.icon ::slotted(:first-child){border-radius:var(--_avatar-shape);height:var(--_avatar-size);width:var(--_avatar-size)}.disabled.avatar .leading.icon{opacity:var(--_disabled-avatar-opacity)}@media(forced-colors: active){.link .outline{border-color:ActiveText}.disabled.avatar .leading.icon{opacity:1}}
`;sn.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let $o=class extends wt{};$o.styles=[rr,Aa,Ea,sn];$o=l([E("md-input-chip")],$o);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class _l extends Rt{}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const ln=S`:host{--_container-height: var(--md-suggestion-chip-container-height, 32px);--_disabled-label-text-color: var(--md-suggestion-chip-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-suggestion-chip-disabled-label-text-opacity, 0.38);--_elevated-container-color: var(--md-suggestion-chip-elevated-container-color, var(--md-sys-color-surface-container-low, #f7f2fa));--_elevated-container-elevation: var(--md-suggestion-chip-elevated-container-elevation, 1);--_elevated-container-shadow-color: var(--md-suggestion-chip-elevated-container-shadow-color, var(--md-sys-color-shadow, #000));--_elevated-disabled-container-color: var(--md-suggestion-chip-elevated-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_elevated-disabled-container-elevation: var(--md-suggestion-chip-elevated-disabled-container-elevation, 0);--_elevated-disabled-container-opacity: var(--md-suggestion-chip-elevated-disabled-container-opacity, 0.12);--_elevated-focus-container-elevation: var(--md-suggestion-chip-elevated-focus-container-elevation, 1);--_elevated-hover-container-elevation: var(--md-suggestion-chip-elevated-hover-container-elevation, 2);--_elevated-pressed-container-elevation: var(--md-suggestion-chip-elevated-pressed-container-elevation, 1);--_focus-label-text-color: var(--md-suggestion-chip-focus-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-label-text-color: var(--md-suggestion-chip-hover-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-suggestion-chip-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-opacity: var(--md-suggestion-chip-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-suggestion-chip-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-font: var(--md-suggestion-chip-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-suggestion-chip-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-suggestion-chip-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-suggestion-chip-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-label-text-color: var(--md-suggestion-chip-pressed-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-color: var(--md-suggestion-chip-pressed-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-opacity: var(--md-suggestion-chip-pressed-state-layer-opacity, 0.12);--_disabled-outline-color: var(--md-suggestion-chip-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-suggestion-chip-disabled-outline-opacity, 0.12);--_focus-outline-color: var(--md-suggestion-chip-focus-outline-color, var(--md-sys-color-on-surface-variant, #49454f));--_outline-color: var(--md-suggestion-chip-outline-color, var(--md-sys-color-outline, #79747e));--_outline-width: var(--md-suggestion-chip-outline-width, 1px);--_disabled-leading-icon-color: var(--md-suggestion-chip-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-icon-opacity: var(--md-suggestion-chip-disabled-leading-icon-opacity, 0.38);--_focus-leading-icon-color: var(--md-suggestion-chip-focus-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-leading-icon-color: var(--md-suggestion-chip-hover-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_leading-icon-color: var(--md-suggestion-chip-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_pressed-leading-icon-color: var(--md-suggestion-chip-pressed-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-suggestion-chip-icon-size, 18px);--_container-shape-start-start: var(--md-suggestion-chip-container-shape-start-start, var(--md-suggestion-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-start-end: var(--md-suggestion-chip-container-shape-start-end, var(--md-suggestion-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-end-end: var(--md-suggestion-chip-container-shape-end-end, var(--md-suggestion-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-end-start: var(--md-suggestion-chip-container-shape-end-start, var(--md-suggestion-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_leading-space: var(--md-suggestion-chip-leading-space, 16px);--_trailing-space: var(--md-suggestion-chip-trailing-space, 16px);--_icon-label-space: var(--md-suggestion-chip-icon-label-space, 8px);--_with-leading-icon-leading-space: var(--md-suggestion-chip-with-leading-icon-leading-space, 8px)}@media(forced-colors: active){.link .outline{border-color:ActiveText}}
`;ln.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let To=class extends _l{};To.styles=[rr,Lr,ln];To=l([E("md-suggestion-chip")],To);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Dr extends O{constructor(){super(...arguments),this.inset=!1,this.insetStart=!1,this.insetEnd=!1}}l([u({type:Boolean,reflect:!0})],Dr.prototype,"inset",void 0);l([u({type:Boolean,reflect:!0,attribute:"inset-start"})],Dr.prototype,"insetStart",void 0);l([u({type:Boolean,reflect:!0,attribute:"inset-end"})],Dr.prototype,"insetEnd",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const dn=S`:host{box-sizing:border-box;color:var(--md-divider-color, var(--md-sys-color-outline-variant, #cac4d0));display:flex;height:var(--md-divider-thickness, 1px);width:100%}:host([inset]),:host([inset-start]){padding-inline-start:16px}:host([inset]),:host([inset-end]){padding-inline-end:16px}:host::before{background:currentColor;content:"";height:100%;width:100%}@media(forced-colors: active){:host::before{background:CanvasText}}
`;dn.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Eo=class extends Dr{};Eo.styles=[dn];Eo=l([E("md-divider")],Eo);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const wl={dialog:[[[{transform:"translateY(-50px)"},{transform:"translateY(0)"}],{duration:500,easing:Le.EMPHASIZED}]],scrim:[[[{opacity:0},{opacity:.32}],{duration:500,easing:"linear"}]],container:[[[{opacity:0},{opacity:1}],{duration:50,easing:"linear",pseudoElement:"::before"}],[[{height:"35%"},{height:"100%"}],{duration:500,easing:Le.EMPHASIZED,pseudoElement:"::before"}]],headline:[[[{opacity:0},{opacity:0,offset:.2},{opacity:1}],{duration:250,easing:"linear",fill:"forwards"}]],content:[[[{opacity:0},{opacity:0,offset:.2},{opacity:1}],{duration:250,easing:"linear",fill:"forwards"}]],actions:[[[{opacity:0},{opacity:0,offset:.5},{opacity:1}],{duration:300,easing:"linear",fill:"forwards"}]]},kl={dialog:[[[{transform:"translateY(0)"},{transform:"translateY(-50px)"}],{duration:150,easing:Le.EMPHASIZED_ACCELERATE}]],scrim:[[[{opacity:.32},{opacity:0}],{duration:150,easing:"linear"}]],container:[[[{height:"100%"},{height:"35%"}],{duration:150,easing:Le.EMPHASIZED_ACCELERATE,pseudoElement:"::before"}],[[{opacity:"1"},{opacity:"0"}],{delay:100,duration:50,easing:"linear",pseudoElement:"::before"}]],headline:[[[{opacity:1},{opacity:0}],{duration:100,easing:"linear",fill:"forwards"}]],content:[[[{opacity:1},{opacity:0}],{duration:100,easing:"linear",fill:"forwards"}]],actions:[[[{opacity:1},{opacity:0}],{duration:100,easing:"linear",fill:"forwards"}]]};/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Cl=ue(O);class ne extends Cl{get open(){return this.isOpen}set open(e){e!==this.isOpen&&(this.isOpen=e,e?(this.setAttribute("open",""),this.show()):(this.removeAttribute("open"),this.close()))}constructor(){super(),this.quick=!1,this.returnValue="",this.noFocusTrap=!1,this.getOpenAnimation=()=>wl,this.getCloseAnimation=()=>kl,this.isOpen=!1,this.isOpening=!1,this.isConnectedPromise=this.getIsConnectedPromise(),this.isAtScrollTop=!1,this.isAtScrollBottom=!1,this.nextClickIsFromContent=!1,this.hasHeadline=!1,this.hasActions=!1,this.hasIcon=!1,this.escapePressedWithoutCancel=!1,this.treewalker=document.createTreeWalker(this,NodeFilter.SHOW_ELEMENT),this.addEventListener("submit",this.handleSubmit)}async show(){var r;this.isOpening=!0,await this.isConnectedPromise,await this.updateComplete;const e=this.dialog;if(e.open||!this.isOpening){this.isOpening=!1;return}if(!this.dispatchEvent(new Event("open",{cancelable:!0}))){this.open=!1,this.isOpening=!1;return}e.showModal(),this.open=!0,this.scroller&&(this.scroller.scrollTop=0),(r=this.querySelector("[autofocus]"))==null||r.focus(),await this.animateDialog(this.getOpenAnimation()),this.dispatchEvent(new Event("opened")),this.isOpening=!1}async close(e=this.returnValue){if(this.isOpening=!1,!this.isConnected){this.open=!1;return}await this.updateComplete;const t=this.dialog;if(!t.open||this.isOpening){this.open=!1;return}const r=this.returnValue;if(this.returnValue=e,!this.dispatchEvent(new Event("close",{cancelable:!0}))){this.returnValue=r;return}await this.animateDialog(this.getCloseAnimation()),t.close(e),this.open=!1,this.dispatchEvent(new Event("closed"))}connectedCallback(){super.connectedCallback(),this.isConnectedPromiseResolve()}disconnectedCallback(){super.disconnectedCallback(),this.isConnectedPromise=this.getIsConnectedPromise()}render(){const e=this.open&&!(this.isAtScrollTop&&this.isAtScrollBottom),t={"has-headline":this.hasHeadline,"has-actions":this.hasActions,"has-icon":this.hasIcon,scrollable:e,"show-top-divider":e&&!this.isAtScrollTop,"show-bottom-divider":e&&!this.isAtScrollBottom},r=this.open&&!this.noFocusTrap,a=h`
      <div
        class="focus-trap"
        tabindex="0"
        aria-hidden="true"
        @focus=${this.handleFocusTrapFocus}></div>
    `,{ariaLabel:i}=this;return h`
      <div class="scrim"></div>
      <dialog
        class=${Q(t)}
        aria-label=${i||b}
        aria-labelledby=${this.hasHeadline?"headline":b}
        role=${this.type==="alert"?"alertdialog":b}
        @cancel=${this.handleCancel}
        @click=${this.handleDialogClick}
        @close=${this.handleClose}
        @keydown=${this.handleKeydown}
        .returnValue=${this.returnValue||b}>
        ${r?a:b}
        <div class="container" @click=${this.handleContentClick}>
          <div class="headline">
            <div class="icon" aria-hidden="true">
              <slot name="icon" @slotchange=${this.handleIconChange}></slot>
            </div>
            <h2 id="headline" aria-hidden=${!this.hasHeadline||b}>
              <slot
                name="headline"
                @slotchange=${this.handleHeadlineChange}></slot>
            </h2>
            <md-divider></md-divider>
          </div>
          <div class="scroller">
            <div class="content">
              <div class="top anchor"></div>
              <slot name="content"></slot>
              <div class="bottom anchor"></div>
            </div>
          </div>
          <div class="actions">
            <md-divider></md-divider>
            <slot name="actions" @slotchange=${this.handleActionsChange}></slot>
          </div>
        </div>
        ${r?a:b}
      </dialog>
    `}firstUpdated(){this.intersectionObserver=new IntersectionObserver(e=>{for(const t of e)this.handleAnchorIntersection(t)},{root:this.scroller}),this.intersectionObserver.observe(this.topAnchor),this.intersectionObserver.observe(this.bottomAnchor)}handleDialogClick(){if(this.nextClickIsFromContent){this.nextClickIsFromContent=!1;return}this.dispatchEvent(new Event("cancel",{cancelable:!0}))&&this.close()}handleContentClick(){this.nextClickIsFromContent=!0}handleSubmit(e){const t=e.target,{submitter:r}=e;t.getAttribute("method")!=="dialog"||!r||this.close(r.getAttribute("value")??this.returnValue)}handleCancel(e){if(e.target!==this.dialog)return;this.escapePressedWithoutCancel=!1;const t=!rt(this,e);e.preventDefault(),!t&&this.close()}handleClose(){var e;this.escapePressedWithoutCancel&&(this.escapePressedWithoutCancel=!1,(e=this.dialog)==null||e.dispatchEvent(new Event("cancel",{cancelable:!0})))}handleKeydown(e){e.key==="Escape"&&(this.escapePressedWithoutCancel=!0,setTimeout(()=>{this.escapePressedWithoutCancel=!1}))}async animateDialog(e){var C;if((C=this.cancelAnimations)==null||C.abort(),this.cancelAnimations=new AbortController,this.quick)return;const{dialog:t,scrim:r,container:a,headline:i,content:n,actions:s}=this;if(!t||!r||!a||!i||!n||!s)return;const{container:d,dialog:c,scrim:p,headline:v,content:g,actions:_}=e,w=[[t,c??[]],[r,p??[]],[a,d??[]],[i,v??[]],[n,g??[]],[s,_??[]]],x=[];for(const[P,A]of w)for(const V of A){const F=P.animate(...V);this.cancelAnimations.signal.addEventListener("abort",()=>{F.cancel()}),x.push(F)}await Promise.all(x.map(P=>P.finished.catch(()=>{})))}handleHeadlineChange(e){const t=e.target;this.hasHeadline=t.assignedElements().length>0}handleActionsChange(e){const t=e.target;this.hasActions=t.assignedElements().length>0}handleIconChange(e){const t=e.target;this.hasIcon=t.assignedElements().length>0}handleAnchorIntersection(e){const{target:t,isIntersecting:r}=e;t===this.topAnchor&&(this.isAtScrollTop=r),t===this.bottomAnchor&&(this.isAtScrollBottom=r)}getIsConnectedPromise(){return new Promise(e=>{this.isConnectedPromiseResolve=e})}handleFocusTrapFocus(e){var v;const[t,r]=this.getFirstAndLastFocusableChildren();if(!t||!r){(v=this.dialog)==null||v.focus();return}const a=e.target===this.firstFocusTrap,i=!a,n=e.relatedTarget===t,s=e.relatedTarget===r,d=!n&&!s;if(i&&s||a&&d){t.focus();return}if(a&&n||i&&d){r.focus();return}}getFirstAndLastFocusableChildren(){if(!this.treewalker)return[null,null];let e=null,t=null;for(this.treewalker.currentNode=this.treewalker.root;this.treewalker.nextNode();){const r=this.treewalker.currentNode;Sl(r)&&(e||(e=r),t=r)}return[e,t]}}l([u({type:Boolean})],ne.prototype,"open",null);l([u({type:Boolean})],ne.prototype,"quick",void 0);l([u({attribute:!1})],ne.prototype,"returnValue",void 0);l([u()],ne.prototype,"type",void 0);l([u({type:Boolean,attribute:"no-focus-trap"})],ne.prototype,"noFocusTrap",void 0);l([U("dialog")],ne.prototype,"dialog",void 0);l([U(".scrim")],ne.prototype,"scrim",void 0);l([U(".container")],ne.prototype,"container",void 0);l([U(".headline")],ne.prototype,"headline",void 0);l([U(".content")],ne.prototype,"content",void 0);l([U(".actions")],ne.prototype,"actions",void 0);l([T()],ne.prototype,"isAtScrollTop",void 0);l([T()],ne.prototype,"isAtScrollBottom",void 0);l([U(".scroller")],ne.prototype,"scroller",void 0);l([U(".top.anchor")],ne.prototype,"topAnchor",void 0);l([U(".bottom.anchor")],ne.prototype,"bottomAnchor",void 0);l([U(".focus-trap")],ne.prototype,"firstFocusTrap",void 0);l([T()],ne.prototype,"hasHeadline",void 0);l([T()],ne.prototype,"hasActions",void 0);l([T()],ne.prototype,"hasIcon",void 0);function Sl(o){var i;const e=":is(button,input,select,textarea,object,:is(a,area)[href],[tabindex],[contenteditable=true])",t=":not(:disabled,[disabled])";return o.matches(e+t+':not([tabindex^="-"])')?!0:!o.localName.includes("-")||!o.matches(t)?!1:((i=o.shadowRoot)==null?void 0:i.delegatesFocus)??!1}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const cn=S`:host{border-start-start-radius:var(--md-dialog-container-shape-start-start, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-start-end-radius:var(--md-dialog-container-shape-start-end, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-end-end-radius:var(--md-dialog-container-shape-end-end, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-end-start-radius:var(--md-dialog-container-shape-end-start, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));display:contents;margin:auto;max-height:min(560px,100% - 48px);max-width:min(560px,100% - 48px);min-height:140px;min-width:280px;position:fixed;height:fit-content;width:fit-content}dialog{background:rgba(0,0,0,0);border:none;border-radius:inherit;flex-direction:column;height:inherit;margin:inherit;max-height:inherit;max-width:inherit;min-height:inherit;min-width:inherit;outline:none;overflow:visible;padding:0;width:inherit}dialog[open]{display:flex}::backdrop{background:none}.scrim{background:var(--md-sys-color-scrim, #000);display:none;inset:0;opacity:32%;pointer-events:none;position:fixed;z-index:1}:host([open]) .scrim{display:flex}h2{all:unset;align-self:stretch}.headline{align-items:center;color:var(--md-dialog-headline-color, var(--md-sys-color-on-surface, #1d1b20));display:flex;flex-direction:column;font-family:var(--md-dialog-headline-font, var(--md-sys-typescale-headline-small-font, var(--md-ref-typeface-brand, Roboto)));font-size:var(--md-dialog-headline-size, var(--md-sys-typescale-headline-small-size, 1.5rem));line-height:var(--md-dialog-headline-line-height, var(--md-sys-typescale-headline-small-line-height, 2rem));font-weight:var(--md-dialog-headline-weight, var(--md-sys-typescale-headline-small-weight, var(--md-ref-typeface-weight-regular, 400)));position:relative}slot[name=headline]::slotted(*){align-items:center;align-self:stretch;box-sizing:border-box;display:flex;gap:8px;padding:24px 24px 0}.icon{display:flex}slot[name=icon]::slotted(*){color:var(--md-dialog-icon-color, var(--md-sys-color-secondary, #625b71));fill:currentColor;font-size:var(--md-dialog-icon-size, 24px);margin-top:24px;height:var(--md-dialog-icon-size, 24px);width:var(--md-dialog-icon-size, 24px)}.has-icon slot[name=headline]::slotted(*){justify-content:center;padding-top:16px}.scrollable slot[name=headline]::slotted(*){padding-bottom:16px}.scrollable.has-headline slot[name=content]::slotted(*){padding-top:8px}.container{border-radius:inherit;display:flex;flex-direction:column;flex-grow:1;overflow:hidden;position:relative;transform-origin:top}.container::before{background:var(--md-dialog-container-color, var(--md-sys-color-surface-container-high, #ece6f0));border-radius:inherit;content:"";inset:0;position:absolute}.scroller{display:flex;flex:1;flex-direction:column;overflow:hidden;z-index:1}.scrollable .scroller{overflow-y:scroll}.content{color:var(--md-dialog-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-dialog-supporting-text-font, var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-dialog-supporting-text-size, var(--md-sys-typescale-body-medium-size, 0.875rem));line-height:var(--md-dialog-supporting-text-line-height, var(--md-sys-typescale-body-medium-line-height, 1.25rem));flex:1;font-weight:var(--md-dialog-supporting-text-weight, var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)));height:min-content;position:relative}slot[name=content]::slotted(*){box-sizing:border-box;padding:24px}.anchor{position:absolute}.top.anchor{top:0}.bottom.anchor{bottom:0}.actions{position:relative}slot[name=actions]::slotted(*){box-sizing:border-box;display:flex;gap:8px;justify-content:flex-end;padding:16px 24px 24px}.has-actions slot[name=content]::slotted(*){padding-bottom:8px}md-divider{display:none;position:absolute}.has-headline.show-top-divider .headline md-divider,.has-actions.show-bottom-divider .actions md-divider{display:flex}.headline md-divider{bottom:0}.actions md-divider{top:0}@media(forced-colors: active){dialog{outline:2px solid WindowText}}
`;cn.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Ao=class extends ne{};Ao.styles=[cn];Ao=l([E("md-dialog")],Ao);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const $l=ue(O);class or extends $l{constructor(){super(...arguments),this.size="medium",this.label="",this.lowered=!1}render(){const{ariaLabel:e}=this;return h`
      <button
        class="fab ${Q(this.getRenderClasses())}"
        aria-label=${e||b}>
        <md-elevation part="elevation"></md-elevation>
        <md-focus-ring part="focus-ring"></md-focus-ring>
        <md-ripple class="ripple"></md-ripple>
        ${this.renderTouchTarget()} ${this.renderIcon()} ${this.renderLabel()}
      </button>
    `}getRenderClasses(){const e=!!this.label;return{lowered:this.lowered,small:this.size==="small"&&!e,large:this.size==="large"&&!e,extended:e}}renderTouchTarget(){return h`<div class="touch-target"></div>`}renderLabel(){return this.label?h`<span class="label">${this.label}</span>`:""}renderIcon(){const{ariaLabel:e}=this;return h`<span class="icon">
      <slot
        name="icon"
        aria-hidden=${e||this.label?"true":b}>
        <span></span>
      </slot>
    </span>`}}or.shadowRootOptions={mode:"open",delegatesFocus:!0};l([u({reflect:!0})],or.prototype,"size",void 0);l([u()],or.prototype,"label",void 0);l([u({type:Boolean})],or.prototype,"lowered",void 0);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Pa extends or{constructor(){super(...arguments),this.variant="surface"}getRenderClasses(){return{...super.getRenderClasses(),primary:this.variant==="primary",secondary:this.variant==="secondary",tertiary:this.variant==="tertiary"}}}l([u()],Pa.prototype,"variant",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const hn=S`:host{--_container-color: var(--md-fab-branded-container-color, var(--md-sys-color-surface-container-high, #ece6f0));--_container-elevation: var(--md-fab-branded-container-elevation, 3);--_container-height: var(--md-fab-branded-container-height, 56px);--_container-shadow-color: var(--md-fab-branded-container-shadow-color, var(--md-sys-color-shadow, #000));--_container-width: var(--md-fab-branded-container-width, 56px);--_focus-container-elevation: var(--md-fab-branded-focus-container-elevation, 3);--_hover-container-elevation: var(--md-fab-branded-hover-container-elevation, 4);--_hover-state-layer-color: var(--md-fab-branded-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-fab-branded-hover-state-layer-opacity, 0.08);--_icon-size: var(--md-fab-branded-icon-size, 36px);--_lowered-container-color: var(--md-fab-branded-lowered-container-color, var(--md-sys-color-surface-container-low, #f7f2fa));--_lowered-container-elevation: var(--md-fab-branded-lowered-container-elevation, 1);--_lowered-focus-container-elevation: var(--md-fab-branded-lowered-focus-container-elevation, 1);--_lowered-hover-container-elevation: var(--md-fab-branded-lowered-hover-container-elevation, 2);--_lowered-pressed-container-elevation: var(--md-fab-branded-lowered-pressed-container-elevation, 1);--_pressed-container-elevation: var(--md-fab-branded-pressed-container-elevation, 3);--_pressed-state-layer-color: var(--md-fab-branded-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-fab-branded-pressed-state-layer-opacity, 0.12);--_focus-label-text-color: var(--md-fab-branded-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-label-text-color: var(--md-fab-branded-hover-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-color: var(--md-fab-branded-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_label-text-font: var(--md-fab-branded-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-size: var(--md-fab-branded-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-line-height: var(--md-fab-branded-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-weight: var(--md-fab-branded-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_large-container-height: var(--md-fab-branded-large-container-height, 96px);--_large-container-width: var(--md-fab-branded-large-container-width, 96px);--_large-icon-size: var(--md-fab-branded-large-icon-size, 48px);--_pressed-label-text-color: var(--md-fab-branded-pressed-label-text-color, var(--md-sys-color-primary, #6750a4));--_container-shape-start-start: var(--md-fab-branded-container-shape-start-start, var(--md-fab-branded-container-shape, var(--md-sys-shape-corner-large, 16px)));--_container-shape-start-end: var(--md-fab-branded-container-shape-start-end, var(--md-fab-branded-container-shape, var(--md-sys-shape-corner-large, 16px)));--_container-shape-end-end: var(--md-fab-branded-container-shape-end-end, var(--md-fab-branded-container-shape, var(--md-sys-shape-corner-large, 16px)));--_container-shape-end-start: var(--md-fab-branded-container-shape-end-start, var(--md-fab-branded-container-shape, var(--md-sys-shape-corner-large, 16px)));--_large-container-shape-start-start: var(--md-fab-branded-large-container-shape-start-start, var(--md-fab-branded-large-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));--_large-container-shape-start-end: var(--md-fab-branded-large-container-shape-start-end, var(--md-fab-branded-large-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));--_large-container-shape-end-end: var(--md-fab-branded-large-container-shape-end-end, var(--md-fab-branded-large-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));--_large-container-shape-end-start: var(--md-fab-branded-large-container-shape-end-start, var(--md-fab-branded-large-container-shape, var(--md-sys-shape-corner-extra-large, 28px)))}
`;hn.styleSheet;/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ia=S`@media(forced-colors: active){.fab{border:1px solid ButtonText}.fab.extended{padding-inline-start:15px;padding-inline-end:19px}md-focus-ring{--md-focus-ring-outward-offset: 3px}}
`;Ia.styleSheet;/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const za=S`:host{--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity);display:inline-flex;-webkit-tap-highlight-color:rgba(0,0,0,0)}:host([size=medium][touch-target=wrapper]){margin:max(0px,48px - var(--_container-height))}:host([size=large][touch-target=wrapper]){margin:max(0px,48px - var(--_large-container-height))}.fab,.icon,.icon ::slotted(*){display:flex}.fab{align-items:center;justify-content:center;vertical-align:middle;padding:0;position:relative;height:var(--_container-height);transition-property:background-color;border-width:0px;outline:none;z-index:0;text-transform:inherit}.fab.extended{width:inherit;box-sizing:border-box;padding-inline-start:16px;padding-inline-end:20px}.fab:not(.extended){width:var(--_container-width)}.fab.large{width:var(--_large-container-width);height:var(--_large-container-height)}.fab.large .icon ::slotted(*){width:var(--_large-icon-size);height:var(--_large-icon-size);font-size:var(--_large-icon-size)}.fab.large,.fab.large .ripple{border-start-start-radius:var(--_large-container-shape-start-start);border-start-end-radius:var(--_large-container-shape-start-end);border-end-start-radius:var(--_large-container-shape-end-start);border-end-end-radius:var(--_large-container-shape-end-end)}.fab.large md-focus-ring{--md-focus-ring-shape-start-start: var(--_large-container-shape-start-start);--md-focus-ring-shape-start-end: var(--_large-container-shape-start-end);--md-focus-ring-shape-end-end: var(--_large-container-shape-end-end);--md-focus-ring-shape-end-start: var(--_large-container-shape-end-start)}.fab{--md-elevation-level: var(--_container-elevation);--md-elevation-shadow-color: var(--_container-shadow-color)}.fab:focus{--md-elevation-level: var(--_focus-container-elevation)}.fab:hover{--md-elevation-level: var(--_hover-container-elevation)}.fab:active{--md-elevation-level: var(--_pressed-container-elevation)}.fab.lowered{background-color:var(--_lowered-container-color);--md-elevation-level: var(--_lowered-container-elevation)}.fab.lowered:focus{--md-elevation-level: var(--_lowered-focus-container-elevation)}.fab.lowered:hover{--md-elevation-level: var(--_lowered-hover-container-elevation)}.fab.lowered:active{--md-elevation-level: var(--_lowered-pressed-container-elevation)}.fab{background-color:var(--_container-color);--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-pressed-color: var(--_pressed-state-layer-color)}.fab .label{color:var(--_label-text-color)}.fab:hover .fab .label{color:var(--_hover-label-text-color)}.fab:focus .fab .label{color:var(--_focus-label-text-color)}.fab:active .fab .label{color:var(--_pressed-label-text-color)}.label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight)}.fab.extended .icon ::slotted(*){margin-inline-end:12px}.ripple{overflow:hidden}.ripple,md-elevation{z-index:-1}.touch-target{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%, -50%)}:host([touch-target=none]) .touch-target{display:none}md-elevation,.fab{transition-duration:280ms;transition-timing-function:cubic-bezier(0.2, 0, 0, 1)}.fab,.ripple{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}.icon ::slotted(*){width:var(--_icon-size);height:var(--_icon-size);font-size:var(--_icon-size)}
`;za.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Po=class extends Pa{getRenderClasses(){return{...super.getRenderClasses(),primary:!1,secondary:!1,tertiary:!1,small:!1}}};Po.styles=[za,hn,Ia];Po=l([E("md-branded-fab")],Po);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const pn=S`:host{--_container-color: var(--md-fab-container-color, var(--md-sys-color-surface-container-high, #ece6f0));--_container-elevation: var(--md-fab-container-elevation, 3);--_container-height: var(--md-fab-container-height, 56px);--_container-shadow-color: var(--md-fab-container-shadow-color, var(--md-sys-color-shadow, #000));--_container-width: var(--md-fab-container-width, 56px);--_focus-container-elevation: var(--md-fab-focus-container-elevation, 3);--_focus-icon-color: var(--md-fab-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-container-elevation: var(--md-fab-hover-container-elevation, 4);--_hover-icon-color: var(--md-fab-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-color: var(--md-fab-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-fab-hover-state-layer-opacity, 0.08);--_icon-color: var(--md-fab-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-fab-icon-size, 24px);--_lowered-container-color: var(--md-fab-lowered-container-color, var(--md-sys-color-surface-container-low, #f7f2fa));--_lowered-container-elevation: var(--md-fab-lowered-container-elevation, 1);--_lowered-focus-container-elevation: var(--md-fab-lowered-focus-container-elevation, 1);--_lowered-hover-container-elevation: var(--md-fab-lowered-hover-container-elevation, 2);--_lowered-pressed-container-elevation: var(--md-fab-lowered-pressed-container-elevation, 1);--_pressed-container-elevation: var(--md-fab-pressed-container-elevation, 3);--_pressed-icon-color: var(--md-fab-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-color: var(--md-fab-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-fab-pressed-state-layer-opacity, 0.12);--_focus-label-text-color: var(--md-fab-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-label-text-color: var(--md-fab-hover-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-color: var(--md-fab-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-font: var(--md-fab-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-fab-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-fab-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-fab-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_large-container-height: var(--md-fab-large-container-height, 96px);--_large-container-width: var(--md-fab-large-container-width, 96px);--_large-icon-size: var(--md-fab-large-icon-size, 36px);--_pressed-label-text-color: var(--md-fab-pressed-label-text-color, var(--md-sys-color-primary, #6750a4));--_primary-container-color: var(--md-fab-primary-container-color, var(--md-sys-color-primary-container, #eaddff));--_primary-focus-icon-color: var(--md-fab-primary-focus-icon-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-focus-label-text-color: var(--md-fab-primary-focus-label-text-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-hover-icon-color: var(--md-fab-primary-hover-icon-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-hover-label-text-color: var(--md-fab-primary-hover-label-text-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-hover-state-layer-color: var(--md-fab-primary-hover-state-layer-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-icon-color: var(--md-fab-primary-icon-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-label-text-color: var(--md-fab-primary-label-text-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-pressed-icon-color: var(--md-fab-primary-pressed-icon-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-pressed-label-text-color: var(--md-fab-primary-pressed-label-text-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-pressed-state-layer-color: var(--md-fab-primary-pressed-state-layer-color, var(--md-sys-color-on-primary-container, #21005d));--_secondary-container-color: var(--md-fab-secondary-container-color, var(--md-sys-color-secondary-container, #e8def8));--_secondary-focus-icon-color: var(--md-fab-secondary-focus-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-focus-label-text-color: var(--md-fab-secondary-focus-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-hover-icon-color: var(--md-fab-secondary-hover-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-hover-label-text-color: var(--md-fab-secondary-hover-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-hover-state-layer-color: var(--md-fab-secondary-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-icon-color: var(--md-fab-secondary-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-label-text-color: var(--md-fab-secondary-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-pressed-icon-color: var(--md-fab-secondary-pressed-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-pressed-label-text-color: var(--md-fab-secondary-pressed-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-pressed-state-layer-color: var(--md-fab-secondary-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_small-container-height: var(--md-fab-small-container-height, 40px);--_small-container-width: var(--md-fab-small-container-width, 40px);--_small-icon-size: var(--md-fab-small-icon-size, 24px);--_tertiary-container-color: var(--md-fab-tertiary-container-color, var(--md-sys-color-tertiary-container, #ffd8e4));--_tertiary-focus-icon-color: var(--md-fab-tertiary-focus-icon-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-focus-label-text-color: var(--md-fab-tertiary-focus-label-text-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-hover-icon-color: var(--md-fab-tertiary-hover-icon-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-hover-label-text-color: var(--md-fab-tertiary-hover-label-text-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-hover-state-layer-color: var(--md-fab-tertiary-hover-state-layer-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-icon-color: var(--md-fab-tertiary-icon-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-label-text-color: var(--md-fab-tertiary-label-text-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-pressed-icon-color: var(--md-fab-tertiary-pressed-icon-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-pressed-label-text-color: var(--md-fab-tertiary-pressed-label-text-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-pressed-state-layer-color: var(--md-fab-tertiary-pressed-state-layer-color, var(--md-sys-color-on-tertiary-container, #31111d));--_container-shape-start-start: var(--md-fab-container-shape-start-start, var(--md-fab-container-shape, var(--md-sys-shape-corner-large, 16px)));--_container-shape-start-end: var(--md-fab-container-shape-start-end, var(--md-fab-container-shape, var(--md-sys-shape-corner-large, 16px)));--_container-shape-end-end: var(--md-fab-container-shape-end-end, var(--md-fab-container-shape, var(--md-sys-shape-corner-large, 16px)));--_container-shape-end-start: var(--md-fab-container-shape-end-start, var(--md-fab-container-shape, var(--md-sys-shape-corner-large, 16px)));--_large-container-shape-start-start: var(--md-fab-large-container-shape-start-start, var(--md-fab-large-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));--_large-container-shape-start-end: var(--md-fab-large-container-shape-start-end, var(--md-fab-large-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));--_large-container-shape-end-end: var(--md-fab-large-container-shape-end-end, var(--md-fab-large-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));--_large-container-shape-end-start: var(--md-fab-large-container-shape-end-start, var(--md-fab-large-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));--_small-container-shape-start-start: var(--md-fab-small-container-shape-start-start, var(--md-fab-small-container-shape, var(--md-sys-shape-corner-medium, 12px)));--_small-container-shape-start-end: var(--md-fab-small-container-shape-start-end, var(--md-fab-small-container-shape, var(--md-sys-shape-corner-medium, 12px)));--_small-container-shape-end-end: var(--md-fab-small-container-shape-end-end, var(--md-fab-small-container-shape, var(--md-sys-shape-corner-medium, 12px)));--_small-container-shape-end-start: var(--md-fab-small-container-shape-end-start, var(--md-fab-small-container-shape, var(--md-sys-shape-corner-medium, 12px)));cursor:pointer}:host([size=small][touch-target=wrapper]){margin:max(0px,48px - var(--_small-container-height))}.fab .icon ::slotted(*){color:var(--_icon-color)}.fab:focus{color:var(--_focus-icon-color)}.fab:hover{color:var(--_hover-icon-color)}.fab:active{color:var(--_pressed-icon-color)}.fab{cursor:inherit}.fab.primary{background-color:var(--_primary-container-color);--md-ripple-hover-color: var(--_primary-hover-state-layer-color);--md-ripple-pressed-color: var(--_primary-pressed-state-layer-color)}.fab.primary .icon ::slotted(*){color:var(--_primary-icon-color)}.fab.primary:focus{color:var(--_primary-focus-icon-color)}.fab.primary:hover{color:var(--_primary-hover-icon-color)}.fab.primary:active{color:var(--_primary-pressed-icon-color)}.fab.primary .label{color:var(--_primary-label-text-color)}.fab:hover .fab.primary .label{color:var(--_primary-hover-label-text-color)}.fab:focus .fab.primary .label{color:var(--_primary-focus-label-text-color)}.fab:active .fab.primary .label{color:var(--_primary-pressed-label-text-color)}.fab.secondary{background-color:var(--_secondary-container-color);--md-ripple-hover-color: var(--_secondary-hover-state-layer-color);--md-ripple-pressed-color: var(--_secondary-pressed-state-layer-color)}.fab.secondary .icon ::slotted(*){color:var(--_secondary-icon-color)}.fab.secondary:focus{color:var(--_secondary-focus-icon-color)}.fab.secondary:hover{color:var(--_secondary-hover-icon-color)}.fab.secondary:active{color:var(--_secondary-pressed-icon-color)}.fab.secondary .label{color:var(--_secondary-label-text-color)}.fab:hover .fab.secondary .label{color:var(--_secondary-hover-label-text-color)}.fab:focus .fab.secondary .label{color:var(--_secondary-focus-label-text-color)}.fab:active .fab.secondary .label{color:var(--_secondary-pressed-label-text-color)}.fab.tertiary{background-color:var(--_tertiary-container-color);--md-ripple-hover-color: var(--_tertiary-hover-state-layer-color);--md-ripple-pressed-color: var(--_tertiary-pressed-state-layer-color)}.fab.tertiary .icon ::slotted(*){color:var(--_tertiary-icon-color)}.fab.tertiary:focus{color:var(--_tertiary-focus-icon-color)}.fab.tertiary:hover{color:var(--_tertiary-hover-icon-color)}.fab.tertiary:active{color:var(--_tertiary-pressed-icon-color)}.fab.tertiary .label{color:var(--_tertiary-label-text-color)}.fab:hover .fab.tertiary .label{color:var(--_tertiary-hover-label-text-color)}.fab:focus .fab.tertiary .label{color:var(--_tertiary-focus-label-text-color)}.fab:active .fab.tertiary .label{color:var(--_tertiary-pressed-label-text-color)}.fab.extended slot span{padding-inline-start:4px}.fab.small{width:var(--_small-container-width);height:var(--_small-container-height)}.fab.small .icon ::slotted(*){width:var(--_small-icon-size);height:var(--_small-icon-size);font-size:var(--_small-icon-size)}.fab.small,.fab.small .ripple{border-start-start-radius:var(--_small-container-shape-start-start);border-start-end-radius:var(--_small-container-shape-start-end);border-end-start-radius:var(--_small-container-shape-end-start);border-end-end-radius:var(--_small-container-shape-end-end)}.fab.small md-focus-ring{--md-focus-ring-shape-start-start: var(--_small-container-shape-start-start);--md-focus-ring-shape-start-end: var(--_small-container-shape-start-end);--md-focus-ring-shape-end-end: var(--_small-container-shape-end-end);--md-focus-ring-shape-end-start: var(--_small-container-shape-end-start)}
`;pn.styleSheet;/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Io=class extends Pa{};Io.styles=[za,pn,Ia];Io=l([E("md-fab")],Io);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class oe extends O{constructor(){super(...arguments),this.disabled=!1,this.error=!1,this.focused=!1,this.label="",this.noAsterisk=!1,this.populated=!1,this.required=!1,this.resizable=!1,this.supportingText="",this.errorText="",this.count=-1,this.max=-1,this.hasStart=!1,this.hasEnd=!1,this.isAnimating=!1,this.refreshErrorAlert=!1,this.disableTransitions=!1}get counterText(){const e=this.count??-1,t=this.max??-1;return e<0||t<=0?"":`${e} / ${t}`}get supportingOrErrorText(){return this.error&&this.errorText?this.errorText:this.supportingText}reannounceError(){this.refreshErrorAlert=!0}update(e){e.has("disabled")&&e.get("disabled")!==void 0&&(this.disableTransitions=!0),this.disabled&&this.focused&&(e.set("focused",!0),this.focused=!1),this.animateLabelIfNeeded({wasFocused:e.get("focused"),wasPopulated:e.get("populated")}),super.update(e)}render(){var i,n,s,d;const e=this.renderLabel(!0),t=this.renderLabel(!1),r=(i=this.renderOutline)==null?void 0:i.call(this,e),a={disabled:this.disabled,"disable-transitions":this.disableTransitions,error:this.error&&!this.disabled,focused:this.focused,"with-start":this.hasStart,"with-end":this.hasEnd,populated:this.populated,resizable:this.resizable,required:this.required,"no-label":!this.label};return h`
      <div class="field ${Q(a)}">
        <div class="container-overflow">
          ${(n=this.renderBackground)==null?void 0:n.call(this)}
          <slot name="container"></slot>
          ${(s=this.renderStateLayer)==null?void 0:s.call(this)} ${(d=this.renderIndicator)==null?void 0:d.call(this)} ${r}
          <div class="container">
            <div class="start">
              <slot name="start"></slot>
            </div>
            <div class="middle">
              <div class="label-wrapper">
                ${t} ${r?b:e}
              </div>
              <div class="content">
                <slot></slot>
              </div>
            </div>
            <div class="end">
              <slot name="end"></slot>
            </div>
          </div>
        </div>
        ${this.renderSupportingText()}
      </div>
    `}updated(e){(e.has("supportingText")||e.has("errorText")||e.has("count")||e.has("max"))&&this.updateSlottedAriaDescribedBy(),this.refreshErrorAlert&&requestAnimationFrame(()=>{this.refreshErrorAlert=!1}),this.disableTransitions&&requestAnimationFrame(()=>{this.disableTransitions=!1})}renderSupportingText(){const{supportingOrErrorText:e,counterText:t}=this;if(!e&&!t)return b;const r=h`<span>${e}</span>`,a=t?h`<span class="counter">${t}</span>`:b,n=this.error&&this.errorText&&!this.refreshErrorAlert?"alert":b;return h`
      <div class="supporting-text" role=${n}>${r}${a}</div>
      <slot
        name="aria-describedby"
        @slotchange=${this.updateSlottedAriaDescribedBy}></slot>
    `}updateSlottedAriaDescribedBy(){for(const e of this.slottedAriaDescribedBy)wa(h`${this.supportingOrErrorText} ${this.counterText}`,e),e.setAttribute("hidden","")}renderLabel(e){if(!this.label)return b;let t;e?t=this.focused||this.populated||this.isAnimating:t=!this.focused&&!this.populated&&!this.isAnimating;const r={hidden:!t,floating:e,resting:!e},a=`${this.label}${this.required&&!this.noAsterisk?"*":""}`;return h`
      <span class="label ${Q(r)}" aria-hidden=${!t}
        >${a}</span
      >
    `}animateLabelIfNeeded({wasFocused:e,wasPopulated:t}){var n,s,d;if(!this.label)return;e??(e=this.focused),t??(t=this.populated);const r=e||t,a=this.focused||this.populated;if(r===a)return;const i=this.getLabelKeyframes();i.length&&(this.isAnimating=!0,(n=this.labelAnimation)==null||n.cancel(),this.labelAnimation=(s=this.floatingLabelEl)==null?void 0:s.animate(i,{duration:150,easing:Le.STANDARD}),(d=this.labelAnimation)==null||d.addEventListener("finish",()=>{this.isAnimating=!1}))}getLabelKeyframes(){const{floatingLabelEl:e,restingLabelEl:t}=this;if(!e||!t)return[];const{x:r,y:a,height:i}=e.getBoundingClientRect(),{x:n,y:s,height:d}=t.getBoundingClientRect(),c=e.scrollWidth,p=t.scrollWidth;if(c===0||p===0)return[];const v=p/c,g=n-r,_=s-a+Math.round((d-i*v)/2),w=`translateX(${g}px) translateY(${_}px) scale(${v})`,x="translateX(0) translateY(0) scale(1)",C=t.clientWidth,A=p>C?`${C/v}px`:"";return this.focused||this.populated?[{transform:w,width:A},{transform:x,width:A}]:[{transform:x,width:A},{transform:w,width:A}]}getSurfacePositionClientRect(){return this.containerEl.getBoundingClientRect()}}l([u({type:Boolean})],oe.prototype,"disabled",void 0);l([u({type:Boolean})],oe.prototype,"error",void 0);l([u({type:Boolean})],oe.prototype,"focused",void 0);l([u()],oe.prototype,"label",void 0);l([u({type:Boolean,attribute:"no-asterisk"})],oe.prototype,"noAsterisk",void 0);l([u({type:Boolean})],oe.prototype,"populated",void 0);l([u({type:Boolean})],oe.prototype,"required",void 0);l([u({type:Boolean})],oe.prototype,"resizable",void 0);l([u({attribute:"supporting-text"})],oe.prototype,"supportingText",void 0);l([u({attribute:"error-text"})],oe.prototype,"errorText",void 0);l([u({type:Number})],oe.prototype,"count",void 0);l([u({type:Number})],oe.prototype,"max",void 0);l([u({type:Boolean,attribute:"has-start"})],oe.prototype,"hasStart",void 0);l([u({type:Boolean,attribute:"has-end"})],oe.prototype,"hasEnd",void 0);l([ce({slot:"aria-describedby"})],oe.prototype,"slottedAriaDescribedBy",void 0);l([T()],oe.prototype,"isAnimating",void 0);l([T()],oe.prototype,"refreshErrorAlert",void 0);l([T()],oe.prototype,"disableTransitions",void 0);l([U(".label.floating")],oe.prototype,"floatingLabelEl",void 0);l([U(".label.resting")],oe.prototype,"restingLabelEl",void 0);l([U(".container")],oe.prototype,"containerEl",void 0);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Tl extends oe{renderBackground(){return h` <div class="background"></div> `}renderStateLayer(){return h` <div class="state-layer"></div> `}renderIndicator(){return h`<div class="active-indicator"></div>`}}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const un=S`@layer styles{:host{--_active-indicator-color: var(--md-filled-field-active-indicator-color, var(--md-sys-color-on-surface-variant, #49454f));--_active-indicator-height: var(--md-filled-field-active-indicator-height, 1px);--_bottom-space: var(--md-filled-field-bottom-space, 16px);--_container-color: var(--md-filled-field-container-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_content-color: var(--md-filled-field-content-color, var(--md-sys-color-on-surface, #1d1b20));--_content-font: var(--md-filled-field-content-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_content-line-height: var(--md-filled-field-content-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_content-size: var(--md-filled-field-content-size, var(--md-sys-typescale-body-large-size, 1rem));--_content-space: var(--md-filled-field-content-space, 16px);--_content-weight: var(--md-filled-field-content-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_disabled-active-indicator-color: var(--md-filled-field-disabled-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-active-indicator-height: var(--md-filled-field-disabled-active-indicator-height, 1px);--_disabled-active-indicator-opacity: var(--md-filled-field-disabled-active-indicator-opacity, 0.38);--_disabled-container-color: var(--md-filled-field-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-opacity: var(--md-filled-field-disabled-container-opacity, 0.04);--_disabled-content-color: var(--md-filled-field-disabled-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-content-opacity: var(--md-filled-field-disabled-content-opacity, 0.38);--_disabled-label-text-color: var(--md-filled-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filled-field-disabled-label-text-opacity, 0.38);--_disabled-leading-content-color: var(--md-filled-field-disabled-leading-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-content-opacity: var(--md-filled-field-disabled-leading-content-opacity, 0.38);--_disabled-supporting-text-color: var(--md-filled-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-supporting-text-opacity: var(--md-filled-field-disabled-supporting-text-opacity, 0.38);--_disabled-trailing-content-color: var(--md-filled-field-disabled-trailing-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-content-opacity: var(--md-filled-field-disabled-trailing-content-opacity, 0.38);--_error-active-indicator-color: var(--md-filled-field-error-active-indicator-color, var(--md-sys-color-error, #b3261e));--_error-content-color: var(--md-filled-field-error-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-focus-active-indicator-color: var(--md-filled-field-error-focus-active-indicator-color, var(--md-sys-color-error, #b3261e));--_error-focus-content-color: var(--md-filled-field-error-focus-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-focus-label-text-color: var(--md-filled-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-leading-content-color: var(--md-filled-field-error-focus-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-focus-supporting-text-color: var(--md-filled-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-trailing-content-color: var(--md-filled-field-error-focus-trailing-content-color, var(--md-sys-color-error, #b3261e));--_error-hover-active-indicator-color: var(--md-filled-field-error-hover-active-indicator-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-content-color: var(--md-filled-field-error-hover-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-label-text-color: var(--md-filled-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-leading-content-color: var(--md-filled-field-error-hover-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-hover-state-layer-color: var(--md-filled-field-error-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-state-layer-opacity: var(--md-filled-field-error-hover-state-layer-opacity, 0.08);--_error-hover-supporting-text-color: var(--md-filled-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-hover-trailing-content-color: var(--md-filled-field-error-hover-trailing-content-color, var(--md-sys-color-on-error-container, #410e0b));--_error-label-text-color: var(--md-filled-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_error-leading-content-color: var(--md-filled-field-error-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-supporting-text-color: var(--md-filled-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-trailing-content-color: var(--md-filled-field-error-trailing-content-color, var(--md-sys-color-error, #b3261e));--_focus-active-indicator-color: var(--md-filled-field-focus-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_focus-active-indicator-height: var(--md-filled-field-focus-active-indicator-height, 3px);--_focus-content-color: var(--md-filled-field-focus-content-color, var(--md-sys-color-on-surface, #1d1b20));--_focus-label-text-color: var(--md-filled-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_focus-leading-content-color: var(--md-filled-field-focus-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-supporting-text-color: var(--md-filled-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-trailing-content-color: var(--md-filled-field-focus-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-active-indicator-color: var(--md-filled-field-hover-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-active-indicator-height: var(--md-filled-field-hover-active-indicator-height, 1px);--_hover-content-color: var(--md-filled-field-hover-content-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-filled-field-hover-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-leading-content-color: var(--md-filled-field-hover-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-filled-field-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-opacity: var(--md-filled-field-hover-state-layer-opacity, 0.08);--_hover-supporting-text-color: var(--md-filled-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-content-color: var(--md-filled-field-hover-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-color: var(--md-filled-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-font: var(--md-filled-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filled-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_label-text-populated-line-height: var(--md-filled-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_label-text-populated-size: var(--md-filled-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_label-text-size: var(--md-filled-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_label-text-weight: var(--md-filled-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_leading-content-color: var(--md-filled-field-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_leading-space: var(--md-filled-field-leading-space, 16px);--_supporting-text-color: var(--md-filled-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_supporting-text-font: var(--md-filled-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_supporting-text-leading-space: var(--md-filled-field-supporting-text-leading-space, 16px);--_supporting-text-line-height: var(--md-filled-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_supporting-text-size: var(--md-filled-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_supporting-text-top-space: var(--md-filled-field-supporting-text-top-space, 4px);--_supporting-text-trailing-space: var(--md-filled-field-supporting-text-trailing-space, 16px);--_supporting-text-weight: var(--md-filled-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_top-space: var(--md-filled-field-top-space, 16px);--_trailing-content-color: var(--md-filled-field-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-space: var(--md-filled-field-trailing-space, 16px);--_with-label-bottom-space: var(--md-filled-field-with-label-bottom-space, 8px);--_with-label-top-space: var(--md-filled-field-with-label-top-space, 8px);--_with-leading-content-leading-space: var(--md-filled-field-with-leading-content-leading-space, 12px);--_with-trailing-content-trailing-space: var(--md-filled-field-with-trailing-content-trailing-space, 12px);--_container-shape-start-start: var(--md-filled-field-container-shape-start-start, var(--md-filled-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-start-end: var(--md-filled-field-container-shape-start-end, var(--md-filled-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-end: var(--md-filled-field-container-shape-end-end, var(--md-filled-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--_container-shape-end-start: var(--md-filled-field-container-shape-end-start, var(--md-filled-field-container-shape, var(--md-sys-shape-corner-none, 0px)))}.background,.state-layer{border-radius:inherit;inset:0;pointer-events:none;position:absolute}.background{background:var(--_container-color)}.state-layer{visibility:hidden}.field:not(.disabled):hover .state-layer{visibility:visible}.label.floating{position:absolute;top:var(--_with-label-top-space)}.field:not(.with-start) .label-wrapper{margin-inline-start:var(--_leading-space)}.field:not(.with-end) .label-wrapper{margin-inline-end:var(--_trailing-space)}.active-indicator{inset:auto 0 0 0;pointer-events:none;position:absolute;width:100%;z-index:1}.active-indicator::before,.active-indicator::after{border-bottom:var(--_active-indicator-height) solid var(--_active-indicator-color);inset:auto 0 0 0;content:"";position:absolute;width:100%}.active-indicator::after{opacity:0;transition:opacity 150ms cubic-bezier(0.2, 0, 0, 1)}.focused .active-indicator::after{opacity:1}.field:not(.with-start) .content ::slotted(*){padding-inline-start:var(--_leading-space)}.field:not(.with-end) .content ::slotted(*){padding-inline-end:var(--_trailing-space)}.field:not(.no-label) .content ::slotted(:not(textarea)){padding-bottom:var(--_with-label-bottom-space);padding-top:calc(var(--_with-label-top-space) + var(--_label-text-populated-line-height))}.field:not(.no-label) .content ::slotted(textarea){margin-bottom:var(--_with-label-bottom-space);margin-top:calc(var(--_with-label-top-space) + var(--_label-text-populated-line-height))}:hover .active-indicator::before{border-bottom-color:var(--_hover-active-indicator-color);border-bottom-width:var(--_hover-active-indicator-height)}.active-indicator::after{border-bottom-color:var(--_focus-active-indicator-color);border-bottom-width:var(--_focus-active-indicator-height)}:hover .state-layer{background:var(--_hover-state-layer-color);opacity:var(--_hover-state-layer-opacity)}.disabled .active-indicator::before{border-bottom-color:var(--_disabled-active-indicator-color);border-bottom-width:var(--_disabled-active-indicator-height);opacity:var(--_disabled-active-indicator-opacity)}.disabled .background{background:var(--_disabled-container-color);opacity:var(--_disabled-container-opacity)}.error .active-indicator::before{border-bottom-color:var(--_error-active-indicator-color)}.error:hover .active-indicator::before{border-bottom-color:var(--_error-hover-active-indicator-color)}.error:hover .state-layer{background:var(--_error-hover-state-layer-color);opacity:var(--_error-hover-state-layer-opacity)}.error .active-indicator::after{border-bottom-color:var(--_error-focus-active-indicator-color)}.resizable .container{bottom:var(--_focus-active-indicator-height);clip-path:inset(var(--_focus-active-indicator-height) 0 0 0)}.resizable .container>*{top:var(--_focus-active-indicator-height)}}@layer hcm{@media(forced-colors: active){.disabled .active-indicator::before{border-color:GrayText;opacity:1}}}
`;un.styleSheet;/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Oa=S`:host{display:inline-flex;resize:both}.field{display:flex;flex:1;flex-direction:column;writing-mode:horizontal-tb;max-width:100%}.container-overflow{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-end-radius:var(--_container-shape-end-end);border-end-start-radius:var(--_container-shape-end-start);display:flex;height:100%;position:relative}.container{align-items:center;border-radius:inherit;display:flex;flex:1;max-height:100%;min-height:100%;min-width:min-content;position:relative}.field,.container-overflow{resize:inherit}.resizable:not(.disabled) .container{resize:inherit;overflow:hidden}.disabled{pointer-events:none}slot[name=container]{border-radius:inherit}slot[name=container]::slotted(*){border-radius:inherit;inset:0;pointer-events:none;position:absolute}@layer styles{.start,.middle,.end{display:flex;box-sizing:border-box;height:100%;position:relative}.start{color:var(--_leading-content-color)}.end{color:var(--_trailing-content-color)}.start,.end{align-items:center;justify-content:center}.with-start .start{margin-inline:var(--_with-leading-content-leading-space) var(--_content-space)}.with-end .end{margin-inline:var(--_content-space) var(--_with-trailing-content-trailing-space)}.middle{align-items:stretch;align-self:baseline;flex:1}.content{color:var(--_content-color);display:flex;flex:1;opacity:0;transition:opacity 83ms cubic-bezier(0.2, 0, 0, 1)}.no-label .content,.focused .content,.populated .content{opacity:1;transition-delay:67ms}:is(.disabled,.disable-transitions) .content{transition:none}.content ::slotted(*){all:unset;color:currentColor;font-family:var(--_content-font);font-size:var(--_content-size);line-height:var(--_content-line-height);font-weight:var(--_content-weight);width:100%;overflow-wrap:revert;white-space:revert}.content ::slotted(:not(textarea)){padding-top:var(--_top-space);padding-bottom:var(--_bottom-space)}.content ::slotted(textarea){margin-top:var(--_top-space);margin-bottom:var(--_bottom-space)}:hover .content{color:var(--_hover-content-color)}:hover .start{color:var(--_hover-leading-content-color)}:hover .end{color:var(--_hover-trailing-content-color)}.focused .content{color:var(--_focus-content-color)}.focused .start{color:var(--_focus-leading-content-color)}.focused .end{color:var(--_focus-trailing-content-color)}.disabled .content{color:var(--_disabled-content-color)}.disabled.no-label .content,.disabled.focused .content,.disabled.populated .content{opacity:var(--_disabled-content-opacity)}.disabled .start{color:var(--_disabled-leading-content-color);opacity:var(--_disabled-leading-content-opacity)}.disabled .end{color:var(--_disabled-trailing-content-color);opacity:var(--_disabled-trailing-content-opacity)}.error .content{color:var(--_error-content-color)}.error .start{color:var(--_error-leading-content-color)}.error .end{color:var(--_error-trailing-content-color)}.error:hover .content{color:var(--_error-hover-content-color)}.error:hover .start{color:var(--_error-hover-leading-content-color)}.error:hover .end{color:var(--_error-hover-trailing-content-color)}.error.focused .content{color:var(--_error-focus-content-color)}.error.focused .start{color:var(--_error-focus-leading-content-color)}.error.focused .end{color:var(--_error-focus-trailing-content-color)}}@layer hcm{@media(forced-colors: active){.disabled :is(.start,.content,.end){color:GrayText;opacity:1}}}@layer styles{.label{box-sizing:border-box;color:var(--_label-text-color);overflow:hidden;max-width:100%;text-overflow:ellipsis;white-space:nowrap;z-index:1;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);width:min-content}.label-wrapper{inset:0;pointer-events:none;position:absolute}.label.resting{position:absolute;top:var(--_top-space)}.label.floating{font-size:var(--_label-text-populated-size);line-height:var(--_label-text-populated-line-height);transform-origin:top left}.label.hidden{opacity:0}.no-label .label{display:none}.label-wrapper{inset:0;position:absolute;text-align:initial}:hover .label{color:var(--_hover-label-text-color)}.focused .label{color:var(--_focus-label-text-color)}.disabled .label{color:var(--_disabled-label-text-color)}.disabled .label:not(.hidden){opacity:var(--_disabled-label-text-opacity)}.error .label{color:var(--_error-label-text-color)}.error:hover .label{color:var(--_error-hover-label-text-color)}.error.focused .label{color:var(--_error-focus-label-text-color)}}@layer hcm{@media(forced-colors: active){.disabled .label:not(.hidden){color:GrayText;opacity:1}}}@layer styles{.supporting-text{color:var(--_supporting-text-color);display:flex;font-family:var(--_supporting-text-font);font-size:var(--_supporting-text-size);line-height:var(--_supporting-text-line-height);font-weight:var(--_supporting-text-weight);gap:16px;justify-content:space-between;padding-inline-start:var(--_supporting-text-leading-space);padding-inline-end:var(--_supporting-text-trailing-space);padding-top:var(--_supporting-text-top-space)}.supporting-text :nth-child(2){flex-shrink:0}:hover .supporting-text{color:var(--_hover-supporting-text-color)}.focus .supporting-text{color:var(--_focus-supporting-text-color)}.disabled .supporting-text{color:var(--_disabled-supporting-text-color);opacity:var(--_disabled-supporting-text-opacity)}.error .supporting-text{color:var(--_error-supporting-text-color)}.error:hover .supporting-text{color:var(--_error-hover-supporting-text-color)}.error.focus .supporting-text{color:var(--_error-focus-supporting-text-color)}}@layer hcm{@media(forced-colors: active){.disabled .supporting-text{color:GrayText;opacity:1}}}
`;Oa.styleSheet;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let zo=class extends Tl{};zo.styles=[Oa,un];zo=l([E("md-filled-field")],zo);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class El extends oe{renderOutline(e){return h`
      <div class="outline">
        <div class="outline-start"></div>
        <div class="outline-notch">
          <div class="outline-panel-inactive"></div>
          <div class="outline-panel-active"></div>
          <div class="outline-label">${e}</div>
        </div>
        <div class="outline-end"></div>
      </div>
    `}}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const mn=S`@layer styles{:host{--_bottom-space: var(--md-outlined-field-bottom-space, 16px);--_content-color: var(--md-outlined-field-content-color, var(--md-sys-color-on-surface, #1d1b20));--_content-font: var(--md-outlined-field-content-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_content-line-height: var(--md-outlined-field-content-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_content-size: var(--md-outlined-field-content-size, var(--md-sys-typescale-body-large-size, 1rem));--_content-space: var(--md-outlined-field-content-space, 16px);--_content-weight: var(--md-outlined-field-content-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_disabled-content-color: var(--md-outlined-field-disabled-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-content-opacity: var(--md-outlined-field-disabled-content-opacity, 0.38);--_disabled-label-text-color: var(--md-outlined-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-outlined-field-disabled-label-text-opacity, 0.38);--_disabled-leading-content-color: var(--md-outlined-field-disabled-leading-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-content-opacity: var(--md-outlined-field-disabled-leading-content-opacity, 0.38);--_disabled-outline-color: var(--md-outlined-field-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-outlined-field-disabled-outline-opacity, 0.12);--_disabled-outline-width: var(--md-outlined-field-disabled-outline-width, 1px);--_disabled-supporting-text-color: var(--md-outlined-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-supporting-text-opacity: var(--md-outlined-field-disabled-supporting-text-opacity, 0.38);--_disabled-trailing-content-color: var(--md-outlined-field-disabled-trailing-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-content-opacity: var(--md-outlined-field-disabled-trailing-content-opacity, 0.38);--_error-content-color: var(--md-outlined-field-error-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-focus-content-color: var(--md-outlined-field-error-focus-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-focus-label-text-color: var(--md-outlined-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-leading-content-color: var(--md-outlined-field-error-focus-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-focus-outline-color: var(--md-outlined-field-error-focus-outline-color, var(--md-sys-color-error, #b3261e));--_error-focus-supporting-text-color: var(--md-outlined-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-trailing-content-color: var(--md-outlined-field-error-focus-trailing-content-color, var(--md-sys-color-error, #b3261e));--_error-hover-content-color: var(--md-outlined-field-error-hover-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-label-text-color: var(--md-outlined-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-leading-content-color: var(--md-outlined-field-error-hover-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-hover-outline-color: var(--md-outlined-field-error-hover-outline-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-supporting-text-color: var(--md-outlined-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-hover-trailing-content-color: var(--md-outlined-field-error-hover-trailing-content-color, var(--md-sys-color-on-error-container, #410e0b));--_error-label-text-color: var(--md-outlined-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_error-leading-content-color: var(--md-outlined-field-error-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-outline-color: var(--md-outlined-field-error-outline-color, var(--md-sys-color-error, #b3261e));--_error-supporting-text-color: var(--md-outlined-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-trailing-content-color: var(--md-outlined-field-error-trailing-content-color, var(--md-sys-color-error, #b3261e));--_focus-content-color: var(--md-outlined-field-focus-content-color, var(--md-sys-color-on-surface, #1d1b20));--_focus-label-text-color: var(--md-outlined-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_focus-leading-content-color: var(--md-outlined-field-focus-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-outline-color: var(--md-outlined-field-focus-outline-color, var(--md-sys-color-primary, #6750a4));--_focus-outline-width: var(--md-outlined-field-focus-outline-width, 3px);--_focus-supporting-text-color: var(--md-outlined-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-trailing-content-color: var(--md-outlined-field-focus-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-content-color: var(--md-outlined-field-hover-content-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-outlined-field-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-leading-content-color: var(--md-outlined-field-hover-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-outline-color: var(--md-outlined-field-hover-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-outline-width: var(--md-outlined-field-hover-outline-width, 1px);--_hover-supporting-text-color: var(--md-outlined-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-content-color: var(--md-outlined-field-hover-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-color: var(--md-outlined-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-font: var(--md-outlined-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-outlined-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_label-text-padding-bottom: var(--md-outlined-field-label-text-padding-bottom, 8px);--_label-text-populated-line-height: var(--md-outlined-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_label-text-populated-size: var(--md-outlined-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_label-text-size: var(--md-outlined-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_label-text-weight: var(--md-outlined-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_leading-content-color: var(--md-outlined-field-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_leading-space: var(--md-outlined-field-leading-space, 16px);--_outline-color: var(--md-outlined-field-outline-color, var(--md-sys-color-outline, #79747e));--_outline-label-padding: var(--md-outlined-field-outline-label-padding, 4px);--_outline-width: var(--md-outlined-field-outline-width, 1px);--_supporting-text-color: var(--md-outlined-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_supporting-text-font: var(--md-outlined-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_supporting-text-leading-space: var(--md-outlined-field-supporting-text-leading-space, 16px);--_supporting-text-line-height: var(--md-outlined-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_supporting-text-size: var(--md-outlined-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_supporting-text-top-space: var(--md-outlined-field-supporting-text-top-space, 4px);--_supporting-text-trailing-space: var(--md-outlined-field-supporting-text-trailing-space, 16px);--_supporting-text-weight: var(--md-outlined-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_top-space: var(--md-outlined-field-top-space, 16px);--_trailing-content-color: var(--md-outlined-field-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-space: var(--md-outlined-field-trailing-space, 16px);--_with-leading-content-leading-space: var(--md-outlined-field-with-leading-content-leading-space, 12px);--_with-trailing-content-trailing-space: var(--md-outlined-field-with-trailing-content-trailing-space, 12px);--_container-shape-start-start: var(--md-outlined-field-container-shape-start-start, var(--md-outlined-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-start-end: var(--md-outlined-field-container-shape-start-end, var(--md-outlined-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-end: var(--md-outlined-field-container-shape-end-end, var(--md-outlined-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-start: var(--md-outlined-field-container-shape-end-start, var(--md-outlined-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)))}.outline{border-color:var(--_outline-color);border-radius:inherit;display:flex;pointer-events:none;height:100%;position:absolute;width:100%;z-index:1}.outline-start::before,.outline-start::after,.outline-panel-inactive::before,.outline-panel-inactive::after,.outline-panel-active::before,.outline-panel-active::after,.outline-end::before,.outline-end::after{border:inherit;content:"";inset:0;position:absolute}.outline-start,.outline-end{border:inherit;border-radius:inherit;box-sizing:border-box;position:relative}.outline-start::before,.outline-start::after,.outline-end::before,.outline-end::after{border-bottom-style:solid;border-top-style:solid}.outline-start::after,.outline-end::after{opacity:0;transition:opacity 150ms cubic-bezier(0.2, 0, 0, 1)}.focused .outline-start::after,.focused .outline-end::after{opacity:1}.outline-start::before,.outline-start::after{border-inline-start-style:solid;border-inline-end-style:none;border-start-start-radius:inherit;border-start-end-radius:0;border-end-start-radius:inherit;border-end-end-radius:0;margin-inline-end:var(--_outline-label-padding)}.outline-end{flex-grow:1;margin-inline-start:calc(-1*var(--_outline-label-padding))}.outline-end::before,.outline-end::after{border-inline-start-style:none;border-inline-end-style:solid;border-start-start-radius:0;border-start-end-radius:inherit;border-end-start-radius:0;border-end-end-radius:inherit}.outline-notch{align-items:flex-start;border:inherit;display:flex;margin-inline-start:calc(-1*var(--_outline-label-padding));margin-inline-end:var(--_outline-label-padding);max-width:calc(100% - var(--_leading-space) - var(--_trailing-space));padding:0 var(--_outline-label-padding);position:relative}.no-label .outline-notch{display:none}.outline-panel-inactive,.outline-panel-active{border:inherit;border-bottom-style:solid;inset:0;position:absolute}.outline-panel-inactive::before,.outline-panel-inactive::after,.outline-panel-active::before,.outline-panel-active::after{border-top-style:solid;border-bottom:none;bottom:auto;transform:scaleX(1);transition:transform 150ms cubic-bezier(0.2, 0, 0, 1)}.outline-panel-inactive::before,.outline-panel-active::before{right:50%;transform-origin:top left}.outline-panel-inactive::after,.outline-panel-active::after{left:50%;transform-origin:top right}.populated .outline-panel-inactive::before,.populated .outline-panel-inactive::after,.populated .outline-panel-active::before,.populated .outline-panel-active::after,.focused .outline-panel-inactive::before,.focused .outline-panel-inactive::after,.focused .outline-panel-active::before,.focused .outline-panel-active::after{transform:scaleX(0)}.outline-panel-active{opacity:0;transition:opacity 150ms cubic-bezier(0.2, 0, 0, 1)}.focused .outline-panel-active{opacity:1}.outline-label{display:flex;max-width:100%;transform:translateY(calc(-100% + var(--_label-text-padding-bottom)))}.outline-start,.field:not(.with-start) .content ::slotted(*){padding-inline-start:max(var(--_leading-space),max(var(--_container-shape-start-start),var(--_container-shape-end-start)) + var(--_outline-label-padding))}.field:not(.with-start) .label-wrapper{margin-inline-start:max(var(--_leading-space),max(var(--_container-shape-start-start),var(--_container-shape-end-start)) + var(--_outline-label-padding))}.field:not(.with-end) .content ::slotted(*){padding-inline-end:max(var(--_trailing-space),max(var(--_container-shape-start-end),var(--_container-shape-end-end)))}.field:not(.with-end) .label-wrapper{margin-inline-end:max(var(--_trailing-space),max(var(--_container-shape-start-end),var(--_container-shape-end-end)))}.outline-start::before,.outline-end::before,.outline-panel-inactive,.outline-panel-inactive::before,.outline-panel-inactive::after{border-width:var(--_outline-width)}:hover .outline{border-color:var(--_hover-outline-color);color:var(--_hover-outline-color)}:hover .outline-start::before,:hover .outline-end::before,:hover .outline-panel-inactive,:hover .outline-panel-inactive::before,:hover .outline-panel-inactive::after{border-width:var(--_hover-outline-width)}.focused .outline{border-color:var(--_focus-outline-color);color:var(--_focus-outline-color)}.outline-start::after,.outline-end::after,.outline-panel-active,.outline-panel-active::before,.outline-panel-active::after{border-width:var(--_focus-outline-width)}.disabled .outline{border-color:var(--_disabled-outline-color);color:var(--_disabled-outline-color)}.disabled .outline-start,.disabled .outline-end,.disabled .outline-panel-inactive{opacity:var(--_disabled-outline-opacity)}.disabled .outline-start::before,.disabled .outline-end::before,.disabled .outline-panel-inactive,.disabled .outline-panel-inactive::before,.disabled .outline-panel-inactive::after{border-width:var(--_disabled-outline-width)}.error .outline{border-color:var(--_error-outline-color);color:var(--_error-outline-color)}.error:hover .outline{border-color:var(--_error-hover-outline-color);color:var(--_error-hover-outline-color)}.error.focused .outline{border-color:var(--_error-focus-outline-color);color:var(--_error-focus-outline-color)}.resizable .container{bottom:var(--_focus-outline-width);inset-inline-end:var(--_focus-outline-width);clip-path:inset(var(--_focus-outline-width) 0 0 var(--_focus-outline-width))}.resizable .container>*{top:var(--_focus-outline-width);inset-inline-start:var(--_focus-outline-width)}.resizable .container:dir(rtl){clip-path:inset(var(--_focus-outline-width) var(--_focus-outline-width) 0 0)}}@layer hcm{@media(forced-colors: active){.disabled .outline{border-color:GrayText;color:GrayText}.disabled :is(.outline-start,.outline-end,.outline-panel-inactive){opacity:1}}}
`;mn.styleSheet;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Oo=class extends El{};Oo.styles=[Oa,mn];Oo=l([E("md-outlined-field")],Oo);/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Al extends O{render(){return h`<slot></slot>`}connectedCallback(){if(super.connectedCallback(),this.getAttribute("aria-hidden")==="false"){this.removeAttribute("aria-hidden");return}this.setAttribute("aria-hidden","true")}}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const vn=S`:host{font-size:var(--md-icon-size, 24px);width:var(--md-icon-size, 24px);height:var(--md-icon-size, 24px);color:inherit;font-variation-settings:inherit;font-weight:400;font-family:var(--md-icon-font, Material Symbols Outlined);display:inline-flex;font-style:normal;place-items:center;place-content:center;line-height:1;overflow:hidden;letter-spacing:normal;text-transform:none;user-select:none;white-space:nowrap;word-wrap:normal;flex-shrink:0;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale}::slotted(svg){fill:currentColor}::slotted(*){height:100%;width:100%}
`;vn.styleSheet;/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Ro=class extends Al{};Ro.styles=[vn];Ro=l([E("md-icon")],Ro);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const fn=S`:host{--_container-color: var(--md-filled-icon-button-container-color, var(--md-sys-color-primary, #6750a4));--_container-height: var(--md-filled-icon-button-container-height, 40px);--_container-width: var(--md-filled-icon-button-container-width, 40px);--_disabled-container-color: var(--md-filled-icon-button-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-opacity: var(--md-filled-icon-button-disabled-container-opacity, 0.12);--_disabled-icon-color: var(--md-filled-icon-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-filled-icon-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-filled-icon-button-focus-icon-color, var(--md-sys-color-on-primary, #fff));--_hover-icon-color: var(--md-filled-icon-button-hover-icon-color, var(--md-sys-color-on-primary, #fff));--_hover-state-layer-color: var(--md-filled-icon-button-hover-state-layer-color, var(--md-sys-color-on-primary, #fff));--_hover-state-layer-opacity: var(--md-filled-icon-button-hover-state-layer-opacity, 0.08);--_icon-color: var(--md-filled-icon-button-icon-color, var(--md-sys-color-on-primary, #fff));--_icon-size: var(--md-filled-icon-button-icon-size, 24px);--_pressed-icon-color: var(--md-filled-icon-button-pressed-icon-color, var(--md-sys-color-on-primary, #fff));--_pressed-state-layer-color: var(--md-filled-icon-button-pressed-state-layer-color, var(--md-sys-color-on-primary, #fff));--_pressed-state-layer-opacity: var(--md-filled-icon-button-pressed-state-layer-opacity, 0.12);--_selected-container-color: var(--md-filled-icon-button-selected-container-color, var(--md-sys-color-primary, #6750a4));--_toggle-selected-focus-icon-color: var(--md-filled-icon-button-toggle-selected-focus-icon-color, var(--md-sys-color-on-primary, #fff));--_toggle-selected-hover-icon-color: var(--md-filled-icon-button-toggle-selected-hover-icon-color, var(--md-sys-color-on-primary, #fff));--_toggle-selected-hover-state-layer-color: var(--md-filled-icon-button-toggle-selected-hover-state-layer-color, var(--md-sys-color-on-primary, #fff));--_toggle-selected-icon-color: var(--md-filled-icon-button-toggle-selected-icon-color, var(--md-sys-color-on-primary, #fff));--_toggle-selected-pressed-icon-color: var(--md-filled-icon-button-toggle-selected-pressed-icon-color, var(--md-sys-color-on-primary, #fff));--_toggle-selected-pressed-state-layer-color: var(--md-filled-icon-button-toggle-selected-pressed-state-layer-color, var(--md-sys-color-on-primary, #fff));--_unselected-container-color: var(--md-filled-icon-button-unselected-container-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_toggle-focus-icon-color: var(--md-filled-icon-button-toggle-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_toggle-hover-icon-color: var(--md-filled-icon-button-toggle-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_toggle-hover-state-layer-color: var(--md-filled-icon-button-toggle-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_toggle-icon-color: var(--md-filled-icon-button-toggle-icon-color, var(--md-sys-color-primary, #6750a4));--_toggle-pressed-icon-color: var(--md-filled-icon-button-toggle-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_toggle-pressed-state-layer-color: var(--md-filled-icon-button-toggle-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_container-shape-start-start: var(--md-filled-icon-button-container-shape-start-start, var(--md-filled-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-filled-icon-button-container-shape-start-end, var(--md-filled-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-filled-icon-button-container-shape-end-end, var(--md-filled-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-filled-icon-button-container-shape-end-start, var(--md-filled-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)))}.icon-button{color:var(--_icon-color)}.icon-button:hover{color:var(--_hover-icon-color)}.icon-button:focus{color:var(--_focus-icon-color)}.icon-button:active{color:var(--_pressed-icon-color)}.icon-button:is(:disabled,[aria-disabled=true]){color:var(--_disabled-icon-color)}.icon-button{--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.icon-button::before{background-color:var(--_container-color);border-radius:inherit;content:"";inset:0;position:absolute;z-index:-1}.icon-button:is(:disabled,[aria-disabled=true])::before{background-color:var(--_disabled-container-color);opacity:var(--_disabled-container-opacity)}.icon-button:is(:disabled,[aria-disabled=true]) .icon{opacity:var(--_disabled-icon-opacity)}.toggle-filled:not(:disabled,[aria-disabled=true]){color:var(--_toggle-icon-color)}.toggle-filled:not(:disabled,[aria-disabled=true]):hover{color:var(--_toggle-hover-icon-color)}.toggle-filled:not(:disabled,[aria-disabled=true]):focus{color:var(--_toggle-focus-icon-color)}.toggle-filled:not(:disabled,[aria-disabled=true]):active{color:var(--_toggle-pressed-icon-color)}.toggle-filled{--md-ripple-hover-color: var(--_toggle-hover-state-layer-color);--md-ripple-pressed-color: var(--_toggle-pressed-state-layer-color)}.toggle-filled:not(:disabled,[aria-disabled=true])::before{background-color:var(--_unselected-container-color)}.selected:not(:disabled,[aria-disabled=true]){color:var(--_toggle-selected-icon-color)}.selected:not(:disabled,[aria-disabled=true]):hover{color:var(--_toggle-selected-hover-icon-color)}.selected:not(:disabled,[aria-disabled=true]):focus{color:var(--_toggle-selected-focus-icon-color)}.selected:not(:disabled,[aria-disabled=true]):active{color:var(--_toggle-selected-pressed-icon-color)}.selected{--md-ripple-hover-color: var(--_toggle-selected-hover-state-layer-color);--md-ripple-pressed-color: var(--_toggle-selected-pressed-state-layer-color)}.selected:not(:disabled,[aria-disabled=true])::before{background-color:var(--_selected-container-color)}
`;fn.styleSheet;/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const bn=Symbol.for(""),Pl=o=>{if((o==null?void 0:o.r)===bn)return o==null?void 0:o._$litStatic$},ye=(o,...e)=>({_$litStatic$:e.reduce((t,r,a)=>t+(i=>{if(i._$litStatic$!==void 0)return i._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${i}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(r)+o[a+1],o[0]),r:bn}),hi=new Map,Il=o=>(e,...t)=>{const r=t.length;let a,i;const n=[],s=[];let d,c=0,p=!1;for(;c<r;){for(d=e[c];c<r&&(i=t[c],(a=Pl(i))!==void 0);)d+=a+e[++c],p=!0;c!==r&&s.push(i),n.push(d),c++}if(c===r&&n.push(e[r]),p){const v=n.join("$$lit$$");(e=hi.get(v))===void 0&&(n.raw=n,hi.set(v,e=n)),t=s}return o(e,...t)},ar=Il(h);/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function pi(o,e=!0){return e&&getComputedStyle(o).getPropertyValue("direction").trim()==="rtl"}/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const zl=ue(ji(it(at(O))));class _e extends zl{constructor(){super(),this.softDisabled=!1,this.flipIconInRtl=!1,this.href="",this.download="",this.target="",this.ariaLabelSelected="",this.toggle=!1,this.selected=!1,this.flipIcon=pi(this,this.flipIconInRtl),Ta(this,"click"),this.addEventListener("click",e=>{if(this.softDisabled||this.disabled&&this.href){e.stopImmediatePropagation(),e.preventDefault();return}const t=this.selected;$a(e,()=>{!this.toggle||this.disabled||e.defaultPrevented||(this.selected=!t,this.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0})),this.dispatchEvent(new Event("change",{bubbles:!0})))})})}willUpdate(){this.href&&(this.disabled=!1,this.softDisabled=!1)}render(){const e=this.href?ye`div`:ye`button`,{ariaLabel:t,ariaHasPopup:r,ariaExpanded:a}=this,i=t&&this.ariaLabelSelected,n=this.toggle?this.selected:b;let s=b;return this.href||(s=i&&this.selected?this.ariaLabelSelected:t),ar`<${e}
        class="icon-button ${Q(this.getRenderClasses())}"
        id="button"
        aria-label="${s||b}"
        aria-haspopup="${!this.href&&r||b}"
        aria-expanded="${!this.href&&a||b}"
        aria-pressed="${n}"
        aria-disabled=${!this.href&&this.softDisabled||b}
        ?disabled="${!this.href&&this.disabled}">
        ${this.renderFocusRing()}
        ${this.renderRipple()}
        ${this.selected?b:this.renderIcon()}
        ${this.selected?this.renderSelectedIcon():b}
        ${this.href?this.renderLink():this.renderTouchTarget()}
  </${e}>`}renderLink(){const{ariaLabel:e}=this;return h`
      <a
        class="link"
        id="link"
        href="${this.href}"
        download="${this.download||b}"
        target="${this.target||b}"
        aria-label="${e||b}">
        ${this.renderTouchTarget()}
      </a>
    `}getRenderClasses(){return{"flip-icon":this.flipIcon,selected:this.toggle&&this.selected}}renderIcon(){return h`<span class="icon"><slot></slot></span>`}renderSelectedIcon(){return h`<span class="icon icon--selected"
      ><slot name="selected"><slot></slot></slot
    ></span>`}renderTouchTarget(){return h`<span class="touch"></span>`}renderFocusRing(){return h`<md-focus-ring
      part="focus-ring"
      for=${this.href?"link":"button"}></md-focus-ring>`}renderRipple(){const e=!this.href&&(this.disabled||this.softDisabled);return h`<md-ripple
      for=${this.href?"link":b}
      ?disabled="${e}"></md-ripple>`}connectedCallback(){this.flipIcon=pi(this,this.flipIconInRtl),super.connectedCallback()}}_e.shadowRootOptions={mode:"open",delegatesFocus:!0};l([u({type:Boolean,attribute:"soft-disabled",reflect:!0})],_e.prototype,"softDisabled",void 0);l([u({type:Boolean,attribute:"flip-icon-in-rtl"})],_e.prototype,"flipIconInRtl",void 0);l([u()],_e.prototype,"href",void 0);l([u()],_e.prototype,"download",void 0);l([u()],_e.prototype,"target",void 0);l([u({attribute:"aria-label-selected"})],_e.prototype,"ariaLabelSelected",void 0);l([u({type:Boolean})],_e.prototype,"toggle",void 0);l([u({type:Boolean,reflect:!0})],_e.prototype,"selected",void 0);l([T()],_e.prototype,"flipIcon",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const ir=S`:host{display:inline-flex;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0);height:var(--_container-height);width:var(--_container-width);justify-content:center}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) max(0px,(48px - var(--_container-width))/2)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}:host(:is([disabled],[soft-disabled])){pointer-events:none}.icon-button{place-items:center;background:none;border:none;box-sizing:border-box;cursor:pointer;display:flex;place-content:center;outline:none;padding:0;position:relative;text-decoration:none;user-select:none;z-index:0;flex:1;border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}.icon ::slotted(*){font-size:var(--_icon-size);height:var(--_icon-size);width:var(--_icon-size);font-weight:inherit}md-ripple{z-index:-1;border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}.flip-icon .icon{transform:scaleX(-1)}.icon{display:inline-flex}.link{display:grid;height:100%;outline:none;place-items:center;position:absolute;width:100%}.touch{position:absolute;height:max(48px,100%);width:max(48px,100%)}:host([touch-target=none]) .touch{display:none}@media(forced-colors: active){:host(:is([disabled],[soft-disabled])){--_disabled-icon-color: GrayText;--_disabled-icon-opacity: 1}}
`;ir.styleSheet;/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Mo=class extends _e{getRenderClasses(){return{...super.getRenderClasses(),filled:!0,"toggle-filled":this.toggle}}};Mo.styles=[ir,fn];Mo=l([E("md-filled-icon-button")],Mo);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const gn=S`:host{--_container-color: var(--md-filled-tonal-icon-button-container-color, var(--md-sys-color-secondary-container, #e8def8));--_container-height: var(--md-filled-tonal-icon-button-container-height, 40px);--_container-width: var(--md-filled-tonal-icon-button-container-width, 40px);--_disabled-container-color: var(--md-filled-tonal-icon-button-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-opacity: var(--md-filled-tonal-icon-button-disabled-container-opacity, 0.12);--_disabled-icon-color: var(--md-filled-tonal-icon-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-filled-tonal-icon-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-filled-tonal-icon-button-focus-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_hover-icon-color: var(--md-filled-tonal-icon-button-hover-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_hover-state-layer-color: var(--md-filled-tonal-icon-button-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_hover-state-layer-opacity: var(--md-filled-tonal-icon-button-hover-state-layer-opacity, 0.08);--_icon-color: var(--md-filled-tonal-icon-button-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_icon-size: var(--md-filled-tonal-icon-button-icon-size, 24px);--_pressed-icon-color: var(--md-filled-tonal-icon-button-pressed-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_pressed-state-layer-color: var(--md-filled-tonal-icon-button-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_pressed-state-layer-opacity: var(--md-filled-tonal-icon-button-pressed-state-layer-opacity, 0.12);--_selected-container-color: var(--md-filled-tonal-icon-button-selected-container-color, var(--md-sys-color-secondary-container, #e8def8));--_toggle-selected-focus-icon-color: var(--md-filled-tonal-icon-button-toggle-selected-focus-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_toggle-selected-hover-icon-color: var(--md-filled-tonal-icon-button-toggle-selected-hover-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_toggle-selected-hover-state-layer-color: var(--md-filled-tonal-icon-button-toggle-selected-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_toggle-selected-icon-color: var(--md-filled-tonal-icon-button-toggle-selected-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_toggle-selected-pressed-icon-color: var(--md-filled-tonal-icon-button-toggle-selected-pressed-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_toggle-selected-pressed-state-layer-color: var(--md-filled-tonal-icon-button-toggle-selected-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_unselected-container-color: var(--md-filled-tonal-icon-button-unselected-container-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_toggle-focus-icon-color: var(--md-filled-tonal-icon-button-toggle-focus-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_toggle-hover-icon-color: var(--md-filled-tonal-icon-button-toggle-hover-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_toggle-hover-state-layer-color: var(--md-filled-tonal-icon-button-toggle-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_toggle-icon-color: var(--md-filled-tonal-icon-button-toggle-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_toggle-pressed-icon-color: var(--md-filled-tonal-icon-button-toggle-pressed-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_toggle-pressed-state-layer-color: var(--md-filled-tonal-icon-button-toggle-pressed-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_container-shape-start-start: var(--md-filled-tonal-icon-button-container-shape-start-start, var(--md-filled-tonal-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-filled-tonal-icon-button-container-shape-start-end, var(--md-filled-tonal-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-filled-tonal-icon-button-container-shape-end-end, var(--md-filled-tonal-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-filled-tonal-icon-button-container-shape-end-start, var(--md-filled-tonal-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)))}.icon-button{color:var(--_icon-color)}.icon-button:hover{color:var(--_hover-icon-color)}.icon-button:focus{color:var(--_focus-icon-color)}.icon-button:active{color:var(--_pressed-icon-color)}.icon-button:is(:disabled,[aria-disabled=true]){color:var(--_disabled-icon-color)}.icon-button{--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.icon-button::before{background-color:var(--_container-color);border-radius:inherit;content:"";inset:0;position:absolute;z-index:-1}.icon-button:is(:disabled,[aria-disabled=true])::before{background-color:var(--_disabled-container-color);opacity:var(--_disabled-container-opacity)}.icon-button:is(:disabled,[aria-disabled=true]) .icon{opacity:var(--_disabled-icon-opacity)}.toggle-filled-tonal:not(:disabled,[aria-disabled=true]){color:var(--_toggle-icon-color)}.toggle-filled-tonal:not(:disabled,[aria-disabled=true]):hover{color:var(--_toggle-hover-icon-color)}.toggle-filled-tonal:not(:disabled,[aria-disabled=true]):focus{color:var(--_toggle-focus-icon-color)}.toggle-filled-tonal:not(:disabled,[aria-disabled=true]):active{color:var(--_toggle-pressed-icon-color)}.toggle-filled-tonal{--md-ripple-hover-color: var(--_toggle-hover-state-layer-color);--md-ripple-pressed-color: var(--_toggle-pressed-state-layer-color)}.toggle-filled-tonal:not(:disabled,[aria-disabled=true])::before{background-color:var(--_unselected-container-color)}.selected:not(:disabled,[aria-disabled=true]){color:var(--_toggle-selected-icon-color)}.selected:not(:disabled,[aria-disabled=true]):hover{color:var(--_toggle-selected-hover-icon-color)}.selected:not(:disabled,[aria-disabled=true]):focus{color:var(--_toggle-selected-focus-icon-color)}.selected:not(:disabled,[aria-disabled=true]):active{color:var(--_toggle-selected-pressed-icon-color)}.selected{--md-ripple-hover-color: var(--_toggle-selected-hover-state-layer-color);--md-ripple-pressed-color: var(--_toggle-selected-pressed-state-layer-color)}.selected:not(:disabled,[aria-disabled=true])::before{background-color:var(--_selected-container-color)}
`;gn.styleSheet;/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Lo=class extends _e{getRenderClasses(){return{...super.getRenderClasses(),"filled-tonal":!0,"toggle-filled-tonal":this.toggle}}};Lo.styles=[ir,gn];Lo=l([E("md-filled-tonal-icon-button")],Lo);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const yn=S`:host{--_disabled-icon-color: var(--md-icon-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-icon-button-disabled-icon-opacity, 0.38);--_icon-size: var(--md-icon-button-icon-size, 24px);--_selected-focus-icon-color: var(--md-icon-button-selected-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-icon-color: var(--md-icon-button-selected-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-state-layer-color: var(--md-icon-button-selected-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-state-layer-opacity: var(--md-icon-button-selected-hover-state-layer-opacity, 0.08);--_selected-icon-color: var(--md-icon-button-selected-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-icon-color: var(--md-icon-button-selected-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-state-layer-color: var(--md-icon-button-selected-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-state-layer-opacity: var(--md-icon-button-selected-pressed-state-layer-opacity, 0.12);--_state-layer-height: var(--md-icon-button-state-layer-height, 40px);--_state-layer-shape: var(--md-icon-button-state-layer-shape, var(--md-sys-shape-corner-full, 9999px));--_state-layer-width: var(--md-icon-button-state-layer-width, 40px);--_focus-icon-color: var(--md-icon-button-focus-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-icon-color: var(--md-icon-button-hover-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-icon-button-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-opacity: var(--md-icon-button-hover-state-layer-opacity, 0.08);--_icon-color: var(--md-icon-button-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-icon-color: var(--md-icon-button-pressed-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-color: var(--md-icon-button-pressed-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-opacity: var(--md-icon-button-pressed-state-layer-opacity, 0.12);--_container-shape-start-start: 0;--_container-shape-start-end: 0;--_container-shape-end-end: 0;--_container-shape-end-start: 0;--_container-height: 0;--_container-width: 0;height:var(--_state-layer-height);width:var(--_state-layer-width)}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_state-layer-height))/2) max(0px,(48px - var(--_state-layer-width))/2)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_state-layer-shape);--md-focus-ring-shape-start-end: var(--_state-layer-shape);--md-focus-ring-shape-end-end: var(--_state-layer-shape);--md-focus-ring-shape-end-start: var(--_state-layer-shape)}.standard{background-color:rgba(0,0,0,0);color:var(--_icon-color);--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.standard:hover{color:var(--_hover-icon-color)}.standard:focus{color:var(--_focus-icon-color)}.standard:active{color:var(--_pressed-icon-color)}.standard:is(:disabled,[aria-disabled=true]){color:var(--_disabled-icon-color)}md-ripple{border-radius:var(--_state-layer-shape)}.standard:is(:disabled,[aria-disabled=true]){opacity:var(--_disabled-icon-opacity)}.selected:not(:disabled,[aria-disabled=true]){color:var(--_selected-icon-color)}.selected:not(:disabled,[aria-disabled=true]):hover{color:var(--_selected-hover-icon-color)}.selected:not(:disabled,[aria-disabled=true]):focus{color:var(--_selected-focus-icon-color)}.selected:not(:disabled,[aria-disabled=true]):active{color:var(--_selected-pressed-icon-color)}.selected{--md-ripple-hover-color: var(--_selected-hover-state-layer-color);--md-ripple-hover-opacity: var(--_selected-hover-state-layer-opacity);--md-ripple-pressed-color: var(--_selected-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_selected-pressed-state-layer-opacity)}
`;yn.styleSheet;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Do=class extends _e{getRenderClasses(){return{...super.getRenderClasses(),standard:!0}}};Do.styles=[ir,yn];Do=l([E("md-icon-button")],Do);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const xn=S`:host{--_container-height: var(--md-outlined-icon-button-container-height, 40px);--_container-width: var(--md-outlined-icon-button-container-width, 40px);--_disabled-icon-color: var(--md-outlined-icon-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-outlined-icon-button-disabled-icon-opacity, 0.38);--_disabled-selected-container-color: var(--md-outlined-icon-button-disabled-selected-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-selected-container-opacity: var(--md-outlined-icon-button-disabled-selected-container-opacity, 0.12);--_hover-state-layer-opacity: var(--md-outlined-icon-button-hover-state-layer-opacity, 0.08);--_icon-size: var(--md-outlined-icon-button-icon-size, 24px);--_pressed-state-layer-opacity: var(--md-outlined-icon-button-pressed-state-layer-opacity, 0.12);--_selected-container-color: var(--md-outlined-icon-button-selected-container-color, var(--md-sys-color-inverse-surface, #322f35));--_selected-focus-icon-color: var(--md-outlined-icon-button-selected-focus-icon-color, var(--md-sys-color-inverse-on-surface, #f5eff7));--_selected-hover-icon-color: var(--md-outlined-icon-button-selected-hover-icon-color, var(--md-sys-color-inverse-on-surface, #f5eff7));--_selected-hover-state-layer-color: var(--md-outlined-icon-button-selected-hover-state-layer-color, var(--md-sys-color-inverse-on-surface, #f5eff7));--_selected-icon-color: var(--md-outlined-icon-button-selected-icon-color, var(--md-sys-color-inverse-on-surface, #f5eff7));--_selected-pressed-icon-color: var(--md-outlined-icon-button-selected-pressed-icon-color, var(--md-sys-color-inverse-on-surface, #f5eff7));--_selected-pressed-state-layer-color: var(--md-outlined-icon-button-selected-pressed-state-layer-color, var(--md-sys-color-inverse-on-surface, #f5eff7));--_disabled-outline-color: var(--md-outlined-icon-button-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-outlined-icon-button-disabled-outline-opacity, 0.12);--_focus-icon-color: var(--md-outlined-icon-button-focus-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-icon-color: var(--md-outlined-icon-button-hover-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-outlined-icon-button-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_icon-color: var(--md-outlined-icon-button-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_outline-color: var(--md-outlined-icon-button-outline-color, var(--md-sys-color-outline, #79747e));--_outline-width: var(--md-outlined-icon-button-outline-width, 1px);--_pressed-icon-color: var(--md-outlined-icon-button-pressed-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_pressed-state-layer-color: var(--md-outlined-icon-button-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_container-shape-start-start: var(--md-outlined-icon-button-container-shape-start-start, var(--md-outlined-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-outlined-icon-button-container-shape-start-end, var(--md-outlined-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-outlined-icon-button-container-shape-end-end, var(--md-outlined-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-outlined-icon-button-container-shape-end-start, var(--md-outlined-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)))}.outlined{background-color:rgba(0,0,0,0);color:var(--_icon-color);--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.outlined::before{border-color:var(--_outline-color);border-width:var(--_outline-width)}.outlined:hover{color:var(--_hover-icon-color)}.outlined:focus{color:var(--_focus-icon-color)}.outlined:active{color:var(--_pressed-icon-color)}.outlined:is(:disabled,[aria-disabled=true]){color:var(--_disabled-icon-color)}.outlined:is(:disabled,[aria-disabled=true])::before{border-color:var(--_disabled-outline-color);opacity:var(--_disabled-outline-opacity)}.outlined:is(:disabled,[aria-disabled=true]) .icon{opacity:var(--_disabled-icon-opacity)}.outlined::before{block-size:100%;border-style:solid;border-radius:inherit;box-sizing:border-box;content:"";inline-size:100%;inset:0;pointer-events:none;position:absolute;z-index:-1}.outlined.selected::before{border-width:0}.selected:not(:disabled,[aria-disabled=true]){color:var(--_selected-icon-color)}.selected:not(:disabled,[aria-disabled=true]):hover{color:var(--_selected-hover-icon-color)}.selected:not(:disabled,[aria-disabled=true]):focus{color:var(--_selected-focus-icon-color)}.selected:not(:disabled,[aria-disabled=true]):active{color:var(--_selected-pressed-icon-color)}.selected{--md-ripple-hover-color: var(--_selected-hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_selected-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.selected:not(:disabled,[aria-disabled=true])::before{background-color:var(--_selected-container-color)}.selected:is(:disabled,[aria-disabled=true])::before{background-color:var(--_disabled-selected-container-color);opacity:var(--_disabled-selected-container-opacity)}@media(forced-colors: active){:host(:is([disabled],[soft-disabled])){--_disabled-outline-opacity: 1}.selected::before{border-color:CanvasText;border-width:var(--_outline-width)}.selected:is(:disabled,[aria-disabled=true])::before{border-color:GrayText;opacity:1}}
`;xn.styleSheet;/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Fo=class extends _e{getRenderClasses(){return{...super.getRenderClasses(),outlined:!0}}};Fo.styles=[ir,xn];Fo=l([E("md-outlined-icon-button")],Fo);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function _n(o,e=Ve){const t=Fr(o,e);return t&&(t.tabIndex=0,t.focus()),t}function wn(o,e=Ve){const t=kn(o,e);return t&&(t.tabIndex=0,t.focus()),t}function Ol(o,e=Ve){const t=$t(o,e);return t&&(t.item.tabIndex=-1),t}function $t(o,e=Ve){for(let t=0;t<o.length;t++){const r=o[t];if(r.tabIndex===0&&e(r))return{item:r,index:t}}return null}function Fr(o,e=Ve){for(const t of o)if(e(t))return t;return null}function kn(o,e=Ve){for(let t=o.length-1;t>=0;t--){const r=o[t];if(e(r))return r}return null}function Rl(o,e,t=Ve,r=!0){for(let a=1;a<o.length;a++){const i=(a+e)%o.length;if(i<e&&!r)return null;const n=o[i];if(t(n))return n}return o[e]?o[e]:null}function Ml(o,e,t=Ve,r=!0){for(let a=1;a<o.length;a++){const i=(e-a+o.length)%o.length;if(i>e&&!r)return null;const n=o[i];if(t(n))return n}return o[e]?o[e]:null}function ui(o,e,t=Ve,r=!0){if(e){const a=Rl(o,e.index,t,r);return a&&(a.tabIndex=0,a.focus()),a}else return _n(o,t)}function mi(o,e,t=Ve,r=!0){if(e){const a=Ml(o,e.index,t,r);return a&&(a.tabIndex=0,a.focus()),a}else return wn(o,t)}function ur(){return new Event("deactivate-items",{bubbles:!0,composed:!0})}function Cn(){return new Event("request-activation",{bubbles:!0,composed:!0})}function Ve(o){return!o.disabled}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const pe={ArrowDown:"ArrowDown",ArrowLeft:"ArrowLeft",ArrowUp:"ArrowUp",ArrowRight:"ArrowRight",Home:"Home",End:"End"};class Sn{constructor(e){this.handleKeydown=p=>{const v=p.key;if(p.defaultPrevented||!this.isNavigableKey(v))return;const g=this.items;if(!g.length)return;const _=$t(g,this.isActivatable);p.preventDefault();const w=this.isRtl(),x=w?pe.ArrowRight:pe.ArrowLeft,C=w?pe.ArrowLeft:pe.ArrowRight;let P=null;switch(v){case pe.ArrowDown:case C:P=ui(g,_,this.isActivatable,this.wrapNavigation());break;case pe.ArrowUp:case x:P=mi(g,_,this.isActivatable,this.wrapNavigation());break;case pe.Home:P=_n(g,this.isActivatable);break;case pe.End:P=wn(g,this.isActivatable);break}P&&_&&_.item!==P&&(_.item.tabIndex=-1)},this.onDeactivateItems=()=>{const p=this.items;for(const v of p)this.deactivateItem(v)},this.onRequestActivation=p=>{this.onDeactivateItems();const v=p.target;this.activateItem(v),v.focus()},this.onSlotchange=()=>{const p=this.items;let v=!1;for(const _ of p){if(!_.disabled&&_.tabIndex>-1&&!v){v=!0,_.tabIndex=0;continue}_.tabIndex=-1}if(v)return;const g=Fr(p,this.isActivatable);g&&(g.tabIndex=0)};const{isItem:t,getPossibleItems:r,isRtl:a,deactivateItem:i,activateItem:n,isNavigableKey:s,isActivatable:d,wrapNavigation:c}=e;this.isItem=t,this.getPossibleItems=r,this.isRtl=a,this.deactivateItem=i,this.activateItem=n,this.isNavigableKey=s,this.isActivatable=d,this.wrapNavigation=c??(()=>!0)}get items(){const e=this.getPossibleItems(),t=[];for(const r of e){if(this.isItem(r)){t.push(r);continue}const i=r.item;i&&this.isItem(i)&&t.push(i)}return t}activateNextItem(){const e=this.items,t=$t(e,this.isActivatable);return t&&(t.item.tabIndex=-1),ui(e,t,this.isActivatable,this.wrapNavigation())}activatePreviousItem(){const e=this.items,t=$t(e,this.isActivatable);return t&&(t.item.tabIndex=-1),mi(e,t,this.isActivatable,this.wrapNavigation())}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ll=new Set(Object.values(pe));class $n extends O{get items(){return this.listController.items}constructor(){super(),this.listController=new Sn({isItem:e=>e.hasAttribute("md-list-item"),getPossibleItems:()=>this.slotItems,isRtl:()=>getComputedStyle(this).direction==="rtl",deactivateItem:e=>{e.tabIndex=-1},activateItem:e=>{e.tabIndex=0},isNavigableKey:e=>Ll.has(e),isActivatable:e=>!e.disabled&&e.type!=="text"}),this.internals=this.attachInternals(),this.internals.role="list",this.addEventListener("keydown",this.listController.handleKeydown)}render(){return h`
      <slot
        @deactivate-items=${this.listController.onDeactivateItems}
        @request-activation=${this.listController.onRequestActivation}
        @slotchange=${this.listController.onSlotchange}>
      </slot>
    `}activateNextItem(){return this.listController.activateNextItem()}activatePreviousItem(){return this.listController.activatePreviousItem()}}l([ce({flatten:!0})],$n.prototype,"slotItems",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Tn=S`:host{background:var(--md-list-container-color, var(--md-sys-color-surface, #fef7ff));color:unset;display:flex;flex-direction:column;outline:none;padding:8px 0;position:relative}
`;Tn.styleSheet;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Bo=class extends $n{};Bo.styles=[Tn];Bo=l([E("md-list")],Bo);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Ra extends O{constructor(){super(...arguments),this.multiline=!1}render(){return h`
      <slot name="container"></slot>
      <slot class="non-text" name="start"></slot>
      <div class="text">
        <slot name="overline" @slotchange=${this.handleTextSlotChange}></slot>
        <slot
          class="default-slot"
          @slotchange=${this.handleTextSlotChange}></slot>
        <slot name="headline" @slotchange=${this.handleTextSlotChange}></slot>
        <slot
          name="supporting-text"
          @slotchange=${this.handleTextSlotChange}></slot>
      </div>
      <slot class="non-text" name="trailing-supporting-text"></slot>
      <slot class="non-text" name="end"></slot>
    `}handleTextSlotChange(){let e=!1,t=0;for(const r of this.textSlots)if(Dl(r)&&(t+=1),t>1){e=!0;break}this.multiline=e}}l([u({type:Boolean,reflect:!0})],Ra.prototype,"multiline",void 0);l([Vs(".text slot")],Ra.prototype,"textSlots",void 0);function Dl(o){var e;for(const t of o.assignedNodes({flatten:!0})){const r=t.nodeType===Node.ELEMENT_NODE,a=t.nodeType===Node.TEXT_NODE&&((e=t.textContent)==null?void 0:e.match(/\S/));if(r||a)return!0}return!1}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const En=S`:host{color:var(--md-sys-color-on-surface, #1d1b20);font-family:var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-body-large-size, 1rem);font-weight:var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400));line-height:var(--md-sys-typescale-body-large-line-height, 1.5rem);align-items:center;box-sizing:border-box;display:flex;gap:16px;min-height:56px;overflow:hidden;padding:12px 16px;position:relative;text-overflow:ellipsis}:host([multiline]){min-height:72px}[name=overline]{color:var(--md-sys-color-on-surface-variant, #49454f);font-family:var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-label-small-size, 0.6875rem);font-weight:var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500));line-height:var(--md-sys-typescale-label-small-line-height, 1rem)}[name=supporting-text]{color:var(--md-sys-color-on-surface-variant, #49454f);font-family:var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-body-medium-size, 0.875rem);font-weight:var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400));line-height:var(--md-sys-typescale-body-medium-line-height, 1.25rem)}[name=trailing-supporting-text]{color:var(--md-sys-color-on-surface-variant, #49454f);font-family:var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-label-small-size, 0.6875rem);font-weight:var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500));line-height:var(--md-sys-typescale-label-small-line-height, 1rem)}[name=container]::slotted(*){inset:0;position:absolute}.default-slot{display:inline}.default-slot,.text ::slotted(*){overflow:hidden;text-overflow:ellipsis}.text{display:flex;flex:1;flex-direction:column;overflow:hidden}
`;En.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let No=class extends Ra{};No.styles=[En];No=l([E("md-item")],No);/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Fl=ue(O);class nt extends Fl{constructor(){super(...arguments),this.disabled=!1,this.type="text",this.isListItem=!0,this.href="",this.target=""}get isDisabled(){return this.disabled&&this.type!=="link"}willUpdate(e){this.href&&(this.type="link"),super.willUpdate(e)}render(){return this.renderListItem(h`
      <md-item>
        <div slot="container">
          ${this.renderRipple()} ${this.renderFocusRing()}
        </div>
        <slot name="start" slot="start"></slot>
        <slot name="end" slot="end"></slot>
        ${this.renderBody()}
      </md-item>
    `)}renderListItem(e){const t=this.type==="link";let r;switch(this.type){case"link":r=ye`a`;break;case"button":r=ye`button`;break;default:case"text":r=ye`li`;break}const a=this.type!=="text",i=t&&this.target?this.target:b;return ar`
      <${r}
        id="item"
        tabindex="${this.isDisabled||!a?-1:0}"
        ?disabled=${this.isDisabled}
        role="listitem"
        aria-selected=${this.ariaSelected||b}
        aria-checked=${this.ariaChecked||b}
        aria-expanded=${this.ariaExpanded||b}
        aria-haspopup=${this.ariaHasPopup||b}
        class="list-item ${Q(this.getRenderClasses())}"
        href=${this.href||b}
        target=${i}
        @focus=${this.onFocus}
      >${e}</${r}>
    `}renderRipple(){return this.type==="text"?b:h` <md-ripple
      part="ripple"
      for="item"
      ?disabled=${this.isDisabled}></md-ripple>`}renderFocusRing(){return this.type==="text"?b:h` <md-focus-ring
      @visibility-changed=${this.onFocusRingVisibilityChanged}
      part="focus-ring"
      for="item"
      inward></md-focus-ring>`}onFocusRingVisibilityChanged(e){}getRenderClasses(){return{disabled:this.isDisabled}}renderBody(){return h`
      <slot></slot>
      <slot name="overline" slot="overline"></slot>
      <slot name="headline" slot="headline"></slot>
      <slot name="supporting-text" slot="supporting-text"></slot>
      <slot
        name="trailing-supporting-text"
        slot="trailing-supporting-text"></slot>
    `}onFocus(){this.tabIndex===-1&&this.dispatchEvent(Cn())}focus(){var e;(e=this.listItemRoot)==null||e.focus()}click(){if(!this.listItemRoot){super.click();return}this.listItemRoot.click()}}nt.shadowRootOptions={...O.shadowRootOptions,delegatesFocus:!0};l([u({type:Boolean,reflect:!0})],nt.prototype,"disabled",void 0);l([u({reflect:!0})],nt.prototype,"type",void 0);l([u({type:Boolean,attribute:"md-list-item",reflect:!0})],nt.prototype,"isListItem",void 0);l([u()],nt.prototype,"href",void 0);l([u()],nt.prototype,"target",void 0);l([U(".list-item")],nt.prototype,"listItemRoot",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const An=S`:host{display:flex;gap:16px;-webkit-tap-highlight-color:rgba(0,0,0,0);--md-ripple-hover-color: var(--md-list-item-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-list-item-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-list-item-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-opacity: var(--md-list-item-pressed-state-layer-opacity, 0.12)}:host(:is([type=button]:not([disabled]),[type=link])){cursor:pointer}md-focus-ring{z-index:1;--md-focus-ring-shape: 8px}a,button,li{background:none;border:none;cursor:inherit;padding:0;margin:0;text-align:unset;text-decoration:none}.list-item{border-radius:inherit;display:flex;flex:1;gap:inherit;max-width:inherit;min-width:inherit;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%}.list-item.interactive{cursor:pointer}.list-item.disabled{opacity:var(--md-list-item-disabled-opacity, 0.3);pointer-events:none}[slot=container]{pointer-events:none}md-ripple{border-radius:inherit}md-item{border-radius:inherit;flex:1;height:100%;color:var(--md-list-item-label-text-color, var(--md-sys-color-on-surface, #1d1b20));font-family:var(--md-list-item-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-list-item-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));line-height:var(--md-list-item-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));font-weight:var(--md-list-item-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));min-height:var(--md-list-item-one-line-container-height, 56px);padding-top:var(--md-list-item-top-space, 12px);padding-bottom:var(--md-list-item-bottom-space, 12px);padding-inline-start:var(--md-list-item-leading-space, 16px);padding-inline-end:var(--md-list-item-trailing-space, 16px);gap:inherit}md-item[multiline]{min-height:var(--md-list-item-two-line-container-height, 72px)}[slot=supporting-text]{color:var(--md-list-item-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-list-item-supporting-text-font, var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-list-item-supporting-text-size, var(--md-sys-typescale-body-medium-size, 0.875rem));line-height:var(--md-list-item-supporting-text-line-height, var(--md-sys-typescale-body-medium-line-height, 1.25rem));font-weight:var(--md-list-item-supporting-text-weight, var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)))}[slot=trailing-supporting-text]{color:var(--md-list-item-trailing-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-list-item-trailing-supporting-text-font, var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-list-item-trailing-supporting-text-size, var(--md-sys-typescale-label-small-size, 0.6875rem));line-height:var(--md-list-item-trailing-supporting-text-line-height, var(--md-sys-typescale-label-small-line-height, 1rem));font-weight:var(--md-list-item-trailing-supporting-text-weight, var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500)))}:is([slot=start],[slot=end])::slotted(*){fill:currentColor}[slot=start]{color:var(--md-list-item-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}[slot=end]{color:var(--md-list-item-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}@media(forced-colors: active){.disabled slot{color:GrayText}.list-item.disabled{color:GrayText;opacity:1}}
`;An.styleSheet;/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Vo=class extends nt{};Vo.styles=[An];Vo=l([E("md-list-item")],Vo);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pn="important",Bl=" !"+Pn,yt=Ca(class extends Sa{constructor(o){var e;if(super(o),o.type!==Ze.ATTRIBUTE||o.name!=="style"||((e=o.strings)==null?void 0:e.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(o){return Object.keys(o).reduce((e,t)=>{const r=o[t];return r==null?e:e+`${t=t.includes("-")?t:t.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${r};`},"")}update(o,[e]){const{style:t}=o.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(e)),this.render(e);for(const r of this.ft)e[r]==null&&(this.ft.delete(r),r.includes("-")?t.removeProperty(r):t[r]=null);for(const r in e){const a=e[r];if(a!=null){this.ft.add(r);const i=typeof a=="string"&&a.endsWith(Bl);r.includes("-")||i?t.setProperty(r,i?a.slice(0,-11):a,i?Pn:""):t[r]=a}}return Ae}});/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function Nl(o,e){return new CustomEvent("close-menu",{bubbles:!0,composed:!0,detail:{initiator:o,reason:e,itemPath:[o]}})}const vi=Nl;function Vl(){return new Event("deactivate-typeahead",{bubbles:!0,composed:!0})}function ro(){return new Event("activate-typeahead",{bubbles:!0,composed:!0})}const Ye={RIGHT:"ArrowRight",LEFT:"ArrowLeft"},Tt={SPACE:"Space",ENTER:"Enter"},Ho={CLICK_SELECTION:"click-selection",KEYDOWN:"keydown"},Uo={ESCAPE:"Escape",SPACE:Tt.SPACE,ENTER:Tt.ENTER};function In(o){return Object.values(Uo).some(e=>e===o)}function Hl(o){return Object.values(Tt).some(e=>e===o)}function qo(o,e){const t=new Event("md-contains",{bubbles:!0,composed:!0});let r=[];const a=n=>{r=n.composedPath()};return e.addEventListener("md-contains",a),o.dispatchEvent(t),e.removeEventListener("md-contains",a),r.length>0}const Me={NONE:"none",LIST_ROOT:"list-root",FIRST_ITEM:"first-item",LAST_ITEM:"last-item"};/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Er={END_START:"end-start",START_START:"start-start",START_END:"start-end"};class Ul{constructor(e,t){this.host=e,this.getProperties=t,this.surfaceStylesInternal={display:"none"},this.lastValues={isOpen:!1},this.host.addController(this)}get surfaceStyles(){return this.surfaceStylesInternal}async position(){const{surfaceEl:e,anchorEl:t,anchorCorner:r,surfaceCorner:a,positioning:i,xOffset:n,yOffset:s,disableBlockFlip:d,disableInlineFlip:c,repositionStrategy:p}=this.getProperties(),v=r.toLowerCase().trim(),g=a.toLowerCase().trim();if(!e||!t)return;const _=window.innerWidth,w=window.innerHeight,x=document.createElement("div");x.style.opacity="0",x.style.position="fixed",x.style.display="block",x.style.inset="0",document.body.appendChild(x);const C=x.getBoundingClientRect();x.remove();const P=window.innerHeight-C.bottom,A=window.innerWidth-C.right;this.surfaceStylesInternal={display:"block",opacity:"0"},this.host.requestUpdate(),await this.host.updateComplete,e.popover&&e.isConnected&&e.showPopover();const V=e.getSurfacePositionClientRect?e.getSurfacePositionClientRect():e.getBoundingClientRect(),F=t.getSurfacePositionClientRect?t.getSurfacePositionClientRect():t.getBoundingClientRect(),[B,G]=g.split("-"),[K,Z]=v.split("-"),ae=getComputedStyle(e).direction==="ltr";let{blockInset:Y,blockOutOfBoundsCorrection:se,surfaceBlockProperty:Ie}=this.calculateBlock({surfaceRect:V,anchorRect:F,anchorBlock:K,surfaceBlock:B,yOffset:s,positioning:i,windowInnerHeight:w,blockScrollbarHeight:P});if(se&&!d){const We=B==="start"?"end":"start",$e=K==="start"?"end":"start",fe=this.calculateBlock({surfaceRect:V,anchorRect:F,anchorBlock:$e,surfaceBlock:We,yOffset:s,positioning:i,windowInnerHeight:w,blockScrollbarHeight:P});se>fe.blockOutOfBoundsCorrection&&(Y=fe.blockInset,se=fe.blockOutOfBoundsCorrection,Ie=fe.surfaceBlockProperty)}let{inlineInset:ze,inlineOutOfBoundsCorrection:de,surfaceInlineProperty:ct}=this.calculateInline({surfaceRect:V,anchorRect:F,anchorInline:Z,surfaceInline:G,xOffset:n,positioning:i,isLTR:ae,windowInnerWidth:_,inlineScrollbarWidth:A});if(de&&!c){const We=G==="start"?"end":"start",$e=Z==="start"?"end":"start",fe=this.calculateInline({surfaceRect:V,anchorRect:F,anchorInline:$e,surfaceInline:We,xOffset:n,positioning:i,isLTR:ae,windowInnerWidth:_,inlineScrollbarWidth:A});Math.abs(de)>Math.abs(fe.inlineOutOfBoundsCorrection)&&(ze=fe.inlineInset,de=fe.inlineOutOfBoundsCorrection,ct=fe.surfaceInlineProperty)}p==="move"&&(Y=Y-se,ze=ze-de),this.surfaceStylesInternal={display:"block",opacity:"1",[Ie]:`${Y}px`,[ct]:`${ze}px`},p==="resize"&&(se&&(this.surfaceStylesInternal.height=`${V.height-se}px`),de&&(this.surfaceStylesInternal.width=`${V.width-de}px`)),this.host.requestUpdate()}calculateBlock(e){const{surfaceRect:t,anchorRect:r,anchorBlock:a,surfaceBlock:i,yOffset:n,positioning:s,windowInnerHeight:d,blockScrollbarHeight:c}=e,p=s==="fixed"||s==="document"?1:0,v=s==="document"?1:0,g=i==="start"?1:0,_=i==="end"?1:0,x=(a!==i?1:0)*r.height+n,C=g*r.top+_*(d-r.bottom-c),P=g*window.scrollY-_*window.scrollY,A=Math.abs(Math.min(0,d-C-x-t.height));return{blockInset:p*C+v*P+x,blockOutOfBoundsCorrection:A,surfaceBlockProperty:i==="start"?"inset-block-start":"inset-block-end"}}calculateInline(e){const{isLTR:t,surfaceInline:r,anchorInline:a,anchorRect:i,surfaceRect:n,xOffset:s,positioning:d,windowInnerWidth:c,inlineScrollbarWidth:p}=e,v=d==="fixed"||d==="document"?1:0,g=d==="document"?1:0,_=t?1:0,w=t?0:1,x=r==="start"?1:0,C=r==="end"?1:0,A=(a!==r?1:0)*i.width+s,V=x*i.left+C*(c-i.right-p),F=x*(c-i.right-p)+C*i.left,B=_*V+w*F,G=x*window.scrollX-C*window.scrollX,K=C*window.scrollX-x*window.scrollX,Z=_*G+w*K,ae=Math.abs(Math.min(0,c-B-A-n.width)),Y=v*B+A+g*Z;let se=r==="start"?"inset-inline-start":"inset-inline-end";return(d==="document"||d==="fixed")&&(r==="start"&&t||r==="end"&&!t?se="left":se="right"),{inlineInset:Y,inlineOutOfBoundsCorrection:ae,surfaceInlineProperty:se}}hostUpdate(){this.onUpdate()}hostUpdated(){this.onUpdate()}async onUpdate(){const e=this.getProperties();let t=!1;for(const[n,s]of Object.entries(e))if(t=t||s!==this.lastValues[n],t)break;const r=this.lastValues.isOpen!==e.isOpen,a=!!e.anchorEl,i=!!e.surfaceEl;t&&a&&i&&(this.lastValues.isOpen=e.isOpen,e.isOpen?(this.lastValues=e,await this.position(),e.onOpen()):r&&(await e.beforeClose(),this.close(),e.onClose()))}close(){this.surfaceStylesInternal={display:"none"},this.host.requestUpdate();const e=this.getProperties().surfaceEl;e!=null&&e.popover&&(e!=null&&e.isConnected)&&e.hidePopover()}}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Te={INDEX:0,ITEM:1,TEXT:2};class ql{constructor(e){this.getProperties=e,this.typeaheadRecords=[],this.typaheadBuffer="",this.cancelTypeaheadTimeout=0,this.isTypingAhead=!1,this.lastActiveRecord=null,this.onKeydown=t=>{this.isTypingAhead?this.typeahead(t):this.beginTypeahead(t)},this.endTypeahead=()=>{this.isTypingAhead=!1,this.typaheadBuffer="",this.typeaheadRecords=[]}}get items(){return this.getProperties().getItems()}get active(){return this.getProperties().active}beginTypeahead(e){this.active&&(e.code==="Space"||e.code==="Enter"||e.code.startsWith("Arrow")||e.code==="Escape"||(this.isTypingAhead=!0,this.typeaheadRecords=this.items.map((t,r)=>[r,t,t.typeaheadText.trim().toLowerCase()]),this.lastActiveRecord=this.typeaheadRecords.find(t=>t[Te.ITEM].tabIndex===0)??null,this.lastActiveRecord&&(this.lastActiveRecord[Te.ITEM].tabIndex=-1),this.typeahead(e)))}typeahead(e){if(e.defaultPrevented)return;if(clearTimeout(this.cancelTypeaheadTimeout),e.code==="Enter"||e.code.startsWith("Arrow")||e.code==="Escape"){this.endTypeahead(),this.lastActiveRecord&&(this.lastActiveRecord[Te.ITEM].tabIndex=-1);return}e.code==="Space"&&e.preventDefault(),this.cancelTypeaheadTimeout=setTimeout(this.endTypeahead,this.getProperties().typeaheadBufferTime),this.typaheadBuffer+=e.key.toLowerCase();const t=this.lastActiveRecord?this.lastActiveRecord[Te.INDEX]:-1,r=this.typeaheadRecords.length,a=d=>(d[Te.INDEX]+r-t)%r,i=this.typeaheadRecords.filter(d=>!d[Te.ITEM].disabled&&d[Te.TEXT].startsWith(this.typaheadBuffer)).sort((d,c)=>a(d)-a(c));if(i.length===0){clearTimeout(this.cancelTypeaheadTimeout),this.lastActiveRecord&&(this.lastActiveRecord[Te.ITEM].tabIndex=-1),this.endTypeahead();return}const n=this.typaheadBuffer.length===1;let s;this.lastActiveRecord===i[0]&&n?s=i[1]??i[0]:s=i[0],this.lastActiveRecord&&(this.lastActiveRecord[Te.ITEM].tabIndex=-1),this.lastActiveRecord=s,s[Te.ITEM].tabIndex=0,s[Te.ITEM].focus()}}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const zn=200,On=new Set([pe.ArrowDown,pe.ArrowUp,pe.Home,pe.End]),Kl=new Set([pe.ArrowLeft,pe.ArrowRight,...On]);function jl(o=document){var t;let e=o.activeElement;for(;e&&((t=e==null?void 0:e.shadowRoot)!=null&&t.activeElement);)e=e.shadowRoot.activeElement;return e}class ie extends O{get openDirection(){return this.menuCorner.split("-")[0]==="start"?"DOWN":"UP"}get anchorElement(){return this.anchor?this.getRootNode().querySelector(`#${this.anchor}`):this.currentAnchorElement}set anchorElement(e){this.currentAnchorElement=e,this.requestUpdate("anchorElement")}constructor(){super(),this.anchor="",this.positioning="absolute",this.quick=!1,this.hasOverflow=!1,this.open=!1,this.xOffset=0,this.yOffset=0,this.noHorizontalFlip=!1,this.noVerticalFlip=!1,this.typeaheadDelay=zn,this.anchorCorner=Er.END_START,this.menuCorner=Er.START_START,this.stayOpenOnOutsideClick=!1,this.stayOpenOnFocusout=!1,this.skipRestoreFocus=!1,this.defaultFocus=Me.FIRST_ITEM,this.noNavigationWrap=!1,this.typeaheadActive=!0,this.isSubmenu=!1,this.pointerPath=[],this.isRepositioning=!1,this.openCloseAnimationSignal=Qs(),this.listController=new Sn({isItem:e=>e.hasAttribute("md-menu-item"),getPossibleItems:()=>this.slotItems,isRtl:()=>getComputedStyle(this).direction==="rtl",deactivateItem:e=>{e.selected=!1,e.tabIndex=-1},activateItem:e=>{e.selected=!0,e.tabIndex=0},isNavigableKey:e=>{if(!this.isSubmenu)return Kl.has(e);const r=getComputedStyle(this).direction==="rtl"?pe.ArrowLeft:pe.ArrowRight;return e===r?!0:On.has(e)},wrapNavigation:()=>!this.noNavigationWrap}),this.lastFocusedElement=null,this.typeaheadController=new ql(()=>({getItems:()=>this.items,typeaheadBufferTime:this.typeaheadDelay,active:this.typeaheadActive})),this.currentAnchorElement=null,this.internals=this.attachInternals(),this.menuPositionController=new Ul(this,()=>({anchorCorner:this.anchorCorner,surfaceCorner:this.menuCorner,surfaceEl:this.surfaceEl,anchorEl:this.anchorElement,positioning:this.positioning==="popover"?"document":this.positioning,isOpen:this.open,xOffset:this.xOffset,yOffset:this.yOffset,disableBlockFlip:this.noVerticalFlip,disableInlineFlip:this.noHorizontalFlip,onOpen:this.onOpened,beforeClose:this.beforeClose,onClose:this.onClosed,repositionStrategy:this.hasOverflow&&this.positioning!=="popover"?"move":"resize"})),this.onWindowResize=()=>{this.isRepositioning||this.positioning!=="document"&&this.positioning!=="fixed"&&this.positioning!=="popover"||(this.isRepositioning=!0,this.reposition(),this.isRepositioning=!1)},this.handleFocusout=async e=>{const t=this.anchorElement;if(this.stayOpenOnFocusout||!this.open||this.pointerPath.includes(t))return;if(e.relatedTarget){if(qo(e.relatedTarget,this)||this.pointerPath.length!==0&&qo(e.relatedTarget,t))return}else if(this.pointerPath.includes(this))return;const r=this.skipRestoreFocus;this.skipRestoreFocus=!0,this.close(),await this.updateComplete,this.skipRestoreFocus=r},this.onOpened=async()=>{this.lastFocusedElement=jl();const e=this.items,t=$t(e);t&&this.defaultFocus!==Me.NONE&&(t.item.tabIndex=-1);let r=!this.quick;switch(this.quick?this.dispatchEvent(new Event("opening")):r=!!await this.animateOpen(),this.defaultFocus){case Me.FIRST_ITEM:const a=Fr(e);a&&(a.tabIndex=0,a.focus(),await a.updateComplete);break;case Me.LAST_ITEM:const i=kn(e);i&&(i.tabIndex=0,i.focus(),await i.updateComplete);break;case Me.LIST_ROOT:this.focus();break;default:case Me.NONE:break}r||this.dispatchEvent(new Event("opened"))},this.beforeClose=async()=>{var e,t;this.open=!1,this.skipRestoreFocus||(t=(e=this.lastFocusedElement)==null?void 0:e.focus)==null||t.call(e),this.quick||await this.animateClose()},this.onClosed=()=>{this.quick&&(this.dispatchEvent(new Event("closing")),this.dispatchEvent(new Event("closed")))},this.onWindowPointerdown=e=>{this.pointerPath=e.composedPath()},this.onDocumentClick=e=>{if(!this.open)return;const t=e.composedPath();!this.stayOpenOnOutsideClick&&!t.includes(this)&&!t.includes(this.anchorElement)&&(this.open=!1)},this.internals.role="menu",this.addEventListener("keydown",this.handleKeydown),this.addEventListener("keydown",this.captureKeydown,{capture:!0}),this.addEventListener("focusout",this.handleFocusout)}get items(){return this.listController.items}willUpdate(e){if(e.has("open")){if(this.open){this.removeAttribute("aria-hidden");return}this.setAttribute("aria-hidden","true")}}update(e){e.has("open")&&(this.open?this.setUpGlobalEventListeners():this.cleanUpGlobalEventListeners()),e.has("positioning")&&this.positioning==="popover"&&!this.showPopover&&(this.positioning="fixed"),super.update(e)}connectedCallback(){super.connectedCallback(),this.open&&this.setUpGlobalEventListeners()}disconnectedCallback(){super.disconnectedCallback(),this.cleanUpGlobalEventListeners()}getBoundingClientRect(){return this.surfaceEl?this.surfaceEl.getBoundingClientRect():super.getBoundingClientRect()}getClientRects(){return this.surfaceEl?this.surfaceEl.getClientRects():super.getClientRects()}render(){return this.renderSurface()}renderSurface(){return h`
      <div
        class="menu ${Q(this.getSurfaceClasses())}"
        style=${yt(this.menuPositionController.surfaceStyles)}
        popover=${this.positioning==="popover"?"manual":b}>
        ${this.renderElevation()}
        <div class="items">
          <div class="item-padding"> ${this.renderMenuItems()} </div>
        </div>
      </div>
    `}renderMenuItems(){return h`<slot
      @close-menu=${this.onCloseMenu}
      @deactivate-items=${this.onDeactivateItems}
      @request-activation=${this.onRequestActivation}
      @deactivate-typeahead=${this.handleDeactivateTypeahead}
      @activate-typeahead=${this.handleActivateTypeahead}
      @stay-open-on-focusout=${this.handleStayOpenOnFocusout}
      @close-on-focusout=${this.handleCloseOnFocusout}
      @slotchange=${this.listController.onSlotchange}></slot>`}renderElevation(){return h`<md-elevation part="elevation"></md-elevation>`}getSurfaceClasses(){return{open:this.open,fixed:this.positioning==="fixed","has-overflow":this.hasOverflow}}captureKeydown(e){e.target===this&&!e.defaultPrevented&&In(e.code)&&(e.preventDefault(),this.close()),this.typeaheadController.onKeydown(e)}async animateOpen(){const e=this.surfaceEl,t=this.slotEl;if(!e||!t)return!0;const r=this.openDirection;this.dispatchEvent(new Event("opening")),e.classList.toggle("animating",!0);const a=this.openCloseAnimationSignal.start(),i=e.offsetHeight,n=r==="UP",s=this.items,d=500,c=50,p=250,v=(d-p)/s.length,g=e.animate([{height:"0px"},{height:`${i}px`}],{duration:d,easing:Le.EMPHASIZED}),_=t.animate([{transform:n?`translateY(-${i}px)`:""},{transform:""}],{duration:d,easing:Le.EMPHASIZED}),w=e.animate([{opacity:0},{opacity:1}],c),x=[];for(let A=0;A<s.length;A++){const V=n?s.length-1-A:A,F=s[V],B=F.animate([{opacity:0},{opacity:1}],{duration:p,delay:v*A});F.classList.toggle("md-menu-hidden",!0),B.addEventListener("finish",()=>{F.classList.toggle("md-menu-hidden",!1)}),x.push([F,B])}let C=A=>{};const P=new Promise(A=>{C=A});return a.addEventListener("abort",()=>{g.cancel(),_.cancel(),w.cancel(),x.forEach(([A,V])=>{A.classList.toggle("md-menu-hidden",!1),V.cancel()}),C(!0)}),g.addEventListener("finish",()=>{e.classList.toggle("animating",!1),this.openCloseAnimationSignal.finish(),C(!1)}),await P}animateClose(){let e;const t=new Promise(B=>{e=B}),r=this.surfaceEl,a=this.slotEl;if(!r||!a)return e(!1),t;const n=this.openDirection==="UP";this.dispatchEvent(new Event("closing")),r.classList.toggle("animating",!0);const s=this.openCloseAnimationSignal.start(),d=r.offsetHeight,c=this.items,p=150,v=50,g=p-v,_=50,w=50,x=.35,C=(p-w-_)/c.length,P=r.animate([{height:`${d}px`},{height:`${d*x}px`}],{duration:p,easing:Le.EMPHASIZED_ACCELERATE}),A=a.animate([{transform:""},{transform:n?`translateY(-${d*(1-x)}px)`:""}],{duration:p,easing:Le.EMPHASIZED_ACCELERATE}),V=r.animate([{opacity:1},{opacity:0}],{duration:v,delay:g}),F=[];for(let B=0;B<c.length;B++){const G=n?B:c.length-1-B,K=c[G],Z=K.animate([{opacity:1},{opacity:0}],{duration:_,delay:w+C*B});Z.addEventListener("finish",()=>{K.classList.toggle("md-menu-hidden",!0)}),F.push([K,Z])}return s.addEventListener("abort",()=>{P.cancel(),A.cancel(),V.cancel(),F.forEach(([B,G])=>{G.cancel(),B.classList.toggle("md-menu-hidden",!1)}),e(!1)}),P.addEventListener("finish",()=>{r.classList.toggle("animating",!1),F.forEach(([B])=>{B.classList.toggle("md-menu-hidden",!1)}),this.openCloseAnimationSignal.finish(),this.dispatchEvent(new Event("closed")),e(!0)}),t}handleKeydown(e){this.pointerPath=[],this.listController.handleKeydown(e)}setUpGlobalEventListeners(){document.addEventListener("click",this.onDocumentClick,{capture:!0}),window.addEventListener("pointerdown",this.onWindowPointerdown),document.addEventListener("resize",this.onWindowResize,{passive:!0}),window.addEventListener("resize",this.onWindowResize,{passive:!0})}cleanUpGlobalEventListeners(){document.removeEventListener("click",this.onDocumentClick,{capture:!0}),window.removeEventListener("pointerdown",this.onWindowPointerdown),document.removeEventListener("resize",this.onWindowResize),window.removeEventListener("resize",this.onWindowResize)}onCloseMenu(){this.close()}onDeactivateItems(e){e.stopPropagation(),this.listController.onDeactivateItems()}onRequestActivation(e){e.stopPropagation(),this.listController.onRequestActivation(e)}handleDeactivateTypeahead(e){e.stopPropagation(),this.typeaheadActive=!1}handleActivateTypeahead(e){e.stopPropagation(),this.typeaheadActive=!0}handleStayOpenOnFocusout(e){e.stopPropagation(),this.stayOpenOnFocusout=!0}handleCloseOnFocusout(e){e.stopPropagation(),this.stayOpenOnFocusout=!1}close(){this.open=!1,this.slotItems.forEach(t=>{var r;(r=t.close)==null||r.call(t)})}show(){this.open=!0}activateNextItem(){return this.listController.activateNextItem()??null}activatePreviousItem(){return this.listController.activatePreviousItem()??null}reposition(){this.open&&this.menuPositionController.position()}}l([U(".menu")],ie.prototype,"surfaceEl",void 0);l([U("slot")],ie.prototype,"slotEl",void 0);l([u()],ie.prototype,"anchor",void 0);l([u()],ie.prototype,"positioning",void 0);l([u({type:Boolean})],ie.prototype,"quick",void 0);l([u({type:Boolean,attribute:"has-overflow"})],ie.prototype,"hasOverflow",void 0);l([u({type:Boolean,reflect:!0})],ie.prototype,"open",void 0);l([u({type:Number,attribute:"x-offset"})],ie.prototype,"xOffset",void 0);l([u({type:Number,attribute:"y-offset"})],ie.prototype,"yOffset",void 0);l([u({type:Boolean,attribute:"no-horizontal-flip"})],ie.prototype,"noHorizontalFlip",void 0);l([u({type:Boolean,attribute:"no-vertical-flip"})],ie.prototype,"noVerticalFlip",void 0);l([u({type:Number,attribute:"typeahead-delay"})],ie.prototype,"typeaheadDelay",void 0);l([u({attribute:"anchor-corner"})],ie.prototype,"anchorCorner",void 0);l([u({attribute:"menu-corner"})],ie.prototype,"menuCorner",void 0);l([u({type:Boolean,attribute:"stay-open-on-outside-click"})],ie.prototype,"stayOpenOnOutsideClick",void 0);l([u({type:Boolean,attribute:"stay-open-on-focusout"})],ie.prototype,"stayOpenOnFocusout",void 0);l([u({type:Boolean,attribute:"skip-restore-focus"})],ie.prototype,"skipRestoreFocus",void 0);l([u({attribute:"default-focus"})],ie.prototype,"defaultFocus",void 0);l([u({type:Boolean,attribute:"no-navigation-wrap"})],ie.prototype,"noNavigationWrap",void 0);l([ce({flatten:!0})],ie.prototype,"slotItems",void 0);l([T()],ie.prototype,"typeaheadActive",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Rn=S`:host{--md-elevation-level: var(--md-menu-container-elevation, 2);--md-elevation-shadow-color: var(--md-menu-container-shadow-color, var(--md-sys-color-shadow, #000));min-width:112px;color:unset;display:contents}md-focus-ring{--md-focus-ring-shape: var(--md-menu-container-shape, var(--md-sys-shape-corner-extra-small, 4px))}.menu{border-radius:var(--md-menu-container-shape, var(--md-sys-shape-corner-extra-small, 4px));display:none;inset:auto;border:none;padding:0px;overflow:visible;background-color:rgba(0,0,0,0);color:inherit;opacity:0;z-index:20;position:absolute;user-select:none;max-height:inherit;height:inherit;min-width:inherit;max-width:inherit;scrollbar-width:inherit}.menu::backdrop{display:none}.fixed{position:fixed}.items{display:block;list-style-type:none;margin:0;outline:none;box-sizing:border-box;background-color:var(--md-menu-container-color, var(--md-sys-color-surface-container, #f3edf7));height:inherit;max-height:inherit;overflow:auto;min-width:inherit;max-width:inherit;border-radius:inherit;scrollbar-width:inherit}.item-padding{padding-block:var(--md-menu-top-space, 8px) var(--md-menu-bottom-space, 8px)}.has-overflow:not([popover]) .items{overflow:visible}.has-overflow.animating .items,.animating .items{overflow:hidden}.has-overflow.animating .items{pointer-events:none}.animating ::slotted(.md-menu-hidden){opacity:0}slot{display:block;height:inherit;max-height:inherit}::slotted(:is(md-divider,[role=separator])){margin:8px 0}@media(forced-colors: active){.menu{border-style:solid;border-color:CanvasText;border-width:1px}}
`;Rn.styleSheet;/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Ko=class extends ie{};Ko.styles=[Rn];Ko=l([E("md-menu")],Ko);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Mn{constructor(e,t){this.host=e,this.internalTypeaheadText=null,this.onClick=()=>{this.host.keepOpen||this.host.dispatchEvent(vi(this.host,{kind:Ho.CLICK_SELECTION}))},this.onKeydown=r=>{if(this.host.href&&r.code==="Enter"){const i=this.getInteractiveElement();i instanceof HTMLAnchorElement&&i.click()}if(r.defaultPrevented)return;const a=r.code;this.host.keepOpen&&a!=="Escape"||In(a)&&(r.preventDefault(),this.host.dispatchEvent(vi(this.host,{kind:Ho.KEYDOWN,key:a})))},this.getHeadlineElements=t.getHeadlineElements,this.getSupportingTextElements=t.getSupportingTextElements,this.getDefaultElements=t.getDefaultElements,this.getInteractiveElement=t.getInteractiveElement,this.host.addController(this)}get typeaheadText(){if(this.internalTypeaheadText!==null)return this.internalTypeaheadText;const e=this.getHeadlineElements(),t=[];return e.forEach(r=>{r.textContent&&r.textContent.trim()&&t.push(r.textContent.trim())}),t.length===0&&this.getDefaultElements().forEach(r=>{r.textContent&&r.textContent.trim()&&t.push(r.textContent.trim())}),t.length===0&&this.getSupportingTextElements().forEach(r=>{r.textContent&&r.textContent.trim()&&t.push(r.textContent.trim())}),t.join(" ")}get tagName(){switch(this.host.type){case"link":return"a";case"button":return"button";default:case"menuitem":case"option":return"li"}}get role(){return this.host.type==="option"?"option":"menuitem"}hostConnected(){this.host.toggleAttribute("md-menu-item",!0)}hostUpdate(){this.host.href&&(this.host.type="link")}setTypeaheadText(e){this.internalTypeaheadText=e}}/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Gl=ue(O);class Ce extends Gl{constructor(){super(...arguments),this.disabled=!1,this.type="menuitem",this.href="",this.target="",this.keepOpen=!1,this.selected=!1,this.menuItemController=new Mn(this,{getHeadlineElements:()=>this.headlineElements,getSupportingTextElements:()=>this.supportingTextElements,getDefaultElements:()=>this.defaultElements,getInteractiveElement:()=>this.listItemRoot})}get typeaheadText(){return this.menuItemController.typeaheadText}set typeaheadText(e){this.menuItemController.setTypeaheadText(e)}render(){return this.renderListItem(h`
      <md-item>
        <div slot="container">
          ${this.renderRipple()} ${this.renderFocusRing()}
        </div>
        <slot name="start" slot="start"></slot>
        <slot name="end" slot="end"></slot>
        ${this.renderBody()}
      </md-item>
    `)}renderListItem(e){const t=this.type==="link";let r;switch(this.menuItemController.tagName){case"a":r=ye`a`;break;case"button":r=ye`button`;break;default:case"li":r=ye`li`;break}const a=t&&this.target?this.target:b;return ar`
      <${r}
        id="item"
        tabindex=${this.disabled&&!t?-1:0}
        role=${this.menuItemController.role}
        aria-label=${this.ariaLabel||b}
        aria-selected=${this.ariaSelected||b}
        aria-checked=${this.ariaChecked||b}
        aria-expanded=${this.ariaExpanded||b}
        aria-haspopup=${this.ariaHasPopup||b}
        class="list-item ${Q(this.getRenderClasses())}"
        href=${this.href||b}
        target=${a}
        @click=${this.menuItemController.onClick}
        @keydown=${this.menuItemController.onKeydown}
      >${e}</${r}>
    `}renderRipple(){return h` <md-ripple
      part="ripple"
      for="item"
      ?disabled=${this.disabled}></md-ripple>`}renderFocusRing(){return h` <md-focus-ring
      part="focus-ring"
      for="item"
      inward></md-focus-ring>`}getRenderClasses(){return{disabled:this.disabled,selected:this.selected}}renderBody(){return h`
      <slot></slot>
      <slot name="overline" slot="overline"></slot>
      <slot name="headline" slot="headline"></slot>
      <slot name="supporting-text" slot="supporting-text"></slot>
      <slot
        name="trailing-supporting-text"
        slot="trailing-supporting-text"></slot>
    `}focus(){var e;(e=this.listItemRoot)==null||e.focus()}}Ce.shadowRootOptions={...O.shadowRootOptions,delegatesFocus:!0};l([u({type:Boolean,reflect:!0})],Ce.prototype,"disabled",void 0);l([u()],Ce.prototype,"type",void 0);l([u()],Ce.prototype,"href",void 0);l([u()],Ce.prototype,"target",void 0);l([u({type:Boolean,attribute:"keep-open"})],Ce.prototype,"keepOpen",void 0);l([u({type:Boolean})],Ce.prototype,"selected",void 0);l([U(".list-item")],Ce.prototype,"listItemRoot",void 0);l([ce({slot:"headline"})],Ce.prototype,"headlineElements",void 0);l([ce({slot:"supporting-text"})],Ce.prototype,"supportingTextElements",void 0);l([xa({slot:""})],Ce.prototype,"defaultElements",void 0);l([u({attribute:"typeahead-text"})],Ce.prototype,"typeaheadText",null);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ma=S`:host{display:flex;gap:16px;--md-ripple-hover-color: var(--md-menu-item-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-menu-item-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-menu-item-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-opacity: var(--md-menu-item-pressed-state-layer-opacity, 0.12)}:host([disabled]){opacity:var(--md-menu-item-disabled-opacity, 0.3);pointer-events:none}md-focus-ring{z-index:1;--md-focus-ring-shape: 8px}a,button,li{background:none;border:none;padding:0;margin:0;text-align:unset;text-decoration:none}.list-item{border-radius:inherit;display:flex;flex:1;gap:inherit;max-width:inherit;min-width:inherit;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.list-item:not(.disabled){cursor:pointer}[slot=container]{pointer-events:none}md-ripple{border-radius:inherit}md-item{border-radius:inherit;flex:1;color:var(--md-menu-item-label-text-color, var(--md-sys-color-on-surface, #1d1b20));font-family:var(--md-menu-item-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-menu-item-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));line-height:var(--md-menu-item-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));font-weight:var(--md-menu-item-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));min-height:var(--md-menu-item-one-line-container-height, 56px);padding-top:var(--md-menu-item-top-space, 12px);padding-bottom:var(--md-menu-item-bottom-space, 12px);padding-inline-start:var(--md-menu-item-leading-space, 16px);padding-inline-end:var(--md-menu-item-trailing-space, 16px);gap:inherit}md-item[multiline]{min-height:var(--md-menu-item-two-line-container-height, 72px)}[slot=supporting-text]{color:var(--md-menu-item-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-menu-item-supporting-text-font, var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-menu-item-supporting-text-size, var(--md-sys-typescale-body-medium-size, 0.875rem));line-height:var(--md-menu-item-supporting-text-line-height, var(--md-sys-typescale-body-medium-line-height, 1.25rem));font-weight:var(--md-menu-item-supporting-text-weight, var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)))}[slot=trailing-supporting-text]{color:var(--md-menu-item-trailing-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-menu-item-trailing-supporting-text-font, var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-menu-item-trailing-supporting-text-size, var(--md-sys-typescale-label-small-size, 0.6875rem));line-height:var(--md-menu-item-trailing-supporting-text-line-height, var(--md-sys-typescale-label-small-line-height, 1rem));font-weight:var(--md-menu-item-trailing-supporting-text-weight, var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500)))}:is([slot=start],[slot=end])::slotted(*){fill:currentColor}[slot=start]{color:var(--md-menu-item-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}[slot=end]{color:var(--md-menu-item-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}.list-item{background-color:var(--md-menu-item-container-color, transparent)}.list-item.selected{background-color:var(--md-menu-item-selected-container-color, var(--md-sys-color-secondary-container, #e8def8))}.selected:not(.disabled) ::slotted(*){color:var(--md-menu-item-selected-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b))}@media(forced-colors: active){:host([disabled]),:host([disabled]) slot{color:GrayText;opacity:1}.list-item{position:relative}.list-item.selected::before{content:"";position:absolute;inset:0;box-sizing:border-box;border-radius:inherit;pointer-events:none;border:3px double CanvasText}}
`;Ma.styleSheet;/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let jo=class extends Ce{};jo.styles=[Ma];jo=l([E("md-menu-item")],jo);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class st extends O{get item(){return this.items[0]??null}get menu(){return this.menus[0]??null}constructor(){super(),this.anchorCorner=Er.START_END,this.menuCorner=Er.START_START,this.hoverOpenDelay=400,this.hoverCloseDelay=400,this.isSubMenu=!0,this.previousOpenTimeout=0,this.previousCloseTimeout=0,this.onMouseenter=()=>{var e;clearTimeout(this.previousOpenTimeout),clearTimeout(this.previousCloseTimeout),!((e=this.menu)!=null&&e.open)&&(this.hoverOpenDelay?this.previousOpenTimeout=setTimeout(()=>{this.show()},this.hoverOpenDelay):this.show())},this.onMouseleave=()=>{clearTimeout(this.previousCloseTimeout),clearTimeout(this.previousOpenTimeout),this.hoverCloseDelay?this.previousCloseTimeout=setTimeout(()=>{this.close()},this.hoverCloseDelay):this.close()},this.addEventListener("mouseenter",this.onMouseenter),this.addEventListener("mouseleave",this.onMouseleave)}render(){return h`
      <slot
        name="item"
        @click=${this.onClick}
        @keydown=${this.onKeydown}
        @slotchange=${this.onSlotchange}>
      </slot>
      <slot
        name="menu"
        @keydown=${this.onSubMenuKeydown}
        @close-menu=${this.onCloseSubmenu}
        @slotchange=${this.onSlotchange}>
      </slot>
    `}firstUpdated(){this.onSlotchange()}async show(){const e=this.menu;if(!e||e.open)return;e.addEventListener("closed",()=>{this.item.ariaExpanded="false",this.dispatchEvent(ro()),this.dispatchEvent(ur()),e.ariaHidden="true"},{once:!0}),e.positioning==="document"&&(e.positioning="absolute"),e.quick=!0,e.hasOverflow=!0,e.anchorCorner=this.anchorCorner,e.menuCorner=this.menuCorner,e.anchorElement=this.item,e.defaultFocus="first-item",e.removeAttribute("aria-hidden"),e.skipRestoreFocus=!1;const t=e.open;if(e.show(),this.item.ariaExpanded="true",this.item.ariaHasPopup="menu",e.id&&this.item.setAttribute("aria-controls",e.id),this.dispatchEvent(ur()),this.dispatchEvent(Vl()),this.item.selected=!0,!t){let r=i=>{};const a=new Promise(i=>{r=i});e.addEventListener("opened",r,{once:!0}),await a}}async close(){const e=this.menu;if(!e||!e.open)return;this.dispatchEvent(ro()),e.quick=!0,e.close(),this.dispatchEvent(ur());let t=a=>{};const r=new Promise(a=>{t=a});e.addEventListener("closed",t,{once:!0}),await r}onSlotchange(){var t;if(!this.item)return;this.item.ariaExpanded="false",this.item.ariaHasPopup="menu",(t=this.menu)!=null&&t.id&&this.item.setAttribute("aria-controls",this.menu.id),this.item.keepOpen=!0;const e=this.menu;e&&(e.isSubmenu=!0,e.ariaHidden="true")}onClick(){this.show()}async onKeydown(e){const t=this.isSubmenuOpenKey(e.code);if(e.defaultPrevented)return;const r=t&&(Ye.LEFT===e.code||Ye.RIGHT===e.code);if((e.code===Tt.SPACE||r)&&(e.preventDefault(),r&&e.stopPropagation()),!t)return;const a=this.menu;if(!a)return;const i=a.items,n=Fr(i);if(n){await this.show(),n.tabIndex=0,n.focus();return}}onCloseSubmenu(e){const{itemPath:t,reason:r}=e.detail;if(t.push(this.item),this.dispatchEvent(ro()),r.kind===Ho.KEYDOWN&&r.key===Uo.ESCAPE){e.stopPropagation(),this.item.dispatchEvent(Cn());return}this.dispatchEvent(ur())}async onSubMenuKeydown(e){var a;if(e.defaultPrevented)return;const{close:t,keyCode:r}=this.isSubmenuCloseKey(e.code);t&&(e.preventDefault(),(r===Ye.LEFT||r===Ye.RIGHT)&&e.stopPropagation(),await this.close(),Ol(this.menu.items),(a=this.item)==null||a.focus(),this.item.tabIndex=0,this.item.focus())}isSubmenuOpenKey(e){const r=getComputedStyle(this).direction==="rtl"?Ye.LEFT:Ye.RIGHT;switch(e){case r:case Tt.SPACE:case Tt.ENTER:return!0;default:return!1}}isSubmenuCloseKey(e){const r=getComputedStyle(this).direction==="rtl"?Ye.RIGHT:Ye.LEFT;switch(e){case r:case Uo.ESCAPE:return{close:!0,keyCode:e};default:return{close:!1}}}}l([u({attribute:"anchor-corner"})],st.prototype,"anchorCorner",void 0);l([u({attribute:"menu-corner"})],st.prototype,"menuCorner",void 0);l([u({type:Number,attribute:"hover-open-delay"})],st.prototype,"hoverOpenDelay",void 0);l([u({type:Number,attribute:"hover-close-delay"})],st.prototype,"hoverCloseDelay",void 0);l([u({type:Boolean,reflect:!0,attribute:"md-sub-menu"})],st.prototype,"isSubMenu",void 0);l([ce({slot:"item",flatten:!0})],st.prototype,"items",void 0);l([ce({slot:"menu",flatten:!0})],st.prototype,"menus",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ln=S`:host{position:relative;display:flex;flex-direction:column}
`;Ln.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Go=class extends st{};Go.styles=[Ln];Go=l([E("md-sub-menu")],Go);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Wl=ue(O);class Mt extends Wl{constructor(){super(...arguments),this.value=0,this.max=1,this.indeterminate=!1,this.fourColor=!1}render(){const{ariaLabel:e}=this;return h`
      <div
        class="progress ${Q(this.getRenderClasses())}"
        role="progressbar"
        aria-label="${e||b}"
        aria-valuemin="0"
        aria-valuemax=${this.max}
        aria-valuenow=${this.indeterminate?b:this.value}
        >${this.renderIndicator()}</div
      >
    `}getRenderClasses(){return{indeterminate:this.indeterminate,"four-color":this.fourColor}}}l([u({type:Number})],Mt.prototype,"value",void 0);l([u({type:Number})],Mt.prototype,"max",void 0);l([u({type:Boolean})],Mt.prototype,"indeterminate",void 0);l([u({type:Boolean,attribute:"four-color"})],Mt.prototype,"fourColor",void 0);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Yl extends Mt{renderIndicator(){return this.indeterminate?this.renderIndeterminateContainer():this.renderDeterminateContainer()}renderDeterminateContainer(){const e=(1-this.value/this.max)*100;return h`
      <svg viewBox="0 0 4800 4800">
        <circle class="track" pathLength="100"></circle>
        <circle
          class="active-track"
          pathLength="100"
          stroke-dashoffset=${e}></circle>
      </svg>
    `}renderIndeterminateContainer(){return h` <div class="spinner">
      <div class="left">
        <div class="circle"></div>
      </div>
      <div class="right">
        <div class="circle"></div>
      </div>
    </div>`}}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Dn=S`:host{--_active-indicator-color: var(--md-circular-progress-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_active-indicator-width: var(--md-circular-progress-active-indicator-width, 10);--_four-color-active-indicator-four-color: var(--md-circular-progress-four-color-active-indicator-four-color, var(--md-sys-color-tertiary-container, #ffd8e4));--_four-color-active-indicator-one-color: var(--md-circular-progress-four-color-active-indicator-one-color, var(--md-sys-color-primary, #6750a4));--_four-color-active-indicator-three-color: var(--md-circular-progress-four-color-active-indicator-three-color, var(--md-sys-color-tertiary, #7d5260));--_four-color-active-indicator-two-color: var(--md-circular-progress-four-color-active-indicator-two-color, var(--md-sys-color-primary-container, #eaddff));--_size: var(--md-circular-progress-size, 48px);display:inline-flex;vertical-align:middle;width:var(--_size);height:var(--_size);position:relative;align-items:center;justify-content:center;contain:strict;content-visibility:auto}.progress{flex:1;align-self:stretch;margin:4px}.progress,.spinner,.left,.right,.circle,svg,.track,.active-track{position:absolute;inset:0}svg{transform:rotate(-90deg)}circle{cx:50%;cy:50%;r:calc(50%*(1 - var(--_active-indicator-width)/100));stroke-width:calc(var(--_active-indicator-width)*1%);stroke-dasharray:100;fill:rgba(0,0,0,0)}.active-track{transition:stroke-dashoffset 500ms cubic-bezier(0, 0, 0.2, 1);stroke:var(--_active-indicator-color)}.track{stroke:rgba(0,0,0,0)}.progress.indeterminate{animation:linear infinite linear-rotate;animation-duration:1568.2352941176ms}.spinner{animation:infinite both rotate-arc;animation-duration:5332ms;animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.left{overflow:hidden;inset:0 50% 0 0}.right{overflow:hidden;inset:0 0 0 50%}.circle{box-sizing:border-box;border-radius:50%;border:solid calc(var(--_active-indicator-width)/100*(var(--_size) - 8px));border-color:var(--_active-indicator-color) var(--_active-indicator-color) rgba(0,0,0,0) rgba(0,0,0,0);animation:expand-arc;animation-iteration-count:infinite;animation-fill-mode:both;animation-duration:1333ms,5332ms;animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.four-color .circle{animation-name:expand-arc,four-color}.left .circle{rotate:135deg;inset:0 -100% 0 0}.right .circle{rotate:100deg;inset:0 0 0 -100%;animation-delay:-666.5ms,0ms}@media(forced-colors: active){.active-track{stroke:CanvasText}.circle{border-color:CanvasText CanvasText Canvas Canvas}}@keyframes expand-arc{0%{transform:rotate(265deg)}50%{transform:rotate(130deg)}100%{transform:rotate(265deg)}}@keyframes rotate-arc{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}100%{transform:rotate(1080deg)}}@keyframes linear-rotate{to{transform:rotate(360deg)}}@keyframes four-color{0%{border-top-color:var(--_four-color-active-indicator-one-color);border-right-color:var(--_four-color-active-indicator-one-color)}15%{border-top-color:var(--_four-color-active-indicator-one-color);border-right-color:var(--_four-color-active-indicator-one-color)}25%{border-top-color:var(--_four-color-active-indicator-two-color);border-right-color:var(--_four-color-active-indicator-two-color)}40%{border-top-color:var(--_four-color-active-indicator-two-color);border-right-color:var(--_four-color-active-indicator-two-color)}50%{border-top-color:var(--_four-color-active-indicator-three-color);border-right-color:var(--_four-color-active-indicator-three-color)}65%{border-top-color:var(--_four-color-active-indicator-three-color);border-right-color:var(--_four-color-active-indicator-three-color)}75%{border-top-color:var(--_four-color-active-indicator-four-color);border-right-color:var(--_four-color-active-indicator-four-color)}90%{border-top-color:var(--_four-color-active-indicator-four-color);border-right-color:var(--_four-color-active-indicator-four-color)}100%{border-top-color:var(--_four-color-active-indicator-one-color);border-right-color:var(--_four-color-active-indicator-one-color)}}
`;Dn.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Wo=class extends Yl{};Wo.styles=[Dn];Wo=l([E("md-circular-progress")],Wo);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Fn extends Mt{constructor(){super(...arguments),this.buffer=0}renderIndicator(){const e={transform:`scaleX(${(this.indeterminate?1:this.value/this.max)*100}%)`},t=this.buffer??0,r=t>0,i={transform:`scaleX(${(this.indeterminate||!r?1:t/this.max)*100}%)`},n=this.indeterminate||!r||t>=this.max||this.value>=this.max;return h`
      <div class="dots" ?hidden=${n}></div>
      <div class="inactive-track" style=${yt(i)}></div>
      <div class="bar primary-bar" style=${yt(e)}>
        <div class="bar-inner"></div>
      </div>
      <div class="bar secondary-bar">
        <div class="bar-inner"></div>
      </div>
    `}}l([u({type:Number})],Fn.prototype,"buffer",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Bn=S`:host{--_active-indicator-color: var(--md-linear-progress-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_active-indicator-height: var(--md-linear-progress-active-indicator-height, 4px);--_four-color-active-indicator-four-color: var(--md-linear-progress-four-color-active-indicator-four-color, var(--md-sys-color-tertiary-container, #ffd8e4));--_four-color-active-indicator-one-color: var(--md-linear-progress-four-color-active-indicator-one-color, var(--md-sys-color-primary, #6750a4));--_four-color-active-indicator-three-color: var(--md-linear-progress-four-color-active-indicator-three-color, var(--md-sys-color-tertiary, #7d5260));--_four-color-active-indicator-two-color: var(--md-linear-progress-four-color-active-indicator-two-color, var(--md-sys-color-primary-container, #eaddff));--_track-color: var(--md-linear-progress-track-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_track-height: var(--md-linear-progress-track-height, 4px);--_track-shape: var(--md-linear-progress-track-shape, var(--md-sys-shape-corner-none, 0px));border-radius:var(--_track-shape);display:flex;position:relative;min-width:80px;height:var(--_track-height);content-visibility:auto;contain:strict}.progress,.dots,.inactive-track,.bar,.bar-inner{position:absolute}.progress{direction:ltr;inset:0;border-radius:inherit;overflow:hidden;display:flex;align-items:center}.bar{animation:none;width:100%;height:var(--_active-indicator-height);transform-origin:left center;transition:transform 250ms cubic-bezier(0.4, 0, 0.6, 1)}.secondary-bar{display:none}.bar-inner{inset:0;animation:none;background:var(--_active-indicator-color)}.inactive-track{background:var(--_track-color);inset:0;transition:transform 250ms cubic-bezier(0.4, 0, 0.6, 1);transform-origin:left center}.dots{inset:0;animation:linear infinite 250ms;animation-name:buffering;background-color:var(--_track-color);background-repeat:repeat-x;-webkit-mask-image:url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5 2' preserveAspectRatio='xMinYMin slice'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/svg%3E");mask-image:url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5 2' preserveAspectRatio='xMinYMin slice'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/svg%3E");z-index:-1}.dots[hidden]{display:none}.indeterminate .bar{transition:none}.indeterminate .primary-bar{inset-inline-start:-145.167%}.indeterminate .secondary-bar{inset-inline-start:-54.8889%;display:block}.indeterminate .primary-bar{animation:linear infinite 2s;animation-name:primary-indeterminate-translate}.indeterminate .primary-bar>.bar-inner{animation:linear infinite 2s primary-indeterminate-scale}.indeterminate.four-color .primary-bar>.bar-inner{animation-name:primary-indeterminate-scale,four-color;animation-duration:2s,4s}.indeterminate .secondary-bar{animation:linear infinite 2s;animation-name:secondary-indeterminate-translate}.indeterminate .secondary-bar>.bar-inner{animation:linear infinite 2s secondary-indeterminate-scale}.indeterminate.four-color .secondary-bar>.bar-inner{animation-name:secondary-indeterminate-scale,four-color;animation-duration:2s,4s}:host(:dir(rtl)){transform:scale(-1)}@keyframes primary-indeterminate-scale{0%{transform:scaleX(0.08)}36.65%{animation-timing-function:cubic-bezier(0.334731, 0.12482, 0.785844, 1);transform:scaleX(0.08)}69.15%{animation-timing-function:cubic-bezier(0.06, 0.11, 0.6, 1);transform:scaleX(0.661479)}100%{transform:scaleX(0.08)}}@keyframes secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(0.205028, 0.057051, 0.57661, 0.453971);transform:scaleX(0.08)}19.15%{animation-timing-function:cubic-bezier(0.152313, 0.196432, 0.648374, 1.00432);transform:scaleX(0.457104)}44.15%{animation-timing-function:cubic-bezier(0.257759, -0.003163, 0.211762, 1.38179);transform:scaleX(0.72796)}100%{transform:scaleX(0.08)}}@keyframes buffering{0%{transform:translateX(calc(var(--_track-height) / 2 * 5))}}@keyframes primary-indeterminate-translate{0%{transform:translateX(0px)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0px)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(83.6714%)}100%{transform:translateX(200.611%)}}@keyframes secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0px)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(37.6519%)}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(84.3862%)}100%{transform:translateX(160.278%)}}@keyframes four-color{0%{background:var(--_four-color-active-indicator-one-color)}15%{background:var(--_four-color-active-indicator-one-color)}25%{background:var(--_four-color-active-indicator-two-color)}40%{background:var(--_four-color-active-indicator-two-color)}50%{background:var(--_four-color-active-indicator-three-color)}65%{background:var(--_four-color-active-indicator-three-color)}75%{background:var(--_four-color-active-indicator-four-color)}90%{background:var(--_four-color-active-indicator-four-color)}100%{background:var(--_four-color-active-indicator-one-color)}}@media(forced-colors: active){:host{outline:1px solid CanvasText}.bar-inner,.dots{background-color:CanvasText}}
`;Bn.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Yo=class extends Fn{};Yo.styles=[Bn];Yo=l([E("md-linear-progress")],Yo);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const mr=Symbol("isFocusable"),oo=Symbol("privateIsFocusable"),vr=Symbol("externalTabIndex"),fr=Symbol("isUpdatingTabIndex"),br=Symbol("updateTabIndex");function Nn(o){var e,t,r;class a extends o{constructor(){super(...arguments),this[e]=!0,this[t]=null,this[r]=!1}get[mr](){return this[oo]}set[mr](n){this[mr]!==n&&(this[oo]=n,this[br]())}connectedCallback(){super.connectedCallback(),this[br]()}attributeChangedCallback(n,s,d){if(n!=="tabindex"){super.attributeChangedCallback(n,s,d);return}if(this.requestUpdate("tabIndex",Number(s??-1)),!this[fr]){if(!this.hasAttribute("tabindex")){this[vr]=null,this[br]();return}this[vr]=this.tabIndex}}[(e=oo,t=vr,r=fr,br)](){const n=this[mr]?0:-1,s=this[vr]??n;this[fr]=!0,this.tabIndex=s,this[fr]=!1}}return l([u({noAccessor:!0})],a.prototype,"tabIndex",void 0),a}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Xl extends Mr{computeValidity(e){this.radioElement||(this.radioElement=document.createElement("input"),this.radioElement.type="radio",this.radioElement.name="group");let t=!1,r=!1;for(const{checked:a,required:i}of e)i&&(t=!0),a&&(r=!0);return this.radioElement.checked=r,this.radioElement.required=t,{validity:{valueMissing:t&&!r},validationMessage:this.radioElement.validationMessage}}equals(e,t){if(e.length!==t.length)return!1;for(let r=0;r<e.length;r++){const a=e[r],i=t[r];if(a.checked!==i.checked||a.required!==i.required)return!1}return!0}copy(e){return e.map(({checked:t,required:r})=>({checked:t,required:r}))}}/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Zl{get controls(){const e=this.host.getAttribute("name");return!e||!this.root||!this.host.isConnected?[this.host]:Array.from(this.root.querySelectorAll(`[name="${e}"]`))}constructor(e){this.host=e,this.focused=!1,this.root=null,this.handleFocusIn=()=>{this.focused=!0,this.updateTabIndices()},this.handleFocusOut=()=>{this.focused=!1,this.updateTabIndices()},this.handleKeyDown=t=>{const r=t.key==="ArrowDown",a=t.key==="ArrowUp",i=t.key==="ArrowLeft",n=t.key==="ArrowRight";if(!i&&!n&&!r&&!a)return;const s=this.controls;if(!s.length)return;t.preventDefault();const c=getComputedStyle(this.host).direction==="rtl"?i||r:n||r,p=s.indexOf(this.host);let v=c?p+1:p-1;for(;v!==p;){v>=s.length?v=0:v<0&&(v=s.length-1);const g=s[v];if(g.hasAttribute("disabled")){c?v++:v--;continue}for(const _ of s)_!==g&&(_.checked=!1,_.tabIndex=-1,_.blur());g.checked=!0,g.tabIndex=0,g.focus(),g.dispatchEvent(new Event("change",{bubbles:!0}));break}}}hostConnected(){this.host.addEventListener("keydown",this.handleKeyDown),this.host.addEventListener("focusin",this.handleFocusIn),this.host.addEventListener("focusout",this.handleFocusOut),queueMicrotask(()=>{this.root=this.host.getRootNode(),this.host.checked&&this.uncheckSiblings(),this.updateTabIndices()})}hostDisconnected(){this.host.removeEventListener("keydown",this.handleKeyDown),this.host.removeEventListener("focusin",this.handleFocusIn),this.host.removeEventListener("focusout",this.handleFocusOut),queueMicrotask(()=>{this.updateTabIndices(),this.root=null})}handleCheckedChange(){this.host.checked&&(this.uncheckSiblings(),this.updateTabIndices())}uncheckSiblings(){for(const e of this.controls)e!==this.host&&(e.checked=!1)}updateTabIndices(){const e=this.controls,t=e.find(r=>r.checked);if(t||this.focused){const r=t||this.host;r.tabIndex=0;for(const a of e)a!==r&&(a.tabIndex=-1);return}for(const r of e)r.tabIndex=0}}/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */var fi;const ao=Symbol("checked");let Ql=0;const Jl=tr(it(at(Nn(O))));class nr extends Jl{get checked(){return this[ao]}set checked(e){const t=this.checked;t!==e&&(this[ao]=e,this.requestUpdate("checked",t),this.selectionController.handleCheckedChange())}constructor(){super(),this.maskId=`cutout${++Ql}`,this[fi]=!1,this.required=!1,this.value="on",this.selectionController=new Zl(this),this.addController(this.selectionController),this[ge].role="radio",this.addEventListener("click",this.handleClick.bind(this)),this.addEventListener("keydown",this.handleKeydown.bind(this))}render(){const e={checked:this.checked};return h`
      <div class="container ${Q(e)}" aria-hidden="true">
        <md-ripple
          part="ripple"
          .control=${this}
          ?disabled=${this.disabled}></md-ripple>
        <md-focus-ring part="focus-ring" .control=${this}></md-focus-ring>
        <svg class="icon" viewBox="0 0 20 20">
          <mask id="${this.maskId}">
            <rect width="100%" height="100%" fill="white" />
            <circle cx="10" cy="10" r="8" fill="black" />
          </mask>
          <circle
            class="outer circle"
            cx="10"
            cy="10"
            r="10"
            mask="url(#${this.maskId})" />
          <circle class="inner circle" cx="10" cy="10" r="5" />
        </svg>

        <div class="touch-target"></div>
      </div>
    `}updated(){this[ge].ariaChecked=String(this.checked)}async handleClick(e){this.disabled||(await 0,!e.defaultPrevented&&(er(e)&&this.focus(),this.checked=!0,this.dispatchEvent(new Event("change",{bubbles:!0})),this.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0}))))}async handleKeydown(e){await 0,!(e.key!==" "||e.defaultPrevented)&&this.click()}[(fi=ao,qe)](){return this.checked?this.value:null}[Wt](){return String(this.checked)}formResetCallback(){this.checked=this.hasAttribute("checked")}formStateRestoreCallback(e){this.checked=e==="true"}[bt](){return new Xl(()=>this.selectionController?this.selectionController.controls:[this])}[gt](){return this.container}}l([u({type:Boolean})],nr.prototype,"checked",null);l([u({type:Boolean})],nr.prototype,"required",void 0);l([u()],nr.prototype,"value",void 0);l([U(".container")],nr.prototype,"container",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Vn=S`@layer{:host{display:inline-flex;height:var(--md-radio-icon-size, 20px);outline:none;position:relative;vertical-align:top;width:var(--md-radio-icon-size, 20px);-webkit-tap-highlight-color:rgba(0,0,0,0);cursor:pointer;--md-ripple-hover-color: var(--md-radio-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-radio-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-radio-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--md-ripple-pressed-opacity: var(--md-radio-pressed-state-layer-opacity, 0.12)}:host([disabled]){cursor:default}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--md-radio-icon-size, 20px))/2)}.container{display:flex;height:100%;place-content:center;place-items:center;width:100%}md-focus-ring{height:44px;inset:unset;width:44px}.checked{--md-ripple-hover-color: var(--md-radio-selected-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--md-ripple-hover-opacity: var(--md-radio-selected-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-radio-selected-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-opacity: var(--md-radio-selected-pressed-state-layer-opacity, 0.12)}.touch-target{height:48px;position:absolute;width:48px}:host([touch-target=none]) .touch-target{display:none}md-ripple{border-radius:50%;height:var(--md-radio-state-layer-size, 40px);inset:unset;width:var(--md-radio-state-layer-size, 40px)}.icon{fill:var(--md-radio-icon-color, var(--md-sys-color-on-surface-variant, #49454f));inset:0;position:absolute}.outer.circle{transition:fill 50ms linear}.inner.circle{opacity:0;transform-origin:center;transition:opacity 50ms linear}.checked .icon{fill:var(--md-radio-selected-icon-color, var(--md-sys-color-primary, #6750a4))}.checked .inner.circle{animation:inner-circle-grow 300ms cubic-bezier(0.05, 0.7, 0.1, 1);opacity:1}@keyframes inner-circle-grow{from{transform:scale(0)}to{transform:scale(1)}}:host([disabled]) .circle{animation-duration:0s;transition-duration:0s}:host(:hover) .icon{fill:var(--md-radio-hover-icon-color, var(--md-sys-color-on-surface, #1d1b20))}:host(:focus-within) .icon{fill:var(--md-radio-focus-icon-color, var(--md-sys-color-on-surface, #1d1b20))}:host(:active) .icon{fill:var(--md-radio-pressed-icon-color, var(--md-sys-color-on-surface, #1d1b20))}:host([disabled]) .icon{fill:var(--md-radio-disabled-unselected-icon-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-radio-disabled-unselected-icon-opacity, 0.38)}:host(:hover) .checked .icon{fill:var(--md-radio-selected-hover-icon-color, var(--md-sys-color-primary, #6750a4))}:host(:focus-within) .checked .icon{fill:var(--md-radio-selected-focus-icon-color, var(--md-sys-color-primary, #6750a4))}:host(:active) .checked .icon{fill:var(--md-radio-selected-pressed-icon-color, var(--md-sys-color-primary, #6750a4))}:host([disabled]) .checked .icon{fill:var(--md-radio-disabled-selected-icon-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-radio-disabled-selected-icon-opacity, 0.38)}}@layer hcm{@media(forced-colors: active){.icon{fill:CanvasText}:host([disabled]) .icon{fill:GrayText;opacity:1}}}
`;Vn.styleSheet;/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Xo=class extends nr{};Xo.styles=[Vn];Xo=l([E("md-radio")],Xo);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ar=Symbol("onReportValidity"),gr=Symbol("privateCleanupFormListeners"),yr=Symbol("privateDoNotReportInvalid"),xr=Symbol("privateIsSelfReportingValidity"),_r=Symbol("privateCallOnReportValidity");function Hn(o){var e,t,r;class a extends o{constructor(...n){super(...n),this[e]=new AbortController,this[t]=!1,this[r]=!1,this.addEventListener("invalid",s=>{this[yr]||!s.isTrusted||this.addEventListener("invalid",()=>{this[_r](s)},{once:!0})},{capture:!0})}checkValidity(){this[yr]=!0;const n=super.checkValidity();return this[yr]=!1,n}reportValidity(){this[xr]=!0;const n=super.reportValidity();return n&&this[_r](null),this[xr]=!1,n}[(e=gr,t=yr,r=xr,_r)](n){const s=n==null?void 0:n.defaultPrevented;s||(this[Ar](n),!(!s&&(n==null?void 0:n.defaultPrevented)))||(this[xr]||rd(this[ge].form,this))&&this.focus()}[Ar](n){throw new Error("Implement [onReportValidity]")}formAssociatedCallback(n){super.formAssociatedCallback&&super.formAssociatedCallback(n),this[gr].abort(),n&&(this[gr]=new AbortController,ed(this,n,()=>{this[_r](null)},this[gr].signal))}}return a}function ed(o,e,t,r){const a=td(e);let i=!1,n,s=!1;a.addEventListener("before",()=>{s=!0,n=new AbortController,i=!1,o.addEventListener("invalid",()=>{i=!0},{signal:n.signal})},{signal:r}),a.addEventListener("after",()=>{s=!1,n==null||n.abort(),!i&&t()},{signal:r}),e.addEventListener("submit",()=>{s||t()},{signal:r})}const io=new WeakMap;function td(o){if(!io.has(o)){const e=new EventTarget;io.set(o,e);for(const t of["reportValidity","requestSubmit"]){const r=o[t];o[t]=function(){e.dispatchEvent(new Event("before"));const a=Reflect.apply(r,this,arguments);return e.dispatchEvent(new Event("after")),a}}}return io.get(o)}function rd(o,e){if(!o)return!0;let t;for(const r of o.elements)if(r.matches(":invalid")){t=r;break}return t===e}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class od extends Mr{computeValidity(e){return this.selectControl||(this.selectControl=document.createElement("select")),wa(h`<option value=${e.value}></option>`,this.selectControl),this.selectControl.value=e.value,this.selectControl.required=e.required,{validity:this.selectControl.validity,validationMessage:this.selectControl.validationMessage}}equals(e,t){return e.value===t.value&&e.required===t.required}copy({value:e,required:t}){return{value:e,required:t}}}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function ad(o){const e=[];for(let t=0;t<o.length;t++){const r=o[t];r.selected&&e.push([r,t])}return e}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */var bi;const wr=Symbol("value"),id=ue(Hn(tr(it(at(O)))));class ee extends id{get value(){return this[wr]}set value(e){this.lastUserSetValue=e,this.select(e)}get options(){var e;return((e=this.menu)==null?void 0:e.items)??[]}get selectedIndex(){const[e,t]=(this.getSelectedOptions()??[])[0]??[];return t??-1}set selectedIndex(e){this.lastUserSetSelectedIndex=e,this.selectIndex(e)}get selectedOptions(){return(this.getSelectedOptions()??[]).map(([e])=>e)}get hasError(){return this.error||this.nativeError}constructor(){super(),this.quick=!1,this.required=!1,this.errorText="",this.label="",this.noAsterisk=!1,this.supportingText="",this.error=!1,this.menuPositioning="popover",this.clampMenuWidth=!1,this.typeaheadDelay=zn,this.hasLeadingIcon=!1,this.displayText="",this.menuAlign="start",this[bi]="",this.lastUserSetValue=null,this.lastUserSetSelectedIndex=null,this.lastSelectedOption=null,this.lastSelectedOptionRecords=[],this.nativeError=!1,this.nativeErrorText="",this.focused=!1,this.open=!1,this.defaultFocus=Me.NONE,this.prevOpen=this.open,this.selectWidth=0,this.addEventListener("focus",this.handleFocus.bind(this)),this.addEventListener("blur",this.handleBlur.bind(this))}select(e){const t=this.options.find(r=>r.value===e);t&&this.selectItem(t)}selectIndex(e){const t=this.options[e];t&&this.selectItem(t)}reset(){for(const e of this.options)e.selected=e.hasAttribute("selected");this.updateValueAndDisplayText(),this.nativeError=!1,this.nativeErrorText=""}showPicker(){this.open=!0}[(bi=wr,Ar)](e){var r;e==null||e.preventDefault();const t=this.getErrorText();this.nativeError=!!e,this.nativeErrorText=this.validationMessage,t===this.getErrorText()&&((r=this.field)==null||r.reannounceError())}update(e){if(this.hasUpdated||this.initUserSelection(),this.prevOpen!==this.open&&this.open){const t=this.getBoundingClientRect();this.selectWidth=t.width}this.prevOpen=this.open,super.update(e)}render(){return h`
      <span
        class="select ${Q(this.getRenderClasses())}"
        @focusout=${this.handleFocusout}>
        ${this.renderField()} ${this.renderMenu()}
      </span>
    `}async firstUpdated(e){var t;await((t=this.menu)==null?void 0:t.updateComplete),this.lastSelectedOptionRecords.length||this.initUserSelection(),!this.lastSelectedOptionRecords.length&&!this.options.length&&setTimeout(()=>{this.updateValueAndDisplayText()}),super.firstUpdated(e)}getRenderClasses(){return{disabled:this.disabled,error:this.error,open:this.open}}renderField(){const e=this.ariaLabel||this.label;return ar`
      <${this.fieldTag}
          aria-haspopup="listbox"
          role="combobox"
          part="field"
          id="field"
          tabindex=${this.disabled?"-1":"0"}
          aria-label=${e||b}
          aria-describedby="description"
          aria-expanded=${this.open?"true":"false"}
          aria-controls="listbox"
          class="field"
          label=${this.label}
          ?no-asterisk=${this.noAsterisk}
          .focused=${this.focused||this.open}
          .populated=${!!this.displayText}
          .disabled=${this.disabled}
          .required=${this.required}
          .error=${this.hasError}
          ?has-start=${this.hasLeadingIcon}
          has-end
          supporting-text=${this.supportingText}
          error-text=${this.getErrorText()}
          @keydown=${this.handleKeydown}
          @click=${this.handleClick}>
         ${this.renderFieldContent()}
         <div id="description" slot="aria-describedby"></div>
      </${this.fieldTag}>`}renderFieldContent(){return[this.renderLeadingIcon(),this.renderLabel(),this.renderTrailingIcon()]}renderLeadingIcon(){return h`
      <span class="icon leading" slot="start">
        <slot name="leading-icon" @slotchange=${this.handleIconChange}></slot>
      </span>
    `}renderTrailingIcon(){return h`
      <span class="icon trailing" slot="end">
        <slot name="trailing-icon" @slotchange=${this.handleIconChange}>
          <svg height="5" viewBox="7 10 10 5" focusable="false">
            <polygon
              class="down"
              stroke="none"
              fill-rule="evenodd"
              points="7 10 12 15 17 10"></polygon>
            <polygon
              class="up"
              stroke="none"
              fill-rule="evenodd"
              points="7 15 12 10 17 15"></polygon>
          </svg>
        </slot>
      </span>
    `}renderLabel(){return h`<div id="label">${this.displayText||h`&nbsp;`}</div>`}renderMenu(){const e=this.label||this.ariaLabel;return h`<div class="menu-wrapper">
      <md-menu
        id="listbox"
        .defaultFocus=${this.defaultFocus}
        role="listbox"
        tabindex="-1"
        aria-label=${e||b}
        stay-open-on-focusout
        part="menu"
        exportparts="focus-ring: menu-focus-ring"
        anchor="field"
        style=${yt({"--__menu-min-width":`${this.selectWidth}px`,"--__menu-max-width":this.clampMenuWidth?`${this.selectWidth}px`:void 0})}
        no-navigation-wrap
        .open=${this.open}
        .quick=${this.quick}
        .positioning=${this.menuPositioning}
        .typeaheadDelay=${this.typeaheadDelay}
        .anchorCorner=${this.menuAlign==="start"?"end-start":"end-end"}
        .menuCorner=${this.menuAlign==="start"?"start-start":"start-end"}
        @opening=${this.handleOpening}
        @opened=${this.redispatchEvent}
        @closing=${this.redispatchEvent}
        @closed=${this.handleClosed}
        @close-menu=${this.handleCloseMenu}
        @request-selection=${this.handleRequestSelection}
        @request-deselection=${this.handleRequestDeselection}>
        ${this.renderMenuContent()}
      </md-menu>
    </div>`}renderMenuContent(){return h`<slot></slot>`}handleKeydown(e){var i,n;if(this.open||this.disabled||!this.menu)return;const t=this.menu.typeaheadController,r=e.code==="Space"||e.code==="ArrowDown"||e.code==="ArrowUp"||e.code==="End"||e.code==="Home"||e.code==="Enter";if(!t.isTypingAhead&&r){switch(e.preventDefault(),this.open=!0,e.code){case"Space":case"ArrowDown":case"Enter":this.defaultFocus=Me.NONE;break;case"End":this.defaultFocus=Me.LAST_ITEM;break;case"ArrowUp":case"Home":this.defaultFocus=Me.FIRST_ITEM;break}return}if(e.key.length===1){t.onKeydown(e),e.preventDefault();const{lastActiveRecord:s}=t;if(!s)return;(n=(i=this.labelEl)==null?void 0:i.setAttribute)==null||n.call(i,"aria-live","polite"),this.selectItem(s[Te.ITEM])&&this.dispatchInteractionEvents()}}handleClick(){this.open=!this.open}handleFocus(){this.focused=!0}handleBlur(){this.focused=!1}handleFocusout(e){e.relatedTarget&&qo(e.relatedTarget,this)||(this.open=!1)}getSelectedOptions(){if(!this.menu)return this.lastSelectedOptionRecords=[],null;const e=this.menu.items;return this.lastSelectedOptionRecords=ad(e),this.lastSelectedOptionRecords}async getUpdateComplete(){var e;return await((e=this.menu)==null?void 0:e.updateComplete),super.getUpdateComplete()}updateValueAndDisplayText(){const e=this.getSelectedOptions()??[];let t=!1;if(e.length){const[r]=e[0];t=this.lastSelectedOption!==r,this.lastSelectedOption=r,this[wr]=r.value,this.displayText=r.displayText}else t=this.lastSelectedOption!==null,this.lastSelectedOption=null,this[wr]="",this.displayText="";return t}async handleOpening(e){var i,n,s;if((n=(i=this.labelEl)==null?void 0:i.removeAttribute)==null||n.call(i,"aria-live"),this.redispatchEvent(e),this.defaultFocus!==Me.NONE)return;const t=this.menu.items,r=(s=$t(t))==null?void 0:s.item;let[a]=this.lastSelectedOptionRecords[0]??[null];r&&r!==a&&(r.tabIndex=-1),a=a??t[0],a&&(a.tabIndex=0,a.focus())}redispatchEvent(e){rt(this,e)}handleClosed(e){this.open=!1,this.redispatchEvent(e)}handleCloseMenu(e){const t=e.detail.reason,r=e.detail.itemPath[0];this.open=!1;let a=!1;t.kind==="click-selection"?a=this.selectItem(r):t.kind==="keydown"&&Hl(t.key)?a=this.selectItem(r):(r.tabIndex=-1,r.blur()),a&&this.dispatchInteractionEvents()}selectItem(e){return(this.getSelectedOptions()??[]).forEach(([r])=>{e!==r&&(r.selected=!1,r.tabIndex=-1)}),e.selected=!0,e.tabIndex=0,this.updateValueAndDisplayText()}handleRequestSelection(e){const t=e.target;this.lastSelectedOptionRecords.some(([r])=>r===t)||this.selectItem(t)}handleRequestDeselection(e){const t=e.target;this.lastSelectedOptionRecords.some(([r])=>r===t)&&this.updateValueAndDisplayText()}initUserSelection(){this.lastUserSetValue&&!this.lastSelectedOptionRecords.length?this.select(this.lastUserSetValue):this.lastUserSetSelectedIndex!==null&&!this.lastSelectedOptionRecords.length?this.selectIndex(this.lastUserSetSelectedIndex):this.updateValueAndDisplayText()}handleIconChange(){this.hasLeadingIcon=this.leadingIcons.length>0}dispatchInteractionEvents(){this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0})),this.dispatchEvent(new Event("change",{bubbles:!0}))}getErrorText(){return this.error?this.errorText:this.nativeErrorText}[qe](){return this.value}formResetCallback(){this.reset()}formStateRestoreCallback(e){this.value=e}click(){var e;(e=this.field)==null||e.click()}[bt](){return new od(()=>this)}[gt](){return this.field}}ee.shadowRootOptions={...O.shadowRootOptions,delegatesFocus:!0};l([u({type:Boolean})],ee.prototype,"quick",void 0);l([u({type:Boolean})],ee.prototype,"required",void 0);l([u({type:String,attribute:"error-text"})],ee.prototype,"errorText",void 0);l([u()],ee.prototype,"label",void 0);l([u({type:Boolean,attribute:"no-asterisk"})],ee.prototype,"noAsterisk",void 0);l([u({type:String,attribute:"supporting-text"})],ee.prototype,"supportingText",void 0);l([u({type:Boolean,reflect:!0})],ee.prototype,"error",void 0);l([u({attribute:"menu-positioning"})],ee.prototype,"menuPositioning",void 0);l([u({type:Boolean,attribute:"clamp-menu-width"})],ee.prototype,"clampMenuWidth",void 0);l([u({type:Number,attribute:"typeahead-delay"})],ee.prototype,"typeaheadDelay",void 0);l([u({type:Boolean,attribute:"has-leading-icon"})],ee.prototype,"hasLeadingIcon",void 0);l([u({attribute:"display-text"})],ee.prototype,"displayText",void 0);l([u({attribute:"menu-align"})],ee.prototype,"menuAlign",void 0);l([u()],ee.prototype,"value",null);l([u({type:Number,attribute:"selected-index"})],ee.prototype,"selectedIndex",null);l([T()],ee.prototype,"nativeError",void 0);l([T()],ee.prototype,"nativeErrorText",void 0);l([T()],ee.prototype,"focused",void 0);l([T()],ee.prototype,"open",void 0);l([T()],ee.prototype,"defaultFocus",void 0);l([U(".field")],ee.prototype,"field",void 0);l([U("md-menu")],ee.prototype,"menu",void 0);l([U("#label")],ee.prototype,"labelEl",void 0);l([ce({slot:"leading-icon",flatten:!0})],ee.prototype,"leadingIcons",void 0);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class nd extends ee{constructor(){super(...arguments),this.fieldTag=ye`md-filled-field`}}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Un=S`:host{--_text-field-active-indicator-color: var(--md-filled-select-text-field-active-indicator-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-active-indicator-height: var(--md-filled-select-text-field-active-indicator-height, 1px);--_text-field-container-color: var(--md-filled-select-text-field-container-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_text-field-disabled-active-indicator-color: var(--md-filled-select-text-field-disabled-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-active-indicator-height: var(--md-filled-select-text-field-disabled-active-indicator-height, 1px);--_text-field-disabled-active-indicator-opacity: var(--md-filled-select-text-field-disabled-active-indicator-opacity, 0.38);--_text-field-disabled-container-color: var(--md-filled-select-text-field-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-container-opacity: var(--md-filled-select-text-field-disabled-container-opacity, 0.04);--_text-field-disabled-input-text-color: var(--md-filled-select-text-field-disabled-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-input-text-opacity: var(--md-filled-select-text-field-disabled-input-text-opacity, 0.38);--_text-field-disabled-label-text-color: var(--md-filled-select-text-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-label-text-opacity: var(--md-filled-select-text-field-disabled-label-text-opacity, 0.38);--_text-field-disabled-leading-icon-color: var(--md-filled-select-text-field-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-leading-icon-opacity: var(--md-filled-select-text-field-disabled-leading-icon-opacity, 0.38);--_text-field-disabled-supporting-text-color: var(--md-filled-select-text-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-supporting-text-opacity: var(--md-filled-select-text-field-disabled-supporting-text-opacity, 0.38);--_text-field-disabled-trailing-icon-color: var(--md-filled-select-text-field-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-trailing-icon-opacity: var(--md-filled-select-text-field-disabled-trailing-icon-opacity, 0.38);--_text-field-error-active-indicator-color: var(--md-filled-select-text-field-error-active-indicator-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-active-indicator-color: var(--md-filled-select-text-field-error-focus-active-indicator-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-input-text-color: var(--md-filled-select-text-field-error-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-focus-label-text-color: var(--md-filled-select-text-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-leading-icon-color: var(--md-filled-select-text-field-error-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-focus-supporting-text-color: var(--md-filled-select-text-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-trailing-icon-color: var(--md-filled-select-text-field-error-focus-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_text-field-error-hover-active-indicator-color: var(--md-filled-select-text-field-error-hover-active-indicator-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-hover-input-text-color: var(--md-filled-select-text-field-error-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-hover-label-text-color: var(--md-filled-select-text-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-hover-leading-icon-color: var(--md-filled-select-text-field-error-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-hover-state-layer-color: var(--md-filled-select-text-field-error-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-hover-state-layer-opacity: var(--md-filled-select-text-field-error-hover-state-layer-opacity, 0.08);--_text-field-error-hover-supporting-text-color: var(--md-filled-select-text-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-hover-trailing-icon-color: var(--md-filled-select-text-field-error-hover-trailing-icon-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-input-text-color: var(--md-filled-select-text-field-error-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-label-text-color: var(--md-filled-select-text-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-leading-icon-color: var(--md-filled-select-text-field-error-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-supporting-text-color: var(--md-filled-select-text-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-trailing-icon-color: var(--md-filled-select-text-field-error-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_text-field-focus-active-indicator-color: var(--md-filled-select-text-field-focus-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_text-field-focus-active-indicator-height: var(--md-filled-select-text-field-focus-active-indicator-height, 3px);--_text-field-focus-input-text-color: var(--md-filled-select-text-field-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-focus-label-text-color: var(--md-filled-select-text-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_text-field-focus-leading-icon-color: var(--md-filled-select-text-field-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-focus-supporting-text-color: var(--md-filled-select-text-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-focus-trailing-icon-color: var(--md-filled-select-text-field-focus-trailing-icon-color, var(--md-sys-color-primary, #6750a4));--_text-field-hover-active-indicator-color: var(--md-filled-select-text-field-hover-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-active-indicator-height: var(--md-filled-select-text-field-hover-active-indicator-height, 1px);--_text-field-hover-input-text-color: var(--md-filled-select-text-field-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-label-text-color: var(--md-filled-select-text-field-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-leading-icon-color: var(--md-filled-select-text-field-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-hover-state-layer-color: var(--md-filled-select-text-field-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-state-layer-opacity: var(--md-filled-select-text-field-hover-state-layer-opacity, 0.08);--_text-field-hover-supporting-text-color: var(--md-filled-select-text-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-hover-trailing-icon-color: var(--md-filled-select-text-field-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-input-text-color: var(--md-filled-select-text-field-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-input-text-font: var(--md-filled-select-text-field-input-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-input-text-line-height: var(--md-filled-select-text-field-input-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_text-field-input-text-size: var(--md-filled-select-text-field-input-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_text-field-input-text-weight: var(--md-filled-select-text-field-input-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-label-text-color: var(--md-filled-select-text-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-label-text-font: var(--md-filled-select-text-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-label-text-line-height: var(--md-filled-select-text-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_text-field-label-text-populated-line-height: var(--md-filled-select-text-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_text-field-label-text-populated-size: var(--md-filled-select-text-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_text-field-label-text-size: var(--md-filled-select-text-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_text-field-label-text-weight: var(--md-filled-select-text-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-leading-icon-color: var(--md-filled-select-text-field-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-leading-icon-size: var(--md-filled-select-text-field-leading-icon-size, 24px);--_text-field-supporting-text-color: var(--md-filled-select-text-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-supporting-text-font: var(--md-filled-select-text-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-supporting-text-line-height: var(--md-filled-select-text-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_text-field-supporting-text-size: var(--md-filled-select-text-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_text-field-supporting-text-weight: var(--md-filled-select-text-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-trailing-icon-color: var(--md-filled-select-text-field-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-trailing-icon-size: var(--md-filled-select-text-field-trailing-icon-size, 24px);--_text-field-container-shape-start-start: var(--md-filled-select-text-field-container-shape-start-start, var(--md-filled-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_text-field-container-shape-start-end: var(--md-filled-select-text-field-container-shape-start-end, var(--md-filled-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_text-field-container-shape-end-end: var(--md-filled-select-text-field-container-shape-end-end, var(--md-filled-select-text-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--_text-field-container-shape-end-start: var(--md-filled-select-text-field-container-shape-end-start, var(--md-filled-select-text-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--md-filled-field-active-indicator-color: var(--_text-field-active-indicator-color);--md-filled-field-active-indicator-height: var(--_text-field-active-indicator-height);--md-filled-field-container-color: var(--_text-field-container-color);--md-filled-field-container-shape-end-end: var(--_text-field-container-shape-end-end);--md-filled-field-container-shape-end-start: var(--_text-field-container-shape-end-start);--md-filled-field-container-shape-start-end: var(--_text-field-container-shape-start-end);--md-filled-field-container-shape-start-start: var(--_text-field-container-shape-start-start);--md-filled-field-content-color: var(--_text-field-input-text-color);--md-filled-field-content-font: var(--_text-field-input-text-font);--md-filled-field-content-line-height: var(--_text-field-input-text-line-height);--md-filled-field-content-size: var(--_text-field-input-text-size);--md-filled-field-content-weight: var(--_text-field-input-text-weight);--md-filled-field-disabled-active-indicator-color: var(--_text-field-disabled-active-indicator-color);--md-filled-field-disabled-active-indicator-height: var(--_text-field-disabled-active-indicator-height);--md-filled-field-disabled-active-indicator-opacity: var(--_text-field-disabled-active-indicator-opacity);--md-filled-field-disabled-container-color: var(--_text-field-disabled-container-color);--md-filled-field-disabled-container-opacity: var(--_text-field-disabled-container-opacity);--md-filled-field-disabled-content-color: var(--_text-field-disabled-input-text-color);--md-filled-field-disabled-content-opacity: var(--_text-field-disabled-input-text-opacity);--md-filled-field-disabled-label-text-color: var(--_text-field-disabled-label-text-color);--md-filled-field-disabled-label-text-opacity: var(--_text-field-disabled-label-text-opacity);--md-filled-field-disabled-leading-content-color: var(--_text-field-disabled-leading-icon-color);--md-filled-field-disabled-leading-content-opacity: var(--_text-field-disabled-leading-icon-opacity);--md-filled-field-disabled-supporting-text-color: var(--_text-field-disabled-supporting-text-color);--md-filled-field-disabled-supporting-text-opacity: var(--_text-field-disabled-supporting-text-opacity);--md-filled-field-disabled-trailing-content-color: var(--_text-field-disabled-trailing-icon-color);--md-filled-field-disabled-trailing-content-opacity: var(--_text-field-disabled-trailing-icon-opacity);--md-filled-field-error-active-indicator-color: var(--_text-field-error-active-indicator-color);--md-filled-field-error-content-color: var(--_text-field-error-input-text-color);--md-filled-field-error-focus-active-indicator-color: var(--_text-field-error-focus-active-indicator-color);--md-filled-field-error-focus-content-color: var(--_text-field-error-focus-input-text-color);--md-filled-field-error-focus-label-text-color: var(--_text-field-error-focus-label-text-color);--md-filled-field-error-focus-leading-content-color: var(--_text-field-error-focus-leading-icon-color);--md-filled-field-error-focus-supporting-text-color: var(--_text-field-error-focus-supporting-text-color);--md-filled-field-error-focus-trailing-content-color: var(--_text-field-error-focus-trailing-icon-color);--md-filled-field-error-hover-active-indicator-color: var(--_text-field-error-hover-active-indicator-color);--md-filled-field-error-hover-content-color: var(--_text-field-error-hover-input-text-color);--md-filled-field-error-hover-label-text-color: var(--_text-field-error-hover-label-text-color);--md-filled-field-error-hover-leading-content-color: var(--_text-field-error-hover-leading-icon-color);--md-filled-field-error-hover-state-layer-color: var(--_text-field-error-hover-state-layer-color);--md-filled-field-error-hover-state-layer-opacity: var(--_text-field-error-hover-state-layer-opacity);--md-filled-field-error-hover-supporting-text-color: var(--_text-field-error-hover-supporting-text-color);--md-filled-field-error-hover-trailing-content-color: var(--_text-field-error-hover-trailing-icon-color);--md-filled-field-error-label-text-color: var(--_text-field-error-label-text-color);--md-filled-field-error-leading-content-color: var(--_text-field-error-leading-icon-color);--md-filled-field-error-supporting-text-color: var(--_text-field-error-supporting-text-color);--md-filled-field-error-trailing-content-color: var(--_text-field-error-trailing-icon-color);--md-filled-field-focus-active-indicator-color: var(--_text-field-focus-active-indicator-color);--md-filled-field-focus-active-indicator-height: var(--_text-field-focus-active-indicator-height);--md-filled-field-focus-content-color: var(--_text-field-focus-input-text-color);--md-filled-field-focus-label-text-color: var(--_text-field-focus-label-text-color);--md-filled-field-focus-leading-content-color: var(--_text-field-focus-leading-icon-color);--md-filled-field-focus-supporting-text-color: var(--_text-field-focus-supporting-text-color);--md-filled-field-focus-trailing-content-color: var(--_text-field-focus-trailing-icon-color);--md-filled-field-hover-active-indicator-color: var(--_text-field-hover-active-indicator-color);--md-filled-field-hover-active-indicator-height: var(--_text-field-hover-active-indicator-height);--md-filled-field-hover-content-color: var(--_text-field-hover-input-text-color);--md-filled-field-hover-label-text-color: var(--_text-field-hover-label-text-color);--md-filled-field-hover-leading-content-color: var(--_text-field-hover-leading-icon-color);--md-filled-field-hover-state-layer-color: var(--_text-field-hover-state-layer-color);--md-filled-field-hover-state-layer-opacity: var(--_text-field-hover-state-layer-opacity);--md-filled-field-hover-supporting-text-color: var(--_text-field-hover-supporting-text-color);--md-filled-field-hover-trailing-content-color: var(--_text-field-hover-trailing-icon-color);--md-filled-field-label-text-color: var(--_text-field-label-text-color);--md-filled-field-label-text-font: var(--_text-field-label-text-font);--md-filled-field-label-text-line-height: var(--_text-field-label-text-line-height);--md-filled-field-label-text-populated-line-height: var(--_text-field-label-text-populated-line-height);--md-filled-field-label-text-populated-size: var(--_text-field-label-text-populated-size);--md-filled-field-label-text-size: var(--_text-field-label-text-size);--md-filled-field-label-text-weight: var(--_text-field-label-text-weight);--md-filled-field-leading-content-color: var(--_text-field-leading-icon-color);--md-filled-field-supporting-text-color: var(--_text-field-supporting-text-color);--md-filled-field-supporting-text-font: var(--_text-field-supporting-text-font);--md-filled-field-supporting-text-line-height: var(--_text-field-supporting-text-line-height);--md-filled-field-supporting-text-size: var(--_text-field-supporting-text-size);--md-filled-field-supporting-text-weight: var(--_text-field-supporting-text-weight);--md-filled-field-trailing-content-color: var(--_text-field-trailing-icon-color)}[has-start] .icon.leading{font-size:var(--_text-field-leading-icon-size);height:var(--_text-field-leading-icon-size);width:var(--_text-field-leading-icon-size)}.icon.trailing{font-size:var(--_text-field-trailing-icon-size);height:var(--_text-field-trailing-icon-size);width:var(--_text-field-trailing-icon-size)}
`;Un.styleSheet;/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const La=S`:host{color:unset;min-width:210px;display:flex}.field{cursor:default;outline:none}.select{position:relative;flex-direction:column}.icon.trailing svg,.icon ::slotted(*){fill:currentColor}.icon ::slotted(*){width:inherit;height:inherit;font-size:inherit}.icon slot{display:flex;height:100%;width:100%;align-items:center;justify-content:center}.icon.trailing :is(.up,.down){opacity:0;transition:opacity 75ms linear 75ms}.select:not(.open) .down,.select.open .up{opacity:1}.field,.select,md-menu{min-width:inherit;width:inherit;max-width:inherit;display:flex}md-menu{min-width:var(--__menu-min-width);max-width:var(--__menu-max-width, inherit)}.menu-wrapper{width:0px;height:0px;max-width:inherit}md-menu ::slotted(:not[disabled]){cursor:pointer}.field,.select{width:100%}:host{display:inline-flex}:host([disabled]){pointer-events:none}
`;La.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Zo=class extends nd{};Zo.styles=[La,Un];Zo=l([E("md-filled-select")],Zo);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class sd extends ee{constructor(){super(...arguments),this.fieldTag=ye`md-outlined-field`}}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const qn=S`:host{--_text-field-disabled-input-text-color: var(--md-outlined-select-text-field-disabled-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-input-text-opacity: var(--md-outlined-select-text-field-disabled-input-text-opacity, 0.38);--_text-field-disabled-label-text-color: var(--md-outlined-select-text-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-label-text-opacity: var(--md-outlined-select-text-field-disabled-label-text-opacity, 0.38);--_text-field-disabled-leading-icon-color: var(--md-outlined-select-text-field-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-leading-icon-opacity: var(--md-outlined-select-text-field-disabled-leading-icon-opacity, 0.38);--_text-field-disabled-outline-color: var(--md-outlined-select-text-field-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-outline-opacity: var(--md-outlined-select-text-field-disabled-outline-opacity, 0.12);--_text-field-disabled-outline-width: var(--md-outlined-select-text-field-disabled-outline-width, 1px);--_text-field-disabled-supporting-text-color: var(--md-outlined-select-text-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-supporting-text-opacity: var(--md-outlined-select-text-field-disabled-supporting-text-opacity, 0.38);--_text-field-disabled-trailing-icon-color: var(--md-outlined-select-text-field-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-trailing-icon-opacity: var(--md-outlined-select-text-field-disabled-trailing-icon-opacity, 0.38);--_text-field-error-focus-input-text-color: var(--md-outlined-select-text-field-error-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-focus-label-text-color: var(--md-outlined-select-text-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-leading-icon-color: var(--md-outlined-select-text-field-error-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-focus-outline-color: var(--md-outlined-select-text-field-error-focus-outline-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-supporting-text-color: var(--md-outlined-select-text-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-trailing-icon-color: var(--md-outlined-select-text-field-error-focus-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_text-field-error-hover-input-text-color: var(--md-outlined-select-text-field-error-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-hover-label-text-color: var(--md-outlined-select-text-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-hover-leading-icon-color: var(--md-outlined-select-text-field-error-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-hover-outline-color: var(--md-outlined-select-text-field-error-hover-outline-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-hover-supporting-text-color: var(--md-outlined-select-text-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-hover-trailing-icon-color: var(--md-outlined-select-text-field-error-hover-trailing-icon-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-input-text-color: var(--md-outlined-select-text-field-error-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-label-text-color: var(--md-outlined-select-text-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-leading-icon-color: var(--md-outlined-select-text-field-error-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-outline-color: var(--md-outlined-select-text-field-error-outline-color, var(--md-sys-color-error, #b3261e));--_text-field-error-supporting-text-color: var(--md-outlined-select-text-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-trailing-icon-color: var(--md-outlined-select-text-field-error-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_text-field-focus-input-text-color: var(--md-outlined-select-text-field-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-focus-label-text-color: var(--md-outlined-select-text-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_text-field-focus-leading-icon-color: var(--md-outlined-select-text-field-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-focus-outline-color: var(--md-outlined-select-text-field-focus-outline-color, var(--md-sys-color-primary, #6750a4));--_text-field-focus-outline-width: var(--md-outlined-select-text-field-focus-outline-width, 3px);--_text-field-focus-supporting-text-color: var(--md-outlined-select-text-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-focus-trailing-icon-color: var(--md-outlined-select-text-field-focus-trailing-icon-color, var(--md-sys-color-primary, #6750a4));--_text-field-hover-input-text-color: var(--md-outlined-select-text-field-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-label-text-color: var(--md-outlined-select-text-field-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-leading-icon-color: var(--md-outlined-select-text-field-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-hover-outline-color: var(--md-outlined-select-text-field-hover-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-outline-width: var(--md-outlined-select-text-field-hover-outline-width, 1px);--_text-field-hover-supporting-text-color: var(--md-outlined-select-text-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-hover-trailing-icon-color: var(--md-outlined-select-text-field-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-input-text-color: var(--md-outlined-select-text-field-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-input-text-font: var(--md-outlined-select-text-field-input-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-input-text-line-height: var(--md-outlined-select-text-field-input-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_text-field-input-text-size: var(--md-outlined-select-text-field-input-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_text-field-input-text-weight: var(--md-outlined-select-text-field-input-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-label-text-color: var(--md-outlined-select-text-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-label-text-font: var(--md-outlined-select-text-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-label-text-line-height: var(--md-outlined-select-text-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_text-field-label-text-populated-line-height: var(--md-outlined-select-text-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_text-field-label-text-populated-size: var(--md-outlined-select-text-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_text-field-label-text-size: var(--md-outlined-select-text-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_text-field-label-text-weight: var(--md-outlined-select-text-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-leading-icon-color: var(--md-outlined-select-text-field-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-leading-icon-size: var(--md-outlined-select-text-field-leading-icon-size, 24px);--_text-field-outline-color: var(--md-outlined-select-text-field-outline-color, var(--md-sys-color-outline, #79747e));--_text-field-outline-width: var(--md-outlined-select-text-field-outline-width, 1px);--_text-field-supporting-text-color: var(--md-outlined-select-text-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-supporting-text-font: var(--md-outlined-select-text-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-supporting-text-line-height: var(--md-outlined-select-text-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_text-field-supporting-text-size: var(--md-outlined-select-text-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_text-field-supporting-text-weight: var(--md-outlined-select-text-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-trailing-icon-color: var(--md-outlined-select-text-field-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-trailing-icon-size: var(--md-outlined-select-text-field-trailing-icon-size, 24px);--_text-field-container-shape-start-start: var(--md-outlined-select-text-field-container-shape-start-start, var(--md-outlined-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_text-field-container-shape-start-end: var(--md-outlined-select-text-field-container-shape-start-end, var(--md-outlined-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_text-field-container-shape-end-end: var(--md-outlined-select-text-field-container-shape-end-end, var(--md-outlined-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_text-field-container-shape-end-start: var(--md-outlined-select-text-field-container-shape-end-start, var(--md-outlined-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--md-outlined-field-container-shape-end-end: var(--_text-field-container-shape-end-end);--md-outlined-field-container-shape-end-start: var(--_text-field-container-shape-end-start);--md-outlined-field-container-shape-start-end: var(--_text-field-container-shape-start-end);--md-outlined-field-container-shape-start-start: var(--_text-field-container-shape-start-start);--md-outlined-field-content-color: var(--_text-field-input-text-color);--md-outlined-field-content-font: var(--_text-field-input-text-font);--md-outlined-field-content-line-height: var(--_text-field-input-text-line-height);--md-outlined-field-content-size: var(--_text-field-input-text-size);--md-outlined-field-content-weight: var(--_text-field-input-text-weight);--md-outlined-field-disabled-content-color: var(--_text-field-disabled-input-text-color);--md-outlined-field-disabled-content-opacity: var(--_text-field-disabled-input-text-opacity);--md-outlined-field-disabled-label-text-color: var(--_text-field-disabled-label-text-color);--md-outlined-field-disabled-label-text-opacity: var(--_text-field-disabled-label-text-opacity);--md-outlined-field-disabled-leading-content-color: var(--_text-field-disabled-leading-icon-color);--md-outlined-field-disabled-leading-content-opacity: var(--_text-field-disabled-leading-icon-opacity);--md-outlined-field-disabled-outline-color: var(--_text-field-disabled-outline-color);--md-outlined-field-disabled-outline-opacity: var(--_text-field-disabled-outline-opacity);--md-outlined-field-disabled-outline-width: var(--_text-field-disabled-outline-width);--md-outlined-field-disabled-supporting-text-color: var(--_text-field-disabled-supporting-text-color);--md-outlined-field-disabled-supporting-text-opacity: var(--_text-field-disabled-supporting-text-opacity);--md-outlined-field-disabled-trailing-content-color: var(--_text-field-disabled-trailing-icon-color);--md-outlined-field-disabled-trailing-content-opacity: var(--_text-field-disabled-trailing-icon-opacity);--md-outlined-field-error-content-color: var(--_text-field-error-input-text-color);--md-outlined-field-error-focus-content-color: var(--_text-field-error-focus-input-text-color);--md-outlined-field-error-focus-label-text-color: var(--_text-field-error-focus-label-text-color);--md-outlined-field-error-focus-leading-content-color: var(--_text-field-error-focus-leading-icon-color);--md-outlined-field-error-focus-outline-color: var(--_text-field-error-focus-outline-color);--md-outlined-field-error-focus-supporting-text-color: var(--_text-field-error-focus-supporting-text-color);--md-outlined-field-error-focus-trailing-content-color: var(--_text-field-error-focus-trailing-icon-color);--md-outlined-field-error-hover-content-color: var(--_text-field-error-hover-input-text-color);--md-outlined-field-error-hover-label-text-color: var(--_text-field-error-hover-label-text-color);--md-outlined-field-error-hover-leading-content-color: var(--_text-field-error-hover-leading-icon-color);--md-outlined-field-error-hover-outline-color: var(--_text-field-error-hover-outline-color);--md-outlined-field-error-hover-supporting-text-color: var(--_text-field-error-hover-supporting-text-color);--md-outlined-field-error-hover-trailing-content-color: var(--_text-field-error-hover-trailing-icon-color);--md-outlined-field-error-label-text-color: var(--_text-field-error-label-text-color);--md-outlined-field-error-leading-content-color: var(--_text-field-error-leading-icon-color);--md-outlined-field-error-outline-color: var(--_text-field-error-outline-color);--md-outlined-field-error-supporting-text-color: var(--_text-field-error-supporting-text-color);--md-outlined-field-error-trailing-content-color: var(--_text-field-error-trailing-icon-color);--md-outlined-field-focus-content-color: var(--_text-field-focus-input-text-color);--md-outlined-field-focus-label-text-color: var(--_text-field-focus-label-text-color);--md-outlined-field-focus-leading-content-color: var(--_text-field-focus-leading-icon-color);--md-outlined-field-focus-outline-color: var(--_text-field-focus-outline-color);--md-outlined-field-focus-outline-width: var(--_text-field-focus-outline-width);--md-outlined-field-focus-supporting-text-color: var(--_text-field-focus-supporting-text-color);--md-outlined-field-focus-trailing-content-color: var(--_text-field-focus-trailing-icon-color);--md-outlined-field-hover-content-color: var(--_text-field-hover-input-text-color);--md-outlined-field-hover-label-text-color: var(--_text-field-hover-label-text-color);--md-outlined-field-hover-leading-content-color: var(--_text-field-hover-leading-icon-color);--md-outlined-field-hover-outline-color: var(--_text-field-hover-outline-color);--md-outlined-field-hover-outline-width: var(--_text-field-hover-outline-width);--md-outlined-field-hover-supporting-text-color: var(--_text-field-hover-supporting-text-color);--md-outlined-field-hover-trailing-content-color: var(--_text-field-hover-trailing-icon-color);--md-outlined-field-label-text-color: var(--_text-field-label-text-color);--md-outlined-field-label-text-font: var(--_text-field-label-text-font);--md-outlined-field-label-text-line-height: var(--_text-field-label-text-line-height);--md-outlined-field-label-text-populated-line-height: var(--_text-field-label-text-populated-line-height);--md-outlined-field-label-text-populated-size: var(--_text-field-label-text-populated-size);--md-outlined-field-label-text-size: var(--_text-field-label-text-size);--md-outlined-field-label-text-weight: var(--_text-field-label-text-weight);--md-outlined-field-leading-content-color: var(--_text-field-leading-icon-color);--md-outlined-field-outline-color: var(--_text-field-outline-color);--md-outlined-field-outline-width: var(--_text-field-outline-width);--md-outlined-field-supporting-text-color: var(--_text-field-supporting-text-color);--md-outlined-field-supporting-text-font: var(--_text-field-supporting-text-font);--md-outlined-field-supporting-text-line-height: var(--_text-field-supporting-text-line-height);--md-outlined-field-supporting-text-size: var(--_text-field-supporting-text-size);--md-outlined-field-supporting-text-weight: var(--_text-field-supporting-text-weight);--md-outlined-field-trailing-content-color: var(--_text-field-trailing-icon-color)}[has-start] .icon.leading{font-size:var(--_text-field-leading-icon-size);height:var(--_text-field-leading-icon-size);width:var(--_text-field-leading-icon-size)}.icon.trailing{font-size:var(--_text-field-trailing-icon-size);height:var(--_text-field-trailing-icon-size);width:var(--_text-field-trailing-icon-size)}
`;qn.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Qo=class extends sd{};Qo.styles=[La,qn];Qo=l([E("md-outlined-select")],Qo);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function ld(){return new Event("request-selection",{bubbles:!0,composed:!0})}function dd(){return new Event("request-deselection",{bubbles:!0,composed:!0})}class cd{get role(){return this.menuItemController.role}get typeaheadText(){return this.menuItemController.typeaheadText}setTypeaheadText(e){this.menuItemController.setTypeaheadText(e)}get displayText(){return this.internalDisplayText!==null?this.internalDisplayText:this.menuItemController.typeaheadText}setDisplayText(e){this.internalDisplayText=e}constructor(e,t){this.host=e,this.internalDisplayText=null,this.firstUpdate=!0,this.onClick=()=>{this.menuItemController.onClick()},this.onKeydown=r=>{this.menuItemController.onKeydown(r)},this.lastSelected=this.host.selected,this.menuItemController=new Mn(e,t),e.addController(this)}hostUpdate(){this.lastSelected!==this.host.selected&&(this.host.ariaSelected=this.host.selected?"true":"false")}hostUpdated(){this.lastSelected!==this.host.selected&&!this.firstUpdate&&(this.host.selected?this.host.dispatchEvent(ld()):this.host.dispatchEvent(dd())),this.lastSelected=this.host.selected,this.firstUpdate=!1}}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const hd=ue(O);class Pe extends hd{constructor(){super(...arguments),this.disabled=!1,this.isMenuItem=!0,this.selected=!1,this.value="",this.type="option",this.selectOptionController=new cd(this,{getHeadlineElements:()=>this.headlineElements,getSupportingTextElements:()=>this.supportingTextElements,getDefaultElements:()=>this.defaultElements,getInteractiveElement:()=>this.listItemRoot})}get typeaheadText(){return this.selectOptionController.typeaheadText}set typeaheadText(e){this.selectOptionController.setTypeaheadText(e)}get displayText(){return this.selectOptionController.displayText}set displayText(e){this.selectOptionController.setDisplayText(e)}render(){return this.renderListItem(h`
      <md-item>
        <div slot="container">
          ${this.renderRipple()} ${this.renderFocusRing()}
        </div>
        <slot name="start" slot="start"></slot>
        <slot name="end" slot="end"></slot>
        ${this.renderBody()}
      </md-item>
    `)}renderListItem(e){return h`
      <li
        id="item"
        tabindex=${this.disabled?-1:0}
        role=${this.selectOptionController.role}
        aria-label=${this.ariaLabel||b}
        aria-selected=${this.ariaSelected||b}
        aria-checked=${this.ariaChecked||b}
        aria-expanded=${this.ariaExpanded||b}
        aria-haspopup=${this.ariaHasPopup||b}
        class="list-item ${Q(this.getRenderClasses())}"
        @click=${this.selectOptionController.onClick}
        @keydown=${this.selectOptionController.onKeydown}
        >${e}</li
      >
    `}renderRipple(){return h` <md-ripple
      part="ripple"
      for="item"
      ?disabled=${this.disabled}></md-ripple>`}renderFocusRing(){return h` <md-focus-ring
      part="focus-ring"
      for="item"
      inward></md-focus-ring>`}getRenderClasses(){return{disabled:this.disabled,selected:this.selected}}renderBody(){return h`
      <slot></slot>
      <slot name="overline" slot="overline"></slot>
      <slot name="headline" slot="headline"></slot>
      <slot name="supporting-text" slot="supporting-text"></slot>
      <slot
        name="trailing-supporting-text"
        slot="trailing-supporting-text"></slot>
    `}focus(){var e;(e=this.listItemRoot)==null||e.focus()}}Pe.shadowRootOptions={...O.shadowRootOptions,delegatesFocus:!0};l([u({type:Boolean,reflect:!0})],Pe.prototype,"disabled",void 0);l([u({type:Boolean,attribute:"md-menu-item",reflect:!0})],Pe.prototype,"isMenuItem",void 0);l([u({type:Boolean})],Pe.prototype,"selected",void 0);l([u()],Pe.prototype,"value",void 0);l([U(".list-item")],Pe.prototype,"listItemRoot",void 0);l([ce({slot:"headline"})],Pe.prototype,"headlineElements",void 0);l([ce({slot:"supporting-text"})],Pe.prototype,"supportingTextElements",void 0);l([xa({slot:""})],Pe.prototype,"defaultElements",void 0);l([u({attribute:"typeahead-text"})],Pe.prototype,"typeaheadText",null);l([u({attribute:"display-text"})],Pe.prototype,"displayText",null);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Jo=class extends Pe{};Jo.styles=[Ma];Jo=l([E("md-select-option")],Jo);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Kn=S`@media(forced-colors: active){:host{--md-slider-active-track-color: CanvasText;--md-slider-disabled-active-track-color: GrayText;--md-slider-disabled-active-track-opacity: 1;--md-slider-disabled-handle-color: GrayText;--md-slider-disabled-inactive-track-color: GrayText;--md-slider-disabled-inactive-track-opacity: 1;--md-slider-focus-handle-color: CanvasText;--md-slider-handle-color: CanvasText;--md-slider-handle-shadow-color: Canvas;--md-slider-hover-handle-color: CanvasText;--md-slider-hover-state-layer-color: Canvas;--md-slider-hover-state-layer-opacity: 1;--md-slider-inactive-track-color: Canvas;--md-slider-label-container-color: Canvas;--md-slider-label-text-color: CanvasText;--md-slider-pressed-handle-color: CanvasText;--md-slider-pressed-state-layer-color: Canvas;--md-slider-pressed-state-layer-opacity: 1;--md-slider-with-overlap-handle-outline-color: CanvasText}.label,.label::before{border:var(--_with-overlap-handle-outline-color) solid var(--_with-overlap-handle-outline-width)}:host(:not([disabled])) .track::before{border:1px solid var(--_active-track-color)}.tickmarks::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='CanvasText'%3E%3Ccircle cx='2' cy='2'  r='1'/%3E%3C/svg%3E")}.tickmarks::after{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='Canvas'%3E%3Ccircle cx='2' cy='2' r='1'/%3E%3C/svg%3E")}:host([disabled]) .tickmarks::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='Canvas'%3E%3Ccircle cx='2' cy='2'  r='1'/%3E%3C/svg%3E")}}
`;Kn.styleSheet;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function no(o,e,t){return o?e(o):t==null?void 0:t(o)}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const pd=ue(it(at(O)));class W extends pd{get nameStart(){return this.getAttribute("name-start")??this.name}set nameStart(e){this.setAttribute("name-start",e)}get nameEnd(){return this.getAttribute("name-end")??this.nameStart}set nameEnd(e){this.setAttribute("name-end",e)}get renderAriaLabelStart(){const{ariaLabel:e}=this;return this.ariaLabelStart||e&&`${e} start`||this.valueLabelStart||String(this.valueStart)}get renderAriaValueTextStart(){return this.ariaValueTextStart||this.valueLabelStart||String(this.valueStart)}get renderAriaLabelEnd(){const{ariaLabel:e}=this;return this.range?this.ariaLabelEnd||e&&`${e} end`||this.valueLabelEnd||String(this.valueEnd):e||this.valueLabel||String(this.value)}get renderAriaValueTextEnd(){if(this.range)return this.ariaValueTextEnd||this.valueLabelEnd||String(this.valueEnd);const{ariaValueText:e}=this;return e||this.valueLabel||String(this.value)}constructor(){super(),this.min=0,this.max=100,this.valueLabel="",this.valueLabelStart="",this.valueLabelEnd="",this.ariaLabelStart="",this.ariaValueTextStart="",this.ariaLabelEnd="",this.ariaValueTextEnd="",this.step=1,this.ticks=!1,this.labeled=!1,this.range=!1,this.handleStartHover=!1,this.handleEndHover=!1,this.startOnTop=!1,this.handlesOverlapping=!1,this.ripplePointerId=1,this.isRedispatchingEvent=!1,this.addEventListener("click",e=>{!er(e)||!this.inputEnd||(this.focus(),Or(this.inputEnd))})}focus(){var e;(e=this.inputEnd)==null||e.focus()}willUpdate(e){var r,a;this.renderValueStart=e.has("valueStart")?this.valueStart:(r=this.inputStart)==null?void 0:r.valueAsNumber;const t=e.has("valueEnd")&&this.range||e.has("value");this.renderValueEnd=t?this.range?this.valueEnd:this.value:(a=this.inputEnd)==null?void 0:a.valueAsNumber,e.get("handleStartHover")!==void 0?this.toggleRippleHover(this.rippleStart,this.handleStartHover):e.get("handleEndHover")!==void 0&&this.toggleRippleHover(this.rippleEnd,this.handleEndHover)}updated(e){var t,r;if(this.range&&(this.renderValueStart=this.inputStart.valueAsNumber),this.renderValueEnd=this.inputEnd.valueAsNumber,this.range){const a=(this.max-this.min)/3;if(this.valueStart===void 0){this.inputStart.valueAsNumber=this.min+a;const i=this.inputStart.valueAsNumber;this.valueStart=this.renderValueStart=i}if(this.valueEnd===void 0){this.inputEnd.valueAsNumber=this.min+2*a;const i=this.inputEnd.valueAsNumber;this.valueEnd=this.renderValueEnd=i}}else this.value??(this.value=this.renderValueEnd);if(e.has("range")||e.has("renderValueStart")||e.has("renderValueEnd")||this.isUpdatePending){const a=(t=this.handleStart)==null?void 0:t.querySelector(".handleNub"),i=(r=this.handleEnd)==null?void 0:r.querySelector(".handleNub");this.handlesOverlapping=ud(a,i)}this.performUpdate()}render(){const e=this.step===0?1:this.step,t=Math.max(this.max-this.min,e),r=this.range?((this.renderValueStart??this.min)-this.min)/t:0,a=((this.renderValueEnd??this.min)-this.min)/t,i={"--_start-fraction":String(r),"--_end-fraction":String(a),"--_tick-count":String(t/e)},n={ranged:this.range},s=this.valueLabelStart||String(this.renderValueStart),d=(this.range?this.valueLabelEnd:this.valueLabel)||String(this.renderValueEnd),c={start:!0,value:this.renderValueStart,ariaLabel:this.renderAriaLabelStart,ariaValueText:this.renderAriaValueTextStart,ariaMin:this.min,ariaMax:this.valueEnd??this.max},p={start:!1,value:this.renderValueEnd,ariaLabel:this.renderAriaLabelEnd,ariaValueText:this.renderAriaValueTextEnd,ariaMin:this.range?this.valueStart??this.min:this.min,ariaMax:this.max},v={start:!0,hover:this.handleStartHover,label:s},g={start:!1,hover:this.handleEndHover,label:d},_={hover:this.handleStartHover||this.handleEndHover};return h` <div
      class="container ${Q(n)}"
      style=${yt(i)}>
      ${no(this.range,()=>this.renderInput(c))}
      ${this.renderInput(p)} ${this.renderTrack()}
      <div class="handleContainerPadded">
        <div class="handleContainerBlock">
          <div class="handleContainer ${Q(_)}">
            ${no(this.range,()=>this.renderHandle(v))}
            ${this.renderHandle(g)}
          </div>
        </div>
      </div>
    </div>`}renderTrack(){return h`
      <div class="track"></div>
      ${this.ticks?h`<div class="tickmarks"></div>`:b}
    `}renderLabel(e){return h`<div class="label" aria-hidden="true">
      <span class="labelContent" part="label">${e}</span>
    </div>`}renderHandle({start:e,hover:t,label:r}){const a=!this.disabled&&e===this.startOnTop,i=!this.disabled&&this.handlesOverlapping,n=e?"start":"end";return h`<div
      class="handle ${Q({[n]:!0,hover:t,onTop:a,isOverlapping:i})}">
      <md-focus-ring part="focus-ring" for=${n}></md-focus-ring>
      <md-ripple
        for=${n}
        class=${n}
        ?disabled=${this.disabled}></md-ripple>
      <div class="handleNub">
        <md-elevation part="elevation"></md-elevation>
      </div>
      ${no(this.labeled,()=>this.renderLabel(r))}
    </div>`}renderInput({start:e,value:t,ariaLabel:r,ariaValueText:a,ariaMin:i,ariaMax:n}){const s=e?"start":"end";return h`<input
      type="range"
      class="${Q({start:e,end:!e})}"
      @focus=${this.handleFocus}
      @pointerdown=${this.handleDown}
      @pointerup=${this.handleUp}
      @pointerenter=${this.handleEnter}
      @pointermove=${this.handleMove}
      @pointerleave=${this.handleLeave}
      @keydown=${this.handleKeydown}
      @keyup=${this.handleKeyup}
      @input=${this.handleInput}
      @change=${this.handleChange}
      id=${s}
      .disabled=${this.disabled}
      .min=${String(this.min)}
      aria-valuemin=${i}
      .max=${String(this.max)}
      aria-valuemax=${n}
      .step=${String(this.step)}
      .value=${String(t)}
      .tabIndex=${e?1:0}
      aria-label=${r||b}
      aria-valuetext=${a} />`}async toggleRippleHover(e,t){const r=await e;r&&(t?r.handlePointerenter(new PointerEvent("pointerenter",{isPrimary:!0,pointerId:this.ripplePointerId})):r.handlePointerleave(new PointerEvent("pointerleave",{isPrimary:!0,pointerId:this.ripplePointerId})))}handleFocus(e){this.updateOnTop(e.target)}startAction(e){const t=e.target,r=t===this.inputStart?this.inputEnd:this.inputStart;this.action={canFlip:e.type==="pointerdown",flipped:!1,target:t,fixed:r,values:new Map([[t,t.valueAsNumber],[r,r==null?void 0:r.valueAsNumber]])}}finishAction(e){this.action=void 0}handleKeydown(e){this.startAction(e)}handleKeyup(e){this.finishAction(e)}handleDown(e){this.startAction(e),this.ripplePointerId=e.pointerId;const t=e.target===this.inputStart;this.handleStartHover=!this.disabled&&t&&!!this.handleStart,this.handleEndHover=!this.disabled&&!t&&!!this.handleEnd}async handleUp(e){if(!this.action)return;const{target:t,values:r,flipped:a}=this.action;await new Promise(requestAnimationFrame),t!==void 0&&(t.focus(),a&&t.valueAsNumber!==r.get(t)&&t.dispatchEvent(new Event("change",{bubbles:!0}))),this.finishAction(e)}handleMove(e){this.handleStartHover=!this.disabled&&gi(e,this.handleStart),this.handleEndHover=!this.disabled&&gi(e,this.handleEnd)}handleEnter(e){this.handleMove(e)}handleLeave(){this.handleStartHover=!1,this.handleEndHover=!1}updateOnTop(e){this.startOnTop=e.classList.contains("start")}needsClamping(){if(!this.action)return!1;const{target:e,fixed:t}=this.action;return e===this.inputStart?e.valueAsNumber>t.valueAsNumber:e.valueAsNumber<t.valueAsNumber}isActionFlipped(){const{action:e}=this;if(!e)return!1;const{target:t,fixed:r,values:a}=e;return e.canFlip&&a.get(t)===a.get(r)&&this.needsClamping()&&(e.canFlip=!1,e.flipped=!0,e.target=r,e.fixed=t),e.flipped}flipAction(){if(!this.action)return!1;const{target:e,fixed:t,values:r}=this.action,a=e.valueAsNumber!==t.valueAsNumber;return e.valueAsNumber=t.valueAsNumber,t.valueAsNumber=r.get(t),a}clampAction(){if(!this.needsClamping()||!this.action)return!1;const{target:e,fixed:t}=this.action;return e.valueAsNumber=t.valueAsNumber,!0}handleInput(e){if(this.isRedispatchingEvent)return;let t=!1,r=!1;this.range&&(this.isActionFlipped()&&(t=!0,r=this.flipAction()),this.clampAction()&&(t=!0,r=!1));const a=e.target;this.updateOnTop(a),this.range?(this.valueStart=this.inputStart.valueAsNumber,this.valueEnd=this.inputEnd.valueAsNumber):this.value=this.inputEnd.valueAsNumber,t&&e.stopPropagation(),r&&(this.isRedispatchingEvent=!0,rt(a,e),this.isRedispatchingEvent=!1)}handleChange(e){const t=e.target,{target:r,values:a}=this.action??{};r&&r.valueAsNumber===a.get(t)||rt(this,e),this.finishAction(e)}[qe](){if(this.range){const e=new FormData;return e.append(this.nameStart,String(this.valueStart)),e.append(this.nameEnd,String(this.valueEnd)),e}return String(this.value)}formResetCallback(){if(this.range){const t=this.getAttribute("value-start");this.valueStart=t!==null?Number(t):void 0;const r=this.getAttribute("value-end");this.valueEnd=r!==null?Number(r):void 0;return}const e=this.getAttribute("value");this.value=e!==null?Number(e):void 0}formStateRestoreCallback(e){if(Array.isArray(e)){const[[,t],[,r]]=e;this.valueStart=Number(t),this.valueEnd=Number(r),this.range=!0;return}this.value=Number(e),this.range=!1}}W.shadowRootOptions={...O.shadowRootOptions,delegatesFocus:!0};l([u({type:Number})],W.prototype,"min",void 0);l([u({type:Number})],W.prototype,"max",void 0);l([u({type:Number})],W.prototype,"value",void 0);l([u({type:Number,attribute:"value-start"})],W.prototype,"valueStart",void 0);l([u({type:Number,attribute:"value-end"})],W.prototype,"valueEnd",void 0);l([u({attribute:"value-label"})],W.prototype,"valueLabel",void 0);l([u({attribute:"value-label-start"})],W.prototype,"valueLabelStart",void 0);l([u({attribute:"value-label-end"})],W.prototype,"valueLabelEnd",void 0);l([u({attribute:"aria-label-start"})],W.prototype,"ariaLabelStart",void 0);l([u({attribute:"aria-valuetext-start"})],W.prototype,"ariaValueTextStart",void 0);l([u({attribute:"aria-label-end"})],W.prototype,"ariaLabelEnd",void 0);l([u({attribute:"aria-valuetext-end"})],W.prototype,"ariaValueTextEnd",void 0);l([u({type:Number})],W.prototype,"step",void 0);l([u({type:Boolean})],W.prototype,"ticks",void 0);l([u({type:Boolean})],W.prototype,"labeled",void 0);l([u({type:Boolean})],W.prototype,"range",void 0);l([U("input.start")],W.prototype,"inputStart",void 0);l([U(".handle.start")],W.prototype,"handleStart",void 0);l([zi("md-ripple.start")],W.prototype,"rippleStart",void 0);l([U("input.end")],W.prototype,"inputEnd",void 0);l([U(".handle.end")],W.prototype,"handleEnd",void 0);l([zi("md-ripple.end")],W.prototype,"rippleEnd",void 0);l([T()],W.prototype,"handleStartHover",void 0);l([T()],W.prototype,"handleEndHover",void 0);l([T()],W.prototype,"startOnTop",void 0);l([T()],W.prototype,"handlesOverlapping",void 0);l([T()],W.prototype,"renderValueStart",void 0);l([T()],W.prototype,"renderValueEnd",void 0);function gi({x:o,y:e},t){if(!t)return!1;const{top:r,left:a,bottom:i,right:n}=t.getBoundingClientRect();return o>=a&&o<=n&&e>=r&&e<=i}function ud(o,e){if(!(o&&e))return!1;const t=o.getBoundingClientRect(),r=e.getBoundingClientRect();return!(t.top>r.bottom||t.right<r.left||t.bottom<r.top||t.left>r.right)}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const jn=S`:host{--_active-track-color: var(--md-slider-active-track-color, var(--md-sys-color-primary, #6750a4));--_active-track-height: var(--md-slider-active-track-height, 4px);--_active-track-shape: var(--md-slider-active-track-shape, var(--md-sys-shape-corner-full, 9999px));--_disabled-active-track-color: var(--md-slider-disabled-active-track-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-active-track-opacity: var(--md-slider-disabled-active-track-opacity, 0.38);--_disabled-handle-color: var(--md-slider-disabled-handle-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-handle-elevation: var(--md-slider-disabled-handle-elevation, 0);--_disabled-inactive-track-color: var(--md-slider-disabled-inactive-track-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-inactive-track-opacity: var(--md-slider-disabled-inactive-track-opacity, 0.12);--_focus-handle-color: var(--md-slider-focus-handle-color, var(--md-sys-color-primary, #6750a4));--_handle-color: var(--md-slider-handle-color, var(--md-sys-color-primary, #6750a4));--_handle-elevation: var(--md-slider-handle-elevation, 1);--_handle-height: var(--md-slider-handle-height, 20px);--_handle-shadow-color: var(--md-slider-handle-shadow-color, var(--md-sys-color-shadow, #000));--_handle-shape: var(--md-slider-handle-shape, var(--md-sys-shape-corner-full, 9999px));--_handle-width: var(--md-slider-handle-width, 20px);--_hover-handle-color: var(--md-slider-hover-handle-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-color: var(--md-slider-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-slider-hover-state-layer-opacity, 0.08);--_inactive-track-color: var(--md-slider-inactive-track-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_inactive-track-height: var(--md-slider-inactive-track-height, 4px);--_inactive-track-shape: var(--md-slider-inactive-track-shape, var(--md-sys-shape-corner-full, 9999px));--_label-container-color: var(--md-slider-label-container-color, var(--md-sys-color-primary, #6750a4));--_label-container-height: var(--md-slider-label-container-height, 28px);--_pressed-handle-color: var(--md-slider-pressed-handle-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-color: var(--md-slider-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-slider-pressed-state-layer-opacity, 0.12);--_state-layer-size: var(--md-slider-state-layer-size, 40px);--_with-overlap-handle-outline-color: var(--md-slider-with-overlap-handle-outline-color, var(--md-sys-color-on-primary, #fff));--_with-overlap-handle-outline-width: var(--md-slider-with-overlap-handle-outline-width, 1px);--_with-tick-marks-active-container-color: var(--md-slider-with-tick-marks-active-container-color, var(--md-sys-color-on-primary, #fff));--_with-tick-marks-container-size: var(--md-slider-with-tick-marks-container-size, 2px);--_with-tick-marks-disabled-container-color: var(--md-slider-with-tick-marks-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_with-tick-marks-inactive-container-color: var(--md-slider-with-tick-marks-inactive-container-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-color: var(--md-slider-label-text-color, var(--md-sys-color-on-primary, #fff));--_label-text-font: var(--md-slider-label-text-font, var(--md-sys-typescale-label-medium-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-slider-label-text-line-height, var(--md-sys-typescale-label-medium-line-height, 1rem));--_label-text-size: var(--md-slider-label-text-size, var(--md-sys-typescale-label-medium-size, 0.75rem));--_label-text-weight: var(--md-slider-label-text-weight, var(--md-sys-typescale-label-medium-weight, var(--md-ref-typeface-weight-medium, 500)));--_start-fraction: 0;--_end-fraction: 0;--_tick-count: 0;display:inline-flex;vertical-align:middle;min-inline-size:200px;--md-elevation-level: var(--_handle-elevation);--md-elevation-shadow-color: var(--_handle-shadow-color)}md-focus-ring{height:48px;inset:unset;width:48px}md-elevation{transition-duration:250ms}@media(prefers-reduced-motion){.label{transition-duration:0}}:host([disabled]){opacity:var(--_disabled-active-track-opacity);--md-elevation-level: var(--_disabled-handle-elevation)}.container{flex:1;display:flex;align-items:center;position:relative;block-size:var(--_state-layer-size);pointer-events:none;touch-action:none;user-select:none}.track,.tickmarks{position:absolute;inset:0;display:flex;align-items:center}.track::before,.tickmarks::before,.track::after,.tickmarks::after{position:absolute;content:"";inset-inline-start:calc(var(--_state-layer-size)/2 - var(--_with-tick-marks-container-size));inset-inline-end:calc(var(--_state-layer-size)/2 - var(--_with-tick-marks-container-size));background-size:calc((100% - var(--_with-tick-marks-container-size)*2)/var(--_tick-count)) 100%}.track::before,.tickmarks::before{block-size:var(--_inactive-track-height);border-radius:var(--_inactive-track-shape)}.track::before{background:var(--_inactive-track-color)}.tickmarks::before{background-image:radial-gradient(circle at var(--_with-tick-marks-container-size) center, var(--_with-tick-marks-inactive-container-color) 0, var(--_with-tick-marks-inactive-container-color) calc(var(--_with-tick-marks-container-size) / 2), transparent calc(var(--_with-tick-marks-container-size) / 2))}:host([disabled]) .track::before{opacity:calc(1/var(--_disabled-active-track-opacity)*var(--_disabled-inactive-track-opacity));background:var(--_disabled-inactive-track-color)}.track::after,.tickmarks::after{block-size:var(--_active-track-height);border-radius:var(--_active-track-shape);clip-path:inset(0 calc(var(--_with-tick-marks-container-size) * min((1 - var(--_end-fraction)) * 1000000000, 1) + (100% - var(--_with-tick-marks-container-size) * 2) * (1 - var(--_end-fraction))) 0 calc(var(--_with-tick-marks-container-size) * min(var(--_start-fraction) * 1000000000, 1) + (100% - var(--_with-tick-marks-container-size) * 2) * var(--_start-fraction)))}.track::after{background:var(--_active-track-color)}.tickmarks::after{background-image:radial-gradient(circle at var(--_with-tick-marks-container-size) center, var(--_with-tick-marks-active-container-color) 0, var(--_with-tick-marks-active-container-color) calc(var(--_with-tick-marks-container-size) / 2), transparent calc(var(--_with-tick-marks-container-size) / 2))}.track:dir(rtl)::after{clip-path:inset(0 calc(var(--_with-tick-marks-container-size) * min(var(--_start-fraction) * 1000000000, 1) + (100% - var(--_with-tick-marks-container-size) * 2) * var(--_start-fraction)) 0 calc(var(--_with-tick-marks-container-size) * min((1 - var(--_end-fraction)) * 1000000000, 1) + (100% - var(--_with-tick-marks-container-size) * 2) * (1 - var(--_end-fraction))))}.tickmarks:dir(rtl)::after{clip-path:inset(0 calc(var(--_with-tick-marks-container-size) * min(var(--_start-fraction) * 1000000000, 1) + (100% - var(--_with-tick-marks-container-size) * 2) * var(--_start-fraction)) 0 calc(var(--_with-tick-marks-container-size) * min((1 - var(--_end-fraction)) * 1000000000, 1) + (100% - var(--_with-tick-marks-container-size) * 2) * (1 - var(--_end-fraction))))}:host([disabled]) .track::after{background:var(--_disabled-active-track-color)}:host([disabled]) .tickmarks::before{background-image:radial-gradient(circle at var(--_with-tick-marks-container-size) center, var(--_with-tick-marks-disabled-container-color) 0, var(--_with-tick-marks-disabled-container-color) calc(var(--_with-tick-marks-container-size) / 2), transparent calc(var(--_with-tick-marks-container-size) / 2))}.handleContainerPadded{position:relative;block-size:100%;inline-size:100%;padding-inline:calc(var(--_state-layer-size)/2)}.handleContainerBlock{position:relative;block-size:100%;inline-size:100%}.handleContainer{position:absolute;inset-block-start:0;inset-block-end:0;inset-inline-start:calc(100%*var(--_start-fraction));inline-size:calc(100%*(var(--_end-fraction) - var(--_start-fraction)))}.handle{position:absolute;block-size:var(--_state-layer-size);inline-size:var(--_state-layer-size);border-radius:var(--_handle-shape);display:flex;place-content:center;place-items:center}.handleNub{position:absolute;height:var(--_handle-height);width:var(--_handle-width);border-radius:var(--_handle-shape);background:var(--_handle-color)}:host([disabled]) .handleNub{background:var(--_disabled-handle-color)}input.end:focus~.handleContainerPadded .handle.end>.handleNub,input.start:focus~.handleContainerPadded .handle.start>.handleNub{background:var(--_focus-handle-color)}.container>.handleContainerPadded .handle.hover>.handleNub{background:var(--_hover-handle-color)}:host(:not([disabled])) input.end:active~.handleContainerPadded .handle.end>.handleNub,:host(:not([disabled])) input.start:active~.handleContainerPadded .handle.start>.handleNub{background:var(--_pressed-handle-color)}.onTop.isOverlapping .label,.onTop.isOverlapping .label::before{outline:var(--_with-overlap-handle-outline-color) solid var(--_with-overlap-handle-outline-width)}.onTop.isOverlapping .handleNub{border:var(--_with-overlap-handle-outline-color) solid var(--_with-overlap-handle-outline-width)}.handle.start{inset-inline-start:calc(0px - var(--_state-layer-size)/2)}.handle.end{inset-inline-end:calc(0px - var(--_state-layer-size)/2)}.label{position:absolute;box-sizing:border-box;display:flex;padding:4px;place-content:center;place-items:center;border-radius:var(--md-sys-shape-corner-full, 9999px);color:var(--_label-text-color);font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);inset-block-end:100%;min-inline-size:var(--_label-container-height);min-block-size:var(--_label-container-height);background:var(--_label-container-color);transition:transform 100ms cubic-bezier(0.2, 0, 0, 1);transform-origin:center bottom;transform:scale(0)}:host(:focus-within) .label,.handleContainer.hover .label,:where(:has(input:active)) .label{transform:scale(1)}.label::before,.label::after{position:absolute;display:block;content:"";background:inherit}.label::before{inline-size:calc(var(--_label-container-height)/2);block-size:calc(var(--_label-container-height)/2);bottom:calc(var(--_label-container-height)/-10);transform:rotate(45deg)}.label::after{inset:0px;border-radius:inherit}.labelContent{z-index:1}input[type=range]{opacity:0;-webkit-tap-highlight-color:rgba(0,0,0,0);position:absolute;box-sizing:border-box;height:100%;width:100%;margin:0;background:rgba(0,0,0,0);cursor:pointer;pointer-events:auto;appearance:none}input[type=range]:focus{outline:none}::-webkit-slider-runnable-track{-webkit-appearance:none}::-moz-range-track{appearance:none}::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;block-size:var(--_handle-height);inline-size:var(--_handle-width);opacity:0;z-index:2}input.end::-webkit-slider-thumb{--_track-and-knob-padding: calc( (var(--_state-layer-size) - var(--_handle-width)) / 2 );--_x-translate: calc( var(--_track-and-knob-padding) - 2 * var(--_end-fraction) * var(--_track-and-knob-padding) );transform:translateX(var(--_x-translate))}input.end:dir(rtl)::-webkit-slider-thumb{transform:translateX(calc(-1 * var(--_x-translate)))}input.start::-webkit-slider-thumb{--_track-and-knob-padding: calc( (var(--_state-layer-size) - var(--_handle-width)) / 2 );--_x-translate: calc( var(--_track-and-knob-padding) - 2 * var(--_start-fraction) * var(--_track-and-knob-padding) );transform:translateX(var(--_x-translate))}input.start:dir(rtl)::-webkit-slider-thumb{transform:translateX(calc(-1 * var(--_x-translate)))}::-moz-range-thumb{appearance:none;block-size:var(--_state-layer-size);inline-size:var(--_state-layer-size);transform:scaleX(0);opacity:0;z-index:2}.ranged input.start{clip-path:inset(0 calc(100% - (var(--_state-layer-size) / 2 + (100% - var(--_state-layer-size)) * (var(--_start-fraction) + (var(--_end-fraction) - var(--_start-fraction)) / 2))) 0 0)}.ranged input.start:dir(rtl){clip-path:inset(0 0 0 calc(100% - (var(--_state-layer-size) / 2 + (100% - var(--_state-layer-size)) * (var(--_start-fraction) + (var(--_end-fraction) - var(--_start-fraction)) / 2))))}.ranged input.end{clip-path:inset(0 0 0 calc(var(--_state-layer-size) / 2 + (100% - var(--_state-layer-size)) * (var(--_start-fraction) + (var(--_end-fraction) - var(--_start-fraction)) / 2)))}.ranged input.end:dir(rtl){clip-path:inset(0 calc(var(--_state-layer-size) / 2 + (100% - var(--_state-layer-size)) * (var(--_start-fraction) + (var(--_end-fraction) - var(--_start-fraction)) / 2)) 0 0)}.onTop{z-index:1}.handle{--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}md-ripple{border-radius:50%;height:var(--_state-layer-size);width:var(--_state-layer-size)}
`;jn.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let ea=class extends W{};ea.styles=[jn,Kn];ea=l([E("md-slider")],ea);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const md=ue(tr(it(at(O))));class lt extends md{constructor(){super(),this.selected=!1,this.icons=!1,this.showOnlySelectedIcon=!1,this.required=!1,this.value="on",this.addEventListener("click",e=>{!er(e)||!this.input||(this.focus(),Or(this.input))}),Ta(this,"keydown"),this.addEventListener("keydown",e=>{$a(e,()=>{e.defaultPrevented||e.key!=="Enter"||this.disabled||!this.input||this.input.click()})})}render(){return h`
      <div class="switch ${Q(this.getRenderClasses())}">
        <input
          id="switch"
          class="touch"
          type="checkbox"
          role="switch"
          aria-label=${this.ariaLabel||b}
          ?checked=${this.selected}
          ?disabled=${this.disabled}
          ?required=${this.required}
          @input=${this.handleInput}
          @change=${this.handleChange} />

        <md-focus-ring part="focus-ring" for="switch"></md-focus-ring>
        <span class="track"> ${this.renderHandle()} </span>
      </div>
    `}getRenderClasses(){return{selected:this.selected,unselected:!this.selected,disabled:this.disabled}}renderHandle(){const e={"with-icon":this.showOnlySelectedIcon?this.selected:this.icons};return h`
      ${this.renderTouchTarget()}
      <span class="handle-container">
        <md-ripple for="switch" ?disabled="${this.disabled}"></md-ripple>
        <span class="handle ${Q(e)}">
          ${this.shouldShowIcons()?this.renderIcons():h``}
        </span>
      </span>
    `}renderIcons(){return h`
      <div class="icons">
        ${this.renderOnIcon()}
        ${this.showOnlySelectedIcon?h``:this.renderOffIcon()}
      </div>
    `}renderOnIcon(){return h`
      <slot class="icon icon--on" name="on-icon">
        <svg viewBox="0 0 24 24">
          <path
            d="M9.55 18.2 3.65 12.3 5.275 10.675 9.55 14.95 18.725 5.775 20.35 7.4Z" />
        </svg>
      </slot>
    `}renderOffIcon(){return h`
      <slot class="icon icon--off" name="off-icon">
        <svg viewBox="0 0 24 24">
          <path
            d="M6.4 19.2 4.8 17.6 10.4 12 4.8 6.4 6.4 4.8 12 10.4 17.6 4.8 19.2 6.4 13.6 12 19.2 17.6 17.6 19.2 12 13.6Z" />
        </svg>
      </slot>
    `}renderTouchTarget(){return h`<span class="touch"></span>`}shouldShowIcons(){return this.icons||this.showOnlySelectedIcon}handleInput(e){const t=e.target;this.selected=t.checked}handleChange(e){rt(this,e)}[qe](){return this.selected?this.value:null}[Wt](){return String(this.selected)}formResetCallback(){this.selected=this.hasAttribute("selected")}formStateRestoreCallback(e){this.selected=e==="true"}[bt](){return new Qi(()=>({checked:this.selected,required:this.required}))}[gt](){return this.input}}lt.shadowRootOptions={mode:"open",delegatesFocus:!0};l([u({type:Boolean})],lt.prototype,"selected",void 0);l([u({type:Boolean})],lt.prototype,"icons",void 0);l([u({type:Boolean,attribute:"show-only-selected-icon"})],lt.prototype,"showOnlySelectedIcon",void 0);l([u({type:Boolean})],lt.prototype,"required",void 0);l([u()],lt.prototype,"value",void 0);l([U("input")],lt.prototype,"input",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Gn=S`@layer styles, hcm;@layer styles{:host{display:inline-flex;outline:none;vertical-align:top;-webkit-tap-highlight-color:rgba(0,0,0,0);cursor:pointer}:host([disabled]){cursor:default}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--md-switch-track-height, 32px))/2) 0px}md-focus-ring{--md-focus-ring-shape-start-start: var(--md-switch-track-shape-start-start, var(--md-switch-track-shape, var(--md-sys-shape-corner-full, 9999px)));--md-focus-ring-shape-start-end: var(--md-switch-track-shape-start-end, var(--md-switch-track-shape, var(--md-sys-shape-corner-full, 9999px)));--md-focus-ring-shape-end-end: var(--md-switch-track-shape-end-end, var(--md-switch-track-shape, var(--md-sys-shape-corner-full, 9999px)));--md-focus-ring-shape-end-start: var(--md-switch-track-shape-end-start, var(--md-switch-track-shape, var(--md-sys-shape-corner-full, 9999px)))}.switch{align-items:center;display:inline-flex;flex-shrink:0;position:relative;width:var(--md-switch-track-width, 52px);height:var(--md-switch-track-height, 32px);border-start-start-radius:var(--md-switch-track-shape-start-start, var(--md-switch-track-shape, var(--md-sys-shape-corner-full, 9999px)));border-start-end-radius:var(--md-switch-track-shape-start-end, var(--md-switch-track-shape, var(--md-sys-shape-corner-full, 9999px)));border-end-end-radius:var(--md-switch-track-shape-end-end, var(--md-switch-track-shape, var(--md-sys-shape-corner-full, 9999px)));border-end-start-radius:var(--md-switch-track-shape-end-start, var(--md-switch-track-shape, var(--md-sys-shape-corner-full, 9999px)))}input{appearance:none;background:none;height:max(100%,var(--md-switch-touch-target-size, 48px));outline:none;margin:0;position:absolute;width:max(100%,var(--md-switch-touch-target-size, 48px));z-index:1;cursor:inherit;top:50%;left:50%;transform:translate(-50%, -50%)}:host([touch-target=none]) input{display:none}}@layer styles{.track{position:absolute;width:100%;height:100%;box-sizing:border-box;border-radius:inherit;display:flex;justify-content:center;align-items:center}.track::before{content:"";display:flex;position:absolute;height:100%;width:100%;border-radius:inherit;box-sizing:border-box;transition-property:opacity,background-color;transition-timing-function:linear;transition-duration:67ms}.disabled .track{background-color:rgba(0,0,0,0);border-color:rgba(0,0,0,0)}.disabled .track::before,.disabled .track::after{transition:none;opacity:var(--md-switch-disabled-track-opacity, 0.12)}.disabled .track::before{background-clip:content-box}.selected .track::before{background-color:var(--md-switch-selected-track-color, var(--md-sys-color-primary, #6750a4))}.selected:hover .track::before{background-color:var(--md-switch-selected-hover-track-color, var(--md-sys-color-primary, #6750a4))}.selected:focus-within .track::before{background-color:var(--md-switch-selected-focus-track-color, var(--md-sys-color-primary, #6750a4))}.selected:active .track::before{background-color:var(--md-switch-selected-pressed-track-color, var(--md-sys-color-primary, #6750a4))}.selected.disabled .track{background-clip:border-box}.selected.disabled .track::before{background-color:var(--md-switch-disabled-selected-track-color, var(--md-sys-color-on-surface, #1d1b20))}.unselected .track::before{background-color:var(--md-switch-track-color, var(--md-sys-color-surface-container-highest, #e6e0e9));border-color:var(--md-switch-track-outline-color, var(--md-sys-color-outline, #79747e));border-style:solid;border-width:var(--md-switch-track-outline-width, 2px)}.unselected:hover .track::before{background-color:var(--md-switch-hover-track-color, var(--md-sys-color-surface-container-highest, #e6e0e9));border-color:var(--md-switch-hover-track-outline-color, var(--md-sys-color-outline, #79747e))}.unselected:focus-visible .track::before{background-color:var(--md-switch-focus-track-color, var(--md-sys-color-surface-container-highest, #e6e0e9));border-color:var(--md-switch-focus-track-outline-color, var(--md-sys-color-outline, #79747e))}.unselected:active .track::before{background-color:var(--md-switch-pressed-track-color, var(--md-sys-color-surface-container-highest, #e6e0e9));border-color:var(--md-switch-pressed-track-outline-color, var(--md-sys-color-outline, #79747e))}.unselected.disabled .track::before{background-color:var(--md-switch-disabled-track-color, var(--md-sys-color-surface-container-highest, #e6e0e9));border-color:var(--md-switch-disabled-track-outline-color, var(--md-sys-color-on-surface, #1d1b20))}}@layer hcm{@media(forced-colors: active){.selected .track::before{background:ButtonText;border-color:ButtonText}.disabled .track::before{border-color:GrayText;opacity:1}.disabled.selected .track::before{background:GrayText}}}@layer styles{.handle-container{display:flex;place-content:center;place-items:center;position:relative;transition:margin 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)}.selected .handle-container{margin-inline-start:calc(var(--md-switch-track-width, 52px) - var(--md-switch-track-height, 32px))}.unselected .handle-container{margin-inline-end:calc(var(--md-switch-track-width, 52px) - var(--md-switch-track-height, 32px))}.disabled .handle-container{transition:none}.handle{border-start-start-radius:var(--md-switch-handle-shape-start-start, var(--md-switch-handle-shape, var(--md-sys-shape-corner-full, 9999px)));border-start-end-radius:var(--md-switch-handle-shape-start-end, var(--md-switch-handle-shape, var(--md-sys-shape-corner-full, 9999px)));border-end-end-radius:var(--md-switch-handle-shape-end-end, var(--md-switch-handle-shape, var(--md-sys-shape-corner-full, 9999px)));border-end-start-radius:var(--md-switch-handle-shape-end-start, var(--md-switch-handle-shape, var(--md-sys-shape-corner-full, 9999px)));height:var(--md-switch-handle-height, 16px);width:var(--md-switch-handle-width, 16px);transform-origin:center;transition-property:height,width;transition-duration:250ms,250ms;transition-timing-function:cubic-bezier(0.2, 0, 0, 1),cubic-bezier(0.2, 0, 0, 1);z-index:0}.handle::before{content:"";display:flex;inset:0;position:absolute;border-radius:inherit;box-sizing:border-box;transition:background-color 67ms linear}.disabled .handle,.disabled .handle::before{transition:none}.selected .handle{height:var(--md-switch-selected-handle-height, 24px);width:var(--md-switch-selected-handle-width, 24px)}.handle.with-icon{height:var(--md-switch-with-icon-handle-height, 24px);width:var(--md-switch-with-icon-handle-width, 24px)}.selected:not(.disabled):active .handle,.unselected:not(.disabled):active .handle{height:var(--md-switch-pressed-handle-height, 28px);width:var(--md-switch-pressed-handle-width, 28px);transition-timing-function:linear;transition-duration:100ms}.selected .handle::before{background-color:var(--md-switch-selected-handle-color, var(--md-sys-color-on-primary, #fff))}.selected:hover .handle::before{background-color:var(--md-switch-selected-hover-handle-color, var(--md-sys-color-primary-container, #eaddff))}.selected:focus-within .handle::before{background-color:var(--md-switch-selected-focus-handle-color, var(--md-sys-color-primary-container, #eaddff))}.selected:active .handle::before{background-color:var(--md-switch-selected-pressed-handle-color, var(--md-sys-color-primary-container, #eaddff))}.selected.disabled .handle::before{background-color:var(--md-switch-disabled-selected-handle-color, var(--md-sys-color-surface, #fef7ff));opacity:var(--md-switch-disabled-selected-handle-opacity, 1)}.unselected .handle::before{background-color:var(--md-switch-handle-color, var(--md-sys-color-outline, #79747e))}.unselected:hover .handle::before{background-color:var(--md-switch-hover-handle-color, var(--md-sys-color-on-surface-variant, #49454f))}.unselected:focus-within .handle::before{background-color:var(--md-switch-focus-handle-color, var(--md-sys-color-on-surface-variant, #49454f))}.unselected:active .handle::before{background-color:var(--md-switch-pressed-handle-color, var(--md-sys-color-on-surface-variant, #49454f))}.unselected.disabled .handle::before{background-color:var(--md-switch-disabled-handle-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-switch-disabled-handle-opacity, 0.38)}md-ripple{border-radius:var(--md-switch-state-layer-shape, var(--md-sys-shape-corner-full, 9999px));height:var(--md-switch-state-layer-size, 40px);inset:unset;width:var(--md-switch-state-layer-size, 40px)}.selected md-ripple{--md-ripple-hover-color: var(--md-switch-selected-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--md-ripple-pressed-color: var(--md-switch-selected-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--md-ripple-hover-opacity: var(--md-switch-selected-hover-state-layer-opacity, 0.08);--md-ripple-pressed-opacity: var(--md-switch-selected-pressed-state-layer-opacity, 0.12)}.unselected md-ripple{--md-ripple-hover-color: var(--md-switch-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-color: var(--md-switch-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-switch-hover-state-layer-opacity, 0.08);--md-ripple-pressed-opacity: var(--md-switch-pressed-state-layer-opacity, 0.12)}}@layer hcm{@media(forced-colors: active){.unselected .handle::before{background:ButtonText}.disabled .handle::before{opacity:1}.disabled.unselected .handle::before{background:GrayText}}}@layer styles{.icons{position:relative;height:100%;width:100%}.icon{position:absolute;inset:0;margin:auto;display:flex;align-items:center;justify-content:center;fill:currentColor;transition:fill 67ms linear,opacity 33ms linear,transform 167ms cubic-bezier(0.2, 0, 0, 1);opacity:0}.disabled .icon{transition:none}.selected .icon--on,.unselected .icon--off{opacity:1}.unselected .handle:not(.with-icon) .icon--on{transform:rotate(-45deg)}.icon--off{width:var(--md-switch-icon-size, 16px);height:var(--md-switch-icon-size, 16px);color:var(--md-switch-icon-color, var(--md-sys-color-surface-container-highest, #e6e0e9))}.unselected:hover .icon--off{color:var(--md-switch-hover-icon-color, var(--md-sys-color-surface-container-highest, #e6e0e9))}.unselected:focus-within .icon--off{color:var(--md-switch-focus-icon-color, var(--md-sys-color-surface-container-highest, #e6e0e9))}.unselected:active .icon--off{color:var(--md-switch-pressed-icon-color, var(--md-sys-color-surface-container-highest, #e6e0e9))}.unselected.disabled .icon--off{color:var(--md-switch-disabled-icon-color, var(--md-sys-color-surface-container-highest, #e6e0e9));opacity:var(--md-switch-disabled-icon-opacity, 0.38)}.icon--on{width:var(--md-switch-selected-icon-size, 16px);height:var(--md-switch-selected-icon-size, 16px);color:var(--md-switch-selected-icon-color, var(--md-sys-color-on-primary-container, #21005d))}.selected:hover .icon--on{color:var(--md-switch-selected-hover-icon-color, var(--md-sys-color-on-primary-container, #21005d))}.selected:focus-within .icon--on{color:var(--md-switch-selected-focus-icon-color, var(--md-sys-color-on-primary-container, #21005d))}.selected:active .icon--on{color:var(--md-switch-selected-pressed-icon-color, var(--md-sys-color-on-primary-container, #21005d))}.selected.disabled .icon--on{color:var(--md-switch-disabled-selected-icon-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-switch-disabled-selected-icon-opacity, 0.38)}}@layer hcm{@media(forced-colors: active){.icon--off{fill:Canvas}.icon--on{fill:ButtonText}.disabled.unselected .icon--off,.disabled.selected .icon--on{opacity:1}.disabled .icon--on{fill:GrayText}}}
`;Gn.styleSheet;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let ta=class extends lt{};ta.styles=[Gn];ta=l([E("md-switch")],ta);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Wn=Symbol("animateIndicator"),vd=Nn(O);class Fe extends vd{get selected(){return this.active}set selected(e){this.active=e}constructor(){super(),this.isTab=!0,this.active=!1,this.hasIcon=!1,this.iconOnly=!1,this.fullWidthIndicator=!1,this.internals=this.attachInternals(),this.internals.role="tab",this.addEventListener("keydown",this.handleKeydown.bind(this))}render(){const e=h`<div class="indicator"></div>`;return h`<div
      class="button"
      role="presentation"
      @click=${this.handleContentClick}>
      <md-focus-ring part="focus-ring" inward .control=${this}></md-focus-ring>
      <md-elevation part="elevation"></md-elevation>
      <md-ripple .control=${this}></md-ripple>
      <div
        class="content ${Q(this.getContentClasses())}"
        role="presentation">
        <slot name="icon" @slotchange=${this.handleIconSlotChange}></slot>
        <slot @slotchange=${this.handleSlotChange}></slot>
        ${this.fullWidthIndicator?b:e}
      </div>
      ${this.fullWidthIndicator?e:b}
    </div>`}getContentClasses(){return{"has-icon":this.hasIcon,"has-label":!this.iconOnly}}updated(){this.internals.ariaSelected=String(this.active)}async handleKeydown(e){await 0,!e.defaultPrevented&&(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this.click())}handleContentClick(e){e.stopPropagation(),this.click()}[Wn](e){if(!this.indicator)return;this.indicator.getAnimations().forEach(r=>{r.cancel()});const t=this.getKeyframes(e);t!==null&&this.indicator.animate(t,{duration:250,easing:Le.EMPHASIZED})}getKeyframes(e){var v;const t=fd();if(!this.active)return t?[{opacity:1},{transform:"none"}]:null;const r={},a=((v=e.indicator)==null?void 0:v.getBoundingClientRect())??{},i=a.left,n=a.width,s=this.indicator.getBoundingClientRect(),d=s.left,c=s.width,p=n/c;return!t&&i!==void 0&&d!==void 0&&!isNaN(p)?r.transform=`translateX(${(i-d).toFixed(4)}px) scaleX(${p.toFixed(4)})`:r.opacity=0,[r,{transform:"none"}]}handleSlotChange(){this.iconOnly=!1;for(const e of this.assignedDefaultNodes){const t=e.nodeType===Node.TEXT_NODE&&!!e.wholeText.match(/\S/);if(e.nodeType===Node.ELEMENT_NODE||t)return}this.iconOnly=!0}handleIconSlotChange(){this.hasIcon=this.assignedIcons.length>0}}l([u({type:Boolean,reflect:!0,attribute:"md-tab"})],Fe.prototype,"isTab",void 0);l([u({type:Boolean,reflect:!0})],Fe.prototype,"active",void 0);l([u({type:Boolean})],Fe.prototype,"selected",null);l([u({type:Boolean,attribute:"has-icon"})],Fe.prototype,"hasIcon",void 0);l([u({type:Boolean,attribute:"icon-only"})],Fe.prototype,"iconOnly",void 0);l([U(".indicator")],Fe.prototype,"indicator",void 0);l([T()],Fe.prototype,"fullWidthIndicator",void 0);l([xa({flatten:!0})],Fe.prototype,"assignedDefaultNodes",void 0);l([ce({slot:"icon",flatten:!0})],Fe.prototype,"assignedIcons",void 0);function fd(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Yn extends Fe{constructor(){super(...arguments),this.inlineIcon=!1}getContentClasses(){return{...super.getContentClasses(),stacked:!this.inlineIcon}}}l([u({type:Boolean,attribute:"inline-icon"})],Yn.prototype,"inlineIcon",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Xn=S`:host{--_active-indicator-color: var(--md-primary-tab-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_active-indicator-height: var(--md-primary-tab-active-indicator-height, 3px);--_active-indicator-shape: var(--md-primary-tab-active-indicator-shape, 3px 3px 0px 0px);--_active-hover-state-layer-color: var(--md-primary-tab-active-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_active-hover-state-layer-opacity: var(--md-primary-tab-active-hover-state-layer-opacity, 0.08);--_active-pressed-state-layer-color: var(--md-primary-tab-active-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_active-pressed-state-layer-opacity: var(--md-primary-tab-active-pressed-state-layer-opacity, 0.12);--_container-color: var(--md-primary-tab-container-color, var(--md-sys-color-surface, #fef7ff));--_container-elevation: var(--md-primary-tab-container-elevation, 0);--_container-height: var(--md-primary-tab-container-height, 48px);--_with-icon-and-label-text-container-height: var(--md-primary-tab-with-icon-and-label-text-container-height, 64px);--_hover-state-layer-color: var(--md-primary-tab-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-opacity: var(--md-primary-tab-hover-state-layer-opacity, 0.08);--_pressed-state-layer-color: var(--md-primary-tab-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-primary-tab-pressed-state-layer-opacity, 0.12);--_active-focus-icon-color: var(--md-primary-tab-active-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_active-hover-icon-color: var(--md-primary-tab-active-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_active-icon-color: var(--md-primary-tab-active-icon-color, var(--md-sys-color-primary, #6750a4));--_active-pressed-icon-color: var(--md-primary-tab-active-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-primary-tab-icon-size, 24px);--_focus-icon-color: var(--md-primary-tab-focus-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-icon-color: var(--md-primary-tab-hover-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_icon-color: var(--md-primary-tab-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-icon-color: var(--md-primary-tab-pressed-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_label-text-font: var(--md-primary-tab-label-text-font, var(--md-sys-typescale-title-small-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-primary-tab-label-text-line-height, var(--md-sys-typescale-title-small-line-height, 1.25rem));--_label-text-size: var(--md-primary-tab-label-text-size, var(--md-sys-typescale-title-small-size, 0.875rem));--_label-text-weight: var(--md-primary-tab-label-text-weight, var(--md-sys-typescale-title-small-weight, var(--md-ref-typeface-weight-medium, 500)));--_active-focus-label-text-color: var(--md-primary-tab-active-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_active-hover-label-text-color: var(--md-primary-tab-active-hover-label-text-color, var(--md-sys-color-primary, #6750a4));--_active-label-text-color: var(--md-primary-tab-active-label-text-color, var(--md-sys-color-primary, #6750a4));--_active-pressed-label-text-color: var(--md-primary-tab-active-pressed-label-text-color, var(--md-sys-color-primary, #6750a4));--_focus-label-text-color: var(--md-primary-tab-focus-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-primary-tab-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_label-text-color: var(--md-primary-tab-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-label-text-color: var(--md-primary-tab-pressed-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_container-shape-start-start: var(--md-primary-tab-container-shape-start-start, var(--md-primary-tab-container-shape, var(--md-sys-shape-corner-none, 0px)));--_container-shape-start-end: var(--md-primary-tab-container-shape-start-end, var(--md-primary-tab-container-shape, var(--md-sys-shape-corner-none, 0px)));--_container-shape-end-end: var(--md-primary-tab-container-shape-end-end, var(--md-primary-tab-container-shape, var(--md-sys-shape-corner-none, 0px)));--_container-shape-end-start: var(--md-primary-tab-container-shape-end-start, var(--md-primary-tab-container-shape, var(--md-sys-shape-corner-none, 0px)))}.content.stacked{flex-direction:column;gap:2px}.content.stacked.has-icon.has-label{height:var(--_with-icon-and-label-text-container-height)}
`;Xn.styleSheet;/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Da=S`:host{display:inline-flex;align-items:center;justify-content:center;outline:none;padding:0 16px;position:relative;-webkit-tap-highlight-color:rgba(0,0,0,0);vertical-align:middle;user-select:none;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);color:var(--_label-text-color);z-index:0;--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity);--md-elevation-level: var(--_container-elevation)}md-focus-ring{--md-focus-ring-shape: 8px}:host([active]) md-focus-ring{margin-bottom:calc(var(--_active-indicator-height) + 1px)}.button::before{background:var(--_container-color);content:"";inset:0;position:absolute;z-index:-1}.button::before,md-ripple,md-elevation{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-end-radius:var(--_container-shape-end-end);border-end-start-radius:var(--_container-shape-end-start)}.content{position:relative;box-sizing:border-box;display:inline-flex;flex-direction:row;align-items:center;justify-content:center;height:var(--_container-height);gap:8px}.indicator{position:absolute;box-sizing:border-box;z-index:-1;transform-origin:bottom left;background:var(--_active-indicator-color);border-radius:var(--_active-indicator-shape);height:var(--_active-indicator-height);inset:auto 0 0 0;opacity:0}::slotted([slot=icon]){display:inline-flex;position:relative;writing-mode:horizontal-tb;fill:currentColor;color:var(--_icon-color);font-size:var(--_icon-size);width:var(--_icon-size);height:var(--_icon-size)}:host(:hover){color:var(--_hover-label-text-color);cursor:pointer}:host(:hover) ::slotted([slot=icon]){color:var(--_hover-icon-color)}:host(:focus){color:var(--_focus-label-text-color)}:host(:focus) ::slotted([slot=icon]){color:var(--_focus-icon-color)}:host(:active){color:var(--_pressed-label-text-color)}:host(:active) ::slotted([slot=icon]){color:var(--_pressed-icon-color)}:host([active]) .indicator{opacity:1}:host([active]){color:var(--_active-label-text-color);--md-ripple-hover-color: var(--_active-hover-state-layer-color);--md-ripple-hover-opacity: var(--_active-hover-state-layer-opacity);--md-ripple-pressed-color: var(--_active-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_active-pressed-state-layer-opacity)}:host([active]) ::slotted([slot=icon]){color:var(--_active-icon-color)}:host([active]:hover){color:var(--_active-hover-label-text-color)}:host([active]:hover) ::slotted([slot=icon]){color:var(--_active-hover-icon-color)}:host([active]:focus){color:var(--_active-focus-label-text-color)}:host([active]:focus) ::slotted([slot=icon]){color:var(--_active-focus-icon-color)}:host([active]:active){color:var(--_active-pressed-label-text-color)}:host([active]:active) ::slotted([slot=icon]){color:var(--_active-pressed-icon-color)}:host,::slotted(*){white-space:nowrap}@media(forced-colors: active){.indicator{background:CanvasText}}
`;Da.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let ra=class extends Yn{};ra.styles=[Da,Xn];ra=l([E("md-primary-tab")],ra);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class bd extends Fe{constructor(){super(...arguments),this.fullWidthIndicator=!0}}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Zn=S`:host{--_active-indicator-color: var(--md-secondary-tab-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_active-indicator-height: var(--md-secondary-tab-active-indicator-height, 2px);--_active-label-text-color: var(--md-secondary-tab-active-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_container-color: var(--md-secondary-tab-container-color, var(--md-sys-color-surface, #fef7ff));--_container-elevation: var(--md-secondary-tab-container-elevation, 0);--_container-height: var(--md-secondary-tab-container-height, 48px);--_focus-label-text-color: var(--md-secondary-tab-focus-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-secondary-tab-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-color: var(--md-secondary-tab-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-opacity: var(--md-secondary-tab-hover-state-layer-opacity, 0.08);--_label-text-font: var(--md-secondary-tab-label-text-font, var(--md-sys-typescale-title-small-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-secondary-tab-label-text-line-height, var(--md-sys-typescale-title-small-line-height, 1.25rem));--_label-text-size: var(--md-secondary-tab-label-text-size, var(--md-sys-typescale-title-small-size, 0.875rem));--_label-text-weight: var(--md-secondary-tab-label-text-weight, var(--md-sys-typescale-title-small-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-label-text-color: var(--md-secondary-tab-pressed-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_pressed-state-layer-color: var(--md-secondary-tab-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_pressed-state-layer-opacity: var(--md-secondary-tab-pressed-state-layer-opacity, 0.12);--_active-focus-icon-color: var(--md-secondary-tab-active-focus-icon-color, );--_active-focus-label-text-color: var(--md-secondary-tab-active-focus-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_active-hover-icon-color: var(--md-secondary-tab-active-hover-icon-color, );--_active-hover-label-text-color: var(--md-secondary-tab-active-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_active-hover-state-layer-color: var(--md-secondary-tab-active-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_active-hover-state-layer-opacity: var(--md-secondary-tab-active-hover-state-layer-opacity, 0.08);--_active-icon-color: var(--md-secondary-tab-active-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_active-indicator-shape: var(--md-secondary-tab-active-indicator-shape, 0);--_active-pressed-icon-color: var(--md-secondary-tab-active-pressed-icon-color, );--_active-pressed-label-text-color: var(--md-secondary-tab-active-pressed-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_active-pressed-state-layer-color: var(--md-secondary-tab-active-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_active-pressed-state-layer-opacity: var(--md-secondary-tab-active-pressed-state-layer-opacity, 0.12);--_label-text-color: var(--md-secondary-tab-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-icon-color: var(--md-secondary-tab-focus-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-icon-color: var(--md-secondary-tab-hover-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_icon-size: var(--md-secondary-tab-icon-size, 24px);--_icon-color: var(--md-secondary-tab-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-icon-color: var(--md-secondary-tab-pressed-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_container-shape-start-start: var(--md-secondary-tab-container-shape-start-start, var(--md-secondary-tab-container-shape, var(--md-sys-shape-corner-none, 0px)));--_container-shape-start-end: var(--md-secondary-tab-container-shape-start-end, var(--md-secondary-tab-container-shape, var(--md-sys-shape-corner-none, 0px)));--_container-shape-end-end: var(--md-secondary-tab-container-shape-end-end, var(--md-secondary-tab-container-shape, var(--md-sys-shape-corner-none, 0px)));--_container-shape-end-start: var(--md-secondary-tab-container-shape-end-start, var(--md-secondary-tab-container-shape, var(--md-sys-shape-corner-none, 0px)))}
`;Zn.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let oa=class extends bd{};oa.styles=[Da,Zn];oa=l([E("md-secondary-tab")],oa);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Lt extends O{get activeTab(){return this.tabs.find(e=>e.active)??null}set activeTab(e){e&&this.activateTab(e)}get activeTabIndex(){return this.tabs.findIndex(e=>e.active)}set activeTabIndex(e){const t=()=>{const r=this.tabs[e];r&&this.activateTab(r)};if(!this.slotElement){this.updateComplete.then(t);return}t()}get focusedTab(){return this.tabs.find(e=>e.matches(":focus-within"))}constructor(){super(),this.autoActivate=!1,this.internals=this.attachInternals(),this.internals.role="tablist",this.addEventListener("keydown",this.handleKeydown.bind(this)),this.addEventListener("keyup",this.handleKeyup.bind(this)),this.addEventListener("focusout",this.handleFocusout.bind(this))}async scrollToTab(e){await this.updateComplete;const{tabs:t}=this;if(e??(e=this.activeTab),!e||!t.includes(e)||!this.tabsScrollerElement)return;for(const g of this.tabs)await g.updateComplete;const r=e.offsetLeft,a=e.offsetWidth,i=this.scrollLeft,n=this.offsetWidth,s=48,d=r-s,c=r+a-n+s,p=Math.min(d,Math.max(c,i)),v=this.focusedTab?"auto":"instant";this.tabsScrollerElement.scrollTo({behavior:v,top:0,left:p})}render(){return h`
      <div class="tabs">
        <slot
          @slotchange=${this.handleSlotChange}
          @click=${this.handleTabClick}></slot>
      </div>
      <md-divider part="divider"></md-divider>
    `}async handleTabClick(e){const t=e.target;await 0,!(e.defaultPrevented||!gd(t)||t.active)&&this.activateTab(t)}activateTab(e){const{tabs:t}=this,r=this.activeTab;if(!(!t.includes(e)||r===e)){for(const a of t)a.active=a===e;if(r){if(!this.dispatchEvent(new Event("change",{bubbles:!0,cancelable:!0}))){for(const i of t)i.active=i===r;return}e[Wn](r)}this.updateFocusableTab(e),this.scrollToTab(e)}}updateFocusableTab(e){for(const t of this.tabs)t.tabIndex=t===e?0:-1}async handleKeydown(e){await 0;const t=e.key==="ArrowLeft",r=e.key==="ArrowRight",a=e.key==="Home",i=e.key==="End";if(e.defaultPrevented||!t&&!r&&!a&&!i)return;const{tabs:n}=this;if(n.length<2)return;e.preventDefault();let s;if(a||i)s=a?0:n.length-1;else{const p=getComputedStyle(this).direction==="rtl"?t:r,{focusedTab:v}=this;if(!v)s=p?0:n.length-1;else{const g=this.tabs.indexOf(v);s=p?g+1:g-1,s>=n.length?s=0:s<0&&(s=n.length-1)}}const d=n[s];d.focus(),this.autoActivate?this.activateTab(d):this.updateFocusableTab(d)}handleKeyup(){this.scrollToTab(this.focusedTab??this.activeTab)}handleFocusout(){if(this.matches(":focus-within"))return;const{activeTab:e}=this;e&&this.updateFocusableTab(e)}handleSlotChange(){const e=this.tabs[0];!this.activeTab&&e&&this.activateTab(e),this.scrollToTab(this.activeTab)}}l([ce({flatten:!0,selector:"[md-tab]"})],Lt.prototype,"tabs",void 0);l([u({type:Number,attribute:"active-tab-index"})],Lt.prototype,"activeTabIndex",null);l([u({type:Boolean,attribute:"auto-activate"})],Lt.prototype,"autoActivate",void 0);l([U(".tabs")],Lt.prototype,"tabsScrollerElement",void 0);l([U("slot")],Lt.prototype,"slotElement",void 0);function gd(o){return o instanceof HTMLElement&&o.hasAttribute("md-tab")}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Qn=S`:host{box-sizing:border-box;display:flex;flex-direction:column;overflow:auto;scroll-behavior:smooth;scrollbar-width:none;position:relative}:host([hidden]){display:none}:host::-webkit-scrollbar{display:none}.tabs{align-items:end;display:flex;height:100%;overflow:inherit;scroll-behavior:inherit;scrollbar-width:inherit;justify-content:space-between;width:100%}::slotted(*){flex:1}::slotted([active]){z-index:1}
`;Qn.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let aa=class extends Lt{};aa.styles=[Qn];aa=l([E("md-tabs")],aa);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Jn=S`:host{--_active-indicator-color: var(--md-filled-text-field-active-indicator-color, var(--md-sys-color-on-surface-variant, #49454f));--_active-indicator-height: var(--md-filled-text-field-active-indicator-height, 1px);--_caret-color: var(--md-filled-text-field-caret-color, var(--md-sys-color-primary, #6750a4));--_container-color: var(--md-filled-text-field-container-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_disabled-active-indicator-color: var(--md-filled-text-field-disabled-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-active-indicator-height: var(--md-filled-text-field-disabled-active-indicator-height, 1px);--_disabled-active-indicator-opacity: var(--md-filled-text-field-disabled-active-indicator-opacity, 0.38);--_disabled-container-color: var(--md-filled-text-field-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-opacity: var(--md-filled-text-field-disabled-container-opacity, 0.04);--_disabled-input-text-color: var(--md-filled-text-field-disabled-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-input-text-opacity: var(--md-filled-text-field-disabled-input-text-opacity, 0.38);--_disabled-label-text-color: var(--md-filled-text-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filled-text-field-disabled-label-text-opacity, 0.38);--_disabled-leading-icon-color: var(--md-filled-text-field-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-icon-opacity: var(--md-filled-text-field-disabled-leading-icon-opacity, 0.38);--_disabled-supporting-text-color: var(--md-filled-text-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-supporting-text-opacity: var(--md-filled-text-field-disabled-supporting-text-opacity, 0.38);--_disabled-trailing-icon-color: var(--md-filled-text-field-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-icon-opacity: var(--md-filled-text-field-disabled-trailing-icon-opacity, 0.38);--_error-active-indicator-color: var(--md-filled-text-field-error-active-indicator-color, var(--md-sys-color-error, #b3261e));--_error-focus-active-indicator-color: var(--md-filled-text-field-error-focus-active-indicator-color, var(--md-sys-color-error, #b3261e));--_error-focus-caret-color: var(--md-filled-text-field-error-focus-caret-color, var(--md-sys-color-error, #b3261e));--_error-focus-input-text-color: var(--md-filled-text-field-error-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-focus-label-text-color: var(--md-filled-text-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-leading-icon-color: var(--md-filled-text-field-error-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-focus-supporting-text-color: var(--md-filled-text-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-trailing-icon-color: var(--md-filled-text-field-error-focus-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_error-hover-active-indicator-color: var(--md-filled-text-field-error-hover-active-indicator-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-input-text-color: var(--md-filled-text-field-error-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-label-text-color: var(--md-filled-text-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-leading-icon-color: var(--md-filled-text-field-error-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-hover-state-layer-color: var(--md-filled-text-field-error-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-state-layer-opacity: var(--md-filled-text-field-error-hover-state-layer-opacity, 0.08);--_error-hover-supporting-text-color: var(--md-filled-text-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-hover-trailing-icon-color: var(--md-filled-text-field-error-hover-trailing-icon-color, var(--md-sys-color-on-error-container, #410e0b));--_error-input-text-color: var(--md-filled-text-field-error-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-label-text-color: var(--md-filled-text-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_error-leading-icon-color: var(--md-filled-text-field-error-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-supporting-text-color: var(--md-filled-text-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-trailing-icon-color: var(--md-filled-text-field-error-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_focus-active-indicator-color: var(--md-filled-text-field-focus-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_focus-active-indicator-height: var(--md-filled-text-field-focus-active-indicator-height, 3px);--_focus-input-text-color: var(--md-filled-text-field-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_focus-label-text-color: var(--md-filled-text-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_focus-leading-icon-color: var(--md-filled-text-field-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-supporting-text-color: var(--md-filled-text-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-trailing-icon-color: var(--md-filled-text-field-focus-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-active-indicator-color: var(--md-filled-text-field-hover-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-active-indicator-height: var(--md-filled-text-field-hover-active-indicator-height, 1px);--_hover-input-text-color: var(--md-filled-text-field-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-filled-text-field-hover-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-leading-icon-color: var(--md-filled-text-field-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-filled-text-field-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-opacity: var(--md-filled-text-field-hover-state-layer-opacity, 0.08);--_hover-supporting-text-color: var(--md-filled-text-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-icon-color: var(--md-filled-text-field-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-color: var(--md-filled-text-field-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_input-text-font: var(--md-filled-text-field-input-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_input-text-line-height: var(--md-filled-text-field-input-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_input-text-placeholder-color: var(--md-filled-text-field-input-text-placeholder-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-prefix-color: var(--md-filled-text-field-input-text-prefix-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-size: var(--md-filled-text-field-input-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_input-text-suffix-color: var(--md-filled-text-field-input-text-suffix-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-weight: var(--md-filled-text-field-input-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_label-text-color: var(--md-filled-text-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-font: var(--md-filled-text-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filled-text-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_label-text-populated-line-height: var(--md-filled-text-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_label-text-populated-size: var(--md-filled-text-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_label-text-size: var(--md-filled-text-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_label-text-weight: var(--md-filled-text-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_leading-icon-color: var(--md-filled-text-field-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_leading-icon-size: var(--md-filled-text-field-leading-icon-size, 24px);--_supporting-text-color: var(--md-filled-text-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_supporting-text-font: var(--md-filled-text-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_supporting-text-line-height: var(--md-filled-text-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_supporting-text-size: var(--md-filled-text-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_supporting-text-weight: var(--md-filled-text-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_trailing-icon-color: var(--md-filled-text-field-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-icon-size: var(--md-filled-text-field-trailing-icon-size, 24px);--_container-shape-start-start: var(--md-filled-text-field-container-shape-start-start, var(--md-filled-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-start-end: var(--md-filled-text-field-container-shape-start-end, var(--md-filled-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-end: var(--md-filled-text-field-container-shape-end-end, var(--md-filled-text-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--_container-shape-end-start: var(--md-filled-text-field-container-shape-end-start, var(--md-filled-text-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--_icon-input-space: var(--md-filled-text-field-icon-input-space, 16px);--_leading-space: var(--md-filled-text-field-leading-space, 16px);--_trailing-space: var(--md-filled-text-field-trailing-space, 16px);--_top-space: var(--md-filled-text-field-top-space, 16px);--_bottom-space: var(--md-filled-text-field-bottom-space, 16px);--_input-text-prefix-trailing-space: var(--md-filled-text-field-input-text-prefix-trailing-space, 2px);--_input-text-suffix-leading-space: var(--md-filled-text-field-input-text-suffix-leading-space, 2px);--_with-label-top-space: var(--md-filled-text-field-with-label-top-space, 8px);--_with-label-bottom-space: var(--md-filled-text-field-with-label-bottom-space, 8px);--_focus-caret-color: var(--md-filled-text-field-focus-caret-color, var(--md-sys-color-primary, #6750a4));--_with-leading-icon-leading-space: var(--md-filled-text-field-with-leading-icon-leading-space, 12px);--_with-trailing-icon-trailing-space: var(--md-filled-text-field-with-trailing-icon-trailing-space, 12px);--md-filled-field-active-indicator-color: var(--_active-indicator-color);--md-filled-field-active-indicator-height: var(--_active-indicator-height);--md-filled-field-bottom-space: var(--_bottom-space);--md-filled-field-container-color: var(--_container-color);--md-filled-field-container-shape-end-end: var(--_container-shape-end-end);--md-filled-field-container-shape-end-start: var(--_container-shape-end-start);--md-filled-field-container-shape-start-end: var(--_container-shape-start-end);--md-filled-field-container-shape-start-start: var(--_container-shape-start-start);--md-filled-field-content-color: var(--_input-text-color);--md-filled-field-content-font: var(--_input-text-font);--md-filled-field-content-line-height: var(--_input-text-line-height);--md-filled-field-content-size: var(--_input-text-size);--md-filled-field-content-space: var(--_icon-input-space);--md-filled-field-content-weight: var(--_input-text-weight);--md-filled-field-disabled-active-indicator-color: var(--_disabled-active-indicator-color);--md-filled-field-disabled-active-indicator-height: var(--_disabled-active-indicator-height);--md-filled-field-disabled-active-indicator-opacity: var(--_disabled-active-indicator-opacity);--md-filled-field-disabled-container-color: var(--_disabled-container-color);--md-filled-field-disabled-container-opacity: var(--_disabled-container-opacity);--md-filled-field-disabled-content-color: var(--_disabled-input-text-color);--md-filled-field-disabled-content-opacity: var(--_disabled-input-text-opacity);--md-filled-field-disabled-label-text-color: var(--_disabled-label-text-color);--md-filled-field-disabled-label-text-opacity: var(--_disabled-label-text-opacity);--md-filled-field-disabled-leading-content-color: var(--_disabled-leading-icon-color);--md-filled-field-disabled-leading-content-opacity: var(--_disabled-leading-icon-opacity);--md-filled-field-disabled-supporting-text-color: var(--_disabled-supporting-text-color);--md-filled-field-disabled-supporting-text-opacity: var(--_disabled-supporting-text-opacity);--md-filled-field-disabled-trailing-content-color: var(--_disabled-trailing-icon-color);--md-filled-field-disabled-trailing-content-opacity: var(--_disabled-trailing-icon-opacity);--md-filled-field-error-active-indicator-color: var(--_error-active-indicator-color);--md-filled-field-error-content-color: var(--_error-input-text-color);--md-filled-field-error-focus-active-indicator-color: var(--_error-focus-active-indicator-color);--md-filled-field-error-focus-content-color: var(--_error-focus-input-text-color);--md-filled-field-error-focus-label-text-color: var(--_error-focus-label-text-color);--md-filled-field-error-focus-leading-content-color: var(--_error-focus-leading-icon-color);--md-filled-field-error-focus-supporting-text-color: var(--_error-focus-supporting-text-color);--md-filled-field-error-focus-trailing-content-color: var(--_error-focus-trailing-icon-color);--md-filled-field-error-hover-active-indicator-color: var(--_error-hover-active-indicator-color);--md-filled-field-error-hover-content-color: var(--_error-hover-input-text-color);--md-filled-field-error-hover-label-text-color: var(--_error-hover-label-text-color);--md-filled-field-error-hover-leading-content-color: var(--_error-hover-leading-icon-color);--md-filled-field-error-hover-state-layer-color: var(--_error-hover-state-layer-color);--md-filled-field-error-hover-state-layer-opacity: var(--_error-hover-state-layer-opacity);--md-filled-field-error-hover-supporting-text-color: var(--_error-hover-supporting-text-color);--md-filled-field-error-hover-trailing-content-color: var(--_error-hover-trailing-icon-color);--md-filled-field-error-label-text-color: var(--_error-label-text-color);--md-filled-field-error-leading-content-color: var(--_error-leading-icon-color);--md-filled-field-error-supporting-text-color: var(--_error-supporting-text-color);--md-filled-field-error-trailing-content-color: var(--_error-trailing-icon-color);--md-filled-field-focus-active-indicator-color: var(--_focus-active-indicator-color);--md-filled-field-focus-active-indicator-height: var(--_focus-active-indicator-height);--md-filled-field-focus-content-color: var(--_focus-input-text-color);--md-filled-field-focus-label-text-color: var(--_focus-label-text-color);--md-filled-field-focus-leading-content-color: var(--_focus-leading-icon-color);--md-filled-field-focus-supporting-text-color: var(--_focus-supporting-text-color);--md-filled-field-focus-trailing-content-color: var(--_focus-trailing-icon-color);--md-filled-field-hover-active-indicator-color: var(--_hover-active-indicator-color);--md-filled-field-hover-active-indicator-height: var(--_hover-active-indicator-height);--md-filled-field-hover-content-color: var(--_hover-input-text-color);--md-filled-field-hover-label-text-color: var(--_hover-label-text-color);--md-filled-field-hover-leading-content-color: var(--_hover-leading-icon-color);--md-filled-field-hover-state-layer-color: var(--_hover-state-layer-color);--md-filled-field-hover-state-layer-opacity: var(--_hover-state-layer-opacity);--md-filled-field-hover-supporting-text-color: var(--_hover-supporting-text-color);--md-filled-field-hover-trailing-content-color: var(--_hover-trailing-icon-color);--md-filled-field-label-text-color: var(--_label-text-color);--md-filled-field-label-text-font: var(--_label-text-font);--md-filled-field-label-text-line-height: var(--_label-text-line-height);--md-filled-field-label-text-populated-line-height: var(--_label-text-populated-line-height);--md-filled-field-label-text-populated-size: var(--_label-text-populated-size);--md-filled-field-label-text-size: var(--_label-text-size);--md-filled-field-label-text-weight: var(--_label-text-weight);--md-filled-field-leading-content-color: var(--_leading-icon-color);--md-filled-field-leading-space: var(--_leading-space);--md-filled-field-supporting-text-color: var(--_supporting-text-color);--md-filled-field-supporting-text-font: var(--_supporting-text-font);--md-filled-field-supporting-text-line-height: var(--_supporting-text-line-height);--md-filled-field-supporting-text-size: var(--_supporting-text-size);--md-filled-field-supporting-text-weight: var(--_supporting-text-weight);--md-filled-field-top-space: var(--_top-space);--md-filled-field-trailing-content-color: var(--_trailing-icon-color);--md-filled-field-trailing-space: var(--_trailing-space);--md-filled-field-with-label-bottom-space: var(--_with-label-bottom-space);--md-filled-field-with-label-top-space: var(--_with-label-top-space);--md-filled-field-with-leading-content-leading-space: var(--_with-leading-icon-leading-space);--md-filled-field-with-trailing-content-trailing-space: var(--_with-trailing-icon-trailing-space)}
`;Jn.styleSheet;/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const yd=o=>o.strings===void 0,xd={},_d=(o,e=xd)=>o._$AH=e;/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const yi=Ca(class extends Sa{constructor(o){if(super(o),o.type!==Ze.PROPERTY&&o.type!==Ze.ATTRIBUTE&&o.type!==Ze.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!yd(o))throw Error("`live` bindings can only contain a single expression")}render(o){return o}update(o,[e]){if(e===Ae||e===b)return e;const t=o.element,r=o.name;if(o.type===Ze.PROPERTY){if(e===t[r])return Ae}else if(o.type===Ze.BOOLEAN_ATTRIBUTE){if(!!e===t.hasAttribute(r))return Ae}else if(o.type===Ze.ATTRIBUTE&&t.getAttribute(r)===e+"")return Ae;return _d(o),e}});/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const wd={fromAttribute(o){return o??""},toAttribute(o){return o||null}};/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class kd extends Mr{computeValidity({state:e,renderedControl:t}){let r=t;Bt(e)&&!r?(r=this.inputControl||document.createElement("input"),this.inputControl=r):r||(r=this.textAreaControl||document.createElement("textarea"),this.textAreaControl=r);const a=Bt(e)?r:null;if(a&&(a.type=e.type),r.value!==e.value&&(r.value=e.value),r.required=e.required,a){const i=e;i.pattern?a.pattern=i.pattern:a.removeAttribute("pattern"),i.min?a.min=i.min:a.removeAttribute("min"),i.max?a.max=i.max:a.removeAttribute("max"),i.step?a.step=i.step:a.removeAttribute("step")}return(e.minLength??-1)>-1?r.setAttribute("minlength",String(e.minLength)):r.removeAttribute("minlength"),(e.maxLength??-1)>-1?r.setAttribute("maxlength",String(e.maxLength)):r.removeAttribute("maxlength"),{validity:r.validity,validationMessage:r.validationMessage}}equals({state:e},{state:t}){const r=e.type===t.type&&e.value===t.value&&e.required===t.required&&e.minLength===t.minLength&&e.maxLength===t.maxLength;return!Bt(e)||!Bt(t)?r:r&&e.pattern===t.pattern&&e.min===t.min&&e.max===t.max&&e.step===t.step}copy({state:e}){return{state:Bt(e)?this.copyInput(e):this.copyTextArea(e),renderedControl:null}}copyInput(e){const{type:t,pattern:r,min:a,max:i,step:n}=e;return{...this.copySharedState(e),type:t,pattern:r,min:a,max:i,step:n}}copyTextArea(e){return{...this.copySharedState(e),type:e.type}}copySharedState({value:e,required:t,minLength:r,maxLength:a}){return{value:e,required:t,minLength:r,maxLength:a}}}function Bt(o){return o.type!=="textarea"}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Cd=ue(Hn(tr(it(at(O)))));class q extends Cd{constructor(){super(...arguments),this.error=!1,this.errorText="",this.label="",this.noAsterisk=!1,this.required=!1,this.value="",this.prefixText="",this.suffixText="",this.hasLeadingIcon=!1,this.hasTrailingIcon=!1,this.supportingText="",this.textDirection="",this.rows=2,this.cols=20,this.inputMode="",this.max="",this.maxLength=-1,this.min="",this.minLength=-1,this.noSpinner=!1,this.pattern="",this.placeholder="",this.readOnly=!1,this.multiple=!1,this.step="",this.type="text",this.autocomplete="",this.dirty=!1,this.focused=!1,this.nativeError=!1,this.nativeErrorText=""}get selectionDirection(){return this.getInputOrTextarea().selectionDirection}set selectionDirection(e){this.getInputOrTextarea().selectionDirection=e}get selectionEnd(){return this.getInputOrTextarea().selectionEnd}set selectionEnd(e){this.getInputOrTextarea().selectionEnd=e}get selectionStart(){return this.getInputOrTextarea().selectionStart}set selectionStart(e){this.getInputOrTextarea().selectionStart=e}get valueAsNumber(){const e=this.getInput();return e?e.valueAsNumber:NaN}set valueAsNumber(e){const t=this.getInput();t&&(t.valueAsNumber=e,this.value=t.value)}get valueAsDate(){const e=this.getInput();return e?e.valueAsDate:null}set valueAsDate(e){const t=this.getInput();t&&(t.valueAsDate=e,this.value=t.value)}get hasError(){return this.error||this.nativeError}select(){this.getInputOrTextarea().select()}setRangeText(...e){this.getInputOrTextarea().setRangeText(...e),this.value=this.getInputOrTextarea().value}setSelectionRange(e,t,r){this.getInputOrTextarea().setSelectionRange(e,t,r)}showPicker(){const e=this.getInput();e&&e.showPicker()}stepDown(e){const t=this.getInput();t&&(t.stepDown(e),this.value=t.value)}stepUp(e){const t=this.getInput();t&&(t.stepUp(e),this.value=t.value)}reset(){this.dirty=!1,this.value=this.getAttribute("value")??"",this.nativeError=!1,this.nativeErrorText=""}attributeChangedCallback(e,t,r){e==="value"&&this.dirty||super.attributeChangedCallback(e,t,r)}render(){const e={disabled:this.disabled,error:!this.disabled&&this.hasError,textarea:this.type==="textarea","no-spinner":this.noSpinner};return h`
      <span class="text-field ${Q(e)}">
        ${this.renderField()}
      </span>
    `}updated(e){const t=this.getInputOrTextarea().value;this.value!==t&&(this.value=t)}renderField(){return ar`<${this.fieldTag}
      class="field"
      count=${this.value.length}
      ?disabled=${this.disabled}
      ?error=${this.hasError}
      error-text=${this.getErrorText()}
      ?focused=${this.focused}
      ?has-end=${this.hasTrailingIcon}
      ?has-start=${this.hasLeadingIcon}
      label=${this.label}
      ?no-asterisk=${this.noAsterisk}
      max=${this.maxLength}
      ?populated=${!!this.value}
      ?required=${this.required}
      ?resizable=${this.type==="textarea"}
      supporting-text=${this.supportingText}
    >
      ${this.renderLeadingIcon()}
      ${this.renderInputOrTextarea()}
      ${this.renderTrailingIcon()}
      <div id="description" slot="aria-describedby"></div>
      <slot name="container" slot="container"></slot>
    </${this.fieldTag}>`}renderLeadingIcon(){return h`
      <span class="icon leading" slot="start">
        <slot name="leading-icon" @slotchange=${this.handleIconChange}></slot>
      </span>
    `}renderTrailingIcon(){return h`
      <span class="icon trailing" slot="end">
        <slot name="trailing-icon" @slotchange=${this.handleIconChange}></slot>
      </span>
    `}renderInputOrTextarea(){const e={direction:this.textDirection},t=this.ariaLabel||this.label||b,r=this.autocomplete,a=(this.maxLength??-1)>-1,i=(this.minLength??-1)>-1;if(this.type==="textarea")return h`
        <textarea
          class="input"
          style=${yt(e)}
          aria-describedby="description"
          aria-invalid=${this.hasError}
          aria-label=${t}
          autocomplete=${r||b}
          name=${this.name||b}
          ?disabled=${this.disabled}
          maxlength=${a?this.maxLength:b}
          minlength=${i?this.minLength:b}
          placeholder=${this.placeholder||b}
          ?readonly=${this.readOnly}
          ?required=${this.required}
          rows=${this.rows}
          cols=${this.cols}
          .value=${yi(this.value)}
          @change=${this.redispatchEvent}
          @focus=${this.handleFocusChange}
          @blur=${this.handleFocusChange}
          @input=${this.handleInput}
          @select=${this.redispatchEvent}></textarea>
      `;const n=this.renderPrefix(),s=this.renderSuffix(),d=this.inputMode;return h`
      <div class="input-wrapper">
        ${n}
        <input
          class="input"
          style=${yt(e)}
          aria-describedby="description"
          aria-invalid=${this.hasError}
          aria-label=${t}
          autocomplete=${r||b}
          name=${this.name||b}
          ?disabled=${this.disabled}
          inputmode=${d||b}
          max=${this.max||b}
          maxlength=${a?this.maxLength:b}
          min=${this.min||b}
          minlength=${i?this.minLength:b}
          pattern=${this.pattern||b}
          placeholder=${this.placeholder||b}
          ?readonly=${this.readOnly}
          ?required=${this.required}
          ?multiple=${this.multiple}
          step=${this.step||b}
          type=${this.type}
          .value=${yi(this.value)}
          @change=${this.redispatchEvent}
          @focus=${this.handleFocusChange}
          @blur=${this.handleFocusChange}
          @input=${this.handleInput}
          @select=${this.redispatchEvent} />
        ${s}
      </div>
    `}renderPrefix(){return this.renderAffix(this.prefixText,!1)}renderSuffix(){return this.renderAffix(this.suffixText,!0)}renderAffix(e,t){return e?h`<span class="${Q({suffix:t,prefix:!t})}">${e}</span>`:b}getErrorText(){return this.error?this.errorText:this.nativeErrorText}handleFocusChange(){var e;this.focused=((e=this.inputOrTextarea)==null?void 0:e.matches(":focus"))??!1}handleInput(e){this.dirty=!0,this.value=e.target.value}redispatchEvent(e){rt(this,e)}getInputOrTextarea(){return this.inputOrTextarea||(this.connectedCallback(),this.scheduleUpdate()),this.isUpdatePending&&this.scheduleUpdate(),this.inputOrTextarea}getInput(){return this.type==="textarea"?null:this.getInputOrTextarea()}handleIconChange(){this.hasLeadingIcon=this.leadingIcons.length>0,this.hasTrailingIcon=this.trailingIcons.length>0}[qe](){return this.value}formResetCallback(){this.reset()}formStateRestoreCallback(e){this.value=e}focus(){this.getInputOrTextarea().focus()}[bt](){return new kd(()=>({state:this,renderedControl:this.inputOrTextarea}))}[gt](){return this.inputOrTextarea}[Ar](e){var r;e==null||e.preventDefault();const t=this.getErrorText();this.nativeError=!!e,this.nativeErrorText=this.validationMessage,t===this.getErrorText()&&((r=this.field)==null||r.reannounceError())}}q.shadowRootOptions={...O.shadowRootOptions,delegatesFocus:!0};l([u({type:Boolean,reflect:!0})],q.prototype,"error",void 0);l([u({attribute:"error-text"})],q.prototype,"errorText",void 0);l([u()],q.prototype,"label",void 0);l([u({type:Boolean,attribute:"no-asterisk"})],q.prototype,"noAsterisk",void 0);l([u({type:Boolean,reflect:!0})],q.prototype,"required",void 0);l([u()],q.prototype,"value",void 0);l([u({attribute:"prefix-text"})],q.prototype,"prefixText",void 0);l([u({attribute:"suffix-text"})],q.prototype,"suffixText",void 0);l([u({type:Boolean,attribute:"has-leading-icon"})],q.prototype,"hasLeadingIcon",void 0);l([u({type:Boolean,attribute:"has-trailing-icon"})],q.prototype,"hasTrailingIcon",void 0);l([u({attribute:"supporting-text"})],q.prototype,"supportingText",void 0);l([u({attribute:"text-direction"})],q.prototype,"textDirection",void 0);l([u({type:Number})],q.prototype,"rows",void 0);l([u({type:Number})],q.prototype,"cols",void 0);l([u({reflect:!0})],q.prototype,"inputMode",void 0);l([u()],q.prototype,"max",void 0);l([u({type:Number})],q.prototype,"maxLength",void 0);l([u()],q.prototype,"min",void 0);l([u({type:Number})],q.prototype,"minLength",void 0);l([u({type:Boolean,attribute:"no-spinner"})],q.prototype,"noSpinner",void 0);l([u()],q.prototype,"pattern",void 0);l([u({reflect:!0,converter:wd})],q.prototype,"placeholder",void 0);l([u({type:Boolean,reflect:!0})],q.prototype,"readOnly",void 0);l([u({type:Boolean,reflect:!0})],q.prototype,"multiple",void 0);l([u()],q.prototype,"step",void 0);l([u({reflect:!0})],q.prototype,"type",void 0);l([u({reflect:!0})],q.prototype,"autocomplete",void 0);l([T()],q.prototype,"dirty",void 0);l([T()],q.prototype,"focused",void 0);l([T()],q.prototype,"nativeError",void 0);l([T()],q.prototype,"nativeErrorText",void 0);l([U(".input")],q.prototype,"inputOrTextarea",void 0);l([U(".field")],q.prototype,"field",void 0);l([ce({slot:"leading-icon"})],q.prototype,"leadingIcons",void 0);l([ce({slot:"trailing-icon"})],q.prototype,"trailingIcons",void 0);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Sd extends q{constructor(){super(...arguments),this.fieldTag=ye`md-filled-field`}}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Fa=S`:host{display:inline-flex;outline:none;resize:both;text-align:start;-webkit-tap-highlight-color:rgba(0,0,0,0)}.text-field,.field{width:100%}.text-field{display:inline-flex}.field{cursor:text}.disabled .field{cursor:default}.text-field,.textarea .field{resize:inherit}slot[name=container]{border-radius:inherit}.icon{color:currentColor;display:flex;align-items:center;justify-content:center;fill:currentColor;position:relative}.icon ::slotted(*){display:flex;position:absolute}[has-start] .icon.leading{font-size:var(--_leading-icon-size);height:var(--_leading-icon-size);width:var(--_leading-icon-size)}[has-end] .icon.trailing{font-size:var(--_trailing-icon-size);height:var(--_trailing-icon-size);width:var(--_trailing-icon-size)}.input-wrapper{display:flex}.input-wrapper>*{all:inherit;padding:0}.input{caret-color:var(--_caret-color);overflow-x:hidden;text-align:inherit}.input::placeholder{color:currentColor;opacity:1}.input::-webkit-calendar-picker-indicator{display:none}.input::-webkit-search-decoration,.input::-webkit-search-cancel-button{display:none}@media(forced-colors: active){.input{background:none}}.no-spinner .input::-webkit-inner-spin-button,.no-spinner .input::-webkit-outer-spin-button{display:none}.no-spinner .input[type=number]{-moz-appearance:textfield}:focus-within .input{caret-color:var(--_focus-caret-color)}.error:focus-within .input{caret-color:var(--_error-focus-caret-color)}.text-field:not(.disabled) .prefix{color:var(--_input-text-prefix-color)}.text-field:not(.disabled) .suffix{color:var(--_input-text-suffix-color)}.text-field:not(.disabled) .input::placeholder{color:var(--_input-text-placeholder-color)}.prefix,.suffix{text-wrap:nowrap;width:min-content}.prefix{padding-inline-end:var(--_input-text-prefix-trailing-space)}.suffix{padding-inline-start:var(--_input-text-suffix-leading-space)}
`;Fa.styleSheet;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let ia=class extends Sd{constructor(){super(...arguments),this.fieldTag=ye`md-filled-field`}};ia.styles=[Fa,Jn];ia=l([E("md-filled-text-field")],ia);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const es=S`:host{--_caret-color: var(--md-outlined-text-field-caret-color, var(--md-sys-color-primary, #6750a4));--_disabled-input-text-color: var(--md-outlined-text-field-disabled-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-input-text-opacity: var(--md-outlined-text-field-disabled-input-text-opacity, 0.38);--_disabled-label-text-color: var(--md-outlined-text-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-outlined-text-field-disabled-label-text-opacity, 0.38);--_disabled-leading-icon-color: var(--md-outlined-text-field-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-icon-opacity: var(--md-outlined-text-field-disabled-leading-icon-opacity, 0.38);--_disabled-outline-color: var(--md-outlined-text-field-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-outlined-text-field-disabled-outline-opacity, 0.12);--_disabled-outline-width: var(--md-outlined-text-field-disabled-outline-width, 1px);--_disabled-supporting-text-color: var(--md-outlined-text-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-supporting-text-opacity: var(--md-outlined-text-field-disabled-supporting-text-opacity, 0.38);--_disabled-trailing-icon-color: var(--md-outlined-text-field-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-icon-opacity: var(--md-outlined-text-field-disabled-trailing-icon-opacity, 0.38);--_error-focus-caret-color: var(--md-outlined-text-field-error-focus-caret-color, var(--md-sys-color-error, #b3261e));--_error-focus-input-text-color: var(--md-outlined-text-field-error-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-focus-label-text-color: var(--md-outlined-text-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-leading-icon-color: var(--md-outlined-text-field-error-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-focus-outline-color: var(--md-outlined-text-field-error-focus-outline-color, var(--md-sys-color-error, #b3261e));--_error-focus-supporting-text-color: var(--md-outlined-text-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-trailing-icon-color: var(--md-outlined-text-field-error-focus-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_error-hover-input-text-color: var(--md-outlined-text-field-error-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-label-text-color: var(--md-outlined-text-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-leading-icon-color: var(--md-outlined-text-field-error-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-hover-outline-color: var(--md-outlined-text-field-error-hover-outline-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-supporting-text-color: var(--md-outlined-text-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-hover-trailing-icon-color: var(--md-outlined-text-field-error-hover-trailing-icon-color, var(--md-sys-color-on-error-container, #410e0b));--_error-input-text-color: var(--md-outlined-text-field-error-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-label-text-color: var(--md-outlined-text-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_error-leading-icon-color: var(--md-outlined-text-field-error-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-outline-color: var(--md-outlined-text-field-error-outline-color, var(--md-sys-color-error, #b3261e));--_error-supporting-text-color: var(--md-outlined-text-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-trailing-icon-color: var(--md-outlined-text-field-error-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_focus-input-text-color: var(--md-outlined-text-field-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_focus-label-text-color: var(--md-outlined-text-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_focus-leading-icon-color: var(--md-outlined-text-field-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-outline-color: var(--md-outlined-text-field-focus-outline-color, var(--md-sys-color-primary, #6750a4));--_focus-outline-width: var(--md-outlined-text-field-focus-outline-width, 3px);--_focus-supporting-text-color: var(--md-outlined-text-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-trailing-icon-color: var(--md-outlined-text-field-focus-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-input-text-color: var(--md-outlined-text-field-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-outlined-text-field-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-leading-icon-color: var(--md-outlined-text-field-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-outline-color: var(--md-outlined-text-field-hover-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-outline-width: var(--md-outlined-text-field-hover-outline-width, 1px);--_hover-supporting-text-color: var(--md-outlined-text-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-icon-color: var(--md-outlined-text-field-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-color: var(--md-outlined-text-field-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_input-text-font: var(--md-outlined-text-field-input-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_input-text-line-height: var(--md-outlined-text-field-input-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_input-text-placeholder-color: var(--md-outlined-text-field-input-text-placeholder-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-prefix-color: var(--md-outlined-text-field-input-text-prefix-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-size: var(--md-outlined-text-field-input-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_input-text-suffix-color: var(--md-outlined-text-field-input-text-suffix-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-weight: var(--md-outlined-text-field-input-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_label-text-color: var(--md-outlined-text-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-font: var(--md-outlined-text-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-outlined-text-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_label-text-populated-line-height: var(--md-outlined-text-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_label-text-populated-size: var(--md-outlined-text-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_label-text-size: var(--md-outlined-text-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_label-text-weight: var(--md-outlined-text-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_leading-icon-color: var(--md-outlined-text-field-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_leading-icon-size: var(--md-outlined-text-field-leading-icon-size, 24px);--_outline-color: var(--md-outlined-text-field-outline-color, var(--md-sys-color-outline, #79747e));--_outline-width: var(--md-outlined-text-field-outline-width, 1px);--_supporting-text-color: var(--md-outlined-text-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_supporting-text-font: var(--md-outlined-text-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_supporting-text-line-height: var(--md-outlined-text-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_supporting-text-size: var(--md-outlined-text-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_supporting-text-weight: var(--md-outlined-text-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_trailing-icon-color: var(--md-outlined-text-field-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-icon-size: var(--md-outlined-text-field-trailing-icon-size, 24px);--_container-shape-start-start: var(--md-outlined-text-field-container-shape-start-start, var(--md-outlined-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-start-end: var(--md-outlined-text-field-container-shape-start-end, var(--md-outlined-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-end: var(--md-outlined-text-field-container-shape-end-end, var(--md-outlined-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-start: var(--md-outlined-text-field-container-shape-end-start, var(--md-outlined-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_icon-input-space: var(--md-outlined-text-field-icon-input-space, 16px);--_leading-space: var(--md-outlined-text-field-leading-space, 16px);--_trailing-space: var(--md-outlined-text-field-trailing-space, 16px);--_top-space: var(--md-outlined-text-field-top-space, 16px);--_bottom-space: var(--md-outlined-text-field-bottom-space, 16px);--_input-text-prefix-trailing-space: var(--md-outlined-text-field-input-text-prefix-trailing-space, 2px);--_input-text-suffix-leading-space: var(--md-outlined-text-field-input-text-suffix-leading-space, 2px);--_focus-caret-color: var(--md-outlined-text-field-focus-caret-color, var(--md-sys-color-primary, #6750a4));--_with-leading-icon-leading-space: var(--md-outlined-text-field-with-leading-icon-leading-space, 12px);--_with-trailing-icon-trailing-space: var(--md-outlined-text-field-with-trailing-icon-trailing-space, 12px);--md-outlined-field-bottom-space: var(--_bottom-space);--md-outlined-field-container-shape-end-end: var(--_container-shape-end-end);--md-outlined-field-container-shape-end-start: var(--_container-shape-end-start);--md-outlined-field-container-shape-start-end: var(--_container-shape-start-end);--md-outlined-field-container-shape-start-start: var(--_container-shape-start-start);--md-outlined-field-content-color: var(--_input-text-color);--md-outlined-field-content-font: var(--_input-text-font);--md-outlined-field-content-line-height: var(--_input-text-line-height);--md-outlined-field-content-size: var(--_input-text-size);--md-outlined-field-content-space: var(--_icon-input-space);--md-outlined-field-content-weight: var(--_input-text-weight);--md-outlined-field-disabled-content-color: var(--_disabled-input-text-color);--md-outlined-field-disabled-content-opacity: var(--_disabled-input-text-opacity);--md-outlined-field-disabled-label-text-color: var(--_disabled-label-text-color);--md-outlined-field-disabled-label-text-opacity: var(--_disabled-label-text-opacity);--md-outlined-field-disabled-leading-content-color: var(--_disabled-leading-icon-color);--md-outlined-field-disabled-leading-content-opacity: var(--_disabled-leading-icon-opacity);--md-outlined-field-disabled-outline-color: var(--_disabled-outline-color);--md-outlined-field-disabled-outline-opacity: var(--_disabled-outline-opacity);--md-outlined-field-disabled-outline-width: var(--_disabled-outline-width);--md-outlined-field-disabled-supporting-text-color: var(--_disabled-supporting-text-color);--md-outlined-field-disabled-supporting-text-opacity: var(--_disabled-supporting-text-opacity);--md-outlined-field-disabled-trailing-content-color: var(--_disabled-trailing-icon-color);--md-outlined-field-disabled-trailing-content-opacity: var(--_disabled-trailing-icon-opacity);--md-outlined-field-error-content-color: var(--_error-input-text-color);--md-outlined-field-error-focus-content-color: var(--_error-focus-input-text-color);--md-outlined-field-error-focus-label-text-color: var(--_error-focus-label-text-color);--md-outlined-field-error-focus-leading-content-color: var(--_error-focus-leading-icon-color);--md-outlined-field-error-focus-outline-color: var(--_error-focus-outline-color);--md-outlined-field-error-focus-supporting-text-color: var(--_error-focus-supporting-text-color);--md-outlined-field-error-focus-trailing-content-color: var(--_error-focus-trailing-icon-color);--md-outlined-field-error-hover-content-color: var(--_error-hover-input-text-color);--md-outlined-field-error-hover-label-text-color: var(--_error-hover-label-text-color);--md-outlined-field-error-hover-leading-content-color: var(--_error-hover-leading-icon-color);--md-outlined-field-error-hover-outline-color: var(--_error-hover-outline-color);--md-outlined-field-error-hover-supporting-text-color: var(--_error-hover-supporting-text-color);--md-outlined-field-error-hover-trailing-content-color: var(--_error-hover-trailing-icon-color);--md-outlined-field-error-label-text-color: var(--_error-label-text-color);--md-outlined-field-error-leading-content-color: var(--_error-leading-icon-color);--md-outlined-field-error-outline-color: var(--_error-outline-color);--md-outlined-field-error-supporting-text-color: var(--_error-supporting-text-color);--md-outlined-field-error-trailing-content-color: var(--_error-trailing-icon-color);--md-outlined-field-focus-content-color: var(--_focus-input-text-color);--md-outlined-field-focus-label-text-color: var(--_focus-label-text-color);--md-outlined-field-focus-leading-content-color: var(--_focus-leading-icon-color);--md-outlined-field-focus-outline-color: var(--_focus-outline-color);--md-outlined-field-focus-outline-width: var(--_focus-outline-width);--md-outlined-field-focus-supporting-text-color: var(--_focus-supporting-text-color);--md-outlined-field-focus-trailing-content-color: var(--_focus-trailing-icon-color);--md-outlined-field-hover-content-color: var(--_hover-input-text-color);--md-outlined-field-hover-label-text-color: var(--_hover-label-text-color);--md-outlined-field-hover-leading-content-color: var(--_hover-leading-icon-color);--md-outlined-field-hover-outline-color: var(--_hover-outline-color);--md-outlined-field-hover-outline-width: var(--_hover-outline-width);--md-outlined-field-hover-supporting-text-color: var(--_hover-supporting-text-color);--md-outlined-field-hover-trailing-content-color: var(--_hover-trailing-icon-color);--md-outlined-field-label-text-color: var(--_label-text-color);--md-outlined-field-label-text-font: var(--_label-text-font);--md-outlined-field-label-text-line-height: var(--_label-text-line-height);--md-outlined-field-label-text-populated-line-height: var(--_label-text-populated-line-height);--md-outlined-field-label-text-populated-size: var(--_label-text-populated-size);--md-outlined-field-label-text-size: var(--_label-text-size);--md-outlined-field-label-text-weight: var(--_label-text-weight);--md-outlined-field-leading-content-color: var(--_leading-icon-color);--md-outlined-field-leading-space: var(--_leading-space);--md-outlined-field-outline-color: var(--_outline-color);--md-outlined-field-outline-width: var(--_outline-width);--md-outlined-field-supporting-text-color: var(--_supporting-text-color);--md-outlined-field-supporting-text-font: var(--_supporting-text-font);--md-outlined-field-supporting-text-line-height: var(--_supporting-text-line-height);--md-outlined-field-supporting-text-size: var(--_supporting-text-size);--md-outlined-field-supporting-text-weight: var(--_supporting-text-weight);--md-outlined-field-top-space: var(--_top-space);--md-outlined-field-trailing-content-color: var(--_trailing-icon-color);--md-outlined-field-trailing-space: var(--_trailing-space);--md-outlined-field-with-leading-content-leading-space: var(--_with-leading-icon-leading-space);--md-outlined-field-with-trailing-content-trailing-space: var(--_with-trailing-icon-trailing-space)}
`;es.styleSheet;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class $d extends q{constructor(){super(...arguments),this.fieldTag=ye`md-outlined-field`}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let na=class extends $d{constructor(){super(...arguments),this.fieldTag=ye`md-outlined-field`}};na.styles=[Fa,es];na=l([E("md-outlined-text-field")],na);/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class ts extends O{constructor(){super(...arguments),this.value=""}render(){const e={"md3-badge--large":this.value};return h`<div class="md3-badge ${Q(e)}">
      <p class="md3-badge__value">${this.value}</p>
    </div>`}}l([u()],ts.prototype,"value",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const rs=S`:host{--_color: var(--md-badge-color, var(--md-sys-color-error, #b3261e));--_large-color: var(--md-badge-large-color, var(--md-sys-color-error, #b3261e));--_large-label-text-color: var(--md-badge-large-label-text-color, var(--md-sys-color-on-error, #fff));--_large-label-text-font: var(--md-badge-large-label-text-font, var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto)));--_large-label-text-line-height: var(--md-badge-large-label-text-line-height, var(--md-sys-typescale-label-small-line-height, 1rem));--_large-label-text-size: var(--md-badge-large-label-text-size, var(--md-sys-typescale-label-small-size, 0.6875rem));--_large-label-text-weight: var(--md-badge-large-label-text-weight, var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500)));--_large-shape: var(--md-badge-large-shape, var(--md-sys-shape-corner-full, 9999px));--_large-size: var(--md-badge-large-size, 16px);--_shape: var(--md-badge-shape, var(--md-sys-shape-corner-full, 9999px));--_size: var(--md-badge-size, 6px)}.md3-badge{inset-inline-start:50%;margin-inline-start:6px;margin-block-start:4px;position:absolute;inset-block-start:0px;background-color:var(--_color);border-radius:var(--_shape);height:var(--_size)}.md3-badge:not(.md3-badge--large){width:var(--_size)}.md3-badge.md3-badge--large{display:flex;flex-direction:column;justify-content:center;margin-inline-start:2px;margin-block-start:1px;background-color:var(--_large-color);border-radius:var(--_large-shape);height:var(--_large-size);min-width:var(--_large-size);color:var(--_large-label-text-color)}.md3-badge.md3-badge--large .md3-badge__value{padding:0px 4px;text-align:center}.md3-badge__value{font-family:var(--_large-label-text-font);font-size:var(--_large-label-text-size);line-height:var(--_large-label-text-line-height);font-weight:var(--_large-label-text-weight)}
`;rs.styleSheet;/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let sa=class extends ts{};sa.styles=[rs];sa=l([E("md-badge")],sa);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Ba extends O{render(){return h`
      <md-elevation part="elevation"></md-elevation>
      <div class="background"></div>
      <slot></slot>
      <div class="outline"></div>
    `}}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const os=S`:host{--_container-color: var(--md-elevated-card-container-color, var(--md-sys-color-surface-container-low, #f7f2fa));--_container-elevation: var(--md-elevated-card-container-elevation, 1);--_container-shadow-color: var(--md-elevated-card-container-shadow-color, var(--md-sys-color-shadow, #000));--_container-shape: var(--md-elevated-card-container-shape, var(--md-sys-shape-corner-medium, 12px))}
`;os.styleSheet;/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Br=S`:host{border-radius:var(--_container-shape);box-sizing:border-box;display:flex;flex-direction:column;position:relative;z-index:0}md-elevation,.background,.outline{border-radius:inherit;inset:0;pointer-events:none;position:absolute}.background{background:var(--_container-color);z-index:-1}.outline{border:1px solid rgba(0,0,0,0);z-index:1}md-elevation{z-index:-1;--md-elevation-level: var(--_container-elevation);--md-elevation-shadow-color: var(--_container-shadow-color)}slot{border-radius:inherit}
`;Br.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let la=class extends Ba{};la.styles=[Br,os];la=l([E("md-elevated-card")],la);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const as=S`:host{--_container-color: var(--md-filled-card-container-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_container-elevation: var(--md-filled-card-container-elevation, 0);--_container-shadow-color: var(--md-filled-card-container-shadow-color, var(--md-sys-color-shadow, #000));--_container-shape: var(--md-filled-card-container-shape, var(--md-sys-shape-corner-medium, 12px))}
`;as.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let da=class extends Ba{};da.styles=[Br,as];da=l([E("md-filled-card")],da);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const is=S`:host{--_container-color: var(--md-outlined-card-container-color, var(--md-sys-color-surface, #fef7ff));--_container-elevation: var(--md-outlined-card-container-elevation, 0);--_container-shadow-color: var(--md-outlined-card-container-shadow-color, var(--md-sys-color-shadow, #000));--_container-shape: var(--md-outlined-card-container-shape, var(--md-sys-shape-corner-medium, 12px));--_outline-color: var(--md-outlined-card-outline-color, var(--md-sys-color-outline-variant, #cac4d0));--_outline-width: var(--md-outlined-card-outline-width, 1px)}.outline{border-color:var(--_outline-color);border-width:var(--_outline-width)}
`;is.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let ca=class extends Ba{};ca.styles=[Br,is];ca=l([E("md-outlined-card")],ca);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Td=ue(O);class Na extends Td{constructor(){super(...arguments),this.opened=!1,this.pivot="end"}render(){const e=this.opened?"true":"false",t=this.opened?"false":"true",{ariaLabel:r,ariaModal:a}=this;return h`
      <div
        class="md3-navigation-drawer-modal__scrim ${this.getScrimClasses()}"
        @click="${this.handleScrimClick}">
      </div>
      <div
        aria-expanded=${e}
        aria-hidden=${t}
        aria-label=${r||b}
        aria-modal=${a||b}
        class="md3-navigation-drawer-modal ${this.getRenderClasses()}"
        @keydown="${this.handleKeyDown}"
        role="dialog"
        ><div class="md3-elevation-overlay"></div>
        <div class="md3-navigation-drawer-modal__slot-content">
          <slot></slot>
        </div>
      </div>
    `}getScrimClasses(){return Q({"md3-navigation-drawer-modal--scrim-visible":this.opened})}getRenderClasses(){return Q({"md3-navigation-drawer-modal--opened":this.opened,"md3-navigation-drawer-modal--pivot-at-start":this.pivot==="start"})}updated(e){e.has("opened")&&setTimeout(()=>{this.dispatchEvent(new CustomEvent("navigation-drawer-changed",{detail:{opened:this.opened},bubbles:!0,composed:!0}))},250)}handleKeyDown(e){e.code==="Escape"&&(this.opened=!1)}handleScrimClick(){this.opened=!this.opened}}l([u({type:Boolean})],Na.prototype,"opened",void 0);l([u()],Na.prototype,"pivot",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const ns=S`:host{--_container-color: var(--md-navigation-drawer-modal-container-color, #fff);--_container-height: var(--md-navigation-drawer-modal-container-height, 100%);--_container-shape: var(--md-navigation-drawer-modal-container-shape, 0 16px 16px 0);--_container-width: var(--md-navigation-drawer-modal-container-width, 360px);--_divider-color: var(--md-navigation-drawer-modal-divider-color, #000);--_modal-container-elevation: var(--md-navigation-drawer-modal-modal-container-elevation, 1);--_scrim-color: var(--md-navigation-drawer-modal-scrim-color, );--_scrim-opacity: var(--md-navigation-drawer-modal-scrim-opacity, 0.04);--_standard-container-elevation: var(--md-navigation-drawer-modal-standard-container-elevation, 0);--md-elevation-level: var(--_modal-container-elevation)}.md3-navigation-drawer-modal{bottom:0;box-sizing:border-box;display:flex;justify-content:flex-end;overflow:hidden;position:absolute;top:0;inline-size:0;transition:inline-size .25s cubic-bezier(0.4, 0, 0.2, 1) 0s,visibility 0s cubic-bezier(0.4, 0, 0.2, 1) .25s}.md3-navigation-drawer-modal--opened{transition:inline-size .25s cubic-bezier(0.4, 0, 0.2, 1) 0s,visibility 0s cubic-bezier(0.4, 0, 0.2, 1) 0s}.md3-navigation-drawer-modal--pivot-at-start{justify-content:flex-start}.md3-navigation-drawer-modal__slot-content{display:flex;flex-direction:column;position:relative}.md3-navigation-drawer-modal__scrim{inset:0;opacity:0;position:absolute;visibility:hidden;background-color:var(--_scrim-color);transition:opacity .25s cubic-bezier(0.4, 0, 0.2, 1) 0s,visibility 0s cubic-bezier(0.4, 0, 0.2, 1) .25s}.md3-navigation-drawer-modal--scrim-visible{visibility:visible;opacity:var(--_scrim-opacity);transition:opacity .25s cubic-bezier(0.4, 0, 0.2, 1) 0s,visibility 0s cubic-bezier(0.4, 0, 0.2, 1) 0s}
`;ns.styleSheet;/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const ss=S`.md3-navigation-drawer-modal,.md3-navigation-drawer{background-color:var(--_container-color);border-radius:var(--_container-shape);height:var(--_container-height)}.md3-navigation-drawer-modal.md3-navigation-drawer-modal--opened,.md3-navigation-drawer.md3-navigation-drawer--opened{inline-size:var(--_container-width)}.md3-navigation-drawer-modal .md3-navigation-drawer-modal__slot-content,.md3-navigation-drawer .md3-navigation-drawer__slot-content{min-inline-size:var(--_container-width);max-inline-size:var(--_container-width)}
`;ss.styleSheet;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let ha=class extends Na{};ha.styles=[ss,ns];ha=l([E("md-navigation-drawer-modal")],ha);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ed=ue(O);class dt extends Ed{constructor(){super(...arguments),this.disabled=!1,this.selected=!1,this.label="",this.noCheckmark=!1,this.hasIcon=!1,this.animState=""}update(e){this.animState=this.nextAnimationState(e),super.update(e),this.hasIcon=this.iconElement.length>0}nextAnimationState(e){const t=e.get("selected");if(t===void 0)return"";const r=this.selected,a=!this.noCheckmark;return!t&&r&&a?"selecting":t&&!r&&a?"deselecting":""}handleClick(){const e=new Event("segmented-button-interaction",{bubbles:!0,composed:!0});this.dispatchEvent(e)}render(){const{ariaLabel:e}=this;return h`
      <button
        tabindex="${this.disabled?"-1":"0"}"
        aria-label=${e||b}
        aria-pressed=${this.selected}
        ?disabled=${this.disabled}
        @click="${this.handleClick}"
        class="md3-segmented-button ${Q(this.getRenderClasses())}">
        <md-focus-ring
          class="md3-segmented-button__focus-ring"
          part="focus-ring"></md-focus-ring>
        <md-ripple
          ?disabled="${this.disabled}"
          class="md3-segmented-button__ripple"></md-ripple>
        ${this.renderOutline()} ${this.renderLeading()} ${this.renderLabel()}
        ${this.renderTouchTarget()}
      </button>
    `}getRenderClasses(){return{"md3-segmented-button--selected":this.selected,"md3-segmented-button--unselected":!this.selected,"md3-segmented-button--with-label":this.label!=="","md3-segmented-button--without-label":this.label==="","md3-segmented-button--with-icon":this.hasIcon,"md3-segmented-button--with-checkmark":!this.noCheckmark,"md3-segmented-button--without-checkmark":this.noCheckmark,"md3-segmented-button--selecting":this.animState==="selecting","md3-segmented-button--deselecting":this.animState==="deselecting"}}renderOutline(){return b}renderLeading(){return this.label===""?this.renderLeadingWithoutLabel():this.renderLeadingWithLabel()}renderLeadingWithoutLabel(){return h`
      <span class="md3-segmented-button__leading" aria-hidden="true">
        <span class="md3-segmented-button__graphic">
          <svg class="md3-segmented-button__checkmark" viewBox="0 0 24 24">
            <path
              class="md3-segmented-button__checkmark-path"
              fill="none"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
          </svg>
        </span>
        <span class="md3-segmented-button__icon" aria-hidden="true">
          <slot name="icon"></slot>
        </span>
      </span>
    `}renderLeadingWithLabel(){return h`
      <span class="md3-segmented-button__leading" aria-hidden="true">
        <span class="md3-segmented-button__graphic">
          <svg class="md3-segmented-button__checkmark" viewBox="0 0 24 24">
            <path
              class="md3-segmented-button__checkmark-path"
              fill="none"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
          </svg>
          <span class="md3-segmented-button__icon" aria-hidden="true">
            <slot name="icon"></slot>
          </span>
        </span>
      </span>
    `}renderLabel(){return h`
      <span class="md3-segmented-button__label-text">${this.label}</span>
    `}renderTouchTarget(){return h`<span class="md3-segmented-button__touch"></span>`}}l([u({type:Boolean})],dt.prototype,"disabled",void 0);l([u({type:Boolean})],dt.prototype,"selected",void 0);l([u()],dt.prototype,"label",void 0);l([u({type:Boolean,attribute:"no-checkmark"})],dt.prototype,"noCheckmark",void 0);l([u({type:Boolean,attribute:"has-icon"})],dt.prototype,"hasIcon",void 0);l([T()],dt.prototype,"animState",void 0);l([ce({slot:"icon",flatten:!0})],dt.prototype,"iconElement",void 0);/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Ad extends dt{getRenderClasses(){return{...super.getRenderClasses(),"md3-segmented-button--outlined":!0}}renderOutline(){return h`<span class="md3-segmented-button__outline"></span>`}}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const ls=S`:host{--_container-height: var(--md-outlined-segmented-button-container-height, 40px);--_disabled-icon-color: var(--md-outlined-segmented-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-color: var(--md-outlined-segmented-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-color: var(--md-outlined-segmented-button-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-opacity: var(--md-outlined-segmented-button-hover-state-layer-opacity, 0.08);--_label-text-font: var(--md-outlined-segmented-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-outlined-segmented-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-outlined-segmented-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-outlined-segmented-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_outline-color: var(--md-outlined-segmented-button-outline-color, var(--md-sys-color-outline, #79747e));--_pressed-state-layer-opacity: var(--md-outlined-segmented-button-pressed-state-layer-opacity, 0.12);--_selected-container-color: var(--md-outlined-segmented-button-selected-container-color, var(--md-sys-color-secondary-container, #e8def8));--_selected-focus-icon-color: var(--md-outlined-segmented-button-selected-focus-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-focus-label-text-color: var(--md-outlined-segmented-button-selected-focus-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-icon-color: var(--md-outlined-segmented-button-selected-hover-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-label-text-color: var(--md-outlined-segmented-button-selected-hover-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-state-layer-color: var(--md-outlined-segmented-button-selected-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-label-text-color: var(--md-outlined-segmented-button-selected-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-icon-color: var(--md-outlined-segmented-button-selected-pressed-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-label-text-color: var(--md-outlined-segmented-button-selected-pressed-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-state-layer-color: var(--md-outlined-segmented-button-selected-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_shape: var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px));--_unselected-focus-icon-color: var(--md-outlined-segmented-button-unselected-focus-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-focus-label-text-color: var(--md-outlined-segmented-button-unselected-focus-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-hover-icon-color: var(--md-outlined-segmented-button-unselected-hover-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-hover-label-text-color: var(--md-outlined-segmented-button-unselected-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-hover-state-layer-color: var(--md-outlined-segmented-button-unselected-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-label-text-color: var(--md-outlined-segmented-button-unselected-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-pressed-icon-color: var(--md-outlined-segmented-button-unselected-pressed-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-pressed-label-text-color: var(--md-outlined-segmented-button-unselected-pressed-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-pressed-state-layer-color: var(--md-outlined-segmented-button-unselected-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_icon-size: var(--md-outlined-segmented-button-icon-size, 18px);--_selected-icon-color: var(--md-outlined-segmented-button-selected-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_unselected-icon-color: var(--md-outlined-segmented-button-unselected-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_shape-start-start: var(--md-outlined-segmented-button-shape-start-start, var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px)));--_shape-start-end: var(--md-outlined-segmented-button-shape-start-end, var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px)));--_shape-end-end: var(--md-outlined-segmented-button-shape-end-end, var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px)));--_shape-end-start: var(--md-outlined-segmented-button-shape-end-start, var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px)));--_spacing-leading: 12px;--_spacing-trailing: 12px}.md3-segmented-button__outline{border-radius:inherit;border-style:solid;border-width:1px;inset:0px -0.5px;pointer-events:none;position:absolute}
`;ls.styleSheet;/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const ds=S`@keyframes md3-segmented-button-checkmark-selection-draw-in{from{stroke-dashoffset:29.7833385}to{stroke-dashoffset:0}}@keyframes md3-segmented-button-simple-fade-out{from{opacity:1}to{opacity:0}}@keyframes md3-segmented-button-simple-fade-in{from{opacity:0}to{opacity:1}}:host{display:inline-flex;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.md3-segmented-button{align-items:center;background:rgba(0,0,0,0);border:none;border-radius:inherit;display:flex;flex:1;justify-content:center;outline:none;position:relative;vertical-align:middle;padding-inline-start:var(--_spacing-leading);padding-inline-end:var(--_spacing-trailing);text-transform:inherit}.md3-segmented-button .md3-segmented-button__outline{border-color:var(--_outline-color)}.md3-segmented-button:disabled .md3-segmented-button__outline{border-color:var(--_disabled-outline-color)}.md3-segmented-button .md3-segmented-button__graphic,.md3-segmented-button .md3-segmented-button__checkmark,.md3-segmented-button .md3-segmented-button__icon,.md3-segmented-button .md3-segmented-button__icon ::slotted([slot=icon]){height:var(--_icon-size);width:var(--_icon-size);font-size:var(--_icon-size)}.md3-segmented-button.md3-segmented-button--with-icon.md3-segmented-button--with-label .md3-segmented-button__graphic,.md3-segmented-button.md3-segmented-button--selected.md3-segmented-button--with-label.md3-segmented-button--with-checkmark .md3-segmented-button__graphic,.md3-segmented-button.md3-segmented-button--selected.md3-segmented-button--without-label.md3-segmented-button--with-checkmark .md3-segmented-button__graphic{width:calc(var(--_icon-size) + 8px)}.md3-segmented-button .md3-segmented-button__label-text{font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight)}.md3-segmented-button.md3-segmented-button--selected:enabled .md3-segmented-button__label-text{color:var(--_selected-label-text-color)}.md3-segmented-button.md3-segmented-button--selected:enabled:hover .md3-segmented-button__label-text{color:var(--_selected-hover-label-text-color)}.md3-segmented-button.md3-segmented-button--selected:enabled:focus .md3-segmented-button__label-text{color:var(--_selected-focus-label-text-color)}.md3-segmented-button.md3-segmented-button--selected:enabled:active .md3-segmented-button__label-text{color:var(--_selected-pressed-label-text-color)}.md3-segmented-button.md3-segmented-button--unselected:enabled .md3-segmented-button__label-text{color:var(--_unselected-label-text-color)}.md3-segmented-button.md3-segmented-button--unselected:enabled:hover .md3-segmented-button__label-text{color:var(--_unselected-hover-label-text-color)}.md3-segmented-button.md3-segmented-button--unselected:enabled:focus .md3-segmented-button__label-text{color:var(--_unselected-focus-label-text-color)}.md3-segmented-button.md3-segmented-button--unselected:enabled:active .md3-segmented-button__label-text{color:var(--_unselected-pressed-label-text-color)}.md3-segmented-button:disabled .md3-segmented-button__label-text{color:var(--_disabled-label-text-color)}.md3-segmented-button--unselected .md3-segmented-button__icon{color:var(--_unselected-icon-color)}.md3-segmented-button--unselected:hover .md3-segmented-button__icon{color:var(--_unselected-hover-icon-color)}.md3-segmented-button--unselected:focus .md3-segmented-button__icon{color:var(--_unselected-focus-icon-color)}.md3-segmented-button--unselected:active .md3-segmented-button__icon{color:var(--_unselected-pressed-icon-color)}.md3-segmented-button--unselected:disabled .md3-segmented-button__icon{color:var(--_disabled-icon-color)}.md3-segmented-button--unselected{--md-ripple-hover-color: var(--_unselected-hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_unselected-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.md3-segmented-button--selected{background-color:var(--_selected-container-color)}.md3-segmented-button--selected .md3-segmented-button__icon{color:var(--_selected-icon-color)}.md3-segmented-button--selected .md3-segmented-button__checkmark-path{stroke:var(--_selected-icon-color)}.md3-segmented-button--selected:hover .md3-segmented-button__checkmark-path{stroke:var(--_selected-hover-icon-color)}.md3-segmented-button--selected:focus .md3-segmented-button__checkmark-path{stroke:var(--_selected-focus-icon-color)}.md3-segmented-button--selected:active .md3-segmented-button__checkmark-path{stroke:var(--_selected-pressed-icon-color)}.md3-segmented-button--selected:disabled .md3-segmented-button__checkmark-path{stroke:var(--_disabled-icon-color)}.md3-segmented-button--selected{--md-ripple-hover-color: var(--_selected-hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_selected-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.md3-segmented-button:enabled{cursor:pointer}.md3-segmented-button__focus-ring{z-index:1}.md3-segmented-button__ripple{border-radius:inherit;z-index:0}.md3-segmented-button__touch{position:absolute;top:50%;height:48px;left:50%;width:100%;transform:translate(-50%, -50%)}.md3-segmented-button__leading,.md3-segmented-button__graphic{display:inline-flex;justify-content:flex-start;align-items:center}.md3-segmented-button__graphic{position:relative;overflow:hidden}.md3-segmented-button__graphic{transition:width 150ms cubic-bezier(0.4, 0, 0.2, 1)}.md3-segmented-button--unselected.md3-segmented-button--with-label .md3-segmented-button__graphic,.md3-segmented-button--unselected.md3-segmented-button--without-label .md3-segmented-button__graphic,.md3-segmented-button--selected.md3-segmented-button--without-checkmark .md3-segmented-button__graphic{width:0}.md3-segmented-button--unselected .md3-segmented-button__checkmark{opacity:0}.md3-segmented-button--selected.md3-segmented-button--with-label .md3-segmented-button__icon{opacity:0}.md3-segmented-button--with-label .md3-segmented-button__checkmark{display:inline-flex;position:absolute}.md3-segmented-button__checkmark-path{stroke-width:2px;stroke-dasharray:29.7833385}.md3-segmented-button--selecting .md3-segmented-button__checkmark-path{stroke-dashoffset:29.7833385;animation:md3-segmented-button-checkmark-selection-draw-in;animation-duration:150ms;animation-delay:50ms;animation-fill-mode:forwards;animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.md3-segmented-button--selecting.md3-segmented-button--with-label .md3-segmented-button__icon{animation:md3-segmented-button-simple-fade-out;animation-duration:75ms;animation-timing-function:linear;animation-fill-mode:forwards}.md3-segmented-button--deselecting .md3-segmented-button__checkmark{animation:md3-segmented-button-simple-fade-out;animation-duration:50ms;animation-timing-function:linear;animation-fill-mode:forwards}.md3-segmented-button--deselecting.md3-segmented-button--with-label .md3-segmented-button__icon{opacity:0;animation:md3-segmented-button-simple-fade-in;animation-delay:50ms;animation-duration:150ms;animation-timing-function:linear;animation-fill-mode:forwards}
`;ds.styleSheet;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let pa=class extends Ad{};pa.styles=[ds,ls];pa=l([E("md-outlined-segmented-button")],pa);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Pd=ue(O);class Va extends Pd{constructor(){super(...arguments),this.multiselect=!1}getButtonDisabled(e){return this.indexOutOfBounds(e)?!1:this.buttons[e].disabled}setButtonDisabled(e,t){this.indexOutOfBounds(e)||(this.buttons[e].disabled=t)}getButtonSelected(e){return this.indexOutOfBounds(e)?!1:this.buttons[e].selected}setButtonSelected(e,t){if(!this.indexOutOfBounds(e)&&!this.getButtonDisabled(e)){if(this.multiselect){this.buttons[e].selected=t,this.emitSelectionEvent(e);return}if(t){this.buttons[e].selected=!0,this.emitSelectionEvent(e);for(let r=0;r<this.buttons.length;r++)r!==e&&(this.buttons[r].selected=!1)}}}handleSegmentedButtonInteraction(e){const t=this.buttons.indexOf(e.target);this.toggleSelection(t)}toggleSelection(e){this.indexOutOfBounds(e)||this.setButtonSelected(e,!this.buttons[e].selected)}indexOutOfBounds(e){return e<0||e>=this.buttons.length}emitSelectionEvent(e){this.dispatchEvent(new CustomEvent("segmented-button-set-selection",{detail:{button:this.buttons[e],selected:this.buttons[e].selected,index:e},bubbles:!0,composed:!0}))}render(){const{ariaLabel:e}=this;return h`
      <span
        role="group"
        @segmented-button-interaction="${this.handleSegmentedButtonInteraction}"
        aria-label=${e||b}
        class="md3-segmented-button-set">
        <slot></slot>
      </span>
    `}getRenderClasses(){return{}}}l([u({type:Boolean})],Va.prototype,"multiselect",void 0);l([ce({flatten:!0})],Va.prototype,"buttons",void 0);/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Id extends Va{getRenderClasses(){return{...super.getRenderClasses(),"md3-segmented-button-set--outlined":!0}}}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const cs=S`:host{--_container-height: var(--md-outlined-segmented-button-container-height, 40px);--_disabled-icon-color: var(--md-outlined-segmented-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-color: var(--md-outlined-segmented-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-color: var(--md-outlined-segmented-button-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-opacity: var(--md-outlined-segmented-button-hover-state-layer-opacity, 0.08);--_label-text-font: var(--md-outlined-segmented-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-outlined-segmented-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-outlined-segmented-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-outlined-segmented-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_outline-color: var(--md-outlined-segmented-button-outline-color, var(--md-sys-color-outline, #79747e));--_pressed-state-layer-opacity: var(--md-outlined-segmented-button-pressed-state-layer-opacity, 0.12);--_selected-container-color: var(--md-outlined-segmented-button-selected-container-color, var(--md-sys-color-secondary-container, #e8def8));--_selected-focus-icon-color: var(--md-outlined-segmented-button-selected-focus-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-focus-label-text-color: var(--md-outlined-segmented-button-selected-focus-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-icon-color: var(--md-outlined-segmented-button-selected-hover-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-label-text-color: var(--md-outlined-segmented-button-selected-hover-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-state-layer-color: var(--md-outlined-segmented-button-selected-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-label-text-color: var(--md-outlined-segmented-button-selected-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-icon-color: var(--md-outlined-segmented-button-selected-pressed-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-label-text-color: var(--md-outlined-segmented-button-selected-pressed-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-state-layer-color: var(--md-outlined-segmented-button-selected-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_unselected-focus-icon-color: var(--md-outlined-segmented-button-unselected-focus-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-focus-label-text-color: var(--md-outlined-segmented-button-unselected-focus-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-hover-icon-color: var(--md-outlined-segmented-button-unselected-hover-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-hover-label-text-color: var(--md-outlined-segmented-button-unselected-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-hover-state-layer-color: var(--md-outlined-segmented-button-unselected-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-label-text-color: var(--md-outlined-segmented-button-unselected-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-pressed-icon-color: var(--md-outlined-segmented-button-unselected-pressed-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-pressed-label-text-color: var(--md-outlined-segmented-button-unselected-pressed-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_unselected-pressed-state-layer-color: var(--md-outlined-segmented-button-unselected-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_icon-size: var(--md-outlined-segmented-button-icon-size, 18px);--_selected-icon-color: var(--md-outlined-segmented-button-selected-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_unselected-icon-color: var(--md-outlined-segmented-button-unselected-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_shape-start-start: var(--md-outlined-segmented-button-shape-start-start, var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px)));--_shape-start-end: var(--md-outlined-segmented-button-shape-start-end, var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px)));--_shape-end-end: var(--md-outlined-segmented-button-shape-end-end, var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px)));--_shape-end-start: var(--md-outlined-segmented-button-shape-end-start, var(--md-outlined-segmented-button-shape, var(--md-sys-shape-corner-full, 9999px)))}
`;cs.styleSheet;/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const hs=S`:host{display:flex;outline:none}.md3-segmented-button-set{display:grid;grid-auto-columns:1fr;grid-auto-flow:column;grid-auto-rows:auto;width:100%;height:var(--_container-height)}.md3-segmented-button-set ::slotted(:first-child){border-start-start-radius:var(--_shape-start-start);border-end-start-radius:var(--_shape-end-start)}.md3-segmented-button-set ::slotted(:last-child){border-start-end-radius:var(--_shape-start-end);border-end-end-radius:var(--_shape-end-end)}
`;hs.styleSheet;/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let ua=class extends Id{};ua.styles=[hs,cs];ua=l([E("md-outlined-segmented-button-set")],ua);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function be(o){return o<0?-1:o===0?0:1}function Ut(o,e,t){return(1-t)*o+t*e}function zd(o,e,t){return t<o?o:t>e?e:t}function he(o,e,t){return t<o?o:t>e?e:t}function xi(o){return o=o%360,o<0&&(o=o+360),o}function ke(o){return o=o%360,o<0&&(o=o+360),o}function ma(o,e){const t=o[0]*e[0][0]+o[1]*e[0][1]+o[2]*e[0][2],r=o[0]*e[1][0]+o[1]*e[1][1]+o[2]*e[1][2],a=o[0]*e[2][0]+o[1]*e[2][1]+o[2]*e[2][2];return[t,r,a]}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ps=[[.41233895,.35762064,.18051042],[.2126,.7152,.0722],[.01932141,.11916382,.95034478]],Od=[[3.2413774792388685,-1.5376652402851851,-.49885366846268053],[-.9691452513005321,1.8758853451067872,.04156585616912061],[.05562093689691305,-.20395524564742123,1.0571799111220335]],us=[95.047,100,108.883];function Ha(o,e,t){return(255<<24|(o&255)<<16|(e&255)<<8|t&255)>>>0}function _i(o){const e=vt(o[0]),t=vt(o[1]),r=vt(o[2]);return Ha(e,t,r)}function Ua(o){return o>>16&255}function qa(o){return o>>8&255}function Ka(o){return o&255}function Rd(o,e,t){const r=Od,a=r[0][0]*o+r[0][1]*e+r[0][2]*t,i=r[1][0]*o+r[1][1]*e+r[1][2]*t,n=r[2][0]*o+r[2][1]*e+r[2][2]*t,s=vt(a),d=vt(i),c=vt(n);return Ha(s,d,c)}function Md(o){const e=Ke(Ua(o)),t=Ke(qa(o)),r=Ke(Ka(o));return ma([e,t,r],ps)}function Ld(o){const e=Ke(Ua(o)),t=Ke(qa(o)),r=Ke(Ka(o)),a=ps,i=a[0][0]*e+a[0][1]*t+a[0][2]*r,n=a[1][0]*e+a[1][1]*t+a[1][2]*r,s=a[2][0]*e+a[2][1]*t+a[2][2]*r,d=us,c=i/d[0],p=n/d[1],v=s/d[2],g=qt(c),_=qt(p),w=qt(v),x=116*_-16,C=500*(g-_),P=200*(_-w);return[x,C,P]}function Dd(o){const e=Je(o),t=vt(e);return Ha(t,t,t)}function wi(o){const e=Md(o)[1];return 116*qt(e/100)-16}function Je(o){return 100*Bd((o+16)/116)}function va(o){return qt(o/100)*116-16}function Ke(o){const e=o/255;return e<=.040449936?e/12.92*100:Math.pow((e+.055)/1.055,2.4)*100}function vt(o){const e=o/100;let t=0;return e<=.0031308?t=e*12.92:t=1.055*Math.pow(e,1/2.4)-.055,zd(0,255,Math.round(t*255))}function Fd(){return us}function qt(o){const e=.008856451679035631,t=24389/27;return o>e?Math.pow(o,1/3):(t*o+16)/116}function Bd(o){const e=.008856451679035631,t=24389/27,r=o*o*o;return r>e?r:(116*o-16)/t}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Be{static make(e=Fd(),t=200/Math.PI*Je(50)/100,r=50,a=2,i=!1){const n=e,s=n[0]*.401288+n[1]*.650173+n[2]*-.051461,d=n[0]*-.250268+n[1]*1.204414+n[2]*.045854,c=n[0]*-.002079+n[1]*.048952+n[2]*.953127,p=.8+a/10,v=p>=.9?Ut(.59,.69,(p-.9)*10):Ut(.525,.59,(p-.8)*10);let g=i?1:p*(1-1/3.6*Math.exp((-t-42)/92));g=g>1?1:g<0?0:g;const _=p,w=[g*(100/s)+1-g,g*(100/d)+1-g,g*(100/c)+1-g],x=1/(5*t+1),C=x*x*x*x,P=1-C,A=C*t+.1*P*P*Math.cbrt(5*t),V=Je(r)/e[1],F=1.48+Math.sqrt(V),B=.725/Math.pow(V,.2),G=B,K=[Math.pow(A*w[0]*s/100,.42),Math.pow(A*w[1]*d/100,.42),Math.pow(A*w[2]*c/100,.42)],Z=[400*K[0]/(K[0]+27.13),400*K[1]/(K[1]+27.13),400*K[2]/(K[2]+27.13)],ae=(2*Z[0]+Z[1]+.05*Z[2])*B;return new Be(V,ae,B,G,v,_,w,A,Math.pow(A,.25),F)}constructor(e,t,r,a,i,n,s,d,c,p){this.n=e,this.aw=t,this.nbb=r,this.ncb=a,this.c=i,this.nc=n,this.rgbD=s,this.fl=d,this.fLRoot=c,this.z=p}}Be.DEFAULT=Be.make();/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class we{constructor(e,t,r,a,i,n,s,d,c){this.hue=e,this.chroma=t,this.j=r,this.q=a,this.m=i,this.s=n,this.jstar=s,this.astar=d,this.bstar=c}distance(e){const t=this.jstar-e.jstar,r=this.astar-e.astar,a=this.bstar-e.bstar,i=Math.sqrt(t*t+r*r+a*a);return 1.41*Math.pow(i,.63)}static fromInt(e){return we.fromIntInViewingConditions(e,Be.DEFAULT)}static fromIntInViewingConditions(e,t){const r=(e&16711680)>>16,a=(e&65280)>>8,i=e&255,n=Ke(r),s=Ke(a),d=Ke(i),c=.41233895*n+.35762064*s+.18051042*d,p=.2126*n+.7152*s+.0722*d,v=.01932141*n+.11916382*s+.95034478*d,g=.401288*c+.650173*p-.051461*v,_=-.250268*c+1.204414*p+.045854*v,w=-.002079*c+.048952*p+.953127*v,x=t.rgbD[0]*g,C=t.rgbD[1]*_,P=t.rgbD[2]*w,A=Math.pow(t.fl*Math.abs(x)/100,.42),V=Math.pow(t.fl*Math.abs(C)/100,.42),F=Math.pow(t.fl*Math.abs(P)/100,.42),B=be(x)*400*A/(A+27.13),G=be(C)*400*V/(V+27.13),K=be(P)*400*F/(F+27.13),Z=(11*B+-12*G+K)/11,ae=(B+G-2*K)/9,Y=(20*B+20*G+21*K)/20,se=(40*B+20*G+K)/20,ze=Math.atan2(ae,Z)*180/Math.PI,de=ke(ze),ct=de*Math.PI/180,We=se*t.nbb,$e=100*Math.pow(We/t.aw,t.c*t.z),fe=4/t.c*Math.sqrt($e/100)*(t.aw+4)*t.fLRoot,qr=de<20.14?de+360:de,Kr=.25*(Math.cos(qr*Math.PI/180+2)+3.8),Gr=5e4/13*Kr*t.nc*t.ncb*Math.sqrt(Z*Z+ae*ae)/(Y+.305),dr=Math.pow(Gr,.9)*Math.pow(1.64-Math.pow(.29,t.n),.73),Wa=dr*Math.sqrt($e/100),Ya=Wa*t.fLRoot,Ss=50*Math.sqrt(dr*t.c/(t.aw+4)),$s=(1+100*.007)*$e/(1+.007*$e),Xa=1/.0228*Math.log(1+.0228*Ya),Ts=Xa*Math.cos(ct),Es=Xa*Math.sin(ct);return new we(de,Wa,$e,fe,Ya,Ss,$s,Ts,Es)}static fromJch(e,t,r){return we.fromJchInViewingConditions(e,t,r,Be.DEFAULT)}static fromJchInViewingConditions(e,t,r,a){const i=4/a.c*Math.sqrt(e/100)*(a.aw+4)*a.fLRoot,n=t*a.fLRoot,s=t/Math.sqrt(e/100),d=50*Math.sqrt(s*a.c/(a.aw+4)),c=r*Math.PI/180,p=(1+100*.007)*e/(1+.007*e),v=1/.0228*Math.log(1+.0228*n),g=v*Math.cos(c),_=v*Math.sin(c);return new we(r,t,e,i,n,d,p,g,_)}static fromUcs(e,t,r){return we.fromUcsInViewingConditions(e,t,r,Be.DEFAULT)}static fromUcsInViewingConditions(e,t,r,a){const i=t,n=r,s=Math.sqrt(i*i+n*n),c=(Math.exp(s*.0228)-1)/.0228/a.fLRoot;let p=Math.atan2(n,i)*(180/Math.PI);p<0&&(p+=360);const v=e/(1-(e-100)*.007);return we.fromJchInViewingConditions(v,c,p,a)}toInt(){return this.viewed(Be.DEFAULT)}viewed(e){const t=this.chroma===0||this.j===0?0:this.chroma/Math.sqrt(this.j/100),r=Math.pow(t/Math.pow(1.64-Math.pow(.29,e.n),.73),1/.9),a=this.hue*Math.PI/180,i=.25*(Math.cos(a+2)+3.8),n=e.aw*Math.pow(this.j/100,1/e.c/e.z),s=i*(5e4/13)*e.nc*e.ncb,d=n/e.nbb,c=Math.sin(a),p=Math.cos(a),v=23*(d+.305)*r/(23*s+11*r*p+108*r*c),g=v*p,_=v*c,w=(460*d+451*g+288*_)/1403,x=(460*d-891*g-261*_)/1403,C=(460*d-220*g-6300*_)/1403,P=Math.max(0,27.13*Math.abs(w)/(400-Math.abs(w))),A=be(w)*(100/e.fl)*Math.pow(P,1/.42),V=Math.max(0,27.13*Math.abs(x)/(400-Math.abs(x))),F=be(x)*(100/e.fl)*Math.pow(V,1/.42),B=Math.max(0,27.13*Math.abs(C)/(400-Math.abs(C))),G=be(C)*(100/e.fl)*Math.pow(B,1/.42),K=A/e.rgbD[0],Z=F/e.rgbD[1],ae=G/e.rgbD[2],Y=1.86206786*K-1.01125463*Z+.14918677*ae,se=.38752654*K+.62144744*Z-.00897398*ae,Ie=-.0158415*K-.03412294*Z+1.04996444*ae;return Rd(Y,se,Ie)}static fromXyzInViewingConditions(e,t,r,a){const i=.401288*e+.650173*t-.051461*r,n=-.250268*e+1.204414*t+.045854*r,s=-.002079*e+.048952*t+.953127*r,d=a.rgbD[0]*i,c=a.rgbD[1]*n,p=a.rgbD[2]*s,v=Math.pow(a.fl*Math.abs(d)/100,.42),g=Math.pow(a.fl*Math.abs(c)/100,.42),_=Math.pow(a.fl*Math.abs(p)/100,.42),w=be(d)*400*v/(v+27.13),x=be(c)*400*g/(g+27.13),C=be(p)*400*_/(_+27.13),P=(11*w+-12*x+C)/11,A=(w+x-2*C)/9,V=(20*w+20*x+21*C)/20,F=(40*w+20*x+C)/20,G=Math.atan2(A,P)*180/Math.PI,K=G<0?G+360:G>=360?G-360:G,Z=K*Math.PI/180,ae=F*a.nbb,Y=100*Math.pow(ae/a.aw,a.c*a.z),se=4/a.c*Math.sqrt(Y/100)*(a.aw+4)*a.fLRoot,Ie=K<20.14?K+360:K,ze=1/4*(Math.cos(Ie*Math.PI/180+2)+3.8),ct=5e4/13*ze*a.nc*a.ncb*Math.sqrt(P*P+A*A)/(V+.305),We=Math.pow(ct,.9)*Math.pow(1.64-Math.pow(.29,a.n),.73),$e=We*Math.sqrt(Y/100),fe=$e*a.fLRoot,qr=50*Math.sqrt(We*a.c/(a.aw+4)),Kr=(1+100*.007)*Y/(1+.007*Y),jr=Math.log(1+.0228*fe)/.0228,Gr=jr*Math.cos(Z),dr=jr*Math.sin(Z);return new we(K,$e,Y,se,fe,qr,Kr,Gr,dr)}xyzInViewingConditions(e){const t=this.chroma===0||this.j===0?0:this.chroma/Math.sqrt(this.j/100),r=Math.pow(t/Math.pow(1.64-Math.pow(.29,e.n),.73),1/.9),a=this.hue*Math.PI/180,i=.25*(Math.cos(a+2)+3.8),n=e.aw*Math.pow(this.j/100,1/e.c/e.z),s=i*(5e4/13)*e.nc*e.ncb,d=n/e.nbb,c=Math.sin(a),p=Math.cos(a),v=23*(d+.305)*r/(23*s+11*r*p+108*r*c),g=v*p,_=v*c,w=(460*d+451*g+288*_)/1403,x=(460*d-891*g-261*_)/1403,C=(460*d-220*g-6300*_)/1403,P=Math.max(0,27.13*Math.abs(w)/(400-Math.abs(w))),A=be(w)*(100/e.fl)*Math.pow(P,1/.42),V=Math.max(0,27.13*Math.abs(x)/(400-Math.abs(x))),F=be(x)*(100/e.fl)*Math.pow(V,1/.42),B=Math.max(0,27.13*Math.abs(C)/(400-Math.abs(C))),G=be(C)*(100/e.fl)*Math.pow(B,1/.42),K=A/e.rgbD[0],Z=F/e.rgbD[1],ae=G/e.rgbD[2],Y=1.86206786*K-1.01125463*Z+.14918677*ae,se=.38752654*K+.62144744*Z-.00897398*ae,Ie=-.0158415*K-.03412294*Z+1.04996444*ae;return[Y,se,Ie]}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class R{static sanitizeRadians(e){return(e+Math.PI*8)%(Math.PI*2)}static trueDelinearized(e){const t=e/100;let r=0;return t<=.0031308?r=t*12.92:r=1.055*Math.pow(t,1/2.4)-.055,r*255}static chromaticAdaptation(e){const t=Math.pow(Math.abs(e),.42);return be(e)*400*t/(t+27.13)}static hueOf(e){const t=ma(e,R.SCALED_DISCOUNT_FROM_LINRGB),r=R.chromaticAdaptation(t[0]),a=R.chromaticAdaptation(t[1]),i=R.chromaticAdaptation(t[2]),n=(11*r+-12*a+i)/11,s=(r+a-2*i)/9;return Math.atan2(s,n)}static areInCyclicOrder(e,t,r){const a=R.sanitizeRadians(t-e),i=R.sanitizeRadians(r-e);return a<i}static intercept(e,t,r){return(t-e)/(r-e)}static lerpPoint(e,t,r){return[e[0]+(r[0]-e[0])*t,e[1]+(r[1]-e[1])*t,e[2]+(r[2]-e[2])*t]}static setCoordinate(e,t,r,a){const i=R.intercept(e[a],t,r[a]);return R.lerpPoint(e,i,r)}static isBounded(e){return 0<=e&&e<=100}static nthVertex(e,t){const r=R.Y_FROM_LINRGB[0],a=R.Y_FROM_LINRGB[1],i=R.Y_FROM_LINRGB[2],n=t%4<=1?0:100,s=t%2===0?0:100;if(t<4){const d=n,c=s,p=(e-d*a-c*i)/r;return R.isBounded(p)?[p,d,c]:[-1,-1,-1]}else if(t<8){const d=n,c=s,p=(e-c*r-d*i)/a;return R.isBounded(p)?[c,p,d]:[-1,-1,-1]}else{const d=n,c=s,p=(e-d*r-c*a)/i;return R.isBounded(p)?[d,c,p]:[-1,-1,-1]}}static bisectToSegment(e,t){let r=[-1,-1,-1],a=r,i=0,n=0,s=!1,d=!0;for(let c=0;c<12;c++){const p=R.nthVertex(e,c);if(p[0]<0)continue;const v=R.hueOf(p);if(!s){r=p,a=p,i=v,n=v,s=!0;continue}(d||R.areInCyclicOrder(i,v,n))&&(d=!1,R.areInCyclicOrder(i,t,v)?(a=p,n=v):(r=p,i=v))}return[r,a]}static midpoint(e,t){return[(e[0]+t[0])/2,(e[1]+t[1])/2,(e[2]+t[2])/2]}static criticalPlaneBelow(e){return Math.floor(e-.5)}static criticalPlaneAbove(e){return Math.ceil(e-.5)}static bisectToLimit(e,t){const r=R.bisectToSegment(e,t);let a=r[0],i=R.hueOf(a),n=r[1];for(let s=0;s<3;s++)if(a[s]!==n[s]){let d=-1,c=255;a[s]<n[s]?(d=R.criticalPlaneBelow(R.trueDelinearized(a[s])),c=R.criticalPlaneAbove(R.trueDelinearized(n[s]))):(d=R.criticalPlaneAbove(R.trueDelinearized(a[s])),c=R.criticalPlaneBelow(R.trueDelinearized(n[s])));for(let p=0;p<8&&!(Math.abs(c-d)<=1);p++){const v=Math.floor((d+c)/2),g=R.CRITICAL_PLANES[v],_=R.setCoordinate(a,g,n,s),w=R.hueOf(_);R.areInCyclicOrder(i,t,w)?(n=_,c=v):(a=_,i=w,d=v)}}return R.midpoint(a,n)}static inverseChromaticAdaptation(e){const t=Math.abs(e),r=Math.max(0,27.13*t/(400-t));return be(e)*Math.pow(r,1/.42)}static findResultByJ(e,t,r){let a=Math.sqrt(r)*11;const i=Be.DEFAULT,n=1/Math.pow(1.64-Math.pow(.29,i.n),.73),d=.25*(Math.cos(e+2)+3.8)*(5e4/13)*i.nc*i.ncb,c=Math.sin(e),p=Math.cos(e);for(let v=0;v<5;v++){const g=a/100,_=t===0||a===0?0:t/Math.sqrt(g),w=Math.pow(_*n,1/.9),C=i.aw*Math.pow(g,1/i.c/i.z)/i.nbb,P=23*(C+.305)*w/(23*d+11*w*p+108*w*c),A=P*p,V=P*c,F=(460*C+451*A+288*V)/1403,B=(460*C-891*A-261*V)/1403,G=(460*C-220*A-6300*V)/1403,K=R.inverseChromaticAdaptation(F),Z=R.inverseChromaticAdaptation(B),ae=R.inverseChromaticAdaptation(G),Y=ma([K,Z,ae],R.LINRGB_FROM_SCALED_DISCOUNT);if(Y[0]<0||Y[1]<0||Y[2]<0)return 0;const se=R.Y_FROM_LINRGB[0],Ie=R.Y_FROM_LINRGB[1],ze=R.Y_FROM_LINRGB[2],de=se*Y[0]+Ie*Y[1]+ze*Y[2];if(de<=0)return 0;if(v===4||Math.abs(de-r)<.002)return Y[0]>100.01||Y[1]>100.01||Y[2]>100.01?0:_i(Y);a=a-(de-r)*a/(2*de)}return 0}static solveToInt(e,t,r){if(t<1e-4||r<1e-4||r>99.9999)return Dd(r);e=ke(e);const a=e/180*Math.PI,i=Je(r),n=R.findResultByJ(a,t,i);if(n!==0)return n;const s=R.bisectToLimit(i,a);return _i(s)}static solveToCam(e,t,r){return we.fromInt(R.solveToInt(e,t,r))}}R.SCALED_DISCOUNT_FROM_LINRGB=[[.001200833568784504,.002389694492170889,.0002795742885861124],[.0005891086651375999,.0029785502573438758,.0003270666104008398],[.00010146692491640572,.0005364214359186694,.0032979401770712076]];R.LINRGB_FROM_SCALED_DISCOUNT=[[1373.2198709594231,-1100.4251190754821,-7.278681089101213],[-271.815969077903,559.6580465940733,-32.46047482791194],[1.9622899599665666,-57.173814538844006,308.7233197812385]];R.Y_FROM_LINRGB=[.2126,.7152,.0722];R.CRITICAL_PLANES=[.015176349177441876,.045529047532325624,.07588174588720938,.10623444424209313,.13658714259697685,.16693984095186062,.19729253930674434,.2276452376616281,.2579979360165119,.28835063437139563,.3188300904430532,.350925934958123,.3848314933096426,.42057480301049466,.458183274052838,.4976837250274023,.5391024159806381,.5824650784040898,.6277969426914107,.6751227633498623,.7244668422128921,.775853049866786,.829304845476233,.8848452951698498,.942497089126609,1.0022825574869039,1.0642236851973577,1.1283421258858297,1.1946592148522128,1.2631959812511864,1.3339731595349034,1.407011200216447,1.4823302800086415,1.5599503113873272,1.6398909516233677,1.7221716113234105,1.8068114625156377,1.8938294463134073,1.9832442801866852,2.075074464868551,2.1693382909216234,2.2660538449872063,2.36523901573795,2.4669114995532007,2.5710888059345764,2.6777882626779785,2.7870270208169257,2.898822059350997,3.0131901897720907,3.1301480604002863,3.2497121605402226,3.3718988244681087,3.4967242352587946,3.624204428461639,3.754355295633311,3.887192587735158,4.022731918402185,4.160988767090289,4.301978482107941,4.445716283538092,4.592217266055746,4.741496401646282,4.893568542229298,5.048448422192488,5.20615066083972,5.3666897647573375,5.5300801301023865,5.696336044816294,5.865471690767354,6.037501145825082,6.212438385869475,6.390297286737924,6.571091626112461,6.7548350853498045,6.941541251256611,7.131223617812143,7.323895587840543,7.5195704746346665,7.7182615035334345,7.919981813454504,8.124744458384042,8.332562408825165,8.543448553206703,8.757415699253682,8.974476575321063,9.194643831691977,9.417930041841839,9.644347703669503,9.873909240696694,10.106627003236781,10.342513269534024,10.58158024687427,10.8238400726681,11.069304815507364,11.317986476196008,11.569896988756009,11.825048221409341,12.083451977536606,12.345119996613247,12.610063955123938,12.878295467455942,13.149826086772048,13.42466730586372,13.702830557985108,13.984327217668513,14.269168601521828,14.55736596900856,14.848930523210871,15.143873411576273,15.44220572664832,15.743938506781891,16.04908273684337,16.35764934889634,16.66964922287304,16.985093187232053,17.30399201960269,17.62635644741625,17.95219714852476,18.281524751807332,18.614349837764564,18.95068293910138,19.290534541298456,19.633915083172692,19.98083495742689,20.331304511189067,20.685334046541502,21.042933821039977,21.404114048223256,21.76888489811322,22.137256497705877,22.50923893145328,22.884842241736916,23.264076429332462,23.6469514538663,24.033477234264016,24.42366364919083,24.817520537484558,25.21505769858089,25.61628489293138,26.021211842414342,26.429848230738664,26.842203703840827,27.258287870275353,27.678110301598522,28.10168053274597,28.529008062403893,28.96010235337422,29.39497283293396,29.83362889318845,30.276079891419332,30.722335150426627,31.172403958865512,31.62629557157785,32.08401920991837,32.54558406207592,33.010999283389665,33.4802739966603,33.953417292456834,34.430438229418264,34.911345834551085,35.39614910352207,35.88485700094671,36.37747846067349,36.87402238606382,37.37449765026789,37.87891309649659,38.38727753828926,38.89959975977785,39.41588851594697,39.93615253289054,40.460400508064545,40.98864111053629,41.520882981230194,42.05713473317016,42.597404951718396,43.141702194811224,43.6900349931913,44.24241185063697,44.798841244188324,45.35933162437017,45.92389141541209,46.49252901546552,47.065252796817916,47.64207110610409,48.22299226451468,48.808024568002054,49.3971762874833,49.9904556690408,50.587870934119984,51.189430279724725,51.79514187861014,52.40501387947288,53.0190544071392,53.637271562750364,54.259673423945976,54.88626804504493,55.517063457223934,56.15206766869424,56.79128866487574,57.43473440856916,58.08241284012621,58.734331877617365,59.39049941699807,60.05092333227251,60.715611475655585,61.38457167773311,62.057811747619894,62.7353394731159,63.417162620860914,64.10328893648692,64.79372614476921,65.48848194977529,66.18756403501224,66.89098006357258,67.59873767827808,68.31084450182222,69.02730813691093,69.74813616640164,70.47333615344107,71.20291564160104,71.93688215501312,72.67524319850172,73.41800625771542,74.16517879925733,74.9167682708136,75.67278210128072,76.43322770089146,77.1981124613393,77.96744375590167,78.74122893956174,79.51947534912904,80.30219030335869,81.08938110306934,81.88105503125999,82.67721935322541,83.4778813166706,84.28304815182372,85.09272707154808,85.90692527145302,86.72564993000343,87.54890820862819,88.3767072518277,89.2090541872801,90.04595612594655,90.88742016217518,91.73345337380438,92.58406282226491,93.43925555268066,94.29903859396902,95.16341895893969,96.03240364439274,96.9059996312159,97.78421388448044,98.6670533535366,99.55452497210776];/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class M{static from(e,t,r){return new M(R.solveToInt(e,t,r))}static fromInt(e){return new M(e)}toInt(){return this.argb}get hue(){return this.internalHue}set hue(e){this.setInternalState(R.solveToInt(e,this.internalChroma,this.internalTone))}get chroma(){return this.internalChroma}set chroma(e){this.setInternalState(R.solveToInt(this.internalHue,e,this.internalTone))}get tone(){return this.internalTone}set tone(e){this.setInternalState(R.solveToInt(this.internalHue,this.internalChroma,e))}setValue(e,t){this[e]=t}toString(){return`HCT(${this.hue.toFixed(0)}, ${this.chroma.toFixed(0)}, ${this.tone.toFixed(0)})`}static isBlue(e){return e>=250&&e<270}static isYellow(e){return e>=105&&e<125}static isCyan(e){return e>=170&&e<207}constructor(e){this.argb=e;const t=we.fromInt(e);this.internalHue=t.hue,this.internalChroma=t.chroma,this.internalTone=wi(e),this.argb=e}setInternalState(e){const t=we.fromInt(e);this.internalHue=t.hue,this.internalChroma=t.chroma,this.internalTone=wi(e),this.argb=e}inViewingConditions(e){const r=we.fromInt(this.toInt()).xyzInViewingConditions(e),a=we.fromXyzInViewingConditions(r[0],r[1],r[2],Be.make());return M.from(a.hue,a.chroma,va(r[1]))}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class te{static ratioOfTones(e,t){return e=he(0,100,e),t=he(0,100,t),te.ratioOfYs(Je(e),Je(t))}static ratioOfYs(e,t){const r=e>t?e:t,a=r===t?e:t;return(r+5)/(a+5)}static lighter(e,t){if(e<0||e>100)return-1;const r=Je(e),a=t*(r+5)-5,i=te.ratioOfYs(a,r),n=Math.abs(i-t);if(i<t&&n>.04)return-1;const s=va(a)+.4;return s<0||s>100?-1:s}static darker(e,t){if(e<0||e>100)return-1;const r=Je(e),a=(r+5)/t-5,i=te.ratioOfYs(r,a),n=Math.abs(i-t);if(i<t&&n>.04)return-1;const s=va(a)-.4;return s<0||s>100?-1:s}static lighterUnsafe(e,t){const r=te.lighter(e,t);return r<0?100:r}static darkerUnsafe(e,t){const r=te.darker(e,t);return r<0?0:r}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yt{static isDisliked(e){const t=Math.round(e.hue)>=90&&Math.round(e.hue)<=111,r=Math.round(e.chroma)>16,a=Math.round(e.tone)<65;return t&&r&&a}static fixIfDisliked(e){return Yt.isDisliked(e)?M.from(e.hue,e.chroma,70):e}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nd(o,e,t){if(o.name!==t.name)throw new Error(`Attempting to extend color ${o.name} with color ${t.name} of different name for spec version ${e}.`);if(o.isBackground!==t.isBackground)throw new Error(`Attempting to extend color ${o.name} as a ${o.isBackground?"background":"foreground"} with color ${t.name} as a ${t.isBackground?"background":"foreground"} for spec version ${e}.`)}function L(o,e,t){return Nd(o,e,t),y.fromPalette({name:o.name,palette:r=>r.specVersion===e?t.palette(r):o.palette(r),tone:r=>r.specVersion===e?t.tone(r):o.tone(r),isBackground:o.isBackground,chromaMultiplier:r=>{const a=r.specVersion===e?t.chromaMultiplier:o.chromaMultiplier;return a!==void 0?a(r):1},background:r=>{const a=r.specVersion===e?t.background:o.background;return a!==void 0?a(r):void 0},secondBackground:r=>{const a=r.specVersion===e?t.secondBackground:o.secondBackground;return a!==void 0?a(r):void 0},contrastCurve:r=>{const a=r.specVersion===e?t.contrastCurve:o.contrastCurve;return a!==void 0?a(r):void 0},toneDeltaPair:r=>{const a=r.specVersion===e?t.toneDeltaPair:o.toneDeltaPair;return a!==void 0?a(r):void 0}})}class y{static fromPalette(e){return new y(e.name??"",e.palette,e.tone??y.getInitialToneFromBackground(e.background),e.isBackground??!1,e.chromaMultiplier,e.background,e.secondBackground,e.contrastCurve,e.toneDeltaPair)}static getInitialToneFromBackground(e){return e===void 0?t=>50:t=>e(t)?e(t).getTone(t):50}constructor(e,t,r,a,i,n,s,d,c){if(this.name=e,this.palette=t,this.tone=r,this.isBackground=a,this.chromaMultiplier=i,this.background=n,this.secondBackground=s,this.contrastCurve=d,this.toneDeltaPair=c,this.hctCache=new Map,!n&&s)throw new Error(`Color ${e} has secondBackgrounddefined, but background is not defined.`);if(!n&&d)throw new Error(`Color ${e} has contrastCurvedefined, but background is not defined.`);if(n&&!d)throw new Error(`Color ${e} has backgrounddefined, but contrastCurve is not defined.`)}clone(){return y.fromPalette({name:this.name,palette:this.palette,tone:this.tone,isBackground:this.isBackground,chromaMultiplier:this.chromaMultiplier,background:this.background,secondBackground:this.secondBackground,contrastCurve:this.contrastCurve,toneDeltaPair:this.toneDeltaPair})}clearCache(){this.hctCache.clear()}getArgb(e){return this.getHct(e).toInt()}getHct(e){const t=this.hctCache.get(e);if(t!=null)return t;const r=ki(e.specVersion).getHct(e,this);return this.hctCache.size>4&&this.hctCache.clear(),this.hctCache.set(e,r),r}getTone(e){return ki(e.specVersion).getTone(e,this)}static foregroundTone(e,t){const r=te.lighterUnsafe(e,t),a=te.darkerUnsafe(e,t),i=te.ratioOfTones(r,e),n=te.ratioOfTones(a,e);if(y.tonePrefersLightForeground(e)){const d=Math.abs(i-n)<.1&&i<t&&n<t;return i>=t||i>=n||d?r:a}else return n>=t||n>=i?a:r}static tonePrefersLightForeground(e){return Math.round(e)<60}static toneAllowsLightForeground(e){return Math.round(e)<=49}static enableLightForeground(e){return y.tonePrefersLightForeground(e)&&!y.toneAllowsLightForeground(e)?49:e}}class Vd{getHct(e,t){const r=t.getTone(e);return t.palette(e).getHct(r)}getTone(e,t){const r=e.contrastLevel<0,a=t.toneDeltaPair?t.toneDeltaPair(e):void 0;if(a){const i=a.roleA,n=a.roleB,s=a.delta,d=a.polarity,c=a.stayTogether,p=d==="nearer"||d==="lighter"&&!e.isDark||d==="darker"&&e.isDark,v=p?i:n,g=p?n:i,_=t.name===v.name,w=e.isDark?1:-1;let x=v.tone(e),C=g.tone(e);if(t.background&&v.contrastCurve&&g.contrastCurve){const P=t.background(e),A=v.contrastCurve(e),V=g.contrastCurve(e);if(P&&A&&V){const F=P.getTone(e),B=A.get(e.contrastLevel),G=V.get(e.contrastLevel);te.ratioOfTones(F,x)<B&&(x=y.foregroundTone(F,B)),te.ratioOfTones(F,C)<G&&(C=y.foregroundTone(F,G)),r&&(x=y.foregroundTone(F,B),C=y.foregroundTone(F,G))}}return(C-x)*w<s&&(C=he(0,100,x+s*w),(C-x)*w>=s||(x=he(0,100,C-s*w))),50<=x&&x<60?w>0?(x=60,C=Math.max(C,x+s*w)):(x=49,C=Math.min(C,x+s*w)):50<=C&&C<60&&(c?w>0?(x=60,C=Math.max(C,x+s*w)):(x=49,C=Math.min(C,x+s*w)):w>0?C=60:C=49),_?x:C}else{let i=t.tone(e);if(t.background==null||t.background(e)===void 0||t.contrastCurve==null||t.contrastCurve(e)===void 0)return i;const n=t.background(e).getTone(e),s=t.contrastCurve(e).get(e.contrastLevel);if(te.ratioOfTones(n,i)>=s||(i=y.foregroundTone(n,s)),r&&(i=y.foregroundTone(n,s)),t.isBackground&&50<=i&&i<60&&(te.ratioOfTones(49,n)>=s?i=49:i=60),t.secondBackground==null||t.secondBackground(e)===void 0)return i;const[d,c]=[t.background,t.secondBackground],[p,v]=[d(e).getTone(e),c(e).getTone(e)],[g,_]=[Math.max(p,v),Math.min(p,v)];if(te.ratioOfTones(g,i)>=s&&te.ratioOfTones(_,i)>=s)return i;const w=te.lighter(g,s),x=te.darker(_,s),C=[];return w!==-1&&C.push(w),x!==-1&&C.push(x),y.tonePrefersLightForeground(p)||y.tonePrefersLightForeground(v)?w<0?100:w:C.length===1?C[0]:x<0?0:x}}}class Hd{getHct(e,t){const r=t.palette(e),a=t.getTone(e),i=r.hue,n=r.chroma*(t.chromaMultiplier?t.chromaMultiplier(e):1);return M.from(i,n,a)}getTone(e,t){const r=t.toneDeltaPair?t.toneDeltaPair(e):void 0;if(r){const a=r.roleA,i=r.roleB,n=r.polarity,s=r.constraint,d=n==="darker"||n==="relative_lighter"&&e.isDark||n==="relative_darker"&&!e.isDark?-r.delta:r.delta,c=t.name===a.name,p=c?a:i,v=c?i:a;let g=p.tone(e),_=v.getTone(e);const w=d*(c?1:-1);if(s==="exact"?g=he(0,100,_+w):s==="nearer"?w>0?g=he(0,100,he(_,_+w,g)):g=he(0,100,he(_+w,_,g)):s==="farther"&&(w>0?g=he(_+w,100,g):g=he(0,_+w,g)),t.background&&t.contrastCurve){const x=t.background(e),C=t.contrastCurve(e);if(x&&C){const P=x.getTone(e),A=C.get(e.contrastLevel);g=te.ratioOfTones(P,g)>=A&&e.contrastLevel>=0?g:y.foregroundTone(P,A)}}return t.isBackground&&!t.name.endsWith("_fixed_dim")&&(g>=57?g=he(65,100,g):g=he(0,49,g)),g}else{let a=t.tone(e);if(t.background==null||t.background(e)===void 0||t.contrastCurve==null||t.contrastCurve(e)===void 0)return a;const i=t.background(e).getTone(e),n=t.contrastCurve(e).get(e.contrastLevel);if(a=te.ratioOfTones(i,a)>=n&&e.contrastLevel>=0?a:y.foregroundTone(i,n),t.isBackground&&!t.name.endsWith("_fixed_dim")&&(a>=57?a=he(65,100,a):a=he(0,49,a)),t.secondBackground==null||t.secondBackground(e)===void 0)return a;const[s,d]=[t.background,t.secondBackground],[c,p]=[s(e).getTone(e),d(e).getTone(e)],[v,g]=[Math.max(c,p),Math.min(c,p)];if(te.ratioOfTones(v,a)>=n&&te.ratioOfTones(g,a)>=n)return a;const _=te.lighter(v,n),w=te.darker(g,n),x=[];return _!==-1&&x.push(_),w!==-1&&x.push(w),y.tonePrefersLightForeground(c)||y.tonePrefersLightForeground(p)?_<0?100:_:x.length===1?x[0]:w<0?0:w}}}const Ud=new Vd,qd=new Hd;function ki(o){return o==="2025"?qd:Ud}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ${static fromInt(e){const t=M.fromInt(e);return $.fromHct(t)}static fromHct(e){return new $(e.hue,e.chroma,e)}static fromHueAndChroma(e,t){const r=new Kd(e,t).create();return new $(e,t,r)}constructor(e,t,r){this.hue=e,this.chroma=t,this.keyColor=r,this.cache=new Map}tone(e){let t=this.cache.get(e);return t===void 0&&(e==99&&M.isYellow(this.hue)?t=this.averageArgb(this.tone(98),this.tone(100)):t=M.from(this.hue,this.chroma,e).toInt(),this.cache.set(e,t)),t}getHct(e){return M.fromInt(this.tone(e))}averageArgb(e,t){const r=e>>>16&255,a=e>>>8&255,i=e&255,n=t>>>16&255,s=t>>>8&255,d=t&255,c=Math.round((r+n)/2),p=Math.round((a+s)/2),v=Math.round((i+d)/2);return(255<<24|(c&255)<<16|(p&255)<<8|v&255)>>>0}}class Kd{constructor(e,t){this.hue=e,this.requestedChroma=t,this.chromaCache=new Map,this.maxChromaValue=200}create(){let a=0,i=100;for(;a<i;){const n=Math.floor((a+i)/2),s=this.maxChroma(n)<this.maxChroma(n+1);if(this.maxChroma(n)>=this.requestedChroma-.01)if(Math.abs(a-50)<Math.abs(i-50))i=n;else{if(a===n)return M.from(this.hue,this.requestedChroma,a);a=n}else s?a=n+1:i=n}return M.from(this.hue,this.requestedChroma,a)}maxChroma(e){if(this.chromaCache.has(e))return this.chromaCache.get(e);const t=M.from(this.hue,this.maxChromaValue,e).chroma;return this.chromaCache.set(e,t),t}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Et{constructor(e){this.input=e,this.hctsByTempCache=[],this.hctsByHueCache=[],this.tempsByHctCache=new Map,this.inputRelativeTemperatureCache=-1,this.complementCache=null}get hctsByTemp(){if(this.hctsByTempCache.length>0)return this.hctsByTempCache;const e=this.hctsByHue.concat([this.input]),t=this.tempsByHct;return e.sort((r,a)=>t.get(r)-t.get(a)),this.hctsByTempCache=e,e}get warmest(){return this.hctsByTemp[this.hctsByTemp.length-1]}get coldest(){return this.hctsByTemp[0]}analogous(e=5,t=12){const r=Math.round(this.input.hue),a=this.hctsByHue[r];let i=this.relativeTemperature(a);const n=[a];let s=0;for(let w=0;w<360;w++){const x=xi(r+w),C=this.hctsByHue[x],P=this.relativeTemperature(C),A=Math.abs(P-i);i=P,s+=A}let d=1;const c=s/t;let p=0;for(i=this.relativeTemperature(a);n.length<t;){const w=xi(r+d),x=this.hctsByHue[w],C=this.relativeTemperature(x),P=Math.abs(C-i);p+=P;const A=n.length*c;let V=p>=A,F=1;for(;V&&n.length<t;){n.push(x);const B=(n.length+F)*c;V=p>=B,F++}if(i=C,d++,d>360){for(;n.length<t;)n.push(x);break}}const v=[this.input],g=Math.floor((e-1)/2);for(let w=1;w<g+1;w++){let x=0-w;for(;x<0;)x=n.length+x;x>=n.length&&(x=x%n.length),v.splice(0,0,n[x])}const _=e-g-1;for(let w=1;w<_+1;w++){let x=w;for(;x<0;)x=n.length+x;x>=n.length&&(x=x%n.length),v.push(n[x])}return v}get complement(){if(this.complementCache!=null)return this.complementCache;const e=this.coldest.hue,t=this.tempsByHct.get(this.coldest),r=this.warmest.hue,i=this.tempsByHct.get(this.warmest)-t,n=Et.isBetween(this.input.hue,e,r),s=n?r:e,d=n?e:r,c=1;let p=1e3,v=this.hctsByHue[Math.round(this.input.hue)];const g=1-this.inputRelativeTemperature;for(let _=0;_<=360;_+=1){const w=ke(s+c*_);if(!Et.isBetween(w,s,d))continue;const x=this.hctsByHue[Math.round(w)],C=(this.tempsByHct.get(x)-t)/i,P=Math.abs(g-C);P<p&&(p=P,v=x)}return this.complementCache=v,this.complementCache}relativeTemperature(e){const t=this.tempsByHct.get(this.warmest)-this.tempsByHct.get(this.coldest),r=this.tempsByHct.get(e)-this.tempsByHct.get(this.coldest);return t===0?.5:r/t}get inputRelativeTemperature(){return this.inputRelativeTemperatureCache>=0?this.inputRelativeTemperatureCache:(this.inputRelativeTemperatureCache=this.relativeTemperature(this.input),this.inputRelativeTemperatureCache)}get tempsByHct(){if(this.tempsByHctCache.size>0)return this.tempsByHctCache;const e=this.hctsByHue.concat([this.input]),t=new Map;for(const r of e)t.set(r,Et.rawTemperature(r));return this.tempsByHctCache=t,t}get hctsByHue(){if(this.hctsByHueCache.length>0)return this.hctsByHueCache;const e=[];for(let t=0;t<=360;t+=1){const r=M.from(t,this.input.chroma,this.input.tone);e.push(r)}return this.hctsByHueCache=e,this.hctsByHueCache}static isBetween(e,t,r){return t<r?t<=e&&e<=r:t<=e||e<=r}static rawTemperature(e){const t=Ld(e.toInt()),r=ke(Math.atan2(t[2],t[1])*180/Math.PI),a=Math.sqrt(t[1]*t[1]+t[2]*t[2]);return-.5+.02*Math.pow(a,1.07)*Math.cos(ke(r-50)*Math.PI/180)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class I{constructor(e,t,r,a){this.low=e,this.normal=t,this.medium=r,this.high=a}get(e){return e<=-1?this.low:e<0?Ut(this.low,this.normal,(e- -1)/1):e<.5?Ut(this.normal,this.medium,(e-0)/.5):e<1?Ut(this.medium,this.high,(e-.5)/.5):this.high}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X{constructor(e,t,r,a,i,n){this.roleA=e,this.roleB=t,this.delta=r,this.polarity=a,this.stayTogether=i,this.constraint=n,this.constraint=n??"exact"}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var f;(function(o){o[o.MONOCHROME=0]="MONOCHROME",o[o.NEUTRAL=1]="NEUTRAL",o[o.TONAL_SPOT=2]="TONAL_SPOT",o[o.VIBRANT=3]="VIBRANT",o[o.EXPRESSIVE=4]="EXPRESSIVE",o[o.FIDELITY=5]="FIDELITY",o[o.CONTENT=6]="CONTENT",o[o.RAINBOW=7]="RAINBOW",o[o.FRUIT_SALAD=8]="FRUIT_SALAD"})(f||(f={}));/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kt(o){return o.variant===f.FIDELITY||o.variant===f.CONTENT}function re(o){return o.variant===f.MONOCHROME}function jd(o,e,t,r){let a=t,i=M.from(o,e,t);if(i.chroma<e){let n=i.chroma;for(;i.chroma<e;){a+=r?-1:1;const s=M.from(o,e,a);if(n>s.chroma||Math.abs(s.chroma-e)<.4)break;const d=Math.abs(s.chroma-e),c=Math.abs(i.chroma-e);d<c&&(i=s),n=Math.max(n,s.chroma)}}return a}class Gd{primaryPaletteKeyColor(){return y.fromPalette({name:"primary_palette_key_color",palette:e=>e.primaryPalette,tone:e=>e.primaryPalette.keyColor.tone})}secondaryPaletteKeyColor(){return y.fromPalette({name:"secondary_palette_key_color",palette:e=>e.secondaryPalette,tone:e=>e.secondaryPalette.keyColor.tone})}tertiaryPaletteKeyColor(){return y.fromPalette({name:"tertiary_palette_key_color",palette:e=>e.tertiaryPalette,tone:e=>e.tertiaryPalette.keyColor.tone})}neutralPaletteKeyColor(){return y.fromPalette({name:"neutral_palette_key_color",palette:e=>e.neutralPalette,tone:e=>e.neutralPalette.keyColor.tone})}neutralVariantPaletteKeyColor(){return y.fromPalette({name:"neutral_variant_palette_key_color",palette:e=>e.neutralVariantPalette,tone:e=>e.neutralVariantPalette.keyColor.tone})}errorPaletteKeyColor(){return y.fromPalette({name:"error_palette_key_color",palette:e=>e.errorPalette,tone:e=>e.errorPalette.keyColor.tone})}background(){return y.fromPalette({name:"background",palette:e=>e.neutralPalette,tone:e=>e.isDark?6:98,isBackground:!0})}onBackground(){return y.fromPalette({name:"on_background",palette:e=>e.neutralPalette,tone:e=>e.isDark?90:10,background:e=>this.background(),contrastCurve:e=>new I(3,3,4.5,7)})}surface(){return y.fromPalette({name:"surface",palette:e=>e.neutralPalette,tone:e=>e.isDark?6:98,isBackground:!0})}surfaceDim(){return y.fromPalette({name:"surface_dim",palette:e=>e.neutralPalette,tone:e=>e.isDark?6:new I(87,87,80,75).get(e.contrastLevel),isBackground:!0})}surfaceBright(){return y.fromPalette({name:"surface_bright",palette:e=>e.neutralPalette,tone:e=>e.isDark?new I(24,24,29,34).get(e.contrastLevel):98,isBackground:!0})}surfaceContainerLowest(){return y.fromPalette({name:"surface_container_lowest",palette:e=>e.neutralPalette,tone:e=>e.isDark?new I(4,4,2,0).get(e.contrastLevel):100,isBackground:!0})}surfaceContainerLow(){return y.fromPalette({name:"surface_container_low",palette:e=>e.neutralPalette,tone:e=>e.isDark?new I(10,10,11,12).get(e.contrastLevel):new I(96,96,96,95).get(e.contrastLevel),isBackground:!0})}surfaceContainer(){return y.fromPalette({name:"surface_container",palette:e=>e.neutralPalette,tone:e=>e.isDark?new I(12,12,16,20).get(e.contrastLevel):new I(94,94,92,90).get(e.contrastLevel),isBackground:!0})}surfaceContainerHigh(){return y.fromPalette({name:"surface_container_high",palette:e=>e.neutralPalette,tone:e=>e.isDark?new I(17,17,21,25).get(e.contrastLevel):new I(92,92,88,85).get(e.contrastLevel),isBackground:!0})}surfaceContainerHighest(){return y.fromPalette({name:"surface_container_highest",palette:e=>e.neutralPalette,tone:e=>e.isDark?new I(22,22,26,30).get(e.contrastLevel):new I(90,90,84,80).get(e.contrastLevel),isBackground:!0})}onSurface(){return y.fromPalette({name:"on_surface",palette:e=>e.neutralPalette,tone:e=>e.isDark?90:10,background:e=>this.highestSurface(e),contrastCurve:e=>new I(4.5,7,11,21)})}surfaceVariant(){return y.fromPalette({name:"surface_variant",palette:e=>e.neutralVariantPalette,tone:e=>e.isDark?30:90,isBackground:!0})}onSurfaceVariant(){return y.fromPalette({name:"on_surface_variant",palette:e=>e.neutralVariantPalette,tone:e=>e.isDark?80:30,background:e=>this.highestSurface(e),contrastCurve:e=>new I(3,4.5,7,11)})}inverseSurface(){return y.fromPalette({name:"inverse_surface",palette:e=>e.neutralPalette,tone:e=>e.isDark?90:20,isBackground:!0})}inverseOnSurface(){return y.fromPalette({name:"inverse_on_surface",palette:e=>e.neutralPalette,tone:e=>e.isDark?20:95,background:e=>this.inverseSurface(),contrastCurve:e=>new I(4.5,7,11,21)})}outline(){return y.fromPalette({name:"outline",palette:e=>e.neutralVariantPalette,tone:e=>e.isDark?60:50,background:e=>this.highestSurface(e),contrastCurve:e=>new I(1.5,3,4.5,7)})}outlineVariant(){return y.fromPalette({name:"outline_variant",palette:e=>e.neutralVariantPalette,tone:e=>e.isDark?30:80,background:e=>this.highestSurface(e),contrastCurve:e=>new I(1,1,3,4.5)})}shadow(){return y.fromPalette({name:"shadow",palette:e=>e.neutralPalette,tone:e=>0})}scrim(){return y.fromPalette({name:"scrim",palette:e=>e.neutralPalette,tone:e=>0})}surfaceTint(){return y.fromPalette({name:"surface_tint",palette:e=>e.primaryPalette,tone:e=>e.isDark?80:40,isBackground:!0})}primary(){return y.fromPalette({name:"primary",palette:e=>e.primaryPalette,tone:e=>re(e)?e.isDark?100:0:e.isDark?80:40,isBackground:!0,background:e=>this.highestSurface(e),contrastCurve:e=>new I(3,4.5,7,7),toneDeltaPair:e=>new X(this.primaryContainer(),this.primary(),10,"nearer",!1)})}primaryDim(){}onPrimary(){return y.fromPalette({name:"on_primary",palette:e=>e.primaryPalette,tone:e=>re(e)?e.isDark?10:90:e.isDark?20:100,background:e=>this.primary(),contrastCurve:e=>new I(4.5,7,11,21)})}primaryContainer(){return y.fromPalette({name:"primary_container",palette:e=>e.primaryPalette,tone:e=>kt(e)?e.sourceColorHct.tone:re(e)?e.isDark?85:25:e.isDark?30:90,isBackground:!0,background:e=>this.highestSurface(e),contrastCurve:e=>new I(1,1,3,4.5),toneDeltaPair:e=>new X(this.primaryContainer(),this.primary(),10,"nearer",!1)})}onPrimaryContainer(){return y.fromPalette({name:"on_primary_container",palette:e=>e.primaryPalette,tone:e=>kt(e)?y.foregroundTone(this.primaryContainer().tone(e),4.5):re(e)?e.isDark?0:100:e.isDark?90:30,background:e=>this.primaryContainer(),contrastCurve:e=>new I(3,4.5,7,11)})}inversePrimary(){return y.fromPalette({name:"inverse_primary",palette:e=>e.primaryPalette,tone:e=>e.isDark?40:80,background:e=>this.inverseSurface(),contrastCurve:e=>new I(3,4.5,7,7)})}secondary(){return y.fromPalette({name:"secondary",palette:e=>e.secondaryPalette,tone:e=>e.isDark?80:40,isBackground:!0,background:e=>this.highestSurface(e),contrastCurve:e=>new I(3,4.5,7,7),toneDeltaPair:e=>new X(this.secondaryContainer(),this.secondary(),10,"nearer",!1)})}secondaryDim(){}onSecondary(){return y.fromPalette({name:"on_secondary",palette:e=>e.secondaryPalette,tone:e=>re(e)?e.isDark?10:100:e.isDark?20:100,background:e=>this.secondary(),contrastCurve:e=>new I(4.5,7,11,21)})}secondaryContainer(){return y.fromPalette({name:"secondary_container",palette:e=>e.secondaryPalette,tone:e=>{const t=e.isDark?30:90;return re(e)?e.isDark?30:85:kt(e)?jd(e.secondaryPalette.hue,e.secondaryPalette.chroma,t,!e.isDark):t},isBackground:!0,background:e=>this.highestSurface(e),contrastCurve:e=>new I(1,1,3,4.5),toneDeltaPair:e=>new X(this.secondaryContainer(),this.secondary(),10,"nearer",!1)})}onSecondaryContainer(){return y.fromPalette({name:"on_secondary_container",palette:e=>e.secondaryPalette,tone:e=>re(e)?e.isDark?90:10:kt(e)?y.foregroundTone(this.secondaryContainer().tone(e),4.5):e.isDark?90:30,background:e=>this.secondaryContainer(),contrastCurve:e=>new I(3,4.5,7,11)})}tertiary(){return y.fromPalette({name:"tertiary",palette:e=>e.tertiaryPalette,tone:e=>re(e)?e.isDark?90:25:e.isDark?80:40,isBackground:!0,background:e=>this.highestSurface(e),contrastCurve:e=>new I(3,4.5,7,7),toneDeltaPair:e=>new X(this.tertiaryContainer(),this.tertiary(),10,"nearer",!1)})}tertiaryDim(){}onTertiary(){return y.fromPalette({name:"on_tertiary",palette:e=>e.tertiaryPalette,tone:e=>re(e)?e.isDark?10:90:e.isDark?20:100,background:e=>this.tertiary(),contrastCurve:e=>new I(4.5,7,11,21)})}tertiaryContainer(){return y.fromPalette({name:"tertiary_container",palette:e=>e.tertiaryPalette,tone:e=>{if(re(e))return e.isDark?60:49;if(!kt(e))return e.isDark?30:90;const t=e.tertiaryPalette.getHct(e.sourceColorHct.tone);return Yt.fixIfDisliked(t).tone},isBackground:!0,background:e=>this.highestSurface(e),contrastCurve:e=>new I(1,1,3,4.5),toneDeltaPair:e=>new X(this.tertiaryContainer(),this.tertiary(),10,"nearer",!1)})}onTertiaryContainer(){return y.fromPalette({name:"on_tertiary_container",palette:e=>e.tertiaryPalette,tone:e=>re(e)?e.isDark?0:100:kt(e)?y.foregroundTone(this.tertiaryContainer().tone(e),4.5):e.isDark?90:30,background:e=>this.tertiaryContainer(),contrastCurve:e=>new I(3,4.5,7,11)})}error(){return y.fromPalette({name:"error",palette:e=>e.errorPalette,tone:e=>e.isDark?80:40,isBackground:!0,background:e=>this.highestSurface(e),contrastCurve:e=>new I(3,4.5,7,7),toneDeltaPair:e=>new X(this.errorContainer(),this.error(),10,"nearer",!1)})}errorDim(){}onError(){return y.fromPalette({name:"on_error",palette:e=>e.errorPalette,tone:e=>e.isDark?20:100,background:e=>this.error(),contrastCurve:e=>new I(4.5,7,11,21)})}errorContainer(){return y.fromPalette({name:"error_container",palette:e=>e.errorPalette,tone:e=>e.isDark?30:90,isBackground:!0,background:e=>this.highestSurface(e),contrastCurve:e=>new I(1,1,3,4.5),toneDeltaPair:e=>new X(this.errorContainer(),this.error(),10,"nearer",!1)})}onErrorContainer(){return y.fromPalette({name:"on_error_container",palette:e=>e.errorPalette,tone:e=>re(e)?e.isDark?90:10:e.isDark?90:30,background:e=>this.errorContainer(),contrastCurve:e=>new I(3,4.5,7,11)})}primaryFixed(){return y.fromPalette({name:"primary_fixed",palette:e=>e.primaryPalette,tone:e=>re(e)?40:90,isBackground:!0,background:e=>this.highestSurface(e),contrastCurve:e=>new I(1,1,3,4.5),toneDeltaPair:e=>new X(this.primaryFixed(),this.primaryFixedDim(),10,"lighter",!0)})}primaryFixedDim(){return y.fromPalette({name:"primary_fixed_dim",palette:e=>e.primaryPalette,tone:e=>re(e)?30:80,isBackground:!0,background:e=>this.highestSurface(e),contrastCurve:e=>new I(1,1,3,4.5),toneDeltaPair:e=>new X(this.primaryFixed(),this.primaryFixedDim(),10,"lighter",!0)})}onPrimaryFixed(){return y.fromPalette({name:"on_primary_fixed",palette:e=>e.primaryPalette,tone:e=>re(e)?100:10,background:e=>this.primaryFixedDim(),secondBackground:e=>this.primaryFixed(),contrastCurve:e=>new I(4.5,7,11,21)})}onPrimaryFixedVariant(){return y.fromPalette({name:"on_primary_fixed_variant",palette:e=>e.primaryPalette,tone:e=>re(e)?90:30,background:e=>this.primaryFixedDim(),secondBackground:e=>this.primaryFixed(),contrastCurve:e=>new I(3,4.5,7,11)})}secondaryFixed(){return y.fromPalette({name:"secondary_fixed",palette:e=>e.secondaryPalette,tone:e=>re(e)?80:90,isBackground:!0,background:e=>this.highestSurface(e),contrastCurve:e=>new I(1,1,3,4.5),toneDeltaPair:e=>new X(this.secondaryFixed(),this.secondaryFixedDim(),10,"lighter",!0)})}secondaryFixedDim(){return y.fromPalette({name:"secondary_fixed_dim",palette:e=>e.secondaryPalette,tone:e=>re(e)?70:80,isBackground:!0,background:e=>this.highestSurface(e),contrastCurve:e=>new I(1,1,3,4.5),toneDeltaPair:e=>new X(this.secondaryFixed(),this.secondaryFixedDim(),10,"lighter",!0)})}onSecondaryFixed(){return y.fromPalette({name:"on_secondary_fixed",palette:e=>e.secondaryPalette,tone:e=>10,background:e=>this.secondaryFixedDim(),secondBackground:e=>this.secondaryFixed(),contrastCurve:e=>new I(4.5,7,11,21)})}onSecondaryFixedVariant(){return y.fromPalette({name:"on_secondary_fixed_variant",palette:e=>e.secondaryPalette,tone:e=>re(e)?25:30,background:e=>this.secondaryFixedDim(),secondBackground:e=>this.secondaryFixed(),contrastCurve:e=>new I(3,4.5,7,11)})}tertiaryFixed(){return y.fromPalette({name:"tertiary_fixed",palette:e=>e.tertiaryPalette,tone:e=>re(e)?40:90,isBackground:!0,background:e=>this.highestSurface(e),contrastCurve:e=>new I(1,1,3,4.5),toneDeltaPair:e=>new X(this.tertiaryFixed(),this.tertiaryFixedDim(),10,"lighter",!0)})}tertiaryFixedDim(){return y.fromPalette({name:"tertiary_fixed_dim",palette:e=>e.tertiaryPalette,tone:e=>re(e)?30:80,isBackground:!0,background:e=>this.highestSurface(e),contrastCurve:e=>new I(1,1,3,4.5),toneDeltaPair:e=>new X(this.tertiaryFixed(),this.tertiaryFixedDim(),10,"lighter",!0)})}onTertiaryFixed(){return y.fromPalette({name:"on_tertiary_fixed",palette:e=>e.tertiaryPalette,tone:e=>re(e)?100:10,background:e=>this.tertiaryFixedDim(),secondBackground:e=>this.tertiaryFixed(),contrastCurve:e=>new I(4.5,7,11,21)})}onTertiaryFixedVariant(){return y.fromPalette({name:"on_tertiary_fixed_variant",palette:e=>e.tertiaryPalette,tone:e=>re(e)?90:30,background:e=>this.tertiaryFixedDim(),secondBackground:e=>this.tertiaryFixed(),contrastCurve:e=>new I(3,4.5,7,11)})}highestSurface(e){return e.isDark?this.surfaceBright():this.surfaceDim()}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function H(o,e=0,t=100,r=1){let a=ms(o.hue,o.chroma*r,100,!0);return he(e,t,a)}function Xe(o,e=0,t=100){let r=ms(o.hue,o.chroma,0,!1);return he(e,t,r)}function ms(o,e,t,r){let a=t,i=M.from(o,e,a);for(;i.chroma<e&&!(t<0||t>100);){t+=r?-1:1;const n=M.from(o,e,t);i.chroma<n.chroma&&(i=n,a=t)}return a}function z(o){return o===1.5?new I(1.5,1.5,3,5.5):o===3?new I(3,3,4.5,7):o===4.5?new I(4.5,4.5,7,11):o===6?new I(6,6,7,11):o===7?new I(7,7,11,21):o===9?new I(9,9,11,21):o===11?new I(11,11,21,21):o===21?new I(21,21,21,21):new I(o,o,7,21)}class Wd extends Gd{surface(){const e=y.fromPalette({name:"surface",palette:t=>t.neutralPalette,tone:t=>(super.surface().tone(t),t.platform==="phone"?t.isDark?4:M.isYellow(t.neutralPalette.hue)?99:t.variant===f.VIBRANT?97:98:0),isBackground:!0});return L(super.surface(),"2025",e)}surfaceDim(){const e=y.fromPalette({name:"surface_dim",palette:t=>t.neutralPalette,tone:t=>t.isDark?4:M.isYellow(t.neutralPalette.hue)?90:t.variant===f.VIBRANT?85:87,isBackground:!0,chromaMultiplier:t=>{if(!t.isDark){if(t.variant===f.NEUTRAL)return 2.5;if(t.variant===f.TONAL_SPOT)return 1.7;if(t.variant===f.EXPRESSIVE)return M.isYellow(t.neutralPalette.hue)?2.7:1.75;if(t.variant===f.VIBRANT)return 1.36}return 1}});return L(super.surfaceDim(),"2025",e)}surfaceBright(){const e=y.fromPalette({name:"surface_bright",palette:t=>t.neutralPalette,tone:t=>t.isDark?18:M.isYellow(t.neutralPalette.hue)?99:t.variant===f.VIBRANT?97:98,isBackground:!0,chromaMultiplier:t=>{if(t.isDark){if(t.variant===f.NEUTRAL)return 2.5;if(t.variant===f.TONAL_SPOT)return 1.7;if(t.variant===f.EXPRESSIVE)return M.isYellow(t.neutralPalette.hue)?2.7:1.75;if(t.variant===f.VIBRANT)return 1.36}return 1}});return L(super.surfaceBright(),"2025",e)}surfaceContainerLowest(){const e=y.fromPalette({name:"surface_container_lowest",palette:t=>t.neutralPalette,tone:t=>t.isDark?0:100,isBackground:!0});return L(super.surfaceContainerLowest(),"2025",e)}surfaceContainerLow(){const e=y.fromPalette({name:"surface_container_low",palette:t=>t.neutralPalette,tone:t=>t.platform==="phone"?t.isDark?6:M.isYellow(t.neutralPalette.hue)?98:t.variant===f.VIBRANT?95:96:15,isBackground:!0,chromaMultiplier:t=>{if(t.platform==="phone"){if(t.variant===f.NEUTRAL)return 1.3;if(t.variant===f.TONAL_SPOT)return 1.25;if(t.variant===f.EXPRESSIVE)return M.isYellow(t.neutralPalette.hue)?1.3:1.15;if(t.variant===f.VIBRANT)return 1.08}return 1}});return L(super.surfaceContainerLow(),"2025",e)}surfaceContainer(){const e=y.fromPalette({name:"surface_container",palette:t=>t.neutralPalette,tone:t=>t.platform==="phone"?t.isDark?9:M.isYellow(t.neutralPalette.hue)?96:t.variant===f.VIBRANT?92:94:20,isBackground:!0,chromaMultiplier:t=>{if(t.platform==="phone"){if(t.variant===f.NEUTRAL)return 1.6;if(t.variant===f.TONAL_SPOT)return 1.4;if(t.variant===f.EXPRESSIVE)return M.isYellow(t.neutralPalette.hue)?1.6:1.3;if(t.variant===f.VIBRANT)return 1.15}return 1}});return L(super.surfaceContainer(),"2025",e)}surfaceContainerHigh(){const e=y.fromPalette({name:"surface_container_high",palette:t=>t.neutralPalette,tone:t=>t.platform==="phone"?t.isDark?12:M.isYellow(t.neutralPalette.hue)?94:t.variant===f.VIBRANT?90:92:25,isBackground:!0,chromaMultiplier:t=>{if(t.platform==="phone"){if(t.variant===f.NEUTRAL)return 1.9;if(t.variant===f.TONAL_SPOT)return 1.5;if(t.variant===f.EXPRESSIVE)return M.isYellow(t.neutralPalette.hue)?1.95:1.45;if(t.variant===f.VIBRANT)return 1.22}return 1}});return L(super.surfaceContainerHigh(),"2025",e)}surfaceContainerHighest(){const e=y.fromPalette({name:"surface_container_highest",palette:t=>t.neutralPalette,tone:t=>t.isDark?15:M.isYellow(t.neutralPalette.hue)?92:t.variant===f.VIBRANT?88:90,isBackground:!0,chromaMultiplier:t=>t.variant===f.NEUTRAL?2.2:t.variant===f.TONAL_SPOT?1.7:t.variant===f.EXPRESSIVE?M.isYellow(t.neutralPalette.hue)?2.3:1.6:t.variant===f.VIBRANT?1.29:1});return L(super.surfaceContainerHighest(),"2025",e)}onSurface(){const e=y.fromPalette({name:"on_surface",palette:t=>t.neutralPalette,tone:t=>t.variant===f.VIBRANT?H(t.neutralPalette,0,100,1.1):y.getInitialToneFromBackground(r=>r.platform==="phone"?this.highestSurface(r):this.surfaceContainerHigh())(t),chromaMultiplier:t=>{if(t.platform==="phone"){if(t.variant===f.NEUTRAL)return 2.2;if(t.variant===f.TONAL_SPOT)return 1.7;if(t.variant===f.EXPRESSIVE)return M.isYellow(t.neutralPalette.hue)?t.isDark?3:2.3:1.6}return 1},background:t=>t.platform==="phone"?this.highestSurface(t):this.surfaceContainerHigh(),contrastCurve:t=>t.isDark&&t.platform==="phone"?z(11):z(9)});return L(super.onSurface(),"2025",e)}onSurfaceVariant(){const e=y.fromPalette({name:"on_surface_variant",palette:t=>t.neutralPalette,chromaMultiplier:t=>{if(t.platform==="phone"){if(t.variant===f.NEUTRAL)return 2.2;if(t.variant===f.TONAL_SPOT)return 1.7;if(t.variant===f.EXPRESSIVE)return M.isYellow(t.neutralPalette.hue)?t.isDark?3:2.3:1.6}return 1},background:t=>t.platform==="phone"?this.highestSurface(t):this.surfaceContainerHigh(),contrastCurve:t=>t.platform==="phone"?t.isDark?z(6):z(4.5):z(7)});return L(super.onSurfaceVariant(),"2025",e)}outline(){const e=y.fromPalette({name:"outline",palette:t=>t.neutralPalette,chromaMultiplier:t=>{if(t.platform==="phone"){if(t.variant===f.NEUTRAL)return 2.2;if(t.variant===f.TONAL_SPOT)return 1.7;if(t.variant===f.EXPRESSIVE)return M.isYellow(t.neutralPalette.hue)?t.isDark?3:2.3:1.6}return 1},background:t=>t.platform==="phone"?this.highestSurface(t):this.surfaceContainerHigh(),contrastCurve:t=>t.platform==="phone"?z(3):z(4.5)});return L(super.outline(),"2025",e)}outlineVariant(){const e=y.fromPalette({name:"outline_variant",palette:t=>t.neutralPalette,chromaMultiplier:t=>{if(t.platform==="phone"){if(t.variant===f.NEUTRAL)return 2.2;if(t.variant===f.TONAL_SPOT)return 1.7;if(t.variant===f.EXPRESSIVE)return M.isYellow(t.neutralPalette.hue)?t.isDark?3:2.3:1.6}return 1},background:t=>t.platform==="phone"?this.highestSurface(t):this.surfaceContainerHigh(),contrastCurve:t=>t.platform==="phone"?z(1.5):z(3)});return L(super.outlineVariant(),"2025",e)}inverseSurface(){const e=y.fromPalette({name:"inverse_surface",palette:t=>t.neutralPalette,tone:t=>t.isDark?98:4,isBackground:!0});return L(super.inverseSurface(),"2025",e)}inverseOnSurface(){const e=y.fromPalette({name:"inverse_on_surface",palette:t=>t.neutralPalette,background:t=>this.inverseSurface(),contrastCurve:t=>z(7)});return L(super.inverseOnSurface(),"2025",e)}primary(){const e=y.fromPalette({name:"primary",palette:t=>t.primaryPalette,tone:t=>t.variant===f.NEUTRAL?t.platform==="phone"?t.isDark?80:40:90:t.variant===f.TONAL_SPOT?t.platform==="phone"?t.isDark?80:H(t.primaryPalette):H(t.primaryPalette,0,90):t.variant===f.EXPRESSIVE?t.platform==="phone"?H(t.primaryPalette,0,M.isYellow(t.primaryPalette.hue)?25:M.isCyan(t.primaryPalette.hue)?88:98):H(t.primaryPalette):t.platform==="phone"?H(t.primaryPalette,0,M.isCyan(t.primaryPalette.hue)?88:98):H(t.primaryPalette),isBackground:!0,background:t=>t.platform==="phone"?this.highestSurface(t):this.surfaceContainerHigh(),contrastCurve:t=>t.platform==="phone"?z(4.5):z(7),toneDeltaPair:t=>t.platform==="phone"?new X(this.primaryContainer(),this.primary(),5,"relative_lighter",!0,"farther"):void 0});return L(super.primary(),"2025",e)}primaryDim(){return y.fromPalette({name:"primary_dim",palette:e=>e.primaryPalette,tone:e=>e.variant===f.NEUTRAL?85:e.variant===f.TONAL_SPOT?H(e.primaryPalette,0,90):H(e.primaryPalette),isBackground:!0,background:e=>this.surfaceContainerHigh(),contrastCurve:e=>z(4.5),toneDeltaPair:e=>new X(this.primaryDim(),this.primary(),5,"darker",!0,"farther")})}onPrimary(){const e=y.fromPalette({name:"on_primary",palette:t=>t.primaryPalette,background:t=>t.platform==="phone"?this.primary():this.primaryDim(),contrastCurve:t=>t.platform==="phone"?z(6):z(7)});return L(super.onPrimary(),"2025",e)}primaryContainer(){const e=y.fromPalette({name:"primary_container",palette:t=>t.primaryPalette,tone:t=>t.platform==="watch"?30:t.variant===f.NEUTRAL?t.isDark?30:90:t.variant===f.TONAL_SPOT?t.isDark?Xe(t.primaryPalette,35,93):H(t.primaryPalette,0,90):t.variant===f.EXPRESSIVE?t.isDark?H(t.primaryPalette,30,93):H(t.primaryPalette,78,M.isCyan(t.primaryPalette.hue)?88:90):t.isDark?Xe(t.primaryPalette,66,93):H(t.primaryPalette,66,M.isCyan(t.primaryPalette.hue)?88:93),isBackground:!0,background:t=>t.platform==="phone"?this.highestSurface(t):void 0,toneDeltaPair:t=>t.platform==="phone"?void 0:new X(this.primaryContainer(),this.primaryDim(),10,"darker",!0,"farther"),contrastCurve:t=>t.platform==="phone"&&t.contrastLevel>0?z(1.5):void 0});return L(super.primaryContainer(),"2025",e)}onPrimaryContainer(){const e=y.fromPalette({name:"on_primary_container",palette:t=>t.primaryPalette,background:t=>this.primaryContainer(),contrastCurve:t=>t.platform==="phone"?z(6):z(7)});return L(super.onPrimaryContainer(),"2025",e)}primaryFixed(){const e=y.fromPalette({name:"primary_fixed",palette:t=>t.primaryPalette,tone:t=>{let r=Object.assign({},t,{isDark:!1,contrastLevel:0});return this.primaryContainer().getTone(r)},isBackground:!0,background:t=>t.platform==="phone"?this.highestSurface(t):void 0,contrastCurve:t=>t.platform==="phone"&&t.contrastLevel>0?z(1.5):void 0});return L(super.primaryFixed(),"2025",e)}primaryFixedDim(){const e=y.fromPalette({name:"primary_fixed_dim",palette:t=>t.primaryPalette,tone:t=>this.primaryFixed().getTone(t),isBackground:!0,toneDeltaPair:t=>new X(this.primaryFixedDim(),this.primaryFixed(),5,"darker",!0,"exact")});return L(super.primaryFixedDim(),"2025",e)}onPrimaryFixed(){const e=y.fromPalette({name:"on_primary_fixed",palette:t=>t.primaryPalette,background:t=>this.primaryFixedDim(),contrastCurve:t=>z(7)});return L(super.onPrimaryFixed(),"2025",e)}onPrimaryFixedVariant(){const e=y.fromPalette({name:"on_primary_fixed_variant",palette:t=>t.primaryPalette,background:t=>this.primaryFixedDim(),contrastCurve:t=>z(4.5)});return L(super.onPrimaryFixedVariant(),"2025",e)}inversePrimary(){const e=y.fromPalette({name:"inverse_primary",palette:t=>t.primaryPalette,tone:t=>H(t.primaryPalette),background:t=>this.inverseSurface(),contrastCurve:t=>t.platform==="phone"?z(6):z(7)});return L(super.inversePrimary(),"2025",e)}secondary(){const e=y.fromPalette({name:"secondary",palette:t=>t.secondaryPalette,tone:t=>t.platform==="watch"?t.variant===f.NEUTRAL?90:H(t.secondaryPalette,0,90):t.variant===f.NEUTRAL?t.isDark?Xe(t.secondaryPalette,0,98):H(t.secondaryPalette):t.variant===f.VIBRANT?H(t.secondaryPalette,0,t.isDark?90:98):t.isDark?80:H(t.secondaryPalette),isBackground:!0,background:t=>t.platform==="phone"?this.highestSurface(t):this.surfaceContainerHigh(),contrastCurve:t=>t.platform==="phone"?z(4.5):z(7),toneDeltaPair:t=>t.platform==="phone"?new X(this.secondaryContainer(),this.secondary(),5,"relative_lighter",!0,"farther"):void 0});return L(super.secondary(),"2025",e)}secondaryDim(){return y.fromPalette({name:"secondary_dim",palette:e=>e.secondaryPalette,tone:e=>e.variant===f.NEUTRAL?85:H(e.secondaryPalette,0,90),isBackground:!0,background:e=>this.surfaceContainerHigh(),contrastCurve:e=>z(4.5),toneDeltaPair:e=>new X(this.secondaryDim(),this.secondary(),5,"darker",!0,"farther")})}onSecondary(){const e=y.fromPalette({name:"on_secondary",palette:t=>t.secondaryPalette,background:t=>t.platform==="phone"?this.secondary():this.secondaryDim(),contrastCurve:t=>t.platform==="phone"?z(6):z(7)});return L(super.onSecondary(),"2025",e)}secondaryContainer(){const e=y.fromPalette({name:"secondary_container",palette:t=>t.secondaryPalette,tone:t=>t.platform==="watch"?30:t.variant===f.VIBRANT?t.isDark?Xe(t.secondaryPalette,30,40):H(t.secondaryPalette,84,90):t.variant===f.EXPRESSIVE?t.isDark?15:H(t.secondaryPalette,90,95):t.isDark?25:90,isBackground:!0,background:t=>t.platform==="phone"?this.highestSurface(t):void 0,toneDeltaPair:t=>t.platform==="watch"?new X(this.secondaryContainer(),this.secondaryDim(),10,"darker",!0,"farther"):void 0,contrastCurve:t=>t.platform==="phone"&&t.contrastLevel>0?z(1.5):void 0});return L(super.secondaryContainer(),"2025",e)}onSecondaryContainer(){const e=y.fromPalette({name:"on_secondary_container",palette:t=>t.secondaryPalette,background:t=>this.secondaryContainer(),contrastCurve:t=>t.platform==="phone"?z(6):z(7)});return L(super.onSecondaryContainer(),"2025",e)}secondaryFixed(){const e=y.fromPalette({name:"secondary_fixed",palette:t=>t.secondaryPalette,tone:t=>{let r=Object.assign({},t,{isDark:!1,contrastLevel:0});return this.secondaryContainer().getTone(r)},isBackground:!0,background:t=>t.platform==="phone"?this.highestSurface(t):void 0,contrastCurve:t=>t.platform==="phone"&&t.contrastLevel>0?z(1.5):void 0});return L(super.secondaryFixed(),"2025",e)}secondaryFixedDim(){const e=y.fromPalette({name:"secondary_fixed_dim",palette:t=>t.secondaryPalette,tone:t=>this.secondaryFixed().getTone(t),isBackground:!0,toneDeltaPair:t=>new X(this.secondaryFixedDim(),this.secondaryFixed(),5,"darker",!0,"exact")});return L(super.secondaryFixedDim(),"2025",e)}onSecondaryFixed(){const e=y.fromPalette({name:"on_secondary_fixed",palette:t=>t.secondaryPalette,background:t=>this.secondaryFixedDim(),contrastCurve:t=>z(7)});return L(super.onSecondaryFixed(),"2025",e)}onSecondaryFixedVariant(){const e=y.fromPalette({name:"on_secondary_fixed_variant",palette:t=>t.secondaryPalette,background:t=>this.secondaryFixedDim(),contrastCurve:t=>z(4.5)});return L(super.onSecondaryFixedVariant(),"2025",e)}tertiary(){const e=y.fromPalette({name:"tertiary",palette:t=>t.tertiaryPalette,tone:t=>t.platform==="watch"?t.variant===f.TONAL_SPOT?H(t.tertiaryPalette,0,90):H(t.tertiaryPalette):t.variant===f.EXPRESSIVE||t.variant===f.VIBRANT?H(t.tertiaryPalette,0,M.isCyan(t.tertiaryPalette.hue)?88:t.isDark?98:100):t.isDark?H(t.tertiaryPalette,0,98):H(t.tertiaryPalette),isBackground:!0,background:t=>t.platform==="phone"?this.highestSurface(t):this.surfaceContainerHigh(),contrastCurve:t=>t.platform==="phone"?z(4.5):z(7),toneDeltaPair:t=>t.platform==="phone"?new X(this.tertiaryContainer(),this.tertiary(),5,"relative_lighter",!0,"farther"):void 0});return L(super.tertiary(),"2025",e)}tertiaryDim(){return y.fromPalette({name:"tertiary_dim",palette:e=>e.tertiaryPalette,tone:e=>e.variant===f.TONAL_SPOT?H(e.tertiaryPalette,0,90):H(e.tertiaryPalette),isBackground:!0,background:e=>this.surfaceContainerHigh(),contrastCurve:e=>z(4.5),toneDeltaPair:e=>new X(this.tertiaryDim(),this.tertiary(),5,"darker",!0,"farther")})}onTertiary(){const e=y.fromPalette({name:"on_tertiary",palette:t=>t.tertiaryPalette,background:t=>t.platform==="phone"?this.tertiary():this.tertiaryDim(),contrastCurve:t=>t.platform==="phone"?z(6):z(7)});return L(super.onTertiary(),"2025",e)}tertiaryContainer(){const e=y.fromPalette({name:"tertiary_container",palette:t=>t.tertiaryPalette,tone:t=>t.platform==="watch"?t.variant===f.TONAL_SPOT?H(t.tertiaryPalette,0,90):H(t.tertiaryPalette):t.variant===f.NEUTRAL?t.isDark?H(t.tertiaryPalette,0,93):H(t.tertiaryPalette,0,96):t.variant===f.TONAL_SPOT?H(t.tertiaryPalette,0,t.isDark?93:100):t.variant===f.EXPRESSIVE?H(t.tertiaryPalette,75,M.isCyan(t.tertiaryPalette.hue)?88:t.isDark?93:100):t.isDark?H(t.tertiaryPalette,0,93):H(t.tertiaryPalette,72,100),isBackground:!0,background:t=>t.platform==="phone"?this.highestSurface(t):void 0,toneDeltaPair:t=>t.platform==="watch"?new X(this.tertiaryContainer(),this.tertiaryDim(),10,"darker",!0,"farther"):void 0,contrastCurve:t=>t.platform==="phone"&&t.contrastLevel>0?z(1.5):void 0});return L(super.tertiaryContainer(),"2025",e)}onTertiaryContainer(){const e=y.fromPalette({name:"on_tertiary_container",palette:t=>t.tertiaryPalette,background:t=>this.tertiaryContainer(),contrastCurve:t=>t.platform==="phone"?z(6):z(7)});return L(super.onTertiaryContainer(),"2025",e)}tertiaryFixed(){const e=y.fromPalette({name:"tertiary_fixed",palette:t=>t.tertiaryPalette,tone:t=>{let r=Object.assign({},t,{isDark:!1,contrastLevel:0});return this.tertiaryContainer().getTone(r)},isBackground:!0,background:t=>t.platform==="phone"?this.highestSurface(t):void 0,contrastCurve:t=>t.platform==="phone"&&t.contrastLevel>0?z(1.5):void 0});return L(super.tertiaryFixed(),"2025",e)}tertiaryFixedDim(){const e=y.fromPalette({name:"tertiary_fixed_dim",palette:t=>t.tertiaryPalette,tone:t=>this.tertiaryFixed().getTone(t),isBackground:!0,toneDeltaPair:t=>new X(this.tertiaryFixedDim(),this.tertiaryFixed(),5,"darker",!0,"exact")});return L(super.tertiaryFixedDim(),"2025",e)}onTertiaryFixed(){const e=y.fromPalette({name:"on_tertiary_fixed",palette:t=>t.tertiaryPalette,background:t=>this.tertiaryFixedDim(),contrastCurve:t=>z(7)});return L(super.onTertiaryFixed(),"2025",e)}onTertiaryFixedVariant(){const e=y.fromPalette({name:"on_tertiary_fixed_variant",palette:t=>t.tertiaryPalette,background:t=>this.tertiaryFixedDim(),contrastCurve:t=>z(4.5)});return L(super.onTertiaryFixedVariant(),"2025",e)}error(){const e=y.fromPalette({name:"error",palette:t=>t.errorPalette,tone:t=>t.platform==="phone"?t.isDark?Xe(t.errorPalette,0,98):H(t.errorPalette):Xe(t.errorPalette),isBackground:!0,background:t=>t.platform==="phone"?this.highestSurface(t):this.surfaceContainerHigh(),contrastCurve:t=>t.platform==="phone"?z(4.5):z(7),toneDeltaPair:t=>t.platform==="phone"?new X(this.errorContainer(),this.error(),5,"relative_lighter",!0,"farther"):void 0});return L(super.error(),"2025",e)}errorDim(){return y.fromPalette({name:"error_dim",palette:e=>e.errorPalette,tone:e=>Xe(e.errorPalette),isBackground:!0,background:e=>this.surfaceContainerHigh(),contrastCurve:e=>z(4.5),toneDeltaPair:e=>new X(this.errorDim(),this.error(),5,"darker",!0,"farther")})}onError(){const e=y.fromPalette({name:"on_error",palette:t=>t.errorPalette,background:t=>t.platform==="phone"?this.error():this.errorDim(),contrastCurve:t=>t.platform==="phone"?z(6):z(7)});return L(super.onError(),"2025",e)}errorContainer(){const e=y.fromPalette({name:"error_container",palette:t=>t.errorPalette,tone:t=>t.platform==="watch"?30:t.isDark?Xe(t.errorPalette,30,93):H(t.errorPalette,0,90),isBackground:!0,background:t=>t.platform==="phone"?this.highestSurface(t):void 0,toneDeltaPair:t=>t.platform==="watch"?new X(this.errorContainer(),this.errorDim(),10,"darker",!0,"farther"):void 0,contrastCurve:t=>t.platform==="phone"&&t.contrastLevel>0?z(1.5):void 0});return L(super.errorContainer(),"2025",e)}onErrorContainer(){const e=y.fromPalette({name:"on_error_container",palette:t=>t.errorPalette,background:t=>this.errorContainer(),contrastCurve:t=>t.platform==="phone"?z(4.5):z(7)});return L(super.onErrorContainer(),"2025",e)}surfaceVariant(){const e=Object.assign(this.surfaceContainerHighest().clone(),{name:"surface_variant"});return L(super.surfaceVariant(),"2025",e)}surfaceTint(){const e=Object.assign(this.primary().clone(),{name:"surface_tint"});return L(super.surfaceTint(),"2025",e)}background(){const e=Object.assign(this.surface().clone(),{name:"background"});return L(super.background(),"2025",e)}onBackground(){const e=Object.assign(this.onSurface().clone(),{name:"on_background",tone:t=>t.platform==="watch"?100:this.onSurface().getTone(t)});return L(super.onBackground(),"2025",e)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class m{constructor(){this.allColors=[this.background(),this.onBackground(),this.surface(),this.surfaceDim(),this.surfaceBright(),this.surfaceContainerLowest(),this.surfaceContainerLow(),this.surfaceContainer(),this.surfaceContainerHigh(),this.surfaceContainerHighest(),this.onSurface(),this.onSurfaceVariant(),this.outline(),this.outlineVariant(),this.inverseSurface(),this.inverseOnSurface(),this.primary(),this.primaryDim(),this.onPrimary(),this.primaryContainer(),this.onPrimaryContainer(),this.primaryFixed(),this.primaryFixedDim(),this.onPrimaryFixed(),this.onPrimaryFixedVariant(),this.inversePrimary(),this.secondary(),this.secondaryDim(),this.onSecondary(),this.secondaryContainer(),this.onSecondaryContainer(),this.secondaryFixed(),this.secondaryFixedDim(),this.onSecondaryFixed(),this.onSecondaryFixedVariant(),this.tertiary(),this.tertiaryDim(),this.onTertiary(),this.tertiaryContainer(),this.onTertiaryContainer(),this.tertiaryFixed(),this.tertiaryFixedDim(),this.onTertiaryFixed(),this.onTertiaryFixedVariant(),this.error(),this.errorDim(),this.onError(),this.errorContainer(),this.onErrorContainer()].filter(e=>e!==void 0)}highestSurface(e){return m.colorSpec.highestSurface(e)}primaryPaletteKeyColor(){return m.colorSpec.primaryPaletteKeyColor()}secondaryPaletteKeyColor(){return m.colorSpec.secondaryPaletteKeyColor()}tertiaryPaletteKeyColor(){return m.colorSpec.tertiaryPaletteKeyColor()}neutralPaletteKeyColor(){return m.colorSpec.neutralPaletteKeyColor()}neutralVariantPaletteKeyColor(){return m.colorSpec.neutralVariantPaletteKeyColor()}errorPaletteKeyColor(){return m.colorSpec.errorPaletteKeyColor()}background(){return m.colorSpec.background()}onBackground(){return m.colorSpec.onBackground()}surface(){return m.colorSpec.surface()}surfaceDim(){return m.colorSpec.surfaceDim()}surfaceBright(){return m.colorSpec.surfaceBright()}surfaceContainerLowest(){return m.colorSpec.surfaceContainerLowest()}surfaceContainerLow(){return m.colorSpec.surfaceContainerLow()}surfaceContainer(){return m.colorSpec.surfaceContainer()}surfaceContainerHigh(){return m.colorSpec.surfaceContainerHigh()}surfaceContainerHighest(){return m.colorSpec.surfaceContainerHighest()}onSurface(){return m.colorSpec.onSurface()}surfaceVariant(){return m.colorSpec.surfaceVariant()}onSurfaceVariant(){return m.colorSpec.onSurfaceVariant()}outline(){return m.colorSpec.outline()}outlineVariant(){return m.colorSpec.outlineVariant()}inverseSurface(){return m.colorSpec.inverseSurface()}inverseOnSurface(){return m.colorSpec.inverseOnSurface()}shadow(){return m.colorSpec.shadow()}scrim(){return m.colorSpec.scrim()}surfaceTint(){return m.colorSpec.surfaceTint()}primary(){return m.colorSpec.primary()}primaryDim(){return m.colorSpec.primaryDim()}onPrimary(){return m.colorSpec.onPrimary()}primaryContainer(){return m.colorSpec.primaryContainer()}onPrimaryContainer(){return m.colorSpec.onPrimaryContainer()}inversePrimary(){return m.colorSpec.inversePrimary()}primaryFixed(){return m.colorSpec.primaryFixed()}primaryFixedDim(){return m.colorSpec.primaryFixedDim()}onPrimaryFixed(){return m.colorSpec.onPrimaryFixed()}onPrimaryFixedVariant(){return m.colorSpec.onPrimaryFixedVariant()}secondary(){return m.colorSpec.secondary()}secondaryDim(){return m.colorSpec.secondaryDim()}onSecondary(){return m.colorSpec.onSecondary()}secondaryContainer(){return m.colorSpec.secondaryContainer()}onSecondaryContainer(){return m.colorSpec.onSecondaryContainer()}secondaryFixed(){return m.colorSpec.secondaryFixed()}secondaryFixedDim(){return m.colorSpec.secondaryFixedDim()}onSecondaryFixed(){return m.colorSpec.onSecondaryFixed()}onSecondaryFixedVariant(){return m.colorSpec.onSecondaryFixedVariant()}tertiary(){return m.colorSpec.tertiary()}tertiaryDim(){return m.colorSpec.tertiaryDim()}onTertiary(){return m.colorSpec.onTertiary()}tertiaryContainer(){return m.colorSpec.tertiaryContainer()}onTertiaryContainer(){return m.colorSpec.onTertiaryContainer()}tertiaryFixed(){return m.colorSpec.tertiaryFixed()}tertiaryFixedDim(){return m.colorSpec.tertiaryFixedDim()}onTertiaryFixed(){return m.colorSpec.onTertiaryFixed()}onTertiaryFixedVariant(){return m.colorSpec.onTertiaryFixedVariant()}error(){return m.colorSpec.error()}errorDim(){return m.colorSpec.errorDim()}onError(){return m.colorSpec.onError()}errorContainer(){return m.colorSpec.errorContainer()}onErrorContainer(){return m.colorSpec.onErrorContainer()}static highestSurface(e){return m.colorSpec.highestSurface(e)}}m.contentAccentToneDelta=15;m.colorSpec=new Wd;m.primaryPaletteKeyColor=m.colorSpec.primaryPaletteKeyColor();m.secondaryPaletteKeyColor=m.colorSpec.secondaryPaletteKeyColor();m.tertiaryPaletteKeyColor=m.colorSpec.tertiaryPaletteKeyColor();m.neutralPaletteKeyColor=m.colorSpec.neutralPaletteKeyColor();m.neutralVariantPaletteKeyColor=m.colorSpec.neutralVariantPaletteKeyColor();m.background=m.colorSpec.background();m.onBackground=m.colorSpec.onBackground();m.surface=m.colorSpec.surface();m.surfaceDim=m.colorSpec.surfaceDim();m.surfaceBright=m.colorSpec.surfaceBright();m.surfaceContainerLowest=m.colorSpec.surfaceContainerLowest();m.surfaceContainerLow=m.colorSpec.surfaceContainerLow();m.surfaceContainer=m.colorSpec.surfaceContainer();m.surfaceContainerHigh=m.colorSpec.surfaceContainerHigh();m.surfaceContainerHighest=m.colorSpec.surfaceContainerHighest();m.onSurface=m.colorSpec.onSurface();m.surfaceVariant=m.colorSpec.surfaceVariant();m.onSurfaceVariant=m.colorSpec.onSurfaceVariant();m.inverseSurface=m.colorSpec.inverseSurface();m.inverseOnSurface=m.colorSpec.inverseOnSurface();m.outline=m.colorSpec.outline();m.outlineVariant=m.colorSpec.outlineVariant();m.shadow=m.colorSpec.shadow();m.scrim=m.colorSpec.scrim();m.surfaceTint=m.colorSpec.surfaceTint();m.primary=m.colorSpec.primary();m.onPrimary=m.colorSpec.onPrimary();m.primaryContainer=m.colorSpec.primaryContainer();m.onPrimaryContainer=m.colorSpec.onPrimaryContainer();m.inversePrimary=m.colorSpec.inversePrimary();m.secondary=m.colorSpec.secondary();m.onSecondary=m.colorSpec.onSecondary();m.secondaryContainer=m.colorSpec.secondaryContainer();m.onSecondaryContainer=m.colorSpec.onSecondaryContainer();m.tertiary=m.colorSpec.tertiary();m.onTertiary=m.colorSpec.onTertiary();m.tertiaryContainer=m.colorSpec.tertiaryContainer();m.onTertiaryContainer=m.colorSpec.onTertiaryContainer();m.error=m.colorSpec.error();m.onError=m.colorSpec.onError();m.errorContainer=m.colorSpec.errorContainer();m.onErrorContainer=m.colorSpec.onErrorContainer();m.primaryFixed=m.colorSpec.primaryFixed();m.primaryFixedDim=m.colorSpec.primaryFixedDim();m.onPrimaryFixed=m.colorSpec.onPrimaryFixed();m.onPrimaryFixedVariant=m.colorSpec.onPrimaryFixedVariant();m.secondaryFixed=m.colorSpec.secondaryFixed();m.secondaryFixedDim=m.colorSpec.secondaryFixedDim();m.onSecondaryFixed=m.colorSpec.onSecondaryFixed();m.onSecondaryFixedVariant=m.colorSpec.onSecondaryFixedVariant();m.tertiaryFixed=m.colorSpec.tertiaryFixed();m.tertiaryFixedDim=m.colorSpec.tertiaryFixedDim();m.onTertiaryFixed=m.colorSpec.onTertiaryFixed();m.onTertiaryFixedVariant=m.colorSpec.onTertiaryFixedVariant();/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class D{static maybeFallbackSpecVersion(e,t){switch(t){case f.EXPRESSIVE:case f.VIBRANT:case f.TONAL_SPOT:case f.NEUTRAL:return e;default:return"2021"}}constructor(e){this.sourceColorArgb=e.sourceColorHct.toInt(),this.variant=e.variant,this.contrastLevel=e.contrastLevel,this.isDark=e.isDark,this.platform=e.platform??"phone",this.specVersion=D.maybeFallbackSpecVersion(e.specVersion??"2021",this.variant),this.sourceColorHct=e.sourceColorHct,this.primaryPalette=e.primaryPalette??Ct(this.specVersion).getPrimaryPalette(this.variant,e.sourceColorHct,this.isDark,this.platform,this.contrastLevel),this.secondaryPalette=e.secondaryPalette??Ct(this.specVersion).getSecondaryPalette(this.variant,e.sourceColorHct,this.isDark,this.platform,this.contrastLevel),this.tertiaryPalette=e.tertiaryPalette??Ct(this.specVersion).getTertiaryPalette(this.variant,e.sourceColorHct,this.isDark,this.platform,this.contrastLevel),this.neutralPalette=e.neutralPalette??Ct(this.specVersion).getNeutralPalette(this.variant,e.sourceColorHct,this.isDark,this.platform,this.contrastLevel),this.neutralVariantPalette=e.neutralVariantPalette??Ct(this.specVersion).getNeutralVariantPalette(this.variant,e.sourceColorHct,this.isDark,this.platform,this.contrastLevel),this.errorPalette=e.errorPalette??Ct(this.specVersion).getErrorPalette(this.variant,e.sourceColorHct,this.isDark,this.platform,this.contrastLevel)??$.fromHueAndChroma(25,84),this.colors=new m}toString(){return`Scheme: variant=${f[this.variant]}, mode=${this.isDark?"dark":"light"}, platform=${this.platform}, contrastLevel=${this.contrastLevel.toFixed(1)}, seed=${this.sourceColorHct.toString()}, specVersion=${this.specVersion}`}static getPiecewiseHue(e,t,r){const a=Math.min(t.length-1,r.length),i=e.hue;for(let n=0;n<a;n++)if(i>=t[n]&&i<t[n+1])return ke(r[n]);return i}static getRotatedHue(e,t,r){let a=D.getPiecewiseHue(e,t,r);return Math.min(t.length-1,r.length)<=0&&(a=0),ke(e.hue+a)}getArgb(e){return e.getArgb(this)}getHct(e){return e.getHct(this)}get primaryPaletteKeyColor(){return this.getArgb(this.colors.primaryPaletteKeyColor())}get secondaryPaletteKeyColor(){return this.getArgb(this.colors.secondaryPaletteKeyColor())}get tertiaryPaletteKeyColor(){return this.getArgb(this.colors.tertiaryPaletteKeyColor())}get neutralPaletteKeyColor(){return this.getArgb(this.colors.neutralPaletteKeyColor())}get neutralVariantPaletteKeyColor(){return this.getArgb(this.colors.neutralVariantPaletteKeyColor())}get errorPaletteKeyColor(){return this.getArgb(this.colors.errorPaletteKeyColor())}get background(){return this.getArgb(this.colors.background())}get onBackground(){return this.getArgb(this.colors.onBackground())}get surface(){return this.getArgb(this.colors.surface())}get surfaceDim(){return this.getArgb(this.colors.surfaceDim())}get surfaceBright(){return this.getArgb(this.colors.surfaceBright())}get surfaceContainerLowest(){return this.getArgb(this.colors.surfaceContainerLowest())}get surfaceContainerLow(){return this.getArgb(this.colors.surfaceContainerLow())}get surfaceContainer(){return this.getArgb(this.colors.surfaceContainer())}get surfaceContainerHigh(){return this.getArgb(this.colors.surfaceContainerHigh())}get surfaceContainerHighest(){return this.getArgb(this.colors.surfaceContainerHighest())}get onSurface(){return this.getArgb(this.colors.onSurface())}get surfaceVariant(){return this.getArgb(this.colors.surfaceVariant())}get onSurfaceVariant(){return this.getArgb(this.colors.onSurfaceVariant())}get inverseSurface(){return this.getArgb(this.colors.inverseSurface())}get inverseOnSurface(){return this.getArgb(this.colors.inverseOnSurface())}get outline(){return this.getArgb(this.colors.outline())}get outlineVariant(){return this.getArgb(this.colors.outlineVariant())}get shadow(){return this.getArgb(this.colors.shadow())}get scrim(){return this.getArgb(this.colors.scrim())}get surfaceTint(){return this.getArgb(this.colors.surfaceTint())}get primary(){return this.getArgb(this.colors.primary())}get primaryDim(){const e=this.colors.primaryDim();if(e===void 0)throw new Error("`primaryDim` color is undefined prior to 2025 spec.");return this.getArgb(e)}get onPrimary(){return this.getArgb(this.colors.onPrimary())}get primaryContainer(){return this.getArgb(this.colors.primaryContainer())}get onPrimaryContainer(){return this.getArgb(this.colors.onPrimaryContainer())}get primaryFixed(){return this.getArgb(this.colors.primaryFixed())}get primaryFixedDim(){return this.getArgb(this.colors.primaryFixedDim())}get onPrimaryFixed(){return this.getArgb(this.colors.onPrimaryFixed())}get onPrimaryFixedVariant(){return this.getArgb(this.colors.onPrimaryFixedVariant())}get inversePrimary(){return this.getArgb(this.colors.inversePrimary())}get secondary(){return this.getArgb(this.colors.secondary())}get secondaryDim(){const e=this.colors.secondaryDim();if(e===void 0)throw new Error("`secondaryDim` color is undefined prior to 2025 spec.");return this.getArgb(e)}get onSecondary(){return this.getArgb(this.colors.onSecondary())}get secondaryContainer(){return this.getArgb(this.colors.secondaryContainer())}get onSecondaryContainer(){return this.getArgb(this.colors.onSecondaryContainer())}get secondaryFixed(){return this.getArgb(this.colors.secondaryFixed())}get secondaryFixedDim(){return this.getArgb(this.colors.secondaryFixedDim())}get onSecondaryFixed(){return this.getArgb(this.colors.onSecondaryFixed())}get onSecondaryFixedVariant(){return this.getArgb(this.colors.onSecondaryFixedVariant())}get tertiary(){return this.getArgb(this.colors.tertiary())}get tertiaryDim(){const e=this.colors.tertiaryDim();if(e===void 0)throw new Error("`tertiaryDim` color is undefined prior to 2025 spec.");return this.getArgb(e)}get onTertiary(){return this.getArgb(this.colors.onTertiary())}get tertiaryContainer(){return this.getArgb(this.colors.tertiaryContainer())}get onTertiaryContainer(){return this.getArgb(this.colors.onTertiaryContainer())}get tertiaryFixed(){return this.getArgb(this.colors.tertiaryFixed())}get tertiaryFixedDim(){return this.getArgb(this.colors.tertiaryFixedDim())}get onTertiaryFixed(){return this.getArgb(this.colors.onTertiaryFixed())}get onTertiaryFixedVariant(){return this.getArgb(this.colors.onTertiaryFixedVariant())}get error(){return this.getArgb(this.colors.error())}get errorDim(){const e=this.colors.errorDim();if(e===void 0)throw new Error("`errorDim` color is undefined prior to 2025 spec.");return this.getArgb(e)}get onError(){return this.getArgb(this.colors.onError())}get errorContainer(){return this.getArgb(this.colors.errorContainer())}get onErrorContainer(){return this.getArgb(this.colors.onErrorContainer())}}D.DEFAULT_SPEC_VERSION="2021";D.DEFAULT_PLATFORM="phone";class vs{getPrimaryPalette(e,t,r,a,i){switch(e){case f.CONTENT:case f.FIDELITY:return $.fromHueAndChroma(t.hue,t.chroma);case f.FRUIT_SALAD:return $.fromHueAndChroma(ke(t.hue-50),48);case f.MONOCHROME:return $.fromHueAndChroma(t.hue,0);case f.NEUTRAL:return $.fromHueAndChroma(t.hue,12);case f.RAINBOW:return $.fromHueAndChroma(t.hue,48);case f.TONAL_SPOT:return $.fromHueAndChroma(t.hue,36);case f.EXPRESSIVE:return $.fromHueAndChroma(ke(t.hue+240),40);case f.VIBRANT:return $.fromHueAndChroma(t.hue,200);default:throw new Error(`Unsupported variant: ${e}`)}}getSecondaryPalette(e,t,r,a,i){switch(e){case f.CONTENT:case f.FIDELITY:return $.fromHueAndChroma(t.hue,Math.max(t.chroma-32,t.chroma*.5));case f.FRUIT_SALAD:return $.fromHueAndChroma(ke(t.hue-50),36);case f.MONOCHROME:return $.fromHueAndChroma(t.hue,0);case f.NEUTRAL:return $.fromHueAndChroma(t.hue,8);case f.RAINBOW:return $.fromHueAndChroma(t.hue,16);case f.TONAL_SPOT:return $.fromHueAndChroma(t.hue,16);case f.EXPRESSIVE:return $.fromHueAndChroma(D.getRotatedHue(t,[0,21,51,121,151,191,271,321,360],[45,95,45,20,45,90,45,45,45]),24);case f.VIBRANT:return $.fromHueAndChroma(D.getRotatedHue(t,[0,41,61,101,131,181,251,301,360],[18,15,10,12,15,18,15,12,12]),24);default:throw new Error(`Unsupported variant: ${e}`)}}getTertiaryPalette(e,t,r,a,i){switch(e){case f.CONTENT:return $.fromHct(Yt.fixIfDisliked(new Et(t).analogous(3,6)[2]));case f.FIDELITY:return $.fromHct(Yt.fixIfDisliked(new Et(t).complement));case f.FRUIT_SALAD:return $.fromHueAndChroma(t.hue,36);case f.MONOCHROME:return $.fromHueAndChroma(t.hue,0);case f.NEUTRAL:return $.fromHueAndChroma(t.hue,16);case f.RAINBOW:case f.TONAL_SPOT:return $.fromHueAndChroma(ke(t.hue+60),24);case f.EXPRESSIVE:return $.fromHueAndChroma(D.getRotatedHue(t,[0,21,51,121,151,191,271,321,360],[120,120,20,45,20,15,20,120,120]),32);case f.VIBRANT:return $.fromHueAndChroma(D.getRotatedHue(t,[0,41,61,101,131,181,251,301,360],[35,30,20,25,30,35,30,25,25]),32);default:throw new Error(`Unsupported variant: ${e}`)}}getNeutralPalette(e,t,r,a,i){switch(e){case f.CONTENT:case f.FIDELITY:return $.fromHueAndChroma(t.hue,t.chroma/8);case f.FRUIT_SALAD:return $.fromHueAndChroma(t.hue,10);case f.MONOCHROME:return $.fromHueAndChroma(t.hue,0);case f.NEUTRAL:return $.fromHueAndChroma(t.hue,2);case f.RAINBOW:return $.fromHueAndChroma(t.hue,0);case f.TONAL_SPOT:return $.fromHueAndChroma(t.hue,6);case f.EXPRESSIVE:return $.fromHueAndChroma(ke(t.hue+15),8);case f.VIBRANT:return $.fromHueAndChroma(t.hue,10);default:throw new Error(`Unsupported variant: ${e}`)}}getNeutralVariantPalette(e,t,r,a,i){switch(e){case f.CONTENT:return $.fromHueAndChroma(t.hue,t.chroma/8+4);case f.FIDELITY:return $.fromHueAndChroma(t.hue,t.chroma/8+4);case f.FRUIT_SALAD:return $.fromHueAndChroma(t.hue,16);case f.MONOCHROME:return $.fromHueAndChroma(t.hue,0);case f.NEUTRAL:return $.fromHueAndChroma(t.hue,2);case f.RAINBOW:return $.fromHueAndChroma(t.hue,0);case f.TONAL_SPOT:return $.fromHueAndChroma(t.hue,8);case f.EXPRESSIVE:return $.fromHueAndChroma(ke(t.hue+15),12);case f.VIBRANT:return $.fromHueAndChroma(t.hue,12);default:throw new Error(`Unsupported variant: ${e}`)}}getErrorPalette(e,t,r,a,i){}}class Ee extends vs{getPrimaryPalette(e,t,r,a,i){switch(e){case f.NEUTRAL:return $.fromHueAndChroma(t.hue,a==="phone"?M.isBlue(t.hue)?12:8:M.isBlue(t.hue)?16:12);case f.TONAL_SPOT:return $.fromHueAndChroma(t.hue,a==="phone"&&r?26:32);case f.EXPRESSIVE:return $.fromHueAndChroma(t.hue,a==="phone"?r?36:48:40);case f.VIBRANT:return $.fromHueAndChroma(t.hue,a==="phone"?74:56);default:return super.getPrimaryPalette(e,t,r,a,i)}}getSecondaryPalette(e,t,r,a,i){switch(e){case f.NEUTRAL:return $.fromHueAndChroma(t.hue,a==="phone"?M.isBlue(t.hue)?6:4:M.isBlue(t.hue)?10:6);case f.TONAL_SPOT:return $.fromHueAndChroma(t.hue,16);case f.EXPRESSIVE:return $.fromHueAndChroma(D.getRotatedHue(t,[0,105,140,204,253,278,300,333,360],[-160,155,-100,96,-96,-156,-165,-160]),a==="phone"&&r?16:24);case f.VIBRANT:return $.fromHueAndChroma(D.getRotatedHue(t,[0,38,105,140,333,360],[-14,10,-14,10,-14]),a==="phone"?56:36);default:return super.getSecondaryPalette(e,t,r,a,i)}}getTertiaryPalette(e,t,r,a,i){switch(e){case f.NEUTRAL:return $.fromHueAndChroma(D.getRotatedHue(t,[0,38,105,161,204,278,333,360],[-32,26,10,-39,24,-15,-32]),a==="phone"?20:36);case f.TONAL_SPOT:return $.fromHueAndChroma(D.getRotatedHue(t,[0,20,71,161,333,360],[-40,48,-32,40,-32]),a==="phone"?28:32);case f.EXPRESSIVE:return $.fromHueAndChroma(D.getRotatedHue(t,[0,105,140,204,253,278,300,333,360],[-165,160,-105,101,-101,-160,-170,-165]),48);case f.VIBRANT:return $.fromHueAndChroma(D.getRotatedHue(t,[0,38,71,105,140,161,253,333,360],[-72,35,24,-24,62,50,62,-72]),56);default:return super.getTertiaryPalette(e,t,r,a,i)}}static getExpressiveNeutralHue(e){return D.getRotatedHue(e,[0,71,124,253,278,300,360],[10,0,10,0,10,0])}static getExpressiveNeutralChroma(e,t,r){const a=Ee.getExpressiveNeutralHue(e);return r==="phone"?t?M.isYellow(a)?6:14:18:12}static getVibrantNeutralHue(e){return D.getRotatedHue(e,[0,38,105,140,333,360],[-14,10,-14,10,-14])}static getVibrantNeutralChroma(e,t){const r=Ee.getVibrantNeutralHue(e);return t==="phone"||M.isBlue(r)?28:20}getNeutralPalette(e,t,r,a,i){switch(e){case f.NEUTRAL:return $.fromHueAndChroma(t.hue,a==="phone"?1.4:6);case f.TONAL_SPOT:return $.fromHueAndChroma(t.hue,a==="phone"?5:10);case f.EXPRESSIVE:return $.fromHueAndChroma(Ee.getExpressiveNeutralHue(t),Ee.getExpressiveNeutralChroma(t,r,a));case f.VIBRANT:return $.fromHueAndChroma(Ee.getVibrantNeutralHue(t),Ee.getVibrantNeutralChroma(t,a));default:return super.getNeutralPalette(e,t,r,a,i)}}getNeutralVariantPalette(e,t,r,a,i){switch(e){case f.NEUTRAL:return $.fromHueAndChroma(t.hue,(a==="phone"?1.4:6)*2.2);case f.TONAL_SPOT:return $.fromHueAndChroma(t.hue,(a==="phone"?5:10)*1.7);case f.EXPRESSIVE:const n=Ee.getExpressiveNeutralHue(t),s=Ee.getExpressiveNeutralChroma(t,r,a);return $.fromHueAndChroma(n,s*(n>=105&&n<125?1.6:2.3));case f.VIBRANT:const d=Ee.getVibrantNeutralHue(t),c=Ee.getVibrantNeutralChroma(t,a);return $.fromHueAndChroma(d,c*1.29);default:return super.getNeutralVariantPalette(e,t,r,a,i)}}getErrorPalette(e,t,r,a,i){const n=D.getPiecewiseHue(t,[0,3,13,23,33,43,153,273,360],[12,22,32,12,22,32,22,12]);switch(e){case f.NEUTRAL:return $.fromHueAndChroma(n,a==="phone"?50:40);case f.TONAL_SPOT:return $.fromHueAndChroma(n,a==="phone"?60:48);case f.EXPRESSIVE:return $.fromHueAndChroma(n,a==="phone"?64:48);case f.VIBRANT:return $.fromHueAndChroma(n,a==="phone"?80:60);default:return super.getErrorPalette(e,t,r,a,i)}}}const Yd=new vs,Xd=new Ee;function Ct(o){return o==="2025"?Xd:Yd}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zd extends D{constructor(e,t,r,a=D.DEFAULT_SPEC_VERSION,i=D.DEFAULT_PLATFORM){super({sourceColorHct:e,variant:f.CONTENT,contrastLevel:r,isDark:t,platform:i,specVersion:a})}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qd extends D{constructor(e,t,r,a=D.DEFAULT_SPEC_VERSION,i=D.DEFAULT_PLATFORM){super({sourceColorHct:e,variant:f.EXPRESSIVE,contrastLevel:r,isDark:t,platform:i,specVersion:a})}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jd extends D{constructor(e,t,r,a=D.DEFAULT_SPEC_VERSION,i=D.DEFAULT_PLATFORM){super({sourceColorHct:e,variant:f.FIDELITY,contrastLevel:r,isDark:t,platform:i,specVersion:a})}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ec extends D{constructor(e,t,r,a=D.DEFAULT_SPEC_VERSION,i=D.DEFAULT_PLATFORM){super({sourceColorHct:e,variant:f.FRUIT_SALAD,contrastLevel:r,isDark:t,platform:i,specVersion:a})}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tc extends D{constructor(e,t,r,a=D.DEFAULT_SPEC_VERSION,i=D.DEFAULT_PLATFORM){super({sourceColorHct:e,variant:f.MONOCHROME,contrastLevel:r,isDark:t,platform:i,specVersion:a})}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rc extends D{constructor(e,t,r,a=D.DEFAULT_SPEC_VERSION,i=D.DEFAULT_PLATFORM){super({sourceColorHct:e,variant:f.NEUTRAL,contrastLevel:r,isDark:t,platform:i,specVersion:a})}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oc extends D{constructor(e,t,r,a=D.DEFAULT_SPEC_VERSION,i=D.DEFAULT_PLATFORM){super({sourceColorHct:e,variant:f.RAINBOW,contrastLevel:r,isDark:t,platform:i,specVersion:a})}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ac extends D{constructor(e,t,r,a=D.DEFAULT_SPEC_VERSION,i=D.DEFAULT_PLATFORM){super({sourceColorHct:e,variant:f.TONAL_SPOT,contrastLevel:r,isDark:t,platform:i,specVersion:a})}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ic extends D{constructor(e,t,r,a=D.DEFAULT_SPEC_VERSION,i=D.DEFAULT_PLATFORM){super({sourceColorHct:e,variant:f.VIBRANT,contrastLevel:r,isDark:t,platform:i,specVersion:a})}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pt(o){const e=Ua(o),t=qa(o),r=Ka(o),a=[e.toString(16),t.toString(16),r.toString(16)];for(const[i,n]of a.entries())n.length===1&&(a[i]="0"+n);return"#"+a.join("")}function nc(o){o=o.replace("#","");const e=o.length===3,t=o.length===6,r=o.length===8;if(!e&&!t&&!r)throw new Error("unexpected hex "+o);let a=0,i=0,n=0;return e?(a=Ue(o.slice(0,1).repeat(2)),i=Ue(o.slice(1,2).repeat(2)),n=Ue(o.slice(2,3).repeat(2))):t?(a=Ue(o.slice(0,2)),i=Ue(o.slice(2,4)),n=Ue(o.slice(4,6))):r&&(a=Ue(o.slice(2,4)),i=Ue(o.slice(4,6)),n=Ue(o.slice(6,8))),(255<<24|(a&255)<<16|(i&255)<<8|n&255)>>>0}function Ue(o){return parseInt(o,16)}const Re={tonal_spot:{option:{id:"tonal_spot",label:"Tonal Spot",supportsSpec2025:!0},variant:f.TONAL_SPOT,SchemeClass:ac},neutral:{option:{id:"neutral",label:"Neutral",supportsSpec2025:!0},variant:f.NEUTRAL,SchemeClass:rc},vibrant:{option:{id:"vibrant",label:"Vibrant",supportsSpec2025:!0},variant:f.VIBRANT,SchemeClass:ic},expressive:{option:{id:"expressive",label:"Expressive",supportsSpec2025:!0},variant:f.EXPRESSIVE,SchemeClass:Qd},monochrome:{option:{id:"monochrome",label:"Monochrome",supportsSpec2025:!1},variant:f.MONOCHROME,SchemeClass:tc},fidelity:{option:{id:"fidelity",label:"Fidelity",supportsSpec2025:!1},variant:f.FIDELITY,SchemeClass:Jd},content:{option:{id:"content",label:"Content",supportsSpec2025:!1},variant:f.CONTENT,SchemeClass:Zd},rainbow:{option:{id:"rainbow",label:"Rainbow",supportsSpec2025:!1},variant:f.RAINBOW,SchemeClass:oc},fruit_salad:{option:{id:"fruit_salad",label:"Fruit Salad",supportsSpec2025:!1},variant:f.FRUIT_SALAD,SchemeClass:ec}},sc=Object.freeze([Re.tonal_spot.option,Re.neutral.option,Re.vibrant.option,Re.expressive.option,Re.monochrome.option,Re.fidelity.option,Re.content.option,Re.rainbow.option,Re.fruit_salad.option]),lc={themeMode:"follow-gui",variant:"tonal_spot",specVersion:"2025"},dc=[["--md-sys-color-background",o=>o.background()],["--md-sys-color-on-background",o=>o.onBackground()],["--md-sys-color-surface",o=>o.surface()],["--md-sys-color-surface-dim",o=>o.surfaceDim()],["--md-sys-color-surface-bright",o=>o.surfaceBright()],["--md-sys-color-surface-container-lowest",o=>o.surfaceContainerLowest()],["--md-sys-color-surface-container-low",o=>o.surfaceContainerLow()],["--md-sys-color-surface-container",o=>o.surfaceContainer()],["--md-sys-color-surface-container-high",o=>o.surfaceContainerHigh()],["--md-sys-color-surface-container-highest",o=>o.surfaceContainerHighest()],["--md-sys-color-on-surface",o=>o.onSurface()],["--md-sys-color-surface-variant",o=>o.surfaceVariant()],["--md-sys-color-on-surface-variant",o=>o.onSurfaceVariant()],["--md-sys-color-inverse-surface",o=>o.inverseSurface()],["--md-sys-color-inverse-on-surface",o=>o.inverseOnSurface()],["--md-sys-color-outline",o=>o.outline()],["--md-sys-color-outline-variant",o=>o.outlineVariant()],["--md-sys-color-shadow",o=>o.shadow()],["--md-sys-color-scrim",o=>o.scrim()],["--md-sys-color-surface-tint",o=>o.surfaceTint()],["--md-sys-color-primary",o=>o.primary()],["--md-sys-color-on-primary",o=>o.onPrimary()],["--md-sys-color-primary-container",o=>o.primaryContainer()],["--md-sys-color-on-primary-container",o=>o.onPrimaryContainer()],["--md-sys-color-inverse-primary",o=>o.inversePrimary()],["--md-sys-color-secondary",o=>o.secondary()],["--md-sys-color-on-secondary",o=>o.onSecondary()],["--md-sys-color-secondary-container",o=>o.secondaryContainer()],["--md-sys-color-on-secondary-container",o=>o.onSecondaryContainer()],["--md-sys-color-tertiary",o=>o.tertiary()],["--md-sys-color-on-tertiary",o=>o.onTertiary()],["--md-sys-color-tertiary-container",o=>o.tertiaryContainer()],["--md-sys-color-on-tertiary-container",o=>o.onTertiaryContainer()],["--md-sys-color-error",o=>o.error()],["--md-sys-color-on-error",o=>o.onError()],["--md-sys-color-error-container",o=>o.errorContainer()],["--md-sys-color-on-error-container",o=>o.onErrorContainer()],["--md-sys-color-primary-fixed",o=>o.primaryFixed()],["--md-sys-color-primary-fixed-dim",o=>o.primaryFixedDim()],["--md-sys-color-on-primary-fixed",o=>o.onPrimaryFixed()],["--md-sys-color-on-primary-fixed-variant",o=>o.onPrimaryFixedVariant()],["--md-sys-color-secondary-fixed",o=>o.secondaryFixed()],["--md-sys-color-secondary-fixed-dim",o=>o.secondaryFixedDim()],["--md-sys-color-on-secondary-fixed",o=>o.onSecondaryFixed()],["--md-sys-color-on-secondary-fixed-variant",o=>o.onSecondaryFixedVariant()],["--md-sys-color-tertiary-fixed",o=>o.tertiaryFixed()],["--md-sys-color-tertiary-fixed-dim",o=>o.tertiaryFixedDim()],["--md-sys-color-on-tertiary-fixed",o=>o.onTertiaryFixed()],["--md-sys-color-on-tertiary-fixed-variant",o=>o.onTertiaryFixedVariant()]],cc=[["primaryPalette",40,80],["tertiaryPalette",48,72],["secondaryPalette",56,64],["errorPalette",44,76],["primaryPalette",64,56],["tertiaryPalette",32,88],["secondaryPalette",72,48],["primaryPalette",24,40]],hc=[85,70,52,35],pc=[30,45,62,78];function uc(o,e){return o===e?!0:!o||!e?!1:(o.theme_mode??"")===(e.theme_mode??"")&&(o.scheme??"")===(e.scheme??"")&&(o.contrast??"")===(e.contrast??"")&&!!o.high_contrast==!!e.high_contrast}class mc{constructor(e,t=document.documentElement){this.colors=new m,this.seedUnsubscribe=null,this.hostTheme=null,this.config={...lc},this.lastApplied=null,this.observer=null,this.darkMediaQuery=null,this.isApplying=!1,this.destroyed=!1,this.handleTargetMutation=()=>{if(this.destroyed||this.isApplying||this.config.themeMode!=="follow-gui")return;const r=this.resolveIsDark();(this.lastApplied===null||this.lastApplied.isDark!==r)&&this.apply()},this.handleMediaChange=()=>{this.destroyed||this.config.themeMode!=="follow-gui"||this.apply()},this.target=t,this.seedProvider=e,this.attachSeedProvider(e),this.setupHostListeners()}setSeedProvider(e){this.detachSeedProvider(),this.seedProvider=e,this.attachSeedProvider(e),this.apply()}setHostTheme(e){const t=e?{...e}:null;uc(this.hostTheme,t)&&this.lastApplied!==null||(this.hostTheme=t,this.apply())}setConfig(e){return this.config={...e},this.apply()}apply(){const e=this.seedProvider.getSeedColorHex(),t=this.resolveIsDark(),r=this.resolveContrastLevel(),a=Re[this.config.variant]??Re.tonal_spot,i=this.config.specVersion,n=M.fromInt(nc(e)),s=new a.SchemeClass(n,t,r,i),d=s.specVersion,c={seedHex:e,isDark:t,contrastLevel:r,requestedSpecVersion:i,effectiveSpecVersion:d,variant:a.option.id};return this.writeTokensToTarget(s,c),this.lastApplied=c,c}getLastApplied(){return this.lastApplied?{...this.lastApplied}:null}destroy(){this.destroyed=!0,this.detachSeedProvider(),this.observer&&(this.observer.disconnect(),this.observer=null),this.darkMediaQuery&&(this.darkMediaQuery.removeEventListener?this.darkMediaQuery.removeEventListener("change",this.handleMediaChange):this.darkMediaQuery.removeListener&&this.darkMediaQuery.removeListener(this.handleMediaChange),this.darkMediaQuery=null)}attachSeedProvider(e){e.subscribe&&(this.seedUnsubscribe=e.subscribe(()=>{this.destroyed||this.apply()}))}detachSeedProvider(){this.seedUnsubscribe&&(this.seedUnsubscribe(),this.seedUnsubscribe=null)}setupHostListeners(){typeof MutationObserver<"u"&&(this.observer=new MutationObserver(this.handleTargetMutation),this.observeTarget()),typeof window<"u"&&typeof window.matchMedia=="function"&&(this.darkMediaQuery=window.matchMedia("(prefers-color-scheme: dark)"),this.darkMediaQuery.addEventListener?this.darkMediaQuery.addEventListener("change",this.handleMediaChange):this.darkMediaQuery.addListener&&this.darkMediaQuery.addListener(this.handleMediaChange))}observeTarget(){!this.observer||this.destroyed||this.observer.observe(this.target,{attributes:!0,attributeFilter:["style","class"]})}resolveContrastLevel(){var t,r;if((t=this.hostTheme)!=null&&t.high_contrast)return 1;const e=typeof((r=this.hostTheme)==null?void 0:r.contrast)=="string"?this.hostTheme.contrast.toLowerCase():"";return e.includes("high")?1:e.includes("medium")?.5:0}resolveIsDark(){return this.config.themeMode==="dark"?!0:this.config.themeMode==="light"?!1:this.resolveHostThemeScheme()==="dark"}resolveHostThemeScheme(){var i;if(typeof window<"u"&&typeof window.location<"u"){const s=(new URLSearchParams(window.location.search).get("theme")||"").trim().toLowerCase();if(s==="light"||s==="dark")return s}const e=typeof window<"u"?window.sidecar:void 0,t=typeof(e==null?void 0:e.theme)=="string"?e.theme.trim().toLowerCase():"";if(t==="light"||t==="dark")return t;const r=this.probeHostBgLuminance();if(r)return r;const a=typeof((i=this.hostTheme)==null?void 0:i.scheme)=="string"?this.hostTheme.scheme.trim().toLowerCase():"";return a==="light"||a==="dark"?a:typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}probeHostBgLuminance(){if(typeof document>"u"||typeof getComputedStyle>"u"||!this.target.style.getPropertyValue("--background").trim())return null;const r=(this.target.ownerDocument||document).createElement("span");r.style.cssText="position:absolute;visibility:hidden;color:var(--background)",this.target.appendChild(r);let a="";try{a=getComputedStyle(r).color}finally{r.remove()}const i=(a.match(/[\d.]+/g)||[]).map(Number);if(i.length<3)return null;const n=a.startsWith("color(")?1:255,[s,d,c]=i.slice(0,3).map(p=>p/n);return .2126*s+.7152*d+.0722*c<.5?"dark":"light"}writeTokensToTarget(e,t){var r;this.isApplying=!0,(r=this.observer)==null||r.disconnect();try{const a=this.target.style;for(const[d,c]of dc)a.setProperty(d,pt(c(this.colors).getArgb(e)));cc.forEach(([d,c,p],v)=>{const g=t.isDark?p:c;a.setProperty(`--tm-chart-${v}`,pt(e[d].tone(g)))}),a.setProperty("--tm-hm-0",pt(this.colors.surfaceContainerHigh().getArgb(e))),(t.isDark?pc:hc).forEach((d,c)=>{a.setProperty(`--tm-hm-${c+1}`,pt(e.primaryPalette.tone(d)))}),a.setProperty("--tm-status-ok",pt(this.colors.primary().getArgb(e))),a.setProperty("--tm-status-warn",pt(this.colors.tertiary().getArgb(e))),a.setProperty("--tm-status-danger",pt(this.colors.error().getArgb(e))),a.setProperty("--tm-scrim-disabled","color-mix(in srgb, var(--md-sys-color-surface) 76%, transparent)");const n=t.isDark?"dark":"light";a.colorScheme=n,this.target.dataset.theme!==n&&(this.target.dataset.theme=n);const s=t.contrastLevel>0?"high":"default";this.target.dataset.contrast!==s&&(this.target.dataset.contrast=s)}finally{this.isApplying=!1,this.observeTarget()}}}const fs="#ADD8E6",vc=/^#?([0-9a-fA-F]{3})$/,fc=/^#?([0-9a-fA-F]{6})$/;function bc(o){const e=o.trim(),t=fc.exec(e);if(t)return`#${t[1].toUpperCase()}`;const r=vc.exec(e);if(r){const[a,i,n]=r[1].toUpperCase().split("");return`#${a}${a}${i}${i}${n}${n}`}throw new Error(`Invalid seed hex color "${o}". Expected #RGB or #RRGGBB.`)}class gc{constructor(e=fs){this.id="hardcoded",this.seedHex=bc(e)}getSeedColorHex(){return this.seedHex}}function yc(){return new gc(fs)}const Oe={themeMode:"follow-gui",variant:"tonal_spot",specVersion:"2025",homeScope:"session",sessionMode:"auto",pinnedConvoId:null,liveEnabled:!0,globalTrendsCardMode:"today",homeCards:["default"]},bs="ag_telemetry_ui_v2",xc=3e3,_c=new Set(["home","context","steps","models","global","sessions","settings"]),fa=new Set(["default","context","step","models","global-trends","extra-stats","tools"]),Sr=["today","month","data"],gs=new Set(["latest_step","session","global"]);var Pi;const Ci=(Pi=window.sidecar)!=null&&Pi.fetch?window.sidecar.fetch.bind(window.sidecar):fetch.bind(window);function wc(){var t;const o=(t=window.sidecar)==null?void 0:t.conversationId;return typeof o=="string"&&o.trim()?o.trim():(new URLSearchParams(window.location.search).get("conversationId")||"").trim()}function kc(){try{const o=window.localStorage.getItem(bs);if(!o)return{...Oe,homeCards:[...Oe.homeCards]};const e=JSON.parse(o),t=Array.isArray(e.homeCards)?e.homeCards.filter(r=>fa.has(r)):[...Oe.homeCards];return{themeMode:e.themeMode==="light"||e.themeMode==="dark"||e.themeMode==="follow-gui"?e.themeMode:Oe.themeMode,variant:typeof e.variant=="string"&&e.variant?e.variant:Oe.variant,specVersion:e.specVersion==="2021"||e.specVersion==="2025"?e.specVersion:Oe.specVersion,homeScope:gs.has(e.homeScope)?e.homeScope:Oe.homeScope,sessionMode:e.sessionMode==="pinned"?"pinned":"auto",pinnedConvoId:typeof e.pinnedConvoId=="string"&&e.pinnedConvoId?e.pinnedConvoId:null,liveEnabled:typeof e.liveEnabled=="boolean"?e.liveEnabled:Oe.liveEnabled,globalTrendsCardMode:Sr.includes(e.globalTrendsCardMode)?e.globalTrendsCardMode:Oe.globalTrendsCardMode,homeCards:t.length>0?t:["default"]}}catch{return{...Oe,homeCards:[...Oe.homeCards]}}}class Cc extends EventTarget{constructor(){super(),this.activePage="home",this.drawerOpen=!1,this.globalRange="all",this.modelScope="session",this.stepsDesc=!0,this.editMode=!1,this.data=null,this.todayHourly=[],this.isFetching=!1,this.lastError=null,this.appliedPalette=null,this.pollTimer=null,this.started=!1,this.lastHostThemeSig="",this.onVisibilityChange=()=>{!document.hidden&&this.settings.liveEnabled&&this.refresh(!1)},this.settings=kc(),this.hostConvoId=wc(),this.themeEngine=new mc(yc(),document.documentElement),this.syncTheme()}subscribe(e){const t=()=>e();return this.addEventListener("change",t),()=>this.removeEventListener("change",t)}emitChange(){this.dispatchEvent(new CustomEvent("change"))}saveSettings(){try{window.localStorage.setItem(bs,JSON.stringify(this.settings))}catch{}}syncTheme(e){if(e!==void 0){const t=JSON.stringify(e??null);t!==this.lastHostThemeSig&&(this.lastHostThemeSig=t,this.themeEngine.setHostTheme(e??null))}this.appliedPalette=this.themeEngine.setConfig({themeMode:this.settings.themeMode,variant:this.settings.variant,specVersion:this.settings.specVersion})}start(){this.started||(this.started=!0,document.addEventListener("visibilitychange",this.onVisibilityChange),this.pollTimer=window.setInterval(()=>{this.settings.liveEnabled&&!document.hidden&&this.refresh(!1)},xc),this.refresh(!1))}destroy(){this.started&&(this.started=!1,document.removeEventListener("visibilitychange",this.onVisibilityChange),this.pollTimer!==null&&(window.clearInterval(this.pollTimer),this.pollTimer=null),this.themeEngine.destroy())}async refresh(e=!1){if(!(this.isFetching&&!e)){this.isFetching=!0,this.emitChange();try{const t=this.settings.sessionMode==="pinned"&&this.settings.pinnedConvoId?this.settings.pinnedConvoId:"auto",r=`./api/stats?range=${encodeURIComponent(this.globalRange)}&convo_id=${encodeURIComponent(t)}&force=${e?1:0}`,a=this.globalRange!=="today"&&(this.activePage==="home"||this.todayHourly.length===0)&&this.settings.homeCards.includes("global-trends")&&this.settings.globalTrendsCardMode==="today",[i,n]=await Promise.all([Ci(r,{cache:"no-store"}),a?Ci("./api/stats?range=today&convo_id=auto&force=0",{cache:"no-store"}).catch(()=>null):Promise.resolve(null)]);if(!i.ok)throw new Error(`HTTP ${i.status}`);const s=await i.json();if(this.data=s,this.lastError=null,this.globalRange==="today")this.todayHourly=s.hourly||[];else if(n&&n.ok){const d=await n.json();this.todayHourly=d.hourly||[]}s.host_theme&&this.syncTheme(s.host_theme)}catch(t){this.lastError=t instanceof Error?t.message:String(t)}finally{this.isFetching=!1,this.emitChange()}}}navigate(e){_c.has(e)&&(this.activePage=e,this.drawerOpen=!1,this.emitChange(),e==="home"&&this.globalRange!=="today"&&this.settings.homeCards.includes("global-trends")&&this.settings.globalTrendsCardMode==="today"&&this.todayHourly.length===0&&this.refresh(!1))}setDrawerOpen(e){this.drawerOpen!==e&&(this.drawerOpen=e,this.emitChange())}toggleLive(){this.settings={...this.settings,liveEnabled:!this.settings.liveEnabled},this.saveSettings(),this.emitChange(),this.settings.liveEnabled&&this.refresh(!1)}setGlobalRange(e){this.globalRange!==e&&(this.globalRange=e,this.emitChange(),this.refresh(!1))}setModelScope(e){this.modelScope!==e&&(this.modelScope=e,this.emitChange())}toggleStepsOrder(){this.stepsDesc=!this.stepsDesc,this.emitChange()}setEditMode(e){this.editMode!==e&&(this.editMode=e,this.emitChange())}setHomeScope(e){!gs.has(e)||this.settings.homeScope===e||(this.settings={...this.settings,homeScope:e},this.saveSettings(),this.emitChange())}setThemeConfig(e){this.settings={...this.settings,...e.themeMode!==void 0?{themeMode:e.themeMode}:{},...e.variant!==void 0?{variant:e.variant}:{},...e.specVersion!==void 0?{specVersion:e.specVersion}:{}},this.saveSettings(),this.syncTheme(),this.emitChange()}selectAutoSession(){this.settings={...this.settings,sessionMode:"auto",pinnedConvoId:null},this.saveSettings(),this.emitChange(),this.refresh(!1)}pinSession(e){e&&(this.settings={...this.settings,sessionMode:"pinned",pinnedConvoId:e},this.saveSettings(),this.emitChange(),this.refresh(!1))}addCard(e){if(!fa.has(e)||this.settings.homeCards.includes(e))return;const t=[...this.settings.homeCards,e];this.settings={...this.settings,homeCards:t},this.saveSettings(),this.emitChange(),e==="global-trends"&&this.settings.globalTrendsCardMode==="today"&&this.todayHourly.length===0&&this.refresh(!1)}removeCard(e){const t=this.settings.homeCards.filter(r=>r!==e);this.settings={...this.settings,homeCards:t},this.saveSettings(),this.emitChange()}moveCard(e,t){const r=[...this.settings.homeCards];if(e<0||e>=r.length||t<0||t>=r.length||e===t)return;const[a]=r.splice(e,1);r.splice(t,0,a),this.settings={...this.settings,homeCards:r},this.saveSettings(),this.emitChange()}reorderCards(e){const t=[];for(const r of e)fa.has(r)&&!t.includes(r)&&t.push(r);this.settings={...this.settings,homeCards:t},this.saveSettings(),this.emitChange()}cycleGlobalTrendsCardMode(){const e=Sr.indexOf(this.settings.globalTrendsCardMode),t=Sr[(e+1)%Sr.length];this.settings={...this.settings,globalTrendsCardMode:t},this.saveSettings(),this.emitChange(),t==="today"&&this.globalRange!=="today"&&this.todayHourly.length===0&&this.refresh(!1)}}const k=new Cc;function j(o){return o==null||Number.isNaN(Number(o))?"-":Number(o).toLocaleString("en-US")}function J(o){if(o==null||Number.isNaN(Number(o)))return"-";const e=Number(o),t=Math.abs(e);return t>=1e9?`${(e/1e9).toFixed(2)}B`:t>=1e6?`${(e/1e6).toFixed(2)}M`:t>=1e3?`${(e/1e3).toFixed(1)}K`:String(e)}function le(o){return o==null||Number.isNaN(Number(o))?"-":`${Number(o).toFixed(2)}s`}function De(o){return o==null||Number.isNaN(Number(o))?"-":`${Number(o).toFixed(1)}/s`}function Ge(o){return o==null||Number.isNaN(Number(o))?"-":`${Number(o).toFixed(1)}%`}function tt(o){return o?o.replace("Gemini ","G").replace("Claude ","C ").replace(" (XHigh)"," XH").replace(" (High)"," H").replace(" (Medium)"," M").replace(" (Low)"," L"):"-"}function Si(o=new Date){const e=o.getFullYear(),t=String(o.getMonth()+1).padStart(2,"0"),r=String(o.getDate()).padStart(2,"0");return`${e}-${t}-${r}`}function sr(o){if(o==null||Number.isNaN(Number(o)))return"var(--md-sys-color-on-surface-variant)";const e=Number(o);return e>=80?"var(--tm-status-danger)":e>=60?"var(--tm-status-warn)":"var(--tm-status-ok)"}const Sc={menu:"M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",home:"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",donut_large:"M11 5.08V2c-5 .5-9 4.81-9 10s4 9.5 9 10v-3.08c-3-.48-6-3.4-6-6.92s3-6.44 6-6.92zM18.97 11H22c-.47-5-4-8.53-9-9v3.08C16 5.51 18.54 8 18.97 11zM13 18.92V22c5-.47 8.53-4 9-9h-3.03c-.43 3-2.97 5.49-5.97 5.92z",waterfall_chart:"M18 4h3v16h-3V4zM3 13h3v7H3v-7zm11-9h3v3h-3V4zm-4 1h3v4h-3V5zm-3 5h3v4H7v-4z",pie_chart:"M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2.03 0v8.99H22c-.47-4.74-4.24-8.52-8.97-8.99zm0 11.01V22c4.74-.47 8.5-4.25 8.97-8.99h-8.97z",trending_up:"M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z",history:"M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",settings:"M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",more_vert:"M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",pause:"M6 19h4V5H6v14zm8-14v14h4V5h-4z",play_arrow:"M8 5v14l11-7z",refresh:"M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z",edit:"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",check:"M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",add:"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",delete:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",arrow_upward:"M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z",arrow_downward:"M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z",drag_indicator:"M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",swap_horiz:"M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z",close:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",search:"M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",expand_more:"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z",auto_awesome:"M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z",push_pin:"M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z",build:"M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z",insights:"M21 8c-1.45 0-2.26 1.44-1.93 2.51l-3.55 3.56c-.3-.09-.74-.09-1.04 0l-2.55-2.55C12.27 10.45 11.46 9 10 9c-1.45 0-2.27 1.44-1.93 2.52l-4.56 4.55C2.44 15.74 1 16.55 1 18c0 1.1.9 2 2 2 1.45 0 2.26-1.44 1.93-2.51l4.55-4.56c.3.09.74.09 1.04 0l2.55 2.55C12.73 16.55 13.54 18 15 18c1.45 0 2.27-1.44 1.93-2.52l3.56-3.55c1.07.33 2.51-.48 2.51-1.93 0-1.1-.9-2-2-2zM15 9l.94-2.07L18 6l-2.06-.93L15 3l-.92 2.07L12 6l2.08.93zM3.5 11L4 9l2-.5L4 8l-.5-2L3 8l-2 .5L3 9z",palette:"M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z",dark_mode:"M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z",light_mode:"M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z",computer:"M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z",error_outline:"M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"};function $i(o){return Ht`<svg viewBox="0 0 24 24" aria-hidden="true" style="width:1em;height:1em;fill:currentColor;"><path d="${Sc[o]}"></path></svg>`}function N(o,e){return e?h`<md-icon slot=${e}>${$i(o)}</md-icon>`:h`<md-icon>${$i(o)}</md-icon>`}var $c=Object.defineProperty,Tc=Object.getOwnPropertyDescriptor,Dt=(o,e,t,r)=>{for(var a=r>1?void 0:r?Tc(e,t):e,i=o.length-1,n;i>=0;i--)(n=o[i])&&(a=(r?n(e,t,a):n(a))||a);return r&&a&&$c(e,t,a),a};const so=[{id:"home",label:"主页",icon:"home"},{id:"context",label:"上下文",icon:"donut_large"},{id:"steps",label:"单步统计",icon:"waterfall_chart"},{id:"models",label:"模型统计",icon:"pie_chart"},{id:"global",label:"全局趋势",icon:"trending_up"},{id:"sessions",label:"最近会话",icon:"history"},{id:"settings",label:"设置",icon:"settings"}];let ot=class extends O{constructor(){super(...arguments),this.activePage=k.activePage,this.drawerOpen=k.drawerOpen,this.liveEnabled=k.settings.liveEnabled,this.isFetching=k.isFetching,this.lastError=k.lastError}connectedCallback(){super.connectedCallback(),this.syncFromStore(),this.unsubscribe=k.subscribe(()=>this.syncFromStore()),k.start()}disconnectedCallback(){var o;super.disconnectedCallback(),(o=this.unsubscribe)==null||o.call(this)}syncFromStore(){this.activePage=k.activePage,this.drawerOpen=k.drawerOpen,this.liveEnabled=k.settings.liveEnabled,this.isFetching=k.isFetching,this.lastError=k.lastError}handleDrawerChanged(o){var t;const e=!!((t=o.detail)!=null&&t.opened);e!==k.drawerOpen&&k.setDrawerOpen(e)}renderPage(){switch(this.activePage){case"home":return h`<home-page></home-page>`;case"context":return h`<context-page></context-page>`;case"steps":return h`<steps-page></steps-page>`;case"models":return h`<models-page></models-page>`;case"global":return h`<global-trends-page></global-trends-page>`;case"sessions":return h`<recent-sessions-page></recent-sessions-page>`;case"settings":return h`<settings-page></settings-page>`}}render(){const o=so.find(e=>e.id===this.activePage)??so[0];return h`
      <md-navigation-drawer-modal
        .opened=${this.drawerOpen}
        @navigation-drawer-changed=${this.handleDrawerChanged}
      >
        <div class="drawer-header">
          <div class="drawer-title">Antigravity Telemetry</div>
          <div class="drawer-subtitle">Usage &amp; Performance</div>
        </div>
        <md-list class="drawer-list">
          ${so.map(e=>{const t=e.id===this.activePage;return h`
              <md-list-item
                type="button"
                class="nav-item ${t?"active":""}"
                aria-current=${t?"page":"false"}
                @click=${()=>k.navigate(e.id)}
              >
                ${N(e.icon,"start")}
                <span slot="headline">${e.label}</span>
              </md-list-item>
            `})}
        </md-list>
      </md-navigation-drawer-modal>

      <div class="app-shell">
        <header class="top-app-bar">
          <div class="top-bar-left">
            <md-icon-button
              aria-label="打开导航菜单"
              @click=${()=>k.setDrawerOpen(!this.drawerOpen)}
            >
              ${N("menu")}
            </md-icon-button>
            <h1 class="top-bar-title">${o.label}</h1>
          </div>

          ${this.activePage!=="home"?h`
                <div class="top-bar-actions">
                  <span class="live-pill ${this.liveEnabled?"active":""}">
                    ${this.liveEnabled?"LIVE 3s":"已暂停"}
                  </span>
                  <md-icon-button
                    aria-label=${this.liveEnabled?"暂停实时轮询":"开启实时轮询"}
                    @click=${()=>k.toggleLive()}
                  >
                    ${N(this.liveEnabled?"pause":"play_arrow")}
                  </md-icon-button>
                  <md-icon-button
                    aria-label="立即刷新"
                    ?disabled=${this.isFetching}
                    @click=${()=>void k.refresh(!0)}
                  >
                    ${N("refresh")}
                  </md-icon-button>
                </div>
              `:b}
        </header>

        <main class="main-viewport">
          ${this.lastError?h`
                <div class="error-banner" role="alert">
                  ${N("error_outline")}
                  <span>读取遥测数据失败: ${this.lastError}</span>
                </div>
              `:b}
          ${this.renderPage()}
        </main>
      </div>
    `}};ot.styles=S`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--md-sys-color-background);
      color: var(--md-sys-color-on-background);
    }

    .app-shell {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      width: 100%;
    }

    /* M3-WEB-PLACEHOLDER: Top App Bar (not provided by @material/web@2.5.0) */
    .top-app-bar {
      position: sticky;
      top: 0;
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      height: 56px;
      padding: 0 12px;
      background: var(--md-sys-color-surface-container);
      color: var(--md-sys-color-on-surface);
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
    }

    .top-bar-left {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .top-bar-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      line-height: 1.25;
      color: var(--md-sys-color-on-surface);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .top-bar-actions {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }

    .live-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 600;
      background: var(--md-sys-color-surface-container-high);
      color: var(--md-sys-color-on-surface-variant);
      border: 1px solid var(--md-sys-color-outline-variant);
    }

    .live-pill.active {
      background: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);
      border-color: transparent;
    }

    .drawer-header {
      padding: 16px 20px 12px;
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
    }

    .drawer-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--md-sys-color-on-surface);
    }

    .drawer-subtitle {
      font-size: 12px;
      color: var(--md-sys-color-on-surface-variant);
      margin-top: 2px;
    }

    .drawer-list {
      padding: 8px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      --md-list-container-color: transparent;
    }

    .nav-item {
      border-radius: 9999px;
      overflow: hidden;
    }

    .nav-item.active {
      background: var(--md-sys-color-secondary-container);
      --md-list-item-label-text-color: var(
        --md-sys-color-on-secondary-container
      );
      --md-list-item-leading-icon-color: var(
        --md-sys-color-on-secondary-container
      );
      font-weight: 600;
    }

    .main-viewport {
      flex: 1;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px;
      container-type: inline-size;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      margin-bottom: 12px;
      border-radius: 12px;
      background: var(--md-sys-color-error-container);
      color: var(--md-sys-color-on-error-container);
      font-size: 13px;
    }
  `;Dt([T()],ot.prototype,"activePage",2);Dt([T()],ot.prototype,"drawerOpen",2);Dt([T()],ot.prototype,"liveEnabled",2);Dt([T()],ot.prototype,"isFetching",2);Dt([T()],ot.prototype,"lastError",2);ot=Dt([E("telemetry-app")],ot);const Nr=S`
  .tm-ring-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .tm-ring-label {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--tm-font-mono);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    pointer-events: none;
  }

  .tm-wf-bar {
    display: inline-flex;
    align-items: center;
    height: 10px;
    border-radius: 9999px;
    overflow: hidden;
    background: var(--md-sys-color-surface-container-highest);
    vertical-align: middle;
  }

  .tm-wf-ttft {
    height: 100%;
    background: var(--tm-chart-2);
    min-width: 2px;
  }

  .tm-wf-stream {
    height: 100%;
    background: var(--tm-chart-0);
    min-width: 2px;
  }

  .tm-pie-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .tm-hourly-bars {
    display: grid;
    grid-template-columns: repeat(24, minmax(0, 1fr));
    align-items: end;
    gap: 3px;
    width: 100%;
  }

  .tm-hr-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    gap: 4px;
    min-width: 0;
  }

  .tm-hr-bar-track {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: flex-end;
    min-height: 0;
  }

  .tm-hr-bar {
    width: 100%;
    border-radius: 3px 3px 1px 1px;
    background: var(--tm-chart-0);
    transition: height 0.2s ease, background-color 0.2s ease;
  }

  .tm-hr-bar.empty {
    background: var(--md-sys-color-surface-container-highest);
  }

  .tm-hr-lbl {
    font-family: var(--tm-font-mono);
    font-size: 10px;
    line-height: 1;
    color: var(--md-sys-color-on-surface-variant);
    height: 11px;
  }

  .tm-hm-grid {
    display: grid;
    grid-template-rows: repeat(7, 1fr);
    grid-auto-flow: column;
    grid-auto-columns: minmax(10px, 1fr);
    gap: 3px;
    width: 100%;
  }

  .tm-hm-cell {
    aspect-ratio: 1;
    border-radius: 3px;
    background: var(--tm-hm-0);
    border: 1px solid transparent;
    cursor: default;
    transition: transform 0.12s ease;
  }

  .tm-hm-cell:hover {
    transform: scale(1.12);
    border-color: var(--md-sys-color-outline);
  }

  .tm-hm-cell.today {
    border-color: var(--md-sys-color-primary);
  }

  .tm-hm-cell.l1 {
    background: var(--tm-hm-1);
  }
  .tm-hm-cell.l2 {
    background: var(--tm-hm-2);
  }
  .tm-hm-cell.l3 {
    background: var(--tm-hm-3);
  }
  .tm-hm-cell.l4 {
    background: var(--tm-hm-4);
  }

  .tm-stack-bar {
    display: flex;
    width: 100%;
    height: 10px;
    border-radius: 9999px;
    overflow: hidden;
    gap: 2px;
    background: var(--md-sys-color-surface-container-highest);
  }

  .tm-stack-seg {
    height: 100%;
    min-width: 2px;
    transition: width 0.25s ease;
  }
`;function ys(o,e=44,t=4){const r=e/2,a=Math.max(2,r-t),i=2*Math.PI*a,n=o==null||Number.isNaN(Number(o))?0:Math.max(0,Math.min(100,Number(o))),s=i*(1-n/100),d=sr(o),c=o==null||Number.isNaN(Number(o))?"-":`${Math.round(n)}%`,p=Math.max(10,Math.round(e*.24));return h`
    <div
      class="tm-ring-wrap"
      style="width:${e}px;height:${e}px;"
      aria-label="Context usage ${c}"
    >
      ${Ht`
        <svg viewBox="0 0 ${e} ${e}" width="${e}" height="${e}" aria-hidden="true" style="transform:rotate(-90deg);">
          <circle
            cx="${r}"
            cy="${r}"
            r="${a}"
            fill="none"
            stroke="var(--md-sys-color-surface-container-highest)"
            stroke-width="${t}"
          ></circle>
          <circle
            cx="${r}"
            cy="${r}"
            r="${a}"
            fill="none"
            stroke="${d}"
            stroke-width="${t}"
            stroke-linecap="round"
            stroke-dasharray="${i}"
            stroke-dashoffset="${s}"
          ></circle>
        </svg>
      `}
      <span
        class="tm-ring-label"
        style="font-size:${p}px;color:${d};"
      >
        ${c}
      </span>
    </div>
  `}function xs(o,e,t,r=96){const a=Math.max(.1,t),i=Math.max(0,o??0),n=Math.max(0,e??0),s=Math.min(100,i/a*100),d=Math.min(100-s,n/a*100),c=`TTFT ${le(o)} + Stream ${le(e)}`;return h`
    <span
      class="tm-wf-bar"
      style="width:${r}px;"
      title=${c}
    >
      ${i>0?h`<span class="tm-wf-ttft" style="width:${s.toFixed(1)}%"></span>`:""}
      ${n>0?h`<span class="tm-wf-stream" style="width:${d.toFixed(1)}%"></span>`:""}
    </span>
  `}function Ec(o,e=120){const t=o.filter(c=>c.value>0),r=t.reduce((c,p)=>c+p.value,0),a=e/2,i=Math.max(8,a*.72),n=Math.max(8,a*.36),s=2*Math.PI*i;if(r<=0)return h`
      <div class="tm-pie-wrap" style="width:${e}px;height:${e}px;">
        ${Ht`
          <svg viewBox="0 0 ${e} ${e}" width="${e}" height="${e}" aria-hidden="true">
            <circle
              cx="${a}"
              cy="${a}"
              r="${i}"
              fill="none"
              stroke="var(--md-sys-color-surface-container-highest)"
              stroke-width="${n}"
            ></circle>
          </svg>
        `}
      </div>
    `;let d=0;return h`
    <div class="tm-pie-wrap" style="width:${e}px;height:${e}px;">
      ${Ht`
        <svg viewBox="0 0 ${e} ${e}" width="${e}" height="${e}" style="transform:rotate(-90deg);" role="img" aria-label="Distribution chart">
          ${t.map(c=>{const p=c.value/r*s,v=`${p} ${Math.max(0,s-p)}`,g=-d;return d+=p,Ht`
              <circle
                cx="${a}"
                cy="${a}"
                r="${i}"
                fill="none"
                stroke="${c.colorVar}"
                stroke-width="${n}"
                stroke-dasharray="${v}"
                stroke-dashoffset="${g}"
              >
                <title>${c.label}: ${J(c.value)} (${(c.value/r*100).toFixed(1)}%)</title>
              </circle>
            `})}
        </svg>
      `}
    </div>
  `}function _s(o,e=72){const t=new Map;for(const i of o||[])t.set(i.hour,i);const r=[];for(let i=0;i<24;i++)r.push(t.get(i)??{hour:i,sessions:0,turns:0,tokens:0});const a=Math.max(1,...r.map(i=>i.tokens||0));return h`
    <div
      class="tm-hourly-bars"
      style="height:${e}px;"
      role="img"
      aria-label="24-hour activity distribution"
    >
      ${r.map(i=>{const n=i.tokens>0,s=n?Math.max(6,Math.round(i.tokens/a*100)):4,d=`${String(i.hour).padStart(2,"0")}:00 — ${J(i.tokens)} tok (${j(i.turns)} turns)`;return h`
          <div class="tm-hr-col" title=${d}>
            <div class="tm-hr-bar-track">
              <div
                class="tm-hr-bar ${n?"":"empty"}"
                style="height:${s}%;"
              ></div>
            </div>
            <span class="tm-hr-lbl">${i.hour%3===0?i.hour:""}</span>
          </div>
        `})}
    </div>
  `}function ws(o,e,t){const r=new Map((o||[]).map(c=>[c.date,c])),a=new Date,i=Si(a),n=new Date(a);n.setDate(n.getDate()-Math.max(1,e)),n.setDate(n.getDate()-(n.getDay()+6)%7);const s=Math.max(1,...(o||[]).map(c=>c.total||0)),d=[];for(const c=new Date(n);c<=a;c.setDate(c.getDate()+1)){const p=Si(c),v=r.get(p)??null;let g="";if(v&&v.total>0){const _=v.total/s;_>.65?g="l4":_>.35?g="l3":_>.12?g="l2":g="l1"}d.push({key:p,entry:v,levelClass:g,isToday:p===i})}return h`
    <div class="tm-hm-grid" role="grid" aria-label="Activity heatmap">
      ${d.map(c=>{const p=c.entry?`${c.key}: ${J(c.entry.total)} tok · ${j(c.entry.turns)} turns`:`${c.key}: 0 tokens`;return h`
          <div
            class="tm-hm-cell ${c.levelClass} ${c.isToday?"today":""}"
            title=${p}
            @mouseenter=${()=>t==null?void 0:t({date:c.key,entry:c.entry})}
          ></div>
        `})}
    </div>
  `}function Ac(o){const e=o.filter(r=>r.value>0),t=e.reduce((r,a)=>r+a.value,0);return t<=0?h`<div class="tm-stack-bar" aria-hidden="true"></div>`:h`
    <div class="tm-stack-bar" role="img" aria-label="Token breakdown bar">
      ${e.map(r=>{const a=Math.max(1,r.value/t*100);return h`
          <div
            class="tm-stack-seg"
            style="width:${a.toFixed(2)}%;background:${r.colorVar};"
            title="${r.label}: ${j(r.value)} (${(r.value/t*100).toFixed(1)}%)"
          ></div>
        `})}
    </div>
  `}const Pc=S`
  /* Default card: 3 core metrics */
  .metrics-trio {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }

  .metric-tile {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px 10px;
    border-radius: var(--tm-radius-sm, 12px);
    background: var(--md-sys-color-surface-container-low);
    border: 1px solid var(--md-sys-color-outline-variant);
    min-width: 0;
  }

  .metric-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface-variant);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .metric-value {
    font-family: var(--tm-font-mono);
    font-variant-numeric: tabular-nums;
    font-size: 20px;
    font-weight: 700;
    line-height: 1.2;
    color: var(--md-sys-color-on-surface);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .metric-value.primary {
    color: var(--md-sys-color-primary);
  }

  /* Split visual + key-value rows (context, step, models) */
  .split-card-body {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
  }

  .split-visual {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .visual-caption {
    font-family: var(--tm-font-mono);
    font-variant-numeric: tabular-nums;
    font-size: 11px;
    color: var(--md-sys-color-on-surface-variant);
    white-space: nowrap;
  }

  .kv-rows {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .kv-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
    min-width: 0;
  }

  .kv-key {
    font-size: 12px;
    color: var(--md-sys-color-on-surface-variant);
    flex-shrink: 0;
  }

  .kv-val {
    font-family: var(--tm-font-mono);
    font-variant-numeric: tabular-nums;
    font-size: 13px;
    font-weight: 600;
    color: var(--md-sys-color-on-surface);
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  /* Models legend */
  .model-legend {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .legend-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-width: 0;
  }

  .legend-left {
    display: flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
    flex: 1;
  }

  .legend-swatch {
    width: 10px;
    height: 10px;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .legend-name {
    font-size: 12px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .legend-turns {
    font-family: var(--tm-font-mono);
    font-variant-numeric: tabular-nums;
    font-size: 12px;
    font-weight: 600;
    color: var(--md-sys-color-on-surface-variant);
    flex-shrink: 0;
  }

  /* Global trends card */
  .trends-header-actions {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .mode-badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: var(--tm-radius-full, 9999px);
    font-size: 11px;
    font-weight: 600;
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
    white-space: nowrap;
  }

  .trends-today-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: 8px;
    font-size: 11px;
    color: var(--md-sys-color-on-surface-variant);
  }

  .trends-month-layout {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
  }

  .trends-hm-box {
    flex-shrink: 0;
  }

  .trends-hm-box .tm-hm-grid {
    width: max-content;
    grid-auto-columns: 14px;
  }

  .trends-hm-legend {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 6px;
    font-size: 10px;
    color: var(--md-sys-color-on-surface-variant);
  }

  .hm-swatch {
    width: 10px;
    height: 10px;
    border-radius: 2px;
  }

  .hm-swatch.l0 {
    background: var(--tm-hm-0);
  }
  .hm-swatch.l1 {
    background: var(--tm-hm-1);
  }
  .hm-swatch.l2 {
    background: var(--tm-hm-2);
  }
  .hm-swatch.l3 {
    background: var(--tm-hm-3);
  }
  .hm-swatch.l4 {
    background: var(--tm-hm-4);
  }

  .trends-data-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .compact-stat {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 10px;
    border-radius: var(--tm-radius-sm, 12px);
    background: var(--md-sys-color-surface-container-low);
    border: 1px solid var(--md-sys-color-outline-variant);
    min-width: 0;
  }

  .compact-stat-label {
    font-size: 11px;
    color: var(--md-sys-color-on-surface-variant);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .compact-stat-val {
    font-family: var(--tm-font-mono);
    font-variant-numeric: tabular-nums;
    font-size: 14px;
    font-weight: 700;
    color: var(--md-sys-color-on-surface);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Extra stats & tools */
  .tools-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 10px;
  }

  .tools-chips md-assist-chip {
    --md-assist-chip-container-height: 28px;
    --md-assist-chip-label-text-size: 12px;
  }

  .empty-hint {
    font-size: 12px;
    color: var(--md-sys-color-on-surface-variant);
    padding: 6px 0;
  }

  @container (width < 360px) {
    .metric-tile {
      padding: 10px 8px;
    }

    .metric-value {
      font-size: 17px;
    }

    .split-card-body {
      gap: 12px;
    }
  }
`,Ic={today:"当日",month:"本月",data:"数据"};function Pr(o){o.stopPropagation()}function zc(o){var n;const{data:e,scope:t}=o;let r,a,i;if(t==="latest_step"){const s=(n=e==null?void 0:e.selected_session)==null?void 0:n.latest_step;r=s==null?void 0:s.cache_hit_rate_pct,a=s==null?void 0:s.stream_tps,i=s==null?void 0:s.ttft_sec}else if(t==="session"){const s=e==null?void 0:e.selected_session;r=s==null?void 0:s.cache_hit_rate_pct,a=s==null?void 0:s.avg_stream_tps,i=s==null?void 0:s.avg_ttft_sec}else{const s=e==null?void 0:e.summary;r=s==null?void 0:s.cache_hit_rate_pct,a=s==null?void 0:s.avg_stream_tps,i=s==null?void 0:s.avg_ttft_sec}return h`
    <div class="metrics-trio">
      <div class="metric-tile">
        <span class="metric-label">缓内</span>
        <span class="metric-value primary">${Ge(r)}</span>
      </div>
      <div class="metric-tile">
        <span class="metric-label">速率</span>
        <span class="metric-value">${De(a)}</span>
      </div>
      <div class="metric-tile">
        <span class="metric-label">首字</span>
        <span class="metric-value">${le(i)}</span>
      </div>
    </div>
  `}function Oc(o){var t,r;const e=(r=(t=o.data)==null?void 0:t.selected_session)==null?void 0:r.context;return h`
    <div class="split-card-body">
      <div class="split-visual">
        ${ys(e==null?void 0:e.used_pct,68,5)}
      </div>
      <div class="kv-rows">
        <div class="kv-row">
          <span class="kv-key">已用</span>
          <span class="kv-val" title=${j(e==null?void 0:e.used_tokens)}>
            ${J(e==null?void 0:e.used_tokens)}
          </span>
        </div>
        <div class="kv-row">
          <span class="kv-key">空闲</span>
          <span class="kv-val" title=${j(e==null?void 0:e.free_tokens)}>
            ${J(e==null?void 0:e.free_tokens)}
          </span>
        </div>
        <div class="kv-row">
          <span class="kv-key">上限</span>
          <span class="kv-val" title=${j(e==null?void 0:e.limit_tokens)}>
            ${J(e==null?void 0:e.limit_tokens)}
          </span>
        </div>
      </div>
    </div>
  `}function Rc(o){var i;const e=(i=o.data)==null?void 0:i.selected_session,t=(e==null?void 0:e.latest_step)??null,r=(e==null?void 0:e.steps_detail)??[],a=Math.max(.1,...r.map(n=>(n.ttft_sec??0)+(n.stream_sec??0)),((t==null?void 0:t.ttft_sec)??0)+((t==null?void 0:t.stream_sec)??0));return h`
    <div class="split-card-body">
      <div class="split-visual">
        ${xs(t==null?void 0:t.ttft_sec,t==null?void 0:t.stream_sec,a,88)}
        <span class="visual-caption">
          ${le(t==null?void 0:t.ttft_sec)} + ${le(t==null?void 0:t.stream_sec)}
        </span>
      </div>
      <div class="kv-rows">
        <div class="kv-row">
          <span class="kv-key">模型</span>
          <span class="kv-val" title=${(t==null?void 0:t.model)??""}>
            ${tt(t==null?void 0:t.model)}
          </span>
        </div>
        <div class="kv-row">
          <span class="kv-key">新增 Token</span>
          <span class="kv-val" title=${j(t==null?void 0:t.input_tokens)}>
            ${J(t==null?void 0:t.input_tokens)}
          </span>
        </div>
        <div class="kv-row">
          <span class="kv-key">输出 / 思考</span>
          <span
            class="kv-val"
            title="${j(t==null?void 0:t.output_tokens)} / ${j(t==null?void 0:t.thinking_tokens)}"
          >
            ${J(t==null?void 0:t.output_tokens)} / ${J(t==null?void 0:t.thinking_tokens)}
          </span>
        </div>
      </div>
    </div>
  `}function Mc(o){var r,a,i;const e=o.scope==="global"?((r=o.data)==null?void 0:r.models_list)??[]:((i=(a=o.data)==null?void 0:a.selected_session)==null?void 0:i.models_list)??[],t=e.map((n,s)=>({label:tt(n.name),value:n.turns,colorVar:`var(--tm-chart-${s%8})`}));return h`
    <div class="split-card-body">
      <div class="split-visual">${Ec(t,88)}</div>
      <div class="model-legend">
        ${e.length===0?h`<div class="empty-hint">暂无模型步数记录</div>`:e.slice(0,5).map((n,s)=>h`
                <div class="legend-row">
                  <div class="legend-left">
                    <span
                      class="legend-swatch"
                      style="background:var(--tm-chart-${s%8});"
                    ></span>
                    <span class="legend-name" title=${n.name}>
                      ${tt(n.name)}
                    </span>
                  </div>
                  <span class="legend-turns">${j(n.turns)} 步</span>
                </div>
              `)}
        ${e.length>5?h`<div class="visual-caption">另有 ${e.length-5} 个模型</div>`:b}
      </div>
    </div>
  `}function Lc(o){const e=Ic[o.globalTrendsMode];return h`
    <div class="trends-header-actions">
      <span class="mode-badge">${e}</span>
      <md-icon-button
        aria-label="切换模式"
        title="切换模式"
        @pointerdown=${Pr}
        @mousedown=${Pr}
        @keydown=${a=>{(a.key==="Enter"||a.key===" ")&&a.stopPropagation()}}
        @click=${a=>{a.stopPropagation(),o.store.cycleGlobalTrendsCardMode()}}
      >
        ${N("swap_horiz")}
      </md-icon-button>
    </div>
  `}function Dc(o){var n;const{globalTrendsMode:e,todayHourly:t,data:r}=o;if(e==="today"){const s=t.reduce((c,p)=>c+(p.tokens||0),0),d=t.reduce((c,p)=>c+(p.turns||0),0);return h`
      <div>
        ${_s(t,72)}
        <div class="trends-today-meta">
          <span>今日 24 小时活跃</span>
          <span class="tm-mono">
            ${J(s)} tok · ${j(d)} 步
          </span>
        </div>
      </div>
    `}if(e==="month"){const s=(r==null?void 0:r.all_daily)??[],d=s.slice(-28),c=d.filter(v=>v.total>0).length,p=d.reduce((v,g)=>v+(g.total||0),0);return h`
      <div class="trends-month-layout">
        <div class="trends-hm-box">
          ${ws(s,28)}
        </div>
        <div class="kv-rows">
          <div class="kv-row">
            <span class="kv-key">近 28 天活跃</span>
            <span class="kv-val">${c} 天</span>
          </div>
          <div class="kv-row">
            <span class="kv-key">近 28 天用量</span>
            <span class="kv-val">${J(p)}</span>
          </div>
          <div class="trends-hm-legend" aria-hidden="true">
            <span>少</span>
            <span class="hm-swatch l0"></span>
            <span class="hm-swatch l1"></span>
            <span class="hm-swatch l2"></span>
            <span class="hm-swatch l3"></span>
            <span class="hm-swatch l4"></span>
            <span>多</span>
          </div>
        </div>
      </div>
    `}const a=r==null?void 0:r.summary,i=(n=r==null?void 0:r.streaks)==null?void 0:n.current_streak;return h`
    <div class="trends-data-grid">
      <div class="compact-stat">
        <span class="compact-stat-label">总 Token</span>
        <span class="compact-stat-val" title=${j(a==null?void 0:a.total_tokens)}>
          ${J(a==null?void 0:a.total_tokens)}
        </span>
      </div>
      <div class="compact-stat">
        <span class="compact-stat-label">缓存命中</span>
        <span class="compact-stat-val">
          ${Ge(a==null?void 0:a.cache_hit_rate_pct)}
        </span>
      </div>
      <div class="compact-stat">
        <span class="compact-stat-label">TTFT / 流式速率</span>
        <span class="compact-stat-val">
          ${le(a==null?void 0:a.avg_ttft_sec)} / ${De(a==null?void 0:a.avg_stream_tps)}
        </span>
      </div>
      <div class="compact-stat">
        <span class="compact-stat-label">连续活跃</span>
        <span class="compact-stat-val">
          ${i==null?"-":`${j(i)} 天`}
        </span>
      </div>
    </div>
  `}function Fc(o){var v,g,_;const e=o.scope==="global",t=(v=o.data)==null?void 0:v.selected_session,r=(g=o.data)==null?void 0:g.summary,a=e?r==null?void 0:r.p50_ttft_sec:t==null?void 0:t.p50_ttft_sec,i=e?r==null?void 0:r.p90_ttft_sec:t==null?void 0:t.p90_ttft_sec,n=e?r==null?void 0:r.total_thinking_tokens:t==null?void 0:t.thinking_tokens,s=e?r==null?void 0:r.total_think_sec:t==null?void 0:t.total_think_sec,d=e?r==null?void 0:r.avg_think_sec:t==null?void 0:t.avg_think_sec,c=e?(_=o.data)==null?void 0:_.costs:t==null?void 0:t.costs,p=c&&c.dollars_saved!=null?`$${c.dollars_saved.toFixed(2)} (${Ge(c.savings_pct)})`:"-";return h`
    <div class="kv-rows">
      <div class="kv-row">
        <span class="kv-key">TTFT P50 / P90</span>
        <span class="kv-val">${le(a)} / ${le(i)}</span>
      </div>
      <div class="kv-row">
        <span class="kv-key">思考开销</span>
        <span
          class="kv-val"
          title="${j(n)} tokens · 总 ${le(s)} · 均 ${le(d)}"
        >
          ${J(n)} · ${le(s)} / 均 ${le(d)}
        </span>
      </div>
      <div class="kv-row">
        <span class="kv-key">缓存节省金额</span>
        <span class="kv-val">${p}</span>
      </div>
    </div>
  `}function Bc(o){var d,c,p;const e=o.scope==="global",t=(d=o.data)==null?void 0:d.selected_session,r=(c=o.data)==null?void 0:c.summary,a=e?r==null?void 0:r.total_tool_calls:t==null?void 0:t.total_tool_calls,i=e?r==null?void 0:r.tool_success_rate_pct:t==null?void 0:t.tool_success_rate_pct,n=e?r==null?void 0:r.total_tool_errors:t==null?void 0:t.tool_errors,s=e?((p=o.data)==null?void 0:p.top_tools)??[]:(t==null?void 0:t.top_tools)??[];return h`
    <div>
      <div class="metrics-trio">
        <div class="metric-tile">
          <span class="metric-label">调用次数</span>
          <span class="metric-value">${j(a)}</span>
        </div>
        <div class="metric-tile">
          <span class="metric-label">成功率</span>
          <span class="metric-value primary">${Ge(i)}</span>
        </div>
        <div class="metric-tile">
          <span class="metric-label">错误数</span>
          <span class="metric-value">${j(n)}</span>
        </div>
      </div>
      ${s.length>0?h`
            <div class="tools-chips">
              ${s.slice(0,6).map(v=>h`
                  <md-assist-chip
                    @pointerdown=${Pr}
                    @click=${Pr}
                  >
                    ${v.name} · ${j(v.count)}
                  </md-assist-chip>
                `)}
            </div>
          `:h`<div class="empty-hint">暂无工具调用记录</div>`}
    </div>
  `}const ks=[{id:"default",title:"核心指标",description:"缓内命中率、流式速率与首字延迟",icon:"insights",supportedScopes:["latest_step","session","global"],targetPage:void 0,renderContent:zc},{id:"context",title:"上下文占用",description:"当前会话上下文环与已用/空闲/上限 Token",icon:"donut_large",supportedScopes:["latest_step","session"],targetPage:"context",renderContent:Oc},{id:"step",title:"单步",description:"最新一步耗时瀑布与模型 Token 详情",icon:"waterfall_chart",supportedScopes:["latest_step","session"],targetPage:"steps",renderContent:Rc},{id:"models",title:"模型",description:"按步数统计的模型分布饼图与图例",icon:"pie_chart",supportedScopes:["session","global"],targetPage:"models",renderContent:Mc},{id:"global-trends",title:"全局趋势",description:"当日 24 小时、本月热力与全局摘要切换",icon:"trending_up",supportedScopes:["latest_step","session","global"],targetPage:"global",renderHeaderActions:Lc,renderContent:Dc},{id:"extra-stats",title:"附加统计信息",description:"TTFT P50/P90、思考开销与缓存节省金额",icon:"auto_awesome",supportedScopes:["session","global"],targetPage:void 0,renderContent:Fc},{id:"tools",title:"工具调用",description:"工具调用次数、成功率、错误数与高频工具",icon:"build",supportedScopes:["session","global"],targetPage:void 0,renderContent:Bc}],Nc=new Map(ks.map(o=>[o.id,o]));function Vc(o){return Nc.get(o)}function lo(o,e){return o.supportedScopes.includes(e)}function Ti(o){return o==="global"?"全局模式下，该卡片不可用":o==="latest_step"?"最新一步模式下，该卡片不可用":""}var Hc=Object.defineProperty,Uc=Object.getOwnPropertyDescriptor,Se=(o,e,t,r)=>{for(var a=r>1?void 0:r?Uc(e,t):e,i=o.length-1,n;i>=0;i--)(n=o[i])&&(a=(r?n(e,t,a):n(a))||a);return r&&a&&Hc(e,t,a),a};const Ei={latest_step:"最新一步",session:"当前会话",global:"全局"};let ve=class extends O{constructor(){super(...arguments),this.homeCards=[...k.settings.homeCards],this.homeScope=k.settings.homeScope,this.editMode=k.editMode,this.liveEnabled=k.settings.liveEnabled,this.isFetching=k.isFetching,this.data=k.data,this.todayHourly=k.todayHourly,this.globalTrendsMode=k.settings.globalTrendsCardMode,this.fabMenuOpen=!1,this.addDialogOpen=!1,this.dragFromId=null,this.dragOverId=null,this.lastMenuClosedAt=0}connectedCallback(){super.connectedCallback(),this.syncFromStore(),this.unsubscribe=k.subscribe(()=>this.syncFromStore())}disconnectedCallback(){var o;super.disconnectedCallback(),(o=this.unsubscribe)==null||o.call(this)}syncFromStore(){this.homeCards=[...k.settings.homeCards],this.homeScope=k.settings.homeScope,this.editMode=k.editMode,this.liveEnabled=k.settings.liveEnabled,this.isFetching=k.isFetching,this.data=k.data,this.todayHourly=k.todayHourly,this.globalTrendsMode=k.settings.globalTrendsCardMode}buildCardContext(){return{store:k,data:this.data,scope:this.homeScope,todayHourly:this.todayHourly,globalTrendsMode:this.globalTrendsMode,editMode:this.editMode}}handleCardClick(o,e){this.editMode||!e||o.targetPage&&k.navigate(o.targetPage)}handleCardKeyDown(o,e,t){this.editMode||!t||(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),this.handleCardClick(e,t))}handleDragStart(o,e){this.editMode&&(this.dragFromId=e,o.dataTransfer&&(o.dataTransfer.effectAllowed="move",o.dataTransfer.setData("text/plain",e)))}handleDragOver(o,e){!this.editMode||!this.dragFromId||this.dragFromId===e||(o.preventDefault(),o.dataTransfer&&(o.dataTransfer.dropEffect="move"),this.dragOverId!==e&&(this.dragOverId=e))}handleDragLeave(o){this.dragOverId===o&&(this.dragOverId=null)}handleDrop(o,e){var i;if(!this.editMode)return;o.preventDefault();const t=this.dragFromId||((i=o.dataTransfer)==null?void 0:i.getData("text/plain"))||"";if(this.dragFromId=null,this.dragOverId=null,!t||t===e)return;const r=this.homeCards.indexOf(t),a=this.homeCards.indexOf(e);r!==-1&&a!==-1&&k.moveCard(r,a)}handleDragEnd(){this.dragFromId=null,this.dragOverId=null}handleFabClick(){!this.fabMenuOpen&&performance.now()-this.lastMenuClosedAt<200||(this.fabMenuOpen=!this.fabMenuOpen)}handleMenuClosing(){this.lastMenuClosedAt=performance.now()}handleMenuClosed(){this.lastMenuClosedAt=performance.now(),this.fabMenuOpen=!1}handleMenuToggleLive(){this.fabMenuOpen=!1,k.toggleLive()}handleMenuRefresh(){this.fabMenuOpen=!1,k.refresh(!0)}handleMenuToggleEdit(){this.fabMenuOpen=!1,k.setEditMode(!this.editMode)}renderCard(o,e,t){const r=lo(o,this.homeScope);if(!r&&!this.editMode)return b;const a=this.homeCards.length,i=!this.editMode&&r,n=i&&!!o.targetPage,s=r?"":Ti(this.homeScope),d=c=>{c.stopPropagation()};return h`
      <div
        class="card-wrapper ${this.dragFromId===o.id?"dragging":""} ${this.dragOverId===o.id?"drag-over":""}"
        draggable=${this.editMode?"true":"false"}
        @dragstart=${c=>this.handleDragStart(c,o.id)}
        @dragover=${c=>this.handleDragOver(c,o.id)}
        @dragleave=${()=>this.handleDragLeave(o.id)}
        @drop=${c=>this.handleDrop(c,o.id)}
        @dragend=${this.handleDragEnd}
      >
        <md-elevated-card class="home-card">
          <div
            class="card-surface ${i?"clickable":""} ${this.editMode?"edit-draggable":""}"
            tabindex=${n?"0":"-1"}
            role=${n?"button":"region"}
            aria-label=${n?`${o.title}，点击查看详情`:o.title}
            @click=${()=>this.handleCardClick(o,r)}
            @keydown=${c=>this.handleCardKeyDown(c,o,r)}
          >
            <md-ripple ?disabled=${!i}></md-ripple>

            <div class="card-header">
              <div class="card-title-group">
                ${this.editMode?h`
                      <span class="drag-handle" aria-hidden="true">
                        ${N("drag_indicator")}
                      </span>
                    `:b}
                <h2 class="card-title">${o.title}</h2>
                ${o.id==="default"?h`<span class="scope-tag">${Ei[this.homeScope]}</span>`:b}
              </div>

              <div class="card-header-right">
                ${o.renderHeaderActions?o.renderHeaderActions(t):b}
                ${this.editMode?h`
                      <div
                        class="edit-controls"
                        @pointerdown=${d}
                        @click=${d}
                      >
                        <md-icon-button
                          aria-label="上移卡片"
                          title="上移"
                          ?disabled=${e<=0}
                          @click=${()=>k.moveCard(e,e-1)}
                        >
                          ${N("arrow_upward")}
                        </md-icon-button>
                        <md-icon-button
                          aria-label="下移卡片"
                          title="下移"
                          ?disabled=${e>=a-1}
                          @click=${()=>k.moveCard(e,e+1)}
                        >
                          ${N("arrow_downward")}
                        </md-icon-button>
                        <md-icon-button
                          aria-label="移除卡片"
                          title="移除卡片"
                          @click=${()=>k.removeCard(o.id)}
                        >
                          ${N("delete")}
                        </md-icon-button>
                      </div>
                    `:b}
              </div>
            </div>

            <div class="card-body ${r?"":"dimmed"}">
              ${o.renderContent(t)}
            </div>

            ${!r&&this.editMode?h`
                  <div class="unavailable-overlay" aria-live="polite">
                    <span class="unavailable-text">
                      ${N("error_outline")}
                      <span>${s}</span>
                    </span>
                  </div>
                `:b}
          </div>
        </md-elevated-card>
      </div>
    `}renderAddCardDialog(){const o=[...ks].sort((e,t)=>{const r=this.homeCards.includes(e.id)?1:0,a=this.homeCards.includes(t.id)?1:0;return r-a});return h`
      <md-dialog
        .open=${this.addDialogOpen}
        @closed=${()=>{this.addDialogOpen=!1}}
      >
        <div slot="headline">添加卡片</div>
        <div slot="content" class="dialog-list">
          ${o.map(e=>{const t=this.homeCards.includes(e.id),r=lo(e,this.homeScope);return h`
              <button
                type="button"
                class="dialog-card-item"
                ?disabled=${t}
                @click=${()=>{k.addCard(e.id)}}
              >
                <md-ripple ?disabled=${t}></md-ripple>
                <div class="dialog-card-left">
                  <span class="dialog-card-icon">
                    ${N(e.icon)}
                  </span>
                  <div class="dialog-card-text">
                    <span class="dialog-card-title">${e.title}</span>
                    <span class="dialog-card-desc">${e.description}</span>
                    ${r?b:h`
                          <span class="dialog-card-warn">
                            ${Ti(this.homeScope)}
                          </span>
                        `}
                  </div>
                </div>
                ${t?h`<span class="dialog-added-pill">已添加</span>`:N("add")}
              </button>
            `})}
        </div>
        <md-divider></md-divider>
        <div slot="actions">
          <md-text-button
            @click=${()=>{this.addDialogOpen=!1}}
          >
            关闭
          </md-text-button>
        </div>
      </md-dialog>
    `}render(){const o=this.buildCardContext(),e=this.homeCards.map((r,a)=>({card:Vc(r),index:a})).filter(r=>!!r.card),t=this.editMode?e.length:e.filter(r=>lo(r.card,this.homeScope)).length;return h`
      <div class="home-root">
        ${t>0?h`
              <div class="cards-grid">
                ${e.map(r=>this.renderCard(r.card,r.index,o))}
              </div>
            `:h`
              <md-outlined-card class="empty-home-card">
                <h2 class="empty-home-title">暂无可显示的卡片</h2>
                <p class="empty-home-desc">
                  当前处于“${Ei[this.homeScope]}”模式，已添加的卡片在此模式下均不可用或列表为空。
                </p>
                <md-filled-tonal-button
                  @click=${()=>k.setEditMode(!0)}
                >
                  ${N("edit","icon")}
                  编辑主页卡片
                </md-filled-tonal-button>
              </md-outlined-card>
            `}
        ${this.editMode?h`
              <div class="edit-action-bar">
                <md-filled-tonal-button
                  @click=${()=>{this.addDialogOpen=!0}}
                >
                  ${N("add","icon")}
                  添加卡片
                </md-filled-tonal-button>
                <md-filled-button
                  @click=${()=>k.setEditMode(!1)}
                >
                  ${N("check","icon")}
                  完成
                </md-filled-button>
              </div>
            `:b}
      </div>

      <div class="fab-container">
        <md-fab
          id="home-fab"
          variant="primary"
          aria-label="主页快捷操作"
          @click=${this.handleFabClick}
        >
          ${N(this.fabMenuOpen?"close":"more_vert","icon")}
        </md-fab>

        <md-menu
          id="home-fab-menu"
          anchor="home-fab"
          positioning="fixed"
          anchor-corner="start-end"
          menu-corner="end-end"
          .yOffset=${-8}
          .open=${this.fabMenuOpen}
          @closing=${this.handleMenuClosing}
          @closed=${this.handleMenuClosed}
        >
          <md-menu-item @click=${this.handleMenuToggleLive}>
            ${N(this.liveEnabled?"pause":"play_arrow","start")}
            <span slot="headline">
              ${this.liveEnabled?"暂停刷新":"恢复刷新"}
            </span>
          </md-menu-item>
          <md-menu-item
            ?disabled=${this.isFetching}
            @click=${this.handleMenuRefresh}
          >
            ${N("refresh","start")}
            <span slot="headline">手动刷新</span>
          </md-menu-item>
          <md-menu-item @click=${this.handleMenuToggleEdit}>
            ${N(this.editMode?"check":"edit","start")}
            <span slot="headline">
              ${this.editMode?"退出编辑":"编辑"}
            </span>
          </md-menu-item>
        </md-menu>
      </div>

      ${this.renderAddCardDialog()}
    `}};ve.styles=[Nr,Pc,S`
      :host {
        display: block;
      }

      .home-root {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-bottom: 96px;
      }

      .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 14px;
        align-items: stretch;
      }

      .card-wrapper {
        position: relative;
        min-width: 0;
        border-radius: var(--tm-radius-md, 16px);
        transition: transform 0.16s ease, opacity 0.16s ease;
      }

      .card-wrapper.dragging {
        opacity: 0.55;
      }

      .card-wrapper.drag-over {
        outline: 2px dashed var(--md-sys-color-primary);
        outline-offset: 2px;
      }

      .home-card {
        display: block;
        width: 100%;
        height: 100%;
        --md-elevated-card-container-shape: var(--tm-radius-md, 16px);
        --md-elevated-card-container-color: var(
          --md-sys-color-surface-container
        );
        transition: transform 0.15s ease;
      }

      .card-surface {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 12px;
        height: 100%;
        padding: 16px;
        border-radius: var(--tm-radius-md, 16px);
        overflow: hidden;
        outline: none;
      }

      .card-surface.clickable {
        cursor: pointer;
      }

      .card-surface.clickable:hover {
        background: var(--md-sys-color-surface-container-high);
      }

      .card-surface.edit-draggable {
        cursor: grab;
      }

      .card-surface.edit-draggable:active {
        cursor: grabbing;
      }

      .card-header {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        min-height: 32px;
      }

      .card-title-group {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }

      .drag-handle {
        display: inline-flex;
        align-items: center;
        color: var(--md-sys-color-on-surface-variant);
        flex-shrink: 0;
      }

      .card-title {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        line-height: 1.3;
        color: var(--md-sys-color-on-surface);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .scope-tag {
        display: inline-flex;
        align-items: center;
        padding: 2px 7px;
        border-radius: var(--tm-radius-full, 9999px);
        font-size: 10px;
        font-weight: 600;
        background: var(--md-sys-color-surface-container-highest);
        color: var(--md-sys-color-on-surface-variant);
        flex-shrink: 0;
      }

      .card-header-right {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        flex-shrink: 0;
      }

      .edit-controls {
        display: inline-flex;
        align-items: center;
      }

      .card-body {
        position: relative;
        z-index: 1;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .card-body.dimmed {
        opacity: 0.38;
        pointer-events: none;
        user-select: none;
      }

      .unavailable-overlay {
        position: absolute;
        inset: 0;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 48px 16px 16px;
        background: var(--tm-scrim-disabled);
        pointer-events: none;
        text-align: center;
      }

      .unavailable-text {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: var(--tm-radius-sm, 12px);
        background: var(--md-sys-color-error-container);
        color: var(--md-sys-color-error);
        font-size: 12px;
        font-weight: 600;
        line-height: 1.4;
      }

      .empty-home-card {
        padding: 24px 20px;
        border-radius: var(--tm-radius-md, 16px);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }

      .empty-home-title {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        color: var(--md-sys-color-on-surface);
      }

      .empty-home-desc {
        margin: 0;
        font-size: 13px;
        color: var(--md-sys-color-on-surface-variant);
      }

      .edit-action-bar {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: wrap;
        gap: 10px;
        padding: 12px 16px;
        border-radius: var(--tm-radius-md, 16px);
        background: var(--md-sys-color-surface-container-low);
        border: 1px solid var(--md-sys-color-outline-variant);
      }

      .fab-container {
        position: fixed;
        right: 20px;
        bottom: 20px;
        z-index: 25;
      }

      .dialog-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-width: 260px;
        max-width: 420px;
      }

      .dialog-card-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        width: 100%;
        padding: 12px;
        border-radius: var(--tm-radius-sm, 12px);
        border: 1px solid var(--md-sys-color-outline-variant);
        background: var(--md-sys-color-surface-container-low);
        color: var(--md-sys-color-on-surface);
        text-align: left;
        font: inherit;
        cursor: pointer;
        overflow: hidden;
      }

      .dialog-card-item:hover:not(:disabled) {
        background: var(--md-sys-color-surface-container);
      }

      .dialog-card-item:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .dialog-card-left {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        min-width: 0;
        flex: 1;
      }

      .dialog-card-icon {
        color: var(--md-sys-color-primary);
        flex-shrink: 0;
        margin-top: 2px;
      }

      .dialog-card-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }

      .dialog-card-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--md-sys-color-on-surface);
      }

      .dialog-card-desc {
        font-size: 12px;
        color: var(--md-sys-color-on-surface-variant);
      }

      .dialog-card-warn {
        font-size: 11px;
        color: var(--md-sys-color-error);
        margin-top: 2px;
      }

      .dialog-added-pill {
        flex-shrink: 0;
        padding: 3px 8px;
        border-radius: var(--tm-radius-full, 9999px);
        font-size: 11px;
        font-weight: 600;
        background: var(--md-sys-color-surface-container-highest);
        color: var(--md-sys-color-on-surface-variant);
      }

      @container (width < 400px) {
        .cards-grid {
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .card-surface {
          padding: 14px;
        }
      }
    `];Se([T()],ve.prototype,"homeCards",2);Se([T()],ve.prototype,"homeScope",2);Se([T()],ve.prototype,"editMode",2);Se([T()],ve.prototype,"liveEnabled",2);Se([T()],ve.prototype,"isFetching",2);Se([T()],ve.prototype,"data",2);Se([T()],ve.prototype,"todayHourly",2);Se([T()],ve.prototype,"globalTrendsMode",2);Se([T()],ve.prototype,"fabMenuOpen",2);Se([T()],ve.prototype,"addDialogOpen",2);Se([T()],ve.prototype,"dragFromId",2);Se([T()],ve.prototype,"dragOverId",2);ve=Se([E("home-page")],ve);var qc=Object.defineProperty,Kc=Object.getOwnPropertyDescriptor,Cs=(o,e,t,r)=>{for(var a=r>1?void 0:r?Kc(e,t):e,i=o.length-1,n;i>=0;i--)(n=o[i])&&(a=(r?n(e,t,a):n(a))||a);return r&&a&&qc(e,t,a),a};const jc={"Chat Messages":"var(--tm-chart-0)",Tools:"var(--tm-chart-1)","System Prompt":"var(--tm-chart-2)",Skills:"var(--tm-chart-3)",Subagents:"var(--tm-chart-4)",Rules:"var(--tm-chart-5)",Plugins:"var(--tm-chart-6)","Mcp Tools":"var(--tm-chart-7)"};function co(o,e){return jc[o]??`var(--tm-chart-${e%8})`}let Ir=class extends O{constructor(){var o;super(...arguments),this.selectedSession=((o=k.data)==null?void 0:o.selected_session)??null,this.openCats=new Set}connectedCallback(){super.connectedCallback(),this.syncFromStore(),this.unsubscribe=k.subscribe(()=>this.syncFromStore())}disconnectedCallback(){var o;super.disconnectedCallback(),(o=this.unsubscribe)==null||o.call(this)}syncFromStore(){var o;this.selectedSession=((o=k.data)==null?void 0:o.selected_session)??null}toggleCategory(o){this.openCats.has(o)?this.openCats.delete(o):this.openCats.add(o),this.requestUpdate()}renderHeroStats(o){const e=o.context,t=[{label:"已用 Context",value:j(e.used_tokens),color:sr(e.used_pct)},{label:"剩余空闲 Free",value:j(e.free_tokens),color:"var(--tm-status-ok)"},{label:"模型上限 Limit",value:j(e.limit_tokens),color:"var(--md-sys-color-on-surface)"},{label:"最近步 Prompt",value:j(e.api_prompt_tokens),color:"var(--tm-chart-0)"},{label:"系统占比 System",value:J(e.system_tokens),color:"var(--tm-chart-1)"},{label:"对话占比 Chat",value:J(e.chat_tokens),color:"var(--md-sys-color-on-surface)"}];return h`
      <div class="hero-stats">
        ${t.map(r=>h`
            <div class="mini-kpi">
              <div class="mini-kpi-k">${r.label}</div>
              <div class="mini-kpi-v" style="color:${r.color};">
                ${r.value}
              </div>
            </div>
          `)}
      </div>
    `}renderCategoryRow(o,e){const t=co(o.name,e),r=o.items??[],a=r.length>0,i=a&&this.openCats.has(o.name),n=Math.min(1,Math.max(.015,(o.pct_of_used||0)/100)),s=h`
      <div class="cat-top">
        <span class="cat-name-group">
          <span class="swatch" style="background:${t};"></span>
          <span>${o.name}</span>
          ${o.is_system?h`<span class="sys-badge">Sys</span>`:b}
          ${o.item_count>0?h`<span class="item-count">(${o.item_count})</span>`:b}
        </span>
        <span class="cat-right">
          <span class="cat-val">
            ${j(o.tokens)} · ${o.pct_of_limit}% 窗口
          </span>
          ${a?h`
                <span class="expand-icon ${i?"open":""}">
                  ${N("expand_more")}
                </span>
              `:b}
        </span>
      </div>
      <md-linear-progress
        class="cat-progress"
        style=${`--md-linear-progress-active-indicator-color:${t};`}
        .value=${n}
        aria-label="${o.name} 占比"
      ></md-linear-progress>
    `;return h`
      <div class="cat-row">
        ${a?h`
              <button
                type="button"
                class="cat-header interactive"
                aria-expanded=${i?"true":"false"}
                @click=${()=>this.toggleCategory(o.name)}
              >
                <md-ripple></md-ripple>
                ${s}
              </button>
            `:h`<div class="cat-header">${s}</div>`}
        ${i?h`
              <md-divider></md-divider>
              <div class="cat-items">
                ${r.map(d=>h`
                    <div class="cat-subitem">
                      <span class="cat-subitem-name" title=${d.name}>
                        ${d.name}
                      </span>
                      <span class="cat-subitem-tokens">
                        ${j(d.tokens)}
                      </span>
                    </div>
                  `)}
                ${o.item_count>r.length?h`
                      <div class="trunc-note">
                        ... 共 ${o.item_count} 项（已按 Token 降序展示前
                        ${r.length} 项）
                      </div>
                    `:b}
              </div>
            `:b}
      </div>
    `}render(){const o=this.selectedSession,e=(o==null?void 0:o.context)??null;if(!o||!e)return h`
        <div class="page-stack">
          <md-elevated-card class="card">
            <div class="card-head">
              <h2 class="card-title">上下文窗口占用 (Context Window)</h2>
            </div>
            <div class="empty-box">暂无上下文统计</div>
          </md-elevated-card>
        </div>
      `;const t=e.categories??[],r=t.filter(a=>a.tokens>0).map((a,i)=>({label:a.name,value:a.tokens,colorVar:co(a.name,i)}));return e.free_tokens>0&&r.push({label:"Free Space",value:e.free_tokens,colorVar:"color-mix(in srgb, var(--md-sys-color-on-surface) 10%, transparent)"}),h`
      <div class="page-stack">
        <md-elevated-card class="card">
          <div class="card-head">
            <h2 class="card-title">上下文窗口占用 (Context Window)</h2>
            <div class="badges-wrap">
              <span
                class="badge ${e.source==="db_native"?"ok":"warn"}"
              >
                ${e.source==="db_native"?"DB 原生明细":"Prompt 估算"}
              </span>
              ${e.compacted?h`<span class="badge info">已压缩历史 (Compacted)</span>`:b}
            </div>
          </div>

          <div class="ctx-hero">
            <div class="ring-stack">
              ${ys(e.used_pct,84,7)}
              <span class="ring-caption">
                已占用 ${e.used_pct!=null?Ge(e.used_pct):"-"}
              </span>
            </div>
            ${this.renderHeroStats(o)}
          </div>

          ${Ac(r)}
          ${t.length>0?h`
                <div class="stack-legend">
                  ${t.filter(a=>a.tokens>0).map((a,i)=>h`
                        <span class="legend-item">
                          <span
                            class="swatch"
                            style="background:${co(a.name,i)};"
                          ></span>
                          <span>${a.name}</span>
                        </span>
                      `)}
                </div>
              `:b}
        </md-elevated-card>

        <md-elevated-card class="card">
          <div class="card-head">
            <h2 class="card-title">按类目拆分明细</h2>
            <span class="card-meta">
              ${t.length>0?`${t.length} 个类目 · 占已用 ${J(e.used_tokens)}`:"点击类目展开子项"}
            </span>
          </div>

          ${t.length>0?h`
                <div class="cat-list">
                  ${t.map((a,i)=>this.renderCategoryRow(a,i))}
                </div>
              `:h`
                <div class="empty-box">
                  当前会话数据库未记录细分类目（仅提供基于最新步 Prompt
                  的总占用估算）
                </div>
              `}
        </md-elevated-card>
      </div>
    `}};Ir.styles=[Nr,S`
      :host {
        display: block;
        container-type: inline-size;
      }

      .page-stack {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .card {
        display: block;
        padding: 16px;
        border-radius: var(--tm-radius-md, 16px);
        --md-elevated-card-container-shape: var(--tm-radius-md, 16px);
        --md-elevated-card-container-color: var(
          --md-sys-color-surface-container-low
        );
      }

      .card-head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 8px 12px;
        margin-bottom: 14px;
      }

      .card-title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        line-height: 1.3;
        color: var(--md-sys-color-on-surface);
      }

      .card-meta {
        font-size: 12px;
        color: var(--md-sys-color-on-surface-variant);
      }

      .badges-wrap {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        padding: 3px 10px;
        border-radius: var(--tm-radius-full, 9999px);
        font-size: 11px;
        font-weight: 600;
        line-height: 1.3;
      }

      .badge.ok {
        background: var(--md-sys-color-primary-container);
        color: var(--md-sys-color-on-primary-container);
      }

      .badge.warn {
        background: var(--md-sys-color-tertiary-container);
        color: var(--md-sys-color-on-tertiary-container);
      }

      .badge.info {
        background: var(--md-sys-color-secondary-container);
        color: var(--md-sys-color-on-secondary-container);
      }

      .ctx-hero {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 18px;
        margin-bottom: 14px;
      }

      .ring-stack {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
      }

      .ring-caption {
        font-size: 11px;
        font-weight: 600;
        color: var(--md-sys-color-on-surface-variant);
        font-variant-numeric: tabular-nums;
      }

      .hero-stats {
        flex: 1;
        min-width: 220px;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
      }

      .mini-kpi {
        padding: 10px 12px;
        border-radius: var(--tm-radius-sm, 12px);
        background: var(--md-sys-color-surface-container);
        border: 1px solid var(--md-sys-color-outline-variant);
        min-width: 0;
      }

      .mini-kpi-k {
        font-size: 11px;
        color: var(--md-sys-color-on-surface-variant);
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .mini-kpi-v {
        font-family: var(--tm-font-mono);
        font-variant-numeric: tabular-nums;
        font-size: 14px;
        font-weight: 700;
        color: var(--md-sys-color-on-surface);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .stack-legend {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 14px;
        margin-top: 10px;
        font-size: 11px;
        color: var(--md-sys-color-on-surface-variant);
      }

      .legend-item {
        display: inline-flex;
        align-items: center;
        gap: 5px;
      }

      .swatch {
        width: 10px;
        height: 10px;
        border-radius: 3px;
        flex-shrink: 0;
      }

      .cat-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .cat-row {
        border-radius: var(--tm-radius-sm, 12px);
        border: 1px solid var(--md-sys-color-outline-variant);
        background: var(--md-sys-color-surface-container);
        overflow: hidden;
      }

      .cat-header {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
        padding: 12px 14px;
        border: none;
        margin: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: left;
      }

      button.cat-header.interactive {
        cursor: pointer;
        transition: background-color 0.15s ease;
      }

      button.cat-header.interactive:hover {
        background: var(--md-sys-color-surface-container-high);
      }

      .cat-top {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 6px 12px;
      }

      .cat-name-group {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        font-size: 13px;
        font-weight: 600;
        color: var(--md-sys-color-on-surface);
      }

      .sys-badge {
        display: inline-flex;
        align-items: center;
        padding: 1px 7px;
        border-radius: var(--tm-radius-full, 9999px);
        font-size: 10px;
        font-weight: 600;
        background: var(--md-sys-color-secondary-container);
        color: var(--md-sys-color-on-secondary-container);
      }

      .item-count {
        font-size: 12px;
        font-weight: 500;
        color: var(--md-sys-color-on-surface-variant);
      }

      .cat-right {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-left: auto;
      }

      .cat-val {
        font-family: var(--tm-font-mono);
        font-variant-numeric: tabular-nums;
        font-size: 12px;
        font-weight: 600;
        color: var(--md-sys-color-on-surface);
      }

      .expand-icon {
        display: inline-flex;
        align-items: center;
        color: var(--md-sys-color-on-surface-variant);
        transition: transform 0.2s ease;
        --md-icon-size: 18px;
      }

      .expand-icon.open {
        transform: rotate(180deg);
      }

      .cat-progress {
        width: 100%;
        --md-linear-progress-track-height: 6px;
        --md-linear-progress-active-indicator-height: 6px;
        --md-linear-progress-track-shape: var(--tm-radius-full, 9999px);
        --md-linear-progress-track-color: var(
          --md-sys-color-surface-container-highest
        );
      }

      .cat-items {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 10px 14px 12px;
        background: var(--md-sys-color-surface-container-low);
      }

      .cat-subitem {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
        font-size: 12px;
        padding: 2px 0;
      }

      .cat-subitem-name {
        color: var(--md-sys-color-on-surface);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0;
      }

      .cat-subitem-tokens {
        font-family: var(--tm-font-mono);
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface-variant);
        flex-shrink: 0;
      }

      .trunc-note {
        margin-top: 4px;
        font-size: 11px;
        color: var(--md-sys-color-on-surface-variant);
      }

      .empty-box {
        padding: 24px 16px;
        text-align: center;
        border-radius: var(--tm-radius-sm, 12px);
        background: var(--md-sys-color-surface-container);
        color: var(--md-sys-color-on-surface-variant);
        font-size: 13px;
      }

      @container (width < 520px) {
        .hero-stats {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .ctx-hero {
          justify-content: center;
        }
      }

      @container (width < 320px) {
        .hero-stats {
          grid-template-columns: 1fr;
        }
      }
    `];Cs([T()],Ir.prototype,"selectedSession",2);Ir=Cs([E("context-page")],Ir);const ja=S`
  .tm-table-wrap {
    width: 100%;
    overflow-x: auto;
    border-radius: var(--tm-radius-sm, 12px);
    border: 1px solid var(--md-sys-color-outline-variant);
    background: var(--md-sys-color-surface-container-low);
    container-type: inline-size;
  }

  table.tm-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    color: var(--md-sys-color-on-surface);
  }

  table.tm-table thead th {
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.03em;
    color: var(--md-sys-color-on-surface-variant);
    background: var(--md-sys-color-surface-container);
    padding: 10px 12px;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
    white-space: nowrap;
  }

  table.tm-table tbody tr {
    position: relative;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
    transition: background-color 0.15s ease;
  }

  table.tm-table tbody tr:last-child {
    border-bottom: none;
  }

  table.tm-table tbody tr.clickable {
    cursor: pointer;
  }

  table.tm-table tbody tr.clickable:hover {
    background: var(--md-sys-color-surface-container-high);
  }

  table.tm-table tbody th,
  table.tm-table tbody td {
    padding: 10px 12px;
    vertical-align: middle;
    text-align: left;
    font-variant-numeric: tabular-nums;
  }

  table.tm-table tbody th {
    font-weight: 600;
    color: var(--md-sys-color-on-surface);
  }

  @container (width < 560px) {
    table.tm-table thead {
      display: none;
    }

    table.tm-table,
    table.tm-table tbody,
    table.tm-table tr,
    table.tm-table th,
    table.tm-table td {
      display: block;
      width: 100%;
    }

    table.tm-table tbody tr {
      padding: 10px 12px;
      background: var(--md-sys-color-surface-container-low);
    }

    table.tm-table tbody th {
      padding: 0 0 6px 0;
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
      margin-bottom: 6px;
    }

    table.tm-table tbody td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 4px 0;
    }

    table.tm-table tbody td::before {
      content: attr(data-label);
      font-size: 11px;
      font-weight: 600;
      color: var(--md-sys-color-on-surface-variant);
      flex-shrink: 0;
    }
  }
`;var Gc=Object.defineProperty,Wc=Object.getOwnPropertyDescriptor,Ga=(o,e,t,r)=>{for(var a=r>1?void 0:r?Wc(e,t):e,i=o.length-1,n;i>=0;i--)(n=o[i])&&(a=(r?n(e,t,a):n(a))||a);return r&&a&&Gc(e,t,a),a};let Xt=class extends O{constructor(){var o;super(...arguments),this.selectedSession=((o=k.data)==null?void 0:o.selected_session)??null,this.stepsDesc=k.stepsDesc}connectedCallback(){super.connectedCallback(),this.syncFromStore(),this.unsubscribe=k.subscribe(()=>this.syncFromStore())}disconnectedCallback(){var o;super.disconnectedCallback(),(o=this.unsubscribe)==null||o.call(this)}syncFromStore(){var o;this.selectedSession=((o=k.data)==null?void 0:o.selected_session)??null,this.stepsDesc=k.stepsDesc}renderStepRow(o,e){const t=o.ctx_pct!=null?`${o.ctx_pct.toFixed(1)}%`:"-";return h`
      <tr>
        <th scope="row" class="mono-cell">#${o.idx}</th>
        <td data-label="模型">${tt(o.model)}</td>
        <td data-label="时序图">
          <span class="wf-cell">
            ${xs(o.ttft_sec,o.stream_sec,e)}
            <span class="wf-dur">${le(o.e2e_sec)}</span>
          </span>
        </td>
        <td
          data-label="TTFT"
          class="mono-cell"
          style="color:var(--tm-status-warn);"
        >
          ${le(o.ttft_sec)}
        </td>
        <td
          data-label="Stream TPS"
          class="mono-cell"
          style="color:var(--tm-chart-0);"
        >
          ${De(o.stream_tps)}
        </td>
        <td data-label="E2E TPS" class="mono-cell">
          ${De(o.e2e_tps)}
        </td>
        <td data-label="思考耗时" class="mono-cell">
          ${le(o.think_sec)}
        </td>
        <td
          data-label="Cache %"
          class="mono-cell"
          style="color:var(--tm-status-ok);"
        >
          ${Ge(o.cache_hit_rate_pct)}
        </td>
        <td data-label="Fresh In" class="mono-cell">
          ${j(o.input_tokens)}
        </td>
        <td data-label="Cached" class="mono-cell">
          ${j(o.cached_tokens)}
        </td>
        <td data-label="Out / Think" class="mono-cell">
          ${J(o.output_tokens)} / ${J(o.thinking_tokens)}
        </td>
        <td
          data-label="Ctx %"
          class="mono-cell"
          style="color:${sr(o.ctx_pct)};font-weight:600;"
        >
          ${t}
        </td>
      </tr>
    `}render(){const o=this.selectedSession,e=(o==null?void 0:o.steps_detail)??[],t=e.length>0,r=o?` · ${(o.title||o.convo_id).slice(0,34)}`:"",a=t?`单步瀑布流${r}`:"单步瀑布流",i=t?`${e.length} 步`:"0 steps",n=t?Math.max(.5,...e.map(d=>(d.ttft_sec||0)+(d.stream_sec||0))):.5,s=this.stepsDesc?[...e].reverse():e;return h`
      <md-elevated-card class="card">
        <div class="card-head">
          <h2 class="card-title" title=${a}>${a}</h2>
          <div class="head-actions">
            <span class="card-meta">${i}</span>
            <md-filled-tonal-button
              @click=${()=>k.toggleStepsOrder()}
            >
              ${N(this.stepsDesc?"arrow_downward":"arrow_upward","icon")}
              ${this.stepsDesc?"最新在前":"按时间正序"}
            </md-filled-tonal-button>
          </div>
        </div>

        ${t?h`
              <div
                class="tm-table-wrap"
                tabindex="0"
                role="region"
                aria-label="单步性能瀑布表"
              >
                <table class="tm-table">
                  <thead>
                    <tr>
                      <th scope="col">Step</th>
                      <th scope="col">模型</th>
                      <th scope="col">时序图</th>
                      <th scope="col">TTFT</th>
                      <th scope="col">Stream TPS</th>
                      <th scope="col">E2E TPS</th>
                      <th scope="col">思考耗时</th>
                      <th scope="col">Cache %</th>
                      <th scope="col">Fresh In</th>
                      <th scope="col">Cached</th>
                      <th scope="col">Out / Think</th>
                      <th scope="col">Ctx %</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${s.map(d=>this.renderStepRow(d,n))}
                  </tbody>
                </table>
              </div>
            `:h`<div class="empty-box">暂无单步性能数据</div>`}
      </md-elevated-card>
    `}};Xt.styles=[Nr,ja,S`
      :host {
        display: block;
        container-type: inline-size;
      }

      .card {
        display: block;
        padding: 16px;
        border-radius: var(--tm-radius-md, 16px);
        --md-elevated-card-container-shape: var(--tm-radius-md, 16px);
        --md-elevated-card-container-color: var(
          --md-sys-color-surface-container-low
        );
      }

      .card-head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 8px 12px;
        margin-bottom: 14px;
      }

      .card-title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        line-height: 1.3;
        color: var(--md-sys-color-on-surface);
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .head-actions {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
      }

      .card-meta {
        font-size: 12px;
        color: var(--md-sys-color-on-surface-variant);
        font-variant-numeric: tabular-nums;
      }

      .wf-cell {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        white-space: nowrap;
      }

      .wf-dur {
        font-family: var(--tm-font-mono);
        font-size: 12px;
        color: var(--md-sys-color-on-surface-variant);
      }

      .mono-cell {
        font-family: var(--tm-font-mono);
        white-space: nowrap;
      }

      .empty-box {
        padding: 28px 16px;
        text-align: center;
        border-radius: var(--tm-radius-sm, 12px);
        background: var(--md-sys-color-surface-container);
        color: var(--md-sys-color-on-surface-variant);
        font-size: 13px;
      }
    `];Ga([T()],Xt.prototype,"selectedSession",2);Ga([T()],Xt.prototype,"stepsDesc",2);Xt=Ga([E("steps-page")],Xt);var Yc=Object.defineProperty,Xc=Object.getOwnPropertyDescriptor,lr=(o,e,t,r)=>{for(var a=r>1?void 0:r?Xc(e,t):e,i=o.length-1,n;i>=0;i--)(n=o[i])&&(a=(r?n(e,t,a):n(a))||a);return r&&a&&Yc(e,t,a),a};const Zc=[{key:"since18",label:"18:00+"},{key:"today",label:"Today"},{key:"7d",label:"7 Days"},{key:"30d",label:"30 Days"},{key:"all",label:"All"}];let xt=class extends O{constructor(){var o,e,t;super(...arguments),this.modelScope=k.modelScope,this.globalRange=k.globalRange,this.sessionModels=((e=(o=k.data)==null?void 0:o.selected_session)==null?void 0:e.models_list)??[],this.globalModels=((t=k.data)==null?void 0:t.models_list)??[]}connectedCallback(){super.connectedCallback(),this.syncFromStore(),this.unsubscribe=k.subscribe(()=>this.syncFromStore())}disconnectedCallback(){var o;super.disconnectedCallback(),(o=this.unsubscribe)==null||o.call(this)}syncFromStore(){var o,e,t;this.modelScope=k.modelScope,this.globalRange=k.globalRange,this.sessionModels=((e=(o=k.data)==null?void 0:o.selected_session)==null?void 0:e.models_list)??[],this.globalModels=((t=k.data)==null?void 0:t.models_list)??[]}handleScopeSelection(o){var t;const e=(t=o.detail)==null?void 0:t.index;e===0?k.setModelScope("session"):e===1&&k.setModelScope("global")}handleRangeClick(o,e){if(this.globalRange===e){o.preventDefault();return}k.setGlobalRange(e)}renderModelRow(o){return h`
      <tr>
        <th scope="row" class="model-name">${o.name}</th>
        <td data-label="会话" class="mono-cell">${j(o.sessions)}</td>
        <td data-label="步数" class="mono-cell">${j(o.turns)}</td>
        <td data-label="Fresh In" class="mono-cell">
          ${J(o.input)}
        </td>
        <td data-label="Cached" class="mono-cell">
          ${J(o.cached)}
        </td>
        <td data-label="Output" class="mono-cell">
          ${J(o.output)}
        </td>
        <td data-label="Thinking" class="mono-cell">
          ${J(o.thinking)}
        </td>
        <td
          data-label="Cache %"
          class="mono-cell"
          style="color:var(--tm-status-ok);font-weight:600;"
        >
          ${Ge(o.cache_hit_rate_pct)}
        </td>
        <td
          data-label="Avg TTFT"
          class="mono-cell"
          style="color:var(--tm-status-warn);"
        >
          ${le(o.avg_ttft_sec)}
        </td>
        <td
          data-label="Stream TPS"
          class="mono-cell"
          style="color:var(--tm-chart-0);"
        >
          ${De(o.avg_stream_tps)}
        </td>
        <td data-label="E2E TPS" class="mono-cell">
          ${De(o.avg_e2e_tps)}
        </td>
      </tr>
    `}render(){const o=this.modelScope==="session"?this.sessionModels:this.globalModels;return h`
      <md-elevated-card class="card">
        <div class="card-head">
          <h2 class="card-title">分模型统计 (Usage &amp; Speed)</h2>
          <md-outlined-segmented-button-set
            class="scope-set"
            aria-label="模型统计作用域"
            @segmented-button-set-selection=${this.handleScopeSelection}
          >
            <md-outlined-segmented-button
              label="当前会话"
              .selected=${this.modelScope==="session"}
            ></md-outlined-segmented-button>
            <md-outlined-segmented-button
              label="全局统计"
              .selected=${this.modelScope==="global"}
            ></md-outlined-segmented-button>
          </md-outlined-segmented-button-set>
        </div>

        ${this.modelScope==="global"?h`
              <md-chip-set class="range-chips" aria-label="统计时间范围">
                ${Zc.map(e=>h`
                    <md-filter-chip
                      label=${e.label}
                      .selected=${this.globalRange===e.key}
                      @click=${t=>this.handleRangeClick(t,e.key)}
                    ></md-filter-chip>
                  `)}
              </md-chip-set>
            `:b}
        ${o.length>0?h`
              <div
                class="tm-table-wrap"
                tabindex="0"
                role="region"
                aria-label="分模型性能统计表"
              >
                <table class="tm-table">
                  <thead>
                    <tr>
                      <th scope="col">模型</th>
                      <th scope="col">会话</th>
                      <th scope="col">步数</th>
                      <th scope="col">Fresh In</th>
                      <th scope="col">Cached</th>
                      <th scope="col">Output</th>
                      <th scope="col">Thinking</th>
                      <th scope="col">Cache %</th>
                      <th scope="col">Avg TTFT</th>
                      <th scope="col">Stream TPS</th>
                      <th scope="col">E2E TPS</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${o.map(e=>this.renderModelRow(e))}
                  </tbody>
                </table>
              </div>
            `:h`<div class="empty-box">暂无模型统计数据</div>`}
      </md-elevated-card>
    `}};xt.styles=[ja,S`
      :host {
        display: block;
        container-type: inline-size;
      }

      .card {
        display: block;
        padding: 16px;
        border-radius: var(--tm-radius-md, 16px);
        --md-elevated-card-container-shape: var(--tm-radius-md, 16px);
        --md-elevated-card-container-color: var(
          --md-sys-color-surface-container-low
        );
      }

      .card-head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 10px 12px;
        margin-bottom: 12px;
      }

      .card-title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        line-height: 1.3;
        color: var(--md-sys-color-on-surface);
      }

      .scope-set {
        flex-shrink: 0;
      }

      .range-chips {
        margin-bottom: 12px;
      }

      .mono-cell {
        font-family: var(--tm-font-mono);
        white-space: nowrap;
      }

      .model-name {
        font-weight: 600;
        color: var(--md-sys-color-on-surface);
        word-break: break-word;
      }

      .empty-box {
        padding: 28px 16px;
        text-align: center;
        border-radius: var(--tm-radius-sm, 12px);
        background: var(--md-sys-color-surface-container);
        color: var(--md-sys-color-on-surface-variant);
        font-size: 13px;
      }
    `];lr([T()],xt.prototype,"modelScope",2);lr([T()],xt.prototype,"globalRange",2);lr([T()],xt.prototype,"sessionModels",2);lr([T()],xt.prototype,"globalModels",2);xt=lr([E("models-page")],xt);var Qc=Object.defineProperty,Jc=Object.getOwnPropertyDescriptor,Vr=(o,e,t,r)=>{for(var a=r>1?void 0:r?Jc(e,t):e,i=o.length-1,n;i>=0;i--)(n=o[i])&&(a=(r?n(e,t,a):n(a))||a);return r&&a&&Qc(e,t,a),a};const eh=[{key:"since18",label:"18:00+"},{key:"today",label:"Today"},{key:"7d",label:"7 Days"},{key:"30d",label:"30 Days"},{key:"all",label:"All"}],th="悬停查看每日明细";let Pt=class extends O{constructor(){super(...arguments),this.data=k.data,this.globalRange=k.globalRange,this.heatmapHoverText=th}connectedCallback(){super.connectedCallback(),this.syncFromStore(),this.unsubscribe=k.subscribe(()=>this.syncFromStore())}disconnectedCallback(){var o;super.disconnectedCallback(),(o=this.unsubscribe)==null||o.call(this)}syncFromStore(){this.data=k.data,this.globalRange=k.globalRange}handleRangeClick(o,e){o.preventDefault(),k.setGlobalRange(e)}handleHeatmapHover(o){this.heatmapHoverText=o.entry?`${o.date}: ${J(o.entry.total)} tok · ${j(o.entry.turns)} turns`:`${o.date}: 0 tokens`}renderDailyBars(o){const e=o.slice(-24);if(!e.length)return h`<div class="empty-state">暂无每日用量数据</div>`;const t=Math.max(1,...e.map(r=>r.total||0));return h`
      <div class="daily-bars-scroll">
        <div class="daily-bars" role="img" aria-label="每日用量趋势 (近 24 天)">
          ${e.map(r=>{const a=r.total||0,i=Math.max(4,Math.round(a/t*100)),n=Math.max(1,a),s=((r.cached||0)/n*100).toFixed(1),d=((r.input||0)/n*100).toFixed(1),c=((r.output||0)/n*100).toFixed(1),p=`${r.date}
Tokens: ${j(a)} (Cache ${r.cache_hit_rate_pct}%)
TTFT: ${le(r.avg_ttft_sec)} | Stream: ${De(r.avg_stream_tps)}`;return h`
              <div class="bar-col" title=${p}>
                <div class="bar-track">
                  <div class="bar-stack" style="height:${i}%;">
                    <div
                      class="bar-seg"
                      style="height:${s}%;background:var(--tm-chart-0);"
                    ></div>
                    <div
                      class="bar-seg"
                      style="height:${d}%;background:var(--tm-chart-1);"
                    ></div>
                    <div
                      class="bar-seg"
                      style="height:${c}%;background:var(--tm-chart-2);"
                    ></div>
                  </div>
                </div>
                <span class="bar-label">${r.date.slice(5)}</span>
              </div>
            `})}
        </div>
      </div>
    `}render(){const o=this.data,e=o==null?void 0:o.summary,t=o==null?void 0:o.costs,r=o==null?void 0:o.streaks,a=Object.entries((o==null?void 0:o.surfaces)??{}),i=((o==null?void 0:o.top_tools)??[]).slice(0,10);return h`
      <div class="page-stack">
        <!-- Card 1: 全局趋势与历史汇总 -->
        <md-outlined-card class="trend-card">
          <div class="card-head">
            <div class="card-title-row">
              ${N("insights")}
              <h2 class="card-title">全局趋势与历史汇总</h2>
            </div>

            <md-chip-set class="range-chips" aria-label="统计时间范围">
              ${eh.map(n=>h`
                  <md-filter-chip
                    .label=${n.label}
                    .selected=${this.globalRange===n.key}
                    @click=${s=>this.handleRangeClick(s,n.key)}
                  ></md-filter-chip>
                `)}
            </md-chip-set>
          </div>

          <div class="kpi-grid">
            <div class="kpi-tile">
              <div class="kpi-label">总 Token</div>
              <div class="kpi-value">${J(e==null?void 0:e.total_tokens)}</div>
              <div class="kpi-sub">
                ${j(e==null?void 0:e.total_turns)} turns · ${j(e==null?void 0:e.total_sessions)} sess
              </div>
            </div>

            <div class="kpi-tile">
              <div class="kpi-label">缓存命中率</div>
              <div class="kpi-value ok">${Ge(e==null?void 0:e.cache_hit_rate_pct)}</div>
              <div class="kpi-sub">
                节省 $${((t==null?void 0:t.dollars_saved)??0).toFixed(2)} (-${((t==null?void 0:t.savings_pct)??0).toFixed(1)}%)
              </div>
            </div>

            <div class="kpi-tile">
              <div class="kpi-label">TTFT / Stream</div>
              <div class="kpi-value accent">
                ${le(e==null?void 0:e.avg_ttft_sec)} · ${De(e==null?void 0:e.avg_stream_tps)}
              </div>
              <div class="kpi-sub">
                Peak ${De(e==null?void 0:e.peak_stream_tps)} · E2E ${De(e==null?void 0:e.avg_e2e_tps)}
              </div>
            </div>

            <div class="kpi-tile">
              <div class="kpi-label">连续活跃</div>
              <div class="kpi-value warn">${(r==null?void 0:r.current_streak)??0} 天</div>
              <div class="kpi-sub">
                最高 ${(r==null?void 0:r.longest_streak)??0} 天 · 工具
                ${(e==null?void 0:e.tool_success_rate_pct)??100}%
              </div>
            </div>
          </div>

          ${a.length>0?h`
                <div class="chips-row" aria-label="来源端分布">
                  ${a.map(([n,s])=>h`
                      <span class="tonal-chip">
                        ${n}: ${j(s.sessions)} sess (${J(s.total)})
                      </span>
                    `)}
                </div>
              `:b}
        </md-outlined-card>

        <!-- Card 2: 每日用量趋势 (近 24 天) + 近 20 周活动热力图 -->
        <md-outlined-card class="trend-card">
          <div class="card-head">
            <div class="card-title-row">
              ${N("trending_up")}
              <h2 class="card-title">每日用量趋势 (近 24 天)</h2>
            </div>

            <div class="legend-row" aria-label="图例">
              <span class="legend-item">
                <span
                  class="legend-swatch"
                  style="background:var(--tm-chart-0);"
                ></span>
                Cached
              </span>
              <span class="legend-item">
                <span
                  class="legend-swatch"
                  style="background:var(--tm-chart-1);"
                ></span>
                Fresh In
              </span>
              <span class="legend-item">
                <span
                  class="legend-swatch"
                  style="background:var(--tm-chart-2);"
                ></span>
                Output
              </span>
            </div>
          </div>

          ${this.renderDailyBars((o==null?void 0:o.daily)??[])}

          <md-divider class="section-divider"></md-divider>

          <div class="card-head" style="margin-bottom:8px;">
            <h3 class="sub-title">近 20 周活动热力图</h3>
            <span class="card-meta">${this.heatmapHoverText}</span>
          </div>

          <div class="heatmap-scroll">
            ${ws((o==null?void 0:o.all_daily)??[],140,n=>this.handleHeatmapHover(n))}
          </div>

          <div class="heatmap-footer" aria-hidden="true">
            <span>少</span>
            <span class="hm-scale-box" style="background:var(--tm-hm-0);"></span>
            <span class="hm-scale-box" style="background:var(--tm-hm-1);"></span>
            <span class="hm-scale-box" style="background:var(--tm-hm-2);"></span>
            <span class="hm-scale-box" style="background:var(--tm-hm-3);"></span>
            <span class="hm-scale-box" style="background:var(--tm-hm-4);"></span>
            <span>多</span>
          </div>
        </md-outlined-card>

        <!-- Card 3: 24 小时节律 & 高频工具 -->
        <md-outlined-card class="trend-card">
          <div class="card-head">
            <div class="card-title-row">
              ${N("build")}
              <h2 class="card-title">24 小时节律 &amp; 高频工具</h2>
            </div>
            <span class="card-meta">按本地活跃时段分布</span>
          </div>

          ${_s((o==null?void 0:o.hourly)??[],92)}

          <div class="chips-row" aria-label="高频工具 Top 10">
            ${i.length>0?i.map(n=>h`
                    <span class="tonal-chip tool">
                      ${n.name}: ${j(n.count)}
                    </span>
                  `):h`<span class="card-meta">暂无工具调用记录</span>`}
          </div>
        </md-outlined-card>
      </div>
    `}};Pt.styles=[Nr,S`
      :host {
        display: block;
        container-type: inline-size;
      }

      .page-stack {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .trend-card {
        display: block;
        padding: 16px;
        border-radius: var(--tm-radius-md, 16px);
        --md-outlined-card-container-color: var(
          --md-sys-color-surface-container-low
        );
        --md-outlined-card-outline-color: var(--md-sys-color-outline-variant);
        --md-outlined-card-container-shape: var(--tm-radius-md, 16px);
      }

      .card-head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 12px;
      }

      .card-title-row {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }

      .card-title-row md-icon {
        --md-icon-size: 20px;
        color: var(--md-sys-color-primary);
      }

      .card-title {
        margin: 0;
        font-size: 15px;
        font-weight: 700;
        color: var(--md-sys-color-on-surface);
        line-height: 1.3;
      }

      .sub-title {
        margin: 0;
        font-size: 13.5px;
        font-weight: 700;
        color: var(--md-sys-color-on-surface);
      }

      .card-meta {
        font-size: 12px;
        color: var(--md-sys-color-on-surface-variant);
        font-variant-numeric: tabular-nums;
      }

      .range-chips {
        --md-filter-chip-container-height: 30px;
        --md-filter-chip-label-text-size: 12px;
      }

      .kpi-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
      }

      .kpi-tile {
        background: var(--md-sys-color-surface-container);
        border: 1px solid var(--md-sys-color-outline-variant);
        border-radius: var(--tm-radius-sm, 12px);
        padding: 10px 12px;
        min-width: 0;
      }

      .kpi-label {
        font-size: 11.5px;
        font-weight: 600;
        color: var(--md-sys-color-on-surface-variant);
        margin-bottom: 4px;
      }

      .kpi-value {
        font-size: 18px;
        font-weight: 700;
        line-height: 1.25;
        font-variant-numeric: tabular-nums;
        color: var(--md-sys-color-on-surface);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .kpi-value.ok {
        color: var(--tm-status-ok);
      }

      .kpi-value.accent {
        color: var(--tm-chart-1);
      }

      .kpi-value.warn {
        color: var(--tm-status-warn);
      }

      .kpi-sub {
        margin-top: 4px;
        font-size: 11px;
        color: var(--md-sys-color-on-surface-variant);
        font-variant-numeric: tabular-nums;
        line-height: 1.35;
      }

      .chips-row {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 12px;
      }

      .tonal-chip {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 4px 10px;
        border-radius: var(--tm-radius-xs, 8px);
        font-size: 11.5px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        background: var(--md-sys-color-secondary-container);
        color: var(--md-sys-color-on-secondary-container);
      }

      .tonal-chip.tool {
        background: var(--md-sys-color-tertiary-container);
        color: var(--md-sys-color-on-tertiary-container);
      }

      .legend-row {
        display: inline-flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
      }

      .legend-item {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 11.5px;
        color: var(--md-sys-color-on-surface-variant);
      }

      .legend-swatch {
        width: 9px;
        height: 9px;
        border-radius: 2px;
        flex-shrink: 0;
      }

      .daily-bars-scroll {
        overflow-x: auto;
        padding-bottom: 4px;
      }

      .daily-bars {
        display: flex;
        align-items: flex-end;
        gap: 4px;
        height: 132px;
        padding-top: 8px;
        min-width: max-content;
      }

      .bar-col {
        flex: 1 0 20px;
        min-width: 20px;
        max-width: 38px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        height: 100%;
        gap: 4px;
        padding: 2px 1px;
        border-radius: 6px;
        transition: background-color 0.15s ease;
        cursor: default;
      }

      .bar-col:hover {
        background: var(--md-sys-color-surface-container-high);
      }

      .bar-track {
        flex: 1;
        width: 100%;
        display: flex;
        align-items: flex-end;
        min-height: 0;
      }

      .bar-stack {
        width: 100%;
        display: flex;
        flex-direction: column-reverse;
        border-radius: 4px 4px 1px 1px;
        overflow: hidden;
        min-height: 4px;
        background: var(--md-sys-color-surface-container-highest);
      }

      .bar-seg {
        width: 100%;
      }

      .bar-label {
        font-family: var(--tm-font-mono);
        font-size: 9.5px;
        line-height: 1;
        color: var(--md-sys-color-on-surface-variant);
        white-space: nowrap;
      }

      .section-divider {
        margin: 14px 0;
        --md-divider-color: var(--md-sys-color-outline-variant);
      }

      .heatmap-scroll {
        overflow-x: auto;
        padding-bottom: 4px;
      }

      .heatmap-scroll .tm-hm-grid {
        min-width: max-content;
      }

      .heatmap-footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 5px;
        margin-top: 8px;
        font-size: 11px;
        color: var(--md-sys-color-on-surface-variant);
      }

      .hm-scale-box {
        width: 10px;
        height: 10px;
        border-radius: 2px;
      }

      .empty-state {
        padding: 20px 12px;
        text-align: center;
        font-size: 12.5px;
        color: var(--md-sys-color-on-surface-variant);
      }

      @container (width < 720px) {
        .kpi-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @container (width < 320px) {
        .kpi-grid {
          grid-template-columns: 1fr;
        }
      }
    `];Vr([T()],Pt.prototype,"data",2);Vr([T()],Pt.prototype,"globalRange",2);Vr([T()],Pt.prototype,"heatmapHoverText",2);Pt=Vr([E("global-trends-page")],Pt);var rh=Object.defineProperty,oh=Object.getOwnPropertyDescriptor,Hr=(o,e,t,r)=>{for(var a=r>1?void 0:r?oh(e,t):e,i=o.length-1,n;i>=0;i--)(n=o[i])&&(a=(r?n(e,t,a):n(a))||a);return r&&a&&rh(e,t,a),a};let It=class extends O{constructor(){var o;super(...arguments),this.sessions=((o=k.data)==null?void 0:o.recent_sessions)??[],this.currentConvoId=this.resolveCurrentConvoId(),this.searchQuery=""}connectedCallback(){super.connectedCallback(),this.syncFromStore(),this.unsubscribe=k.subscribe(()=>this.syncFromStore())}disconnectedCallback(){var o;super.disconnectedCallback(),(o=this.unsubscribe)==null||o.call(this)}resolveCurrentConvoId(){var e;const o=k.data;return(e=o==null?void 0:o.selected_session)!=null&&e.convo_id?o.selected_session.convo_id:k.settings.sessionMode==="pinned"?k.settings.pinnedConvoId:(o==null?void 0:o.auto_latest_id)??null}syncFromStore(){var o;this.sessions=((o=k.data)==null?void 0:o.recent_sessions)??[],this.currentConvoId=this.resolveCurrentConvoId()}handleSearchInput(o){const e=o.target;this.searchQuery=e.value??""}clearSearch(){this.searchQuery=""}selectSession(o){k.pinSession(o),k.navigate("home")}handleRowKeydown(o,e){(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),this.selectSession(e))}getFilteredSessions(){const o=this.searchQuery.trim().toLowerCase();return o?this.sessions.filter(e=>(e.title||"").toLowerCase().includes(o)||(e.model||"").toLowerCase().includes(o)||(e.project||"").toLowerCase().includes(o)||(e.convo_id||"").toLowerCase().includes(o)):this.sessions}render(){const o=this.getFilteredSessions();return h`
      <md-outlined-card class="sessions-card">
        <div class="card-head">
          <div class="title-group">
            ${N("history")}
            <h2 class="card-title">最近会话 (点击切入监控)</h2>
            <span class="count-pill">
              ${this.searchQuery.trim()?`${o.length} / ${this.sessions.length}`:`${this.sessions.length}`}
            </span>
          </div>

          <md-outlined-text-field
            class="search-field"
            type="search"
            placeholder="筛选标题、模型或项目..."
            aria-label="筛选历史会话"
            .value=${this.searchQuery}
            @input=${this.handleSearchInput}
          >
            ${N("search","leading-icon")}
            ${this.searchQuery?h`
                  <md-icon-button
                    slot="trailing-icon"
                    aria-label="清除搜索"
                    @click=${this.clearSearch}
                  >
                    ${N("close")}
                  </md-icon-button>
                `:b}
          </md-outlined-text-field>
        </div>

        ${o.length===0?h`
              <div class="empty-state">
                ${this.sessions.length===0?"暂无会话记录":"没有匹配的会话记录"}
              </div>
            `:h`
              <div
                class="tm-table-wrap"
                tabindex="0"
                role="region"
                aria-label="历史会话列表"
              >
                <table class="tm-table">
                  <thead>
                    <tr>
                      <th scope="col">会话 / 项目</th>
                      <th scope="col">最近活跃</th>
                      <th scope="col">模型</th>
                      <th scope="col">步数</th>
                      <th scope="col">Tokens</th>
                      <th scope="col">Ctx %</th>
                      <th scope="col">Cache %</th>
                      <th scope="col">TTFT</th>
                      <th scope="col">Stream TPS</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${o.map(e=>{const t=e.convo_id===this.currentConvoId,r=e.is_active?"active":e.is_recent?"recent":"",a=e.ctx_used_pct!=null?`${Math.round(e.ctx_used_pct)}%`:"-",i=(e.last_active_at||e.created_at||"").slice(5,16);return h`
                        <tr
                          class="clickable ${t?"is-current":""}"
                          tabindex="0"
                          aria-current=${t?"true":"false"}
                          title=${`${e.title||e.convo_id}
${e.project||""} (${e.convo_id})`}
                          @click=${()=>this.selectSession(e.convo_id)}
                          @keydown=${n=>this.handleRowKeydown(n,e.convo_id)}
                        >
                          <th scope="row" class="session-cell">
                            <md-ripple></md-ripple>
                            <div class="session-main">
                              <span
                                class="status-dot ${r}"
                                aria-hidden="true"
                              ></span>
                              <span class="session-title">
                                ${e.title||e.convo_id}
                              </span>
                              ${t?h`<span class="current-badge">当前</span>`:b}
                            </div>
                            ${e.project?h`<div class="session-project">${e.project}</div>`:b}
                          </th>
                          <td data-label="最近活跃" class="mono-val">
                            ${i||"-"}
                          </td>
                          <td data-label="模型">${tt(e.model)}</td>
                          <td data-label="步数" class="mono-val">
                            ${j(e.turn_count)}
                          </td>
                          <td data-label="Tokens" class="mono-val">
                            ${J(e.total_tokens)}
                          </td>
                          <td
                            data-label="Ctx %"
                            class="mono-val"
                            style="color:${t?"inherit":sr(e.ctx_used_pct)};font-weight:600;"
                          >
                            ${a}
                          </td>
                          <td
                            data-label="Cache %"
                            class="mono-val ${t?"":"cache-val"}"
                          >
                            ${Ge(e.cache_hit_rate_pct)}
                          </td>
                          <td
                            data-label="TTFT"
                            class="mono-val ${t?"":"ttft-val"}"
                          >
                            ${le(e.avg_ttft_sec)}
                          </td>
                          <td
                            data-label="Stream TPS"
                            class="mono-val ${t?"":"tps-val"}"
                          >
                            ${De(e.avg_stream_tps)}
                          </td>
                        </tr>
                      `})}
                  </tbody>
                </table>
              </div>
            `}
      </md-outlined-card>
    `}};It.styles=[ja,S`
      :host {
        display: block;
        container-type: inline-size;
      }

      .sessions-card {
        display: block;
        padding: 16px;
        border-radius: var(--tm-radius-md, 16px);
        --md-outlined-card-container-color: var(
          --md-sys-color-surface-container-low
        );
        --md-outlined-card-outline-color: var(--md-sys-color-outline-variant);
        --md-outlined-card-container-shape: var(--tm-radius-md, 16px);
      }

      .card-head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 12px;
      }

      .title-group {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }

      .title-group md-icon {
        --md-icon-size: 20px;
        color: var(--md-sys-color-primary);
      }

      .card-title {
        margin: 0;
        font-size: 15px;
        font-weight: 700;
        color: var(--md-sys-color-on-surface);
        line-height: 1.3;
      }

      .count-pill {
        display: inline-flex;
        align-items: center;
        padding: 2px 8px;
        border-radius: var(--tm-radius-full, 9999px);
        font-size: 11px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        background: var(--md-sys-color-surface-container-highest);
        color: var(--md-sys-color-on-surface-variant);
      }

      .search-field {
        width: 260px;
        max-width: 100%;
        --md-outlined-field-container-shape: var(--tm-radius-sm, 12px);
        --md-outlined-text-field-top-space: 10px;
        --md-outlined-text-field-bottom-space: 10px;
      }

      table.tm-table tbody tr.clickable {
        user-select: none;
      }

      table.tm-table tbody tr.clickable:active {
        background: var(--md-sys-color-surface-container-highest);
      }

      table.tm-table tbody tr.clickable.is-current {
        background: var(--md-sys-color-secondary-container);
        color: var(--md-sys-color-on-secondary-container);
      }

      table.tm-table tbody tr.clickable.is-current:hover {
        background: color-mix(
          in srgb,
          var(--md-sys-color-secondary-container) 90%,
          var(--md-sys-color-on-secondary-container)
        );
      }

      table.tm-table tbody tr.clickable.is-current th,
      table.tm-table tbody tr.clickable.is-current td {
        color: var(--md-sys-color-on-secondary-container);
      }

      .session-cell {
        position: relative;
        max-width: 300px;
      }

      .session-main {
        display: flex;
        align-items: center;
        gap: 7px;
        min-width: 0;
      }

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
        background: var(--md-sys-color-outline);
      }

      .status-dot.active {
        background: var(--tm-status-ok);
      }

      .status-dot.recent {
        background: var(--tm-status-warn);
      }

      .session-title {
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
      }

      .current-badge {
        display: inline-flex;
        align-items: center;
        padding: 1px 6px;
        border-radius: var(--tm-radius-full, 9999px);
        font-size: 10px;
        font-weight: 700;
        flex-shrink: 0;
        background: var(--md-sys-color-primary);
        color: var(--md-sys-color-on-primary);
      }

      .session-project {
        margin-top: 2px;
        padding-left: 15px;
        font-size: 11px;
        font-weight: 400;
        color: var(--md-sys-color-on-surface-variant);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      tr.is-current .session-project {
        color: var(--md-sys-color-on-secondary-container);
        opacity: 0.85;
      }

      .mono-val {
        font-family: var(--tm-font-mono);
        font-variant-numeric: tabular-nums;
      }

      .cache-val {
        color: var(--tm-status-ok);
        font-weight: 600;
      }

      .ttft-val {
        color: var(--tm-status-warn);
      }

      .tps-val {
        color: var(--tm-chart-1);
      }

      .empty-state {
        padding: 28px 16px;
        text-align: center;
        font-size: 13px;
        color: var(--md-sys-color-on-surface-variant);
      }

      @container (width < 560px) {
        .search-field {
          width: 100%;
        }

        .session-cell {
          max-width: none;
        }
      }
    `];Hr([T()],It.prototype,"sessions",2);Hr([T()],It.prototype,"currentConvoId",2);Hr([T()],It.prototype,"searchQuery",2);It=Hr([E("recent-sessions-page")],It);var ah=Object.defineProperty,ih=Object.getOwnPropertyDescriptor,Ur=(o,e,t,r)=>{for(var a=r>1?void 0:r?ih(e,t):e,i=o.length-1,n;i>=0;i--)(n=o[i])&&(a=(r?n(e,t,a):n(a))||a);return r&&a&&ah(e,t,a),a};const nh=[{value:"light",label:"亮色"},{value:"dark",label:"暗色"},{value:"follow-gui",label:"跟随 GUI"}],sh=[{value:"2021",label:"SPEC_2021"},{value:"2025",label:"SPEC_2025"}],lh=[{value:"latest_step",label:"最新一步"},{value:"session",label:"单个会话"},{value:"global",label:"全局"}];let zt=class extends O{constructor(){super(...arguments),this.settings=k.settings,this.data=k.data,this.sessionSearch=""}connectedCallback(){super.connectedCallback(),this.syncFromStore(),this.unsubscribe=k.subscribe(()=>this.syncFromStore())}disconnectedCallback(){var o;super.disconnectedCallback(),(o=this.unsubscribe)==null||o.call(this)}syncFromStore(){this.settings=k.settings,this.data=k.data}handleThemeModeChange(o){const e=o.target.value;k.setThemeConfig({themeMode:e})}handleVariantChange(o){const e=o.target.value;k.setThemeConfig({variant:e})}handleSpecVersionChange(o){const e=o.target.value;k.setThemeConfig({specVersion:e})}handleHomeScopeChange(o){const e=o.target.value;k.setHomeScope(e)}handleSearchInput(o){const e=o.target;this.sessionSearch=e.value??""}clearSearch(){this.sessionSearch=""}getFilteredSessions(o){const e=this.sessionSearch.trim().toLowerCase();return e?o.filter(t=>(t.title||"").toLowerCase().includes(e)||(t.model||"").toLowerCase().includes(e)||(t.project||"").toLowerCase().includes(e)||(t.convo_id||"").toLowerCase().includes(e)):o}render(){var d,c;const o=((d=this.data)==null?void 0:d.sessions_index)??[],e=this.getFilteredSessions(o),t=((c=this.data)==null?void 0:c.auto_latest_id)??null,r=t?o.find(p=>p.convo_id===t)??null:o[0]??null,a=k.hostConvoId,i=a?o.find(p=>p.convo_id===a)??null:null,n=this.settings.sessionMode==="auto",s=!n&&i!==null&&this.settings.pinnedConvoId===i.convo_id;return h`
      <div class="page-stack">
        <!-- Section 1: 外观与 Monet 配色 -->
        <md-outlined-card class="settings-card">
          <div class="section-head">
            <div class="section-title-row">
              ${N("palette")}
              <h2 class="section-title">外观与 Monet 配色</h2>
            </div>
          </div>

          <md-list class="settings-list">
            <!-- 1. 主题模式 -->
            <div class="setting-row">
              <div class="setting-info">
                <md-list-item>
                  ${N(this.settings.themeMode==="dark"?"dark_mode":this.settings.themeMode==="light"?"light_mode":"computer","start")}
                  <span slot="headline">主题模式</span>
                  <span slot="supporting-text">
                    亮色、暗色或自动跟随宿主 GUI 主题
                  </span>
                </md-list-item>
              </div>
              <md-outlined-select
                class="setting-select"
                aria-label="主题模式"
                menu-positioning="fixed"
                .value=${this.settings.themeMode}
                @change=${this.handleThemeModeChange}
              >
                ${nh.map(p=>h`
                    <md-select-option
                      value=${p.value}
                      ?selected=${this.settings.themeMode===p.value}
                    >
                      <div slot="headline">${p.label}</div>
                    </md-select-option>
                  `)}
              </md-outlined-select>
            </div>

            <md-divider></md-divider>

            <!-- 2. 色板风格 -->
            <div class="setting-row">
              <div class="setting-info">
                <md-list-item>
                  ${N("palette","start")}
                  <span slot="headline">色板风格</span>
                  <span slot="supporting-text">部分色板不支持 SPEC_2025</span>
                </md-list-item>
              </div>
              <md-outlined-select
                class="setting-select"
                aria-label="色板风格"
                menu-positioning="fixed"
                .value=${this.settings.variant}
                @change=${this.handleVariantChange}
              >
                ${sc.map(p=>h`
                    <md-select-option
                      value=${p.id}
                      ?selected=${this.settings.variant===p.id}
                    >
                      <div slot="headline">${p.label}</div>
                    </md-select-option>
                  `)}
              </md-outlined-select>
            </div>

            <md-divider></md-divider>

            <!-- 3. 推导算法 -->
            <div class="setting-row">
              <div class="setting-info">
                <md-list-item>
                  ${N("auto_awesome","start")}
                  <span slot="headline">推导算法</span>
                  <span slot="supporting-text">
                    动态色阶生成规范版本
                  </span>
                </md-list-item>
              </div>
              <md-outlined-select
                class="setting-select"
                aria-label="推导算法"
                menu-positioning="fixed"
                .value=${this.settings.specVersion}
                @change=${this.handleSpecVersionChange}
              >
                ${sh.map(p=>h`
                    <md-select-option
                      value=${p.value}
                      ?selected=${this.settings.specVersion===p.value}
                    >
                      <div slot="headline">${p.label}</div>
                    </md-select-option>
                  `)}
              </md-outlined-select>
            </div>
          </md-list>
        </md-outlined-card>

        <!-- Section 2: 主页统计作用域 -->
        <md-outlined-card class="settings-card">
          <div class="section-head">
            <div class="section-title-row">
              ${N("home")}
              <h2 class="section-title">主页统计作用域</h2>
            </div>
          </div>

          <md-list class="settings-list">
            <div class="setting-row">
              <div class="setting-info">
                <md-list-item>
                  ${N("insights","start")}
                  <span slot="headline">主页统计作用域</span>
                  <span slot="supporting-text">
                    切换主页默认摘要卡片统计范围
                  </span>
                </md-list-item>
              </div>
              <md-outlined-select
                class="setting-select"
                aria-label="主页统计作用域"
                menu-positioning="fixed"
                .value=${this.settings.homeScope}
                @change=${this.handleHomeScopeChange}
              >
                ${lh.map(p=>h`
                    <md-select-option
                      value=${p.value}
                      ?selected=${this.settings.homeScope===p.value}
                    >
                      <div slot="headline">${p.label}</div>
                    </md-select-option>
                  `)}
              </md-outlined-select>
            </div>
          </md-list>
        </md-outlined-card>

        <!-- Section 3: 手动选择会话 -->
        <md-outlined-card class="settings-card">
          <div class="section-head">
            <div class="section-title-row">
              ${N("push_pin")}
              <h2 class="section-title">手动选择会话</h2>
            </div>
            <span class="mode-badge ${n?"":"pinned"}">
              ${n?"AUTO":"PINNED"}
            </span>
          </div>

          <md-list class="quick-actions-list">
            <md-list-item
              type="button"
              class="session-item ${n?"selected":""}"
              @click=${()=>k.selectAutoSession()}
            >
              ${N("auto_awesome","start")}
              <span slot="headline">自动跟踪最新会话 (AUTO)</span>
              <span slot="supporting-text">
                ${r?`${r.title||r.convo_id} · ${tt(r.model)}`:"实时跟踪本地最新活跃对话"}
              </span>
              ${n?N("check","end"):b}
            </md-list-item>

            ${i?h`
                  <md-list-item
                    type="button"
                    class="session-item ${s?"selected":""}"
                    @click=${()=>k.pinSession(i.convo_id)}
                  >
                    ${N("push_pin","start")}
                    <span slot="headline">切换到当前窗口会话</span>
                    <span slot="supporting-text">
                      ${i.title||i.convo_id} ·
                      ${tt(i.model)}
                    </span>
                    ${s?N("check","end"):b}
                  </md-list-item>
                `:b}
          </md-list>

          <md-divider></md-divider>

          <div class="search-box-wrap">
            <md-outlined-text-field
              class="session-search"
              type="search"
              label="搜索会话"
              placeholder="按标题、模型、项目或 ID 筛选..."
              aria-label="搜索手动选择会话"
              .value=${this.sessionSearch}
              @input=${this.handleSearchInput}
            >
              ${N("search","leading-icon")}
              ${this.sessionSearch?h`
                    <md-icon-button
                      slot="trailing-icon"
                      aria-label="清除搜索"
                      @click=${this.clearSearch}
                    >
                      ${N("close")}
                    </md-icon-button>
                  `:b}
            </md-outlined-text-field>
          </div>

          ${e.length===0?h`
                <div class="empty-state">
                  ${o.length===0?"暂无可选会话":"无匹配会话"}
                </div>
              `:h`
                <md-list
                  class="session-picker-list"
                  aria-label="会话列表 (${e.length})"
                >
                  ${e.map(p=>{const v=this.settings.sessionMode==="pinned"&&this.settings.pinnedConvoId===p.convo_id,g=p.is_active?"active":p.is_recent?"recent":"",_=p.ctx_used_pct!=null?`${Math.round(p.ctx_used_pct)}%`:"-";return h`
                      <md-list-item
                        type="button"
                        class="session-item ${v?"selected":""}"
                        @click=${()=>k.pinSession(p.convo_id)}
                      >
                        <span
                          slot="start"
                          class="status-dot ${g}"
                          aria-hidden="true"
                        ></span>
                        <span slot="headline">${p.title||p.convo_id}</span>
                        <span slot="supporting-text">
                          ${tt(p.model)} ·
                          ${p.project||"未关联项目"} ·
                          ${j(p.turn_count)} 步 ·
                          ${J(p.total_tokens)}
                        </span>
                        <span slot="trailing-supporting-text" class="trailing-meta">
                          <span
                            style="color:${v?"inherit":sr(p.ctx_used_pct)};"
                          >
                            Ctx ${_}
                          </span>
                          ${v?N("check"):b}
                        </span>
                      </md-list-item>
                    `})}
                </md-list>
              `}
        </md-outlined-card>
      </div>
    `}};zt.styles=[S`
      :host {
        display: block;
        container-type: inline-size;
      }

      .page-stack {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .settings-card {
        display: block;
        padding: 16px;
        border-radius: var(--tm-radius-md, 16px);
        --md-outlined-card-container-color: var(
          --md-sys-color-surface-container-low
        );
        --md-outlined-card-outline-color: var(--md-sys-color-outline-variant);
        --md-outlined-card-container-shape: var(--tm-radius-md, 16px);
      }

      .section-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
      }

      .section-title-row {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .section-title-row md-icon {
        --md-icon-size: 20px;
        color: var(--md-sys-color-primary);
      }

      .section-title {
        margin: 0;
        font-size: 15px;
        font-weight: 700;
        color: var(--md-sys-color-on-surface);
      }

      .mode-badge {
        display: inline-flex;
        align-items: center;
        padding: 2px 9px;
        border-radius: var(--tm-radius-full, 9999px);
        font-size: 11px;
        font-weight: 700;
        background: var(--md-sys-color-secondary-container);
        color: var(--md-sys-color-on-secondary-container);
      }

      .mode-badge.pinned {
        background: var(--md-sys-color-tertiary-container);
        color: var(--md-sys-color-on-tertiary-container);
      }

      .settings-list {
        --md-list-container-color: transparent;
        padding: 0;
      }

      .setting-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 10px 14px;
        padding: 6px 0;
      }

      .setting-info {
        flex: 1 1 210px;
        min-width: 0;
      }

      .setting-info md-list-item {
        --md-list-item-leading-space: 0px;
        --md-list-item-trailing-space: 0px;
        --md-list-item-top-space: 6px;
        --md-list-item-bottom-space: 6px;
        --md-list-item-container-color: transparent;
      }

      .setting-select {
        flex: 0 1 210px;
        min-width: 170px;
        --md-outlined-select-text-field-container-shape: var(
          --tm-radius-sm,
          12px
        );
        --md-outlined-select-text-field-top-space: 10px;
        --md-outlined-select-text-field-bottom-space: 10px;
      }

      md-divider {
        margin: 4px 0;
        --md-divider-color: var(--md-sys-color-outline-variant);
      }

      .quick-actions-list {
        --md-list-container-color: transparent;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 10px;
      }

      .session-item {
        border-radius: var(--tm-radius-sm, 12px);
        overflow: hidden;
        --md-list-item-container-color: var(--md-sys-color-surface-container);
        --md-list-item-top-space: 8px;
        --md-list-item-bottom-space: 8px;
      }

      .session-item.selected {
        --md-list-item-container-color: var(
          --md-sys-color-secondary-container
        );
        --md-list-item-label-text-color: var(
          --md-sys-color-on-secondary-container
        );
        --md-list-item-supporting-text-color: var(
          --md-sys-color-on-secondary-container
        );
        --md-list-item-trailing-supporting-text-color: var(
          --md-sys-color-on-secondary-container
        );
        --md-list-item-leading-icon-color: var(
          --md-sys-color-on-secondary-container
        );
      }

      .search-box-wrap {
        margin: 10px 0 8px;
      }

      .session-search {
        width: 100%;
        --md-outlined-field-container-shape: var(--tm-radius-sm, 12px);
        --md-outlined-text-field-top-space: 10px;
        --md-outlined-text-field-bottom-space: 10px;
      }

      .session-picker-list {
        --md-list-container-color: transparent;
        padding: 0;
        max-height: 360px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .status-dot {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: var(--md-sys-color-outline);
      }

      .status-dot.active {
        background: var(--tm-status-ok);
      }

      .status-dot.recent {
        background: var(--tm-status-warn);
      }

      .trailing-meta {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-family: var(--tm-font-mono);
        font-size: 11.5px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }

      .trailing-meta md-icon {
        --md-icon-size: 18px;
      }

      .empty-state {
        padding: 20px 12px;
        text-align: center;
        font-size: 12.5px;
        color: var(--md-sys-color-on-surface-variant);
      }

      @container (width < 480px) {
        .setting-row {
          flex-direction: column;
          align-items: stretch;
          gap: 6px;
          padding: 8px 0;
        }

        .setting-info {
          flex: none;
        }

        .setting-select {
          flex: none;
          width: 100%;
          min-width: 0;
        }
      }
    `];Ur([T()],zt.prototype,"settings",2);Ur([T()],zt.prototype,"data",2);Ur([T()],zt.prototype,"sessionSearch",2);zt=Ur([E("settings-page")],zt);k.start();
