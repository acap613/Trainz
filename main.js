$(document).ready(function() {
   
  var firebaseConfig = {
    apiKey: "AIzaSyDJLjE4mq3AMAUr0qzZFFuuEm4mzKG00Ug",
    authDomain: "train-scheduler-180f6.firebaseapp.com",
    databaseURL: "https://train-scheduler-180f6.firebaseio.com",
    projectId: "train-scheduler-180f6",
    storageBucket: "train-scheduler-180f6.appspot.com",
    messagingSenderId: "872476948307",
    appId: "1:872476948307:web:2cbe063477325ee0e0d3a6"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
    
  var database = firebase.database();
//====================================================================
//==============START CODE============================================
//====================================================================  
  
  $("#submitBtn").on('click', function(event){
    event.preventDefault();
    //initial variables: train, train time, destination, frequency
    var trainName = $("#train-name").val().trim();
    var trainDest = $("#train-dest").val().trim();
    var firstTrain = moment($("#first-train").val().trim(), "HH:mm");
    var trainFrequency = parseInt($("#train-frequency").val().trim());
  
//====================================================================
//==============CHECK FOR VALIDATION==================================
//====================================================================

    if (trainName.length === 0) {
      trainName = "";
      //train name, dest, firstTrain, trainFrequency:
      $("#train-name").val("");
      $("#train-name").attr("class", "form-control is invalid");
      $("#invalid-name").text("Please enter the name of your Train");
    } else {
      $("#train-name").attr("class", "form-control");
      $("#invalid-name").text("");
    };
    if (trainDest.length === 0) {
      trainDest = ""; 
      $("#train-dest").val("");
      $("#train-dest").attr("class", "form-control is invalid");
      $("#invalid-dest").text("Please enter the destination of your Train");
    } else {
      $("#train-dest").attr("class", "form-control");
      $("#invalid-dest").text("");
    };
    if (moment(firstTrain).isValid() === false) {
      firstTrain = ""; 
      $("#first-train").val("");
      $("#first-train").attr("class", "form-control is invalid");
      $("#invalid-time").text("Please enter the first time of your Train");
    } else {
      $("#first-train").attr("class", "form-control");
      $("#invalid-time").text("");
    };
    if (Number.isInteger(trainFrequency) === false) {
      $("#train-frequency").val("");
      $("#train-frequency").attr("class", "form-control is invalid");
      $("#invalid-frequency").text("Please enter the frequency of your Train");
    } else {
      $("#train-frequency").attr("class", "form-control");
      $("#invalid-frequency").text("");
    };
  
//=========================================================================

  var trainInput = {
    name: trainName,
    destination: trainDest,
    firstTime: firstTrain.format("HH:mm"),
    frequency: trainFrequency,
  };

//==========================================================================
//==============ADD TRAIN INFO==============================================
//==========================================================================

    database.ref().push(trainInput);

    $("#train-name").val("");
    $("#train-destination").val("");
    $("#train-first-time").val("");
    $("#train-frequency").val("");

  });

  database.ref().on("child_added", function(childSnapshot) {
  
    var trainName = (childSnapshot.val().name);
    var trainDest = (childSnapshot.val().destination);
    var firstTrain = (childSnapshot.val().firstTime)
    var trainFrequency = (childSnapshot.val().frequency);
    //lets do the math
    
    //if...
    // 16 - 00 = 16
    // 16 % 3 = 1 (Modulus is the remainder)
    // 3 - 1 = 2 minutes away
    // 2 + 3:16 = 3:18
    var convertedTime = moment(firstTrain, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(convertedTime), "minutes");
    var timeRem = diffTime % trainFrequency;
    var minutesAway = trainFrequency - timeRem;
    var nextArrival = moment().add(minutesAway, "minutes");

    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDest),
      $("<td>").text(trainFrequency),
      $("<td>").text(nextArrival.format("HH:mm")),
      $("<td>").text(minutesAway),
     
  );
      $("#full-table").append(newRow);
      $("<td>").onclick(function(){
        $(this).closest("<td>").remove();
      });

  });

  //adding delete button for completion
  $( "button" ).click(function() {
    $( "p" ).remove();
  });

});