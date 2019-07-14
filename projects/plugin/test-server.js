const io = require("socket.io");

const server = io.listen(3322);
console.log("===TEST-SERVER===READY===");
server.on("connection", (socket) => {
  console.log('===TEST-SERVER===NEW CONNECTION===');
  socket.on("data", (msg) => {
    console.log('===TEST-SERVER===');
    console.log(msg);
    console.log('===');
  });
});

