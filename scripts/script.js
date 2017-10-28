$(document).ready(populateExistingCards(findExistingCards()));
$('.save-btn').on('click', createCard);
$('.crd-ctnr').on('click', '.del-btn', deleteIdeaCard);
$('.crd-ctnr').on('click', '.up-btn', upvoteQuality);
$('.crd-ctnr').on('click', '.down-btn', downvoteQuality);
$('.crd-ctnr').on('blur', '.crd-title', changeIdeaTitle);
$('.crd-ctnr').on('blur', '.crd-task', changeIdeaBody);
$('.crd-ctnr').on('keypress', '.crd-title', updateTitle);
$('.crd-ctnr').on('keypress', '.crd-task', updateBody);
$('srch-input').on('keyup', searchString);

function IdeaCardObject(id, title, body) {
  this.id = id;
  this.title = title;
  this.body = body;
  this.quality = 'swill';
}

function createCard() {
  event.preventDefault();
  var newCard = new IdeaCardObject(id = Date.now(), $('.title-input').val(), $('.task-input').val());
  sendCardToLocalStorage(newCard);
}

function sendCardToLocalStorage(newCard) {
  var stringifiedObject = JSON.stringify(newCard);
  localStorage.setItem(newCard.id, stringifiedObject);
  retrieveObjPutOnPage(newCard.id);
}

function sendUpdatesToLocalStorage(updatedObject) {
  var stringifiedObject = JSON.stringify(updatedObject);
  localStorage.setItem(updatedObject.id, stringifiedObject);
}

function retrieveObjPutOnPage(id) {
  var retrievedObject = localStorage.getItem(id);
  var parsedObject = JSON.parse(retrievedObject);
  prependIdeaCard(parsedObject.id, parsedObject.title, parsedObject.body, parsedObject.quality);
  clearInputs();
}

function populateExistingCards(keyValues) {
  for (var i = 0; i < keyValues.length; i++) {
    retrieveObjPutOnPage(keyValues[i].id);
  }
}

function prependIdeaCard(id, title, body, quality) {
  $('.crd-ctnr').prepend(
    `<article class="2do-crd" id="${id}">
      <header class="crd-hdr">
        <h2 class="crd-title" contenteditable="true">${title}</h2> 
        <button class="del-btn" name="delete button"></button>
      </header>
      <p class="crd-task" contenteditable="true">${body}</p>
      <footer class="crd-ftr">
        <button class="up-btn" name="more important"></button>
        <button class="down-btn" name="less important"></button>
        <h3 class="imp-title">Importance: <span class="imp-val">${quality}</span></h3>
      </footer>
    </article>`
  );
}

function findExistingCards() {
  var keyValues = [];
  var keys = Object.keys(localStorage);
  for (var i = 0; i < keys.length; i++) {
    keyValues.push(JSON.parse(localStorage.getItem(keys[i])));
  }
  return keyValues;
}

function addIdeaCard() {
  event.preventDefault();
  prependIdeaCard();
  clearInputs();
}

function deleteIdeaCard() {
  $(this).closest('article').remove();
  var cardId = $(this).closest('article').attr('id');
  localStorage.removeItem(JSON.parse(cardId));
}

function clearInputs() {
  $('.title-input').val('');
  $('.task-input').val('');
}

function upvoteQuality() {
  var qualityArray = ['swill', 'plausible', 'genius'];
  var currentQuality = $(this).siblings('.imp-val').text();
  var currentIndex = qualityArray.indexOf(currentQuality);
  console.log('up')

  if(currentIndex < 2) {
    currentIndex++;
    currentQuality = $(this).siblings('.imp-val').text(qualityArray[currentIndex]);
  }

  var cardId = parseInt($(this).closest('article').attr('id'));
  var cardObject = getObjectFromStorage(cardId);
  cardObject.quality = qualityArray[currentIndex];
  sendUpdatesToLocalStorage(cardObject);
}

function downvoteQuality() {
  var qualityArray = ['swill', 'plausible', 'genius'];
  var currentQuality = $(this).siblings('.imp-val').text();
  var currentIndex = qualityArray.indexOf(currentQuality);

  console.log('down')

  if(currentIndex > 0){
    currentIndex--;
    currentQuality = $(this).siblings('.imp-val').text(qualityArray[currentIndex]);
  }
  
  var cardId = parseInt($(this).closest('article').attr('id'));
  var cardObject = getObjectFromStorage(cardId);
  cardObject.quality = qualityArray[currentIndex];
  sendUpdatesToLocalStorage(cardObject);
}

function getObjectFromStorage(cardId) {
  var retrievedObject = localStorage.getItem(cardId);
  var parsedObject = JSON.parse(retrievedObject);
  return parsedObject;
}

function changeIdeaTitle() {
  var currentTitle = $(this).text();
  var cardId = parseInt($(this).closest('article').attr('id'));
  var cardObject = getObjectFromStorage(cardId);
  cardObject.title = currentTitle;
  sendUpdatesToLocalStorage(cardObject);
}

function changeIdeaBody() {
  var currentBody = $(this).text();
  var cardId = parseInt($(this).closest('article').attr('id'));
  var cardObject = getObjectFromStorage(cardId);
  cardObject.body = currentBody;
  sendUpdatesToLocalStorage(cardObject);
}

function clearAllCards() {
  $('.crd-ctnr').text('');
}

function searchString() {
  var cardObjectsArray = findExistingCards();
  var userSearchInput = $('.srch-input').val().toLowerCase();
  var filteredCards = cardObjectsArray.filter(function (object){
    var lowercaseObjectBody = object['body'].toLowerCase();
    var lowercaseObjectTitle = object['title'].toLowerCase();
    return lowercaseObjectBody.match(userSearchInput) || lowercaseObjectTitle.match(userSearchInput);
    }
  ) 
  clearAllCards();
  populateExistingCards(filteredCards);
}

function updateTitle(event) {
  if (13 == event.keyCode) {
    event.preventDefault();
    $('.crd-title').blur();
    var cardId = parseInt($(this).closest('article').attr('id'));
    var cardObject = getObjectFromStorage(cardId);
    cardObject.title = $(this).closest('.crd-title').text();
    sendUpdatesToLocalStorage(cardObject);
  }
}

function updateBody(event) {
  if (13 == event.keyCode) {
    event.preventDefault();
    $('.crd-task').blur();
    var cardId = parseInt($(this).closest('article').attr('id'));
    var cardObject = getObjectFromStorage(cardId);
    cardObject.body = $(this).closest('.crd-task').text();
    sendUpdatesToLocalStorage(cardObject);
  }
}