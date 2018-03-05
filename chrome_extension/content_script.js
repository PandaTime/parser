chrome.runtime.onMessage.addListener(
    function (req, sender, res) {
        if (req.action === "parse") {
            handlePageParse(req.url);
        } else if (req.action === "init") {
            initIdListener()
        } else if (req.action === "next") {
            nextPage(req.id);
        }
    }
);

function nextPage(id) {
    document.getElementById('yurcheck').click();
    document.getElementById('query').value = id;
    if (id) {
        document.getElementById('querybox').getElementsByTagName('input')[1].click();
    }
}

function parseTable(tableElement) {
    const firm = {}
    Array.prototype.forEach.call(tableElement.getElementsByTagName('tr'), (rows) => {
        const row = rows.getElementsByTagName('td');
        firm[row[0].innerHTML] = [row[1].innerHTML];
    });
    return firm;
}

function parsePage() {
    const table = document.getElementById('detailtable');

    const firmInfo = parseTable(table);

    const parsedContent = {
        firmPage: table.innerHTML,
        firmInfo
    }

    return parsedContent;
}

function handlePageParse(url) {
    const parsedData = parsePage();
    // getting ID and saving to localstorage
    chrome.storage.sync.get("id", (data) => {
        parsedData.firmId = data.id;
        saveData(url, parsedData)
    });
}

function saveInputValue(querybox) {
    const id = querybox.getElementsByTagName('input')[0].value;
    chrome.storage.sync.set({ id }, function () {
        console.log('saved');
    });
}


function saveData(url, parsedData) {
    console.log('SaveData', url);
    console.log('saveData-data', parsedData);
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(parsedData),
        mode: 'no-cors'
    })
    .then((res) => {
        return res.json()
    })
    .then((res) => {
        if (res.status !== 200) {
            throw res;
        }
        return res;
    })
    .then((res) => {
        console.log('Success!', res);
    })
    .catch((err) => {
        console.log('something went wrong', err);
    })
}

const querybox = document.getElementById('querybox');
if (querybox && querybox.getElementsByTagName('input').length > 1) {
    querybox.getElementsByTagName('input')[0].onchange = () => {
        saveInputValue(querybox);
    };
}