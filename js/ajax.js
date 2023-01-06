(function($, undefined) {
  'use strict'

  /**
   * A class to use for interfacing with randomuser.me API
   */
  class RandomUserService {
    static defaultUrl = 'https://randomuser.me/api/';
    constructor(url) {
      this.url = url || RandomUserService.defaultUrl;
    }

    /**
     * Get's a new random user.
     */
    get() {
      return new Promise((resolve,reject) => {
        $.ajax({
          url: this.url,
          dataType: 'json',
          success: function(json) {
            resolve(json.results[0]);
          }
        });
      });
    }
  }

  /**
   * Represents a member / user.
   */
  class Member {
    constructor(user) {
      Object.assign(this, user);
    }

    render() {
      return $(`
        <div class="col-6">
          <div class="container-fluid member">
            <img class="member-image" src="${ this.picture.medium }">
            <div class="container">
              <h2 class="member-actions d-flex justify-content-between">
                <span class="member-name">${ this.name.first } ${ this.name.last }</span>
                <i class="control-member-delete bi bi-trash3-fill"></i>
              </h2>
              <div class="member-joined">
                <label>Joined:</label> <span class="member-joined-date">${ this.registered.date }</span>
              </div>
              <p class="mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
            </div>
          </div>
        </div>`
      );
    }
  }

  const service = new RandomUserService();
  $(document).ready(() => {
    const $members = $('#members');
    const $addButton = $('#member-add');
    $addButton.on('click', (e) => {
      service.get().then((user) => {
        let member = new Member(user);
        $members.append(member.render());
      });
    });

    $members.on('click', '.control-member-delete', (e) => {
      let $member = $(e.currentTarget).parents('.member');
      if ($member.length) {
        // Remove the container
        $member.parent().remove();
      }
    });
  });
})(jQuery);