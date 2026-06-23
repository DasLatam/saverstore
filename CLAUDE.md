# SaverStore — memoria del proyecto

Sitio estático (HTML/CSS/JS, sin backend) para SaverStore.

## Infraestructura ya configurada (2026-06-22)

- **Puerto asignado: 8090** (próximo libre tras 8080-8089 y 9000 — ver
  `/home/hpp/tablero/projects.json` para la lista completa de puertos en uso).
- **Firewall:** `8090/tcp ALLOW IN 192.168.1.0/24` (solo LAN, mismo patrón
  que 8086-8089). Ver `sudo ufw status numbered`.
- **Repo:** `https://github.com/DasLatam/saverstore` (rama `main`).
  - Remote local configurado como
    `git@github-saverstore:DasLatam/saverstore.git` (alias SSH, no la URL
    https de github.com).
  - Identidad git de este repo (local, no global):
    `user.name=DasLatam`, `user.email=ariel@baudry.com.ar`.
  - Auth: SSH key dedicada `~/.ssh/id_ed25519_saverstore_github`, alias
    `github-saverstore` en `~/.ssh/config`, agregada como Deploy Key en
    el repo (con write access). **No hay token HTTPS** — este servidor
    no usa PATs para repos de GitHub, usa una keypair SSH por proyecto
    (mismo patrón que `amazon`, `formulauno`, `mcv`).
  - Verificar conexión: `ssh -T git@github-saverstore`.

## Pendiente para terminar de publicar

Ver `PUBLICAR.md` en esta misma carpeta — guía paso a paso para:
1. Crear `server.py` (servidor estático simple, `ThreadingHTTPServer`).
2. Probarlo a mano en el puerto 8090.
3. Cron `@reboot` (crontab de `hpp`):
   `@reboot cd /home/hpp/saverstoreofficial && python3 server.py 8090 > logs/portal.log 2>&1`
4. Agregar entrada `id: "saverstore"` en `/home/hpp/tablero/projects.json`
   (`check_port: 8090`, `directory: "/home/hpp/saverstoreofficial"`).
5. Confirmar que aparece "online" en el tablero (`https://192.168.1.71/`).

Caddy/HTTPS **no** está configurado para este proyecto — se accede
directo por `http://192.168.1.71:8090`, igual que el resto de los
proyectos (solo el tablero, puerto 9000, está detrás de Caddy).
