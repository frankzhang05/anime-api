const _queryInput = document.getElementById("queryString");
const _queryIFrame = document.getElementById("queryIFrame");
const _queryIFrameDiv = document.getElementById("queryIFrameDiv");
const _proxyUrl = 'https://cors-anywhere.herokuapp.com/';

let querySiteName = "";
let queryString = "";
let querySite = "";
let queryURL = "";
// let animeNotFound = false;
let animeData = "";
// let placeholderValue = generatePlaceholder();
let placeholderValue = "default";

_queryInput.placeholder = placeholderValue;

function formSubmitted() {
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
        queryURL = "https://api.search.nicovideo.jp/api/v2/snapshot/video/contents/search?q="+encodeURIComponent(queryString)+"&targets=title&_sort=-startTime&fields=contentId,title,thumbnailUrl,startTime&_limit=10";
        getData(queryURL).then();
        console.log(animeData["data"][0]);
        let metaStatus = animeData["meta"]["status"];
        if (metaStatus === 200) {
            animeData = getData(queryURL);
            for (let i = 1; i <= 10; i ++) {
//                let j = i - 1;
                let thumbID = "queryTableThumb" + i;
                let titleID = "queryTableTitle" + i;
                let timeID = "queryTableTime" + i;
                console.log("ThumbID: "+thumbID);
                console.log("TitleID: "+titleID);
                console.log("timeID: "+timeID);
//                document.getElementById(thumbID).setAttribute("src", animeData.data.[j].thumbnailUrl);
            }
        }
    }
    else if (querySite === "mal") {
        // TODO: MAL API
    }
    else if (querySite === "al") {
        // TODO: AL API
    }
    else {
        throw new Error("Error: querySite does not exist");
    }
}

async function getData(apiURL) {
    apiURL = _proxyUrl + apiURL;
    fetch(apiURL)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            animeData = json;
        });
}

function nicoSeeMore() {

}

/*async function generatePlaceholder() {
    while (!animeNotFound) {
        let id = Math.floor(Math.random() * 33993 + 1);
        queryURL = "https://api.jikan.moe/v3/"+id;
        animeData = getData(queryURL);
        animeNotFound = animeData.status === "404";
    }
    return animeData.title;
}*/

// TODO: Load Kitsu API

// TODO: Load AnimeNewsNetwork API