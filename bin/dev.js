/*
	Development PCT Admin for Demoing Purposes
	
	Move Project \dist to  PCT_Prod\dev

*/

const fs = require('fs-extra')

// remove dir
fs.removeSync("C:\\PCT_Prod\\dev\\static")
console.log('remove Development \static directory')

// copy file and overwrite
fs.copySync("C:\\PCT_Admin\\pct_admin_app\\vue-light-bootstrap-dashboard\\dist\\index.html", "C:\\PCT_Prod\\dev\\index.html", { overwrite: true })
console.log('overwrite dist\index.html to Development dev\index.html')

// copy dir
fs.copySync("C:\\PCT_Admin\\pct_admin_app\\vue-light-bootstrap-dashboard\\dist\\static", "C:\\PCT_Prod\\dev\\static")
console.log('copy dist\static dir to Development \static directory')


