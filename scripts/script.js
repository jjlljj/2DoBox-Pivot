$(document).ready(populateExistingCards(findExistingCards()));
$('.save-btn').on('click', newCard);
$('.title-input').on('keyup', disableSubmit);
$('.task-input').on('keyup', disableSubmit);
$('.card-ctnr').on('click', '.del-btn', delCard);
$('.card-ctnr').on('click', '.up-btn', function() {changeImp(this, 'more')});
$('.card-ctnr').on('click', '.down-btn', function() {changeImp(this, 'less')});
$('.card-ctnr').on('blur', '.card-title', function() {editCard(this, 'title')});
$('.card-ctnr').on('blur', '.card-task', function() {editCard(this, 'task')});
$('.card-ctnr').on('keypress', '.card-title', unFocus);
$('.card-ctnr').on('keypress', '.card-task', unFocus);
$('.srch-input').on('keyup', filterString);
$('.show-all-btn').on('click', displayAll)

function ToDoCard(id, title, task, importance) {
  this.id = id;
  this.title = title;
  this.task = task;
  this.importance = 'normal';
}

function disableSubmit() {
  if ($('.title-input').val() && $('.task-input').val()) {
    $('.save-btn').prop('disabled', false);
  } else {
    $('.save-btn').prop('disabled', true);
  }
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
  var impArray = ['none', 'low', 'normal', 'high', 'critical'];
  var $thisCard = fromSto(getId(card));
  var idx = impArray.indexOf($thisCard.importance);
  if (idx > 0 && vt === 'less') {
    idx--;
    $thisCard.importance = impArray[idx];
  } else if (idx < (impArray.length-1) && vt === 'more') {
    idx++;
    $thisCard.importance = impArray[idx];
  }
  $(`#${$thisCard.id} .imp-val`).text($thisCard.importance)
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
  } else if (edit === 'task'){
    $thisCard.task = text;
  }
  toSto($thisCard);
}

function populateExistingCards(keyValues, displayAll) {
  displayNum = keyValues.length < 10 ? keyValues.length : 10;
  for (var i = keyValues.length - displayNum; i < keyValues.length; i++) {
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

function displayAll() {
  console.log('click')
  var allCards = findExistingCards();
  clearAllCards();
  console.log(allCards)
  for (var i = 0; i < allCards.length; i++) {
    var thisCard = fromSto(allCards[i].id);
    prependCard(thisCard)
  }
} 

function filterString() {
  var allCards = findExistingCards();
  var srchInp = $('.srch-input').val().toLowerCase();
  var filteredCards = allCards.filter(function (obj){
    return obj['task'].toLowerCase().match(srchInp) || obj['title'].toLowerCase().match(srchInp);
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
      <p class="card-task" contenteditable="true">${card.task}</p>
      <footer class="card-ftr">
        <button class="up-btn" name="more important"></button>
        <button class="down-btn" name="less important"></button>
        <h3 class="imp-title">Importance: <span class="imp-val">${card.importance}</span></h3>
      </footer>
    </article>`
  );
}