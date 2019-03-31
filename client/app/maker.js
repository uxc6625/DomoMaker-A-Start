const handlePassword = (e) => {
  e.preventDefault();
  $("#domoMessage").animate({width:'hide'},350);
  
  if($("#oldPass").val() == '' || $("#pass").val() == '' || $("pass2").val() == '') {
    handleError("RAWR: All fields are required");
	return false;
  }
  
  if($("#pass").val() !== $("#pass2").val()) {
    handleError("RAWR: Passwords do not match");
	return false;
  } 

  sendAjax('POST', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), redirect);

  return false;
};  



const PasswordWindow = (props) => {
  return (
    <form id="passwordForm"
	  name="passwordForm"
	  onSubmit={handlePassword}
	  action="/passwordChange"
	  method="POST"
	  className="mainForm"
	>
	  <label htmlFor="oldPass">Old Password: </label>
	  <input id="oldPass" type="password" name="oldPass" placeholder="old passwold"/>
	  <label htmlFor="pass">Password: </label>
	  <input id="pass" type="password" name="pass" placeholder="password"/>
	  <label htmlFor="pass2">Password: </label>
	  <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
	  <input type="hidden" name="_csrf" value={props.csrf} />
	  <input className="formSubmit" type="submit" value="Submit" />
	
	</form>
  );
};


const createPasswordWindow = (csrf) => {
	
  ReactDOM.render(
    <div />, document.querySelector("#makeDomo")
  );
  
  ReactDOM.render(
    <div />, document.querySelector("#domos")
  );
	
  ReactDOM.render(
    <PasswordWindow csrf={csrf} />,
	document.querySelector("#content")
  );
};

const createDomoWindow = (csrf) => {
  ReactDOM.render(
    <div />, document.querySelector("#content")
  );
	
  ReactDOM.render(
    <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
  );
  
  ReactDOM.render(
    <DomoForm domos={[]} />, document.querySelector("#domos")
  );
  
  loadDomosFromServer();
};

const handleDomo = (e) => {
  e.preventDefault();
  
  $("#domoMessage").animate({width:'hide'},350);
  
  if($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoLevel").val() == '') {
    handleError("RAWR! All fields are required");
	return false;
  };
  
  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
	loadDomosFromServer();
  });
  
  return false;
};

const DomoForm = (props) => {
  return (
    <form id="domoForm"
	  onSubmit={handleDomo}
	  name="domoForm"
	  action="/maker"
	  method="POST"
	  className="domoForm"
	>
	  <label htmlFor="name">Name: </label>
	  <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
	  <label htmlFor="age">Age: </label>
	  <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
	  <label htmlFor="level">Level: </label>
	  <input id="domoLevel" type="text" name="level" placeholder="Domo Level"/>
	  <input type="hidden" name="_csrf" value={props.csrf} />
	  <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
	</form>
  );
};

const DomoList = function(props) {
  if(props.domos.length === 0) {
    return (
	  <div className="domoList">
	    <h3 className="emptyDomo">No Domos yet</h3>
      </div>
	);
  }
  
  const domoNodes = props.domos.map(function(domo) {
    return (
	  <div key={domo._id} className="domo">
	    <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
		<h3 className="domoName"> Name: {domo.name} </h3>
		<h3 className="domoAge"> Age: {domo.age} </h3>
		<h3 className="domoLevel"> Level: {domo.level} </h3>
	  </div>
    );
  });
  
  return (
    <div className="domoList">
	  {domoNodes}
	</div>
  );
};

const loadDomosFromServer = () => {
  sendAjax('GET', '/getDomos', null, (data) => {
    ReactDOM.render(
      <DomoList domos={data.domos} />, document.querySelector("#domos")
    );
  });
};

const setup = function(csrf) {
  const passwordButton = document.querySelector("#passwordButton");
  const domoButton = document.querySelector("#maker");
  
  passwordButton.addEventListener("click", (e) => {
    e.preventDefault();
	createPasswordWindow(csrf);
	return false;
  });
  
  domoButton.addEventListener("click", (e) => {
    e.preventDefault();
	createDomoWindow(csrf);
	return false;
  });
	
  createDomoWindow(csrf); //default view
  
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});
