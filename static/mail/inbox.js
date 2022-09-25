var region ='';
var isReply=false;
var isSubject=false;
var isBody=false;

document.addEventListener('DOMContentLoaded', function() {
  
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#reply').addEventListener('click', reply);
  document.querySelector('#archive-btn').addEventListener('click', archive);
  document.querySelector('#unarchive-btn').addEventListener('click', unarchive);
  
  
  document.querySelector('form').onsubmit = send_email;
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  //console.log('compose email');
  console.log("--------------");
  console.log(isReply);
  console.log("--------------");
  console.log(isSubject);

  // Show compose view and hide other views
  document.querySelector('#message-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  

  // Clear out composition fields
  document.querySelector('#compose-body').value = '';

  if(isReply==true){
    document.querySelector('#compose-recipients').value=document.getElementById('sender').innerHTML;
    
  }else{
    
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
  }
  if(isSubject==true){
    let email = document.getElementById('Subject').innerHTML

    console.log(email.slice(0,3))

    if(email.slice(0,3) != "Re:"){
    document.querySelector('#compose-subject').value= "Re: " + email;
    }
    else{
      document.querySelector('#compose-subject').value=email;
    }
  }else{
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
  }
  if(isBody==true){
    let body = document.getElementById('message').innerHTML
    let sender = document.getElementById('sender').innerHTML
    let timestamp = document.getElementById('timestamp').innerHTML

    document.querySelector('#compose-body').value= `On  `+  timestamp + ' ' +  sender  + `  wrote:  ` + body ;
    
  }else{
    
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-body').value = '';
  }

}

function reply(){
    //get subject
    isSubject=true;
    var receiver=document.getElementById('Subject').innerHTML;
    console.log(receiver);
    //get sender and receiver
    isReply=true;
    var receiver=document.getElementById('sender').innerHTML;
    console.log(receiver);
    //get body
    isBody=true;
    var receiver=document.getElementById('message').innerHTML;
    console.log(receiver);

  
    // populate fields with email information

    compose_email();
}

function load_mailbox(mailbox) {
   

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#message-view').style.display = 'none';


  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  console.log(mailbox);
  console.log("------");

  if (mailbox=='inbox'){
    
    region = 'inbox';
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(result =>{
     // console.log(result);
      appendData(result);
  
    });

  }
  if(mailbox=='sent'){
 
    region = "sent";
    if(isReply==true){
      isReply=false;
    }
    console.log("--------------");
    console.log(isReply);
    console.log("--------------");
    
    if(isSubject==true){
      isSubject=false;
    }

    if(isBody==true){
      isBody=false;
    }
    fetch('/emails/sent')
    .then(response => response.json())
    .then(result =>{
      console.log(result);
      appendData(result);
    
    });

  }
  if(mailbox== 'archive'){
    
    region = 'archive';
    
    fetch('/emails/archive')
    .then(response => response.json())
    .then(result =>{
      console.log(result);
      appendData(result);
    
    });
  }

  
}


function appendData(result) {
  var mainContainer = document.getElementById("emails-view");
 

  for (var i = 0; i < result.length; i++) {
  
    d = document.createElement("div");
    d.setAttribute("id",result[i].id);
    d.setAttribute("class","mail_list")
   
    if(result[i].read==true){
      d.setAttribute("style","background-color:grey;border:thin solid black");
    }else{
      d.setAttribute("style","background-color:white;border:thin solid black");
    }


    d.innerHTML = result[i].sender + '  &nbsp &nbsp ' + result[i].subject + '   ' +'<div style=\"float:right\">'+ result[i].timestamp +'</div>';
    

    mainContainer.appendChild(d);
  }

  const emails = [].slice.call(document.getElementsByClassName("mail_list"));

  emails.forEach(function (element,index){
    element.addEventListener("click",function(){
    var email_id =document.getElementsByClassName("mail_list")[index].id;

    //console.log(index);
    //console.log(id);
    view_message(email_id);

  }); 
});
}
function view_message(email_id){
  console.log("my ----region");
  console.log(region);
  console.log(isReply);
  console.log("my----- region");
 
  read(email_id);

  //display div
  var url='/emails/'+email_id;
  console.log(url);
  fetch(url)
    .then(response => response.json())
    .then(result =>{
      console.log(result);
      appendData(result);

      document.querySelector('#sender').innerHTML = result.sender;
      document.querySelector('#Subject').innerHTML = result.subject;
      document.querySelector('#message').innerHTML = result.body;
      document.querySelector('#email_id').innerHTML = result.id;
      document.querySelector('#timestamp').innerHTML = result.timestamp;
      document.querySelector('#recipients').innerHTML = result.recipients;
      
      if(result.archived==true && region != 'sent'){
        document.querySelector('#unarchive-btn').style.display = 'block';
        document.querySelector('#archive-btn').style.display = 'none';
        document.querySelector('#reply').style.display = 'block';
      }
      if(result.archived==false && region != 'sent'){
        document.querySelector('#unarchive-btn').style.display = 'none';
        document.querySelector('#archive-btn').style.display = 'block';
        document.querySelector('#reply').style.display = 'block';

      
      }
      if (region =='sent'){
        document.querySelector('#archive-btn').style.display = 'none';
        document.querySelector('#unarchive-btn').style.display = 'none';
        document.querySelector('#reply').style.display = 'none';
      }
    });
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#message-view').style.display = 'block';

   
   
  
}

function send_email(){

 if(isReply==true){
   isReply=false;
 }
 if(isSubject==true){
  isSubject=false;
 }
 if(isBody==true){
  isBody=false;
 }


  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails',{
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result =>{
    console.log(result);
  });
  localStorage.clear();
  load_mailbox('sent');
  return false;
}

function archive(){
  console.log("archive");
  const email_id = document.getElementById('email_id').textContent;
  var url='/emails/'+email_id;
  fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  })
  .then(response => response.json())
  .then(result =>{
    console.log(result);
  });
  localStorage.clear();
  load_mailbox('inbox');
  return false;
}

function unarchive(){
  console.log("unarchive");
  const email_id = document.getElementById('email_id').textContent;
  var url='/emails/'+email_id;
  fetch(url, {
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    })
  })
  .then(response => response.json())
  .then(result =>{
    console.log(result);
  });
  localStorage.clear();
  load_mailbox('inbox');
  return false;
}

function read(email_id){

  //const email_id = document.getElementById('email_id').textContent;
  var url='/emails/'+email_id;
  fetch(url, {

    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
}



  
  
