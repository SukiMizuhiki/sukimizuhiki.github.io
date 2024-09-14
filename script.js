// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Login and Authentication
document.getElementById('login-btn').addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then((result) => {
        alert(`Welcome, ${result.user.displayName}`);
    }).catch((error) => {
        console.error('Login failed', error);
    });
});

// Fetch Projects from Firestore
function fetchProjects() {
    db.collection('projects').get().then((snapshot) => {
        const projectGallery = document.getElementById('project-gallery');
        projectGallery.innerHTML = ''; // Clear gallery before loading

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
    });
}

// Fetch Blog Posts from Firestore
function fetchBlogPosts() {
    db.collection('blog').get().then((snapshot) => {
        const blogPosts = document.getElementById('blog-posts');
        blogPosts.innerHTML = ''; // Clear blog section before loading

        snapshot.forEach((doc) => {
            const post = doc.data();
            const postCard = document.createElement('div');
            postCard.classList.add('post-card', 'bg-white', 'p-6', 'rounded-lg', 'shadow-lg');
            postCard.innerHTML = `
                <h3 class="text-2xl font-semibold mb-2">${post.title}</h3>
                <p class="mb-4">${post.content}</p>
            `;
            blogPosts.appendChild(postCard);
        });
    });
}

// Fetch data on page load
window.addEventListener('DOMContentLoaded', () => {
    fetchProjects();
    fetchBlogPosts();
});
