var busIsReady = "BusIsReady";
var dataObject = "Data";
var collizionObject = "CollizionData";

var countOfAttempt;
var ifg = 20;


$(document).ready(function () {
	Initialize();
});

function Initialize() {
	window.addEventListener('storage', receiveData, false);
	localStorage.setItem(busIsReady, true);
	clearSendTextArea();

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
		setStatus("");
		$('#systemTextArea').val("");
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

	for (i = 0; i < str.length; i++)
	{
		var data = str[i];
		countOfAttempt = 0;

		while (true)
		{
			sleep(ifg);

			if (localStorage.getItem(busIsReady))
			{
				localStorage.setItem(busIsReady, false);
				localStorage.setItem(dataObject, data + countOfAttempt);
				sleep(50);
				localStorage.setItem(busIsReady, true);

				if (data + countOfAttempt != localStorage.getItem(dataObject))
				{
					setStatus("Collizion");
					countOfAttempt++;
					if (countOfAttempt > 16)
					{
						setStatus("\nReceive error. Out of attempt's limit.", 0);
						i = str.length;
						break;
					}
					else
					{
						var k = Math.min(countOfAttempt, 10);
						var wait = Math.pow(2, k);
						sleep(Math.random() * wait);
					}
				}
				else
				{
					//addText("#receiveTextArea", data);
					break;
				}
			}
		}
	}
}

function receiveData (event)
{
	if (event.key == dataObject && event.newValue[1] == 0)
	{
		addText("#receiveTextArea", event.newValue[0]);
	}
	else if (event.key == collizionObject)
	{
		//addText("#systemTextArea", "  Collizion");
	}
}


function setStatus(status)
{
	//addText("#systemTextArea", "  " + status);
	if (status == "Collizion")
	{
		localStorage.setItem(collizionObject, Math.random());
	}
}

function addText(textAreaName, text)
{
	var textArea = $(textAreaName);
	$(textAreaName).val(textArea.val() + text);
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