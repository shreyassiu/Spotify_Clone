
mediaPage = document.querySelectorAll('.library .heading, .heading h2, .heading h5, .card, .create-button, .mediapage');

mediaPage.forEach(function(element) {
    element.addEventListener('click', function() {
        window.location.href = 'media.html';
    });
});

 // Event listener for ham in media query
 document.querySelector(".ham-button").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
});

// Event listener for closing x in media query
document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
});