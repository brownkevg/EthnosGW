exports.uploadContent = function(req,res){
	// debugger;
	var content = req.body;
	content.views = 0;
	debugger;
	dbClient.collection('media').save(content,function(err, result){
		res.status(200).end(JSON.stringify({success:true}));
	})
}