    function showbox() {
      document.getElementById('c-form').classList.add('show');
    }

    function hidebox() {
      document.getElementById('c-form').classList.remove('show');
    }
    function shb() {
      document.getElementById('bully').classList.add('show');
    }

    function hhb() {
      document.getElementById('bully').classList.remove('show');
    }
 

   let nav = document.querySelector("nav");
   let val;
   window.onscroll = function() {
      if(document.documentElement.scrollTop > 20){
         nav.classList.add("sticky");
      }
      else{
         nav.classList.remove("sticky");
      }  
   }

 

    function resetMessageBoxColor() {
    	var messageBox = document.getElementById("message");
    	messageBox.style.backgroundColor = "beige";
    	messageBox.style.color = "green";
    }

    function getPageUrl() {
    	return window.location.href;
    }

    document.getElementById("form").addEventListener("submit", function(e) {
    	e.preventDefault();
    	resetMessageBoxColor();
    	var messageBox = document.getElementById("message");
    	messageBox.textContent = "Submitting..";
    	messageBox.style.display = "block";
    	document.getElementById("submit-button").disabled = true;

    	var currentDate = new Date();
    	var day = String(currentDate.getDate()).padStart(2, "0");
    	var month = String(currentDate.getMonth() + 1).padStart(2, "0");
    	var year = currentDate.getFullYear();
    	var hours = String(currentDate.getHours()).padStart(2, "0");
    	var minutes = String(currentDate.getMinutes()).padStart(2, "0");
    	var seconds = String(currentDate.getSeconds()).padStart(2, "0");
    	var timestamp = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    	document.querySelector('input[name="Timestamp"]').value = timestamp;
    	document.querySelector('input[name="PageUrl"]').value = getPageUrl();

    	var formData = new FormData(this);

    	fetch("https://api.web3forms.com/submit", {
    		method: "POST",
    		body: formData
    	}).then(function(response) {
    		if (response.ok) {
    			return response.json();
    		} else {
    			throw new Error("Failed to submit the form.");
    		}
    	}).then(function(data) {
    		messageBox.textContent = "Message Submitted Successfully!";
    		messageBox.style.backgroundColor = "green";
    		messageBox.style.color = "beige";
    		document.getElementById("submit-button").disabled = false;
    		document.getElementById("form").reset();

    		setTimeout(function() {
    			messageBox.textContent = "";
    			messageBox.style.display = "none";
    			// Hide additional fields if necessary
    			var numberField = document.querySelector(".phoneField");
    			if (numberField) numberField.style.display = "none";
    			var supportField = document.querySelector(".supportfield");
    			if (supportField) supportField.style.display = "none";
    		}, 2000);
    	}).catch(function(error) {
    		console.error(error);
    		messageBox.textContent = "An error occurred while submitting the form.";
    	});
    });
