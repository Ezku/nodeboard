(function() {
  div({
    "class": 'form',
    id: this.form.id
  }, function() {
    if (this.form.title) {
      h4(this.form.title);
    }
    form({
      method: 'post',
      id: this.form.id + 'Form',
      action: "" + this.form.action,
      enctype: 'multipart/form-data'
    }, function() {
      return dl(function() {
        dt(function() {
          return label({
            "for": 'content'
          }, function() {
            return 'Content';
          });
        });
        dd(function() {
          return textarea({
            name: 'content',
            id: 'content'
          });
        });
        dt(function() {
          return label({
            "for": 'image'
          }, function() {
            return 'Image';
          });
        });
        dd(function() {
          return input({
            name: 'image',
            type: 'file',
            id: 'image',
            accept: 'image/gif,image/jpeg,image/png'
          });
        });
        dt(function() {
          return label({
            "for": "password"
          }, function() {
            return "Password";
          });
        });
        dd(function() {
          return input({
            name: 'password',
            id: 'password',
            type: 'password'
          });
        });
        dt(function() {});
        return dd(function() {
          return input({
            name: 'submit',
            type: 'submit',
            value: this.form.submit
          });
        });
      });
    });
    return div({
      style: 'clear:both'
    });
  });
}).call(this);
