# Cómo publicar saverstore (sitio estático HTML/CSS/JS)

Puerto asignado: **8090** (próximo libre tras 8080-8089 y 9000 — ver
`tablero/projects.json` para la lista completa).

Este sitio es estático (HTML/CSS/JS sin backend), así que no hace falta
Flask ni Node: alcanza con un servidor HTTP simple que sirva los archivos
del directorio. El patrón sigue el de los demás proyectos del servidor
(cron `@reboot` + entrada en el tablero).

## 1. Estructura esperada

```
saverstoreofficial/
├── server.py        # servidor estático (ver abajo)
├── index.html
├── css/...
├── js/...
└── logs/
    └── portal.log    # se crea solo al arrancar
```

## 2. `server.py`

Crear este archivo en `/home/hpp/saverstoreofficial/server.py`:

```python
import sys
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial

port = int(sys.argv[1]) if len(sys.argv) > 1 else 8090
handler = partial(SimpleHTTPRequestHandler, directory=str(__file__).rsplit("/", 1)[0])
ThreadingHTTPServer(("0.0.0.0", port), handler).serve_forever()
```

Probar a mano antes de poner el cron:

```bash
cd /home/hpp/saverstoreofficial
mkdir -p logs
python3 server.py 8090
# abrir http://192.168.1.71:8090 desde otra máquina de la LAN
```

Si carga bien, `Ctrl+C` y seguir con el arranque automático.

## 3. Arranque automático (cron `@reboot`)

Agregar una línea al crontab del usuario `hpp` (`crontab -e`), siguiendo
el mismo patrón que el resto de los proyectos:

```
@reboot cd /home/hpp/saverstoreofficial && python3 server.py 8090 > logs/portal.log 2>&1
```

Para levantarlo ahora sin reiniciar el servidor:

```bash
cd /home/hpp/saverstoreofficial && nohup python3 server.py 8090 > logs/portal.log 2>&1 &
disown
```

Verificar que quedó escuchando:

```bash
ss -ltnp | grep 8090
```

## 4. Alta en el tablero (`/home/hpp/tablero/projects.json`)

Agregar un objeto a la lista (el archivo se relee en cada request del
tablero, no hace falta reiniciar `server.py 9000` del tablero):

```json
{
  "id": "saverstore",
  "name": "SaverStore",
  "description": "Sitio SaverStore (HTML/CSS/JS estático)",
  "url": "http://192.168.1.71:8090",
  "check_host": "localhost",
  "check_port": 8090,
  "directory": "/home/hpp/saverstoreofficial",
  "tags": ["HTML", "CSS", "JS", "Static"],
  "type": "web",
  "skills": []
}
```

Si después se quiere que el tablero también muestre los últimos commits
de un repo Git de este proyecto, sumar una entrada a la lista `repos`
dentro de `git_info()` en `tablero/server.py` (ver
`tablero/README.md`, sección "Panel Git").

## 5. Acceso desde la web

Hoy en este servidor **solo el tablero** (puerto 9000) está detrás de
Caddy con HTTPS y dominio/IP fija (`https://192.168.1.71/`). El resto de
los proyectos —incluido saverstore— se acceden **directo por IP:puerto**:

```
http://192.168.1.71:8090
```

Si más adelante se quiere exponer saverstore con HTTPS bajo la misma IP
(p. ej. `https://192.168.1.71/saverstore`), hay que agregar un bloque al
`/etc/caddy/Caddyfile`:

```caddyfile
https://192.168.1.71 {
    ...
    handle /saverstore/* {
        reverse_proxy 127.0.0.1:8090
    }
}
```

y recargar con `sudo systemctl reload caddy`. Esto es opcional — no es
el patrón que usan los demás proyectos (todos quedan en su puerto propio
sin pasar por Caddy).

## 6. Checklist final

- [ ] `server.py` corriendo y respondiendo en `http://192.168.1.71:8090`
- [ ] línea `@reboot` agregada al crontab de `hpp`
- [ ] entrada agregada en `tablero/projects.json`
- [ ] aparece "online" en el panel del tablero (`https://192.168.1.71/`)
