# watermarkjs

Apply a png image onto another png image with given coordinates

# Example

```javascript
    var Watermark = require('./watermark.js');

    var watermark = new Watermark('./image_src/image.png', function () {
      var x = 15;
      var y = 15;
      var opacity = 50;

      this.push('./image_src/watermark.png', x, y, opacity, function(){
          this.save('./image_src/result.png');
          console.log('done');
      })

      var cropped = this.crop(0, 0, 100, 100);
      cropped.save('cropped.png')
    });

```
