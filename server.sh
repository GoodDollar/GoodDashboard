echo 'Install server'
cd server
echo 'Install prod'
npm i
echo 'Install dev'
npm i -D
npm run build
echo 'Install client'
cd ../client
npm i
npm i -D
npm run build
