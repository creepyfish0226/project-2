$(document).ready(() => {
  /* global moment */

  // blogContainer holds all of our reviews
  const blogContainer = $(".blog-container");
  const reviewCategorySelect = $("#category");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete", handleReviewDelete);
  $(document).on("click", "button.edit", handleReviewEdit);
  // Variable to hold our reviews
  let reviews;

  // // The code below handles the case where we want to get blog reviews for a specific zipcode
  // // Looks for a query param in the url for zipcode_id
  // const url = window.location.search;
  // let zipcodeId;
  // if (url.indexOf("?zipcode_id=") !== -1) {
  //   zipcodeId = url.split("=")[1];
  //   getReviews(zipcodeId);
  // }
  // // If there's no zipcodeId we just get all reviews as usual
  // else {
  //   getReviews();
  // }

  // This function grabs reviews from the database and updates the view
  function getReviews(zipcode) {
    zipcodeId = zipcode || "";
    if (zipcodeId) {
      zipcodeId = "/?zipcode_id=" + zipcodeId;
    }
    $.get("/api/reviews" + zipcodeId, data => {
      console.log("Reviews", data);
      reviews = data;
      if (!reviews || !reviews.length) {
        displayEmpty(zipcode);
      } else {
        initializeRows();
      }
    });
  }

  // This function does an API call to delete reviews
  function deleteReview(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/reviews/" + id
    }).then(() => {
      location.reload();
    });
  }

  // InitializeRows handles appending all of our constructed review HTML inside blogContainer
  function initializeRows() {
    blogContainer.empty();
    const reviewsToAdd = [];
    for (let i = 0; i < reviews.length; i++) {
      reviewsToAdd.push(createNewRow(reviews[i]));
    }
    blogContainer.append(reviewsToAdd);
  }

  // This function constructs a review's HTML
  function createNewRow(review) {
    let formattedDate = new Date(review.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    const newReviewCard = $("<div>");
    newReviewCard.addClass("card");
    newReviewCard.attr("data-aos", "fade-right");
    newReviewCard.attr("data-aos-duration", "1000");
    newReviewCard.attr("data-aos-once", "false");
    newReviewCard.attr("data-aos-easing", "ease-in-out");
    newReviewCard.attr("data-aos-delay", "75");
    newReviewCard.attr("data-aos-offset", "200");
    const newReviewCardHeading = $("<div>");
    newReviewCardHeading.addClass("card-header bg-success");
    const deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    const editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-info");
    const newReviewTitle = $("<h2>");
    const newReviewDate = $("<h5>");
    const newReviewCity = $("<h5>");
    const newReviewZipcode = $(
      "<a href='/reviewq?" + review.ZipCode.Zip + "'>"
    );
    newReviewZipcode.text("ZipCode: " + review.ZipCode.Zip);
    newReviewZipcode.css({
      color: "yellow"
    });
    const newReviewCardBody = $("<div>");
    newReviewCardBody.addClass("card-body");
    const newReviewBody = $("<p>");
    newReviewTitle.text(review.title + " ");
    newReviewBody.text(review.body);
    newReviewDate.text(formattedDate);
    newReviewCity.text(review.ZipCode.City + ", " + review.ZipCode.State);
    newReviewTitle.append(newReviewDate);
    newReviewTitle.append(newReviewCity);
    newReviewCardHeading.append(deleteBtn);
    newReviewCardHeading.append(editBtn);
    newReviewCardHeading.append(newReviewTitle);
    newReviewCardHeading.append(newReviewZipcode);
    newReviewCardBody.append(newReviewBody);
    newReviewCard.append(newReviewCardHeading);
    newReviewCard.append(newReviewCardBody);
    newReviewCard.data("review", review);
    return newReviewCard;
  }

  // This function figures out which review we want to delete and then calls deleteReview
  function handleReviewDelete() {
    const currentReview = $(this).data("id");
    deleteReview(currentReview);
  }

  // This function figures out which review we want to edit and takes it to the appropriate url
  function handleReviewEdit() {
    console.log($(this).data("id"))
    const currentReview = $(this).data("id");
    window.location.href = "/review?review_id=" + currentReview;
  }

  // This function displays a message when there are no reviews
  function displayEmpty(id) {
    const query = window.location.search;
    let partial = "";
    if (id) {
      partial = " for Zipcode #" + id;
    }
    blogContainer.empty();
    const messageH2 = $("<h2>");
    messageH2.css({ "text-align": "center", "margin-top": "50px" });
    messageH2.html(
      "No reviews yet" +
        partial +
        ", navigate <a href='/review" +
        query +
        "'>here</a> in order to get started."
    );
    blogContainer.append(messageH2);
  }
});
