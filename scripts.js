const applicationId = 'your applicationId'; 
const accessKey = 'your access key'; 
const secretKey = 'your secretKey'; 

function fetchImages() {
    const searchQuery = document.getElementById('searchQuery').value;

    if (!accessKey) {
        alert('Access Key is missing.');
        return;
    }

    const url = searchQuery
        ? `https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=${accessKey}`
        : `https://api.unsplash.com/photos/?client_id=${accessKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const images = searchQuery ? data.results : data;
            loadImages(images);
        })
        .catch(error => {
            console.error('Error fetching images:', error);
        });
}

function loadImages(images) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    images.forEach(image => {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');

        const imgElement = document.createElement('img');
        imgElement.src = image.urls.small;
        imgElement.alt = image.alt_description;
        imgElement.dataset.fullSizeUrl = image.urls.full; 
        imgElement.dataset.category = 'nature';
        imgElement.dataset.tags = image.tags.map(tag => tag.title).join(',');

        imgElement.onclick = () => openFullView(image.urls.full); 

        galleryItem.appendChild(imgElement);
        gallery.appendChild(galleryItem);
    });
}

function openFullView(fullSizeUrl) {
    const fullView = document.getElementById('fullView');
    const fullImage = document.getElementById('fullImage');
    const downloadBtn = document.getElementById('downloadBtn');

    fullImage.src = fullSizeUrl;
    fullView.style.display = 'block';

    downloadBtn.onclick = () => downloadImage(fullSizeUrl);
}

function closeFullView() {
    const fullView = document.getElementById('fullView');
    fullView.style.display = 'none';
}

function downloadImage(url) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'image.jpg'; 
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error downloading image:', error);
        });
}

function filterImages() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const tagFilter = document.getElementById('tagFilter').value;

    const gallery = document.getElementById('gallery');
    const images = gallery.getElementsByClassName('gallery-item');

    for (let img of images) {
        const category = img.querySelector('img').dataset.category;
        const tags = img.querySelector('img').dataset.tags.split(',');

        if ((categoryFilter === 'all' || categoryFilter === category) &&
            (tagFilter === 'all' || tags.includes(tagFilter))) {
            img.style.display = '';
        } else {
            img.style.display = 'none';
        }
    }
}