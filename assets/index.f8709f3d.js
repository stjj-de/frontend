import{o as l,c as o,a as e,r as N,K as B,L as D,b,d as c,G as A,n as f,i as r,J as R,l as z,g as v,F as k,f as g,h as _,e as w,t as d}from"./vendor.824b72fc.js";import{_ as F,b as C,g as O}from"./index.c4fb3581.js";import{U as $}from"./UploadedImage.adcc467f.js";import{D as E,U}from"./Document.7810326d.js";var S={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"settingsSingletons"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"homePageLinks"},arguments:[{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"ListValue",values:[{kind:"ObjectValue",fields:[{kind:"ObjectField",name:{kind:"Name",value:"priority"},value:{kind:"EnumValue",value:"asc"}}]}]}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"url"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"text"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"emoji"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"acolyteSchedule"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"url"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"pastors"},arguments:[{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"ListValue",values:[{kind:"ObjectValue",fields:[{kind:"ObjectField",name:{kind:"Name",value:"priority"},value:{kind:"EnumValue",value:"asc"}}]}]}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"displayName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"role"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"image"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"url"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"officeSectionContent"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"document"},arguments:[{kind:"Argument",name:{kind:"Name",value:"hydrateRelationships"},value:{kind:"BooleanValue",value:!0}}],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"churches"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"location"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"image"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"url"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"description"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"document"},arguments:[{kind:"Argument",name:{kind:"Name",value:"hydrateRelationships"},value:{kind:"BooleanValue",value:!0}}],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"videos"},arguments:[{kind:"Argument",name:{kind:"Name",value:"take"},value:{kind:"IntValue",value:"1"}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"ListValue",values:[{kind:"ObjectValue",fields:[{kind:"ObjectField",name:{kind:"Name",value:"publicationDate"},value:{kind:"EnumValue",value:"desc"}}]}]}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"title"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"youtubeVideoId"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"publicationDate"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"posts"},arguments:[{kind:"Argument",name:{kind:"Name",value:"take"},value:{kind:"IntValue",value:"4"}},{kind:"Argument",name:{kind:"Name",value:"where"},value:{kind:"ObjectValue",fields:[{kind:"ObjectField",name:{kind:"Name",value:"featured"},value:{kind:"ObjectValue",fields:[{kind:"ObjectField",name:{kind:"Name",value:"equals"},value:{kind:"BooleanValue",value:!0}}]}}]}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"ListValue",values:[{kind:"ObjectValue",fields:[{kind:"ObjectField",name:{kind:"Name",value:"publicationDate"},value:{kind:"EnumValue",value:"desc"}}]}]}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"title"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"slug"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"publicationDate"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"authors"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"displayName"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:1003}};S.loc.source={body:`query {
    settingsSingletons {
        homePageLinks(orderBy: [{ priority: asc }]) {
            id
            url
            text
            emoji
        }
        acolyteSchedule {
            url
        }
        pastors(orderBy: [{ priority: asc }]) {
            id
            displayName
            role
            image {
                url
            }
        }
        officeSectionContent {
            document(hydrateRelationships: true)
        }
    }

    churches {
        name
        location
        image {
            url
        }
        description {
            document(hydrateRelationships: true)
        }
    }

    videos(take: 1, orderBy: [{ publicationDate: desc }]) {
        id
        title
        youtubeVideoId
        publicationDate
    }

    posts(take: 4, where: { featured: { equals: true } }, orderBy: [{ publicationDate: desc }]) {
        title
        slug
        publicationDate
        authors {
            displayName
        }
    }
}
`,name:"GraphQL request",locationOffset:{line:1,column:1}};function h(n,t){if(n.kind==="FragmentSpread")t.add(n.name.value);else if(n.kind==="VariableDefinition"){var s=n.type;s.kind==="NamedType"&&t.add(s.name.value)}n.selectionSet&&n.selectionSet.selections.forEach(function(a){h(a,t)}),n.variableDefinitions&&n.variableDefinitions.forEach(function(a){h(a,t)}),n.definitions&&n.definitions.forEach(function(a){h(a,t)})}var M={};(function(){S.definitions.forEach(function(t){if(t.name){var s=new Set;h(t,s),M[t.name.value]=s}})})();const H={preserveAspectRatio:"xMidYMid meet",viewBox:"0 0 24 24",width:"1.2em",height:"1.2em"},I=e("path",{fill:"currentColor",d:"M19 13H6.75L12 18.25l-.664.75l-6.5-6.5l6.5-6.5l.664.75L6.75 12H19v1Z"},null,-1),q=[I];function P(n,t){return l(),o("svg",H,q)}var T={name:"mdi-light-arrow-left",render:P};const K={preserveAspectRatio:"xMidYMid meet",viewBox:"0 0 24 24",width:"1.2em",height:"1.2em"},W=e("path",{fill:"currentColor",d:"M4 12h12.25L11 6.75l.664-.75l6.5 6.5l-6.5 6.5l-.664-.75L16.25 13H4v-1Z"},null,-1),G=[W];function J(n,t){return l(),o("svg",K,G)}var Q={name:"mdi-light-arrow-right",render:J};const Y="_container_1xsay_3";var Z={container:Y};const X={name:"HorizontalScrollContainer",components:{ArrowLeft:T,ArrowRight:Q},props:{scrollStepSize:{type:Number,default:100}},setup(n){const t=N(null),s=N(0),a=B();return D(t,"scroll",()=>{s.value=t.value.scrollLeft}),{el:t,scrollRight(){t.value.scrollTo({left:t.value.scrollLeft+n.scrollStepSize,behavior:"smooth"})},scrollLeft(){t.value.scrollTo({left:t.value.scrollLeft-n.scrollStepSize,behavior:"smooth"})},showLeft:b(()=>s.value>0),showRight:b(()=>a.width.value&&t.value!==null&&s.value<t.value.scrollWidth-t.value.clientWidth-1)}}},ee={class:"relative"},te={class:"cannot-hover:hidden absolute top-0 left-0 right-0 bottom-0 flex justify-between items-center px-1"};function ne(n,t,s,a,L,j){const u=c("ArrowLeft"),p=c("ArrowRight");return l(),o("div",ee,[e("div",{ref:"el",class:f(["flex overflow-x-auto space-x-5 px-1 pb-5 relative z-1",n.$style.container])},[A(n.$slots,"default")],2),e("div",te,[e("button",{class:f(["rounded-full w-14 h-14 bg-black text-white text-7 flex justify-center items-center transition duration-200 z-1",a.showLeft?"":"opacity-0 pointer-events-none"]),onClick:t[0]||(t[0]=m=>a.scrollLeft())},[r(u)],2),e("button",{class:f(["rounded-full w-14 h-14 bg-black text-white text-7 flex justify-center items-center transition duration-200 z-1",a.showRight?"":"opacity-0 pointer-events-none"]),onClick:t[1]||(t[1]=m=>a.scrollRight())},[r(p)],2)])])}const ie={$style:Z};var ae=F(X,[["render",ne],["__cssModules",ie]]);const le={name:"IndexPage",components:{Document:E,UnknownLink:U,UploadedImage:$,HorizontalScrollContainer:ae},async setup(){R({title:O("Start")});const{data:n}=await z({query:S});return{data:n,getBackendUrl:C}}},se={class:"space-y-25"},oe={class:"flex flex-grow justify-between -lg:flex-col pt-10 lg:pb-10"},de={class:"flex flex-col justify-center items-start -lg:mb-10"},re=e("div",{class:"yellow-underlined font-bold font-serif text-11 sm:text-14"}," Willkommen ",-1),ce=e("div",{class:"text-7 sm:text-9 pt-10 leading-11 font-serif"},[_(" Katholische Kirchengemeinde"),e("br"),_(" St. Josef \u2014 St. Johannes ")],-1),ue={class:"text-6 sm:text-8 pt-15 flex flex-col items-start space-y-4"},me=_(" \u{1F4FA} Aktueller Gottesdienst "),ve=["href"],ke={class:"flex-grow pt-10 flex flex-col justify-center lg:max-w-90"},ge={class:"flex flex-col justify-center"},fe={class:"font-serif text-gray-800 text-5 sm:text-6 mb-1 truncate leading-8"},he={class:"text-2 text-gray-700"},_e=e("h1",{class:"section-heading"},[e("span",null,"Seelsorger")],-1),pe={class:"text-6 font-bold"},xe={class:"text-5"},Se=e("div",{class:"w-1px h-1 flex-shrink-0"},null,-1),ye=e("h1",{class:"section-heading"},[e("span",null,"Kirchorte")],-1),Ne={class:"space-y-10"},be={class:"lg:w-1/2 lg:px-14 lg:py-10"},we={class:"font-bold text-9"},Fe={class:"text-5"},Le=e("h1",{class:"section-heading"},[e("span",null,"Pfarrb\xFCro")],-1);function je(n,t,s,a,L,j){const u=c("router-link"),p=c("UnknownLink"),m=c("UploadedImage"),V=c("HorizontalScrollContainer"),y=c("Document");return l(),o("main",se,[e("section",oe,[e("div",de,[re,ce,e("div",ue,[r(u,{to:`/mediathek/${a.data.videos[0].id}`,class:"link"},{default:v(()=>[me]),_:1},8,["to"]),e("a",{href:a.getBackendUrl(a.data.settingsSingletons[0].acolyteSchedule.url),class:"link"}," \u{1F4C4} Messdienerplan ",8,ve),(l(!0),o(k,null,g(a.data.settingsSingletons[0].homePageLinks,i=>(l(),w(p,{key:i.id,to:i.url},{default:v(()=>[_(d(i.emoji)+" "+d(i.text),1)]),_:2},1032,["to"]))),128))])]),e("div",ke,[e("div",ge,[(l(!0),o(k,null,g(a.data.posts,i=>(l(),w(u,{key:i.slug,to:`/neuigkeiten/${i.slug}`,class:"not-last:border-b-1px border-gray-200 py-3 first:pt-0"},{default:v(()=>[e("div",fe,d(i.title),1),e("div",he,d(i.authors.map(x=>x.displayName).join(", ")),1)]),_:2},1032,["to"]))),128))])])]),e("section",null,[_e,r(V,{"scroll-step-size":220},{default:v(()=>[(l(!0),o(k,null,g(a.data.settingsSingletons[0].pastors,i=>(l(),o("div",{key:i.id,class:"w-70 flex-shrink-0 flex flex-col items-center px-8 py-6 bg-white shadow-md rounded-2xl"},[r(m,{class:"rounded-full w-50 h-50 object-cover mb-8",draggable:"false",url:i.image.url,alt:i.displayName},null,8,["url","alt"]),e("div",pe,d(i.displayName),1),e("div",xe,d(i.role),1)]))),128)),Se]),_:1})]),e("section",null,[ye,e("div",Ne,[(l(!0),o(k,null,g(a.data.churches,(i,x)=>(l(),o("div",{key:i.id,class:f(["flex -lg:flex-col",x%2===0?"lg:-mr-10 lg:text-right":"lg:flex-row-reverse lg:-ml-10"])},[e("div",be,[e("h2",we,d(i.name),1),e("div",Fe," in "+d(i.location),1),r(y,{class:"text-4 mt-4",data:i.description.document},null,8,["data"])]),r(m,{class:"-lg:max-w-120 -lg:mt-8 lg:w-1/2 object-cover",url:i.image.url,alt:i.name},null,8,["url","alt"])],2))),128))])]),e("section",null,[Le,r(y,{class:"text-4","increment-heading-levels-by":1,data:a.data.settingsSingletons[0].officeSectionContent.document},null,8,["data"])])])}var Re=F(le,[["render",je]]);export{Re as default};