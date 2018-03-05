'use strict';

function getDefaultSettings() {
  const defaultSettings = {
    delimiter: '\n',
    key: 'MJUST',
    url: 'http://localhost:8080/add_firm'
  };

  return defaultSettings;
}

function listenDelimiterChange(settings) {
  const delimiterEl = $("#idsDelimiter");
  delimiterEl.change(() => {
    settings.delimenter = delimiterEl.value();
  });
}

function listenParsePage(settings) {
  $("#parsePage").on("click", () => {
    sendParseEvent(settings);
  });
}

function sendParseEvent(settings) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "parse", url: settings.url });
  });
}

function sendNextPageEvent() {
  chrome.storage.sync.get("idsList", function (data) {
    const idsList = data.idsList
    console.log('get - idsList', idsList);
    const id = idsList.splice(0, 1)[0];
    chrome.storage.sync.set({ idsList });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "next", id: id });
    });
  });
}

function listenNextPage() {
  $("#nextPage").click(() => {
    sendNextPageEvent();
  });
}

function listenSaveData(settings) {
  $("#saveData").click(() => {
    chrome.storage.sync.set({ id }, function () {
        console.log('saved');
    });
  })
}

function updateIdsList() {
  const list = $("#idsList").val();
  const delimiter = $("#idsDelimiter").val();
  console.log('updateIdsList');
  const idsList = list
  .split(delimiter || '\n')
  .map((v) => {
    return v.replace(/\D/g, '');}
  );
  setIdsList(idsList, delimiter || '\n');
}

function setIdsList(idsList, delimiter) {
  chrome.storage.sync.set({ idsList }, function () {
    console.log('saved - idsList', idsList);
  });

  chrome.storage.sync.set({ delimiter }, function () {
    console.log('saved - delimiter', delimiter);
  });
}

function listenIdsListChange() {
  $("#idsList").change(updateIdsList.bind(this));
  $("#idsDelimiter").change(updateIdsList.bind(this));
}

function setPersistentValue() {
  chrome.storage.sync.get("idsList", function (data) {
    const idsList = data.idsList;
    chrome.storage.sync.get("delimiter", function (data) {
      const delimiter = data.delimiter;
      if (idsList && delimiter) {
        $("#idsDelimiter").val(delimiter);
        $("#idsList").val(idsList.join(delimiter));
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {

  const settings = getDefaultSettings();
  
  setPersistentValue();
  listenDelimiterChange(settings);
  listenParsePage(settings);
  listenNextPage();
  listenIdsListChange();
});
