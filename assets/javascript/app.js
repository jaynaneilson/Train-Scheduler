$(document).ready(function() {

  // Initialize Firebase

   var config = {
    apiKey: "AIzaSyA13ioGEfPA6DuzpUcXysrDEbqIjJZq794",
    authDomain: "train-scheduler-choo.firebaseapp.com",
    databaseURL: "https://train-scheduler-choo.firebaseio.com",
    projectId: "train-scheduler-choo",
    storageBucket: "train-scheduler-choo.appspot.com",
    messagingSenderId: "875028537304"
  };

  firebase.initializeApp(config);

  //Create a variable to reference the database

  var database = firebase.database();

  //Button for submitting new train info

  $("#submitButton").on("click", function(event) {

    //prevent button reset
    event.preventDefault();

    // Capture User Inputs and store them into variables
    var trainName = $("#trainNameForm").val().trim();
    var destination = $("#destinationForm").val().trim();
    var firstTrain = $("#firstTrainForm").val().trim();
    var frequency = $("#frequencyForm").val().trim();

    //Makes sure User fills out all form input
    if (trainName == "") {
        alert('Enter a train name.');
        return false;
    };

    if (destination == "") {
        alert('Enter a destination.');
        return false;
    };

    if (firstTrain == "") {
        alert('Enter a first train time.');
        return false;
    };

    if (frequency == "") {
        alert('Enter a frequency');
        return false;
    };

    //Push
      database.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency,
    });

  //Clear Forms
  $("#trainNameForm").val("");
  $("#destinationForm").val("");
  $("#firstTrainForm").val("");
  $("#frequencyForm").val("");

  return false;

});

// Firebase event for appending train into database and html
  database.ref().limitToLast(1).on("child_added", function(childSnapshot) {

    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var firstTrain = childSnapshot.val().firstTrain;
    var frequency = childSnapshot.val().frequency;


    var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
    var currentTime = moment();

    // the time difference between current time and the first train
    var difference = currentTime.diff(moment(firstTrainConverted), "minutes");
    var remainder = difference % frequency;
    var minUntilTrain = frequency - remainder;
    var nextTrain = moment().add(minUntilTrain, "minutes").format("hh:mm");

    $("#trainSchedule").append("<tr><td>" + trainName +
                                    "</td><td>" + destination +
                                    "</td><td>" + frequency +
                                    "</td><td>" + minUntilTrain + 
                                    "</td><td>" + nextTrain +
                                    "</td></tr>");

});
  
  });

