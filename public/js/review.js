/* eslint-disable indent */
$(document).ready(() => {
  // Getting jQuery references to the review body, title, form, and zipcode select post
  const bodyInput = $("#body");
  const titleInput = $("#title");
  const reviewForm = $("#review");
  const zipcodeSelect = $("#zipcode");
  // Adding an event listener for when the form is submitted
  $(reviewForm).on("submit", handleFormSubmit);
  // Gets the part of the url that comes after the "?" (which we have if we're updating a review)
  const url = window.location.search;
  let reviewId;
  let zipcodeId;
  // Sets a flag for whether or not we're updating a review to be false initially
  let updating = false;

  // If we have this section in our url, we pull out the review id from the url
  // In '?review_id=1', reviewId is 1
  if (url.indexOf("?review_id=") !== -1) {
    reviewId = url.split("=")[1];
    getReviewData(reviewId, "review");
  }
  // Otherwise if we have a zipcode_id in our url, preset the zipcode select box to be our Zipcode
  else if (url.indexOf("?zipcode_id=") !== -1) {
    zipcodeId = url.split("=")[1];
  }

  // Getting the zipcodes, and their reviews
  getZipcodes();

  // A function for handling what happens when the form to create a new review is submitted
  function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the review if we are missing a body, title, or zipcode
    if (
      !titleInput.val().trim() ||
      !bodyInput.val().trim() ||
      !zipcodeSelect.val()
    ) {
      return;
    }
    // Constructing a newRevieww object to hand to the database
    const newReview = {
      title: titleInput.val().trim(),
      body: bodyInput.val().trim(),
      ZipCodeId: zipcodeSelect.val()
    };

    // If we're updating a review run updateReview to update a review
    // Otherwise run submitReview to create a whole new review
    if (updating) {
      newReview.id = reviewId;
      updateReview(newReview);
    } else {
      // console.log("else");
      submitReview(newReview);
    }
  }

  // Submits a new Review and brings user to members page upon completion
  function submitReview(review) {
    $.post("/api/reviews", review, () => {
      window.location.href = "/members";
    });
  }

  // Gets Review data for the current Review if we're editing, or if we're adding to a zipcode's existing reviews
  function getReviewData(id, type) {
    let queryUrl;
    switch (type) {
      case "review":
        queryUrl = "/api/reviews/" + id;
        break;
      case "zipcode":
        queryUrl = "/api/zipcodes/" + id;
        break;
      default:
        return;
    }
    console.log(queryUrl);
    $.get(queryUrl, data => {
      if (data) {
        // console.log(data.ZipCodeId || data.id);
        // If this review exists, prefill our review forms with its data
        titleInput.val(data.title);
        bodyInput.val(data.body);
        zipcodeId = data.ZipCodeId || data.id;
        // If we have a review with this id, set a flag for us to know to update the review
        // when we hit submit
        updating = true;
      }
    });
  }

  // A function to get Zipcodes and then render our list of Zipcodes
  function getZipcodes() {
    $.get("/api/zipcodes", renderZipcodeList);
  }
  // Function to render a list of zipcodes
  function renderZipcodeList(data) {
    $(".hidden").removeClass("hidden");
    const rowsToAdd = [];
    for (let i = 0; i < data.length; i++) {
      rowsToAdd.push(createZipcodeRow(data[i]));
    }
    zipcodeSelect.empty();
    // console.log(rowsToAdd);
    // console.log(zipcodeSelect);
    zipcodeSelect.append(rowsToAdd);
    zipcodeSelect.val(zipcodeId);
  }

  // Creates the zipcode options in the dropdown
  function createZipcodeRow(zipcode) {
    const listOption = $("<option>");
    listOption.attr("value", zipcode.id);
    listOption.text(zipcode.Zip);
    return listOption;
  }

  // Update a given review, bring user to the members page when done
  function updateReview(review) {
    $.ajax({
      method: "PUT",
      url: "/api/reviews",
      data: review
    }).then(() => {
      window.location.href = "/";
    });
  }
});
