(function($, undefined) {
  'use strict'
  
  $(document).ready(function() {
    const $game = $('#game');

    $game.on('click', '.cell', (e) => {
      const $cell = $(e.target).closest('.cell');
      if ($cell.length) {
        const value = $cell.data('player') || 'X';
        
        $cell.empty();
        if (value === 'O') {
          $cell.append('<i class="bi bi-x-lg"></i>');
          $cell.data('player', 'X');
        }
        else {
          $cell.append('<i class="bi bi-circle"></i>');
          $cell.data('player', 'O');
        }
      }
    });
  });  
})(jQuery);