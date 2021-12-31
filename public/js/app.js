let dragged;

function setUpDropDownMenu(){
  let dropDownMenuIcon = document.querySelector('.navbar-collapse-item');
  let dropDownMenu =document.querySelector('.navbar-collapse');
  dropDownMenuIcon.addEventListener('click',function(){
    if(dropDownMenu.style.display=="" ||dropDownMenu.style.display=="none")
      dropDownMenu.style.display="block";
    else
      dropDownMenu.style.display="none";
  })
}

function setUpProjectSwitch(){
  let projectIcons =document.querySelectorAll('.project-icon');
  let slideRightMenu = document.querySelector('#slide-right-menu');
  let projectOverview = document.querySelector("#slide-right-project-overview-link");
  let id=-1;

  projectIcons.forEach(function (item, index) {
    item.addEventListener('click',function(){
      id=item.getAttribute('data-id');

      if(slideRightMenu.style.display=="" ||slideRightMenu.style.display=="none")
        slideRightMenu.style.display="block";
      else
        slideRightMenu.style.display="none";
      
      projectOverview.setAttribute('href',"/project/"+id);
    })
  });
  
}

function setUpDragAndDropTasks(){
  var dragged;

  let taskPreviews=document.querySelectorAll('.task-preview');

  /* events fired on the draggable target */
  document.addEventListener("drag", function( event ) {

  }, false);

  taskPreviews.forEach(function(item,i){
    item.addEventListener('dragstart', function( event ) {
      // store a ref. on the dragged elem
      dragged = item;
      // make it transparent
      item.style.opacity = .001;
    }, false);
  })
  

  document.addEventListener("dragend", function( event ) {
      // reset the transparency
      event.target.style.opacity = "";
  }, false);

  document.addEventListener("dragover", function( event ) {
      // prevent default to allow drop
      event.preventDefault();
  }, false);

  document.addEventListener("dragenter", function( event ) {
      // highlight potential drop target when the draggable element enters it
      if ( event.target.className == "board" && dragged!=null) {
          event.target.style.background = "gray";
      }

  }, false);

  document.addEventListener("dragleave", function( event ) {
      // reset background of potential drop target when the draggable element leaves it
      if ( event.target.className == "board" ) {
          event.target.style.background = "";
      }

  }, false);

  document.addEventListener("drop", function( event ) {
      // prevent default action (open as link for some elements)
      event.preventDefault();
      // move dragged elem to the selected drop target
      if ( event.target.className == "board" && dragged!=null) {
          event.target.style.background = "";
          sendTaskUpdateStatusRequest(dragged.getAttribute('data-id'),dragged.parentNode.getAttribute('id'),event.target.getAttribute('id'))
          dragged.parentNode.removeChild( dragged );
          event.target.appendChild( dragged );
      }
      dragged=null;
    
  }, false);
}

function sendTaskUpdateStatusRequest(id,previousStatus,newStatus){
  if(previousStatus==newStatus) return false;
  let statusString;
  switch (newStatus){
    case 'not-started':
      statusString='Not Started';
      break;
    case 'started':
      statusString='In Progress';
      break;
    case 'complete':
      statusString='Complete';
      break;
    default:
      return false;
  }
  return sendAjaxRequest('post', '/api/task/updateStatus/' + id, {status: statusString}, genericResponseHandler);
}

function genericResponseHandlerWithRefresh(){
  if(this.status>=400){
    alert("Error, try again");
    console.log(this.status);
    console.log(this.response);
  }
  location.reload();
  return;
}

function genericResponseHandler(){
  if(this.status>=400){
    alert("Error, try again");
    console.log(this.status);
    console.log(this.response);
  }
  return;
}


function setUpAddNewTask(){
  let addTaskIcons=document.querySelectorAll('.new-task-plus');
  addTaskIcons.forEach(function(item,index){
    item.addEventListener('click',createNewTask);
  });
}

function createNewTask(){
  let projectAreaCover=document.querySelector('#project-overview-opaque-cover');
  projectAreaCover.style.display="block";
  let taskForm = document.querySelector('#new-task-form');
  taskForm.style.display="flex";
  
  let closeTaskIcon=document.querySelector("#close-task-form");
  closeTaskIcon.addEventListener("click",function(){
    projectAreaCover.style.display="none";
    taskForm.style.display="none";
  })
  let createTaskButton=document.querySelector("#createNewTaskButton");
  let taskStatus=this.getAttribute('data-id');
  createTaskButton.addEventListener('click',function(){
    let id=document.querySelector('.project-overview').getAttribute('data-id');
    let taskName=document.querySelector('#task-name-input').value;
    let taskDescription=document.querySelector('#task-description-input').value;
    let selectedMembers = [];
    let memberSelectionInput=document.querySelectorAll('.member-selection-option-input');
    memberSelectionInput.forEach(function(item){
      if(item.checked) selectedMembers.push(item.getAttribute('data-id'));
    });
    if(selectedMembers.length==0) selectedMembers="";
    let taskDeliveryDate=document.querySelector('#new-task-end-date').value;
    if(new Date(taskDeliveryDate)<new Date()){
      alert("The delivery date isn't valid!");
      return;
    }
    
    sendAjaxRequest('put','/api/task/'+id,{name:taskName, description:taskDescription, members:selectedMembers,status:taskStatus, date:taskDeliveryDate},genericResponseHandlerWithRefresh);
    
  })
}


function setUpViewFullTask(){
  let taskPreviews=document.querySelectorAll('.task-preview');
  taskPreviews.forEach(function(item){
    item.addEventListener("click",function(){
      let taskID=this.getAttribute('data-id');
      sendAjaxRequest('get','/api/task/'+taskID,null,viewFullTask);
    })
  })
}

function viewFullTask(){
  if(this.status!=200){
    location.reload();
  }
  
  let task=JSON.parse(this.response);
  console.log(task);
  let taskPage=document.querySelector("#task-page");
  taskPage.style.display="block";
  let projectAreaCover=document.querySelector('#project-overview-opaque-cover');
  projectAreaCover.style.display="block";

  let closeTaskIcon=document.querySelector("#close-task-page");
  closeTaskIcon.addEventListener("click",function(){
    projectAreaCover.style.display="none";
    taskPage.style.display="none";
    
  })

  let deleteTaskIcon=document.querySelector("#delete-task-icon");
  deleteTaskIcon.addEventListener("click",function(){
    projectAreaCover.style.display="none";
    taskPage.style.display="none";
    let taskID=task[0]["id"];
    sendAjaxRequest('delete','/api/task/'+taskID,null,genericResponseHandler);
    let tasks=document.querySelectorAll('.task-preview');
    tasks.forEach(function(item){
      if(item.getAttribute("data-id")==taskID){
        item.parentNode.removeChild(item);
      }
    })
  })

  document.querySelector('#task-page-task-name').innerHTML=task[0]["name"];
  document.querySelector('#task-page-task-description').innerHTML=task[0]["description"];
  document.querySelector('#task-page-task-date').innerHTML=task[0]['delivery_date']

  let taskPageMembersContainer=document.querySelector('#task-page-members');
  let addMemberIcon=document.querySelector("#task-page-add-member");
  taskPageMembersContainer.innerHTML="";
  task[1].forEach(function(item,index){
    let image=document.createElement("img");
    image.setAttribute("src",task[1][index]['profile_image']);
    document.querySelector('#task-page-members').appendChild(image);
  })
  document.querySelector('#task-page-members').appendChild(addMemberIcon);
  
}

function encodeForAjax(data) {
  if (data == null) return null;
  return Object.keys(data).map(function(k){
    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
  }).join('&');
}

function sendAjaxRequest(method, url, data, handler) {
  let request = new XMLHttpRequest();

  request.open(method, url, true);
  request.setRequestHeader('X-CSRF-TOKEN', document.querySelector('meta[name="csrf-token"]').content);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  request.addEventListener('load', handler);
  request.send(encodeForAjax(data));
}

setUpDropDownMenu();
setUpProjectSwitch();
setUpDragAndDropTasks();
setUpAddNewTask();
setUpViewFullTask();

/*********************************************************************/
/* EDIT USER PAGE */

var loadFile = function(event) {
                            
  var image = document.getElementById('tempProfilePhoto');
  image.src = URL.createObjectURL(event.target.files[0]);
  image.onload = function() {
      URL.revokeObjectURL(image.src) // free memory
  }
};

/*********************************************************************/
//addEventListeners();


// function sendItemUpdateRequest() {
//   let item = this.closest('li.item');
//   let id = item.getAttribute('data-id');
//   let checked = item.querySelector('input[type=checkbox]').checked;

//   sendAjaxRequest('post', '/api/item/' + id, {done: checked}, itemUpdatedHandler);
// }

// function sendDeleteItemRequest() {
//   let id = this.closest('li.item').getAttribute('data-id');

//   sendAjaxRequest('delete', '/api/item/' + id, null, itemDeletedHandler);
// }

// function sendCreateItemRequest(event) {
//   let id = this.closest('article').getAttribute('data-id');
//   let description = this.querySelector('input[name=description]').value;

//   if (description != '')
//     sendAjaxRequest('put', '/api/cards/' + id, {description: description}, itemAddedHandler);

//   event.preventDefault();
// }

// function sendDeleteCardRequest(event) {
//   let id = this.closest('article').getAttribute('data-id');

//   sendAjaxRequest('delete', '/api/cards/' + id, null, cardDeletedHandler);
// }

// function sendCreateCardRequest(event) {
//   let name = this.querySelector('input[name=name]').value;

//   if (name != '')
//     sendAjaxRequest('put', '/api/cards/', {name: name}, cardAddedHandler);

//   event.preventDefault();
// }

// function itemUpdatedHandler() {
//   let item = JSON.parse(this.responseText);
//   let element = document.querySelector('li.item[data-id="' + item.id + '"]');
//   let input = element.querySelector('input[type=checkbox]');
//   element.checked = item.done == "true";
// }

// function itemAddedHandler() {
//   if (this.status != 200) window.location = '/';
//   let item = JSON.parse(this.responseText);

//   // Create the new item
//   let new_item = createItem(item);

//   // Insert the new item
//   let card = document.querySelector('article.card[data-id="' + item.card_id + '"]');
//   let form = card.querySelector('form.new_item');
//   form.previousElementSibling.append(new_item);

//   // Reset the new item form
//   form.querySelector('[type=text]').value="";
// }

// function itemDeletedHandler() {
//   if (this.status != 200) window.location = '/';
//   let item = JSON.parse(this.responseText);
//   let element = document.querySelector('li.item[data-id="' + item.id + '"]');
//   element.remove();
// }

// function cardDeletedHandler() {
//   if (this.status != 200) window.location = '/';
//   let card = JSON.parse(this.responseText);
//   let article = document.querySelector('article.card[data-id="'+ card.id + '"]');
//   article.remove();
// }

// function cardAddedHandler() {
//   if (this.status != 200) window.location = '/';
//   let card = JSON.parse(this.responseText);

//   // Create the new card
//   let new_card = createCard(card);

//   // Reset the new card input
//   let form = document.querySelector('article.card form.new_card');
//   form.querySelector('[type=text]').value="";

//   // Insert the new card
//   let article = form.parentElement;
//   let section = article.parentElement;
//   section.insertBefore(new_card, article);

//   // Focus on adding an item to the new card
//   new_card.querySelector('[type=text]').focus();
// }

// function createCard(card) {
//   let new_card = document.createElement('article');
//   new_card.classList.add('card');
//   new_card.setAttribute('data-id', card.id);
//   new_card.innerHTML = `

//   <header>
//     <h2><a href="cards/${card.id}">${card.name}</a></h2>
//     <a href="#" class="delete">&#10761;</a>
//   </header>
//   <ul></ul>
//   <form class="new_item">
//     <input name="description" type="text">
//   </form>`;

//   let creator = new_card.querySelector('form.new_item');
//   creator.addEventListener('submit', sendCreateItemRequest);

//   let deleter = new_card.querySelector('header a.delete');
//   deleter.addEventListener('click', sendDeleteCardRequest);

//   return new_card;
// }

// function createItem(item) {
//   let new_item = document.createElement('li');
//   new_item.classList.add('item');
//   new_item.setAttribute('data-id', item.id);
//   new_item.innerHTML = `
//   <label>
//     <input type="checkbox"> <span>${item.description}</span><a href="#" class="delete">&#10761;</a>
//   </label>
//   `;

//   new_item.querySelector('input').addEventListener('change', sendItemUpdateRequest);
//   new_item.querySelector('a.delete').addEventListener('click', sendDeleteItemRequest);

//   return new_item;
// }

