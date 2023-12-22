async function checkLogin(){
    console.log({'email': uname.value, 'password': pword.value})
    await fetch('/authentication/login', {
        method: 'POST',
        body: JSON.stringify({'email': uname.value, 'password': pword.value}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('ntrres').textContent = data
        switch(data){
            case "Invalid Email":
                break;
            case "Invalid Credential":
                break;
            default:
                console.log(data);
                document.getElementById('ntrres').textContent = "Succesfully logged in!"
                sessionStorage.setItem("loggedin", data.username);
                sessionStorage.setItem("token", data.jwtToken);
                window.location.replace('../index.html')

        }
        // document.getElementById('ntrres').textContent = data
        // if(data=="Succesfully logged in!"){
        //     sessionStorage.setItem("loggedin", uname.value);
        //
        //     window.location.replace('index.html')
        //     document.getElementById("topinfo").style.display = "inline"; // changes visibility of top info
        // }
        console.log(data);
    })
}

async function newUser(){
    //console.log({'email': signupemail.value, 'username': signupuname.value, 'password': signuppword.value})
    var info = [signupemail.value, signupuname.value, signuppword.value];
    if(info.includes("")){
        alert("Please complete the form.")
        return;
    }
    if(!validEmail(signupemail.value)){
        alert("Please enter a valid email address!")
        return;
    }
    await fetch('/authentication/register', {
        method: 'POST',
        body: JSON.stringify({'name': signupuname.value, 'email': signupemail.value,  'password': signuppword.value}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(data => {
        console.log(data);
        console.log(data.status == 401)
        switch(data.status){
            case 401:
                alert("Email or Username already in use!");
                break;
            default:
                sessionStorage.setItem("loggedin", signupuname.value);
                sessionStorage.setItem("token", data.jwtToken);
                window.location.replace('../index.html')
        }
    })
}

function validEmail(email){
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function signup_open(){
    document.getElementById('signup').style.display = "block";
}

function signup_close(){
    document.getElementById('signup').style.display = "none";
}