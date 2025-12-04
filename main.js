const fs = require("node:fs");
const path = require("node:path");
const {createGzip} = require("node:zlib");
const datapath = path.resolve("data.txt");
const destpath = path.resolve("copy.txt");
const destZipPath = path.resolve("copy.txt.gz");
const zip = createGzip();

// [part 1]  1, 2


  const readStream = fs.createReadStream(datapath, {encoding: "utf8", highWaterMark: 64});
  const writeStream = fs.createWriteStream(destpath, {encoding: "utf8"});
  readStream.on("data", (chunk) => {
    console.log("----- New Chunk -----");
    console.log(chunk);
    writeStream.write(chunk);
  });

  readStream.on("end", () => {
    console.log("Finished reading file in chunks.");
  });

  readStream.on("error", (err) => {
    console.error("Error while reading file:", err.message);
  });

// 3

const writeZipStream = fs.createWriteStream(destZipPath);
readStream.pipe(zip).pipe(writeZipStream);

// [part 2]

const http = require("node:http");
let port = 3000;

const server = http.createServer((req, res) => {
  
  const {method, url} = req;
  if (method === "GET" && url === "/") {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write("Hello World!");
    res.end("");
  } 
  
  
  else if (method === "POST" && url === "/signup") {
    let data = "";

    req.on("data", (chunk) => {
        data += chunk;
    });

    req.on("end", async () => {
        const { id, name, age, email } = JSON.parse(data);

        let users = [];

        try {
            const fileData = await fs.promises.readFile(path.resolve("users.json"), "utf8");
            users = JSON.parse(fileData);
        } catch (err) {
            users = [];
        }

        const checkUserExists = users.find((u) => u.id === id);

        if (checkUserExists) {
            res.writeHead(409, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User already exists" }));
            return;
        }

        users.push({ id, name, age, email });

        await fs.promises.writeFile(
            path.resolve("users.json"),
            JSON.stringify(users, null, 2),
            "utf8"
        );

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User added successfully" }));
    });
} 


else if (method === "PATCH" && url.startsWith("/user/")) {
    const id = url.split("/")[2];
    let data = "";

    req.on("data", (chunk) => (data += chunk));

    req.on("end", async () => {
      const updates = JSON.parse(data);

      try {
        const fileData = await fs.promises.readFile(
          path.resolve("users.json"),
          "utf8"
        );

        let users = JSON.parse(fileData);
        const index = users.findIndex((u) => String(u.id) === id);

        if (index === -1) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "User not found" }));
          return;
        }

        users[index] = { ...users[index], ...updates };

        await fs.promises.writeFile(
          path.resolve("users.json"),
          JSON.stringify(users, null, 2),
          "utf8"
        );

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User updated", user: users[index] }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal Server Error" }));
      }
    });
} 


else if (method === "DELETE" && url.startsWith("/user/")) {
    const id = url.split("/")[2];

    fs.readFile(path.resolve("users.json"), "utf8", async (err, fileData) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal Server Error" }));
            return;
        }

        let users = JSON.parse(fileData);

        const userExists = users.find((u) => String(u.id) === String(id));

        if (!userExists) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User not found" }));
            return;
        }

        const updatedUsers = users.filter((u) => String(u.id) !== String(id));

        await fs.promises.writeFile(
            path.resolve("users.json"),
            JSON.stringify(updatedUsers, null, 2),
            "utf8"
        );

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User deleted successfully" }));
    });
} 

else if(method === "GET" && url === "/users"){
    const usersStream = fs.createReadStream(path.resolve("users.json"), {encoding: "utf8"});
    res.writeHead(200, {"Content-Type": "application/json"});
    usersStream.on("data", (chunk) => {
      res.write(chunk);
    });
    usersStream.on("end", () => {
      res.end();
    });
  } 
  
  
  else if (method === "GET" && url.startsWith("/user/")) {

    const id = url.split("/")[2];

    fs.readFile(path.resolve("users.json"), "utf8", (err, fileData) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal Server Error" }));
            return;
        }

        let users = [];

        try {
            users = JSON.parse(fileData);
        } catch (parseErr) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid JSON format in file" }));
            return;
        }

        const user = users.find(u => String(u.id) === String(id));

        if (!user) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User not found" }));
            return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(user));
    });
} 

else {
    res.writeHead(404, {"Content-Type": "text/plain"});
    res.write("Not Found");
    res.end();
  }
})

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});