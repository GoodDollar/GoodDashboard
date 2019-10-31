echo 'Install server'
cd server
npm i
echo 'Build server'
npm run build
echo 'Install client'
cd ../client
npm i
echo 'Build client'
npm run build
echo 'Start server app'
