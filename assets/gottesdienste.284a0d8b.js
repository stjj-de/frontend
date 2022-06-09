import{o as s,c as a,a as e,d as l,i as r,j as D,J as V,k as w,l as _,g as f,F as p,f as L,t as c,h as u}from"./vendor.00367f31.js";import{Y as Z}from"./YouTubeEmbed.2a54ba11.js";import{_ as k,l as F,a as N}from"./index.260f8263.js";import{D as H,g as M}from"./Document.e41297b3.js";var h={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"churchServiceDates"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"shortDescription"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"date"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"livestreamPlanned"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"longDescription"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"document"},arguments:[{kind:"Argument",name:{kind:"Name",value:"hydrateRelationships"},value:{kind:"BooleanValue",value:!0}}],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"church"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"location"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:256}};h.loc.source={body:`query  {
    churchServiceDates {
        shortDescription
        date
        livestreamPlanned
        longDescription {
            document(hydrateRelationships: true)
        }
        church {
            name
            location
        }
    }
}
`,name:"GraphQL request",locationOffset:{line:1,column:1}};function m(t,n){if(t.kind==="FragmentSpread")n.add(t.name.value);else if(t.kind==="VariableDefinition"){var d=t.type;d.kind==="NamedType"&&n.add(d.name.value)}t.selectionSet&&t.selectionSet.selections.forEach(function(i){m(i,n)}),t.variableDefinitions&&t.variableDefinitions.forEach(function(i){m(i,n)}),t.definitions&&t.definitions.forEach(function(i){m(i,n)})}var E={};(function(){h.definitions.forEach(function(n){if(n.name){var d=new Set;m(n,d),E[n.name.value]=d}})})();const $={preserveAspectRatio:"xMidYMid meet",viewBox:"0 0 15 15",width:"1.2em",height:"1.2em"},I=e("path",{fill:"currentColor",d:"M8 1V.5H7V1h1ZM7 4.5V5h1v-.5H7Zm1 6V10H7v.5h1ZM7 14v.5h1V14H7ZM4.5 7.995H5v-1h-.5v1Zm-3.5-1H.5v1H1v-1ZM14 8h.5V7H14v1Zm-3.5-1.005H10v1h.5v-1ZM7 1v3.5h1V1H7Zm0 9.5V14h1v-3.5H7ZM4.5 6.995H1v1h3.5v-1ZM14 7l-3.5-.005v1L14 8V7ZM2.147 2.854l3 3l.708-.708l-3-3l-.708.708Zm10-.708l-3 3l.708.708l3-3l-.708-.708ZM2.854 12.854l3-3l-.708-.708l-3 3l.708.708Zm6.292-3l3 3l.708-.708l-3-3l-.708.708Z"},null,-1),T=[I];function j(t,n){return s(),a("svg",$,T)}var R={name:"teenyicons-loader-outline",render:j};const B={name:"LoadingSpinner",components:{LoaderIcon:R}},Y={class:"flex items-center"};function q(t,n,d,i,g,x){const v=l("LoaderIcon");return s(),a("div",Y,[r(v,{class:"animate-spin mr-2 relative top-1px"}),e("div",null,[D(t.$slots,"default")])])}var C=k(B,[["render",q]]);const G=new Intl.DateTimeFormat("de-DE",{weekday:"short",day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"}),P={name:"GottesdienstePage",components:{Document:H,LoadingSpinner:C,YouTubeEmbed:Z},async setup(){V({title:M("Gottesdienste")});const{data:t}=await w({query:h});return{data:t,formatDate:n=>G.format(new Date(n)),liveVideoId:F,liveStatusLoading:N}}},z={class:"space-y-10"},A=e("h1",{class:"section-heading"},[e("span",null,"Live \u{1F440}")],-1),O={class:"relative"},Q={key:0,class:"text-5 leading-6 sm:text-6 sm:leading-8 pb-4"},W=u(" Wenn wir live sind, kannst du es dir hier\xA0anschauen."),J=e("br",null,null,-1),K=u(" Die\xA0Seite aktualisiert sich\xA0automatisch. "),U=[W,J,K],X={key:1},ee=u(" Live-Status wird abgerufen "),te={key:0,class:"text-5"},ne=e("div",{class:"block pb-2"}," Zurzeit ist kein Livestream verf\xFCgbar. ",-1),ie=u(" \u27A1\uFE0F Vergangene Livestreams anzeigen "),se={key:1,class:"mb-10"},ae=e("h1",{class:"section-heading"},[e("span",null,"Gottesdienste \u{1F514}")],-1),oe={class:"flex flex-col justify-start space-y-8"},de={class:"flex flex-col justify-center"},ce={class:"font-bold text-5 sm:text-7 -md:-mt-3 -md:mb-1"},le={class:"md:hidden text-orange-500 text-3 sm:text-4 leading-4 whitespace-nowrap"},re={class:"text-4 -md:mt-4"},me={key:0,class:"text-red-500 text-3"},ue={class:"flex-shrink-0 md:ml-4 flex flex-col justify-center md:items-end -md:mb-2"},ve={class:"text-6 sm:text-7"},he={class:"-md:hidden text-orange-500 text-4 leading-5 whitespace-nowrap"};function _e(t,n,d,i,g,x){const v=l("LoadingSpinner"),S=l("router-link"),y=l("YouTubeEmbed"),b=l("Document");return s(),a("main",z,[e("section",null,[A,e("div",O,[i.liveVideoId===null?(s(),a("p",Q,U)):_("",!0),i.liveStatusLoading?(s(),a("div",X,[r(v,{class:"text-4"},{default:f(()=>[ee]),_:1})])):(s(),a(p,{key:2},[i.liveVideoId===null?(s(),a("div",te,[ne,r(S,{class:"link font-bold",to:"/mediathek"},{default:f(()=>[ie]),_:1})])):(s(),a("div",se,[r(y,{"video-id":i.liveVideoId},null,8,["video-id"])]))],64))])]),e("section",null,[ae,e("div",oe,[(s(!0),a(p,null,L(i.data.churchServiceDates,o=>(s(),a("div",{key:o.id,class:"border border-gray-200 shadow-sm rounded-md p-5 flex justify-start justify-between -md:flex-col-reverse relative"},[e("div",de,[e("div",ce,c(o.shortDescription),1),e("div",le,c(o.church.name)+" ("+c(o.church.location)+") ",1),e("div",re,[r(b,{data:o.longDescription.document},null,8,["data"]),o.livestreamPlanned?(s(),a("div",me," Wird im Livestream \xFCbertragen werden. ")):_("",!0)])]),e("div",ue,[e("div",ve,c(i.formatDate(o.date)),1),e("div",he,c(o.church.name)+" ("+c(o.church.location)+") ",1)])]))),128))])])])}var xe=k(P,[["render",_e]]);export{xe as default};
