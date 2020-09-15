$(document).ready(() => {
  // Getting references to the name input and zipcode container, as well as the table body
  const nameInput = $("#zipcode-name");
  const zipcodeList = $("tbody");
  const zipcodeContainer = $(".zipcode-container");
  // Adding event listeners to the form to create a new object, and the button to delete
  // a zipcode
  $(document).on("submit", "#zipcode-form", handleZipcodeFormSubmit);
  $(document).on("click", ".delete-zipcode", handleDeleteButtonPress);

  // Getting the initial list of zipcodes
  getZipcodes();

  // A function to handle what happens when the form is submitted to create a new Zipcode
  function handleZipcodeFormSubmit(event) {
    event.preventDefault();
    // Don't do anything if the name fields hasn't been filled out
    if (
      !nameInput
        .val()
        .trim()
        .trim()
    ) {
      return;
    }
    // Calling the upsertZipcode function and passing in the value of the name input
    upsertZipcode({
      name: nameInput.val().trim()
    });
  }

  // A function for creating a zipcode. Calls getZipcodes upon completion
  function upsertZipcode(zipcodeData) {
    $.post("/api/zipcodes", zipcodeData).then(getZipcodes);
  }

  // Function for creating a new list row for zipcodes
  function createZipcodeRow(zipcodeData) {
    const newTr = $("<tr>");
    newTr.data("zipcode", zipcodeData);
    newTr.append("<td>" + zipcodeData.name + "</td>");
    if (zipcodeData.Reviews) {
      newTr.append("<td> " + zipcodeData.Reviews.length + "</td>");
    } else {
      newTr.append("<td>0</td>");
    }
    newTr.append(
      "<td><a href='/blog?zipcode_id=" +
        zipcodeData.id +
        "'>Go to Reviews</a></td>"
    );
    newTr.append(
      "<td><a href='/cms?zipcode_id=" +
        zipcodeData.id +
        "'>Create a Review</a></td>"
    );
    newTr.append(
      "<td><a style='cursor:pointer;color:red' class='delete-zipcode'>Delete ZipCode</a></td>"
    );
    return newTr;
  }

  // Function for retrieving zipcodes and getting them ready to be rendered to the page
  function getZipcodes() {
    $.get("/api/zipcodes", data => {
      const rowsToAdd = [];
      for (let i = 0; i < data.length; i++) {
        rowsToAdd.push(createZipcodeRow(data[i]));
      }
      renderZipcodeList(rowsToAdd);
      nameInput.val("");
    });
  }

  // A function for rendering the list of Zipcodes to the page
  function renderZipcodeList(rows) {
    zipcodeList
      .children()
      .not(":last")
      .remove();
    zipcodeContainer.children(".alert").remove();
    if (rows.length) {
      console.log(rows);
      zipcodeList.prepend(rows);
    } else {
      renderEmpty();
    }
  }

  // Function for handling what to render when there are no Zipcodes
  function renderEmpty() {
    const alertDiv = $("<div>");
    alertDiv.addClass("alert alert-danger");
    alertDiv.text("You must create a ZipCode before you can create a Review.");
    zipcodeContainer.append(alertDiv);
  }

  // Function for handling what happens when the delete button is pressed
  function handleDeleteButtonPress() {
    const listItemData = $(this)
      .parent("td")
      .parent("tr")
      .data("zipcode");
    const id = listItemData.id;
    $.ajax({
      method: "DELETE",
      url: "/api/zipcodes/" + id
    }).then(getZipcodes);
  }
});
