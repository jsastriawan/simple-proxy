var http = require('http');
var net = require('net')

var server = http.createServer(function (request, response) {
    var desthost = request.headers.host.split(':')[0];
    var destport = request.headers.host.split(':')[1];
    if (desthost != "localhost") {
        console.log("Proxying "+ request.headers.host +" "+ request.method+ " " + request.url);
        var client = net.createConnection({ port: destport, host: desthost }, () => {
            // send headers
            var fl = request.method+" "+request.url+" HTTP/"+request.httpVersion;
            //console.log(fl);
            client.write(fl+"\r\n")
            //console.log(JSON.stringify(request.rawHeaders));

            for (var i =0; i< request.rawHeaders.length; i=i+2) {
                if (request.rawHeaders[i]=="Proxy-Connection") continue;
                //console.log(request.rawHeaders[i]+": "+request.rawHeaders[i+1]);
                client.write(request.rawHeaders[i]+": "+request.rawHeaders[i+1]+"\r\n")
           }
           client.write("\r\n");
           //console.log("\r\n");
           request.on("data", (d) => {
               //console.log(d.toString());
               client.write(d);
           })
        });
        client.on('data', (data) => {
            try {
                request.socket.write(data);
            } catch (e) {
                console.log("Cannot send response:"+ e.message);
            }
            //console.log(data.toString())
            //if (data.toString().endsWith("0\r\n\r\n")) {
                //console.log("End of chunk, terminate connection.");
            //    client.end();
            //}
        });
        client.on('end', () => {
            //console.log("Socket closed.")
            response.end();
        });
        client.on('error', () => {
            //console.log("Error here");
            //response.write("503 HTTP/1.1");
        });
    }
}).listen(8080);
