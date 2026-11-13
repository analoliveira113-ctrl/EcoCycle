# EcoCycle — Gestão de Reciclagem Comunitária

Aplicativo React + Capacitor para cadastrar pontos comunitários de descarte seletivo, escolher o tipo de resíduo, registrar coordenadas GPS, consultar os pontos cadastrados e abrir cada localização no Google Maps.

## Requisitos
- Node.js 20 ou 22
- npm
- Android Studio (para compilar localmente)

## Começar
```bash
npm install
npm run dev
```

## Gerar imagens nativas
Os arquivos-fonte estão em `assets/icon.png` (1024x1024) e `assets/splash.png` (2732x2732).
```bash
npx capacitor-assets generate --android
```

## Preparar Android pela primeira vez
```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Se a pasta `android/` já existir, não execute `npx cap add android` novamente; use apenas:
```bash
npm run build
npx cap sync android
```

## Atualizar o app Android
```bash
npm run build
npx cap sync android
```

## APK automática no GitHub
O workflow `.github/workflows/android-build.yml` executa ao enviar commits para `main` ou `master`. No GitHub, abra **Actions**, selecione a execução concluída e baixe o artefato `meu-aplicativo-apk`.

## Funcionalidades
- Cadastro de pontos de descarte
- Tipos: plástico, papel, vidro, metal e orgânico
- Captura de latitude e longitude pelo GPS
- Campos de coordenadas editáveis
- Pesquisa e filtro por material
- Abertura da localização no Google Maps
- Persistência local dos registros no dispositivo

> Os registros ficam salvos localmente no dispositivo. Para compartilhar os dados entre usuários, será necessário conectar um banco de dados/backend.
