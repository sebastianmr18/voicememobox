# VoiceMemoBox

VoiceMemoBox es una aplicación web diseñada para grabar, almacenar y gestionar notas de voz de forma rápida y segura. El proyecto está orientado a facilitar la toma de memos mediante audio, permitiendo organizarlas por etiquetas y acceder a ellas desde cualquier dispositivo.

## Características principales

- Grabación de notas de voz directamente desde el navegador, así como subidas de audios en distintos formatos.
- Transcripción en segundos.
- Interfaz amigable y responsive

## Tecnologías utilizadas

- **Frontend:** React.js, Next.js, TypeScript, TailwindCSS.
- **Backend:** PostgreSQL en Supabase.
- **Autenticación:** OAuth2 con Google.
- **Almacenamiento:** Amazon S3 para almacenar audio, transcripciones y metadata, AWS Lambda para ejecución de funciones serverless, Amazon Transcribe para transcripción.
- **Despliegue:** CI-CD con GitHub Actions, despliegue con Vercel.
