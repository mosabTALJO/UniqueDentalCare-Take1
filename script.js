// Form handling via AJAX
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;

    submitBtn.innerText = 'Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(form);

    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            alert('Thank you! Your request has been sent.');
            form.reset();
        })
        .catch(error => {
            alert('Oops! There was a problem submitting your form.');
        })
        .finally(() => {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        });
});

// Google Maps Places API Reviews
function initReviews() {
    const map = new google.maps.Map(document.getElementById('hidden-map'), {
        center: { lat: 0, lng: 0 },
        zoom: 1
    });

    const service = new google.maps.places.PlacesService(map);
    const placeId = 'ChIJ27lfF2ld5IkRy7vZ6OJp0u0';

    service.getDetails({
        placeId: placeId,
        fields: ['reviews']
    }, function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK && place.reviews) {
            const container = document.getElementById('reviews-container');
            container.innerHTML = ''; // Clear the container

            // Filter for reviews with 4 or more stars
            const highReviews = place.reviews.filter(review => review.rating >= 4);

            highReviews.forEach(review => {
                const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

                const card = document.createElement('div');
                card.className = 'glass p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full';

                card.innerHTML = `
                    <div class="flex items-center mb-6">
                        <img src="${review.profile_photo_url}" alt="${review.author_name}" class="w-12 h-12 rounded-full mr-4 object-cover shadow-sm">
                        <div>
                            <p class="font-semibold text-primary">${review.author_name}</p>
                            <div class="text-accent text-sm tracking-widest">${stars}</div>
                        </div>
                    </div>
                    <p class="text-gray-700 italic mb-6 flex-grow">"${review.text}"</p>
                    <p class="text-xs text-gray-500 font-medium">${review.relative_time_description}</p>
                `;

                container.appendChild(card);
            });
        }
    });
}
