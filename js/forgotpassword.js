async function update() {
  await fetch("/getPassword", {
    method: "POST",
    body: JSON.stringify({ email: email.value, username: uname.value }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data == "No User") {
        alert("User with that email or username does not exist...");
        return;
      }
      window.location.replace("login.html");
      alert("Your password is " + data);
    });
}
