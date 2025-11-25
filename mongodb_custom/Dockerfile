FROM mongo:8.2

COPY docker-entrypoint.sh /usr/local/bin/entrypoint-wrapper.sh

RUN chmod +x /usr/local/bin/entrypoint-wrapper.sh

ENTRYPOINT ["entrypoint-wrapper.sh"]

CMD ["mongod"]
