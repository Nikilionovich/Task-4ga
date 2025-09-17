const http = require("http");
const fs = require("fs");
const path = require("path");
const port = 3000;
function RandomInt(min,max){
    return Math.floor(Math.random() * (max - min))
}
function generateDevInfo(template,data){
    let output=template;
    for (const key in data) {
       output=output.replace(`{{${key}}}`,data[key]);
    }
    return output;
}
const developerInfo={
    city: "Minsk",
    expirience:RandomInt(1,100),
    specialization:'Frontend-разработка',
}
const contentTypes = {
    ".ico": "image/x-icon",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "application/json",
  };
  const TemplateAbout=path.join(__dirname,"public","html","about.html");
http.createServer(function (req, res) {
    switch (req.url) {
        case "/":
            res.writeHead(302, {location:"/index.html","Content-Type": "text/html; charset=utf-8",});
            res.end();
            break;
        case "/about":
           const html= generateDevInfo(TemplateAbout,developerInfo);
            res.writeHead(200,{"Content-type":"text/html; charset=utf-8;"});
            res.end(html);
            break;
        default:
           const filepath = path.join(__dirname, "public", req.url);
           fs.access(filepath,fs.constants.R_OK,(ERR)=>{
               if (ERR) {
                    writeHead(404,{"Content-type":"text/html"});
                    filepath=path.join(__dirname,"public","html","pagenotfound.html");
                    fs.createReadStream(filepath).pipe(res);
               } else {
                   const extnname=path.extname(filepath);
                   const contentType=contentTypes[extnname]||"application/octet-stream";
                   res.writeHead(200,{"Content-type": contentType});
                   fs.createReadStream(filepath).pipe(res);
               }
           })
            break;
    }

}).listen(port, function () {
    console.log(` ${port}`);
});