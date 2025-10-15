docker-compose up -d --build
curl http://localhost/healthz && curl http://localhost/api/healthz
