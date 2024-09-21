//Gets document elements so I don't worry about them later
const clubForm = document.getElementById('club-form');
const updateModal = document.getElementById('update-modal');
const updateClubForm = document.getElementById('update-club-form');
const deleteModal = document.getElementById('delete-modal');
const tableBody = document.querySelector('#club-table tbody');

//This generates a new id for each inserted club, lastClubId key is contained in localStorage aswell as its value
function getNextClubId() {
    let lastId = parseInt(localStorage.getItem('lastClubId')) || 0;
    const newId = lastId + 1;
    localStorage.setItem('lastClubId', newId); // Update the last used ID in localStorage
    return newId;
}

// Function to add a club to localStorage
function addClubToLocalStorage(club) {
    let clubs = JSON.parse(localStorage.getItem('clubs')) || []; // Retrieve existing clubs or an empty array
    clubs.push(club); 
    localStorage.setItem('clubs', JSON.stringify(clubs)); // Store the updated clubs array in localStorage
    alert('Club added successfully!');
    clubForm.reset(); // Reset the form after submission
}

// Function to display clubs stored in localStorage
function displayClubs() {
    tableBody.innerHTML = ''; // Clear the table body

    let clubs = JSON.parse(localStorage.getItem('clubs')) || []; // Get the clubs from localStorage
    if (!clubs || clubs.length === 0) {
        alert('No clubs to display.');
        return;
    }

    // Display each club in the table with Update and Delete buttons, also associates id of the club with the delete and update buttons so that when they're
    // clicked it's known which club is going to be deleted 
    clubs.forEach(c => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${c.id}</td>
            <td>${c.name}</td>
            <td>${c.color}</td>
            <td>${c.foundation}</td>
            <td>
                <button class="update-btn" data-id="${c.id}">Update</button>
                <button class="delete-btn" data-id="${c.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Add event listeners for Update and Delete buttons
    tableBody.querySelectorAll('.update-btn').forEach(button => {
        button.addEventListener('click', function() {
            const clubId = this.getAttribute('data-id');
            showUpdateModal(clubId); // Show the update modal and fill it with club data
        });
    });

    tableBody.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const clubId = this.getAttribute('data-id');
            deleteClub(clubId); // Delete the club
        });
    });
}

// Function to show the update modal with club ID
function showUpdateModal(clubId) {
    document.getElementById('update-club-id').value = clubId; // Set the hidden field with club ID
    updateModal.classList.add('show');
}

// Handle Update Club submission
updateClubForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const clubId = document.getElementById('update-club-id').value;
    const newClubName = document.getElementById('update-club-name').value.trim();
    const newClubColor = document.getElementById('new-club-color').value.trim();
    const newClubFoundation = document.getElementById('new-club-foundation').value.trim();

    let clubs = JSON.parse(localStorage.getItem('clubs')) || [];
    let club = clubs.find(c => c.id == clubId);

    if (club) {
        // Update only the fields that the user filled in
        if (newClubName) club.name = newClubName;
        if (newClubColor) club.color = newClubColor;
        if (newClubFoundation) club.foundation = newClubFoundation;

        localStorage.setItem('clubs', JSON.stringify(clubs)); // Update localStorage
        alert('Club updated successfully!');
        displayClubs();
        updateModal.classList.remove('show'); // Close the modal
    } else {
        alert('Club not found!');
    }
});

// Function to delete a club by its ID
function deleteClub(clubId) {
    let clubs = JSON.parse(localStorage.getItem('clubs')) || [];
    const updatedClubs = clubs.filter(c => c.id != clubId); // Remove the club by filtering it out

    localStorage.setItem('clubs', JSON.stringify(updatedClubs)); // Update localStorage
    alert('Club deleted successfully!');
    displayClubs(); // Refresh the displayed clubs
}

// Add event listener for the cancel button in the update modal
document.getElementById('cancel-update').addEventListener('click', function() {
    document.getElementById('update-club-name').value = '';
    document.getElementById('new-club-color').value = '';
    document.getElementById('new-club-foundation').value = '';
    updateModal.classList.remove('show');
});

// Event listener for form submission to add a new club
clubForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Get form values
    const clubName = document.getElementById('club-name').value.trim();
    const clubColor = document.getElementById('club-color').value.trim();
    const clubFoundation = document.getElementById('club-foundation').value.trim();

    // Create a club object with an auto-incremented ID
    const club = {
        id: getNextClubId(),
        name: clubName,
        color: clubColor,
        foundation: clubFoundation
    };

    addClubToLocalStorage(club);
    displayClubs();
});

// Load the clubs already contained in local storage when the page loads
window.onload = displayClubs;
