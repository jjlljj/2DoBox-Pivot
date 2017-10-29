$(document).ready(populateExistingCards(findExistingCards()));
var $crdCtnr = $('.crd-ctnr');

$('.save-btn').on('click', newCrd);
$crdCtnr.on('click', '.del-btn', delCrd);
$crdCtnr.on('click', '.up-btn', voteUp);
$crdCtnr.on('click', '.down-btn', voteDown);
$crdCtnr.on('blur', '.crd-title', changeIdeaTitle);
$crdCtnr.on('blur', '.crd-task', changeIdeaBody);
$crdCtnr.on('keypress', '.crd-title', updateTitle);
$crdCtnr.on('keypress', '.crd-task', updateBody);
$('srch-input').on('keyup', searchString);

function ToDoCrd(id, title, body, quality) {
  this.id = id;
  this.title = title;
  this.body = body;
  this.quality = 'swill';
}

function newCrd() {
  event.preventDefault();
  var newCrd = new ToDoCrd(Date.now(), $('.title-input').val(), $('.task-input').val());
  toSto(newCrd);
  prependCrd(newCrd);
  clrInp();
}

function toSto(crd) {
  var stringifiedObject = JSON.stringify(crd);
  localStorage.setItem(crd.id, stringifiedObject);
}

function fromSto(id) {
  var thsObj = localStorage.getItem(id);
  var $obj = JSON.parse(thsObj);
  return $obj;
}

function getId(crd) {
  var crdId = parseInt($(crd).closest('article').attr('id'));
  return crdId
}

function delCrd() {
  $(this).closest('article').remove();
  localStorage.removeItem(getId(this));
}

function clrInp() {
  $('.title-input').val('');
  $('.task-input').val('');
}




//don't need dual loops of populateExisting && findExisting
function populateExistingCards(keyValues) {
  for (var i = 0; i < keyValues.length; i++) {
    var thisCrd = fromSto(keyValues[i].id);
    prependCrd(thisCrd)
  }
}

function findExistingCards() {
  var keyValues = [];
  var keys = Object.keys(localStorage);
  for (var i = 0; i < keys.length; i++) {
    keyValues.push(JSON.parse(localStorage.getItem(keys[i])));
  }
  return keyValues;
}



// these two (voteUp & voteDown) should be a single function w/ multiple args

function voteUp() {
  var qualityArray = ['swill', 'plausible', 'genius'];
  var currentQuality = $(this).siblings('.imp-val').text();
  var currentIndex = qualityArray.indexOf(currentQuality);
  console.log('up')

  if(currentIndex < 2) {
    currentIndex++;
    currentQuality = $(this).siblings('.imp-val').text(qualityArray[currentIndex]);
  }

  var cardId = parseInt($(this).closest('article').attr('id'));
  var cardObject = fromSto(cardId);
  cardObject.quality = qualityArray[currentIndex];
  toSto(cardObject);
}

function voteDown() {
  var qualityArray = ['swill', 'plausible', 'genius'];
  var currentQuality = $(this).siblings('.imp-val').text();
  var currentIndex = qualityArray.indexOf(currentQuality);

  console.log('down')

  if(currentIndex > 0){
    currentIndex--;
    currentQuality = $(this).siblings('.imp-val').text(qualityArray[currentIndex]);
  }
  
  var cardId = parseInt($(this).closest('article').attr('id'));
  var cardObject = fromSto(cardId);
  cardObject.quality = qualityArray[currentIndex];
  toSto(cardObject);
}




// this can be shorterrr

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

function clearAllCards() {
  $('.crd-ctnr').text('');
}



/// refactor these two functions into one which takes title or body arg
function changeIdeaTitle() {
  var currentTitle = $(this).text();
  var cardId = parseInt($(this).closest('article').attr('id'));
  var cardObject = fromSto(cardId);
  cardObject.title = currentTitle;
  toSto(cardObject);
}

function changeIdeaBody() {
  var currentBody = $(this).text();
  var cardId = parseInt($(this).closest('article').attr('id'));
  var cardObject = fromSto(cardId);
  cardObject.body = currentBody;
  toSto(cardObject);
}


/// also these... maybe these and prev 2 can be one function
function updateTitle(event) {
  if (13 == event.keyCode) {
    event.preventDefault();
    $('.crd-title').blur();
    var cardId = parseInt($(this).closest('article').attr('id'));
    var cardObject = fromSto(cardId);
    cardObject.title = $(this).closest('.crd-title').text();
    toSto(cardObject);
  }
}

function updateBody(event) {
  if (13 == event.keyCode) {
    event.preventDefault();
    $('.crd-task').blur();
    var cardId = parseInt($(this).closest('article').attr('id'));
    var cardObject = fromSto(cardId);
    cardObject.body = $(this).closest('.crd-task').text();
    toSto(cardObject);
  }
}




function  prependCrd(crd) {
  $('.crd-ctnr').prepend(
    `<article class="2do-crd" id="${crd.id}">
      <header class="crd-hdr">
        <h2 class="crd-title" contenteditable="true">${crd.title}</h2> 
        <button class="del-btn" name="delete button"></button>
      </header>
      <p class="crd-task" contenteditable="true">${crd.body}</p>
      <footer class="crd-ftr">
        <button class="up-btn" name="more important"></button>
        <button class="down-btn" name="less important"></button>
        <h3 class="imp-title">Importance: <span class="imp-val">${crd.quality}</span></h3>
      </footer>
    </article>`
  );
}
