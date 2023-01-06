(function($, undefined) {
  'use strict'

  $(document).ready(function() {
    const $form = $('form');
    const $comments = $('#comments');
    const $emailInput = $('#email');
    const $commentInput = $('#comment');
    const $addButton = $('#add');

    /**
     * Checks to see if the input is valid (all required values are present)
     * @returns {Boolean} true if valid, false if otherwise.
     */
    function isInputValid() {
      return ($emailInput.val() && $commentInput.val());
    }

    /**
     * Resets the form back to it's default state (clears input, etc.)
     */
    function reset() {
      $emailInput.val('');
      $commentInput.val('');
      $addButton.addClass("disabled");
    }

    /**
     * Occurs when the user clicks on the add button.
     */
    $addButton.on('click', (e) => {
      // Read values from HTML form elements.
      const email = $emailInput.val();
      const comment = $commentInput.val();

      // Make sure values are non-empty
      if (email && comment) {
        // Create new list item element.
        const $item = `
          <li class="list-group-item">
            <div class="email">${ email }</div>
            <div class="comment">${ comment }</div>
          </li>
        `;
        // Append list item to the end of the list
        $comments.append($item);

        // Reset form
        //$emailInput.val('');
        //$commentInput.val('');
        //$addButton.addClass("disabled");
        reset();
      }
    });
    
    // Any time the user enters or changes a value, we'll
    // check to see if the form is valid. If it is, we'll
    // remove the disabled class from the add button, otherwise
    // we'll ensure it's disabled.
    $('input').on('change', function() {
      //if ($emailInput.val() && $commentInput.val()) {
      if (isInputValid()) {
        $addButton.removeClass("disabled");
      }
      else {
        $addButton.addClass("disabled");
      }
    });
  });
})(jQuery);