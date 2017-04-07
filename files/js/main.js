'use strict';

let originalData = null;
let map = null;
let marker = null;

document.querySelector('#reset-button').addEventListener('click', () => {
    update(originalData);
});

const createCard = (image, title, texts) => {
    let text = '';
    for (let t of texts){
        text += `<p class="card-text">${t}</p>`;

    }

    return `<img class="card-img-top" src="${image}" alt="">
            <div class="card-block">
                <h3 class="card-title">${title}</h3>
                ${text}                
            </div>
            <div class="card-footer">
                <p><button class="btn btn-primary">View</button></p>
            </div>`;
};

const categoryButtons = (items) => {
    items = removeDuplicates(items, 'category');
    console.log(items);
    document.querySelector('#categories').innerHTML = '';
    for (let item of items) {
        const button = document.createElement('button');
        button.class = 'btn btn-secondary';
        button.innerText = item.category;
        document.querySelector('#categories').appendChild(button);
        button.addEventListener('click', () => {
            sortItems(originalData, item.category);
        });

    }
};

const sortItems = (items, rule) => {
    const newItems = items.filter(item => item.category === rule);
    // console.log(newItems);
    update(newItems);
};

const getData = (query) => {
    fetch('/posts')
        .then(response => {
            return response.json();
        })
        .then(items => {
            originalData = items;
            update(items);
        });
    if (query != null) {
        fetch('/posts/' + query)
            .then(response => {
                return response.json();
            })
            .then(items => {
                originalData = items;
                update(items);
            });
    }

};

const removeDuplicates = (myArr, prop) => {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
};

const update = (items) => {
    categoryButtons(items);
    document.querySelector('.card-deck').innerHTML = '';
    $('#catSelect').empty();
    $('#removeCatSelect').empty();

    for (let item of items) {
        // console.log(item);
        const article = document.createElement('article');
        article.setAttribute('class', 'card');
        const time = moment(item.time);
        article.innerHTML = createCard(item.thumbnail, item.title, ['<small>'+time.format('dddd, MMMM Do YYYY, HH:mm')+'</small>', item.details]);
        article.addEventListener('click', () => {
            document.querySelector('.modal-body img').src = item.image;
            document.querySelector('.modal-title').innerHTML = item.title;
            resetMap(item);
            document.querySelector('#map').addEventListener('transitionend', () => {
                resetMap(item);
            });
            const myModal = $('#myModal');
            myModal.on('shown.bs.modal', () => {
                resetMap(item);
            });
            myModal.modal('show');
        });
        document.querySelector('.card-deck').appendChild(article);

        // add options on the update and remove tabs
        const option = document.createElement('option');
        option.innerText = item.title;
        const option2 = document.createElement('option');
        option2.innerText = item.title;
        document.querySelector('#catSelect').appendChild(option);
        document.querySelector('#removeCatSelect').appendChild(option2);
    }
};

const initMap = () => {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11
    });
    marker = new google.maps.Marker({
        map: map
    });
    getData();
};

const resetMap = (item) => {
    const coords = item.coordinates;
    console.log(coords);
    google.maps.event.trigger(map, "resize");
    map.panTo(coords);
    marker.setOptions({
        position: coords
    });
};

initMap();

// add new
document.querySelector('#spyForm').addEventListener('submit', (evt) => {
    evt.preventDefault();
    const data = new FormData(evt.target);
    const fileElement = event.target.querySelector('input[type=file]');
    const file = fileElement.files[0];
    data.append('file', file);

    const url = '/new';

    fetch(url, {
        method: 'post',
        body: data
    }).then((resp)=> {
        // console.log(resp);
        getData();
        $('#myTabs a:first').tab('show');
    });
});

// update cat
document.querySelector('#updateSpyForm').addEventListener('submit', (evt) => {
    evt.preventDefault();
    const data = new FormData(evt.target);
    const fileElement = event.target.querySelector('input[type=file]');
    const file = fileElement.files[0];
    data.append('file', file);
    const selectedCatIndex = document.getElementById('catSelect').selectedIndex;
    const myCat = originalData[selectedCatIndex]._id;
    data.append('id',myCat);

    const url = '/update';

    fetch(url, {
        method: 'PATCH',
        body: data
    }).then((resp)=> {
        // console.log(resp);
        getData();
        $('#myTabs a:first').tab('show');
    });
});

// delete cat
document.querySelector('#removeSpyForm').addEventListener('submit', (evt) => {
    evt.preventDefault();
    const selectedCatIndex = document.getElementById('removeCatSelect').selectedIndex;
    const myCat = originalData[selectedCatIndex]._id;
    const data = new FormData();
    data.append('id',myCat);

    const url = '/remove';

    fetch(url, {
        method: 'delete',
        body: data
    }).then((resp)=> {
        // console.log(resp);
        getData();
        $('#myTabs a:first').tab('show');
    });
});

// init tabs
$('#myTabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
});


document.getElementById('searchButton').addEventListener('click', () => {
    const searchQuery = document.getElementById('searchInput').value;
    getData(searchQuery);
});
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    const key = e.which || e.keyCode;
    if (key === 13) {
        const searchQuery = document.getElementById('searchInput').value;
        getData(searchQuery);
    }
});


// listener for select options
document.getElementById('catSelect').addEventListener('change', () => {
    const selectedCatIndex = document.getElementById('catSelect').selectedIndex;
    const myCat = originalData[selectedCatIndex];

    document.getElementById('categoryUpdated').value = myCat.category;
    document.getElementById('titleUpdated').value = myCat.title;
    document.getElementById('detailsUpdated').value = myCat.details;
});

// update values for the current selection when moving to the update tab
$('#updateTabButton').click(function (e) {
    const selectedCatIndex = document.getElementById('catSelect').selectedIndex;
    const myCat = originalData[selectedCatIndex];
    
    document.getElementById('categoryUpdated').value = myCat.category;
    document.getElementById('titleUpdated').value = myCat.title;
    document.getElementById('detailsUpdated').value = myCat.details;
});