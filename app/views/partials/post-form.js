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
            "for": this.form.id + 'Content'
          }, function() {
            text('Content');
            return span(" *", {
              title: "Mandatory field"
            });
          });
        });
        dd(function() {
          return textarea({
            name: 'content',
            id: this.form.id + 'Content'
          });
        });
        dt(function() {
          return label({
            "for": this.form.id + 'Image'
          }, function() {
            text('Image');
            if (this.form.id === "newThread") {
              return span(" *", {
                title: "Mandatory field"
              });
            }
          });
        });
        dd(function() {
          return input({
            name: 'image',
            type: 'file',
            id: this.form.id + 'Image',
            accept: 'image/gif,image/jpeg,image/png'
          });
        });
        dt(function() {
          return label({
            "for": this.form.id + "Password"
          }, function() {
            return "Password";
          });
        });
        dd(function() {
          return input({
            name: 'password',
            id: this.form.id + 'Password',
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
