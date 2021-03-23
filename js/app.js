let cards = [];
let optionArray = [];

function Card(image_url, title, description, keyword, horns) {
    this.image_url = image_url;
    this.title = title;
    this.description = description;
    this.keyword = keyword;
    this.horns = horns;
    cards.push(this);
}

Card.prototype.render = function (keyword) {
    if (this.keyword == keyword) {
        let cardTemplate = $('#card').html();
        console.log(cardTemplate);
        let cardHtmlData = Mustache.render(cardTemplate,this);
        $('main').append(cardHtmlData);
        console.log($('main'));
    }
}

$(document).ready(renderImages);

function renderImages() {
    $('form').children().eq(0).prop("checked", true);
    let pageSrc = './../data/page-1.json';
    let pageSort = 'sort1';
    let optionValue = null;
    pageDataPreparing(pageSrc,pageSort,optionValue)
    $('select').on('change', () => {
        $('main').empty();
        cards.forEach(element => {
            optionValue = $('select').val();
            element.render(optionValue);
        });
    });
    $('button').on('click', (event) => {
        emptyAll();
        let pageNo = event.target.value;
        if (pageNo == 'page1'){
            pageSrc = './../data/page-1.json';
        } else if (pageNo == 'page2'){
            pageSrc = './../data/page-2.json'
        }
        optionValue = null;
        pageDataPreparing(pageSrc,pageSort,optionValue);
    })
    $('input').on('click',(event) => {
        emptyAll();
        $('input').prop("checked", false);
        event.target.checked = "checked";
        pageSort = event.target.value;
        pageDataPreparing(pageSrc,pageSort,optionValue);
    })
}

function pageDataPreparing(pageSrc,pageSort,optionValue) {
    const settings = {
        method: 'get',
        dataType: 'json',
    }
    $.ajax(pageSrc, settings)
        .then(data => {
            data.forEach((element) => {
                new Card(element.image_url, element.title, element.description, element.keyword, element.horns);
                let noOfOptions = optionArray.length;
                if (noOfOptions == 0) {
                    noOfOptions = 1;
                }
                for (let i = 0; i < noOfOptions; i++) {
                    let optValue = optionArray[i];
                    if (element.keyword !== optValue && i == noOfOptions - 1) {
                        optionArray.push(element.keyword);
                    } else if (element.keyword == optValue) {
                        break;
                    }
                }
            });
            optionArray.sort((a,b) => {
                if (a.toUpperCase() < b.toUpperCase()){
                    return -1
                } else if (a.toUpperCase() == b.toUpperCase()){
                    return 0;
                }else if (a.toUpperCase() > b.toUpperCase()){
                    return 1
                }
            });
            optionArray.forEach(element => {
                $('select').append(`<option value="${element}">${element}</option>`)
            })
            if (pageSort == 'sort1'){
                sortByTitle(cards);
            }else if (pageSort == 'sort2'){
                sortByHorns(cards);
            }
            cards.forEach(element => {
                if (optionValue == null){
                    element.render($('select').val());
                }else{
                    element.render(optionValue);
                }
            });
        });
    })
}

function emptyAll(){
    optionArray = [];
    cards = [];
        $('main').empty();
        $('select').empty();
}

function sortByTitle(cards){
    cards.sort((a,b)=>{
        if(a.title < b.title){
            return -1;
        } else if (a.title == b.title){
            return 0;
        }else if (a.title > b.title){
            return 1
        }
    })
}

function sortByHorns(cards){
    cards.sort((a,b) =>{
        return a.horns - b.horns;
    });
}
