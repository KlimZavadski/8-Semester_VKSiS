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
var stationId = ParseInt(Math.random() * 1000);
var timeStart = null;
var timeLimit = 300;
var countSendedSymbols;


$(document).ready(function () {
	window.addEventListener('storage', ReceiveData, false);

	if (!localStorage.getItem(monitorObject))
	{
		localStorage.setItem(monitorObject, false);
		isMonitor = true;
		stations.push({
			id: stationId,
			address: address
		});
		$('#sendTokenButton').css('visibility', 'visible');
	}

	$('#receiveAddress').change(function () {
		address = $(this).val();
		Debug(address);
		localStorage.setItem(stationObject, JSON.stringify({
			id: stationId,
			address: address
		}));
	});

	$('#sendtokenButton').click(function () {
		stations.sort();
		SendToken({
			stations: stations,
			token: marker,
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
		localStorage.setItem(tokenObject, JSON.stringify(object));
	}
	else
	{
		//object.token.isMonitor = true;
		object.index = 0;
		SendToken(object);
	}
}

function SendData(object)
{
	if (startTime == null)
	{
		startTime = new Date();
		countSendedSymbols = 0;

		object.token.reservedPriority = 0;
	}
	if (startTime + timeLimit < new Date())
	{
		object.token.priority = $('#stationPriority option:selected').val();
		object.token.isMonitor = false;
		object.token.isMarker = false;

		object.token.data = $('#sendTextArea').val()[countSendedSymbols];
		object.token.destination = $('#sendAddress').val();
		object.token.source = address;
		object.token.isRead = false;
		SendData(marker);

		countSendedSymbols++;
	}
}

function ReceiveData(event)
{
	if (event.key == tokenObject)
	{
		var object = JSON.parse(event.newValue);
		// This is for this station.
		if (object.stations[object.index] == address)
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
					SendToken(object);
				}
				else
				{
					Debug("Send data");
					SendData(object);  //!!!!!!!!!!!!!!!!
				}
			}
			// This is frame for us.
			else if (object.token.destination == address)
			{
				Debug("Get token");
				AddText('', object.token.data + "  ");

				object.token.isRead = true;
				SendToken(object);
			}
			// Token is back to station.
			else if (object.token.source == address)
			{
				Debug("Token is back.");

				object.token.reservedPriority = 0;
				SendData(object);
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
		AddText('#systemTextArea', text + '  ');
	}
}