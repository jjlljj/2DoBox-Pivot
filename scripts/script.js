$(document).ready(populateExistingCards(findExistingCards()));
var $crdCtnr = $('.crd-ctnr');

$('.save-btn').on('click', newCrd);
$crdCtnr.on('click', '.del-btn', delCrd);

$crdCtnr.on('click', '.up-btn', function(){
  changeImp(this, 'more')
});

$crdCtnr.on('click', '.down-btn', function() {
  changeImp(this, 'less')
});

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
      // IS IT BETTER TO DO THIS:
//  var stringObj = JSON.stringify(crd);
//  localStorage.setItem(crd.id, stringObj);
     // OR THIS:
  localStorage.setItem(crd.id, JSON.stringify(crd));
}

function fromSto(id) {
  var $obj = JSON.parse(localStorage.getItem(id));
  return $obj;
}

function getId(crd) {
  var crdId = $(crd).closest('article').attr('id');
  return crdId
}

function delCrd() {
  $(this).closest('article').remove();
  localStorage.removeItem(getId(this));
}

function clrInp() {
  $('.title-input, .task-input').val('');
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

function changeImp(card, vt) {
  var qualityArray = ['swill', 'plausible', 'genius'];
  var $thisCrd = fromSto(getId(card))
  var idx = qualityArray.indexOf($thisCrd.quality);
  
  if(idx > 0 && vt === 'less'){
    idx--;
    $thisCrd.quality = qualityArray[idx];
  } else if (idx < (qualityArray.length-1) && vt === 'more') {
    idx++;
    $thisCrd.quality = qualityArray[idx];
  }

  $(`#${$thisCrd.id} .imp-val`).text($thisCrd.quality)
  toSto($thisCrd);
}




// this can be shorterrr

function searchString() {
  var cardObjectsArray = findExistingCards();
  var srchInp = $('.srch-input').val().toLowerCase();

  var filteredCards = cardObjectsArray.filter(function (object){
    var lowercaseObjectBody = object['body'].toLowerCase();
    var lowercaseObjectTitle = object['title'].toLowerCase();
    return lowercaseObjectBody.match(srchInp) || lowercaseObjectTitle.match(srchInp);
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
