// Handle theme click and redirect to post-theme.html with theme parameter
const themeElements = document.querySelectorAll('.theme-container .theme');

themeElements.forEach(themeElement => {
    themeElement.addEventListener('click', () => {
        const theme = themeElement.getAttribute('data-theme');
        window.location.href = `good.html?theme=${theme}`;
    });
});

// Handle leaderboard navigation
const leaderboardButton = document.getElementById('leaderboard');
const themesSection = document.getElementById('themesSection');
const outfitsSection = document.getElementById('outfits');
const leaderboardSection = document.getElementById('leaderboardSection');
const savedSection = document.getElementById('savedSection');
const topPostsContainer = document.getElementById('topPosts');
const savedPostsContainer = document.getElementById('savedPosts');

leaderboardButton.addEventListener('click', () => {
    themesSection.style.display = 'none';
    outfitsSection.style.display = 'none';
    savedSection.style.display = 'none';
    leaderboardSection.style.display = 'block';
});

// Handle theme selection in leaderboard
const leaderboardThemes = document.querySelectorAll('.leaderboard .theme');

leaderboardThemes.forEach(themeElement => {
    themeElement.addEventListener('click', () => {
        const theme = themeElement.getAttribute('data-theme');
        displayTopPosts(theme);
    });
});

// Load posts from localStorage
function loadPosts() {
    const outfitsContainer = document.getElementById('outfits');
    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    outfitsContainer.innerHTML = ''; // Clear existing posts
    posts.forEach(post => {
        const postElement = createPostElement(post);
        outfitsContainer.appendChild(postElement);
    });
}

// Create post element
function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.setAttribute('data-post-id', post.id);

    let collageHTML = '';
    if (Array.isArray(post.image)) {
        collageHTML = '<div class="collage">';
        post.image.forEach(src => {
            collageHTML += `<div class="collage-box"><img src="${src}" alt="Posted Image"></div>`;
        });
        collageHTML += '</div>';
    } else {
        collageHTML = `<img src="${post.image}" alt="Outfit Post" class="post-image">`;
    }

    postElement.innerHTML = `
        <div class="user-profile">
            <img src="profile.jpg" alt="User Profile Picture" class="profile-picture">
            <p class="username">Username</p>
        </div>
        <p class="posted-time">${post.time}</p>
        <p class="post-theme">Theme: ${post.theme}</p>
        ${collageHTML}
        <div class="interaction">
            <button class="like-button">Like</button>
            <span class="like-count">${post.likes}</span>
            <button class="save-button">Save</button>
        </div>
    `;

    const likeButton = postElement.querySelector('.like-button');
    const saveButton = postElement.querySelector('.save-button');
    const likeCount = postElement.querySelector('.like-count');

    likeButton.addEventListener('click', () => {
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || [];
        if (!likedPosts.includes(post.id)) {
            likedPosts.push(post.id);
            localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
            post.likes++;
        } else {
            const index = likedPosts.indexOf(post.id);
            likedPosts.splice(index, 1);
            localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
            post.likes--;
        }
        likeCount.textContent = post.likes;
        updatePostLikes(post.id, post.likes);
    });

    saveButton.addEventListener('click', () => {
        savePost(post);
    });

    return postElement;
}

// Save post to saved section
function savePost(post) {
    const savedPosts = JSON.parse(localStorage.getItem('savedPosts')) || [];
    // Check if the post is already saved
    const postExists = savedPosts.some(savedPost => savedPost.id === post.id);
    if (!postExists) {
        savedPosts.push(post);
        localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
        displaySavedPosts();
    }
}

// Display saved posts
function displaySavedPosts() {
    savedPostsContainer.innerHTML = ''; // Clear existing posts
    const savedPosts = JSON.parse(localStorage.getItem('savedPosts')) || [];

    savedPosts.forEach(post => {
        const postElement = createPostElement(post);
        savedPostsContainer.appendChild(postElement);
    });
}

// Display top posts for a specific theme
function displayTopPosts(theme) {
    topPostsContainer.innerHTML = ''; // Clear existing posts
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const topPosts = posts
        .filter(post => post.theme === theme)
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 5);

    topPosts.forEach(post => {
        const postElement = createPostElement(post);
        topPostsContainer.appendChild(postElement);
    });
}

// Show saved section and hide others
document.getElementById('saved').addEventListener('click', () => {
    themesSection.style.display = 'none';
    outfitsSection.style.display = 'none';
    leaderboardSection.style.display = 'none';
    savedSection.style.display = 'block';
});

// Display collage in outfits section
function displayCollageInOutfitsSection() {
    const post = JSON.parse(localStorage.getItem('currentPost'));
    if (post && post.image) {
        const outfitsSection = document.getElementById('outfits');
        const existingPost = outfitsSection.querySelector(`[data-post-id="${post.id}"]`);
        if (!existingPost) {
            const postElement = createPostElement(post);
            outfitsSection.appendChild(postElement);
        }
    }
}

// Update post likes in local storage and UI
function updatePostLikes(postId, likes) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const savedPosts = JSON.parse(localStorage.getItem('savedPosts')) || [];

    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
        posts[postIndex].likes = likes;
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    const savedPostIndex = savedPosts.findIndex(post => post.id === postId);
    if (savedPostIndex !== -1) {
        savedPosts[savedPostIndex].likes = likes;
        localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
    }

    loadPosts();
    displaySavedPosts();
}

// Load saved posts and posts on page load
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    displaySavedPosts();
    displayCollageInOutfitsSection();
});
