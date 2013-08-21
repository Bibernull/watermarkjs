var pngjs = require('pngjs');
var PNG = require('png-js');
var fs = require('fs');

var watermark = function (source_image, callback) {
    if(typeof source_image === "string"){
        this.source_image = source_image;
        var image = PNG.load(source_image);
        var self = this;
        var png = fs.createReadStream(source_image)
                    .pipe(new pngjs.PNG({
                        filterType: 4
                    }))
                    .on('parsed', function() {

                      //push(this, 'src/manja.png', 0, 0, function(){
                      self.png = png;
                      self.width = image.width;
                      self.height = image.height;
                      image = null;
                      callback.call(self)

                      });
    }else{
        this.png = source_image;
        this.width = source_image.width;
        this.height = source_image.height;
    }
}

watermark.prototype.push = function(source_image, x, y, opacity, callback){
    var self = this;

    var image = PNG.load(source_image);

    var w = image.width;
    var h = image.height;
    image = null;

    fs.createReadStream(source_image)
        .pipe(new pngjs.PNG({
            filterType: 4
        }))
        .on('parsed', function() {

            var start = (y*self.width*4) + x*4;
            var k = 0;

            for (i = 0; i < h; i++) {
                k = (start + i*self.width*4);
                for ( j = 0; j < w; j++) {
                    var idx = (i * w + j) << 2;

                    self.png.data[k] = this.data[idx];
                    k++;
                    self.png.data[k] = this.data[idx + 1];
                    k++;
                    self.png.data[k] = this.data[idx + 2];
                    k++;
                    self.png.data[k] = (opacity / 100) * this.data[idx + 3];
                    k++;

                }
            }
        callback.call(self, [null, true]);
    });
};

watermark.prototype.crop = function(x, y, w, h, callback){
    var self = this;

    var png = new pngjs.PNG({
        width:w,
        height:h
    });

    var start = (y*self.width*4) + x*4;
    var k = 0;

    for (i = 0; i < h; i++) {
        k = (start + i*self.width*4);
        for ( j = 0; j < w; j++) {
            var idx = (i * w + j) << 2;

            png.data[idx] = this.png.data[k];
            k++;
            png.data[idx + 1] = this.png.data[k];
            k++;
            png.data[idx + 2] = this.png.data[k];
            k++;
            png.data[idx + 3] = this.png.data[k];
            k++;

        }
    }
    return new watermark(png)
    //callback.call(self, [null, true]);
    //png.pack().pipe(fs.createWriteStream('test.png'));
};

watermark.prototype.save = function(output_image_path){
    this.png.pack().pipe(fs.createWriteStream(output_image_path));
    console.log('Saved ' + output_image_path);
}

module.exports = watermark;