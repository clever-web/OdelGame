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


firebase.database().ref('users').set({code:4545,code2:5645,code3:4745});

var keyfound = false;

    document.getElementById("codeCheck").addEventListener("submit", SubmitcheckCode);
    document.getElementById("SaveUserData").addEventListener("submit", SaveUserData);

    document.querySelector("#SaveUserData").style.display = "none";
    document.querySelector("#unity-container").style.display = "none";

var code_input;


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



function CheckCode(code) {
firebase.database().ref('users').once('value',   function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      
      if(childData == code){
        keyfound = true
        //
        document.querySelector("#codeCheck").style.display = "none";
        document.querySelector("#SaveUserData").style.display = "block";

        console.log("found login key");
        return;
      }
      else if(childKey == code) {
        document.querySelector("#unity-container").style.display = "block";

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

    firebase.database().ref('users').once('value',   function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          
          if(childData == code_input){
            //firebase.database().ref('users').child(childKey).set({name:"Hello"});
            firebase.database().ref('users').child(childKey).remove();
            firebase.database().ref('users').child(childData).set({ 
                username: username,
                email: email,
                companyname: companyname
              });


              document.querySelector("#SaveUserData").style.display = "none";
              document.querySelector("#unity-container").style.display = "block";

              startUnityGame();


            return;
          }
        });
      });
    }




//UNITY

var container = document.querySelector("#unity-container");
var canvas = document.querySelector("#unity-canvas");
var loadingBar = document.querySelector("#unity-loading-bar");
var progressBarFull = document.querySelector("#unity-progress-bar-full");
var fullscreenButton = document.querySelector("#unity-fullscreen-button");
var warningBanner = document.querySelector("#unity-warning");
var unityins;

// Shows a temporary message banner/ribbon for a few seconds, or
// a permanent error message on top of the canvas if type=='error'.
// If type=='warning', a yellow highlight color is used.
// Modify or remove this function to customize the visually presented
// way that non-critical warnings and error messages are presented to the
// user.
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

var script = document.createElement("script");
script.src = loaderUrl;
script.onload = () => {
  createUnityInstance(canvas, config, (progress) => {
    progressBarFull.style.width = 100 * progress + "%";
  }).then((unityInstance) => {
    loadingBar.style.display = "none";    
    unityins = unityInstance;

    unityInstance.SendMessage('MainCamera', 'ShowText', `${code_input}`);

    if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      unityInstance.SetFullscreen(1);
    }
    fullscreenButton.onclick = () => {
      unityInstance.SetFullscreen(1);
    };
  }).catch((message) => {
    alert(message);
  });
};
document.body.appendChild(script);
}
