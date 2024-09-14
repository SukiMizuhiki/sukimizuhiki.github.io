// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const db = firebase.firestore();

// Dark Mode Toggle
document.getElementById('dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('bg-white');
    document.body.classList.toggle('bg-gray-900');
    document.body.classList.toggle('text-black');
    document.body.classList.toggle('text-white');
});

// Fetch and display projects from Firebase Firestore
function fetchProjects() {
    db.collection('projects').get().then((snapshot) => {
        const projectGallery = document.getElementById('project-gallery');
        projectGallery.innerHTML = ''; // Clear existing projects

        snapshot.forEach((doc) => {
            const project = doc.data();
            const projectCard = document.createElement('div');
            projectCard.classList.add('project-card', 'bg-white', 'p-6', 'rounded-lg', 'shadow-lg');
            projectCard.innerHTML = `
                <h3 class="text-2xl font-semibold mb-2">${project.title}</h3>
                <p class="mb-4">${project.description}</p>
                <a href="${project.link}" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">View Project</a>
            `;
            projectGallery.appendChild(projectCard);
        });
    }).catch((error) => {
        console.error('Error fetching projects:', error);
    });
}

// Fetch projects on page load
window.addEventListener('DOMContentLoaded', fetchProjects);
