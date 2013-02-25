var busIsReady = "BusIsReady";
var dataObject = "Data";

var status = "";
var countOfAttempt;
var ifg = 10;


$(document).ready(function () {
	Initialize();
});

function Initialize() {
	window.addEventListener('storage', receiveData, false);
	window.addEventListener('change', function () {$('#statusTextArea').val("~")}, false);
	localStorage.setItem(busIsReady, true);
	clearSendTextArea();

	$(status).change(function () {
		$('#statusTextArea').val(status);
	});

	$('#sendButton').click(sendData);

	$('#sendTextArea').keyup(function () {
		if ($(this).val().length == 0) {
			$('#sendButton').attr('disabled', true);
		}
		else {
			$('#sendButton').attr('disabled', false);
		}
	});

	$('#resetButton').click(function () {
		clearSendTextArea();
		status = 0;
		$('#receiveTextArea').val("");
		localStorage.clear();
	});
}

function clearSendTextArea()
{
	$('#sendButton').attr('disabled', true);
	$('#sendTextArea').val("");
}


function sendData()
{
	var str = $('#sendTextArea').val();
	countOfAttempt = 0;
	status = "";

	for (i = 0; i < str.length; i++)
	{
		var data = str[i];
		while (true)
		{
			if (localStorage.getItem(busIsReady))
			{
				localStorage.setItem(busIsReady, false);
				// Wait IFG.
				sleep(ifg);
				localStorage.setItem(dataObject, data);
				localStorage.setItem(busIsReady, true);
				sleep(100);

				if (localStorage.getItem(dataObject) == data)
				{
					status = "Receive OK.";
					break;
				}
				else
				{
					// Send Jam.
					countOfAttempt++;
					if (countOfAttempt > 16)
					{
						status = "Receive error. Out of attempt's limit.";
						i = str.length;
						break;
					}
					else
					{
						var k = Math.min(countOfAttempt, 10);
						var wait = Math.pow(2, k);
						sleep(Math.random() * wait);
						break;
					}
				}
			}
		}
	}
}

function receiveData (event)
{
	if (event.key == dataObject)
	{
		var val = $('#receiveTextArea').val();
		$('#receiveTextArea').val(val + event.newValue);
	}
}



function sleep(millis)
{
	var date = new Date();
	var curDate;
	do
	{
		curDate = new Date();
	} while(curDate - date < millis);
}