$(document).ready(renderOnLoad);
$('.save-btn').on('click', newCard);
$('.title-input').on('keyup', disableSubmit);
$('.task-input').on('keyup', disableSubmit);
$('.card-ctnr').on('click', '.del-btn', delCard);
$('.card-ctnr').on('click', '.up-btn', function() {changeImp(this, 'more')});
$('.card-ctnr').on('click', '.down-btn', function() {changeImp(this, 'less')});
$('.card-ctnr').on('blur', '.card-title', function() {editCard(this, 'title')});
$('.card-ctnr').on('blur', '.card-task', function() {editCard(this, 'task')});
$('.card-ctnr').on('click', '.completed-btn', markComplete);
$('.card-ctnr').on('keypress', '.card-title', unFocus);
$('.card-ctnr').on('keypress', '.card-task', unFocus);
$('.search-input').on('keyup', filterString);
$('.show-all-btn').on('click', displayAll);
$('.del-all-btn').on('click');
$('.imp-filter-wrap').on('click', '.filter-btn', filterImp);

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
  };
  $(`#${$thisCard.id} .imp-val`).text($thisCard.importance);
  toSto($thisCard);
};

function clearAllCards() {
  $('.card-ctnr').text('');
};

function clearInp() {
  $('.title-input, .task-input, .search-input').val('');
};

function createCardsArray() {
  var objArray = [];
  var id = Object.keys(localStorage);
  for (var i = 0; i < id.length; i++) {
    objArray.push(JSON.parse(localStorage.getItem(id[i])));
  };
  return objArray;
};

function delCard() {
  $(this).closest('.to-do-card').remove();
  localStorage.removeItem(getId(this));
};

function disableComplete(card) {
  $(`#${card.id}`).addClass('gray-out');
  $(`#${card.id} .up-btn, #${card.id} .down-btn`).prop('disabled', true);
  $(`#${card.id} .delete-btn`).prop('disabled', true);
  $(`#${card.id} .card-task, #${card.id} .card-title`).prop('contenteditable', false);
};

function disableSubmit() {
  if ($('.title-input').val() && $('.task-input').val()) {
    $('.save-btn').prop('disabled', false);
  } else {
    $('.save-btn').prop('disabled', true);
  };
};

function displayAll() {
  var allCards = createCardsArray();
  clearAllCards();
  for (var i = 0; i < allCards.length; i++) {
    var $thisCard = fromSto(allCards[i].id);
    prependCard($thisCard);
    if ($thisCard.complete) {
      disableComplete($thisCard);
    };
  };
};

function editCard(card, edit) {
  var text = $(card).text();
  var $thisCard = fromSto(getId(card));
  if (edit === 'title'){
    $thisCard.title = text;
  } else if (edit === 'task'){
    $thisCard.task = text;
  };
  toSto($thisCard);
};

function filterComplete(allCards) {
  var filteredComplete = allCards.filter(function(obj) {
    return !obj['complete'];
  });
  return filteredComplete;
};

function filterImp() {
  var allCards = filterComplete(createCardsArray());
  var filterBy = $(this).text();
  var filteredCards = allCards.filter(function(obj) {
    return obj['importance'].match(filterBy);
  }); 
  populateCards(filteredCards);
};

function filterString() {
  var allCards = filterComplete(createCardsArray());
  var srchInp = $('.search-input').val().toLowerCase();
  var filteredCards = allCards.filter(function(obj) {
    return obj['task'].toLowerCase().match(srchInp) || obj['title'].toLowerCase().match(srchInp);
  });
  populateCards(filteredCards);
};

function fromSto(id) {
  var $obj = JSON.parse(localStorage.getItem(id));
  return $obj;
};

function getId(card) {
  var cardId = $(card).closest('.to-do-card').attr('id');
  return cardId;
};

function markComplete() {
  var $thisCard = fromSto(getId(this));
  disableComplete($thisCard);
  $thisCard.complete = true;
  toSto($thisCard);
};

function newCard() {
  event.preventDefault();
  var newCard = new ToDoCard(Date.now(), $('.title-input').val(), $('.task-input').val());
  toSto(newCard);
  prependCard(newCard);
  clearInp();
};

function populateCards(keyValues) {
  clearAllCards();
  displayNum = keyValues.length < 10 ? keyValues.length : 10;
  for (var i = keyValues.length - displayNum; i < keyValues.length; i++) {
    var thisCard = fromSto(keyValues[i].id);
    prependCard(thisCard);
  };
};

function  prependCard(card) {
  $('.card-ctnr').prepend(
    `<article class="to-do-card" id="${card.id}">
      <header class="card-hdr">
        <h2 class="card-title" contenteditable="true">${card.title}</h2> 
        <button class="del-btn" name="delete button"></button>
      </header>
      <p class="card-task" contenteditable="true">${card.task}</p>
      <footer class="card-ftr">
        <button class="up-btn" name="more important"></button>
        <button class="down-btn" name="less important"></button>
        <h3 class="imp-title">Importance: <span class="imp-val">${card.importance}</span></h3>
        <button class="completed-btn btn-style">Completed Task</button>
      </footer>
    </article>`
  );
};

function renderOnLoad() {
  var allCards = filterComplete(createCardsArray());
  populateCards(allCards);
};

function ToDoCard(id, title, task, importance) {
  this.id = id;
  this.title = title;
  this.task = task;
  this.importance = 'normal';
  this.complete = false;
};

function toSto(card) {
  localStorage.setItem(card.id, JSON.stringify(card));
};

function unFocus(event) {
  if (13 == event.keyCode) {
    event.preventDefault();
    $(this).blur();
  };
};