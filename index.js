const fs = require('fs');

const discoverDir = (path) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, { withFileTypes: true }, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      //const dirs = { '/path': { files: [], dirs: [] } };
      const currentFiles = [];
      const currentDirs = [];

      files.map((f) => {
        if (f.isDirectory()) {
          currentDirs.push(f.name);
        }
        if (f.isFile() && f.name[0] !== '.') {
          currentFiles.push(f.name);
        }
      });

      resolve({ path: path, files: currentFiles, dirs: currentDirs });
    });
  });
};

const discoverAll = (currentDir) => {
  return new Promise((resolve, reject) => {
    discoverDir(currentDir)
      .catch((e) => {
        console.log(e);
        reject('Nope');
      })
      .then((res) => {
        const allPromises = res['dirs'].map((d) => {
          const upcomingPath = res['path'] + '/' + d
          return discoverAll(upcomingPath);
        });

        Promise.all(allPromises).then((allRes) => {
          const currentRes = {};
          currentRes['rec'] = [];
          allRes.forEach((r) => {
            currentRes['rec'].push(r);
          });
          resolve({ ...res, ...currentRes });
        });
      });
  });
};

discoverAll('./test')
  .catch((e) => console.log(e))
  .then((data) => {
    console.log(data)
  });

