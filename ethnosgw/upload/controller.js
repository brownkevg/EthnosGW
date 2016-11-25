exports.uploadContent = function(req,res){
	debugger;
	var content = req.body;
	dbClient.collection('media').save(content,function(err, result){
		res.status(200).end(JSON.stringify({success:true}));
	})
}