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

var audio = new Audio("data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");



var keyfound = false;

  document.getElementById("code_input").addEventListener("focus", AudioClickTest);
  document.getElementById("codeCheck").addEventListener("submit", SubmitcheckCode);
  document.getElementById("SaveUserData").addEventListener("submit", SaveUserData);

  document.querySelector("#SaveUserData").style.display = "none";
  document.querySelector("#unity-container").style.display = "none";

var code_input;
var email_passed; //pass this email to unity so unity can send data

function SaveUserData(e) {
  e.preventDefault();

  name_input = getElementVal("name_input");
  email_input = getElementVal("email_input");
  companyname_input = getElementVal("company_input");


 SaveUserDataInDB(name_input,email_input,companyname_input);
}


function SubmitcheckCode(e) {
e.preventDefault();

code_input = getElementVal("code_input");

CheckCode(code_input);

}

function AudioClickTest() {
console.log("clicl event triggerd");// audio will load and then play

audio.play(); 
};


function CheckCode(code) {
firebase.database().ref('company_codes').once('value',   function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    var childKey = childSnapshot.key;
    
    if(childKey == code){
              document.querySelector("#codeCheck").style.display = "none";
              document.querySelector("#SaveUserData").style.display = "block";
              document.querySelector('.container').classList.add("background-block");
      
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
}

const getElementVal = (id) => {
  return document.getElementById(id).value;
};



function SaveUserDataInDB(username, email,companyname) {

  if(username == null || email == "" || companyname == "")
    return;

  //search for email if found: pass : else : create account
  var editedEmail = email.replace(/\./g, ",");

  firebase.database().ref(`company_codes/${code_input}/users`).once("value").then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
    var childKey = childSnapshot.key;
    console.log(childKey);

    if(childKey == editedEmail)
    {
      console.log("found email");
        email_passed = email;
              document.querySelector("#SaveUserData").style.display = "none";
              document.querySelector("#unity-container").style.display = "block";
              startUnityGame();
              audio.src = "/sounds/Retro_Single_v1_wav.wav";
              return;
    }
  })
  email_passed = email;
  var User = {
            username: username,
            email: email,
            company_name: companyname,
  };

  firebase.database().ref(`company_codes/${code_input}/users/${editedEmail}`).set(User);
  document.querySelector("#SaveUserData").style.display = "none";
  document.querySelector("#footer").style.display = "none";
  document.querySelector("#unity-container").style.display = "block";
  startUnityGame();
  audio.src = "/sounds/Retro_Single_v1_wav.wav";

  })
    
}




//UNITY

var container = document.querySelector("#unity-container");
var canvas = document.querySelector("#unity-canvas");
var loadingBar = document.querySelector("#unity-loading-bar");
var progressBarFull = document.querySelector("#unity-progress-bar-full");
var fullscreenButton = document.querySelector("#unity-fullscreen-button");
var warningBanner = document.querySelector("#unity-warning");
var unityins;


function unityShowBanner(msg, type) {
function updateBannerVisibility() {
  warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
}
var div = document.createElement('div');
div.innerHTML = msg;
warningBanner.appendChild(div);
if (type == 'error') div.style = 'background: red; padding: 10px;';
else {
  if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
  setTimeout(function() {
    warningBanner.removeChild(div);
    updateBannerVisibility();
  }, 5000);
}
updateBannerVisibility();
}

var buildUrl = "Build";
var loaderUrl = buildUrl + "/public.loader.js";
var config = {
dataUrl: buildUrl + "/public.data",
frameworkUrl: buildUrl + "/public.framework.js",
codeUrl: buildUrl + "/public.wasm",
streamingAssetsUrl: "StreamingAssets",
companyName: "DefaultCompany",
productName: "Odel",
productVersion: "1.0",
showBanner: unityShowBanner,
};

// By default Unity keeps WebGL canvas render target size matched with
// the DOM size of the canvas element (scaled by window.devicePixelRatio)
// Set this to false if you want to decouple this synchronization from
// happening inside the engine, and you would instead like to size up
// the canvas DOM size and WebGL render target sizes yourself.
// config.matchWebGLToCanvasSize = false;

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
// Mobile device style: fill the whole browser client area with the game canvas:

var meta = document.createElement('meta');
meta.name = 'viewport';
meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
document.getElementsByTagName('head')[0].appendChild(meta);
container.className = "unity-mobile";
canvas.className = "unity-mobile";

// To lower canvas resolution on mobile devices to gain some
// performance, uncomment the following line:
// config.devicePixelRatio = 1;

//unityShowBanner('WebGL builds are not supported on mobile devices.');
} else {
// Desktop style: Render the game canvas in a window that can be maximized to fullscreen:

canvas.style.width = "960px";
canvas.style.height = "600px";
}

loadingBar.style.display = "block";

function startUnityGame() {

var edited_Email = email_passed.replace(/\./g, ",");

  unityins.SendMessage('DataManager', 'GetCompanyCode', `${code_input}`);
  unityins.SendMessage('DataManager', 'GetUserCode', `${edited_Email}`);

}


var script = document.createElement("script");
script.src = loaderUrl;
script.onload = () => {
createUnityInstance(canvas, config, (progress) => {
  progressBarFull.style.width = 100 * progress + "%";
}).then((unityInstance) => {
  loadingBar.style.display = "none";    
  unityins = unityInstance;
  
  // fullscreenButton.onclick = () => {
  //   unityInstance.SetFullscreen(1);
  // };
})
};
document.body.appendChild(script);


function inputChange(description){
  if(description === 'codeCheck'){
    var flag = document.getElementById('code_input').value === '' ? false : true;
    if(flag) document.getElementById('code_btn').style.opacity = 1;
    else document.getElementById('code_btn').style.opacity = 0.5;
  }
  else{
    var flag = (document.getElementById('name_input').value === '' ? false : true) || 
        (document.getElementById('email_input').value === '' ? false : true) || 
        (document.getElementById('company_input').value === '' ? false : true);
    if(flag) document.getElementById('save_btn').style.opacity = 1;
    else document.getElementById('save_btn').style.opacity = 0.5;
  }
}


function PlayAudio(){

audio.play();
}