# ngdeploy

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/82adc96394e7482cb972da5db33e3818)](https://www.codacy.com/app/not-milos-bejda/Frontend?utm_source=github.com&utm_medium=referral&utm_content=NGDeployio/Frontend&utm_campaign=badger)

> Single page app hosting with CI.


## Usage

Run the following command to create a zip file.

```
$ npm install ngdeploy --save -g 
```

The zip file, generated in the `dist` directory, can now be deployed to AWS Lambda.

### package.json

Best practice is to use the [files](https://docs.npmjs.com/files/package.json#files) property
in `package.json`. This property determines which files will be included in the zip file.

If the `files` property is not provided, a fallback pattern will be used that tries to create
the zip best effort..

Once and for all! 

## Author

- Milos Bejda [<mbejda@live.com>]
