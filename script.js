const _queryInput = document.getElementById("queryString");
const _queryIFrame = document.getElementById("queryIFrame");
const _queryIFrameDiv = document.getElementById("queryIFrameDiv");
const _queryTableDiv = document.getElementById("queryTableDiv");
const _queryTableError = document.getElementById("queryTableError");
const _nicoSeeMore = document.getElementById("nicoLink");
const _malSeeMore = document.getElementById("malLink");
const _proxyUrl = 'https://cors-anywhere.herokuapp.com/';

let querySiteName = "";
let queryString = "";
let querySite = "";
let queryURL = "";

let placeholderValue = "default";
generatePlaceholder().then();

function formSubmitted() {
    clearResults();
    querySiteName = document.querySelector('input[name="querySite"]:checked');
    queryString = _queryInput.value;
    if (queryString === "") {
        queryString = placeholderValue;
    }
    querySite = querySiteName.value;
    if (querySite === "bilibili") {
        queryURL = "https://search.bilibili.com/all?keyword="+encodeURIComponent(queryString);
        _queryIFrame.setAttribute("src", queryURL);
        _queryIFrameDiv.style.display = "initial";
    }
    else if (querySite === "niconico") {
        queryURL = _proxyUrl + "https://api.search.nicovideo.jp/api/v2/snapshot/video/contents/search?q=" + encodeURIComponent(queryString) + "&targets=title&_sort=-viewCounter&fields=contentId,title,thumbnailUrl,startTime&_limit=10&filters[startTime][gte]=2019-01-01T00:00:00";
        return fetch(queryURL)
            .then(res => res.json())
            .then(info => {
                if (info["meta"]["status"] === 200) {
                    if (info["meta"]["totalCount"] === 0) {
                        _queryTableError.style.display = "initial";
                    }
                    else {
                        for (let i = 1; i <= 10; i++) {
                            let j = i - 1;
                            let id = info["data"][j]["contentId"];
                            let title = info["data"][j]["title"];
                            let thumb = info["data"][j]["thumbnailUrl"];
                            let time = info["data"][j]["startTime"];
                            let url = "https://nico.ms/"+id;
                            let thumbE = "queryTableThumb"+i;
                            let thumbLinkE = "queryTableThumbLink"+i;
                            let titleE = "queryTableTitle"+i;
                            let timeE = "queryTableTime"+i;
                            document.getElementById(thumbE).src = thumb;
                            document.getElementById(thumbE).alt = title;
                            document.getElementById(titleE).innerHTML = title;
                            document.getElementById(titleE).href = url;
                            document.getElementById(thumbLinkE).href = url;
                            document.getElementById(timeE).innerHTML = time;
                        }
                        _nicoSeeMore.style.display = "initial";
                        _queryTableDiv.style.display = "initial";
/*                        info.data.forEach(e => {
                            console.log(e.contentId);
                        })*/
                    }
                }
            });
    }
    else if (querySite === "mal") {
        queryURL = "https://api.jikan.moe/v3/search/anime?q=" + encodeURIComponent(queryString) + "&limit=10";
        return fetch(queryURL)
            .then(res => res.json())
            .then(info => {
                for (let i = 1; i <= 10; i++) {
                    let j = i - 1;
                    let url = info["results"][j]["url"];
                    let title = info["results"][j]["title"];
                    let thumb = info["results"][j]["image_url"];
                    let thumbE = "queryTableThumb"+i;
                    let thumbLinkE = "queryTableThumbLink"+i;
                    let titleE = "queryTableTitle"+i;
                    document.getElementById(thumbE).src = thumb;
                    document.getElementById(thumbE).alt = title;
                    document.getElementById(titleE).innerHTML = title;
                    document.getElementById(titleE).href = url;
                    document.getElementById(thumbLinkE).href = url;
                }
                _malSeeMore.style.display = "initial";
                _queryTableDiv.style.display = "initial";
            });
    }
    else if (querySite === "al") {
        // TODO: AL API
    }
    else {
        throw new Error("Error: querySite does not exist");
    }
}

function nicoSeeMore() {
    window.open("https://www.nicovideo.jp/search/" + queryString, "_blank");
}

function malSeeMore() {
    window.open("https://myanimelist.net/search/all?q=" + queryString, "_blank");
}

function generatePlaceholder() {
    // let id = Math.floor(Math.random() * 33993 + 1);
    let id = Math.floor(Math.random() * Math.floor(16310));
    queryURL = "https://api.jikan.moe/v3/anime/"+id;
    return fetch(queryURL)
        .then(res => res.json())
        .then(info => {
            let metaStatus = info.status;
            if (metaStatus === 404) {
                generatePlaceholder().then();
            }
            else if (metaStatus === 429) {
                wait(2000);
                generatePlaceholder().then();
            }
            else {
                placeholderValue = info.title;
                _queryInput.placeholder = placeholderValue;
            }
        });
}

function wait(ms){
    const start = new Date().getTime();
    let end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }
}

function clearResults() {
    _queryTableError.style.display = "none";
    _queryIFrameDiv.style.display = "none";
    _queryTableDiv.style.display = "none";
    _nicoSeeMore.style.display = "none";
    _malSeeMore.style.display = "none";
}

/*async function getData(apiURL) {
    apiURL = _proxyUrl + apiURL;
    fetch(apiURL)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            animeData = json;
        });
}*/

// TODO: Load Kitsu API

// TODO: Load AnimeNewsNetwork API