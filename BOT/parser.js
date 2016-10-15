function jsonThisString(str){
	str = str.toLowerCase();
	str = str.replace(/megs/gi,"M");
	str = str.replace(/mb/gi,"M");
	str = str.replace(/gigs/gi,"G");
	str = str.replace(/gig/gi,"G");
	str = str.replace(/gb/gi,"G");
	str = str.replace(/tb/gi,"T");
	str = str.replace(/vcpus/gi,"C");
	str = str.replace(/vcpu/gi,"C");
	str = str.replace(/cores/gi,"C");
	str = str.replace(/core/gi,"C");

	str = str.replace(/ C/gi, "C");
	str = str.replace(/ M/gi, "M");
	str = str.replace(/ G/gi, "G");
	str = str.replace(/ T/gi, "T");

	var vcpus = 0;
	var mems = [];

	var strArr = str.split(" ");
	for (var i = strArr.length - 1; i >= 0; i--) {

		var x = strArr[i];
		var mod = x[x.length - 1];
		if (mod == mod.toLowerCase()){
			continue;
		}

		var val = parseInt(x.slice(0,x.length-1));
		if (mod == "C"){
			vcpus = val;
			continue;
		}

		if (mod == "G")
			val*=1024;
		if (mod == "T")
			val*=1024*1024;

		mems.unshift(val);
	}
	mems.sort(function(a, b){return b-a});

	var json = {
		'vcpus': vcpus,
		'mem': mems[mems.length - 1],
		'storage': mems[0],
		'confident': mems.length==2
	}

	return json;
}

exports.jsonThisString = jsonThisString;