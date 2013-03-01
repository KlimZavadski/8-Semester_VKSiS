var isMonitor = "IsMonitor";
var tokenObject = "tokenObject";
var reset = "Reset";

var stack = new Array();


$(document).ready(function () {
	Initialize();
});

function Initialize() {
	window.addEventListener('storage', ReceiveData, false);
	ClearSendTextArea();
	
	if (!localStorage.getItem(isMonitor))
	{
		localStorage.setItem(isMonitor, true);
		$('#sendtokenButton').attr('disabled', false);
	}

	/*$('#sendTextArea').keyup(function () {
		if ($(this).val().length == 0) {
			$('#sendButton').attr('disabled', true);
		}
		else {
			$('#sendButton').attr('disabled', false);
		}
	});*/

	$('#sendtokenButton').click(function () {
		//
	});

	$('#resetButton').click(function () {
		localStorage.setItem(reset, true);
		localStorage.clear();
		ResetTextArea();
	});
}


function SendData()
{
	var data = $('#sendTextArea').val();
		
	if (data.length != 0)
	{
		var token = {
			//id: id,
		};

		localStorage.setItem(tokenObject, token);
	}
}

function ReceiveData(event)
{
	if (event.key == tokenObject)
	{
		//
	}
	else if (event.key == reset)
	{
		ResetTextArea();
	}
}


function AddText(textAreaName, text)
{
	var textArea = $(textAreaName);
	$(textAreaName).val(textArea.val() + text);
}

function ResetTextArea()
{
	$('#systemTextArea').val("");
	$('#receiveTextArea').val("");
	Sleep(Math.random() * 1000);		// Sleeping for good activation.
	window.location.reload();
}

function ClearSendTextArea()
{
	$('#sendtokenButton').attr('disabled', true);
	$('#sendTextArea').val("");
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