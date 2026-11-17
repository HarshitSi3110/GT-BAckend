const Package =
require(
"../models/package.model"
);



exports.createPackage =
async(
req,
res
)=>{

try{

const data =
await Package.create(
req.body
);

res.status(201)
.json({

success:true,

message:
"Package Created",

data

});

}

catch(error){

console.log(
error
);

res.status(500)
.json({

success:false,

message:
error.message

});

}

};




exports.getPackages =
async(
req,
res
)=>{

try{

const data =
await Package
.find()
.sort({

createdAt:-1

});

res.json({

success:true,

data

});

}

catch(error){

res.status(500)
.json({

success:false

});

}

};





exports.getPackage =
async(
req,
res
)=>{

try{

const data =
await Package
.findById(
req.params.id
);

res.json({

success:true,

data

});

}

catch(error){

res.status(404)
.json({

success:false

});

}

};






exports.updatePackage =
async(
req,
res
)=>{

try{

const data =
await Package
.findByIdAndUpdate(

req.params.id,

req.body,

{
new:true
}

);

res.json({

success:true,

data

});

}

catch(error){

res.status(500)
.json({

success:false

});

}

};






exports.deletePackage =
async(
req,
res
)=>{

try{

await Package
.findByIdAndDelete(

req.params.id

);

res.json({

success:true

});

}

catch(error){

res.status(500)
.json({

success:false

});

}

};