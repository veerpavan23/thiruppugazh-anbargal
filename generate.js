const fs = require('fs');
const path = require('path');

const pages = [
  { file: 'guru-anjali.html', title: 'Guru Anjali' },
  { file: 'rules.html', title: 'Golden Rules' },
  { file: 'centers.html', title: 'Centers' },
  { file: 'feedback.html', title: 'Write To Us' },
  { file: 'about-us.html', title: 'About Us' },
  { file: 'songs.html', title: 'Songs With Script & Audio' },
  { file: 'vel-mayil-virutham.html', title: 'Vel Mayil Virutham' },
  { file: 'vaguppu.html', title: 'Vaguppu' },
  { file: 'virutham.html', title: 'Viruthams' },
  { file: 'abhirami.html', title: 'Abhirami Andadi Pathikam' },
  { file: 'valli-kalyanam.html', title: 'Valli Kalyanam' },
  { file: 'virtual-bhajans.html', title: 'Virtual Bhajans' },
  { file: 'resources.html', title: 'Resources' },
  { file: 'paddhathi.html', title: 'Paddhathi of a Bhajan' },
  { file: 'songs-list.html', title: 'List Of Songs' },
  { file: 'souveneirs.html', title: 'Souveneirs' },
  { file: 'anbargal-corner.html', title: 'Anbargal Corner' },
];

pages.forEach(({ file, title }) => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thiruppugazh Anbargal - ${title}</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/layout.css">
</head>
<body>
  <main class="container mt-2">
    <div class="card">
      <h2 class="text-center mb-2">${title}</h2>
      <p class="text-center">Content coming soon...</p>
    </div>
  </main>
  <script src="js/layout.js"></script>
</body>
</html>`;
    fs.writeFileSync(filePath, html);
    console.log('Created: ' + file);
  }
});
