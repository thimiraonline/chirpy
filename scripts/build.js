const execa = require('execa');

async function build() {
  let nextDevProcess = null;
  try {
    nextDevProcess = execa('npx', ['next', 'dev']);
    nextDevProcess.stdout.pipe(process.stdout);
    nextDevProcess.stderr.pipe(process.stderr);
    nextDevProcess.catch(() => {
      throw error;
    });

    const parcel = execa('npx', [
      'parcel',
      'build',
      './src/external/comment.ts',
      '--out-dir',
      'public',
      '--no-source-maps',
    ]);
    parcel.stdout.pipe(process.stdout);
    parcel.stderr.pipe(process.stderr);
    parcel.catch(() => {
      nextDevProcess.kill();
      throw error;
    });

    const nextBuildProcess = execa('npx', ['next', 'build'], {
      env: {
        ...process.env,
        ECHO_BUILD_ORIGIN: 'http://localhost:3000'
      }
    });
    nextBuildProcess.stdout.pipe(process.stdout);
    nextBuildProcess.stderr.pipe(process.stderr);
    nextBuildProcess.then(() => {
      nextDevProcess.kill();
    }).catch(() => {
      nextDevProcess.kill();
      throw error;
    });
  } catch (error) {
    nextDevProcess.kill();
    throw error;
  }
}

build();