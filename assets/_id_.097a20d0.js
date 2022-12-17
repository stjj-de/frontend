import{d as b,J as h,b as s,o as r,c as f,h as c,i as y,k as o,K as D,f as N,a as l,t as u,F as g,L as F,p as V}from"./vendor.c570416c.js";import{_ as S}from"./NotFound.19504997.js";import{_ as x}from"./YouTubeEmbed.a33ae5db.js";import{D as w,g as E}from"./DocumentRendered.94f0d11b.js";import"./index.d49855d4.js";var m={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"ID"}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"video"},arguments:[{kind:"Argument",name:{kind:"Name",value:"where"},value:{kind:"ObjectValue",fields:[{kind:"ObjectField",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}]}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"title"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"youtubeVideoId"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"publicationDate"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"description"},arguments:[],directives:[]}]}}]}}],loc:{start:0,end:140}};m.loc.source={body:`query ($id: ID!) {
    video(where: { id: $id }) {
        title
        youtubeVideoId
        publicationDate
        description
    }
}
`,name:"GraphQL request",locationOffset:{line:1,column:1}};function d(i,e){if(i.kind==="FragmentSpread")e.add(i.name.value);else if(i.kind==="VariableDefinition"){var n=i.type;n.kind==="NamedType"&&e.add(n.name.value)}i.selectionSet&&i.selectionSet.selections.forEach(function(a){d(a,e)}),i.variableDefinitions&&i.variableDefinitions.forEach(function(a){d(a,e)}),i.definitions&&i.definitions.forEach(function(a){d(a,e)})}var I={};(function(){m.definitions.forEach(function(e){if(e.name){var n=new Set;d(e,n),I[e.name.value]=n}})})();const T={key:1},q={class:"flex flex-col-reverse items-start"},B={class:"font-serif font-bold font-serif text-8 pt-6"},O={class:"mb-6 mt-3 text-4"},G=b({__name:"[id]",async setup(i){let e,n;const a=new Intl.DateTimeFormat("de-DE",{day:"numeric",month:"long",year:"numeric"}),v=F(),{data:k}=([e,n]=h(()=>V({query:m,variables:{id:v.params.id}})),e=await e,n(),e),t=s(()=>k.value.video),p=s(()=>E(t.value===null?"Nicht gefunden":t.value.title)),_=s(()=>t.value===null?null:a.format(new Date(t.value.publicationDate)));return(R,$)=>(r(),f(g,null,[c(o(D),null,{default:y(()=>[l("title",null,u(o(p)),1)]),_:1}),o(t)===null?(r(),N(S,{key:0,resource:"Dieses Video"})):(r(),f("main",T,[l("div",q,[l("h1",B,[l("span",null,u(o(t).title),1)]),c(x,{"video-id":o(t).youtubeVideoId},null,8,["video-id"])]),l("div",O," Ver\xF6ffentlicht am "+u(o(_)),1),c(w,{data:o(t).description.document,"increment-headings":1},null,8,["data"])]))],64))}});export{G as default};
