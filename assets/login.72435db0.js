import{d as f,R as w,U as N,V as $,k,o as d,c as v,W as h,a as o,t as D,h as m,f as U,x as q,q as B,l as C,n as u,r as g,X as F,b as R,A as T,i as A,Y as M,Z as O,j as P}from"./vendor.0083fde3.js";import{_ as E,f as L,c as W}from"./index.30b79537.js";var _={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"username"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"password"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"authenticateUserWithPassword"},arguments:[{kind:"Argument",name:{kind:"Name",value:"username"},value:{kind:"Variable",name:{kind:"Name",value:"username"}}},{kind:"Argument",name:{kind:"Name",value:"password"},value:{kind:"Variable",name:{kind:"Name",value:"password"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"__typename"},arguments:[],directives:[]}]}}]}}],loc:{start:0,end:146}};_.loc.source={body:`mutation($username: String!, $password: String!) {
  authenticateUserWithPassword(username: $username, password: $password) {
    __typename
  }
}`,name:"GraphQL request",locationOffset:{line:1,column:1}};function p(e,a){if(e.kind==="FragmentSpread")a.add(e.name.value);else if(e.kind==="VariableDefinition"){var n=e.type;n.kind==="NamedType"&&a.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(t){p(t,a)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(t){p(t,a)}),e.definitions&&e.definitions.forEach(function(t){p(t,a)})}var j={};(function(){_.definitions.forEach(function(a){if(a.name){var n=new Set;p(a,n),j[a.name.value]=n}})})();const z=["type"],I=f({__name:"TextInput",props:{modelValue:{type:String,required:!0},type:{type:String,default:"text"}},emits:["update:modelValue"],setup(e,{emit:a}){const t=w(e,"modelValue",a);return(c,i)=>N((d(),v("input",{"onUpdate:modelValue":i[0]||(i[0]=s=>h(t)?t.value=s:null),class:"shadow-sm focus:shadow-md border-1 border-gray-200 rounded-lg p-2 transition duration-200 ease focus:outline-none focus-visible:border-yellow-500",type:e.type},null,8,z)),[[$,k(t)]])}}),G={class:"flex flex-col gap-0.5"},V=f({__name:"TextField",props:{label:{type:String,required:!0},modelValue:{type:String,required:!0},type:{type:String,default:"text"}},emits:["update:modelValue"],setup(e,{emit:a}){const t=w(e,"modelValue",a);return(c,i)=>(d(),v("label",G,[o("span",null,D(e.label),1),m(I,{modelValue:k(t),"onUpdate:modelValue":i[0]||(i[0]=s=>h(t)?t.value=s:null)},null,8,["modelValue"])]))}}),K="_button_xifgq_1",Q="_loadingOverlay_xifgq_20",X="_slot_xifgq_42",Y="_spinner_xifgq_60",Z="_spin_xifgq_60";var H={button:K,loadingOverlay:Q,slot:X,spinner:Y,spin:Z};const J=["type","disabled","data-t","data-loading"],ee=f({__name:"SButton",props:{t:{type:String,default:"primary"},icon:{type:Object},isSubmit:Boolean,isLoading:Boolean,isDisabled:Boolean},emits:["click"],setup(e,{emit:a}){return(n,t)=>(d(),v("button",{class:u(n.$style.button),type:e.isSubmit?"submit":"button",disabled:e.isDisabled||e.isLoading,"data-t":e.t,"data-loading":e.isLoading,onClick:t[0]||(t[0]=c=>a("click"))},[e.icon?(d(),U(q(e.icon),{key:0})):B("",!0),o("span",{class:u(n.$style.slot)},[C(n.$slots,"default")],2),o("span",{class:u(n.$style.loadingOverlay)},[o("span",{class:u(n.$style.spinner)},null,2)],2)],10,J))}}),ae={$style:H};var te=E(ee,[["__cssModules",ae]]);const ne={class:"flex items-center justify-center"},ie=["onSubmit"],se=o("h1",{class:"font-bold text-2xl pb-1"},"Anmelden",-1),le=P("Anmelden"),ue=f({__name:"login",setup(e){const a=g(""),n=g(""),{executeMutation:t,data:c}=F(_),i=R(()=>{var r,l;return((l=(r=c.value)==null?void 0:r.authenticateUserWithPassword)==null?void 0:l.__typename)==="UserAuthenticationWithPasswordFailure"}),s=g(!1),y=O();T(W,async()=>{s.value=!0,await x()},{immediate:!0});async function S(){s.value=!0,await t({username:a.value,password:n.value}),i.value?s.value=!1:L(!0)}async function x(){const r=y.currentRoute.value.query.next;r===void 0?await y.replace("/"):await y.replace(decodeURI(r))}return(r,l)=>(d(),v("div",ne,[o("form",{class:"w-80 flex flex-col gap-3",onSubmit:M(S,["prevent"])},[se,o("div",{class:u(["p-4 mb-1 border-1 border-red-600",{hidden:!k(i)}])}," Diese Kombination aus Benutzername und Passwort ist ung\xFCltig. ",2),m(V,{modelValue:a.value,"onUpdate:modelValue":l[0]||(l[0]=b=>a.value=b),label:"Benutzername"},null,8,["modelValue"]),m(V,{modelValue:n.value,"onUpdate:modelValue":l[1]||(l[1]=b=>n.value=b),label:"Passwort"},null,8,["modelValue"]),m(te,{class:"self-end",t:"secondary","is-submit":"","is-loading":s.value,onClick:S},{default:A(()=>[le]),_:1},8,["is-loading"])],40,ie)]))}});export{ue as default};