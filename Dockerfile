# Multi-arch lightweight container (zero pip dependencies)
FROM python:3.12-slim

LABEL org.opencontainers.image.title="Antigravity Telemetry Dashboard" \
      org.opencontainers.image.version="1.1.1" \
      org.opencontainers.image.description="Local usage, prompt cache hit rate, TTFT, and TPS analytics for Google Antigravity"

ENV TELEMETRY_HOST=0.0.0.0 \
    TELEMETRY_PORT=8765 \
    TELEMETRY_SECONDARY_PORT=0 \
    GEMINI_HOME=/data/gemini \
    ANTIGRAVITY_CACHE_FILE=/cache/antigravity_stats_cache.json \
    PYTHONIOENCODING=utf-8 \
    PYTHONUNBUFFERED=1 \
    TZ=Asia/Shanghai

WORKDIR /app

COPY plugin/cache-monitor/server/ /app/

RUN mkdir -p /cache /data/gemini && \
    chmod -R a+rX /app && \
    chmod 1777 /cache && \
    useradd -u 1000 -m -s /usr/sbin/nologin appuser

USER 1000:1000

EXPOSE 8765

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD python3 -c "import os, urllib.request; p = os.environ.get('TELEMETRY_PORT', '8765'); urllib.request.urlopen(f'http://127.0.0.1:{p}/api/health', timeout=3)"

CMD ["python3", "/app/server.py"]
