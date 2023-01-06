(function($, undefined) {
  'use strict'

  /**
   * Service to get data about random people.
   */
  class RandomUserService
  {
    static DefaultUrl = 'https://randomuser.me/api/';

    /**
     * Creates an instance of the RandomUserService
     * @param {String} url The remote service url
     */
    constructor(url) {
     this.url = url || RandomUserService.DefaultUrl;
    }

    /**
     * Retrieves a random user.
     */
    get() {
      return new Promise((resolve,reject) => {
        $.ajax({
          url: this.url,
          dataType: 'json',
          success: function(json) {
            resolve(json.results[0]);
          }
        })
      });
    }
  }

  /**
   * Represents a user or member.
   */
  class Member
  {
    /**
     * Creates an instance of Person
     * @param {Object} person 
     */
    constructor(person) {
      Object.assign(this, person);
      //this.name = {
      //  last: person.name.last,
      //  first: person.name.first,
      //};
    }

    /**
     * Creates the HTML to display the user.
     */
    render() {
      return `
      <div class="col-6">
        <div class="container-fluid member">
          <img class="member-image" src="${ this.picture.large }">
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
      </div>
      `;
    }
  }

  $(document).ready(function() {
    console.log('jQuery is ready...');
    const $addButton = $('#member-add');
    const $members = $('#members');

    const service = new RandomUserService();

    $members.on('click', '.control-member-delete', (e) => {
      const $member = $(e.target).parents('.member');
      if ($member.length) {
        $member.parent().remove();
      }
    });

    $addButton.on('click', (e) => {
      service.get().then((person) => {
        let member = new Member(person);
        //console.log(member);
        $members.append(member.render());
      });
/*

      $.ajax({
        url: 'https://randomuser.me/api/',
        dataType: 'json',
        success: function(json) {
          console.log(json.results[0]);
          
          let person = json.results[0];
          let item = `
          <div class="col-6">
            <div class="container-fluid member">
              <img class="member-image" src="${ person.picture.large }">
              <div class="container">
                <h2 class="member-actions d-flex justify-content-between">
                  <span class="member-name">${ person.name.first } ${ person.name.last }</span>
                  <i class="control-member-delete bi bi-trash3-fill"></i>
                </h2>
                <div class="member-joined">
                  <label>Joined:</label> <span class="member-joined-date">${ person.registered.date }</span>
                </div>
                <p class="mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
              </div>
            </div>
          </div>
          `;
          $members.append($(item));
        }
      });
    */
    });
  });
})(jQuery);