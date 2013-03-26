
var debug = false;

var sendObject = "sendObject";
var receiveObject = "receiveObject";

var timeOut = 1000;
var sendDelay = 50;
var countSendedSymbols = 0;


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
	$('#sendButton').attr('disabled', true);
	InitializeEvents();
});

function InitializeEvents()
{
	$('#sendTextArea').keyup(function () {
		if ($(this).val().length == 0) {
			$('#sendButton').attr('disabled', true);
		}
		else {
			$('#sendButton').attr('disabled', false);
		}
	});

	$('#sendButton').click(function () {
		SendData(countSendedSymbols, buffer.VacantCount());
		//SendDataAgain(30);		
	});

	$('#resetButton').click(function () {
		localStorage.clear();
	});
}


function SendData(position, count)
{
	var data = $('#sendTextArea').val();
	for (var i = 0; i < count && position + i < data.length; i++) {
		var package = new Package(countSendedSymbols + i, data[position + i], new Date());
		buffer.Add(package);
		// Send package.
		Sleep(sendDelay);
		localStorage.setItem(sendObject, JSON.stringify(package));
	};
	countSendedSymbols += i;
}

function SendDataAgain(k)
{
	while (k--)
	{
		Sleep(timeOut / 4);
		for (var i = 0; i < buffer.Length(); i++)
		{
			var package = buffer.array[i];
			if (new Date() - package.time > timeOut)
			{
				localStorage.setItem(sendObject, JSON.stringify(package));
			}
		};
	}
}

function ReceiveData(event)
{
	switch (event.key)
	{
		case receiveObject:
			var package = JSON.parse(event.newValue);
			Log(package.data);
			buffer.Remove(package);
			
			// Send new one.
			if (countSendedSymbols < $('#sendTextArea').val().length)
			{
				SendData(countSendedSymbols, buffer.VacantCount());
				var package = new Package(countSendedSymbols + i, data[position + i], new Date());
				buffer.Add(package);
				//SendDataAgain(100);
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
	AddText('#receiveTextArea', text);
}

function Debug(text)
{
	if (debug)
	{
		AddText('#systemTextArea', text + "  ");
	}
}