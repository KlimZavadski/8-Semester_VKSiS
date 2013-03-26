
var debug = true;

var sendObject = "sendObject";
var receiveObject = "receiveObject";

var noise = 0.3;
var position = 0;
var sendDelay = 50;


function Package(id, data, time) {
	this.id = id;
	this.data = data;
	this.time = time;
};

function Buffer(size) {
	this.array = new Array();
	this.windowStartPosition = 0;
	this.windowSize = size;

	this.Length = function () {
		return this.array.length;
	};

	this.VacantCount = function () {
		return this.windowSize - this.Length();
	};

	this.IndexOf = function (package) {
		for (var i = 0; i < this.array.length; i++)
		{
			if (this.array[i].id == package.id)
			{
				return i;
			}
		};
		return null;
	};

	this.Sort = function () {
		this.array.sort(function sortFunction(a, b) {
			if (a.id < b.id)
				return -1;  // a < b.
			if (a.id > b.id)
				return 1;  // a > b.
			return 0;  // a = b.
		});
	};

	this.Add = function (package) {
		this.array.push(package);
		this.Sort();
		this.windowStartPosition = this.array[0].id;
	};

	this.Remove = function (package) {
		var index = this.IndexOf(package);
		if (index != null)
		{
			this.array.splice(index, 1);
			this.Sort();
			if (this.Length() != 0)
			{
				this.windowStartPosition = this.array[0].id;
			}
		}
	};
};
var buffer = new Buffer(5);


$(document).ready(function ()
{
	window.addEventListener('storage', ReceiveData, false);
});


function ReceiveData(event)
{
	switch (event.key)
	{
		case sendObject:
			//if (Math.random() < noise) break;
			if (Math.random() < noise) Sleep(500);

			var newPackage = JSON.parse(event.newValue);
			//Debug('(' + newPackage.data + ')');
			if (buffer.IndexOf(newPackage) == null && buffer.VacantCount() != 0)
			{
				buffer.Add(newPackage);				
				while (position == buffer.array[0].id)
				{
					var package = buffer.array[0];
					Debug(package.data);
					
					Sleep(sendDelay);
					localStorage.setItem(receiveObject, JSON.stringify(package));
					buffer.Remove(package);
					position++;
				}
			}
			break;
	}
}


function AddText(textAreaName, text)
{
	var textArea = $(textAreaName);
	$(textAreaName).val(textArea.val() + text);
}

function Sleep(millis)
{
	var date = new Date();
	var curDate;
	do
	{
		curDate = new Date();
	} while(curDate - date < millis);
}


function Log(text)
{
	AddText('#systemTextArea', text + "  ");
}

function Debug(text)
{
	if (debug)
	{
		Log(text);
	}
}