let process = require('child_process')
let clc = require('cli-color');
function system(command) {
    return new Promise(function(resolve, reject) {
        process.exec(command, function(err, stdout, stderr) {
            if (err !== null) {
                console.log('exec error: ' + err);
            }
            resolve();
        });
    });
}

const CC_BIN = 'C:/CocosCreator/CocosCreator.exe';

async function update() {
    console.log(clc.red('start update...\nstart building...'));

    let command = CC_BIN + ' --path ./ --build "platform web-mobile"';
    await system(command);

    console.log(clc.green('build successfully.'))
    console.log(clc.red('start copying...'))
    // copy html
    await system('mv ./build/web-mobile/index.html ./build/web-mobile/client_index.html & \
        cp ./html/bind/index.html ./build/web-mobile/index.html & \
        cp ./html/bind/bg_wp.jpg ./build/web-mobile/bg_wp.jpg & \
        cp ./html/bind/icon.png ./build/web-mobile/icon.png');

    console.log(clc.green('copy successfully.'))
    console.log(clc.red('start zipping...'))
    // zip
    await system('7z a ./build/web-mobile/web-mobile.zip ./build/web-mobile/*');

    console.log(clc.green('zip successfully.'))
    console.log(clc.red('start uploading...'))
    // upload
    console.log('scp build/web-mobile/web-mobile.zip root@192.168.0.138:/yt/mgxy-server-kit/apache-tomcat-8.0.24/webapps/chinglish.war')
    console.log("scp build/web-mobile/web-mobile.zip root@120.25.124.141:/usr/local/games/apache-tomcat-ytclient/webapps/chinglish.war")
    console.log(clc.green('upload successfully.\nupdate complete!'))
}

async function pack() {
    await system('mv ./build/web-mobile/index.html ./build/web-mobile/client_index.html & \
        cp ./html/bind/index.html ./build/web-mobile/index.html & \
        cp ./html/bind/bg_wp.jpg ./build/web-mobile/bg_wp.jpg & \
        cp ./html/bind/icon.png ./build/web-mobile/icon.png');

    console.log(clc.green('copy successfully.'))
    console.log(clc.green('copy successfully.'))
                                                    // zip
    await system('7z a ./build/web-mobile/web-mobile.zip ./build/web-mobile/*');
}

update();
// pack();
