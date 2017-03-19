$(document).ready(function() {

$(function (combodate) {
    $("#time-input").combodate({
        firstItem: "name",
        minuteStep: 1
    });
});


// Initialize Firebase

    var config = {
        apiKey: "AIzaSyAW5nr2pa0B_RPt56WNbuhlqsUoqW9Hf78",
        authDomain: "train-scheduler-5c6c4.firebaseapp.com",
        databaseURL: "https://train-scheduler-5c6c4.firebaseio.com",
        storageBucket: "train-scheduler-5c6c4.appspot.com",
        messagingSenderId: "452078011979"
    };
    firebase.initializeApp(config);


// Create a variable to reference the database

    var database = firebase.database();

// Submit button click
    $("#submit-btn").on("click", function () {
        event.preventDefault();
        // Get user input
        var trainName = $("#train-input").val().trim();
        var destination = $("#destination-input").val().trim();
        var firstTrainTime = $("#time-input").combodate('getValue', 'HH:mm');
        //var firstTrainTime = $("#time-input").val();
        var frequency = $("#frequency-input").val().trim();



        // Create a new object and push it to the database
        var trainArray = {
            train_name: trainName,
            destination: destination,
            first_train_time: firstTrainTime,
            frequency: frequency
        }

        console.log("Train Name: " + trainArray.train_name);
        console.log("Destination: " + trainArray.destination);
        console.log("First Train Time: " + trainArray.first_train_time);
        console.log("Frequency: " + trainArray.frequency);

        if (trainName != "" && destination != "" && firstTrainTime != "" && frequency != "") {
            database.ref().push(trainArray);
        } else {
            alert("Please enter train data");
        }

        // Clear out the form fields
        $("#train-input").val("");
        $("#destination-input").val("");
        $("#time-input").combodate('setValue', ""); //unable to reset value on Submit
        //$("#time-input").val("HH:mm");
        $("#frequency-input").val("");


    });

    database.ref().on("child_added", function (childSnapshot) {


        console.log(childSnapshot.val());

        var trainName = childSnapshot.val().train_name;
        var destination = childSnapshot.val().destination;
        var firstTrainTime = childSnapshot.val().first_train_time;
        var frequency = childSnapshot.val().frequency;
        var dbKey = childSnapshot.getKey();

        // Current time
        var currentTime = moment();

        var timeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "days");

        // Get the difference between current time and first train time
        var diffTime = moment().diff(moment(timeConverted), "minutes");
        // console.log("Difference in time: " + diffTime);

        // Time apart
        var remainder = diffTime % frequency;
        // console.log("Remainder: ", remainder);

        // Minutes until the next train - calculated by subtracting the remainder from the frequency
        var minutesAway = frequency - remainder;
        console.log("Minutes Away: " + minutesAway);

        // Calculate next train arrival time
        var nextArrival = moment().add(minutesAway, "minutes");
        console.log("Next arrival: " + moment(nextArrival).format("HH:mm"));

        // Display newly added train in HTML table and assign IDs for the remove buttons
        var $newEntry = $("<tr>")
            .attr("id", dbKey)
            .append("<td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + moment(nextArrival).format("hh:mm A") + "</td><td>" + minutesAway + "</td><td><input id='removeBtn' type='button' value='Remove' class='btn btn-danger' data-key=" + dbKey + "/></td></tr>")
            .appendTo($("#train-table> tbody"));

    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code)
    });

    // Remove train function
    function removeTrain(dbbaseKey) {
        database.ref().child(dbbaseKey).remove();
    }

    // Remove buttons
    $(document).on("click", "#removeBtn", function(event) {
        $(this).closest('tr').remove();

        removeTrain($(this).attr('data-key'));
    });
});
