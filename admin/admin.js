const firebaseConfig = {
  apiKey: "AIzaSyCxp4atiQ9MZvQ3YXpg3SMBojK1qHUx6yc",
  authDomain: "odeldatabase.firebaseapp.com",
  databaseURL: "https://odeldatabase-default-rtdb.firebaseio.com",
  projectId: "odeldatabase",
  storageBucket: "odeldatabase.appspot.com",
  messagingSenderId: "414069069424",
  appId: "1:414069069424:web:8052dc8833c892f1e646b5",
  measurementId: "G-D88FD0SVWR"
};

// initialize firebase
firebase.initializeApp(firebaseConfig);




function exportData(){
	var table2excel = new Table2Excel();
  table2excel.export(document.querySelectorAll("table.table"));	
}


document.onkeydown = function (e) {


  firebase.database().ref('company_codes').once('value',   function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childKey = childSnapshot.key;
      
      if(childKey == code){
                document.querySelector("#codeCheck").style.display = "none";
                document.querySelector("#SaveUserData").style.display = "block";
        
                console.log("found company login key");
                audio.play();
                return;
      }
    });



    if(!keyfound){
        //   enable alert
        document.querySelector(".alert").style.display = "block";

        //   remove the alert
        setTimeout(() => {
            document.querySelector(".alert").style.display = "none";
        }, 3000);

        document.getElementById("codeCheck").reset();
    }
  });
















// Find a <table> element with id="myTable":
var table = document.getElementById("table_content");

// Create an empty <tr> element and add it to the 1st position of the table:
var row = table.insertRow(0);

// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
var email = row.insertCell(0);
var username = row.insertCell(1);
var company = row.insertCell(2);
var q1_score = row.insertCell(3);
var q2_score = row.insertCell(4);
var q3_score = row.insertCell(5);
var q4_score = row.insertCell(6);
var q5_score = row.insertCell(7);

// Add some text to the new cells:
email.innerHTML = "NEW CELL1";
username.innerHTML = "NEW CELL1";
company.innerHTML = "NEW CELL1";
q1_score.innerHTML = "NEW CELL1";
q2_score.innerHTML = "NEW CELL1";
q3_score.innerHTML = "NEW CELL1";
q4_score.innerHTML = "NEW CELL1";
q5_score.innerHTML = "NEW CELL1";


};