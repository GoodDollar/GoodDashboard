echo 'Install typescript'
npm i typescript -g
cd server
echo 'Install server'
npm i
echo 'Build server'
npm run build
echo 'Install client'
cd ../client
npm i
npm i -D
npm run build
