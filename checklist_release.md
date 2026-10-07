# Checklist de release · ClaseFit

## Listo en el proyecto
- [x] Nombre, `slug` y versión en `app.json` (`ClaseFit`, `clasefit`, `1.0.0`)
- [x] `android.package` e `ios.bundleIdentifier` (`com.keppri.clasefit.yoryi`)
- [x] `eas.json` con perfiles preview y production
- [ ] (Bonus) Build instalable · enlace:

## Falta para Google Play
- [ ] Cuenta de Google Play Console (desarrollador)
- [ ] Ficha de la tienda: título, descripción corta y completa, ícono 512 px, gráfico de funciones y capturas de teléfono
- [ ] URL pública de la política de privacidad
- [ ] Formulario de seguridad de los datos y cuestionario de clasificación de contenido
- [ ] Build de producción en AAB, firmado, subido a una pista (prueba interna, cerrada o producción)
- [ ] Credenciales de firma de Android en EAS (se generan en el primer build con sesión de Expo)

## Falta para App Store
- [ ] Cuenta del Apple Developer Program
- [ ] App creada en App Store Connect con el mismo bundle identifier
- [ ] Capturas en los tamaños que exige Apple y textos de la ficha
- [ ] Etiquetas de privacidad (Privacy Nutrition Labels) e información para la revisión
- [ ] Build de iOS y pase por TestFlight antes de enviarlo a revisión
- [ ] Declaración de export compliance y credenciales de firma de iOS en EAS

## Riesgos o bloqueos para publicar
- El identificador `com.keppri.clasefit.yoryi` queda fijo después de publicar. Hay que confirmar que ninguna otra app del equipo lo esté usando.
- Aún no existe `extra.eas.projectId`. Se crea al iniciar sesión en Expo y lanzar el primer `eas build`.
- La app guarda todo en el dispositivo y no tiene backend ni login. Igual hacen falta política de privacidad, capturas reales y una ficha que explique para qué sirve.
- El perfil `preview` entrega un APK de prueba interna. Google Play en producción pide un AAB del perfil `production`, y App Store un binario de iOS. Ninguno de los dos builds está generado.
