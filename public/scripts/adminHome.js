const UserDiv = document.getElementById("user_card_div");
let usersList; //variable with users list

function fetchAll() {
  fetch("api/users")
    .then((response) => response.json())
    .then((users) => {
      render(users);
    })
    .catch((error) => console.error("Error fetching users:", error));
}

function fetchSearch(query) {
  fetch(`api/search/?searchQuery=${query}`)
    .then((response) => response.json())
    .then((users) => {
      render(users);
    })
    .catch((error) => console.error("Error fetching users:", error));
}

function render(users) {
  usersList = users;
  users.forEach((user) => {
    const userCard = document.createElement("div");
    userCard.className = "user_card";
    userCard.setAttribute("data-div-id", user._id);
    userCard.innerHTML = `
            <p class="col-3">${user.username}</p>
            <p class="col-3">${user.email}</p>
            <p class="col-3">${user.phoneno}</p>
            <div class="btn_div">
              <a class="delete_btn" data-id=${user._id}> <img src="/images/deleteicon.svg"> </a>
              <a class="edit_btn" data-id=${user._id}> <img src="/images/editicon.svg"> </a>
            </div>
        `;
    UserDiv.appendChild(userCard);
  });

  addButtonListener();
}

function editUser(userId) {
  // Redirect to the edit page or open a modal with user details for editing
  console.log("Edit user with ID:", userId);
  const editElement = document.querySelector(`[data-div-id="${userId}"]`);

  const user = usersList.find((user) => user._id === userId);

  const editCard = document.createElement("div");
  editCard.className = "edit_card";
  editCard.innerHTML = `
    <form action='/api/update-user/${userId}' method="POST">
    <input type="text" class="col-3" name="username" placeholder="Username" value="${user.username}">
    <input type="text" class="col-3" name="email" placeholder="Email" value="${user.email}">
    <input type="text" class="col-3" name="phoneno" placeholder="Phoneno" value="${user.phoneno}">
    <input type="submit" class="update_btn" value="Update">
    <form>
  `;

  UserDiv.replaceChild(editCard, editElement);
}

// Function to handle the delete action
function deleteUser(userId) {
  fetch(`/api/delete-user/${userId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        console.log("User deleted successfully");
        location.reload();
        console.error("Failed to delete user");
      }
    })
    .catch((error) => console.error("Error deleting user:", error));
}

function addButtonListener() {
  // Add event listeners for edit and delete buttons
  document.querySelectorAll(".edit_btn").forEach((button) => {
    button.addEventListener("click", function () {
      const userId = this.getAttribute("data-id");
      editUser(userId);
    });
  });

  document.querySelectorAll(".delete_btn").forEach((button) => {
    button.addEventListener("click", function () {
      const userId = this.getAttribute("data-id");
      const confirmModal = document.getElementById("confirmModal");
      confirmModal.style.display = "block";

      document
        .getElementById("confirmDelete")
        .addEventListener("click", function () {
          confirmModal.style.display = "none";
          deleteUser(userId);
        });

      document
        .getElementById("cancelDelete")
        .addEventListener("click", function () {
          confirmModal.style.display = "none";
        });
    });
  });
}

//search section

const searchfield = document.getElementById("searchField");

searchfield.addEventListener("input", () => {
  if (searchfield.value.length === 0) {
    UserDiv.innerHTML = "";
    fetchAll();
  } else if (searchfield.value.length > 0) {
    UserDiv.innerHTML = "";
    fetchSearch(searchfield.value);
  }
});

fetchAll();


const addButton = document.getElementById('add_btn');

addButton.addEventListener('click',()=>{
  document.getElementById('newUserCard').style.display= 'block' 
})