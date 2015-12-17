'use strict';

(function(){
  var API_BASE = 'http://127.0.0.1:3500/';
  //var API_BASE = 'https://pln-final-project-pedrodiniz.c9users.io/';
  var input;
  var suggestionsList;
  var metrics;
  var positionStart;
  var positionEnd;
  var points = 0;
  var uses = 0;

  function apiCall(endpoint, payload, cb) {
    var queryString = '?';
    for (var key in payload) {
      queryString += encodeURIComponent(key) + '=' + encodeURIComponent(payload[key]) + '&';
    }
    queryString = queryString.substr(0, queryString.length-1);

    var url = API_BASE + endpoint + queryString;
    var xhr = new XMLHttpRequest();
    
    xhr.addEventListener('load', cb);
    xhr.open('GET', url);
    xhr.send();
  }

  function processApiResponse(cb) {
    return function() {
      cb(JSON.parse(this.responseText));
    };
  }

  function getSuggestions(word, cb) {
    apiCall('suggestions', {word: word}, processApiResponse(cb));
  }

  function showSuggestions(suggestions) {
    suggestionsList.innerHTML = '';
    suggestions.forEach(function(suggestion, index) {
      var li = document.createElement('li');
      li.innerHTML = suggestion;
      li.addEventListener('click', function() {
        replaceWord(positionStart + 1, positionEnd, suggestion);
        points += index;
        uses += 1;

        metrics.innerHTML = 'Desempenho: ' + (points / uses) + ' (quanto menor melhor)';
      });

      suggestionsList.appendChild(li);
    });
  }

  function replaceWord(start, end, newWord) {
    input.selectionStart = start;
    input.selectionEnd = end;

    input.value = input.value.substring(0, start) + newWord + input.value.substring(end);
    input.selectionStart = input.selectionEnd = start + newWord.length + 1;
    showSuggestions([]);
  }

  function setup() {
    input = document.querySelector('#input');
    suggestionsList = document.querySelector('#suggestions-list');
    metrics = document.querySelector('#metrics');

    input.addEventListener('keypress', function(ev) {
      if (ev.keyCode == 32) { // 32 = space
        positionEnd = input.selectionStart;
        var text = input.value.substring(0, positionEnd).trimRight();
        positionStart = text.lastIndexOf(' ');
        var word = text.substring(positionStart).trim();
        console.log(word);
        getSuggestions(word, function(suggestions) {
          showSuggestions(suggestions);
        });
      } else if (ev.keyCode == 13) {
        ev.preventDefault();
        
        showSuggestions([]);
      } else {
        showSuggestions([]);
      }
    });
  }

  setup();
})();
