document.addEventListener('DOMContentLoaded', function () {
    const blogForm = document.getElementById('blogForm');
    const postsContainer = document.getElementById('postsContainer');
    let editingPostId = null;

    async function fetchPosts() {
        const response = await fetch('/api/posts');
        const posts = await response.json();
        renderPosts(posts);
    }

    function renderPosts(posts) {
        postsContainer.innerHTML = '';
        posts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.classList.add('post');
            postDiv.innerHTML = `
                <button class="toggle-title-button" data-id="${post.id}">Show Title</button>
                <h2 style="display:none;">${post.title}</h2>
                <p>${post.content}</p>
                <div class="timestamp">Posted on: ${new Date(post.timestamp).toLocaleString()}</div>
                <div class="actions">
                    <button class="edit" data-id="${post.id}">Edit</button>
                    <button class="delete" data-id="${post.id}">Delete</button>
                </div>
            `;
            postsContainer.appendChild(postDiv);

            const toggleTitleButton = postDiv.querySelector('.toggle-title-button');
            const titleHeader = postDiv.querySelector('h2');

            toggleTitleButton.addEventListener('click', () => {
                if (titleHeader.style.display === 'none') {
                    titleHeader.style.display = 'block';
                    toggleTitleButton.textContent = 'Hide Title';
                } else {
                    titleHeader.style.display = 'none';
                    toggleTitleButton.textContent = 'Show Title';
                }
            });
        });
    }

    async function handleFormSubmit(event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        const post = { title, content };

        if (editingPostId) {
            await fetch(`/api/posts/${editingPostId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(post)
            });
        } else {
            await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(post)
            });
        }

        blogForm.reset();
        editingPostId = null;
        await fetchPosts();
    }

    async function handlePostEdit(event) {
        if (event.target.classList.contains('edit')) {
            const postId = event.target.dataset.id;
            const response = await fetch(`/api/posts/${postId}`);
            const post = await response.json();
            document.getElementById('title').value = post.title;
            document.getElementById('content').value = post.content;
            editingPostId = postId;
        }
    }

    async function handlePostDelete(event) {
        if (event.target.classList.contains('delete')) {
            const postId = event.target.dataset.id;
            await fetch(`/api/posts/${postId}`, {
                method: 'DELETE'
            });
            await fetchPosts();
        }
    }

    blogForm.addEventListener('submit', handleFormSubmit);
    postsContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('edit')) {
            handlePostEdit(event);
        } else if (event.target.classList.contains('delete')) {
            handlePostDelete(event);
        }
    });

    fetchPosts();
});
