let cards = [];
function Card(image_url,title,description,keyword,horns){
    this.image_url = image_url;
    this.title = title;
    this.description = description;
    this.keyword = keyword;
    this.horns = horns;
    cards.push(this);
}
Card.prototype.render = function(keyword){
    for (let i = 0 ; i < cards.length ; i++){
        if (cards[i].keyword == keyword){
            let object = `<div><h2>${cards[i].title}</h2><img src=${cards[i].image_url}><p>${cards[i].description}</p></div>`;
            $('main').append(object);
        }
    }
}
$(document).ready(renderImages);
function renderImages() {
    const settings = {
        method: 'get',
        dataType: 'json',
    }
    $.ajax('./../data/page-1.json', settings)
        .then(data =>{
            data.forEach((element) => {
                new Card(element.image_url,element.title,element.description,element.keyword,element.horns);
                let noOfOptions = $('select').children().length;
                if (noOfOptions == 0){
                    noOfOptions = 1;
                }
                for (let i = 0 ; i < noOfOptions ; i++){
                    let optionValue = $('select').children('option').eq(i).val();
                    if(element.keyword !== optionValue && i == noOfOptions-1){
                        console.log(element.keyword)
                        $('select').append(`<option value="${element.keyword}">${element.keyword}</option>`)
                    } else if (element.keyword == optionValue){
                        break;
                    }
                }
            });
            cards[0].render($('select').children('option').eq(0).val());
            $('select').on('change',function(){
                $('main').empty();
                cards[0].render($('select').val());
            });
        });
}
