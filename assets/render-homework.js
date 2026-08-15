(function () {
  'use strict';
  var assignment = window.THOMAS_ASSIGNMENT;
  var list = document.querySelector('[data-question-list]');
  if (!assignment || !list) return;
  var letters = ['A', 'B', 'C', 'D', 'E'];
  assignment.items.forEach(function (item, index) {
    var card = document.createElement('article');
    card.className = 'question-card';
    var heading = document.createElement('h2');
    heading.textContent = (index + 1) + '. ' + item.prompt;
    var label = document.createElement('p');
    label.className = 'question-label';
    label.textContent = item.section;
    var choices = document.createElement('div');
    choices.className = 'choice-list';
    item.options.forEach(function (option, optionIndex) {
      var choice = document.createElement('label');
      choice.className = 'choice';
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = item.id;
      input.value = letters[optionIndex];
      input.required = false;
      var text = document.createElement('span');
      text.textContent = '(' + letters[optionIndex] + ') ' + option;
      choice.append(input, text);
      choices.append(choice);
    });
    card.append(label, heading, choices);
    if (item.evidenceLabel) {
      var evidence = document.createElement('textarea');
      evidence.className = 'evidence-field';
      evidence.dataset.evidenceFor = item.id;
      evidence.setAttribute('aria-label', item.evidenceLabel + ' for question ' + (index + 1));
      evidence.placeholder = item.evidenceLabel;
      card.append(evidence);
    }
    list.append(card);
  });
}());
