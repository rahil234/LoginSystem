function myalert(alertmsg){
  const alertdiv = document.querySelector('.alert')
  alertdiv.innerText = alertmsg
  alertdiv.style.display = 'block'
}

document
  .getElementById("adminform")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if(username.length < 1 && password.length < 1){
     myalert("Username && Password is required")
    }
    else{
      this.submit();
    }

  });
