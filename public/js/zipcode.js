$(document).ready(() => {
  // Getting references to the name input and zipcode container, as well as the table body
  const nameInput = $("#zipcode-name");
  const zipcodeList = $("tbody");
  const zipcodeContainer = $(".zipcode-container");
  // Adding event listeners to the form to create a new object, and the button to delete
  // a zipcode
  $(document).on("submit", "#zipcode-form", handleZipcodeFormSubmit);

  // Getting the initial list of zipcodes
  //getZipcodes();

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
    // Calling the getZipcodes function and passing in the value of the zipcode input
    getZipcodes(nameInput.val().trim());
  }

  // Function for creating a new list row for zipcodes
  function createZipcodeRow(zipcodeData) {
    const newTr = $("<tr>");
    newTr.data("zipcode", zipcodeData);
    newTr.append("<td>" + zipcodeData.Zip + "</td>");
    if (zipcodeData.Reviews) {
      newTr.append("<td> " + zipcodeData.Reviews.length + "</td>");
    } else {
      newTr.append("<td>0</td>");
    }
    newTr.append(
      "<td><a href='/?zipcode_id=" + zipcodeData.id + "'>Go to Reviews</a></td>"
    );
    newTr.append(
      "<td><a href='/review?zipcode_id=" +
        zipcodeData.id +
        "'>Create a Review</a></td>"
    );
    return newTr;
  }

  // Function for retrieving zipcodes and getting them ready to be rendered to the page
  function getZipcodes(zipcodeData) {
    $.get("/api/zipcodes/" + zipcodeData, data => {
      const rowsToAdd = [];
      rowsToAdd.push(createZipcodeRow(data));
      console.log(rowsToAdd);
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
});
