
var debug = false//true;

var monitorObject = "monitorObject";
var tokenObject = "tokenObject";
var stationObject = "stationObject";

var marker = {
	priority: 2,
	reservedPriority: 0,
	isMarker: true,

	data: "",
	destination: 0,
	source: 0,
};

var address = 0;
var destination = 0;
var priority = 0;
var stationId = parseInt(Math.random() * 10000);
var timeStart = null;
var timeLimit = 6 * 1000;
var sendDelay = 200;
var countSendedSymbols = 0;



//function Stations() {
	//this.array = new Array();
	var stations = new Array();

	//this.IndexOf = function (station) {
	function IndexOf(station) {
		var index = null;
		for (var i = 0; i < stations.length; i++)
		{
			if (stations[i].id == station.id)
			{
				index = i;
				break;
			}
		};
		return index;
	}
	
	//this.Add = function (station) {
	function Add(station) {
		stations.push(station);
	}

	//this.Change = function (station) {
	function Change(station) {
		var index = IndexOf(station);

		if (index != null)  // Change old address.
		{
			stations[index] = station;
		}
		else
		{
			stations.push(station);
		}
	}


$(document).ready(function ()
{
	window.addEventListener('storage', ReceiveData, false);

	if (!localStorage.getItem(monitorObject))
	{
		localStorage.setItem(monitorObject, false);
		$('#sendTokenButton').css('visibility', 'visible');
	}

	//stations.
	Add({
		id: stationId,
		address: 0,
		priority: 0
	});

	InitializeEvents();
});

function InitializeEvents()
{
	$('#receiveAddress,#sendAddress,#stationPriority').change(function () {
		address = $('#receiveAddress').val();
		destination = $('#sendAddress').val();
		priority = $('#stationPriority option:selected').val();

		Debug("Change to " + address + '-' + destination + '-' + priority);

		var station = {
			id: stationId,
			address: address,
			priority: priority
		};
		// Save station local.
		//stations.
		Change(station);
		// Receive changes to network.
		localStorage.setItem(stationObject, JSON.stringify(station));
	});

	$('#sendTokenButton').click(function () {
		SendToken(0);
	});

	$('#resetButton').click(function () {
		localStorage.clear();
	});
}


function SendData()
{
	stations.sort(function sortFunction(a, b) {
		if (a.address < b.address)
			return -1;  // a < b.
		if (a.address > b.address)
			return 1;  // a > b.
		return 0;  // a = b.
	});
	//var index = stations.IndexOf(object);
	var index = IndexOf({id: stationId});
	timeStart = new Date();
	while (new Date() - timeStart < timeLimit)
	{
		if ($('#sendTextArea').val().length > countSendedSymbols)
		{
			var token = marker;
			token.priority = priority;
			token.reservedPriority = 0;
			token.isMarker = false;
			token.data = $('#sendTextArea').val()[countSendedSymbols];
			token.destination = destination;
			token.source = address;

			var object = {
				token: token,
				endpoint: 0,
				id: 0
			};

			Debug("Send '" + object.token.data + "'");

			for (var i = index + 1; i <= stations.length + index; i++)
			{
				var station = stations[i % stations.length];
				object.endpoint = station.address;	
				object.id = station.id;			

				// Receive local.
				ReceiveToken(object);
				// Receive to network.
				Sleep(sendDelay);
				localStorage.setItem(tokenObject, JSON.stringify(object));
			};
			countSendedSymbols++;
		}
	}
	SendToken(index);
}

function SendToken(index)
{
	//stations.array.sort(function sortFunction(a, b) {
	stations.sort(function sortFunction(a, b) {
		if (a.address < b.address)
			return -1;  // a < b.
		if (a.address > b.address)
			return 1;  // a > b.
		return 0;  // a = b.
	});

	var token = marker;
	token.priority = 2;
	token.reservedPriority = 0;
	token.isMarker = true;
	token.data = "";
	token.destination = 0;
	token.source = 0;

	var object = {
		token: token,
		endpoint: 0,
		id: 0
	};

	for (var i = index + 1; i <= stations.length + index; i++)
	{
		var station = stations[i % stations.length];
		object.endpoint = station.address;
		object.id = station.id;
		
		// Receive local.
		ReceiveToken(object);
		// Receive to network.
		Sleep(sendDelay);
		localStorage.setItem(tokenObject, JSON.stringify(object));
		
		if (station.priority >= object.token.priority)
			return;
	};
	SendData();
}

function ReceiveData(event)
{
	switch (event.key)
	{
		// Token is came on.
		case tokenObject:
			ReceiveToken(JSON.parse(event.newValue));
			break;

		// Change or add new station address in the network.
		case stationObject:
			var station = JSON.parse(event.newValue);
			Debug("Get addr=" + station.address);
			
			Change(station);
			break;
	}
}

function ReceiveToken(object)
{
	if (object.endpoint == address)
	{
		if (object.token.isMarker)
		{
			Debug("Get Marker");
			Log("*");

			// Try to capture marker.
			if (priority < object.token.priority)
			{
				if (priority > object.token.reservedPriority)
				{
					Debug("Change priority");
				}
			}
			else if ($('#sendTextArea').val().length > countSendedSymbols)
			{
				Debug("Capture marker");
				SendData();
			}
		}
		else
		{
			Log("P");
			if (object.token.source != address)
			{
				Debug("Get Token");
				AddText('#receiveTextArea', object.token.data + "  ");
			}
		}
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