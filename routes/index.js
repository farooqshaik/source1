var express = require('express');
var router = express.Router();

/*var MongoClient=require('mongodb').MongoClient;
var assert=require('assert');
var url="mongodb://localhost:27017/DatingDB";*/

/*
MongoClient.connect(url, function(err, db) {

    collection.update(
        { "topic" : ".Net1" },
        { $set: { "topic" : "New 8/2 updated" } },
        {
            multi:true
        }
    );
    for(i=1;i<5;i++){
        collection.insertOne(
            {topic:".Net"+i,description:"Framework from Microsoft"+i},
            function(err,result){
                assert.equal(err, null);
                console.log("Inserted");
            }
        );
    }

    collection.find({name:'Jillian'}).toArray(function(err, docs){
        assert.equal(err, null);
        console.log("Found: ");
        console.log(docs);
    });

    var data=collection.find().toArray(function(err,data){
    	for(i=0;i<10;i++){
    		console.log(data[i].name+":"+data[i].images[0].url);
    	}
    }); 

});*/

/*var db;

var images=new Array();
var location=new Array();
var age=new Array();
var dataAll;

MongoClient.connect(url, function(err, database) {
	if(err) return console.error(err);
	db=database;
	console.log("DatingDB connected!");
	var collection=db.collection("Profiles");
	collection.aggregate([{
		$group:{
			_id: "$url",
			name:{$first:"$name"},
			image:{$first:"$images"}
		}}]).toArray(function(err,data) {
		dataAll=data;
		//console.log(dataAll);
	});

	collection.find({},{images:true,_id:false}).toArray(function(err,data){   	
		n=data.length;
		for(i=0;i<n;i++){
			//console.log(data[i].images[0].url);
			images.push(data[i].images[0].url);
		}    	    	
	});

	collection.find({},{data:true,_id:false}).toArray(function(err,data){   	
		n=data.length;
		for(i=0;i<n;i++){
			console.log("---------------"+i+" -------------------");
			//console.log(data[i].data['Lives in:'][0]);
			console.log(data[i].data['Age:'][0]);
		}    	    	
	});
});*/



/* GET home page. */
router.get('/', function(req, res, next) {
	
	var db = req.db;
    var collection = db.get('Pro10000');

   
   	
   	/*collection.find({},{url:true,images:true,name:true,_id:false},function(err,result){
   		n=Object.keys(result).length;
		for(i=0;i<n;i++){
			age[i]=result[i].data['Age:'][0];
			location[i]=result[i].data['Lives in:'][0];
		}
		console.log(result);
   	});*/

   	
    collection.find({},{url:true,name:true,images:1,_id:false},function(err,result){
    	n=Object.keys(result).length;
    	//console.log(n);
    	console.log(result);
    	console.log(n);
  		res.render('index.ejs',{profiles:result});
   	});



});


router.post('/filter',function(req,res,next){
	var db = req.db;
    var collection = db.get('Profiles');
	
	/*collection.aggregate([
	{
		$group:{
			_id: "$url",
			name:{$first:"$name"},
			images:{$first:"$images"},
			data:{$first:"$data"}
		}
	},
	{$limit:10}], function(err,result){
		console.log(result);
		n=Object.keys(result).length;
		res.render('content.ejs',{profiles:result});
	});*/
	var name=req.query.name;
	var gender=req.query.gender;
	var age_band=req.query.age_band;
	var country=req.query.country;

	if(age_band==""){
		collection.find({
		name:{$regex:name},
		"data.Gender:.0":{$regex:gender},
		"data.Lives in:.0":{$regex:country}
		},
		{url:true,name:true,images:true,data:true,_id:false},function(err,result){
			console.log(result);
	  		res.render('content.ejs',{profiles:result});
	   	});
	} else{
		var age = age_band.split("-");
		age0=age[0].toString();
		console.log(age0);

		collection.find(
		{name:{$regex:name},
		"data.Gender:.0":{$regex:gender},
		"data.Lives in:.0":{$regex:country},
		"data.Age:.0":{$lte:age[0]},
		"data.Age:.0":{$gte:age[1]}
		},
		{url:true,name:true,images:true,data:true,_id:false},function(err,result){
	  		res.render('content.ejs',{profiles:result});
	   	});
	}
});


module.exports = router;
