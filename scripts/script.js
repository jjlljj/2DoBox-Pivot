$(document).ready(populateExistingCards(findExistingCards()));
var $cardCtnr = $('.card-ctnr');
$('.save-btn').on('click', newCard);
$cardCtnr.on('click', '.del-btn', delCard);
$cardCtnr.on('click', '.up-btn', function() {changeImp(this, 'more')});
$cardCtnr.on('click', '.down-btn', function() {changeImp(this, 'less')});
$cardCtnr.on('blur', '.card-title', function() {editCard(this, 'title')});
$cardCtnr.on('blur', '.card-task', function() {editCard(this, 'body')});
$cardCtnr.on('keypress', '.card-title', unFocus);
$cardCtnr.on('keypress', '.card-task', unFocus);
$('.srch-input').on('keyup', searchString);

function ToDoCard(id, title, body, quality) {
  this.id = id;
  this.title = title;
  this.body = body;
  this.quality = 'normal';
}

function newCard() {
  event.preventDefault();
  var newCard = new ToDoCard(Date.now(), $('.title-input').val(), $('.task-input').val());
  toSto(newCard);
  prependCard(newCard);
  clrInp();
}

function toSto(card) {
  localStorage.setItem(card.id, JSON.stringify(card));
}

function fromSto(id) {
  var $obj = JSON.parse(localStorage.getItem(id));
  return $obj;
}

function getId(card) {
  var cardId = $(card).closest('article').attr('id');
  return cardId
}

function delCard() {
  $(this).closest('article').remove();
  localStorage.removeItem(getId(this));
}

function clrInp() {
  $('.title-input, .task-input, .srch-input').val('');
}

function changeImp(card, vt) {
  var qualityArray = ['none', 'low', 'normal', 'high', 'critical'];
  var $thisCard = fromSto(getId(card));
  var idx = qualityArray.indexOf($thisCard.quality);
  if (idx > 0 && vt === 'less') {
    idx--;
    $thisCard.quality = qualityArray[idx];
  } else if (idx < (qualityArray.length-1) && vt === 'more') {
    idx++;
    $thisCard.quality = qualityArray[idx];
  }
  $(`#${$thisCard.id} .imp-val`).text($thisCard.quality)
  toSto($thisCard);
}

function unFocus(event) {
  if (13 == event.keyCode) {
    event.preventDefault();
    $(this).blur()
  }
}

function editCard(card, edit) {
  var text = $(card).text();
  var $thisCard = fromSto(getId(card));
  if (edit === 'title'){
    $thisCard.title = text;
  } else if (edit === 'body'){
    $thisCard.body = text;
  }
  toSto($thisCard);
}

function populateExistingCards(keyValues) {
  for (var i = 0; i < keyValues.length; i++) {
    var thisCard = fromSto(keyValues[i].id);
    prependCard(thisCard)
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

function searchString() {
  var allCards = findExistingCards();
  var srchInp = $('.srch-input').val().toLowerCase();
  var filteredCards = allCards.filter(function (obj){
    return obj['body'].toLowerCase().match(srchInp) || obj['title'].toLowerCase().match(srchInp);
    }
  ) 
  clearAllCards();
  populateExistingCards(filteredCards);
}

function clearAllCards() {
  $('.card-ctnr').text('');
}

function  prependCard(card) {
  $('.card-ctnr').prepend(
    `<article class="2do-card" id="${card.id}">
      <header class="card-hdr">
        <h2 class="card-title" contenteditable="true">${card.title}</h2> 
        <button class="del-btn" name="delete button"></button>
      </header>
      <p class="card-task" contenteditable="true">${card.body}</p>
      <footer class="card-ftr">
        <button class="up-btn" name="more important"></button>
        <button class="down-btn" name="less important"></button>
        <h3 class="imp-title">Importance: <span class="imp-val">${card.quality}</span></h3>
      </footer>
    </article>`
  );
}