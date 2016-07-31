# ngdeploy

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

ach 
## Author

- Milos Bejda [<mbejda@live.com>]
