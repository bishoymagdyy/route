const path = require("node:path");

// 1
console.log(__filename, __dirname);

// 2
console.log(path.basename('E:\\route\\assignments\\Bishoy-magdy-C45-Node.js-Sun&Wed-4-7Pm-offline-assignment2-01275308990\\code.js'));

// 3
console.log(path.format({ dir: "/folder", name: "code", ext: ".js"}));

// 4
console.log(path.extname("/folder/code.js"));

// 5
console.log(path.parse('/home/app/main.js'));

// 6
console.log(path.isAbsolute('E:\\route\\assignments\\Bishoy-magdy-C45-Node.js-Sun&Wed-4-7Pm-offline-assignment2-01275308990\\code.js'));

// 7
console.log(path.join('/folder', 'subfolder', 'code.js'));

// 8
console.log(path.resolve('code.js'));

// 9
console.log(path.join('/folder1' ,'folder2/file.txt'));

// 10
const fs = require('node:fs');
const delpath = path.resolve('del.js');
if (fs.existsSync(delpath)) {
    fs.unlink(delpath, (error) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log('File deleted successfully');
    });
}


//11
const folderpath = path.resolve('./folder');
if (!fs.existsSync(folderpath)) {
    try {
        fs.mkdirSync(folderpath , { recursive: true })
        console.log("success");

    } catch (error) {
        console.log(error);

    }
}

// 12
const EventEmitter = require('node:events');
const event = new EventEmitter()

event.on('start',(msg)=>{
    console.log(msg);
})

event.emit('start','hi mentor');


// 13
const login = new EventEmitter();

login.on('login', (username) => {
    console.log(`User logged in ${username}`);
})

login.emit('login', 'Bishoy');


// 14

const filepath = path.resolve('note.txt');

try {
    const result = fs.readFileSync(filepath , {'encoding': 'utf-8'})
    console.log(result);

} catch (error) {
    console.log(error);

}


// 15
const addPath = path.resolve('add.txt');
fs.writeFile(addPath, 'hello mentor',{encoding: 'utf-8', flag: "w"}, (error) => {
    if (error) {
        console.log(error);
        return;
    }
    console.log('File written successfully');
});

// 16
//const addPath = path.resolve('add.txt')
console.log(fs.existsSync(addPath));

// 17
// const path = require("node:path");
console.log(path);


