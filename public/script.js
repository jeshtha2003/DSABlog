document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('postsContainer');
  
    // Function to create post elements
    function createPostElement(post) {
      const postDiv = document.createElement('div');
      postDiv.classList.add('post');
  
      // Title section
      const toggleTitleButton = document.createElement('button');
      toggleTitleButton.classList.add('toggle-title-button'); // Add class for styling
      toggleTitleButton.textContent = 'Show Title';
  
      const titleHeader = document.createElement('h2');
      titleHeader.textContent = post.title;
      titleHeader.classList.add('post-title');
      titleHeader.style.display = 'none'; // Initially hide title
  
      // Content section
      const contentParagraph = document.createElement('p');
      contentParagraph.textContent = post.content;
  
      // Timestamp section
      const timestampPara = document.createElement('p');
      timestampPara.textContent = `Posted on: ${new Date(post.timestamp).toLocaleString()}`;
      timestampPara.classList.add('timestamp');
  
      // Actions section (Edit and Delete buttons)
      const actionsDiv = document.createElement('div');
      actionsDiv.classList.add('actions');
  
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.classList.add('edit');
      editButton.addEventListener('click', () => {
        // Implement edit functionality here
        console.log('Edit button clicked for post:', post.id);
      });
  
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('delete');
      deleteButton.addEventListener('click', () => {
        // Implement delete functionality here
        console.log('Delete button clicked for post:', post.id);
      });
  
      // Append elements to postDiv
      actionsDiv.appendChild(editButton);
      actionsDiv.appendChild(deleteButton);
  
      postDiv.appendChild(toggleTitleButton);
      postDiv.appendChild(titleHeader);
      postDiv.appendChild(contentParagraph);
      postDiv.appendChild(timestampPara);
      postDiv.appendChild(actionsDiv);
  
      // Toggle title visibility when button is clicked
      toggleTitleButton.addEventListener('click', () => {
        if (titleHeader.style.display === 'none') {
          titleHeader.style.display = 'block'; // Show title
          toggleTitleButton.textContent = 'Hide Title'; // Change button text
        } else {
          titleHeader.style.display = 'none'; // Hide title
          toggleTitleButton.textContent = 'Show Title'; // Change button text
        }
      });
  
      return postDiv;
    }
  
    // Fetch posts and display them
    function fetchAndDisplayPosts() {
      fetch('/api/posts')
        .then(response => response.json())
        .then(posts => {
          postsContainer.innerHTML = ''; // Clear previous posts
  
          posts.forEach(post => {
            const postElement = createPostElement(post);
            postsContainer.appendChild(postElement);
          });
        })
        .catch(error => {
          console.error('Error fetching posts:', error);
        });
    }
  
    // Initial fetch and display of posts
    fetchAndDisplayPosts();
  
    // Form submission handler (for posting new blogs)
    const blogForm = document.getElementById('blogForm');
    blogForm.addEventListener('submit', event => {
      event.preventDefault();
  
      const title = document.getElementById('title').value;
      const content = document.getElementById('content').value;
  
      // Prepare data for POST request
      const postData = {
        title,
        content
      };
  
      // POST request to create new post
      fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })
      .then(response => response.json())
      .then(newPost => {
        console.log('New post added:', newPost);
        fetchAndDisplayPosts(); // Refresh posts after adding new one
        blogForm.reset(); // Clear form fields
      })
      .catch(error => {
        console.error('Error adding new post:', error);
      });
    });
  });
  