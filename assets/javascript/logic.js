


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
$("#submit-btn").on("click", function() {
    event.preventDefault();

    var trainName = $("#train-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrainTime = $("#time-input").val().trim();
    var frequency = $("#frequency-input").val().trim();


    // Create a new object and push it to the database
    var trainArray = {
        train_name: trainName,
        destination: destination,
        first_train_time: firstTrainTime,
        frequency: frequency
    }


    database.ref().push(trainArray);
    alert("Train successfully added");

    // Clear out the form fields
    $("input").val("");

    console.log("Train Name: " + trainArray.train_name);
    console.log("Destination: " + trainArray.destination);
    console.log("First Train Time: " + trainArray.first_train_time);
    console.log("Frequency: " + trainArray.frequency);

});

database.ref().on("child_added", function(childSnapshot){


    console.log(childSnapshot.val());

    var trainName = childSnapshot.val().train_name;
    var destination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().first_train_time;
    var frequency = childSnapshot.val().frequency;

    var timeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "days");

    var currentTime = moment();

    // Get the difference between current time and first train time
    diffTime = moment().diff(moment(timeConverted), "minutes");
    // console.log("Difference in time: " + diffTime);

    // Time apart
    var remainder = diffTime % frequency;
    // console.log("Remainder: ", remainder);

    // Minutes until the next train calculated by subtracting the remainder from the frequency
    var minutesAway = frequency - remainder;
    console.log("Minutes Away: " + minutesAway);

    // Calculate next train arrival time
    var nextArrival = moment().add(minutesAway, "minutes");
    console.log("Next arrival: " + moment(nextArrival).format("HH:mm"));

    $("#train-table> tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + moment(nextArrival).format("hh:mm A") + "</td><td>" + minutesAway);

}, function(errorObject){
    console.log("Errors handled: " + errorObject.code)
});
