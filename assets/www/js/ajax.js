var auth_token = "";

$(document).on("pageinit", "#mainpage", function(){
	console.log("Page AJax init " + auth_token);
	$.ajaxSetup({
		      "error":function() { console.error("error");  }
	});
	//$("#footertitle").html(device.platform);

	$(".geobtn").bind('click',function(){
		if(auth_token == ""){
			alert("login first");
			return;
		}
		navigator.geolocation.getCurrentPosition(function(position){
			var s = 'Latitude: '          + position.coords.latitude          + '\n' +
				'Longitude: '         + position.coords.longitude         + '\n' +
				'Altitude: '          + position.coords.altitude          + '\n' +
				'Accuracy: '          + position.coords.accuracy          + '\n' +
				'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
				'Heading: '           + position.coords.heading           + '\n' +
				'Speed: '             + position.coords.speed             + '\n' +
				'Timestamp: '         + position.timestamp                + '\n';
			console.log(s);
			var request = $.ajax({
				url: "http://59.66.131.21:3000/api/v1/updategeo.json?auth_token="+auth_token,
			    type: "POST",
			    data: JSON.stringify({latitude: position.coords.latitude, 
				    longitude: position.coords.longitude}),
			    dataType: "json",
			    contentType:"application/json; charset=utf-8",
			});
			request.done(function(msg){
				console.log(msg);
			});
			request.fail(function(jqXHR, textStatus) {
				alert( "Request failed: " + jqXHR.responseText);
			});


		},
		function(){
			console.error("geo");
		});
		});
		$(document).off("click", "#login-ok").on("click", "#login-ok", function(){
			console.log($("#email").val());
			var request = $.ajax({
				url: "http://59.66.131.21:3000/api/v1/sessions",
			    type: "POST",
			    data: JSON.stringify({user:{email: $("#email").val(), password: $("#pass").val() } }),
			    dataType: "json",
			    contentType:"application/json; charset=utf-8",
			});

			request.done(function(msg) {
				console.log(msg);
				auth_token = msg.data.auth_token;
				$.getJSON('http://59.66.131.21:3000/api/v1/tasks.json?auth_token='+auth_token, function(data) {
					console.log(data);
					$.each(data.data.tasks, function(i,val){
						$("#tasklist").append('<li><a href="#">'+val.title+'</a></li>').listview('refresh');
					});
					});

			});

			request.fail(function(jqXHR, textStatus) {
				alert( "Request failed: " + jqXHR.responseText);
			});
		});
});
