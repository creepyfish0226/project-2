$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);
  });

  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete", handleReviewDelete);
  $(document).on("click", "button.edit", handleReviewEdit);

  // This function does an API call to delete reviews
  function deleteReview(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/reviews/" + id
    }).then(() => {
      location.reload();
    });
  }

  // This function figures out which review we want to delete and then calls deleteReview
  function handleReviewDelete() {
    const currentReview = $(this).data("id");
    deleteReview(currentReview);
  }

  // This function figures out which review we want to edit and takes it to the appropriate url
  function handleReviewEdit() {
    // console.log($(this).data("id"));
    const currentReview = $(this).data("id");
    window.location.href = "/review?review_id=" + currentReview;
  }
});
