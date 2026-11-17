const mongoose =
require("mongoose");

const itinerarySchema =
new mongoose.Schema({

day:{
type:Number,
required:true
},

title:{
type:String,
required:true
},

description:{
type:String,
required:true
}

});

const faqSchema =
new mongoose.Schema({

question:{
type:String,
required:true
},

answer:{
type:String,
required:true
}

});

const packageSchema =
new mongoose.Schema({

title:{
type:String,
required:true
},

destination:{
type:String,
required:true
},

price:{
type:Number,
required:true
},

oldPrice:{
type:Number,
required:true
},

days:{
type:Number,
required:true
},

nights:{
type:Number,
required:true
},

description:{
type:String,
required:true
},

images:[
{
type:String
}
],

included:[
String
],

excluded:[
String
],

faq:[
faqSchema
],

itinerary:[
itinerarySchema
]

},

{
timestamps:true
}

);

module.exports =
mongoose.model(
"Package",
packageSchema
);