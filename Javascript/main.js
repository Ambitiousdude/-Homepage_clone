// store the actual API endpoint in a variable
const apiUrl =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
let data = [];
let selectedRows = [];
let currentPage = 1;
let rowsPerPage = 10;

function fetchData() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((jsonData) => {
      data = jsonData;
      renderTable();
    });
}

document.addEventListener("DOMContentLoaded", function () {
  fetchData();
});

document.getElementById("search").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    fetchData();
  }
});

document.getElementById("search-icon").addEventListener("click", function () {
  fetchData();
});

document.getElementById("select-all").addEventListener("change", function () {
  selectAllRows(this.checked);
});

document
  .getElementById("member-table")
  .addEventListener("click", function (event) {
    if (event.target.tagName === "BUTTON") {
      handleAction(event.target);
    }
  });

document
  .getElementById("delete-selected")
  .addEventListener("click", function () {
    deleteSelectedRows();
  });

document.getElementById("first-page").addEventListener("click", function () {
  goToPage(1);
});

document.getElementById("previous-page").addEventListener("click", function () {
  goToPage(currentPage - 1);
});

document.getElementById("next-page").addEventListener("click", function () {
  goToPage(currentPage + 1);
});

document.getElementById("last-page").addEventListener("click", function () {
  goToPage(Math.ceil(data.length / rowsPerPage));
});

function renderTable() {
  const searchTerm = document.getElementById("search").value.toLowerCase();
  const filteredData = data.filter(
    (row) =>
      row.name.toLowerCase().includes(searchTerm) ||
      row.email.toLowerCase().includes(searchTerm) ||
      row.role.toLowerCase().includes(searchTerm)
  );

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = "";

  for (let i = 0; i < paginatedData.length; i++) {
    const row = document.createElement("tr");
    const checkboxCell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", function () {
      toggleRowSelection(paginatedData[i], this.checked);
    });
    checkboxCell.appendChild(checkbox);
    row.appendChild(checkboxCell);

    for (let key in paginatedData[i]) {
      if (key !== "id") {
        const cell = document.createElement("td");
        cell.textContent = paginatedData[i][key];
        row.appendChild(cell);
      }
    }

    const actionsCell = document.createElement("td");
    const viewButton = document.createElement("button");
    viewButton.textContent = "View";
    viewButton.addEventListener("click", function () {
      handleAction(viewButton);
    });
    actionsCell.appendChild(viewButton);

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", function () {
      handleAction(editButton);
    });
    actionsCell.appendChild(editButton);

    row.appendChild(actionsCell);

    tableBody.appendChild(row);
  }

  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const firstPageButton = document.getElementById("first-page");
  const previousPageButton = document.getElementById("previous-page");
  const nextPageButton = document.getElementById("next-page");
  const lastPageButton = document.getElementById("last-page");

  if (currentPage === 1) {
    firstPageButton.disabled = true;
    previousPageButton.disabled = true;
  } else {
    firstPageButton.disabled = false;
    previousPageButton.disabled = false;
  }

  if (currentPage === totalPages) {
    nextPageButton.disabled = true;
    lastPageButton.disabled = true;
  } else {
    nextPageButton.disabled = false;
    lastPageButton.disabled = false;
  }

  const pageNumberButtons = document.getElementsByClassName("page-number");
  while (pageNumberButtons.length > 0) {
    pageNumberButtons[0].parentNode.removeChild(pageNumberButtons[0]);
  }

  for (let i = 1; i <= totalPages; i++) {
    const pageNumberButton = document.createElement("button");
    pageNumberButton.textContent = i;
    pageNumberButton.addEventListener("click", function () {
      goToPage(i);
    });
    pageNumberButton.classList.add("page-number");
    if (i === currentPage) {
      pageNumberButton.disabled = true;
    }
    document.getElementById("pagination").appendChild(pageNumberButton);
  }
}

function goToPage(page) {
  currentPage = page;
  renderTable();
}

function handleAction(button) {
  const selectedRow = button.parentNode.parentNode;
  const id = selectedRow.getElementsByTagName("td")[0].textContent;
  console.log("ID:", id);
}

function toggleRowSelection(rowData, isSelected) {
  const index = selectedRows.indexOf(rowData);
  if (isSelected && index === -1) {
    selectedRows.push(rowData);
  } else if (!isSelected && index !== -1) {
    selectedRows.splice(index, 1);
  }
}

function deleteRow(id) {
  const row = document.querySelector(`#tableBody tr[data-id="${id}"]`);
  row.remove();
}

function editRow(id) {
  const row = document.querySelector(`#tableBody tr[data-id="${id}"]`);
  row.classList.add("editing");
}
