var SwimDown = function (data) {
	if (data) {
		var parseObj = JSON.parse(data);
		this.score = parseObj.score;
		this.time = parseObj.time;
		this.author = parseObj.author;
		this.name = parseObj.name;
	}
};

SwimDown.prototype = {
	toString: function () {
		return JSON.stringify(this)
	}
};

var TheLetter = function () {
	LocalContractStorage.defineMapProperty(this, "dataMap", {
		parse: function (data) {
			return new SwimDown(data);
		},
		stringify: function (obj) {
			return obj.toString();
		}
	});
	LocalContractStorage.defineMapProperties(this, {
		rankingMap: null
	});
};

TheLetter.prototype = {
	init: function () {

	},
	save: function (score, time, name) {
		var from = Blockchain.transaction.from;
		var author = from;
		if (!score) {
			throw new Error("The score can not be empty");
		}
		if (!name) {
			name = from;
		}
		var simDown = this.dataMap.get(name);
		if (simDown) {
			this.dataMap.del(name);
		}
		var simDown = new SwimDown();
		simDown.author = author;
		simDown.score = score;
		simDown.time = time;
		simDown.name = name;
		this.dataMap.put(name, simDown);
		//排序排名
		var rankings = this.rankingMap.get('ranking');
		if (!rankings) {
			rankings = new Array();
		}
		sort(rankings, simDown, this);
		return "save success!";
	},
	get: function (type, author) {
		if (type == 'persional') {
			return this.dataMap.get(author);
		}
		if (type == 'ranking') {
			return JSON.stringify(this.rankingMap.get('ranking'));
		}
	},
	del: function (name) {
		if (!name) {
			throw new Error("del author is not entity");
		};
		return JSON.stringify("delete success!");
	}
};
//得分排序
function sort(arr, simDown, rankingBlock) {
	//出重
	var index = -1;
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].author == simDown.author) {
			index = i;
			if (arr[i].score < simDown.score) {
				arr.splice(i, 1, simDown);
			} 
			break;
		}
	}
	if (index == -1) {
		arr.push(simDown);
	}
	rankingBlock.rankingMap.put('ranking', arr);
}

module.exports = TheLetter;


