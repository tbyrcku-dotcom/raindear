<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#0a0907" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />

    <title>Raindear Coffee &amp; Kitchen — Bogor</title>
    <meta name="description" content="Coffee, comfort, and warm tables in the heart of Bogor. Signature dishes, crafted drinks, and moments worth staying for." />

    <meta property="og:type" content="restaurant" />
    <meta property="og:title" content="Raindear Coffee & Kitchen — Bogor" />
    <meta property="og:description" content="Bogor's warm table for coffee, kitchen, and celebration." />
    <meta property="og:locale" content="en_ID" />

    <link rel="icon" href="/favicon.ico" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
</head>
<body class="bg-ink text-cream antialiased">
    <div id="app"></div>
</body>
</html>
