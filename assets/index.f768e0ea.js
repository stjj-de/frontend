import{o as s,c as r,a as e,d as N,r as $,O as z,P as B,b as w,l as D,n as x,k as o,h as d,Q as j,F as v,t as c,M,J as O,f as g,i as p,q,g as _,j as b,v as E,e as P}from"./vendor.0083fde3.js";import{_ as R,b as H}from"./index.30b79537.js";import{D as V,g as I}from"./DocumentRendered.cf2bacda.js";import{_ as A}from"./UploadedImage.a97bf1df.js";var S={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"settings"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"officeSectionContent"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"homePageLinks"},arguments:[{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"ListValue",values:[{kind:"ObjectValue",fields:[{kind:"ObjectField",name:{kind:"Name",value:"priority"},value:{kind:"EnumValue",value:"asc"}}]}]}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"url"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"text"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"emoji"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"acolyteSchedule"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"url"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"pastors"},arguments:[{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"ListValue",values:[{kind:"ObjectValue",fields:[{kind:"ObjectField",name:{kind:"Name",value:"priority"},value:{kind:"EnumValue",value:"asc"}}]}]}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"displayName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"role"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"telephoneNumber"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"emailAddress"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"image"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"url"},arguments:[],directives:[]}]}}]}}]}},{kind:"Field",name:{kind:"Name",value:"churches"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"location"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"description"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"image"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"url"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"videos"},arguments:[{kind:"Argument",name:{kind:"Name",value:"take"},value:{kind:"IntValue",value:"1"}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"ListValue",values:[{kind:"ObjectValue",fields:[{kind:"ObjectField",name:{kind:"Name",value:"publicationDate"},value:{kind:"EnumValue",value:"desc"}}]}]}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"title"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"youtubeVideoId"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"publicationDate"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"posts"},arguments:[{kind:"Argument",name:{kind:"Name",value:"where"},value:{kind:"ObjectValue",fields:[{kind:"ObjectField",name:{kind:"Name",value:"featured"},value:{kind:"ObjectValue",fields:[{kind:"ObjectField",name:{kind:"Name",value:"equals"},value:{kind:"BooleanValue",value:!0}}]}}]}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"ListValue",values:[{kind:"ObjectValue",fields:[{kind:"ObjectField",name:{kind:"Name",value:"publicationDate"},value:{kind:"EnumValue",value:"desc"}}]}]}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"title"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"slug"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"publicationDate"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"authors"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"displayName"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:924}};S.loc.source={body:`query {
    settings {
        officeSectionContent
        
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
            telephoneNumber
            emailAddress
            image {
                url
            }
        }
    }

    churches {
        name
        location
        description
        image {
            url
        }
    }

    videos(take: 1, orderBy: [{ publicationDate: desc }]) {
        id
        title
        youtubeVideoId
        publicationDate
    }

    posts(where: { featured: { equals: true } }, orderBy: [{ publicationDate: desc }]) {
        title
        slug
        publicationDate
        authors {
            displayName
        }
    }
}
`,name:"GraphQL request",locationOffset:{line:1,column:1}};function y(t,n){if(t.kind==="FragmentSpread")n.add(t.name.value);else if(t.kind==="VariableDefinition"){var a=t.type;a.kind==="NamedType"&&n.add(a.name.value)}t.selectionSet&&t.selectionSet.selections.forEach(function(l){y(l,n)}),t.variableDefinitions&&t.variableDefinitions.forEach(function(l){y(l,n)}),t.definitions&&t.definitions.forEach(function(l){y(l,n)})}var T={};(function(){S.definitions.forEach(function(n){if(n.name){var a=new Set;y(n,a),T[n.name.value]=a}})})();const W={preserveAspectRatio:"xMidYMid meet",viewBox:"0 0 24 24",width:"1.2em",height:"1.2em"},Z=e("path",{fill:"currentColor",d:"M19 13H6.75L12 18.25l-.664.75l-6.5-6.5l6.5-6.5l.664.75L6.75 12H19v1Z"},null,-1),Y=[Z];function J(t,n){return s(),r("svg",W,Y)}var K={name:"mdi-light-arrow-left",render:J};const Q={preserveAspectRatio:"xMidYMid meet",viewBox:"0 0 24 24",width:"1.2em",height:"1.2em"},G=e("path",{fill:"currentColor",d:"M4 12h12.25L11 6.75l.664-.75l6.5 6.5l-6.5 6.5l-.664-.75L16.25 13H4v-1Z"},null,-1),U=[G];function X(t,n){return s(),r("svg",Q,U)}var ee={name:"mdi-light-arrow-right",render:X};const te="_container_m6nq9_2";var ne={container:te};const ie={class:"relative"},ae={class:"cannot-hover:hidden absolute top-0 left-0 right-0 bottom-0 flex justify-between items-center px-1"},le=N({__name:"HorizontalScrollContainer",props:{scrollStepSize:{type:Number,default:100}},setup(t){const n=t,a=$(null),l=$(0),k=z();B(a,"scroll",()=>{l.value=a.value.scrollLeft});function u(){a.value.scrollTo({left:a.value.scrollLeft+n.scrollStepSize,behavior:"smooth"})}function f(){a.value.scrollTo({left:a.value.scrollLeft-n.scrollStepSize,behavior:"smooth"})}const i=w(()=>l.value>0),m=w(()=>typeof k.width.value=="number"&&a.value!==null&&l.value<a.value.scrollWidth-a.value.clientWidth-1);return(F,h)=>(s(),r("div",ie,[e("div",{ref_key:"element",ref:a,class:x(["flex overflow-x-auto space-x-5 px-1 pb-5 relative z-1",F.$style.container])},[D(F.$slots,"default")],2),e("div",ae,[e("button",{class:x(["rounded-full w-14 h-14 bg-black text-white text-7 flex justify-center items-center transition duration-200 z-1",o(i)?"":"opacity-0 pointer-events-none"]),onClick:h[0]||(h[0]=L=>f())},[d(o(K))],2),e("button",{class:x(["rounded-full w-14 h-14 bg-black text-white text-7 flex justify-center items-center transition duration-200 z-1",o(m)?"":"opacity-0 pointer-events-none"]),onClick:h[1]||(h[1]=L=>u())},[d(o(ee))],2)])]))}}),se={$style:ne};var oe=R(le,[["__cssModules",se]]);const re={preserveAspectRatio:"xMidYMid meet",viewBox:"0 0 256 256",width:"1.2em",height:"1.2em"},de=e("path",{fill:"currentColor",d:"M176 224C96.6 224 32 159.4 32 80a56.2 56.2 0 0 1 48.9-55.6A16.3 16.3 0 0 1 97.6 34l20.1 46.9a15.9 15.9 0 0 1-1.4 15.1l-16.6 25.4a76.5 76.5 0 0 0 35.2 35l25.1-16.7a15.6 15.6 0 0 1 15.1-1.3l46.9 20a16.3 16.3 0 0 1 9.6 16.7A56.2 56.2 0 0 1 176 224ZM82.9 40.3A40 40 0 0 0 48 80a128.1 128.1 0 0 0 128 128a40 40 0 0 0 39.7-34.9l-46.9-20l-25 16.7a16 16 0 0 1-15.7 1.1a92.5 92.5 0 0 1-42.8-42.6a16 16 0 0 1 1-15.7L103 87.2ZM135 156.5Z"},null,-1),ce=[de];function ue(t,n){return s(),r("svg",re,ce)}var me={name:"ph-phone",render:ue};const ve={preserveAspectRatio:"xMidYMid meet",viewBox:"0 0 24 24",width:"1.2em",height:"1.2em"},ke=e("path",{fill:"currentColor",d:"M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5l-8-5h16zm0 12H4V8l8 5l8-5v10z"},null,-1),fe=[ke];function he(t,n){return s(),r("svg",ve,fe)}var ge={name:"ic-outline-email",render:he};const C=N({__name:"UploadedImageWithShadow",props:{url:{type:String,required:!0},alt:{type:String,required:!0}},setup(t){return(n,a)=>(s(),r(v,null,[d(A,j({class:"absolute filter blur-xl z-0 transform scale-110 opacity-30"},n.$attrs,{url:t.url,alt:t.alt,"aria-hidden":"true"}),null,16,["url","alt"]),d(A,j(n.$attrs,{class:"relative z-1",url:t.url,alt:t.alt}),null,16,["url","alt"])],64))}}),pe={class:"flex-shrink-0 flex flex-col items-center px-8 py-6 border-2 border-gray-300 rounded-lg border-dashed relative"},_e={class:"text-6 font-bold text-gray-900"},xe={class:"text-5"},ye={class:"flex flex-col space-y-2 pt-5"},be={class:"flex items-center space-x-2"},Ne=["href"],Se={class:"flex items-center space-x-2"},Fe=["href"],$e=N({__name:"PersonCard",props:{person:{type:Object,required:!0}},setup(t){return(n,a)=>(s(),r("div",pe,[d(C,{class:"rounded-full w-50 h-50 object-cover mb-8",url:t.person.image.url,alt:t.person.displayName},null,8,["url","alt"]),e("div",_e,c(t.person.displayName),1),e("div",xe,c(t.person.role),1),e("div",ye,[e("div",be,[d(o(me),{class:"text-4"}),e("a",{class:"link",href:`tel:${t.person.telephoneNumber.replaceAll(" ","")}`},c(t.person.telephoneNumber),9,Ne)]),e("div",Se,[d(o(ge),{class:"text-4"}),e("a",{class:"link",href:`mailto:${t.person.emailAddress}`},c(t.person.emailAddress),9,Fe)])])]))}}),we={class:"space-y-25"},je={class:"flex flex-grow justify-between -lg:flex-col pt-10 lg:pb-10"},Ve={class:"flex flex-col justify-center items-start -lg:mb-10"},Ae=e("div",{class:"yellow-underlined font-bold font-serif text-11 sm:text-14"}," Willkommen ",-1),Ce=e("div",{class:"text-7 sm:text-9 pt-10 leading-11 font-serif"},[b(" Katholische Kirchengemeinde"),e("br"),b(" St. Josef \u2014 St. Johannes ")],-1),Le={class:"text-6 sm:text-8 pt-15 flex flex-col items-start space-y-4"},ze=b(" \u{1F4FA} Aktueller Gottesdienst "),Be={class:"flex-grow pt-10 flex flex-col justify-center lg:max-w-90"},De={class:"flex flex-col justify-center"},Me={class:"font-serif text-gray-800 text-5 sm:text-6 mb-1 truncate leading-8"},Oe={class:"text-2 text-gray-700"},qe=e("h1",{class:"section-heading"},[e("span",null,"Seelsorger")],-1),Ee=e("div",{class:"w-1px h-1 flex-shrink-0"},null,-1),Pe=e("h1",{class:"section-heading"},[e("span",null,"Kirchorte")],-1),Re={class:"space-y-10"},He={class:"lg:w-1/2 lg:px-14 lg:py-10"},Ie={class:"font-bold text-9"},Te={class:"text-5"},We={class:"relative -lg:max-w-120 -lg:mt-8 lg:w-1/2"},Ze=e("h1",{class:"section-heading"},[e("span",null,"Pfarrb\xFCro")],-1),Ge=N({__name:"index",async setup(t){let n,a;M({title:I("Start")});const{data:l}=([n,a]=O(()=>E({query:S})),n=await n,a(),n);return(k,u)=>{const f=P("router-link");return s(),r("main",we,[e("section",je,[e("div",Ve,[Ae,Ce,e("div",Le,[o(l).videos.length>0?(s(),g(f,{key:0,class:"link",to:`/mediathek/${o(l).videos[0].id}`,onClickPassive:u[0]||(u[0]=i=>k.track("home page click","latest video"))},{default:p(()=>[ze]),_:1},8,["to"])):q("",!0),(s(!0),r(v,null,_(o(l).settings.homePageLinks,i=>(s(),g(H,{key:i.id,to:i.url},{default:p(()=>[b(c(i.emoji)+" "+c(i.text),1)]),_:2},1032,["to"]))),128))])]),e("div",Be,[e("div",De,[(s(!0),r(v,null,_(o(l).posts,i=>(s(),g(f,{key:i.slug,class:"not-last:border-b-1px border-gray-200 py-3 first:pt-0",to:`/neuigkeiten/${i.slug}`,onClickPassive:u[1]||(u[1]=m=>k.track("home page click","post"))},{default:p(()=>[e("div",Me,c(i.title),1),e("div",Oe,c(i.authors.map(m=>m.displayName).join(", ")),1)]),_:2},1032,["to"]))),128))])])]),e("section",null,[qe,d(oe,{"scroll-step-size":220},{default:p(()=>[(s(!0),r(v,null,_(o(l).settings.pastors,i=>(s(),g($e,{key:i.id,person:i},null,8,["person"]))),128)),Ee]),_:1})]),e("section",null,[Pe,e("div",Re,[(s(!0),r(v,null,_(o(l).churches,(i,m)=>(s(),r("div",{key:i.id,class:x(["flex -lg:flex-col",m%2===0?"lg:-mr-10 lg:text-right":"lg:flex-row-reverse lg:-ml-10"])},[e("div",He,[e("h2",Ie,c(i.name),1),e("div",Te," in "+c(i.location),1),d(V,{class:"text-4 mt-4",data:i.description.document},null,8,["data"])]),e("div",We,[d(C,{url:i.image.url,alt:i.name,class:"object-cover"},null,8,["url","alt"])])],2))),128))])]),e("section",null,[Ze,d(V,{class:"text-4","increment-heading-levels-by":1,data:o(l).settings.officeSectionContent.document},null,8,["data"])])])}}});export{Ge as default};