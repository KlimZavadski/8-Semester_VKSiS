var debug = true;

var monitorObject = "monitorObject";
var tokenObject = "tokenObject";
var stationObject = "stationObject";

var isMonitor = false;
var stations = new Array();
var marker = {
	priority: 2,
	reservedPriority: 0,
	isMonitor: false,
	isMarker: true,

	data: "",
	destination: 0,
	source: 0,
	isRead: false
};

var address;
var stationId = parseInt(Math.random() * 1000);
var timeStart = null;
var timeLimit = 10 * 1000;
var sendDelay = 500;
var countSendedSymbols = 0;
var isFirstSend = true;


$(document).ready(function () {
	window.addEventListener('storage', ReceiveData, false);

	if (!localStorage.getItem(monitorObject))
	{
		localStorage.setItem(monitorObject, false);
		isMonitor = true;
		stations.push({
			id: stationId,
			address: 0
		});
		$('#sendTokenButton').css('visibility', 'visible');
	}

	$('#receiveAddress').change(function () {
		address = $(this).val();
		Debug(address);

		if (isMonitor)
		{
			stations[0].address = address;
		}
		else
		{
			localStorage.setItem(stationObject, JSON.stringify({
				id: stationId,
				address: address
			}));
		}
	});

	$('#sendTokenButton').click(function () {
		stations.sort(function sortFunction(a, b) {
			if (a.address < b.address)
				return -1;  // a < b.
			if (a.address > b.address)
				return 1;  // a > b.
			return 0;  // a = b.
		});
		
		var token = marker;
		token.source = address;
		SendToken({
			stations: stations,
			token: token,
			index: 0
		});
	});

	$('#resetButton').click(function () {
		localStorage.clear();
	});
});


function SendToken(object)
{
	if (object.stations.length > object.index)
	{
		if (object.stations[object.index].address == address)
		{
			object.index += 1;
			SendToken(object);
		}

		Debug("Send token");
		Sleep(sendDelay);
		localStorage.setItem(tokenObject, JSON.stringify(object));
	}
	else
	{
		object.token.isMonitor = true;
		object.index = 0;
		SendToken(object);
	}
}

function SendData(object)
{
	if (isFirstSend)
	{
		timeStart = new Date();
		//object.token.reservedPriority = 0;
	}
	if ((new Date() - timeStart < timeLimit)
		&& ($('#sendTextArea').val().length > countSendedSymbols))
	//if (countSendedSymbols < 5)
	{
		object.token.priority = $('#stationPriority option:selected').val();
		object.token.isMonitor = false;
		object.token.isMarker = false;

		object.token.data = $('#sendTextArea').val()[countSendedSymbols];
		object.token.destination = $('#sendAddress').val();
		object.token.source = address;
		object.token.isRead = false;

		Debug("Send '" + object.token.data + "'");
		SendToken(object);

		isFirstSend = false;
		countSendedSymbols++;
	}
	else
	{
		isFirstSend = true;

		var token = marker;
		token.reservedPriority = object.reservedPriority;
		SendToken({
			stations: object.stations,
			token: token,
			index: object.index
		});
	}
}

function ReceiveData(event)
{
	if (event.key == tokenObject)
	{
		var object = JSON.parse(event.newValue);

		// Token is back to station.
		if (object.token.source == address)
		{
			Debug("Token is back");

			if (object.token.isMarker)
			{
				object.index = 0;
				object.token.priority = object.token.reservedPriority;
				object.token.reservedPriority = 0;
				SendToken(object);
			}
			else
			{
				SendData(object);
			}
		}
		// This token is for this station.
		else if (object.stations[object.index].address == address)
		{
			// This is marker.
			if (object.token.isMarker)
			{
				Debug("Get marker");
				var priority = $('#stationPriority option:selected').val();

				if (priority < object.token.priority)
				{
					if (priority > object.token.reservedPriority)
					{
						Debug("Change priority");
						object.token.reservedPriority = priority;
					}
					object.index += 1;
					SendToken(object);
				}
				else if ($('#sendTextArea').val().length > countSendedSymbols)
				{
					Debug("Capture marker");
					SendData(object);  //!!!!!!!!!!!!!!!!
				}
				else
				{
					object.index += 1;
					SendToken(object);
				}
			}
			// This is frame for us.
			else if (object.token.destination == address)
			{
				Debug("Get token");
				AddText('#receiveTextArea', object.token.data + "  ");

				object.token.isRead = true;
				object.index += 1;
				SendToken(object);
			}
		}
	}
	// Change or add new station address in the network.
	else if (event.key == stationObject && isMonitor)
	{
		var station = JSON.parse(event.newValue);
		Debug("Get addr=" + station.address);
		
		var index = null;
		$(stations).each(function (i, elem) {
			if (elem.id == station.id)
				index = i;
		});

		if (index != null)  // Change old address.
		{
			stations[index] = station;
		}
		else
		{
			stations.push(station);
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



function Debug(text)
{
	if (debug)
	{
		AddText('#systemTextArea', '(' + text + ' ' + countSendedSymbols + ')  ');
	}
}