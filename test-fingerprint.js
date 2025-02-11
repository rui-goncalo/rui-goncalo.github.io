<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FingerprintJS Test</title>
    <script src="https://openfpcdn.io/fingerprintjs/v4"></script>
</head>
<body>
    <h1>FingerprintJS Test</h1>
    <p>Abre o Console (F12 > Console) para ver o resultado.</p>

    <script>
        async function getFingerprint() {
            try {
                // Carregar FingerprintJS
                const fpPromise = FingerprintJS.load();
                const fp = await fpPromise;
                const result = await fp.get();

                console.log("Fingerprint:", result.visitorId);
            } catch (error) {
                console.error("Erro ao gerar fingerprint:", error);
            }
        }

        // Chamar a função para gerar fingerprint
        getFingerprint();
    </script>
</body>
</html>
