global.$ = require("jquery");
require("bootstrap");

//pull out that api key big boy

import {apikey as key} from './config.js';

//weirdly enough, webpack doesn't recognize this
//import { key } from 'config.js';

//global arrays to hold stop names - not really a big need to get them through an API request if the orange line doesn't change
//still possible to grab them through a request though
var orange_stops =
    [ 
        "place-forhl",
        "place-grnst",
        "place-sbmnl",
        "place-jaksn",
        "place-rcmnl",
        "place-rugg",
        "place-masta",
        "place-bbsta",
        "place-tumnl",
        "place-chncl",
        "place-dwnxg",
        "place-state",
        "place-haecl",
        "place-north",
        "place-ccmnl",
        "place-sull",
        "place-astao",
        "place-welln",
        "place-mlmnl",
        "place-ogmnl"
    ];


var orange_inbound;
var orange_outbound;

//variable to wait for ajax
var get_orange = false;

$(document).ready(function () {
    console.log("getting alerts");
    //Orange Line Alerts
    getAlerts('Orange');
    //Orange Line Departure Predictions
    console.log("getting times");
    //get the schedule table built    
    buildOrangeSchedule();

});

//AJAX  helpers
//Gets a predicted time of departure for a specific stop in a specific direction 
function getStop(stop_name, direction_id, routename) {
    var api_url = 'https://api-v3.mbta.com/predictions';
    var api_key = "?api_key=" + key;
    var stop = '&filter[stop]=' + stop_name;
    var direction = '&filter[direction_id]=' + direction_id;
    var results = "&page[limit]=1";
    var route = "&filter[route]=" + routename;
    var includename = "&include=stop";

    $.ajax(
        {
            type: 'GET',
            url: api_url + api_key + stop + direction + results + includename,
            contentType: 'application/json',
            dataType: 'json',
            success: function (data) {
            	console.log(data);
                //send straight to response handler
            	callbackgetStop(data);

                // //push it into an object array to process later
                // var time = data.data[0].attributes.arrival_time.split('T');
                // console.log(time[1]);
                // var direction = data.data[0].attributes.direction_id;
                // if(direction == "0") {
                //     orange_inbound.push(time[1]); 
               // } else {
                //     orange_outbound.push(time[1]);
                // }
            }
        }).fail(function () {
            // alert("Time fail!");
            //notime

            //ideally, if this fails should send a 'Could not retrieve' message to the table

        });
}

//Gets the alerts for a specific route
function getAlerts(route) {
    var api_url = 'https://api-v3.mbta.com/alerts';
    var api_key = "?api_key=" + key;
    var specificroute = "&filter[route]=" + route;
    $.ajax(
        {
            type: 'GET',
            url: api_url + api_key + specificroute,
            contentType: 'application/json',
            dataType: 'json',
            success: function (data) {
                // alert("Alerts success!");
                callbackAlerts(data);
            }
        }).fail(function () {
            // alert("Alerts Fail!");
            //noalert
        });
}

//Should try to build the HTML structure of the schedule
//At the same time, create empty <td> elements with specific ids 
//to have a place to inject the data into when the response comes back
function buildOrangeSchedule() {
    //get initial area to play in
    var schedule = document.getElementById("orangetable");
    var body = document.createElement('tbody');

    //loop through our stop list here
    var i;
    for(i = 0; i < orange_stops.length; i++) {
        //build each row with the order 'stopname/inbound time/ outbound time'
        var stop = document.createElement('tr');

        var stopname = document.createElement('td');
        stopname.innerHTML = "...";
        stopname.setAttribute("id", orange_stops[i]+"-name");
        stop.appendChild(stopname);

        var inboundtime = document.createElement('td');
        inboundtime.innerHTML = "...";
        inboundtime.setAttribute("id", orange_stops[i]+"-in");
        getStop(orange_stops[i], '0', 'orange');
        stop.appendChild(inboundtime);

        var outboundtime = document.createElement('td');
        outboundtime.innerHTML = "...";
        outboundtime.setAttribute("id", orange_stops[i]+"-out");
        getStop(orange_stops[i], '1', 'orange');
        stop.appendChild(outboundtime);

        body.appendChild(stop);
    }

    //clean it up and put the body where it should be
    schedule.appendChild(body);
}


// Helper Functions


function callbackAlerts(data) {
    var node = document.getElementById("orangealerts");
    var alerts;
    for (alerts in data.data) {
        // console.log(data.data[alerts].attributes.cause);
        addData('h3', data.data[alerts].attributes.effect, node);
        addData('p', data.data[alerts].attributes.header, node);
    }
}

function callbackgetStop(data) {
    //handling the returned data from the AJAX

    var elementid;

    //finding direction 
	var direction = data.data[0].attributes.direction_id;
	if(direction == 0) { //inbound 
		elementid = data.included[0].relationships.parent_station.data.id + "-in";      
	} else { //outbound 
        elementid = data.included[0].relationships.parent_station.data.id + "-out";
	} 

    //injecting full name from the response
    // !!! will probably be overwritten twice, but not too big of an issue
    var stopname = data.included[0].attributes.name;
    var stopelement = document.getElementById(data.included[0].relationships.parent_station.data.id+ "-name");
    stopelement.innerHTML = stopname;


    //injecting time into targetted html element
    //TODO: add parser or interpreter for time in 12H format
    var departtime = data.data[0].attributes.departure_time;
    var arrivetime = data.data[0].attributes.arrival_time;
    if((departtime != null) && (arrivetime != null)) {
        var time = arrivetime;
    } else {
        var time = departtime;
    }
    var target = document.getElementById(elementid);
    target.innerHTML = time;

	// var stop = data.included[0].attributes.name;
	// stop = stop.split(' ').join('');
	// console.log(stop);
	// var node = document.getElementById(stop);

	// console.log("trying to input stop time data");
	// var time = data.data[0].attributes.departure_time.split('T');
	// console.log(time[1]);
	// addData('p3', direction + time[1], node);
}

// function displayData(data) {
//     //ajax call passed Json obj instead of json string so no need to parse
//     var node = document.getElementById("orangeschedule");
//     addData('p', data.data.attributes.direction_names[0] + " : " + data.data.attributes.direction_destinations[0], node);
//     addData('p', data.data.attributes.direction_names[1] + " : " + data.data.attributes.direction_destinations[1], node);
// }

function addData(char, info, node) {
    var element = document.createElement(char);
    element.appendChild(document.createTextNode(info));
    node.appendChild(element);
}