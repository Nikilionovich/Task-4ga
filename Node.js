const http = require("http");
const fs = require("fs");
const path = require("path");
const port = 3000; 
const year = new Date().getFullYear()
function RandomInt(min,max){
    return Math.floor(Math.random() * (max - min))
}
function generateDevInfo(template,data){
    let output=template;
    for (const key in data) {
       output=output.replaceAll(`{{${key}}}`,data[key]);
    }
    output=output.replace("{{currentYear}}",year)
    return output;
    
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
const developerInfo={
    city: "Minsk",
    expirience:RandomInt(1,100),
    specialization:'Frontend-разработка',
}
const projectData={
    projectName:"MyName",
    projectDescription:"blablbalbalbal",
}
const skillsdata=['HTML', 'CSS', 'JavaScript', 'Node.js'];
  const templateAbout=fs.readFileSync(path.join(__dirname,"public","html","about.html"),"utf-8");
  const templateProject=fs.readFileSync(path.join(__dirname,"public","html","project.html"),"utf-8");
  const templateSkills=fs.readFileSync(path.join(__dirname,"public","html","skills.html"),"utf-8");
  let htmlcode;
http.createServer(function (req, res) {
    switch (req.url) {
        case "/":
            res.writeHead(302, {location:"/index.html","Content-Type": "text/html; charset=utf-8",});
            res.end();
            break;
        case "/about":
            res.writeHead(200,{"Content-type":"text/html; charset=utf-8;"});
            htmlcode= generateDevInfo(templateAbout,developerInfo);
            res.end(htmlcode);
            break;
        case "/project":
            res.writeHead(200,{"Content-type":"text/html; charset=utf-8;"});
            htmlcode=generateDevInfo(templateProject,projectData);
            res.end(htmlcode);
            break;
        case "/skills":
            res.writeHead(200,{"Content-type":"text/html; charset=utf-8;"});
            htmlcode=skillsdata.map((key)=>`<li>${key}</li>` ).join(", ");
            htmlcode.replace("{{currentyear}}",year);
            res.end(templateSkills.replace("{{skillsList}}",htmlcode));
            break;
        default:
           let filepath = path.join(__dirname, "public", req.url);
           fs.access(filepath,fs.constants.R_OK,(ERR)=>{
               if (ERR) {
                    res.writeHead(404,{"Content-type":"text/html",});
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
    console.log(`http://localhost:${port}`);

});
