"use strict";var e,t=require("react"),r={},n={};var o,s,a={};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function i(){return o||(o=1,"production"!==process.env.NODE_ENV&&function(){var e=t,r=Symbol.for("react.element"),n=Symbol.for("react.portal"),o=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),i=Symbol.for("react.profiler"),c=Symbol.for("react.provider"),u=Symbol.for("react.context"),l=Symbol.for("react.forward_ref"),p=Symbol.for("react.suspense"),d=Symbol.for("react.suspense_list"),f=Symbol.for("react.memo"),y=Symbol.for("react.lazy"),h=Symbol.for("react.offscreen"),m=Symbol.iterator,g="@@iterator";var v=e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;function b(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),n=1;n<t;n++)r[n-1]=arguments[n];!function(e,t,r){var n=v.ReactDebugCurrentFrame,o=n.getStackAddendum();""!==o&&(t+="%s",r=r.concat([o]));var s=r.map((function(e){return String(e)}));s.unshift("Warning: "+t),Function.prototype.apply.call(console[e],console,s)}("error",e,r)}var S,R=!1,k=!1,j=!1,O=!1,_=!1;function w(e){return e.displayName||"Context"}function q(e){if(null==e)return null;if("number"==typeof e.tag&&b("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."),"function"==typeof e)return e.displayName||e.name||null;if("string"==typeof e)return e;switch(e){case o:return"Fragment";case n:return"Portal";case i:return"Profiler";case s:return"StrictMode";case p:return"Suspense";case d:return"SuspenseList"}if("object"==typeof e)switch(e.$$typeof){case u:return w(e)+".Consumer";case c:return w(e._context)+".Provider";case l:return function(e,t,r){var n=e.displayName;if(n)return n;var o=t.displayName||t.name||"";return""!==o?r+"("+o+")":r}(e,e.render,"ForwardRef");case f:var t=e.displayName||null;return null!==t?t:q(e.type)||"Memo";case y:var r=e,a=r._payload,h=r._init;try{return q(h(a))}catch(e){return null}}return null}S=Symbol.for("react.module.reference");var P,T,E,$,x,D,C,U=Object.assign,L=0;function N(){}N.__reactDisabledLog=!0;var I,F=v.ReactCurrentDispatcher;function A(e,t,r){if(void 0===I)try{throw Error()}catch(e){var n=e.stack.trim().match(/\n( *(at )?)/);I=n&&n[1]||""}return"\n"+I+e}var B,M=!1,W="function"==typeof WeakMap?WeakMap:Map;function z(e,t){if(!e||M)return"";var r,n=B.get(e);if(void 0!==n)return n;M=!0;var o,s=Error.prepareStackTrace;Error.prepareStackTrace=void 0,o=F.current,F.current=null,function(){if(0===L){P=console.log,T=console.info,E=console.warn,$=console.error,x=console.group,D=console.groupCollapsed,C=console.groupEnd;var e={configurable:!0,enumerable:!0,value:N,writable:!0};Object.defineProperties(console,{info:e,log:e,warn:e,error:e,group:e,groupCollapsed:e,groupEnd:e})}L++}();try{if(t){var a=function(){throw Error()};if(Object.defineProperty(a.prototype,"props",{set:function(){throw Error()}}),"object"==typeof Reflect&&Reflect.construct){try{Reflect.construct(a,[])}catch(e){r=e}Reflect.construct(e,[],a)}else{try{a.call()}catch(e){r=e}e.call(a.prototype)}}else{try{throw Error()}catch(e){r=e}e()}}catch(t){if(t&&r&&"string"==typeof t.stack){for(var i=t.stack.split("\n"),c=r.stack.split("\n"),u=i.length-1,l=c.length-1;u>=1&&l>=0&&i[u]!==c[l];)l--;for(;u>=1&&l>=0;u--,l--)if(i[u]!==c[l]){if(1!==u||1!==l)do{if(u--,--l<0||i[u]!==c[l]){var p="\n"+i[u].replace(" at new "," at ");return e.displayName&&p.includes("<anonymous>")&&(p=p.replace("<anonymous>",e.displayName)),"function"==typeof e&&B.set(e,p),p}}while(u>=1&&l>=0);break}}}finally{M=!1,F.current=o,function(){if(0==--L){var e={configurable:!0,enumerable:!0,writable:!0};Object.defineProperties(console,{log:U({},e,{value:P}),info:U({},e,{value:T}),warn:U({},e,{value:E}),error:U({},e,{value:$}),group:U({},e,{value:x}),groupCollapsed:U({},e,{value:D}),groupEnd:U({},e,{value:C})})}L<0&&b("disabledDepth fell below zero. This is a bug in React. Please file an issue.")}(),Error.prepareStackTrace=s}var d=e?e.displayName||e.name:"",f=d?A(d):"";return"function"==typeof e&&B.set(e,f),f}function J(e,t,r){if(null==e)return"";if("function"==typeof e)return z(e,!(!(n=e.prototype)||!n.isReactComponent));var n;if("string"==typeof e)return A(e);switch(e){case p:return A("Suspense");case d:return A("SuspenseList")}if("object"==typeof e)switch(e.$$typeof){case l:return z(e.render,!1);case f:return J(e.type,t,r);case y:var o=e,s=o._payload,a=o._init;try{return J(a(s),t,r)}catch(e){}}return""}B=new W;var Y=Object.prototype.hasOwnProperty,V={},H=v.ReactDebugCurrentFrame;function G(e){if(e){var t=e._owner,r=J(e.type,e._source,t?t.type:null);H.setExtraStackFrame(r)}else H.setExtraStackFrame(null)}var X=Array.isArray;function K(e){return X(e)}function Q(e){return""+e}function Z(e){if(function(e){try{return Q(e),!1}catch(e){return!0}}(e))return b("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.",function(e){return"function"==typeof Symbol&&Symbol.toStringTag&&e[Symbol.toStringTag]||e.constructor.name||"Object"}(e)),Q(e)}var ee,te,re,ne=v.ReactCurrentOwner,oe={key:!0,ref:!0,__self:!0,__source:!0};re={};var se=function(e,t,n,o,s,a,i){var c={$$typeof:r,type:e,key:t,ref:n,props:i,_owner:a,_store:{}};return Object.defineProperty(c._store,"validated",{configurable:!1,enumerable:!1,writable:!0,value:!1}),Object.defineProperty(c,"_self",{configurable:!1,enumerable:!1,writable:!1,value:o}),Object.defineProperty(c,"_source",{configurable:!1,enumerable:!1,writable:!1,value:s}),Object.freeze&&(Object.freeze(c.props),Object.freeze(c)),c};function ae(e,t,r,n,o){var s,a={},i=null,c=null;for(s in void 0!==r&&(Z(r),i=""+r),function(e){if(Y.call(e,"key")){var t=Object.getOwnPropertyDescriptor(e,"key").get;if(t&&t.isReactWarning)return!1}return void 0!==e.key}(t)&&(Z(t.key),i=""+t.key),function(e){if(Y.call(e,"ref")){var t=Object.getOwnPropertyDescriptor(e,"ref").get;if(t&&t.isReactWarning)return!1}return void 0!==e.ref}(t)&&(c=t.ref,function(e,t){if("string"==typeof e.ref&&ne.current&&t&&ne.current.stateNode!==t){var r=q(ne.current.type);re[r]||(b('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref',q(ne.current.type),e.ref),re[r]=!0)}}(t,o)),t)Y.call(t,s)&&!oe.hasOwnProperty(s)&&(a[s]=t[s]);if(e&&e.defaultProps){var u=e.defaultProps;for(s in u)void 0===a[s]&&(a[s]=u[s])}if(i||c){var l="function"==typeof e?e.displayName||e.name||"Unknown":e;i&&function(e,t){var r=function(){ee||(ee=!0,b("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)",t))};r.isReactWarning=!0,Object.defineProperty(e,"key",{get:r,configurable:!0})}(a,l),c&&function(e,t){var r=function(){te||(te=!0,b("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)",t))};r.isReactWarning=!0,Object.defineProperty(e,"ref",{get:r,configurable:!0})}(a,l)}return se(e,i,c,o,n,ne.current,a)}var ie,ce=v.ReactCurrentOwner,ue=v.ReactDebugCurrentFrame;function le(e){if(e){var t=e._owner,r=J(e.type,e._source,t?t.type:null);ue.setExtraStackFrame(r)}else ue.setExtraStackFrame(null)}function pe(e){return"object"==typeof e&&null!==e&&e.$$typeof===r}function de(){if(ce.current){var e=q(ce.current.type);if(e)return"\n\nCheck the render method of `"+e+"`."}return""}ie=!1;var fe={};function ye(e,t){if(e._store&&!e._store.validated&&null==e.key){e._store.validated=!0;var r=function(e){var t=de();if(!t){var r="string"==typeof e?e:e.displayName||e.name;r&&(t="\n\nCheck the top-level render call using <"+r+">.")}return t}(t);if(!fe[r]){fe[r]=!0;var n="";e&&e._owner&&e._owner!==ce.current&&(n=" It was passed a child from "+q(e._owner.type)+"."),le(e),b('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.',r,n),le(null)}}}function he(e,t){if("object"==typeof e)if(K(e))for(var r=0;r<e.length;r++){var n=e[r];pe(n)&&ye(n,t)}else if(pe(e))e._store&&(e._store.validated=!0);else if(e){var o=function(e){if(null===e||"object"!=typeof e)return null;var t=m&&e[m]||e[g];return"function"==typeof t?t:null}(e);if("function"==typeof o&&o!==e.entries)for(var s,a=o.call(e);!(s=a.next()).done;)pe(s.value)&&ye(s.value,t)}}function me(e){var t,r=e.type;if(null!=r&&"string"!=typeof r){if("function"==typeof r)t=r.propTypes;else{if("object"!=typeof r||r.$$typeof!==l&&r.$$typeof!==f)return;t=r.propTypes}if(t){var n=q(r);!function(e,t,r,n,o){var s=Function.call.bind(Y);for(var a in e)if(s(e,a)){var i=void 0;try{if("function"!=typeof e[a]){var c=Error((n||"React class")+": "+r+" type `"+a+"` is invalid; it must be a function, usually from the `prop-types` package, but received `"+typeof e[a]+"`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");throw c.name="Invariant Violation",c}i=e[a](t,a,n,r,null,"SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED")}catch(e){i=e}!i||i instanceof Error||(G(o),b("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).",n||"React class",r,a,typeof i),G(null)),i instanceof Error&&!(i.message in V)&&(V[i.message]=!0,G(o),b("Failed %s type: %s",r,i.message),G(null))}}(t,e.props,"prop",n,e)}else if(void 0!==r.PropTypes&&!ie){ie=!0,b("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?",q(r)||"Unknown")}"function"!=typeof r.getDefaultProps||r.getDefaultProps.isReactClassApproved||b("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.")}}function ge(e,t,n,a,m,g){var v=function(e){return"string"==typeof e||"function"==typeof e||!!(e===o||e===i||_||e===s||e===p||e===d||O||e===h||R||k||j)||"object"==typeof e&&null!==e&&(e.$$typeof===y||e.$$typeof===f||e.$$typeof===c||e.$$typeof===u||e.$$typeof===l||e.$$typeof===S||void 0!==e.getModuleId)}(e);if(!v){var w="";(void 0===e||"object"==typeof e&&null!==e&&0===Object.keys(e).length)&&(w+=" You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");var P,T=function(e){return void 0!==e?"\n\nCheck your code at "+e.fileName.replace(/^.*[\\\/]/,"")+":"+e.lineNumber+".":""}(m);w+=T||de(),null===e?P="null":K(e)?P="array":void 0!==e&&e.$$typeof===r?(P="<"+(q(e.type)||"Unknown")+" />",w=" Did you accidentally export a JSX literal instead of a component?"):P=typeof e,b("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",P,w)}var E=ae(e,t,n,m,g);if(null==E)return E;if(v){var $=t.children;if(void 0!==$)if(a)if(K($)){for(var x=0;x<$.length;x++)he($[x],e);Object.freeze&&Object.freeze($)}else b("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");else he($,e)}return e===o?function(e){for(var t=Object.keys(e.props),r=0;r<t.length;r++){var n=t[r];if("children"!==n&&"key"!==n){le(e),b("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.",n),le(null);break}}null!==e.ref&&(le(e),b("Invalid attribute `ref` supplied to `React.Fragment`."),le(null))}(E):me(E),E}var ve=function(e,t,r){return ge(e,t,r,!1)},be=function(e,t,r){return ge(e,t,r,!0)};a.Fragment=o,a.jsx=ve,a.jsxs=be}()),a}s={get exports(){return r},set exports(e){r=e}},"production"===process.env.NODE_ENV?s.exports=function(){if(e)return n;e=1;var r=t,o=Symbol.for("react.element"),s=Symbol.for("react.fragment"),a=Object.prototype.hasOwnProperty,i=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,c={key:!0,ref:!0,__self:!0,__source:!0};function u(e,t,r){var n,s={},u=null,l=null;for(n in void 0!==r&&(u=""+r),void 0!==t.key&&(u=""+t.key),void 0!==t.ref&&(l=t.ref),t)a.call(t,n)&&!c.hasOwnProperty(n)&&(s[n]=t[n]);if(e&&e.defaultProps)for(n in t=e.defaultProps)void 0===s[n]&&(s[n]=t[n]);return{$$typeof:o,type:e,key:u,ref:l,props:s,_owner:i.current}}return n.Fragment=s,n.jsx=u,n.jsxs=u,n}():s.exports=i();const c=t.createContext({storedData:{}}),u=({children:e})=>{const[n,o]=t.useState({}),[s,a]=t.useState(0);return r.jsx(c.Provider,{value:{storedData:n,requestUpdate:s,setRequestUpdate:a,setStoredData:o},children:e})},l=t.createContext({loading:!1}),p=({children:e,...t})=>r.jsx(l.Provider,{value:t,children:e}),d=(e,t,r)=>{Object.entries(t).forEach((([t,n])=>{const o=r?`${r}[${t}]`:t;n instanceof FileList?f(e,n,o):n instanceof File||n instanceof Blob?e.append(o,n):"object"==typeof n?d(e,n,o):e.append(o,n)}))},f=(e,t,r)=>{for(let n=0;n<t.length;n++)e.append(r,t.item(n))},y=(e,t)=>{if("object"!=typeof e)return String(e)===String(t);if([e,t].includes(null))return e===t;if(Object.keys(e).length!==Object.keys(t).length)return!1;for(const[r,n]of Object.entries(e))if(!y(n,t[r]))return!1;return!0},h=e=>Object.keys(e).reduce(((t,r)=>("object"!=typeof e[r]||Array.isArray(e[r])||(t[r]=h(e[r])),void 0!==e[r]&&""!==e[r]&&null!==e[r]&&(t[r]=e[r]),t)),{}),m=(e,t,r)=>`${!0===r&&t||!1!==r&&(e=>{try{return new URL(e),!1}catch(e){return!0}})(e)?g(e,t):e}`,g=(e,t)=>("/"===t?.charAt(t?.length-1)?t:`${t}/`)+("/"===e.charAt(0)?e.substring(1):e),v=(e,t,r)=>fetch(`${e.url}${(e=>{if(!e)return"";const t=e=>`${e}=`;return Object.keys(e||{}).reduce(((r,n,o)=>{const s="object"==typeof e[n]?t(n)+JSON.stringify(h(e[n])):void 0===e[n]||""===e[n]||null===e[n]?"":t(n)+e[n];return`${r}${o&&s?"&":""}${s}`}),"?")})(e.queryParams)}`,{headers:e.headers,method:e.method,...b("mode",t),...b("cache",t),...b("window",t),...b("redirect",t),...b("referrer",t),...b("integrity",t),...b("keepalive",t),...b("signal",r),...b("credentials",t),...b("referrerPolicy",t),body:e.body instanceof Blob||"string"==typeof e.body||ArrayBuffer.isView(e.body)||e.body instanceof FormData||e.body instanceof ArrayBuffer||e.body instanceof URLSearchParams?e.body:e.body&&JSON.stringify(e.body)}),b=(e,t)=>void 0!==t?.[e]&&{[e]:t[e]},S={loading:!1,error:!1,success:!1,data:null,message:"",status:null},R=(e,t=!1)=>({value:e,writable:t,enumerable:!0}),k="react-http-request",j=(e,t,r)=>{const n=`${k}-${r||e}`,o=t?.[n];return void 0!==o?o:O(r??"",e)??_(r??"",e)},O=(e,t="")=>{const r=sessionStorage.getItem(`${k}-${e||t}`);return w(r)},_=(e,t="")=>{const r=localStorage.getItem(`${k}-${e||t}`);return w(r)},w=e=>{if(null!==e)return JSON.parse(e)};class q{dependency={stateData:{}};responsePayload={...S};retryCount=1;constructor(e){this.setRequestState=e}setDependency(e){this.dependency={...this.dependency,...e}}isLoading(){this.responsePayload={...this.responsePayload,loading:!0}}get requestMethod(){return this.dependency.method||(this.dependency.body||this.dependency.formData?"POST":"GET")}get requestUrl(){return m(this.dependency.path??"",this.dependency.baseUrl||this.dependency.appLevelBaseUrl,this.dependency.isRelative)}get requestHeader(){const[e,t]=((e,t,r)=>{const n={},o=Object.keys(r||{}),s=!!o.length&&(o.length>1||"append"!==o[0]);return s?[{...r},s]:(Object.assign(n,{"Content-Type":"application/json",...r?.append}),e&&t&&Object.assign(n,{Authorization:`Bearer ${t}`}),[n,s])})(this.dependency.bearer??!0,this.dependency.authToken,this.dependency.header);return!t&&this.dependency.formData&&delete e["Content-Type"],e}get requestPayload(){const e=this.dependency.formData&&(e=>{const t=new FormData;return d(t,e),t})(this.dependency.formData);return{headers:this.requestHeader,method:this.requestMethod,queryParams:this.dependency.query,url:this.requestUrl,body:e??this.dependency.body}}async getResponse(e){const t=JSON.parse(await e.text()||"{}");return Object.defineProperties({},{url:R(this.requestUrl),method:R(this.requestMethod),status:R(e.status),data:R(t,!0),queryParams:R(this.dependency.query)})}setSuccessResponse(e,t=""){this.responsePayload={...this.responsePayload,data:e,message:this.dependency.successMessage||e.message||t,loading:!1,success:!0,error:!1},this.setRequestState((e=>(Object.assign(e,{0:this.responsePayload}),e))),this.dependency.dispatchLoadingState?.(!1),this.dependency.dispatchSuccessRequest?.(e),this.dependency.onSuccess?.(e)}setErrorResponse(e,t=""){this.responsePayload={...this.responsePayload,data:e,message:this.dependency.errorMessage||e?.error||e?.message||e?.error?.message||e?.error?.error||t,loading:!1,success:!1,error:!0},this.setRequestState((e=>(Object.assign(e,{0:this.responsePayload}),e))),this.dependency.dispatchLoadingState?.(!1),this.dependency.dispatchErrorRequest?.(e),this.dependency.onError?.(e)}async initRequest(){try{if(this.dependency.dispatchLoadingState?.(!0),this.isLoading(),!this.dependency.forceRefetch){const e=j(this.requestUrl,this.dependency.stateData,this.dependency.name);if(e&&y(e.queryParam,this.dependency.query))return void this.setSuccessResponse(e.data)}let e=this.requestPayload;e=this.dependency.appLevelInterceptor?.request?.(e)??e,e=this.dependency.interceptors?.request?.(e)??e;const{controller:t,timeoutRef:r}=(e=>{if(!e)return;const t=new AbortController,r=setTimeout((()=>t.abort()),e);return{controller:t,timeoutRef:r}})(this.dependency.timeout??this.dependency.appLevelTimeout)??{},n=await v(e,this.dependency,t);r&&clearTimeout(r);const o=await this.getResponse(n);if(o.data=this.dependency.appLevelInterceptor?.response?.(o)?.data??o?.data,o.data=this.dependency.interceptors?.response?.(o)?.data??o?.data,n.ok){const t={name:this.dependency.name,url:e.url,value:{data:o.data,queryParam:e.queryParams}};this.dependency.memoryStorage&&this.dependency.setStateData&&((e,t)=>{const r=`${k}-${e.name||e.url}`;t((t=>({...t,[r]:e.value})))})(t,this.dependency.setStateData),this.dependency.sessionStorage&&(e=>{const t=`${k}-${e.name||e.url}`;sessionStorage.setItem(t,JSON.stringify(e.value))})(t),this.dependency.localStorage&&(e=>{const t=`${k}-${e.name||e.url}`;localStorage.setItem(t,JSON.stringify(e.value))})(t),this.dependency.setRequestUpdate?.((e=>++e)),this.setSuccessResponse(o.data,n.statusText)}else this.setErrorResponse(o)}catch(e){this.retryCount>1&&(this.retryCount=--this.retryCount,await this.initRequest()),this.setErrorResponse(e,"An error occur.")}}async makeRequest(e,t){return this.responsePayload.loading||(this.dependency={...this.dependency,...t,path:e},this.retryCount=t?.retries||this.retryCount,await this.initRequest()),this.responsePayload.data}}const P=8,T=t.createContext({});exports.RequestProvider=({children:e,...n})=>{const[o,s]=t.useState(n.baseUrl),[a,i]=t.useState(n.authToken||""),[c,l]=t.useState(!1),[d,f]=t.useState(),[y,h]=t.useState(),[m,g]=t.useState();return r.jsx(T.Provider,{value:{baseUrl:o,setBaseUrl:s,authToken:a,setAuthToken:i,loading:c},children:r.jsx(u,{children:r.jsx(p,{loading:c,baseUrl:o,authToken:a,setBaseUrl:s,setAuthToken:i,requestTimeout:n?.requestTimeout,dispatchLoadingState:function(e){l(e);const t=n?.onLoading?.(e)??void 0;g(e?t:void 0)},dispatchErrorRequest:function(e){const t=n?.onError?.(e)??void 0;h(t),t&&setTimeout((()=>h(void 0)),1e3*(n.popupTimeout||P))},dispatchSuccessRequest:function(e){const t=n?.onSuccess?.(e)??void 0;f(t),t&&setTimeout((()=>f(void 0)),1e3*(n.popupTimeout||P))},requestInterceptor:n?.interceptors?.request,responseInterceptor:n?.interceptors?.response,children:r.jsxs(r.Fragment,{children:[y&&y,d&&d,m&&m,e]})})})})},exports.useRequest=e=>{const[r,n]=t.useState([S,async()=>null]),o=t.useMemo((()=>{const e=new q(n);return Object.assign(r,{1:e.makeRequest.bind(e)}),e}),[]),{baseUrl:s,authToken:a,requestTimeout:i,dispatchErrorRequest:u,dispatchLoadingState:p,dispatchSuccessRequest:d,requestInterceptor:f,responseInterceptor:y}=t.useContext(l),{setStoredData:h,storedData:m,setRequestUpdate:g}=t.useContext(c),{localStorage:v,sessionStorage:b,memoryStorage:R,name:k,interceptors:j}=e||{};return t.useEffect((()=>{o.setDependency({...e,appLevelBaseUrl:s,appLevelTimeout:i,authToken:a,dispatchErrorRequest:u,dispatchLoadingState:p,dispatchSuccessRequest:d,setStateData:h,stateData:m,setRequestUpdate:g,appLevelInterceptor:{request:f,response:y}})}),[k,s,a,m,j,v,R,b,i,g,u,p,d,f,y]),t.useEffect((()=>{e?.onMount?.(o.makeRequest.bind(o))}),[]),r},exports.useRequestConfig=()=>{const{setAuthToken:e,setBaseUrl:r,loading:n}=t.useContext(l);return{setAuthToken:e,setBaseUrl:r,loading:n}},exports.useRequestData=(e,r)=>{const[n,o]=t.useState(),{storedData:s,requestUpdate:a}=t.useContext(c);return t.useEffect((()=>{o("session"===r?O(e)?.data:"local"===r?_(e)?.data:"memory"===r?s?.[`${k}-${e}`]:j("",s,e)?.data)}),[e,r,s,a]),n};
//# sourceMappingURL=index.js.map
