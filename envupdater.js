var fs          = require('fs');

fs.writeFile("./build/env.json", `{
  "env": "production"
}`, function (err) {
    if (err) {return console.log(err);}

});